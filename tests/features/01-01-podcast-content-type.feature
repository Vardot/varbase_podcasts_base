@podcasts @content-model
Feature: Podcasts Base - Podcast episode content type
      As a Content editor
      I want a Podcast episode content type with the fields the recipe defines
      So that I can publish an audio episode with its cover art, show notes and
      audio.

  @regression @local @development @staging @production
  Scenario: The Podcast episode add form asks for a title, a summary and cover art
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
     Then the page title should contain "Create Podcast episode"
      And I see visible podcast title field
      And the field "#edit-title-0-value" should be required
      And the field "Summary" should be required
      And the field "Show notes" should exist
      And the field "Summary" should be empty
      And I should see "Cover art"
      And I should see "Add media"

  @regression @local @development @staging @production
  Scenario: The Audio tab offers the Audio field as a media reference, not a file upload or a link
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And I open the "Audio" tab on the podcast form
     Then I see visible audio media button, duration field, episode number field
      And "#edit-field-audio-open-button" should have value "Add media"
      And I don't see audio file upload, audio link field
      And the field "Duration" should not be required
      And the field "Episode number" should not be required
