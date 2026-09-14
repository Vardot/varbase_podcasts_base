Feature: Podcasts Base - Related podcast episodes
      As a site visitor reading an episode
      I want other episodes on the same subject offered to me
      So that I can keep listening to the show.

  @check @local @development @staging @production
  Scenario: The related display offers other episodes from episode 01's tag
    Given I am an anonymous user
     When I go to "/podcasts-related-test/episode-01"
      And wait
     Then the related episodes should include at least 3 episodes other than "Varbase Example Episode 01"

  @check @local @development @staging @production
  Scenario: The related display offers other episodes from episode 14's tag
    Given I am an anonymous user
     When I go to "/podcasts-related-test/episode-14"
      And wait
     Then the related episodes should include at least 3 episodes other than "Varbase Example Episode 14"
