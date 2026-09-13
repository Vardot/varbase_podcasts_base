# AGENTS.md

Guidance for AI coding agents working on the Varbase Podcasts Base recipe.

## Before you start

Read the project history and context first:

- **`CHANGELOG.md`** — what changed in each release, newest first. Read it before
  proposing changes so you follow the established direction and versioning.
- **Merge request comments and history** on
  [git.drupalcode.org/project/varbase_podcasts_base](https://git.drupalcode.org/project/varbase_podcasts_base/-/merge_requests)
  — the reasoning behind recent changes lives in the MR discussions.
- **Issue comments** on
  [drupal.org/project/issues/varbase_podcasts_base](https://www.drupal.org/project/issues/varbase_podcasts_base)
  — the Problem/Motivation and Proposed resolution for each change.

## When you make a change

- Add an entry under `## [Unreleased]` in `CHANGELOG.md`.
- Keep commit messages in the Drupal commit-type format:
  `{type}: #{issueID} Summary` (see https://www.drupal.org/node/3586390).
- Never bump the version or tag a release without explicit maintainer approval.
- This is a `drupal-recipe`; keep configuration in the recipe, not in
  `config/install` or `config/optional`.

## What belongs here, and what does not

This recipe owns the **podcast episode content model** and nothing above it.

**Belongs here**

- The `podcast` content type, its fields, and the four field storages this recipe
  owns: `field_audio`, `field_audio_url`, `field_duration`, `field_episode_number`.
- Form and view displays for the episode, and the Canvas content template for the
  full view mode, built on Vartheme BS5. Keep it: Varbase Content Base otherwise
  creates an empty full-view template and every episode page renders blank.
- `views.view.podcasts` and its block and feed displays.
- SEO plumbing for episodes: Pathauto pattern, Simple Sitemap bundle settings.
- Editorial workflow and role permissions for `podcast`.

**Does not belong here**

- The podcasts **landing page**. That is the site template's decision, which is why
  the view ships no page display — a view page at `/podcasts` would collide with a
  Canvas page serving the same path.
- Theme components and styling. The episode renders through whatever component
  library the site's theme provides.
- Demo content. Episodes ship from the site template, not from this recipe.

## Reuse what Varbase already provides

Build on the existing base recipes rather than duplicating them:
`varbase_content_base`, `varbase_media_base`, `varbase_seo_base` and
`varbase_workflow_base` are dependencies, and shared field storages such as
`field_description`, `field_content`, `field_featured_image` and `field_tags`
come from Drupal CMS Content Type Base. Do not re-declare them here.

## Ship configuration explicitly

Two configs are shipped that a Drupal install would otherwise create on its own:
`core.entity_view_display.node.podcast.full` and the Simple Sitemap bundle
settings. They are in the recipe on purpose — leaving them to the install
environment means an episode can render and be indexed differently from one site
to the next. Prefer explicit config over relying on defaults.
