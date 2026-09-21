# Varbase Podcasts Base — automated functional tests

Behaviour-Driven functional tests for the **Varbase Podcasts Base** recipe, part
of the Varbase functional testing suite (Playwright + Cucumber-js). They drive a
running Varbase site through a real browser and assert the behaviour the recipe
actually provides — the Podcast episode content type and its fields, authoring,
the audio cases the content model allows, the podcasts listing with its
filters and pager, the related-episodes display, and the episode permissions.

## Layout

```
tests/
├── features/                              # flat — one recipe, no per-feature subfolders
│   ├── 01-01-podcast-content-type.feature    # the episode add form and its Audio tab
│   ├── 02-01-create-podcast-episode.feature  # create an episode, assert its page
│   ├── 02-02-edit-podcast-episode.feature    # edit an episode's title and duration
│   ├── 02-03-episode-with-local-audio-media.feature   # an uploaded Audio media item
│   ├── 02-04-episode-with-remote-audio-media.feature  # the Remote audio media type
│   ├── 02-05-episode-without-audio.feature   # no Audio media — the field is optional
│   ├── 03-01-podcasts-listing.feature        # cards, result summary, exposed filters
│   ├── 03-02-podcasts-filter.feature         # Search by keyword narrows the results
│   ├── 03-03-podcasts-pager.feature          # 12 per page + a pager on page 2
│   ├── 03-04-related-episodes.feature        # the related display, given a tag context
│   └── 04-01-podcast-permissions.feature     # who may author; editor CRUD flow
├── assets/
│   └── varbase-example-episode.wav        # the audio the seeded media item carries
├── step-definitions/
│   └── podcasts.steps.js                  # the episode form's tabs, cover art, the
│                                          #   media library widgets and player, save /
│                                          #   edit / delete, the result summary, related
└── recipes/
    └── varbase_podcasts_base_test_content/   # a `type: Content` seed recipe: 15 published
                                              #   "Varbase Example Episode NN" episodes
                                              #   sharing one tag and one cover-art media —
                                              #   12 referencing one Audio media item,
                                              #   3 with no audio at all
```

The `NN-NN-` prefix keeps the flat feature files ordered.

The generic `@vardot/varbase-e2e` steps drive everything that is not specific to
this recipe — the form fields, navigation and assertions — so
`podcasts.steps.js` stays small.

## Show notes is not authored by the suite

No scenario types into the rich-text **Show notes** field. Its CKEditor 5 editor
loads the Varbase Plugin Pack and Premium Features plugins from
`cdn.ckeditor.com`, which a network-isolated CI runner cannot reach, so the
editor never initialises there. The field's presence on the add form is asserted
in `01-01`; authoring through it is left out so the scenarios stay deterministic.

Vartheme BS5 has no audio component, so the episode template plays audio through
its `video` component. `02-03` asserts a `<video>` with controls whose source is
the file the referenced Audio media carries, so that choice is checked by the
suite rather than assumed.

## The audio cases

`field_audio` is a single, optional reference to a media item, and the media
library offers two bundles for it: **Audio** for a file uploaded to this site,
and **Remote audio** for an oEmbed URL from SoundCloud, Spotify, Apple Podcasts,
Acast, Audioboom, Simplecast, Spreaker or MixCloud. `02-03` covers the local
case end to end, `02-05` covers an episode drafted before its recording exists,
and the seeded fixture carries both shapes so the listing is not made of
identically-shaped episodes.

`02-04` covers remote audio. Creating a Remote audio media item needs a live
oEmbed round trip to the provider, so the two scenarios CI runs assert only what
needs no network — that the Audio field's media library offers the Remote audio
type alongside Audio, and that its add form exposes the Audio URL field. The one
scenario that posts a real provider URL is tagged `@external` and is excluded
from the pipeline:

```bash
npx cucumber-js --config cucumber.js --tags "not @external"   # what CI runs
npx cucumber-js --config cucumber.js --tags "@external"       # the live-provider check
```

The Remote audio media type comes from `varbase_media_base`. The episode's
Canvas full template walks node → media → file for the local case, so a remote
audio media currently renders no player on the episode page; `02-04` therefore
stops at the authoring side rather than asserting an embed the template does not
yet produce.

## Prerequisites

- A running Varbase site with this recipe applied (Podcast episode content type,
  the `podcasts` view and the episode view displays). A stock Varbase Starter
  site is enough: the episode renders from its own view displays and the view
  rows through Vartheme BS5's own components, so no site-template theme is
  needed.
- The per-role testing users from `cucumber.js` (`Normal user`, `Content
  editor`, `Content admin`, `SEO admin`, `Site admin`, `webmaster`).
- The test content seeded — a testing-only **recipe** (not a PHP fixture), so
  the listing / filter / pager / related scenarios have deterministic data:

  ```bash
  drush recipe /path/to/tests/recipes/varbase_podcasts_base_test_content
  drush cache:rebuild
  ```

  It creates 15 published episodes titled `Varbase Example Episode NN`, all
  sharing the `Varbase Example Podcast Tag` and one cover-art media item, with
  `created` set so that episode 01 is the newest — the listing sorts by
  created DESC, so 01–12 are page 1 and 13–15 are page 2. The scenarios isolate
  the fixture with the "Search by" keyword, so their counts do not depend on any
  other content on the site.

## The listing and related pages are provisioned by the harness

The recipe ships the `podcasts` view with **block displays only** and no page
display, on purpose: the podcasts landing page belongs to the site template. The
test site therefore provisions two page displays itself, and neither is recipe
configuration:

- `/podcasts`, copied from the `All podcast episodes` block display with its
  exposed filters rendered inline;
- `/podcasts-related-test/<tag>/<episode>`, copied from the `Related podcast
  episodes` block display, with its two contextual filters — the tag, and the
  episode to exclude — taken from the path. An alias per seeded episode
  (`/podcasts-related-test/episode-01`, `…-14`) gives each tag context a stable
  URL.

The related display is exercised as a page rather than as a block on the episode
page because Varbase Starter's theme renders its regions through Canvas page
regions, where a classic block placement is never rendered. Both displays are
added in one `drush php:eval` in `.gitlab-ci.yml`.

## Running

```bash
npm install                 # varbase-e2e brings Cucumber-js, Playwright, tsx
npx playwright install chromium

# Point at your running site and run the whole suite:
LAUNCH_URL=https://your-site.ddev.site npm run test:chromium

# A single feature file:
FEATURES="tests/features/03-01-podcasts-listing.feature" \
  LAUNCH_URL=https://your-site.ddev.site npm run test:chromium
```

CI installs a Varbase site that applies this recipe, seeds the users + the test
content recipe, provisions the listing and related pages, and runs the
whole suite — see `.gitlab-ci.yml`.
