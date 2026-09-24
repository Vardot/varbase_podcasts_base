@podcasts @listing
Feature: Podcasts Base - Podcasts listing
      As a site visitor
      I want a podcasts listing with episode cards, a summary and filters
      So that I can browse and narrow down the site's episodes.

  @regression @local @development @staging @production
  Scenario: The podcasts listing shows episode cards, newest first, with a result summary
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
     Then I should see "1-12 of 15" in the ".vb-result-summary" element
      And ".podcast--card" should have a count of 12
      And "a[href='/podcast/varbase-example-episode-01']" should be attached
      And the text "Varbase Example Episode 02" should appear after the text "Varbase Example Episode 01"
      And the text "Varbase Example Episode 12" should appear after the text "Varbase Example Episode 11"
      And I should not see "Varbase Example Episode 13"

  @regression @local @development @staging @production
  Scenario: The podcasts listing exposes the keyword and tag filters
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
     Then the field "Search by" should exist
      And the option "Varbase Example Podcast Tag" should exist within the select element "select[name='industry']"
      And I should see "Apply Filter"

  @regression @local @development @staging @production
  Scenario: A listed episode opens its episode page
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode+01"
      And I follow "Varbase Example Episode 01"
     Then the path should be "/podcast/varbase-example-episode-01"
      And the page title should contain "Varbase Example Episode 01 | "
      And I should see "44 Mins"
