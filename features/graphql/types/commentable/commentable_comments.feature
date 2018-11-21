@commentable_comments
Feature: Proposal comments connections

Scenario: Anonymous wants to get comments from commentables
  Given I send a GraphQL POST request:
  """
  {
    "query": "query ($proposalId: ID!, $eventId: ID!, $postId: ID!) {
      commentables: nodes(ids: [$proposalId, $eventId, $postId]) {
        ... on Commentable {
          comments(first: 3) {
            edges {
              cursor
              node {
                id
              }
            }
          }
        }
      }
    }",
    "variables": {
      "proposalId": "proposal1",
      "eventId": "event1",
      "postId": "UG9zdDox"
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "commentables": [{
        "comments": {
          "edges": [
            {
              "cursor": @string@,
              "node": {
                "id": @string@
              }
            },
            @...@
          ]
        }
      },
      @...@
      ]
    }
  }
  """