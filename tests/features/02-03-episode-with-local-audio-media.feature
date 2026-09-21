Feature: Podcasts Base - An episode with a local audio media item
      As a Content editor
      I want to give the episode an audio file held on this site
      So that a self-hosted show does not depend on an external platform.

  @check @local @development @staging @production
  Scenario: A Content editor gives an episode an uploaded audio media item
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example Audio Media Episode 74503"
      And I fill in "Summary" with "Summary for the local audio media test episode 74503."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I open the media library for the "Audio" field
      And I add the first "Audio" media item from the open media library
     Then the "Audio" field should show the selected media item "Varbase Example Episode Audio"
     When I save the podcast episode
     Then I should see "Varbase Example Audio Media Episode 74503"
      And the episode page should play media from "varbase-example-episode"
     When I open the edit form for the podcast episode I am viewing
      And I open the "Audio" tab on the podcast form
     Then the "Audio" field should show the selected media item "Varbase Example Episode Audio"
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"

  @check @local @development @staging @production
  Scenario: An anonymous visitor can play the audio of a seeded episode
    Given I am an anonymous user
     When I go to "/podcast/varbase-example-episode-01"
      And wait
     Then I should see "Varbase Example Episode 01"
      And the episode page should play media from "varbase-example-episode"
