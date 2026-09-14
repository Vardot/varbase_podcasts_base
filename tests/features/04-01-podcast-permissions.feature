Feature: Podcasts Base - Podcast episode permissions
      As a site administrator
      I want episode authoring restricted to editorial roles
      So that only trusted users can publish to the podcast.

  @check @local @development @staging @production
  Scenario: An anonymous user cannot reach the Podcast episode creation form
    Given I am an anonymous user
     When I go to "/node/add/podcast"
      And wait
     Then I should not see "Create Podcast episode"

  @check @local @development @staging @production
  Scenario: A Normal user cannot reach the Podcast episode creation form
    Given I am a logged in user with the "Normal user" user
     When I go to "/node/add/podcast"
      And wait
     Then I should not see "Create Podcast episode"

  @check @local @development @staging @production
  Scenario: An anonymous user can read a published episode
    Given I am an anonymous user
     When I go to "/podcast/varbase-example-episode-02"
      And wait
     Then I should see "Varbase Example Episode 02"

  @check @local @development @staging @production
  Scenario Outline: Editorial roles can reach the Podcast episode creation form
    Given I am a logged in user with the "<role>" user
     When I go to "/node/add/podcast"
      And wait
     Then I should see "Create Podcast episode"

    Examples:
      | role           |
      | Content editor |
      | Content admin  |
      | webmaster      |

  @check @local @development @staging @production
  Scenario: A Content editor can create, edit and delete an episode
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example Permission Episode 74506"
      And I fill in "Summary" with "Summary for the permission test episode 74506."
      And I add the first available cover art from the media library
      And I save the podcast episode
     Then I should see "Varbase Example Permission Episode 74506"
     When I open the edit form for the podcast episode I am viewing
      And I fill in "Summary" with "Summary for the permission test episode 74506 (updated)."
      And I save the podcast episode
     Then I should see "Varbase Example Permission Episode 74506"
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"
