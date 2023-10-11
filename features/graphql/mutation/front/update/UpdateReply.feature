@updateReply @reply @update
Feature: Update Reply

@database
Scenario: Author wants to update his reply
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
   {
    "query": "mutation ($input: UpdateUserReplyInput!) {
      updateUserReply(input: $input) {
        reply {
          id
          published
          responses {
            question {
              id
            }
            ... on ValueResponse {
              value
            }
          }
        }
      }
    }",
    "variables": {
      "input": {
        "replyId": "UmVwbHk6cmVwbHky",
        "draft": false,
        "responses": [
            {
              "question": "UXVlc3Rpb246Mg==",
              "value": "Je pense que c'est la ville parfaite pour organiser les JO"
            },
            {
              "question": "UXVlc3Rpb246MTM=",
              "value": "{\"labels\":[\"Athlétisme\",\"Sports collectifs\"],\"other\":\"Embêter Maxime\"}"
            }
        ]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "updateUserReply": {
        "reply": {
          "id": "UmVwbHk6cmVwbHky",
          "published": true,
          "responses": [
            {
              "question": {
                "id": "UXVlc3Rpb246Mg=="
              },
              "value": "Je pense que c'est la ville parfaite pour organiser les JO"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTM="
              },
              "value": "{\"labels\":[\"Athlétisme\",\"Sports collectifs\"],\"other\":\"Embêter Maxime\"}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MjA="
              },
              "value": "{\"labels\":[\"Au top\"],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTQ="
              },
              "value": "{\"labels\":[\"Maxime Arrouard\"],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTU="
              },
              "value": "Assez fort (Mon sonotone est mal réglé)"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTY="
              },
              "value": "{\"labels\":[],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTg="
              },
              "value": "{\"labels\":[\"Logo 1\"],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTk="
              },
              "value": "{\"labels\":[\"Il bluffe\"],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTk="
              },
              "value": "{\"labels\":[\"Il bluffe\"],\"other\":null}"
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MzAx"
              },
              "value": null
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MzAy"
              },
              "value": null
            },
            {
              "question": {
                "id": "UXVlc3Rpb246MTM4NQ=="
              },
              "value": "0"
            },
            {
              "question":{
                "id":"UXVlc3Rpb246Mzk0NA=="
              },
              "value":"{\"labels\":[\"Sans profession\"],\"other\":null}"
            }
          ]
        }
      }
    }
  }
  """

@database
Scenario: User wants to published a reply in draft
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
   """
   {
    "query": "mutation ($input: UpdateUserReplyInput!) {
      updateUserReply(input: $input) {
        reply {
          id
          published
          draft
          responses {
            question {
              id
            }
            ... on ValueResponse {
              value
            }
          }
        }
      }
    }",
    "variables": {
      "input": {
        "replyId": "UmVwbHk6cmVwbHk5",
        "draft": false,
        "responses": [
            {
              "question": "UXVlc3Rpb246Mg==",
              "value": "Je pense que c'est la ville parfaite pour organiser les JO"
            },
            {
              "question": "UXVlc3Rpb246MTM=",
              "value": "{\"labels\":[\"Athlétisme\",\"Sports collectifs\"],\"other\":\"Embêter Maxime\"}"
            }
        ]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
   "data":{
      "updateUserReply":{
         "reply":{
            "id":"UmVwbHk6cmVwbHk5",
            "published":true,
            "draft":false,
            "responses":[
               {
                  "question":{
                     "id":"UXVlc3Rpb246Mg=="
                  },
                  "value":"Je pense que c\u0027est la ville parfaite pour organiser les JO"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTM="
                  },
                  "value":"{\u0022labels\u0022:[\u0022Athl\u00e9tisme\u0022,\u0022Sports collectifs\u0022],\u0022other\u0022:\u0022Emb\u00eater Maxime\u0022}"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTQ="
                  },
                  "value":"{\u0022labels\u0022:[],\u0022other\u0022:null}"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTU="
                  },
                  "value":null
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTY="
                  },
                  "value":"{\u0022labels\u0022:[],\u0022other\u0022:null}"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTg="
                  },
                  "value":"{\u0022labels\u0022:[],\u0022other\u0022:null}"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTk="
                  },
                  "value":"{\u0022labels\u0022:[],\u0022other\u0022:null}"
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MzAx"
                  },
                  "value":null
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MzAy"
                  },
                  "value":null
               },
               {
                  "question":{
                     "id":"UXVlc3Rpb246MTM4NQ=="
                  },
                  "value":null
               },
               {
                  "question":{
                    "id":"UXVlc3Rpb246Mzk0NA=="
                  },
                  "value":"{\u0022labels\u0022:[],\u0022other\u0022:null}"
               }
            ]
         }
      }
   }
  }
  """
