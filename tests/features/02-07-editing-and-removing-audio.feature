@podcasts @audio @authoring
Feature: Podcasts Base - Editing an episode and removing its audio
      As a Content editor
      I want an episode's audio to survive edits and its page to survive losing the audio
      So that routine changes never leave listeners with a broken episode.

  @regression @local @development @staging
  Scenario: Editing an episode keeps the audio it references
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And I fill in "Title" with "Varbase Example Keep Audio Episode 74508"
      And I fill in "Summary" with "Summary for the keep audio test episode 74508."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I open the media library for the "Audio" field
      And I upload the audio file "varbase-example-upload-episode.mp3" to the open media library
      And I save the podcast episode
     Then the episode page should play media from "varbase-example-upload-episode"
     When I open the edit form for the podcast episode I am viewing
      And I fill in "Summary" with "Summary for the keep audio test episode 74508, edited."
      And I save the podcast episode
     Then I should see "Summary for the keep audio test episode 74508, edited."
      And the episode page should play media from "varbase-example-upload-episode"
      And the episode player should load its audio

  @regression @local @development @staging
  Scenario: Deleting the audio media leaves the episode page readable
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And I fill in "Title" with "Varbase Example Lost Audio Episode 74509"
      And I fill in "Summary" with "Summary for the lost audio test episode 74509."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I open the media library for the "Audio" field
      And I upload the audio file "varbase-example-upload-episode.mp3" to the open media library
      And I save the podcast episode
     Then the episode page should play media from "varbase-example-upload-episode"
     When I delete the "varbase-example-upload-episode.mp3" media item
     Then I should see "has been deleted"
     When I go to "/podcast/varbase-example-lost-audio-episode-74509"
     Then the page title should contain "Varbase Example Lost Audio Episode 74509 | "
      And I should see "Summary for the lost audio test episode 74509."
      And the podcast episode page should offer no audio
