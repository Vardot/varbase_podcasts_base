@podcasts @listing
Feature: Podcasts Base - Podcasts listing filters
      As a site visitor
      I want to filter the podcasts listing by keyword and by tag
      So that I can find the episodes that interest me.

  @regression @local @development @staging @production
  Scenario: Filtering the podcasts listing by keyword narrows the results
    Given I am an anonymous user
     When I go to "/podcasts"
      And I fill in "Search by" with "Varbase Example Episode"
      And I press "Apply Filter"
     Then the podcasts result summary should show a total of 15
      And current url should have the "search" parameter with the "Varbase Example Episode" value
      And I should see "Varbase Example Episode 01"

  @regression @local @development @staging @production
  Scenario: Filtering the podcasts listing to a single episode
    Given I am an anonymous user
     When I go to "/podcasts"
      And I fill in "Search by" with "Varbase Example Episode 07"
      And I press "Apply Filter"
     Then the podcasts result summary should show a total of 1
      And ".podcast--card" should have a count of 1
      And I should see "Varbase Example Episode 07"
      And I should not see "Varbase Example Episode 08"

  @regression @local @development @staging @production
  Scenario: Filtering the podcasts listing by tag keeps the episodes carrying that tag
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
      And I select "Varbase Example Podcast Tag" from "industry"
      And I press "Apply Filter"
     Then current url should have the "industry" parameter
      And the podcasts result summary should show a total of 15
      And I should see "Varbase Example Episode 01"
