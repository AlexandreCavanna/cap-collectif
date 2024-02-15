@consultation @versions
Feature: Opinion Versions

@database
Scenario: Author of a version wants to delete it
  Given I am logged in as user
  And I go to a version
  And I wait ".loader" to disappear on current page
  When I click the delete version button
  And I wait "#confirm-opinion-delete" to appear on current page maximum 15
  And I confirm version deletion
  Then I go to "projects/projet-de-loi-renseignement/consultation/elaboration-de-la-loi/opinions/chapitre-ier-economie-de-la-donnee/section-1-ouverture-des-donnees-publiques/article-1/versions/modification-1"
  And I should see "error.404.title"
  
@security
Scenario: Non author of a version wants to delete it
  Given I am logged in as admin
  And I go to a version
  Then I should not see the delete version button

@security
Scenario: Anonymous wants to delete a version
  Given I go to a version
  Then I should not see the delete version button

Scenario: Anonymous user wants to see all votes of a version
  Given I go to an opinion version with loads of votes
  When I click the show all opinion version votes button
  Then I should see all opinion version votes

@database
Scenario: Non author wants to report a version
  Given I am logged in as admin
  And feature "reporting" is enabled
  And I go to a version
  When I click the reporting opinion version button
  And I fill the reporting form
  And I submit the reporting form
  Then I should see "alert.success.report.proposal" in the ".toasts-container--top div" element
  And I should see "global.report.reported"
  And The element "[id='report-opinion-VmVyc2lvbjp2ZXJzaW9uMQ==-button']" should be disabled

@database
Scenario: Author of a version wants to edit it
  Given I am logged in as admin
  And I go to an editable version
  When I click the edit version button
  And I fill the edit version form
  Then I check the checkbox to confirm version
  And I click on button "[id='opinion-version-edit-update']"
  Then I should see "Updated title" within 4 seconds
  Then I should see "Updated body"
  Then I should see "Updated comment"
