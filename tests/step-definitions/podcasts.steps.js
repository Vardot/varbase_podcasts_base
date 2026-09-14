'use strict';

const { When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const assert = require('assert');

const { smartSettle, friendly } = require('@vardot/varbase-e2e/tests/step-definitions/varbase-e2e');

// -----------------------------------------------------------------------------
// Custom steps for the Varbase Podcasts Base recipe.
//
// The generic varbase-e2e steps drive the Title, Summary, Duration and Audio
// URL fields ("I fill in ..."), so those are not re-implemented here. What IS
// here is what only this recipe needs:
//
//   - the episode form's field-group tabs — Audio, Categorization and the rest
//     render closed, and a field inside a closed tab is not fillable;
//   - the required Cover art media-library widget (an AJAX modal picker);
//   - the Audio file upload (a file_generic widget, an AJAX upload);
//   - save / edit / delete, so every authoring scenario stays independent and
//     removes what it creates;
//   - the listing result summary and the related-episodes assertion.
//
// SAFETY: state-changing steps click ONLY specific, verified elements (never a
// "first form submit" fallback) and fail fast if the page is not the expected
// Podcast episode node form, so a mis-navigated run can never submit an
// unrelated form.
// -----------------------------------------------------------------------------

// varbase-e2e settles on a 45s per-step ceiling, which the media-library step
// can exceed on a loaded machine: opening the AJAX modal, switching to the
// Image tab, selecting and inserting are four round trips against a heavy
// Varbase site. 90s keeps a slow-but-working step from being reported as a
// product failure, while still failing a step that is genuinely stuck.
setDefaultTimeout(90000);

const budgetOf = (world) => (world.minWaitTime && world.minWaitTime.page) || 8000;

/**
 * Assert the browser is on a Podcast episode node add/edit form before a write.
 */
async function assertOnPodcastForm(page) {
  const url = page.url();
  const onForm = /\/node\/add\/podcast/.test(url) || /\/node\/\d+\/edit/.test(url);
  const hasTitle = (await page.locator('#edit-title-0-value').count()) > 0;
  if (!onForm || !hasTitle) {
    throw friendly(
      `Expected to be on the Podcast episode add/edit form, but the current page is "${url}".`,
      'Navigate to /node/add/podcast (or /node/<id>/edit) before this step.'
    );
  }
}

/**
 * Dismiss the autosave_form "restore a saved draft" dialog when one is open.
 *
 * A retried scenario reopens /node/add/podcast after an earlier attempt typed
 * into it, so Autosave Form offers to restore that draft in a jQuery UI modal
 * whose overlay intercepts every click on the form. Rejecting the draft keeps
 * the retry identical to a first attempt.
 */
async function dismissAutosaveDialog(page, budget) {
  const dialog = page.locator('.ui-dialog.autosave-dialog').first();
  if (!(await dialog.count()) || !(await dialog.isVisible().catch(() => false))) return;
  const reject = dialog.locator('.ui-dialog-buttonpane button').filter({ hasNotText: /restore/i }).first();
  if (await reject.count()) {
    await reject.click();
  } else {
    await dialog.locator('.ui-dialog-titlebar-close').first().click();
  }
  await page.locator('.ui-dialog.autosave-dialog').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await smartSettle(page, budget);
}

/**
 * Resolve the node id of the Podcast episode page currently shown. Reads it
 * from the Edit local-task link (/node/<id>/edit — reliably present for an
 * author), falling back to the shortlink and the node body class.
 */
async function currentEpisodeNid(page) {
  return page.evaluate(() => {
    const editHref = [...document.querySelectorAll('a[href*="/node/"]')]
      .map((a) => a.getAttribute('href'))
      .find((h) => /\/node\/\d+\/(edit|delete)/.test(h));
    if (editHref) return editHref.match(/\/node\/(\d+)\//)[1];
    const sl = document.querySelector('link[rel="shortlink"]');
    if (sl) {
      const m = sl.getAttribute('href').match(/node\/(\d+)/);
      if (m) return m[1];
    }
    const body = document.querySelector('body[class*="page-node-"]');
    if (body) {
      const m = body.className.match(/page-node-(\d+)/);
      if (m) return m[1];
    }
    const el = document.querySelector('[data-history-node-id]');
    if (el) return el.getAttribute('data-history-node-id');
    return null;
  });
}

/**
 * Open one of the episode form's field-group tabs by its label.
 *
 * The Podcast episode form groups its fields into horizontal tabs — General
 * (open), Audio, Categorization, SEO and Options (all closed). Playwright will
 * not fill a field inside a closed tab, so Duration, Episode number, Audio file
 * and Audio URL need their tab opened first. Handles both renderings the
 * field_group tabs element can take: a tab link, and a plain <details>.
 *
 * Example #1: When I open the "Audio" tab on the podcast form
 * Example #2: And I open the "Audio" tab on the podcast form
 * Example #3: When we open the "Categorization" tab on the podcast form
 * Example #4: And we open the "Options" tab on the podcast form
 * Example #5: Given I open the "Audio" tab on the podcast form
 */
When(/^(?:I |we )*open the "([^"]*)" tab on the podcast form$/, async function (label) {
  await assertOnPodcastForm(this.page);
  await dismissAutosaveDialog(this.page, budgetOf(this));

  // A tab link in the horizontal/vertical tabs list.
  const tab = this.page
    .locator('.horizontal-tabs-list a, .vertical-tabs__menu a, [role="tab"]')
    .filter({ hasText: label })
    .first();
  if (await tab.count()) {
    await tab.click();
    await smartSettle(this.page, budgetOf(this));
    return;
  }

  // A plain <details> element with that summary — open it in place.
  const opened = await this.page.evaluate((wanted) => {
    const details = [...document.querySelectorAll('details')].find((d) => {
      const summary = d.querySelector('summary');
      return summary && summary.textContent.trim().startsWith(wanted);
    });
    if (!details) return false;
    details.open = true;
    return true;
  }, label);
  if (!opened) {
    throw friendly(
      `No "${label}" tab or details group was found on the Podcast episode form.`,
      'Check the field_group labels in core.entity_form_display.node.podcast.default.yml.'
    );
  }
  await smartSettle(this.page, budgetOf(this));
});

