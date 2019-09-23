@opinions
Feature: Opinion

Scenario: Get contributions ordered by votes desc but with one pinned
  When I send a GraphQL request:
  """
  {
    section: node(id: "opinionType6") {
      ... on Section {
        contributionConnection(orderBy: {field: VOTE_COUNT, direction: DESC}){
          totalCount
          edges {
            node {
              ... on Opinion {
                id
                publishedAt
                pinned
                title
                position
                arguments{
                  totalCount
                }
                votes {
                  totalCount
                }
                author{
                  id
                }
              }
            }
          }
        }
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "section": {
        "contributionConnection": {
          "totalCount": 8,
          "edges": [
            {
              "node": {
                "id": "opinion61",
                "publishedAt": "2018-03-01 12:00:00",
                "pinned": true,
                "title": "Lié à article et épinglé",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            },
            {
              "node": {
                "id": "opinion69",
                "publishedAt": "2018-04-01 01:09:00",
                "pinned": false,
                "title": "Opinion d hier 69",
                "position": 1,
                "arguments": {
                  "totalCount": 38
                },
                "votes": {
                  "totalCount": 29
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion60",
                "publishedAt": "2018-03-01 11:00:00",
                "pinned": false,
                "title": "Article",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            },
            {
              "node": {
                "id": "opinion68",
                "publishedAt": "2018-04-01 01:08:00",
                "pinned": false,
                "title": "Opinion d hier 68",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion70",
                "publishedAt": "2018-04-01 01:10:00",
                "pinned": false,
                "title": "Opinion d hier 70",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion71",
                "publishedAt": "2018-04-01 01:11:00",
                "pinned": false,
                "title": "Opinion d hier 71",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion72",
                "publishedAt": "2018-04-01 01:12:00",
                "pinned": false,
                "title": "Opinion d hier 72",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion73",
                "publishedAt": "2018-04-01 01:13:00",
                "pinned": false,
                "title": "Opinion d hier 73",
                "position": 1,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            }
          ]
        }
      }
    }
  }
  """

Scenario: Get contributions ordered by votes desc
  When I send a GraphQL request:
  """
{
    section: node(id: "opinionType5") {
      ... on Section {
        contributionConnection(first: 3, orderBy: {field: VOTE_COUNT, direction: DESC}){
          totalCount
          edges {
            node {
              ... on Opinion {
                id
                publishedAt
                pinned
                title
              	position
                arguments{
                  totalCount
                }
                votes {
                  totalCount
                }
                author{
                  id
                }
              }
            }
          }
        }
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "section": {
        "contributionConnection": {
          "totalCount": 3,
          "edges": [
            {
              "node": {
                "id": "opinion59",
                "publishedAt": "2018-03-01 10:00:00",
                "pinned": false,
                "title": "Article 2",
                "position": 2,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 46
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            },
            {
              "node": {
                "id": "opinion57",
                "publishedAt": "2018-03-01 07:00:00",
                "pinned": false,
                "title": "Article 1",
                "position": 1,
                "arguments": {
                  "totalCount": 4
                },
                "votes": {
                  "totalCount": 4
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            },
            {
              "node": {
                "id": "opinion58",
                "publishedAt": "2018-03-01 08:00:00",
                "pinned": false,
                "title": "Article 3",
                "position": 3,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            }
          ]
        }
      }
    }
  }
  """

Scenario: Get contributions ordered by position desc
  When I send a GraphQL request:
  """
  {
    section: node(id: "opinionType5") {
      ... on Section {
        contributionConnection(orderBy: {field: POSITION, direction: DESC}){
          totalCount
          edges {
            node {
              ... on Opinion {
                id
                publishedAt
                pinned
                title
              	position
                arguments{
                  totalCount
                }
                votes {
                  totalCount
                }
                author{
                  id
                }
              }
            }
          }
        }
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "section": {
        "contributionConnection": {
          "totalCount": 3,
          "edges": [
            {
              "node": {
                "id": "opinion58",
                "publishedAt": "2018-03-01 08:00:00",
                "pinned": false,
                "title": "Article 3",
                "position": 3,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 0
                },
                "author": {
                  "id": "VXNlcjp1c2VyNQ=="
                }
              }
            },
            {
              "node": {
                "id": "opinion59",
                "publishedAt": "2018-03-01 10:00:00",
                "pinned": false,
                "title": "Article 2",
                "position": 2,
                "arguments": {
                  "totalCount": 0
                },
                "votes": {
                  "totalCount": 46
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            },
            {
              "node": {
                "id": "opinion57",
                "publishedAt": "2018-03-01 07:00:00",
                "pinned": false,
                "title": "Article 1",
                "position": 1,
                "arguments": {
                  "totalCount": 4
                },
                "votes": {
                  "totalCount": 4
                },
                "author": {
                  "id": "VXNlcjp1c2VyMg=="
                }
              }
            }
          ]
        }
      }
    }
  }
  """
