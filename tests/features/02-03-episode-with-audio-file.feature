Feature: Podcasts Base - An episode with an uploaded audio file
      As a Content editor
      I want to upload the episode's audio file to the site
      So that a self-hosted show does not depend on an external platform.

  @check @local @development @staging @production
  Scenario: A Content editor uploads an audio file to an episode
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example Audio File Episode 74503"
      And I fill in "Summary" with "Summary for the audio-file test episode 74503."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I upload the example audio file
      And I save the podcast episode
     Then I should see "Varbase Example Audio File Episode 74503"
      And the episode page should play media from "varbase-example-episode"
     When I open the edit form for the podcast episode I am viewing
      And I open the "Audio" tab on the podcast form
     Then "a[href*='varbase-example-episode']" should be visible within 10 seconds
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"