/**
 * Save the current Podcast episode form (clicks ONLY #edit-submit).
 *
 * Guarded: asserts the page is the episode form first, and afterwards asserts
 * the browser left the form (a validation error keeps you on the form and fails
 * the step) so a rejected save never passes silently.
 *
 * Example #1: When I save the podcast episode
 * Example #2: And I save the podcast episode
 * Example #3: When we save the podcast episode
 * Example #4: And we save the podcast episode
 * Example #5: Given I save the podcast episode
 */
When(/^(?:I |we )*save the podcast episode$/, async function () {
  await assertOnPodcastForm(this.page);
  await this.page.evaluate(() => {
    const el = document.getElementById('edit-submit');
    if (el) el.click();
  });
  await smartSettle(this.page, budgetOf(this));
  const url = this.page.url();
  if (/\/node\/add\/podcast/.test(url) || /\/node\/\d+\/edit/.test(url)) {
    const errors = await this.page.evaluate(() =>
      [...document.querySelectorAll('.messages--error, [data-drupal-messages] .messages--error')]
        .map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
    throw friendly(
      'Saving the podcast episode did not leave the form — the save was rejected.',
      errors ? `Form errors: ${errors}` : 'Check the required episode fields (Summary and Cover art are required).'
    );
  }
});

/**
 * Add the first available image to the episode's required "Cover art" field,
 * from the existing media library.
 *
 * Drives the media_library widget's real modal: a Playwright click on "Add
 * media" (a synthetic in-page click does not fire Drupal's AJAX), waits for the
 * media library view, selects the first media item and inserts it, then asserts
 * the widget shows the selected item. Picking the FIRST item rather than one by
 * name keeps the scenarios independent of which media the site happens to
 * carry — Cover art is required, so every authoring scenario needs one.
 *
 * Example #1: When I add the first available cover art from the media library
 * Example #2: And I add the first available cover art from the media library
 * Example #3: When we add the first available cover art from the media library
 * Example #4: And we add the first available cover art from the media library
 * Example #5: Given I add the first available cover art from the media library
 */
When(/^(?:I |we )*add the first available cover art from the media library$/, async function () {
  await assertOnPodcastForm(this.page);
  const budget = budgetOf(this);
  await dismissAutosaveDialog(this.page, budget);

  // A real Playwright click fires the Drupal AJAX that opens the modal.
  const openButton = this.page.locator(
    '#edit-field-featured-image-open-button, [data-drupal-selector="edit-field-featured-image-open-button"], .field--name-field-featured-image .media-library-open-button, input[id*="field-featured-image-open-button"], button[id*="field-featured-image-open-button"]'
  ).first();
  await openButton.waitFor({ state: 'visible', timeout: 20000 });
  await openButton.click();

  // Wait for the media library modal dialog.
  await this.page.locator('.media-library-widget-modal, .ui-dialog .media-library-view, [role="dialog"] .media-library-view')
    .first().waitFor({ state: 'visible', timeout: 30000 });

  // The library opens on whichever media type comes first, which is not
  // necessarily Image — an empty tab renders "No media available" and no
  // selectable item. Switch to the Image tab when one is offered.
  const itemSelector = '.media-library-view .js-media-library-item input[type="checkbox"], .media-library-view .media-library-item input[type="checkbox"], .media-library-widget-modal .media-library-item input[type="checkbox"]';
  if (!(await this.page.locator(itemSelector).count())) {
    // Target the Image tab by its own menu-item class rather than by link text:
    // the link carries visually-hidden state text, so a text match is unreliable.
    const imageTab = this.page.locator('.media-library-menu-image a, li.media-library-menu-image a, .media-library-menu__item.media-library-menu-image a').first();
    if (await imageTab.count()) {
      await imageTab.click();
      await smartSettle(this.page, budget);
      await this.page.locator(itemSelector).first().waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});
    }
  }

  const firstItem = this.page.locator(itemSelector).first();
  await firstItem.waitFor({ state: 'attached', timeout: 30000 }).catch(async () => {
    const tabs = await this.page.locator('.js-media-library-menu a, .media-library-menu a, .media-library-menu__link').allTextContents();
    throw friendly(
      'The media library opened but shows no selectable image to add as cover art.',
      `Media type tabs offered: ${tabs.map((s) => s.trim()).filter(Boolean).join(', ') || 'none'}. Ensure the site has at least one image media item the author can use.`
    );
  });
  await firstItem.check({ force: true });
  await smartSettle(this.page, budget);

  // Click "Insert selected" in the modal button pane (a real click, for AJAX).
  const insert = this.page.locator('.ui-dialog-buttonpane button:has-text("Insert selected"), .media-library-widget-modal button:has-text("Insert selected"), [role="dialog"] button:has-text("Insert selected")').first();
  await insert.waitFor({ state: 'visible', timeout: 20000 });
  await insert.click();
  await smartSettle(this.page, budget);

  // The widget should now show the selected media item.
  const selected = this.page.locator('.field--name-field-featured-image .media-library-item, [data-drupal-selector="edit-field-featured-image-selection"] .media-library-item, .media-library-selection .media-library-item').first();
  await selected.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {
    throw friendly('The Cover art widget shows no selected media after inserting.');
  });
});

