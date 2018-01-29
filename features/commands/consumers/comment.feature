@consumers
Feature: Comment consumers

@rabbitmq
Scenario: Email should be sent to admin if a message is sent to the comment_create queue
  Given I publish in "comment_create" with message below:
  """
  {
    "commentId": 154
  }
  """
  And I consume "comment_create"
  Then I open mail with subject "notification.email.comment.create.subject"
  And I should see "notification.email.comment.create.body" in mail

@rabbitmq
Scenario: Email should be sent to admin if a message is sent to the comment_update queue
  Given I publish in "comment_update" with message below:
  """
  {
    "commentId": 154
  }
  """
  And I consume "comment_update"
  Then I open mail with subject "notification.email.comment.update.subject"
  And I should see "notification.email.comment.update.body" in mail

@rabbitmq
Scenario: Email should be sent to admin if a message is sent to the comment_delete queue
  Given I publish in "comment_delete" with message below:
  """
  {
    "username": "Suzanne Favot",
    "notifying": true,
    "notifyTo": "admin",
    "userSlug": "sfavot",
    "body": "Expedita in et voluptatum repudiandae consequatur atque est. Deleniti delectus dicta omnis quis voluptate. Maiores qui nihil sit laboriosam accusantium.",
    "proposal": "Ravalement de la façade de la bibliothèque municipale",
    "projectSlug": "budget-participatif-rennes",
    "stepSlug": "collecte-des-propositions",
    "proposalSlug": "ravalement-de-la-facade-de-la-bibliotheque-municipale"
  }
  """
  And I consume "comment_delete"
  Then I open mail with subject "notification.email.comment.delete.subject"
  And I should see "notification.email.comment.delete.body" in mail
