Feature: Podcasts Base - Podcast episode content type
      As a Content editor
      I want a Podcast episode content type with the fields the recipe defines
      So that I can publish an audio episode with its cover art, show notes and
      audio.

  @check @local @development @staging @production
  Scenario: The Podcast episode add form exposes the podcast fields to a Content editor
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
     Then I should see "Create Podcast episode"
      And I should see "Title"
      And I should see "Summary"
      And I should see "Cover art"
      And I should see "Show notes"
      And I should see "Audio file"
      And I should see "Audio URL"
      And I should see "Duration"
      And I should see "Episode number"
      And I should see "Tags"
      And "#edit-title-0-value" should be visible within 10 seconds

  @check @local @development @staging @production
  Scenario: The Audio tab exposes the four audio-model fields as editable widgets
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I open the "Audio" tab on the podcast form
     Then "input[name^='files[field_audio']" should be visible within 10 seconds
      And "#edit-field-audio-url-0-uri" should be visible within 10 seconds
      And "#edit-field-duration-0-value" should be visible within 10 seconds
      And "#edit-field-episode-number-0-value" should be visible within 10 seconds
