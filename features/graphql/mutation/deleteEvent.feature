@deleteEvent @event
Feature: mutation deleteEvent

@database
Scenario: Logged in API client wants delete his event
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteEventInput!) {
      deleteEvent(input: $input) {
        deletedEventId
      }
    }",
    "variables": {
      "input": {
        "eventId": "RXZlbnQ6ZXZlbmVtZW50RnV0dXJlU2Fuc0RhdGVEZUZpbg=="
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {"data":{"deleteEvent":{"deletedEventId":"RXZlbnQ6ZXZlbmVtZW50RnV0dXJlU2Fuc0RhdGVEZUZpbg=="}}}
  """