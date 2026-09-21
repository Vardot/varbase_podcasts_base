Feature: Podcasts Base - An episode with no audio at all
      As a Content editor
      I want to draft an episode before its recording exists
      So that the show notes and cover art can be prepared ahead of the audio.

  @check @local @development @staging @production
  Scenario: A Content editor saves an episode with no audio media referenced
    Given I am a logged in user with the "Content editor" user
     When I go to "/node/add/podcast"
      And wait
      And I fill in "Title" with "Varbase Example No Audio Episode 74505"
      And I fill in "Summary" with "Summary for the no-audio test episode 74505."
      And I add the first available cover art from the media library
      And I open the "Audio" tab on the podcast form
      And I fill in "Duration" with "12 Mins"
      And I save the podcast episode
     Then I should see "Varbase Example No Audio Episode 74505"
      And the podcast episode page should offer no audio
     When I delete the podcast episode I am viewing
     Then I should see "has been deleted"

  @check @local @development @staging @production
  Scenario: An anonymous visitor can read an episode that has no audio yet
    Given I am an anonymous user
     When I go to "/podcast/varbase-example-episode-13"
      And wait
     Then I should see "Varbase Example Episode 13"
      And the podcast episode page should offer no audio
