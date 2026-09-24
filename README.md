[![Varbase](https://raw.githubusercontent.com/Vardot/varbase/11.0.x/images/varbase-logo.png)](https://www.drupal.org/project/varbase)

# Varbase Podcasts Base
[![pipeline status](https://git.drupalcode.org/project/varbase_podcasts_base/badges/1.0.x/pipeline.svg)](https://git.drupalcode.org/project/varbase_podcasts_base/-/pipelines)
[![Varbase Podcasts Base](https://img.shields.io/badge/Varbase%20Podcasts%20Base-1.0.0--alpha1-0d6efc?labelColor=001d38&style=flat-square)](https://git.drupalcode.org/project/varbase_podcasts_base/-/pipelines?ref=1.0.0-alpha1)
[![Automated Functional Testing](https://git.drupalcode.org/project/varbase_project/badges/11.0.x/pipeline.svg)](https://git.drupalcode.org/project/varbase_project/-/pipelines)

A recipe to provide a podcast episode content type, listing view, and related configuration for Varbase. Use Podcasts to publish audio episodes with a summary, cover art, show notes, duration and episode number in the Podcasts section of the site.

This recipe builds on top of the Varbase Content Base, Media Base, SEO Base, and Workflow Base recipes, extending them with podcast-specific content structure, views, and SEO configuration.

## Features

### Podcast Content Type
- **Podcast** (`podcast`): A content type for podcast episodes with the following fields:
  - Title
  - Description (short summary text)
  - Featured Image (media reference, used as episode cover art)
  - Content (long text with format, used for the episode transcript)
  - Audio (media reference to an Audio or Remote audio media item)
  - Duration (plain text, for example `44 Mins`)
  - Episode Number (integer)
  - Tags (taxonomy reference with autocomplete via Tagify)

### Audio delivery
An episode carries its audio in one media reference field, `field_audio`, targeting the
`audio` and `remote_audio` media types from Varbase Media Base. An uploaded file and an
episode hosted on SoundCloud, Spotify or Apple Podcasts are the same field, so the editor
picks a media item instead of choosing between two fields, and media reuse, revisions and
permissions come with it. The field is optional, so an episode can be drafted before its
audio is ready.

### Views
- **Podcasts** (`podcasts`): A views listing with several displays:
  - **All podcast episodes**: paginated listing with Better Exposed Filters
  - **Latest podcast episodes**: block for the most recent episodes
  - **Related podcast episodes**: block for episodes sharing tags, used for the
    "More Episodes" rail on an episode page
  - **Featured podcast episodes**: block for promoted episodes
  - **RSS Feed**: podcast content feed

There is deliberately **no page display**. The podcasts landing page belongs to the
site template, which may serve it from a Canvas page; shipping a view page at
`/podcasts` here would collide with it.

### View modes
- **Full**: the episode page
- **Card** and **Text card medium**: listing and rail displays

The recipe ships a Canvas content template for the **full** view mode, built from
Vartheme BS5 components, so an episode page renders its title, date, duration,
cover art, audio player, description and transcript on Varbase Starter and on any
site using the base theme. Vartheme BS5 has no audio component, so the player is its
video component, which plays audio files, and it renders nothing when the field is
empty.

The full template has to ship. Varbase Content Base creates an empty full-view
template for every new content type, and an empty template renders a blank
episode page.

**Card** and **Text card medium** render through their view displays. A site
template with its own theme takes over the full template the same way it does for
the other base recipes: `repointComponentTreeToTheme`, or a `simpleConfigUpdate` of
`component_tree` for a designed layout.

### SEO
- XML sitemap inclusion via Simple Sitemap bundle settings
- Pathauto pattern for episode URLs
- Metatag and Yoast SEO support inherited from Varbase SEO Base

## Requirements

- Varbase Content Base
- Varbase Media Base
- Varbase SEO Base
- Varbase Workflow Base

## Installation

```bash
composer require drupal/varbase_podcasts_base
drush recipe recipes/varbase_podcasts_base
```

## Maintainers

- [Vardot](https://www.drupal.org/vardot)
