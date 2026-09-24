<?php

/**
 * @file
 * Test-site provisioning for the functional suite, not recipe configuration.
 *
 * The recipe ships the podcasts view with block displays only, because the
 * podcasts landing page belongs to the site template. This adds /podcasts and
 * /podcasts-related-test/<tag>/<episode> as page displays for the scenarios.
 *
 * Usage: drush php:script tests/scripts/provision-test-pages.php
 */

$view = \Drupal::entityTypeManager()->getStorage("view")->load("podcasts");
$displays = $view->get("display");
$page = $displays["all"];
$page["id"] = "page_test";
$page["display_plugin"] = "page";
$page["display_title"] = "Podcasts test listing";
$page["position"] = 9;
$page["display_options"]["path"] = "podcasts";
$page["display_options"]["title"] = "Podcasts";
$page["display_options"]["defaults"]["title"] = FALSE;
// A landing page carries its own h1; Varbase Starter renders no page title
// block on a view page, so the test page puts it in the view header.
$page["display_options"]["defaults"]["header"] = FALSE;
$page["display_options"]["header"] = $displays["all"]["display_options"]["header"];
$page["display_options"]["header"]["area"]["content"]["value"] = "<h1>Podcasts</h1>";
$page["display_options"]["exposed_block"] = FALSE;
unset($page["display_options"]["block_description"], $page["display_options"]["block_hide_empty"]);
$displays["page_test"] = $page;
$view->set("display", $displays);
$view->save();
// The related display, as a page whose contextual filters come from the
// path: the first argument is the tag, the second the episode to exclude.
// An alias per seeded episode gives each "tag context" a stable URL.
$related = $displays["related"];
$related["id"] = "page_related_test";
$related["display_plugin"] = "page";
$related["display_title"] = "Related podcast episodes test page";
$related["position"] = 10;
$related["display_options"]["path"] = "podcasts-related-test/%/%";
unset($related["display_options"]["block_description"], $related["display_options"]["block_hide_empty"]);
$view = \Drupal::entityTypeManager()->getStorage("view")->load("podcasts");
$displays = $view->get("display");
$displays["page_related_test"] = $related;
$view->set("display", $displays);
$view->save();
\Drupal::service("router.builder")->rebuild();
$aliases = \Drupal::entityTypeManager()->getStorage("path_alias");
foreach (["01", "14"] as $nn) {
  $path = \Drupal::service("path_alias.manager")->getPathByAlias("/podcast/varbase-example-episode-" . $nn);
  $nid = (int) preg_replace("/\\D/", "", $path);
  $node = \Drupal::entityTypeManager()->getStorage("node")->load($nid);
  $tid = (int) $node->get("field_tags")->target_id;
  if ($aliases->loadByProperties(["alias" => "/podcasts-related-test/episode-" . $nn])) {
    continue;
  }
  $aliases->create([
    "path" => "/podcasts-related-test/" . $tid . "/" . $nid,
    "alias" => "/podcasts-related-test/episode-" . $nn,
    "langcode" => "en",
  ])->save();
  print "related context for episode " . $nn . ": tag " . $tid . ", excluding node " . $nid . "\n";
}
print "provisioned: /podcasts and /podcasts-related-test page displays\n";
