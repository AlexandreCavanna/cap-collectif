@updateShieldAdminForm @admin
Feature: Update shield admin form

@database
Scenario: GraphQL admin client wants to update configuration of shield mode
  Given I am logged in to graphql as admin
  And I send a GraphQL POST request:
  """
  {
    "query": "{
      shieldAdminForm {
        shieldMode
        introduction
        media {
          id
          name
          url
        }
      }
    }"
  }
  """
  Then the JSON response should match:
  """
  {
    "data":
    {
      "shieldAdminForm":
      {
        "shieldMode": false,
        "introduction": @string@,
        "media":
        {
          "id": "media12",
          "name": "Logo",
          "url": @string@
        }
      }
    }
  }
  """
  And I send a GraphQL POST request:
  """
  {
    "query": "mutation ($input: UpdateShieldAdminFormInput!) {
      updateShieldAdminForm(input: $input) {
        shieldAdminForm {
          shieldMode
          introduction
          translations {
            locale
            introduction
          }
          media {
            id
            name
          }
        }
      }
    }",
    "variables": {
      "input": {
        "mediaId": null,
        "shieldMode": true,
        "translations": [
          {
            "locale": "fr-FR",
            "introduction": "<p>Jean est une belle personne</p>"
          },
          {
            "locale": "en-GB",
            "introduction": "<p>Jean is a great person and he deserve a great wife.</p>"
          }
        ]
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data":
    {
      "updateShieldAdminForm":
      {
        "shieldAdminForm":
        {
          "shieldMode": true,
          "introduction": "<p>Jean est une belle personne</p>",
          "translations": [
            {
              "locale": "fr-FR",
              "introduction": "<p>Jean est une belle personne</p>"
            },
            {
              "locale": "en-GB",
              "introduction": "<p>Jean is a great person and he deserve a great wife.</p>"
            }
          ],
          "media": null
        }
      }
    }
  }
  """
