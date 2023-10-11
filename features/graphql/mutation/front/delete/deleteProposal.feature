@deleteProposal @delete
Feature: Delete proposal

@security
Scenario: Anonymous GraphQL client can not delete a proposal
  Given I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteProposalInput!) {
      deleteProposal(input: $input) {
        proposal {
          id
        }
      }
    }",
    "variables": {
      "input": {
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWwx2"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "errors": [
      {"message":"Access denied to this field.","@*@": "@*@"}
    ],
    "data": {
      "deleteProposal": null
    }
  }
  """

@database @rabbitmq
Scenario: User GraphQL client can delete his proposal
  Given features themes, districts are enabled
  And I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteProposalInput!) {
      deleteProposal(input: $input) {
        proposal {
          id
          deletedAt
        }
      }
    }",
    "variables": {
      "input": {
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWwxMg=="
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "deleteProposal": {
        "proposal": {
          "id": "UHJvcG9zYWw6cHJvcG9zYWwxMg==",
          "deletedAt": "@string@.isDateTime()"
        }
      }
    }
  }
  """
  And the queue associated to "proposal_delete" producer has messages below:
  | 0 | {"proposalId": "proposal12"} |

@database @rabbitmq
Scenario: The rabbitmq message contains id of supervisor and decisionMaker on delete
  Given feature "unstable__analysis" is enabled
  And I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteProposalInput!) {
      deleteProposal(input: $input) {
        proposal {
          id
          deletedAt
        }
      }
    }",
    "variables": {
      "input": {
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWwxMTA="
      }
    }
  }
  """
  Then the queue associated to "proposal_delete" producer has messages below:
    | 0 | {"proposalId": "proposal110", "supervisorId": "userSupervisor", "decisionMakerId": "userDecisionMaker"} |

@database
Scenario: GraphQL client wants delete a proposal
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteProposalInput!) {
      deleteProposal(input: $input) {
        proposal {
          publicationStatus
        }
      }
    }",
    "variables": {
      "input": {
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWw4"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
      "data": {
        "deleteProposal": {
          "proposal": {
            "publicationStatus": "DELETED"
          }
        }
      }
  }
  """
