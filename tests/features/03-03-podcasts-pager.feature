@podcasts @listing
Feature: Podcasts Base - Podcasts listing pager
      As a site visitor
      I want the podcasts listing to paginate
      So that I can browse beyond the first page of episodes.

  @regression @local @development @staging @production
  Scenario: The podcasts listing paginates when there are more than 12 episodes
    Given I am an anonymous user
     When I go to "/podcasts"
      And I fill in "Search by" with "Varbase Example Episode"
      And I press "Apply Filter"
     Then I should see "1-12 of 15" in the ".vb-result-summary" element
      And I see visible podcasts pager
     When I click podcasts next page link
     Then I should see "13-15 of 15" in the ".vb-result-summary" element
      And ".podcast--card" should have a count of 3
      And I should see "Varbase Example Episode 15"
      And I should not see "Varbase Example Episode 01"
