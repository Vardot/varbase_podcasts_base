# Varbase Podcasts Base: functional tests

The Varbase functional testing suite for the **Varbase Podcasts Base** recipe
(Playwright + Cucumber-js through `@vardot/varbase-e2e`). The scenarios drive a
Varbase Starter site with this recipe applied, in a real browser, as an editor
and as a listener.

## Layout

```
tests/
├── features/                                  # flat, one recipe
│   ├── 01-01-podcast-content-type.feature        # the add form and its Audio tab
│   ├── 02-01-create-podcast-episode.feature      # create an episode, check its page
│   ├── 02-02-edit-podcast-episode.feature        # edit an episode, reload, check
│   ├── 02-03-episode-with-local-audio-media.feature   # pick or upload an mp3; the player loads it
│   ├── 02-04-episode-with-remote-audio-media.feature  # the Remote audio media type
│   ├── 02-05-episode-without-audio.feature       # no audio: the field is optional
│   ├── 02-06-editorial-workflow.feature          # editor drafts, admin publishes, listing shows it
│   ├── 02-07-editing-and-removing-audio.feature  # edits keep the audio; a deleted audio is survivable
│   ├── 03-01-podcasts-listing.feature            # cards, newest first, result summary, filters
│   ├── 03-02-podcasts-filter.feature             # keyword and tag filters
│   ├── 03-03-podcasts-pager.feature              # 12 per page, the Next page link
│   ├── 03-04-related-episodes.feature            # the related display, given a tag context
│   ├── 03-05-anonymous-listener.feature          # browse, filter, page, open, play
│   ├── 04-01-podcast-permissions.feature         # who may author and who may read
│   ├── 05-01-unpublished-episode-visibility.feature  # drafts stay out of the listing, search and sitemap
│   ├── 06-01-episode-seo.feature                 # title tag, meta description, canonical, alias
│   └── 07-01-podcasts-accessibility.feature      # listing and episode page
├── assets/                                    # the upload fixture (a two second mp3)
├── recipes/varbase_podcasts_base_test_content/   # the seeded episodes
├── scripts/provision-test-pages.php           # the listing and related test pages
├── selectors/podcasts.json                    # named selectors
└── step-definitions/podcasts.steps.js         # recipe-specific steps and the cleanup hook
```

## Tags

Every scenario carries `@regression` and the environments it may run on.
Scenarios that write content leave out `@production`. Feature tags name the
area: `@content-model`, `@authoring`, `@workflow`, `@audio`, `@listing`,
`@listener`, `@permissions`, `@security`, `@seo`, `@a11y`. `@smoke` marks the two
end-to-end journeys. `@external` needs a live oEmbed provider and is left out of
CI.

```bash
npx cucumber-js --config cucumber.js --tags "@smoke"
npx cucumber-js --config cucumber.js --tags "@listing and not @external"
npx cucumber-js --config cucumber.js --tags "@external"
```

## Test data and cleanup

The seed recipe creates 15 published episodes, `Varbase Example Episode 01` to
`15`, sharing one tag and one cover image. Episode 01 is the newest, so 01 to 12
are page 1. Episodes 01 to 12 reference one uploaded audio file; 13 to 15 have
no audio.

Each authoring scenario creates its own episode and media. An `After` hook in
`podcasts.steps.js` logs in as the webmaster and purges them, pass or fail.
Varbase sends deleted content to the trash, where it keeps its URL alias, so a
plain delete is not enough for a re-run on the same site.

## What the suite does not cover yet

- **Remote audio on the episode page.** The full template plays local audio
  only, and Vartheme BS5 has no oEmbed audio component. `02-04` stops at the
  authoring side.
- **Related episodes and a breadcrumb back to the listing on the episode page.**
  Both belong to the site template. `03-04` checks the related display through a
  test page instead; the episode breadcrumb only links Home.
- **Show notes on CI.** `02-06` types into the Show notes editor, which needs
  the CKEditor 5 plugin scripts from `cdn.ckeditor.com`.

## The listing and related pages are test-site provisioning

The recipe ships the `podcasts` view with block displays only, because the
podcasts landing page belongs to the site template.
`scripts/provision-test-pages.php` adds `/podcasts` (from the `All podcast
episodes` block) and `/podcasts-related-test/<tag>/<episode>` (from `Related
podcast episodes`, with an alias per seeded episode). Neither is recipe
configuration.

## Running locally

On a Varbase Starter site with the recipe applied:

```bash
drush recipe /path/to/tests/recipes/varbase_podcasts_base_test_content
drush php:script /path/to/tests/scripts/provision-test-pages.php
drush cache:rebuild

npm install && npx playwright install chromium
LAUNCH_URL=https://your-site.ddev.site npm run test:chromium
FEATURES="tests/features/03-05-anonymous-listener.feature" \
  LAUNCH_URL=https://your-site.ddev.site npm run test:chromium
```

The per-role testing users in `cucumber.js` must exist. Pages that render image
media need PHP assertions off (`zend.assertions = -1`), as on any production
site; see `.gitlab-ci.yml`.

CI builds the same site, seeds it and runs every scenario except `@external` on
each pipeline. See `.gitlab-ci.yml`.
