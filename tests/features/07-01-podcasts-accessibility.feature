@podcasts @a11y
Feature: Podcasts Base - Accessibility of the podcasts listing and an episode
      As a listener using assistive technology
      I want the podcasts listing and an episode page to be usable without sight or a mouse
      So that the podcast is open to everyone.

  @regression @a11y @local @development @staging @production
  Scenario: The podcasts listing passes the accessibility gate
    Given I am an anonymous user
     When I go to "/podcasts?search=Varbase+Example+Episode"
     Then the page should have no serious accessibility violations
      And the page should have exactly one h1
      And the heading hierarchy should be valid
      And every link should have an accessible name
      And every button should have an accessible name
      And every image should have an alt attribute
      And the element "main" should not violate the accessibility rule "label"
      And user zoom should be allowed

  @regression @a11y @local @development @staging @production
  Scenario: An episode page passes the accessibility gate
    Given I am an anonymous user
     When I go to "/podcast/varbase-example-episode-01"
     Then the page should have no serious accessibility violations
      And the page should have exactly one h1
      And the heading hierarchy should be valid
      And every link should have an accessible name
      And every button should have an accessible name
      And every image should have an alt attribute
      And every episode player control should have an accessible name
      And user zoom should be allowed