/**
 * Upload the example audio file into the episode's "Audio file" field.
 *
 * field_audio is a file_generic widget: setting the file input fires Drupal's
 * auto-upload AJAX, and where that behaviour is not attached the widget's own
 * "Upload" button is clicked instead. Asserts the uploaded file is listed by
 * the widget afterwards, so a failed upload fails here rather than as a
 * confusing save error later.
 *
 * Example #1: When I upload the example audio file
 * Example #2: And I upload the example audio file
 * Example #3: When we upload the example audio file
 * Example #4: And we upload the example audio file
 * Example #5: Given I upload the example audio file
 */
When(/^(?:I |we )*upload the example audio file$/, async function () {
  await assertOnPodcastForm(this.page);
  const budget = budgetOf(this);

  const input = this.page.locator('input[type="file"][name^="files[field_audio"]').first();
  await input.waitFor({ state: 'attached', timeout: 20000 }).catch(() => {
    throw friendly(
      'The episode form has no "Audio file" upload input.',
      'Open the Audio tab first, and check field_audio is on the default form display.'
    );
  });
  await input.setInputFiles(`${process.cwd()}/tests/assets/varbase-example-episode.wav`);
  await smartSettle(this.page, budget);

  // Without Drupal's auto-upload behaviour the widget still shows its Upload
  // button — press it rather than assuming the AJAX already ran.
  const uploadButton = this.page.locator('input[name^="field_audio"][name$="_upload_button"], button[name^="field_audio"][name$="_upload_button"]').first();
  if (await uploadButton.count()) {
    const visible = await uploadButton.isVisible().catch(() => false);
    if (visible) {
      await uploadButton.click();
      await smartSettle(this.page, budget);
    }
  }

  const uploaded = this.page.locator('.field--name-field-audio a[href*="varbase-example-episode"], .js-form-managed-file a[href*="varbase-example-episode"]').first();
  await uploaded.waitFor({ state: 'attached', timeout: 30000 }).catch(() => {
    throw friendly(
      'The Audio file widget does not list the uploaded file after the upload.',
      'Check the allowed extensions on field_audio (mp3 m4a ogg wav) and the file directory permissions.'
    );
  });
});

