@core @blog
Feature: Blog

Background:
  Given feature "blog" is enabled

Scenario: Anonymous wants to list published posts
  And I visited "blog page"
  And I wait ".media-list" to appear on current page
  Then I should see 10 ".media--news" elements

Scenario: Posts can be filtered by projects
  And I visited "blog page"
  And I wait ".container" to appear on current page
  And I select "Croissance, innovation, disruption" from "post_search_project"
  Then I should see 5 ".media--news" elements
  And I should see "Post FR 5"
  And I should not see "Post FR 8"

Scenario: Post can be filtered by theme
  And feature "themes" is enabled
  And I visited "blog page"
  And I wait ".media-list" to appear on current page
  And I select "Justice" from "post_search_theme"
  And I wait ".media--news" to appear on current page
  Then I should see 9 ".media--news" elements
  And I should see "Post FR 8"
  And I should not see "Post FR 2"

@database
Scenario: Anonymous wants to comment a blogpost
  And I visited "blog article page" with:
    | articleSlug | post-fr-2 |
  And I wait "[name='body']" to appear on current page
  And I fill in the following:
    | body        | J'ai un truc à dire |
    | authorName  | Naruto              |
    | authorEmail | naruto72@gmail.com  |
  When I press "comment.submit"
  Then I should see "comment.submit_success" before 2 seconds in the "#global-alert-box" element
  Then I should see "J'ai un truc à dire" before 2 seconds in the ".comments__section" element

@database
Scenario: Anonymous wants to comment a blogpost with moderation enabled
  And feature moderation_comment is enabled
  And I visited "blog article page" with:
    | articleSlug | post-fr-2 |
  And I wait "[name='body']" to appear on current page
  And I fill in the following:
    | body        | J'ai un truc à dire |
    | authorName  | Naruto              |
    | authorEmail | naruto72@gmail.com  |
  When I press "comment.submit"
  Then I should see "confirm-email-address" before 2 seconds in the "#global-alert-box" element

@database
Scenario: Logged in user wants to comment a blogpost
  And I am logged in as user
  And I visited "blog article page" with:
    | articleSlug | post-fr-2 |
  And I wait "[name='body']" to appear on current page
  And I fill in the following:
    | body        | J'ai un truc à dire |
  And I should not see "comment.with_my_account"
  And I should not see "comment.without_account"
  When I press "comment.submit"
  Then I should see "comment.submit_success" before 2 seconds in the "#global-alert-box" element
  Then I should see "J'ai un truc à dire" before 2 seconds in the ".comments__section" element
