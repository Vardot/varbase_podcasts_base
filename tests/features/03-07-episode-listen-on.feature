@podcasts @listen-on
Feature: Podcasts Base - Where to listen to an episode
      As a listener
      I want each episode to tell me where I can listen to it
      So that I can open it in the app I use, even when the episode has no links of its own.

  @regression @local @development @staging @production
  Scenario: An episode without its own links offers its podcast's links
    Given I am an anonymous user
     When I go to "/podcasts-listen-on-test/episode-01"
     Then the page should link to "https://podcasts.apple.com/podcast/varbase-example-podcast-one"
      And the page should link to "https://open.spotify.com/show/varbase-example-podcast-one"

  @regression @local @development @staging @production
  Scenario: An episode with its own links offers only those
    Given I am an anonymous user
     When I go to "/podcasts-listen-on-test/episode-02"
     Then the page should link to "https://open.spotify.com/episode/varbase-example-episode-02"
      And the page should not link to "https://open.spotify.com/show/varbase-example-podcast-one"
      And the page should not link to "https://podcasts.apple.com/podcast/varbase-example-podcast-one"