/**
 * Open the edit form of the Podcast episode currently being viewed.
 *
 * Example #1: When I open the edit form for the podcast episode I am viewing
 * Example #2: And I open the edit form for the podcast episode I am viewing
 * Example #3: When we open the edit form for the podcast episode I am viewing
 * Example #4: And we open the edit form for the podcast episode I am viewing
 * Example #5: Given I open the edit form for the podcast episode I am viewing
 */
When(/^(?:I |we )*open the edit form for the podcast episode I am viewing$/, async function () {
  const nid = await currentEpisodeNid(this.page);
  if (!nid) {
    throw friendly('Could not determine the node id of the podcast episode being viewed.', 'Open the episode full page before editing it.');
  }
  await this.page.goto(`${this.launchUrl.replace(/\/$/, '')}/node/${nid}/edit`, { waitUntil: 'domcontentloaded' });
  await smartSettle(this.page, budgetOf(this));
  await assertOnPodcastForm(this.page);
});

/**
 * Delete the Podcast episode currently being viewed, through the core delete
 * confirm form (clicks ONLY that form's #edit-submit). Keeps the authoring
 * scenarios independent by removing what they create.
 *
 * Example #1: When I delete the podcast episode I am viewing
 * Example #2: And I delete the podcast episode I am viewing
 * Example #3: When we delete the podcast episode I am viewing
 * Example #4: And we delete the podcast episode I am viewing
 * Example #5: Given I delete the podcast episode I am viewing
 */
When(/^(?:I |we )*delete the podcast episode I am viewing$/, async function () {
  const nid = await currentEpisodeNid(this.page);
  if (!nid) {
    throw friendly('Could not determine the node id of the podcast episode being viewed.', 'Open the episode full page before deleting it.');
  }
  await this.page.goto(`${this.launchUrl.replace(/\/$/, '')}/node/${nid}/delete`, { waitUntil: 'domcontentloaded' });
  const onDelete = /\/node\/\d+\/delete/.test(this.page.url()) && (await this.page.locator('#edit-submit').count()) > 0;
  if (!onDelete) {
    throw friendly(`Expected the node delete confirm form, but got "${this.page.url()}".`);
  }
  await this.page.evaluate(() => {
    const el = document.getElementById('edit-submit');
    if (el) el.click();
  });
  await smartSettle(this.page, budgetOf(this));
});

/**
 * Assert the podcasts listing result summary reports a given "of N" total.
 *
 * The Varbase result summary renders as e.g. "Shown articles: 1-12 of 15", so
 * this asserts the "of N" total in a theme-agnostic way.
 *
 * Example #1: Then the podcasts result summary should show a total of 15
 * Example #2: And the podcasts result summary should show a total of 1
 * Example #3: Then the podcasts result summary should show a total of 8
 * Example #4: And the podcasts result summary should show a total of 12
 * Example #5: Then the podcasts result summary should show a total of 3
 */
Then(/^the podcasts result summary should show a total of (\d+)$/, async function (total) {
  const text = (await this.page.locator('body').textContent()) || '';
  const normalized = text.replace(/\s+/g, ' ');
  const re = new RegExp(`of\\s+${total}\\b`);
  assert.ok(
    re.test(normalized),
    friendly(`Expected the podcasts result summary to report "of ${total}", but it did not.`, 'Check the view result summary (e.g. "Shown articles: 1-12 of 15").')
  );
});

/**
 * Assert the related display lists at least N seeded episodes, none of which is
 * the episode whose tag context was given.
 *
 * Counts distinct "Varbase Example Episode NN" episodes on the page, by title
 * text or by their /podcast/varbase-example-episode-NN link, so the assertion
 * holds whichever way the row view mode prints an episode. The excluded episode
 * appearing at all fails the step: that is the display's node-id exclusion
 * argument not resolving.
 *
 * Example #1: Then the related episodes should include at least 3 episodes other than "Varbase Example Episode 01"
 * Example #2: And the related episodes should include at least 1 episode other than "Varbase Example Episode 14"
 * Example #3: Then the related episodes should include at least 2 episodes other than "Varbase Example Episode 07"
 * Example #4: And the related episodes should include at least 3 episodes other than "Varbase Example Episode 14"
 * Example #5: Then the related episodes should include at least 1 episode other than "Varbase Example Episode 01"
 */
