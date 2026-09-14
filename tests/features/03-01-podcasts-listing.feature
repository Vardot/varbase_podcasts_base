Feature: Podcasts Base - Podcasts listing
      As a site visitor
      I want a podcasts listing with episode cards, a summary and filters
      So that I can browse and narrow down the site's episodes.

  @check @local @development @staging @production
  Scenario: The podcasts listing shows episode cards and a result summary
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
      And wait
     Then I should see text matching "1-12 of 15"
      And I should see "Varbase Example Episode 01"
      And "a[href='/podcast/varbase-example-episode-01']" should have a count of 1

  @check @local @development @staging @production
  Scenario: The podcasts listing exposes the keyword and Industry filters
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
      And wait
     Then I should see "Search by"
      And I should see "Industry"

  @check @local @development @staging @production
  Scenario: A listed episode opens its episode page
    Given I am an anonymous user
     When I go to "/podcast/varbase-example-episode-01"
      And wait
     Then I should see "Varbase Example Episode 01"
      And I should see "44 Mins"
