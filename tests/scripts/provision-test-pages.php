<?php

/**
 * @file
 * Test-site provisioning for the functional suite, not recipe configuration.
 *
 * The recipe ships its views with block displays only, because the podcasts
 * landing pages belong to the site template. This adds three page displays for
 * the scenarios: /podcasts (the shows), /podcast-episodes (every episode, with
 * the filters and the pager) and /podcasts-related-test/<tag>/<episode>.
 *
 * Usage: drush php:script tests/scripts/provision-test-pages.php
 */

/**
 * Copies a block display of a view into a page display at the given path.
 */
function podcasts_test_add_page(string $view_id, string $from, string $id, string $title, string $path, ?string $h1 = NULL): void {
  $view = \Drupal::entityTypeManager()->getStorage('view')->load($view_id);
  $displays = $view->get('display');
  $page = $displays[$from];
  $page['id'] = $id;
  $page['display_plugin'] = 'page';
  $page['display_title'] = $title;
  $page['position'] = count($displays);
  $page['display_options']['path'] = $path;
  $page['display_options']['exposed_block'] = FALSE;
  unset($page['display_options']['block_description'], $page['display_options']['block_hide_empty']);
  if ($h1 !== NULL) {
    // Varbase Starter renders no page title block on a view page, so the
    // landing page carries its h1 in the view header.
    $header = $page['display_options']['header'] ?? $displays['default']['display_options']['header'] ?? [];
    $header = ['area_test_h1' => [
      'id' => 'area_test_h1',
      'table' => 'views',
      'field' => 'area',
      'relationship' => 'none',
      'group_type' => 'group',
      'admin_label' => '',
      'plugin_id' => 'text',
      'empty' => TRUE,
      'content' => ['value' => '<h1>' . $h1 . '</h1>', 'format' => 'code_html'],
      'tokenize' => FALSE,
    ]] + array_filter($header, fn($handler) => !str_contains((string) ($handler['content']['value'] ?? ''), '<h2 class="visually-hidden">'));
    $page['display_options']['defaults']['header'] = FALSE;
    $page['display_options']['header'] = $header;
  }
  $displays[$id] = $page;
  $view->set('display', $displays);
  $view->save();
}

podcasts_test_add_page('podcasts', 'all', 'page_test', 'Podcasts test listing', 'podcasts', 'Podcasts');
podcasts_test_add_page('podcast_episodes', 'all', 'page_test', 'Podcast episodes test listing', 'podcast-episodes', 'Podcast episodes');
// The first argument is the tag, the second the episode to exclude.
podcasts_test_add_page('podcast_episodes', 'related', 'page_related_test', 'Related podcast episodes test page', 'podcasts-related-test/%/%');
\Drupal::service('router.builder')->rebuild();

// An alias per seeded episode gives each "tag context" a stable URL.
$nodes = \Drupal::entityTypeManager()->getStorage('node');
$aliases = \Drupal::entityTypeManager()->getStorage('path_alias');
foreach (['01', '14'] as $nn) {
  if ($aliases->loadByProperties(['alias' => '/podcasts-related-test/episode-' . $nn])) {
    continue;
  }
  $found = $nodes->loadByProperties(['type' => 'podcast_episode', 'title' => 'Varbase Example Episode ' . $nn]);
  $node = reset($found);
  if (!$node) {
    throw new \RuntimeException('Seeded episode ' . $nn . ' is missing; apply the test content recipe first.');
  }
  $tid = (int) $node->get('field_tags')->target_id;
  $aliases->create([
    'path' => '/podcasts-related-test/' . $tid . '/' . $node->id(),
    'alias' => '/podcasts-related-test/episode-' . $nn,
    'langcode' => 'en',
  ])->save();
  print 'related context for episode ' . $nn . ': tag ' . $tid . ', excluding node ' . $node->id() . "\n";
}
print "provisioned: /podcasts, /podcast-episodes and /podcasts-related-test page displays\n";
