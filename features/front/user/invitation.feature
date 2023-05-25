@core @invitation
Feature: User invitation

Background:
  Given features "registration", "user_type", "zipcode_at_register", "captcha", "turnstile_captcha" are enabled
  Given I disable features "login_facebook", "login_saml", "login_cas", "login_openid", "login_franceconnect"

@database
Scenario: An expired invitation should redirect to homepage
  When I go to "/invitation?token=sorryiamtheexpiredtoken"
  Then I should be redirected to "/"
  And I should see "user-invitation-expired"

@database
Scenario: A user which has been invited should be able to register
  When I visited "invitation page" with:
    | token | oniiiichaaan |
  And I wait "#registration-form-responses0" to appear on current page
  And I fill in the following:
    | username             | RemChanDaiSki             |
    | password             | RemChanDaiSki93160   |
    | zipcode              | 93160                |
    | responses[0].value   | plop                 |
  And I select "Citoyen" from "user_type"
  And I select "Sangohan" from react "#registration-form-responses2"
  And I scroll to element "#confirm-register"
  And I check element "charte"
  And should see an "#turnstile_captcha" element
  And I press "confirm-register"
  And I wait ".flash-notif" to appear on current page
  Then I should see "alert.success.add.user"
  And I should be redirected to "/"
  Then I can see I am logged in as "RemChanDaiSki"

@database
Scenario: A user which has been invited should be able to register even with shield mode
  Given feature "shield_mode" is enabled
  When I visited "invitation page" with:
    | token | oniiiichaaan |
  And I wait "#registration-form-responses0" to appear on current page
  And I fill in the following:
    | username             | RemChanDaiSki             |
    | password             | RemChanDaiSki93160   |
    | zipcode              | 93160                |
    | responses[0].value   | plop                 |
  And I select "Citoyen" from "user_type"
  And I select "Sangohan" from react "#registration-form-responses2"
  And I scroll to element "#confirm-register"
  And I check element "charte"
  And should see an "#turnstile_captcha" element
  And I press "confirm-register"
  And I wait ".flash-notif" to appear on current page
  Then I should see "alert.success.add.user"
  And I should be redirected to "/"
  Then I can see I am logged in as "RemChanDaiSki"

@database
Scenario: A user which has been invited should be able to register even when registration is disabled
  Given I disable feature "registration"
  When I visited "invitation page" with:
    | token | oniiiichaaan |
  And I wait "#registration-form-responses0" to appear on current page
  And I fill in the following:
    | username             | RemChanDaiSki             |
    | password             | RemChanDaiSki93160   |
    | zipcode              | 93160                |
    | responses[0].value   | plop                 |
  And I select "Citoyen" from "user_type"
  And I select "Sangohan" from react "#registration-form-responses2"
  And I scroll to element "#confirm-register"
  And I check element "charte"
  And should see an "#turnstile_captcha" element
  And I press "confirm-register"
  And I wait ".flash-notif" to appear on current page
  Then I should see "alert.success.add.user"
  And I should be redirected to "/"
  Then I can see I am logged in as "RemChanDaiSki"
