# Changelog

All notable changes to the Varbase Podcasts Base recipe are documented in this file.

## [Unreleased]

### Added

- Initial Varbase Podcasts Base recipe, providing the `podcast` content type for
  audio episodes.
- Fields: Description, Featured Image, Content (transcript), Audio file, Audio URL,
  Duration, Episode Number and Tags.
- Field storages owned by this recipe: `field_audio`, `field_audio_url`,
  `field_duration`, `field_episode_number`. The remaining storages come from
  Drupal CMS Content Type Base.
- View displays for `full`, `card` and `text_card_medium`, and a Canvas content
  template for `full` built from Vartheme BS5 components, so an episode page
  renders on Varbase Starter. A self-hosted file and a remote URL each get their
  own player, hidden when the field is empty.
- `views.view.podcasts` with **all**, **latest**, **related**, **featured** and
  **RSS** displays. The related display is what an episode page needs for a
  "More Episodes" rail, so a site template no longer has to hard-code those cards.
- Simple Sitemap bundle settings and a Pathauto pattern for episodes.
- Editorial workflow support: `podcast` is added to the Varbase editorial workflow.
- Role permissions for anonymous, authenticated, content editor, content admin,
  SEO admin and site admin.

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
