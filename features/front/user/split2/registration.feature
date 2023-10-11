@core @registration
Feature: Registration

@database
Scenario: Anonymous wants to register with user type and zipcode
  Given features "registration", "user_type", "zipcode_at_register", "captcha", "turnstile_captcha" are enabled
  And I visited "home page"
  When I press "global.registration"
  And I wait "#username" to appear on current page
  And I fill in the following:
  | username             | Naruto42             |
  | email                | naruto42@gmail.com   |
  | password             | narutoisThebest91    |
  | zipcode              | 94123                |
  | responses[0].value   | plop                 |
  And I select "Citoyen" from "user_type"
  And I select "Sangohan" from react "#registration-form-responses2"
  And I check element "charte"
  And should see an "div[id^=turnstile_captcha-]" element
  And I press "global.register"
  Then I wait 6 seconds
  Then I can see I am logged in as "Naruto42"

@database
Scenario: Anonymous wants to register
  Given feature "registration" is enabled
  And I visited "home page"
  When I press "global.registration"
  And I wait "#username" to appear on current page
  And I fill in the following:
  | username             | Naruto42             |
  | email                | naruto42@gmail.com   |
  | password             | narutoisThebest91    |
  And I wait "#registration-form-responses0" to appear on current page
  And I fill in the following:
  | responses[0].value   | plop                 |
  And I select "Sangohan" from react "#registration-form-responses2"
  And I check element "charte"
  And I press "global.register"
  And I wait "#alert-email-not-confirmed" to appear on current page
  Then I can see I am logged in as "Naruto42"
  And I open mail with subject "email-subject-registration-confirmation"
  And I should see "user.register.confirmation_message.validate" in mail

@security
Scenario: Anonymous wants to register with every possible errors
  Given features "registration", "user_type", "zipcode_at_register" are enabled
  And I visited "home page"
  When I press "global.registration"
  And I wait "#username" to appear on current page
  And I fill in the following:
  | username             | p                    |
  | email                | poupouil.com         |
  | password             | azerty               |
  | zipcode              | 94                   |
  And I press "global.register"
  Then I should see "registration.constraints.username.min"
  And I should see "global.constraints.email.invalid"
  And I should see "at-least-8-characters-one-digit-one-uppercase-one-lowercase"

@database
Scenario: Anonymous wants to register with the consent of external communication
  Given feature "registration" is enabled
  Given feature "consent_external_communication" is enabled
  And I visited "home page"
  When I press "global.registration"
  And I wait "#username" to appear on current page
  And I fill in the following:
  | username             | Naruto42             |
  | email                | naruto42@gmail.com   |
  | password             | narutoisThebest91    |
  | responses[0].value   | plop                 |
  And I select "Sangohan" from react "#registration-form-responses2"
  And I check element "charte"
  And I check element "consentExternalCommunication"
  And I press "global.register"
  Then I can see I am logged in as "Naruto42"

@database
Scenario: Anonymous wants to register with the consent of internal communication
  Given feature "registration" is enabled
  Given feature "consent_internal_communication" is enabled
  And I visited "home page"
  When I press "global.registration"
  And I wait "#username" to appear on current page
  And I fill in the following:
  | username             | Naruto42             |
  | email                | naruto42@gmail.com   |
  | password             | narutoisThebest91    |
  | responses[0].value   | plop                 |
  And I select "Sangohan" from react "#registration-form-responses2"
  And I check element "charte"
  And I check element "consentInternalCommunication"
  And I press "global.register"
  Then I wait 6 seconds
  Then I can see I am logged in as "Naruto42"
