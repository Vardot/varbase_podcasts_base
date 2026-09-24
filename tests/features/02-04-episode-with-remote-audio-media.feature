@podcasts @audio
Feature: Podcasts Base - Remote audio on an episode
      As a Content editor
      I want the episode's Audio field to accept audio hosted on a podcast platform
      So that a show published to SoundCloud or Spotify needs no file upload here.

  @regression @local @development @staging @production
  Scenario: The Audio field offers both a local and a remote audio media type
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And I open the "Audio" tab on the podcast form
      And I open the media library for the "Audio" field
     Then the media library should offer the "Audio" media type
      And the media library should offer the "Remote audio" media type

  @regression @local @development @staging @production
  Scenario: A Content editor can reach the Remote audio media form
    Given I am a logged in user with the "Content editor" user
     When I go to "/media/add/remote_audio"
     Then I should see "Audio URL"
      And I see visible remote audio url field
      And "#edit-field-media-oembed-audio-0-value" should be editable
      And the field "#edit-field-media-oembed-audio-0-value" should be required

  @external @local @development
  Scenario: A Content editor creates a Remote audio media item from a live provider URL
    Given I am a logged in user with the "Content editor" user
     When I go to "/media/add/remote_audio"
      And I fill in "Audio URL" with "https://soundcloud.com/forss/flickermood"
      And I submit by id "edit-submit"
     Then I should see "Flickermood"
      And I should see "has been created"
     When I delete the "Flickermood" media item
     Then I should see "has been deleted"
