@createOauth2SSOConfiguration @admin
Feature: Create Oauth2 SSO Configuration

@database
Scenario: Admin wants to create an Oauth2 SSO configuration
  Given I am logged in to graphql as super admin
  And I send a GraphQL POST request:
   """
   {
    "query": "mutation ($input: CreateOauth2SSOConfigurationInput!) {
      createOauth2SSOConfiguration(input: $input) {
        ssoConfiguration {
          id
          name
          enabled
          disconnectSsoOnLogout
          clientId
          secret
          authorizationUrl
          accessTokenUrl
          userInfoUrl
          logoutUrl
          profileUrl
        }
      }
    }",
    "variables": {
      "input": {
        "name": "Test SSO",
        "enabled": true,
        "disconnectSsoOnLogout": true,
        "clientId": "test",
        "secret": "test",
        "authorizationUrl": "https://test.dev/auth",
        "accessTokenUrl": "https://test.dev/token",
        "userInfoUrl": "https://test.dev/userinfo",
        "logoutUrl": "https://test.dev/logout",
        "profileUrl": "https://test.dev/account"
      }
    }
  }
  """
  Then the JSON response should match:
  """
  {
    "data": {
      "createOauth2SSOConfiguration": {
        "ssoConfiguration": {
          "id": @string@,
          "name": "Test SSO",
          "enabled": true,
          "disconnectSsoOnLogout": true,
          "clientId": "test",
          "secret": "test",
          "authorizationUrl": "https://test.dev/auth",
          "accessTokenUrl": "https://test.dev/token",
          "userInfoUrl": "https://test.dev/userinfo",
          "logoutUrl": "https://test.dev/logout",
          "profileUrl": "https://test.dev/account"
         }
       }
     }
  }
  """
