@deleteEvent @event @delete
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

@database
Scenario: Logged in API client wants delete his event
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteEventInput!) {
      deleteEvent(input: $input) {
        deletedEventId
        event {
          deletedAt
          author {
            ...on User {
              _id
            }
          }
          timeRange {
            startAt
            endAt
          }
          themes {
            id
          }
          projects {
            id
          }
          media {
            id
          }
          review {
            reviewer {
              id
              username
            }
            createdAt
          }
          commentable
          comments(first: 5) {
            totalCount
          }
          googleMapsAddress {
            json
            formatted
          }
          participants(first: 5) {
            totalCount
          }
          translations {
            body
          }
        }
      }
    }",
    "variables": {
      "input": {
        "eventId": "RXZlbnQ6ZXZlbnQx"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
     "data":{
        "deleteEvent":{
           "deletedEventId":"RXZlbnQ6ZXZlbnQx",
           "event":{
              "deletedAt":"@string@.isDateTime()",
              "author":null,
              "timeRange":{
                 "startAt":"2032-03-01 00:00:00",
                 "endAt":null
              },
              "themes":[],
              "projects":[],
              "media":null,
              "review":null,
              "commentable":false,
              "comments":{
                 "totalCount":0
              },
              "googleMapsAddress":null,
              "participants":{
                 "totalCount":0
              },
              "translations": [{"body":""}]
           }
        }
     }
  }
  """

@database
Scenario: Logged in API client wants delete his event
  Given I am logged in to graphql as user
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: DeleteEventInput!) {
      deleteEvent(input: $input) {
        deletedEventId
        event {
          deletedAt
          author {
            ...on User {
              _id
            }
          }
          timeRange {
            startAt
            endAt
          }
          themes {
            id
          }
          projects {
            id
          }
          media {
            id
          }
          review {
            reviewer {
              id
              username
            }
            createdAt
          }
          commentable
          comments(first: 5) {
            totalCount
          }
          googleMapsAddress {
            json
            formatted
          }
          participants(first: 5) {
            totalCount
          }
          translations {
            body
          }
        }
      }
    }",
    "variables": {
      "input": {
        "eventId": "RXZlbnQ6ZXZlbnQx"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
     "data":{
        "deleteEvent":{
           "deletedEventId":"RXZlbnQ6ZXZlbnQx",
           "event":{
              "deletedAt":"@string@.isDateTime()",
              "author":null,
              "timeRange":{
                 "startAt":"2032-03-01 00:00:00",
                 "endAt":null
              },
              "themes":[],
              "projects":[],
              "media":null,
              "review":null,
              "commentable":false,
              "comments":{
                 "totalCount":0
              },
              "googleMapsAddress":null,
              "participants":{
                 "totalCount":0
              },
              "translations": [{"body":""}]
           }
        }
     }
  }
  """
