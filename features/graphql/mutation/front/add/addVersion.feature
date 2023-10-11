@addVersion @add
Feature: Add Version

@database
Scenario: User wants to add a version on an opinion
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
    {
        "query": "mutation ($input: AddVersionInput!) {
            addVersion(input: $input) {
                version {
                    id
                    published
                    author {
                        _id
                    }
                }
                versionEdge {
                    cursor
                    node {
                        id
                    }
                }
            }
        }",
        "variables": {
            "input": {
                "opinionId": "T3BpbmlvbjpvcGluaW9uNTc=",
                "title": "Nouveau titre",
                "body": "Mes modifications blablabla",
                "comment": "Un peu de fun dans ce monde trop sobre !"
            }
        }
    }
  """
  Then the JSON response should match:
  """
    {
        "data": {
            "addVersion": {
                "version": {
                    "id": @string@,
                    "published": true,
                    "author": {
                        "_id": "user5"
                    }
                },
                "versionEdge": {
                    "cursor": @string@,
                    "node": {
                        "id": @string@
                    }
                }
            }
        }
    }
  """

@security
Scenario: User wants to add an argument on an uncontibuable opinion
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
    {
        "query": "mutation ($input: AddVersionInput!) {
            addVersion(input: $input) {
                version {
                    id
                }
                userErrors {
                    message
                }
            }
        }",
        "variables": {
            "input": {
                "opinionId": "T3BpbmlvbjpvcGluaW9uNTY=",
                "title": "Nouveau titre",
                "body": "Mes modifications blablabla",
                "comment": "Un peu de fun dans ce monde trop sobre !"
            }
        }
    }
  """
  Then the JSON response should match:
  """
    {
        "data": {
            "addVersion": {
                "version": null,
                "userErrors": [{"message":"Can\u0027t add a version to an uncontributable opinion."}]
            }
        }
    }
  """