Then(/^the related episodes should include at least (\d+) episodes? other than "([^"]*)"$/, async function (least, excluded) {
  const wanted = parseInt(least, 10);
  const found = await this.page.evaluate(() => {
    const scope = document.querySelector('main') || document.body;
    const numbers = new Set();
    for (const m of (scope.textContent || '').matchAll(/Varbase Example Episode (\d{2})\b/g)) numbers.add(m[1]);
    for (const a of scope.querySelectorAll('a[href*="/podcast/varbase-example-episode-"]')) {
      const m = a.getAttribute('href').match(/varbase-example-episode-(\d{2})/);
      if (m) numbers.add(m[1]);
    }
    return [...numbers].sort();
  });
  const excludedNumber = (excluded.match(/(\d{2})$/) || [])[1];
  assert.ok(
    !found.includes(excludedNumber),
    friendly(`The related display lists "${excluded}" itself; the episode exclusion argument is not working.`)
  );
  assert.ok(
    found.length >= wanted,
    friendly(
      `Expected the related display to list at least ${wanted} other episode(s), but it lists ${found.length} (${found.map((n) => 'Episode ' + n).join(', ') || 'none'}).`,
      'Check the related display arguments: the tag filter, and the node id it excludes.'
    )
  );
});

/**
 * Assert the episode page renders a playable media element whose source is the
 * given URL (exact) or contains the given file name.
 *
 * Vartheme BS5 ships no audio component, so the episode template renders the
 * `video` component as the player — `<video controls><source src="...">`.
 * Asserting the element and its `src` turns that choice into something the
 * suite checks: a template that stops rendering the player, or binds it to the
 * wrong field, fails here.
 *
 * Example #1: Then the episode page should play media from "https://example.com/podcasts/episode.mp3"
 * Example #2: And the episode page should play media from "varbase-example-episode"
 * Example #3: Then the episode page should play media from "varbase-example-episode.wav"
 * Example #4: And the episode page should play media from "https://example.com/podcasts/varbase-example-episode-01.mp3"
 * Example #5: Then the episode page should play media from "episode"
 */
Then(/^the episode page should play media from "([^"]*)"$/, async function (expected) {
  const found = await this.page.evaluate(() =>
    [...document.querySelectorAll('video, audio')].map((el) => {
      const sources = [el.getAttribute('src'), ...[...el.querySelectorAll('source')].map((s) => s.getAttribute('src'))];
      return { tag: el.tagName.toLowerCase(), controls: el.hasAttribute('controls'), sources: sources.filter(Boolean) };
    }));
  const isUrl = /^https?:\/\//.test(expected);
  const match = found.find((m) => m.sources.some((s) => (isUrl ? s === expected : s.includes(expected))));
  assert.ok(
    match,
    friendly(
      `Expected a <video>/<audio> element playing "${expected}", but found: ${JSON.stringify(found)}.`,
      'Check the episode full content template binds the video component to field_audio / field_audio_url.'
    )
  );
  assert.ok(match.controls, friendly(`The ${match.tag} playing "${expected}" has no controls, so a visitor cannot play it.`));
});

/**
 * Assert the episode page being viewed offers no audio at all — neither an
 * audio player nor a link to an audio file.
 *
 * Both audio fields are optional by design, so an episode drafted before its
 * recording exists has to render as a normal page rather than as a broken
 * player.
 *
 * Example #1: Then the podcast episode page should offer no audio
 * Example #2: And the podcast episode page should offer no audio
 * Example #3: Then the podcast episode page should offer no audio
 * Example #4: And the podcast episode page should offer no audio
 * Example #5: Then the podcast episode page should offer no audio
 */
Then(/^the podcast episode page should offer no audio$/, async function () {
  const audio = await this.page.evaluate(() => {
    // Vartheme BS5 has no audio component, so the episode template renders its
    // `video` component as the player: count <video> as well as <audio>.
    const players = document.querySelectorAll('audio, video').length;
    const links = [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => /\.(mp3|m4a|ogg|wav)(\?|$)/i.test(h));
    return { players, links };
  });
  assert.strictEqual(
    audio.players, 0,
    friendly(`Expected no audio player on an episode with no audio, but found ${audio.players}.`)
  );
  assert.strictEqual(
    audio.links.length, 0,
    friendly(`Expected no audio link on an episode with no audio, but found: ${audio.links.join(', ')}.`)
  );
});
