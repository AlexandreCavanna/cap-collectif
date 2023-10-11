@project @admin
Feature: createProject

@database
Scenario: GraphQL client wants to create a project
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
    {
      "query": "mutation ($input: CreateProjectInput!) {
        createProject(input: $input) {
          project {
            title
            authors {
              id
              username
              email
              createdAt
            }
            visibility
            locale {
              code
            }
          }
        }
      }",
      "variables": {
        "input": {
          "title": "thisisnotatest",
          "authors": ["VXNlcjp1c2VyQWRtaW4=", "VXNlcjp1c2VyMQ=="],
          "projectType": "2"
        }
      }
    }
  """
  Then the JSON response should match:
  """
    {
      "data":{
        "createProject":{
          "project":{
            "title": "thisisnotatest",
            "authors":[
              {"id":"VXNlcjp1c2VyMQ==","username":"lbrunet", "createdAt":"2015-01-01 00:00:00", "email":"lbrunet@cap-collectif.com"},
              {"id":"VXNlcjp1c2VyQWRtaW4=","username":"admin","createdAt":"2015-01-04 00:00:00","email":"admin@test.com"}
            ],
            "visibility":"ADMIN",
            "locale": null
          }
        }
      }
    }
  """

@database
Scenario: GraphQL client wants to create a project without type
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
    {
      "query": "mutation ($input: CreateProjectInput!) {
        createProject(input: $input) {
          project {
            title
            authors {
              id
              username
              email
              createdAt
            }
            type {
              title
            }
          }
        }
      }",
      "variables": {
        "input": {
          "title": "thisisnotatest",
          "authors": ["VXNlcjp1c2VyQWRtaW4=", "VXNlcjp1c2VyMQ=="]
        }
      }
    }
  """
  Then the JSON response should match:
  """
    {
      "data":{
        "createProject":{
          "project":{
            "title": "thisisnotatest",
            "authors":[
              {"id":"VXNlcjp1c2VyMQ==","username":"lbrunet", "createdAt":"2015-01-01 00:00:00", "email":"lbrunet@cap-collectif.com"},
              {"id":"VXNlcjp1c2VyQWRtaW4=","username":"admin","createdAt":"2015-01-04 00:00:00","email":"admin@test.com"}
            ],
            "type": null
          }
        }
      }
    }
  """

@database
Scenario: GraphQL client wants to create a project without authors
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
    {
      "query": "mutation ($input: CreateProjectInput!) {
        createProject(input: $input) {
          project {
            title
            authors {
              id
              username
              email
            }
            type {
              title
            }
          }
        }
      }",
      "variables": {
        "input": {
          "title": "thisisnotatest",
          "authors": []
        }
      }
    }
  """
  Then the JSON response should match:
  """
    {"errors":[{"message":"You must specify at least one author.","@*@": "@*@"}],"data":{"createProject":null}}
  """

@database
Scenario: GraphQL client wants to create a project in english
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
    {
      "query": "mutation ($input: CreateProjectInput!) {
        createProject(input: $input) {
          project {
            title
            authors {
              id
              username
              email
              createdAt
            }
            visibility
            locale {
              code
            }
          }
        }
      }",
      "variables": {
        "input": {
          "title": "thisisnotatest",
          "authors": ["VXNlcjp1c2VyQWRtaW4=", "VXNlcjp1c2VyMQ=="],
          "projectType": "2",
          "locale": "locale-en-GB"
        }
      }
    }
  """
  Then the JSON response should match:
  """
    {
      "data":{
        "createProject":{
          "project":{
            "title": "thisisnotatest",
            "authors":[
              {"id":"VXNlcjp1c2VyMQ==","username":"lbrunet", "createdAt":"2015-01-01 00:00:00", "email":"lbrunet@cap-collectif.com"},
              {"id":"VXNlcjp1c2VyQWRtaW4=","username":"admin","createdAt":"2015-01-04 00:00:00","email":"admin@test.com"}
            ],
            "visibility":"ADMIN",
            "locale": {
              "code": "EN_GB"
            }
          }
        }
      }
    }
  """
