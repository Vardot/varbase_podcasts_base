Feature: Podcasts Base - Podcasts listing filters
      As a site visitor
      I want to filter the podcasts listing by keyword and by Industry
      So that I can find the episodes that interest me.

  @check @local @development @staging @production
  Scenario: Filtering the podcasts listing by keyword narrows the results
    Given I am an anonymous user
     When I go to "/podcasts"
      And wait
      And I fill in "Search by" with "Varbase Example Episode"
      And I press "Apply Filter"
      And wait
     Then the podcasts result summary should show a total of 15
      And I should see "Varbase Example Episode 01"

  @check @local @development @staging @production
  Scenario: Filtering the podcasts listing to a single episode
    Given I am an anonymous user
     When I go to "/podcasts"
      And wait
      And I fill in "Search by" with "Varbase Example Episode 07"
      And I press "Apply Filter"
      And wait
     Then the podcasts result summary should show a total of 1
      And I should see "Varbase Example Episode 07"
      And I should not see "Varbase Example Episode 08"
