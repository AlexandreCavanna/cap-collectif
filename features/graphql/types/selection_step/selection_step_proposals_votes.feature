@proposal_comments
Feature: Selection step proposal votes connection

@datanase
Scenario: Admin wants to get votes for a proposal in a selection step
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "query ($selectionStepId: ID!, $count: Int, $orderBy: ProposalVotesOrder) {
      selectionStep: node(id: $selectionStepId) {
          id
          ... on SelectionStep {
              proposals(first: $count) {
                  totalCount
                  edges {
                      node {
                          id
                          votes(first: $count, stepId: $selectionStepId, orderBy: $orderBy) {
                              totalCount
                              edges {
                                node {
                                    id
                                }
                              }
                          }
                      }
                  }
              }
          }
      }
    }",
    "variables": {
      "selectionStepId": "selectionstep1",
      "count": 3
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
        "selectionStep": {
            "id": "selectionstep1",
            "proposals": {
                "totalCount": 3,
                "edges": [
                    {
                        "node": {
                            "id": @string@,
                            "votes": {
                                "totalCount": @integer@,
                                "edges": [
                                    {
                                        "node": {
                                            "id": @string@
                                        }
                                    },
                                    @...@
                                ]
                            }
                        }
                    },
                    @...@
                ]
            }
        }
    }
  }
  """
