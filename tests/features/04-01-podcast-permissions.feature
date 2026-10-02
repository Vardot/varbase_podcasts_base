@podcasts @permissions
Feature: Podcasts Base - Podcast and Podcast episode permissions
      As a site administrator
      I want podcast and episode authoring restricted to editorial roles
      So that only trusted users can publish to the podcast.

  @regression @local @development @staging @production
  Scenario: An anonymous user cannot create a podcast or an episode but can read a published one
    Given I am an anonymous user
     Then I should be denied access to "/node/add/podcast_episode"
      And I should be denied access to "/node/add/podcast"
      And I should be allowed "/podcasts/varbase-example-podcast-one/varbase-example-episode-02"
      And the page title should contain "Varbase Example Episode 02 | "

  @regression @local @development @staging @production
  Scenario: A Normal user cannot create a podcast or an episode but can read a published one
    Given I am a logged in user with the "Normal user" user
     Then I should be denied access to "/node/add/podcast_episode"
      And I should be denied access to "/node/add/podcast"
      And I should be allowed "/podcasts/varbase-example-podcast-one/varbase-example-episode-02"

  @regression @local @development @staging @production
  Scenario Outline: Editorial roles can reach the Podcast and Podcast episode creation forms
    Given I am a logged in user with the "<role>" user
     When I go to "/node/add/podcast_episode"
     Then the page title should contain "Create Podcast episode"
      And I see visible podcast title field
     When I go to "/node/add/podcast"
     Then the page title should contain "Create Podcast"
      And I see visible podcast title field

    Examples:
      | role           |
      | Content editor |
      | Content admin  |
      | SEO admin      |
      | Site admin     |
      | webmaster      |

  @regression @local @development @staging
  Scenario: A Content editor can create, edit and delete an episode
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast_episode"
      And I assign the episode to the "Varbase Example Podcast One" podcast
      And I fill in "Title" with "Varbase Example Permission Episode 74506"
      And I fill in "Summary" with "Summary for the permission test episode 74506."
      And I add the first available cover art from the media library
      And I save the podcast episode
     Then the page title should contain "Varbase Example Permission Episode 74506 | "
     When I open the edit form for the podcast episode I am viewing
      And I fill in "Summary" with "Summary for the permission test episode 74506, updated."
      And I save the podcast episode
     Then I should see "Summary for the permission test episode 74506, updated."
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"
