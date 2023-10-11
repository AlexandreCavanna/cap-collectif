@proposalVotes @remove
Feature: mutation removeProposalVote

@security
Scenario: Logged in API client wants to remove a vote but has not voted
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveProposalVoteInput!) {
      removeProposalVote(input: $input) {
        previousVoteId
      }
    }",
    "variables": {
      "input": {
        "stepId": "U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMQ==",
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWwy"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "errors": [
      {
        "message": "You have not voted for this proposal in this step.",
        "@*@": "@*@"
      }
    ],
    "data": {
      "removeProposalVote": null
    }
  }
  """

@security
Scenario: Logged in API client wants to remove a vote but has not voted
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveProposalVoteInput!) {
      removeProposalVote(input: $input) {
        previousVoteId
      }
    }",
    "variables": {
      "input": {
        "stepId": "U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMw==",
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWwxMQ=="
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "errors": [
      {
        "message": "This step is no longer contributable.",
        "@*@": "@*@"
      }
    ],
    "data": {
      "removeProposalVote": null
    }
  }
  """

@database
Scenario: Logged in API client wants to remove a vote
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveProposalVoteInput!) {
      removeProposalVote(input: $input) {
        previousVoteId
      }
    }",
    "variables": {
      "input": {
        "stepId": "U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwNA==",
        "proposalId": "UHJvcG9zYWw6cHJvcG9zYWw3"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "removeProposalVote": {
        "previousVoteId": "1051"
      }
    }
  }
  """

@database
Scenario: Logged in API client wants to remove a vote for proposal until his votes are not taken into account anymore
  Given I am logged in to graphql as user
  And feature "votes_min" is enabled
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveProposalVoteInput!) {
      removeProposalVote(input: $input) {
        previousVoteId
        areRemainingVotesAccounted
      }
    }",
    "variables": {
      "input": {
        "stepId": "U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25TdGVwRXhwb3J0",
        "proposalId": "UHJvcG9zYWw6c2VsZWN0aW9uRXhwb3J0UHJvcG9zYWxzMTMz"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "removeProposalVote": {
        "previousVoteId": @string@,
        "areRemainingVotesAccounted": true
      }
    }
  }
  """
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveProposalVoteInput!) {
      removeProposalVote(input: $input) {
        previousVoteId
        areRemainingVotesAccounted
      }
    }",
    "variables": {
      "input": {
        "stepId": "U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25TdGVwRXhwb3J0",
        "proposalId": "UHJvcG9zYWw6c2VsZWN0aW9uRXhwb3J0UHJvcG9zYWxzMTM0"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "removeProposalVote": {
        "previousVoteId": @string@,
        "areRemainingVotesAccounted": false
      }
    }
  }
  """
