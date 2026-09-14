Feature: Podcasts Base - Authoring a podcast episode
      As a Content editor
      I want to create a podcast episode with its fields
      So that the episode page presents the episode to listeners.

  @check @local @development @staging @production
  Scenario: A Content editor creates a podcast episode and its page shows the episode
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example Authoring Episode 74501"
      And I fill in "Summary" with "Short summary for the authoring test episode 74501."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I fill in "Duration" with "44 Mins"
      And I fill in "Episode number" with "74501"
      And I save the podcast episode
     Then I should see "Varbase Example Authoring Episode 74501"
      And I should see "44 Mins"
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"
