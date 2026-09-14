Feature: Podcasts Base - Podcasts listing pager
      As a site visitor
      I want the podcasts listing to paginate
      So that I can browse beyond the first page of episodes.

  @check @local @development @staging @production
  Scenario: The podcasts listing paginates when there are more than 12 episodes
    Given I am an anonymous user
     When I go to "/podcasts"
      And wait
      And I fill in "Search by" with "Varbase Example Episode"
      And I press "Apply Filter"
      And wait
     Then the podcasts result summary should show a total of 15
      And I should see text matching "1-12 of 15"
      And ".pager__items" should be visible
     When I go to "/podcasts?search=Varbase+Example+Episode&page=1"
      And wait
     Then I should see text matching "13-15 of 15"
      And I should see "Varbase Example Episode 15"
