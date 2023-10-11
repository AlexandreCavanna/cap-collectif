@deleteVersion @delete
Feature: Delete a version

@database
Scenario: Author wants to delete his version
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
    {
        "query": "mutation ($input: DeleteVersionInput!) {
            deleteVersion(input: $input) {
                deletedVersionId
                opinion {
                    id
                }
            }
        }",
        "variables": {
            "input": {
                "versionId": "VmVyc2lvbjp2ZXJzaW9uMQ=="
            }
        }
    }
  """
  Then the JSON response should match:
  """
    {
        "data": {
            "deleteVersion": {
                "deletedVersionId": "VmVyc2lvbjp2ZXJzaW9uMQ==",
                "opinion": {
                    "id": "T3BpbmlvbjpvcGluaW9uNTc="
                }
            }
        }
    }
  """

@security
Scenario: User wants to delete a version but is not the author
  Given I am logged in to graphql as pierre
  And I send a GraphQL POST request:
  """
    {
        "query": "mutation ($input: DeleteVersionInput!) {
            deleteVersion(input: $input) {
                deletedVersionId
                opinion {
                    id
                }
            }
        }",
        "variables": {
            "input": {
                "versionId": "VmVyc2lvbjp2ZXJzaW9uMQ=="
            }
        }
    }
  """
  Then the JSON response should match:
  """
    {"errors":[{"message":"You are not the author of version with id: version1","@*@": "@*@"}],"data":{"deleteVersion":null}}
  """
