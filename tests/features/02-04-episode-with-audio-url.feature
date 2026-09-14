Feature: Podcasts Base - An episode with only an audio URL
      As a Content editor
      I want to point the episode at audio hosted elsewhere
      So that a show published to a podcast platform needs no file upload here.

  @check @local @development @staging @production
  Scenario: A Content editor publishes an episode that links to remote audio
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example Audio URL Episode 74504"
      And I fill in "Summary" with "Summary for the audio-URL test episode 74504."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I fill in "Audio URL" with "https://example.com/podcasts/varbase-example-episode-74504.mp3"
      And I fill in "Duration" with "31 Mins"
      And I save the podcast episode
     Then I should see "Varbase Example Audio URL Episode 74504"
      And the episode page should play media from "https://example.com/podcasts/varbase-example-episode-74504.mp3"
     When I open the edit form for the podcast episode I am viewing
      And I open the "Audio" tab on the podcast form
     Then "#edit-field-audio-url-0-uri" should have value "https://example.com/podcasts/varbase-example-episode-74504.mp3"
      And "input[name^='files[field_audio']" should be visible within 10 seconds
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"
