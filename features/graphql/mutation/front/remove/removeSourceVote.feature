@removeSourceVote @remove
Feature: mutation removeSourceVote

@database
Scenario: Logged in API client wants to vote for a comment
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveSourceVoteInput!) {
      removeSourceVote(input: $input) {
        deletedVoteId
      }
    }",
    "variables": {
      "input": {
        "sourceId": "U291cmNlOnNvdXJjZTQz"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {"data":{"removeSourceVote":{"deletedVoteId":"60003"}}}
  """

@database
Scenario: Logged in API client wants to vote for a comment without requirement
  Given I am logged in to graphql as jean
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: RemoveSourceVoteInput!) {
      removeSourceVote(input: $input) {
        deletedVoteId
      }
    }",
    "variables": {
      "input": {
        "sourceId": "U291cmNlOnNvdXJjZTQz"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {"errors":[{"message":"You dont meets all the requirements.","@*@": "@*@"}],"data":{"removeSourceVote":null}}
  """
