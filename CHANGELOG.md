# Changelog

All notable changes to the Varbase Podcasts Base recipe are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-alpha1] - 2026-09-21
### Added
- Initial Varbase Podcasts Base recipe, providing the `podcast` content type for
  audio episodes.
- Fields: Description, Featured Image, Content (transcript), Audio, Duration,
  Episode Number and Tags.
- Field storages owned by this recipe: `field_audio`, `field_duration` and
  `field_episode_number`. The remaining storages come from Drupal CMS Content
  Type Base.
- View displays for `full`, `card` and `text_card_medium`, and a Canvas content
  template for `full` built from Vartheme BS5 components, so an episode page
  renders on Varbase Starter.
- `views.view.podcasts` with **all**, **latest**, **related**, **featured** and
  **RSS** displays. The related display is what an episode page needs for a
  "More Episodes" rail, so a site template no longer has to hard-code those cards.
- Simple Sitemap bundle settings and a Pathauto pattern for episodes.
- Editorial workflow support: `podcast` is added to the Varbase editorial workflow.
- Role permissions for anonymous, authenticated, content editor, content admin,
  SEO admin and site admin.
- Functional test coverage for the episode content model, running in CI against a
  real Varbase Starter site.
### Changed
- The episode audio is one media reference field, `field_audio`, targeting the
  `audio` and `remote_audio` media types, replacing the separate file upload field
  and link field. Uploaded and externally hosted audio are now the same field.
- Ship the podcast full template on Vartheme BS5 instead of the site template's
  theme, so a base recipe does not bind to one site template.
- Pin the `drupal/varbase_components` dependency to `~4.0.0` and the
  `drupal/varbase_content_base`, `drupal/varbase_media_base`,
  `drupal/varbase_seo_base` and `drupal/varbase_workflow_base` dependencies to
  `~1.0.0` for the release.
- Set the recipe version to `1.0.0-alpha1` and update the version badge in
  `README.md`.
### Fixed
- Enable the podcasts RSS feed and clear the news wording carried over from the
  view this one was adapted from.
- Drop the `search_api_exclude` dependency nothing in the chain provides.

### Notes

- The full template must ship. Varbase Content Base creates an empty full-view
  template for every new content type, and an empty template renders a blank page.
- The view ships **no page display** on purpose. The podcasts landing page belongs
  to the site template, which may serve it from a Canvas page; a view page at
  `/podcasts` would collide with it.
- `core.entity_view_display.node.podcast.full` and the Simple Sitemap bundle
  settings are shipped explicitly rather than left to whatever the install
  environment happens to create, so a podcast renders and is indexed the same way
  on every site.

[Unreleased]: https://git.drupalcode.org/project/varbase_podcasts_base/-/compare/1.0.0-alpha1...1.0.x
[1.0.0-alpha1]: https://git.drupalcode.org/project/varbase_podcasts_base/-/tags/1.0.0-alpha1
