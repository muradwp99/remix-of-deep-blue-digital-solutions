<?php
/**
 * Plugin Name: Auxtech Production Config
 * Description: Points the headless bridge and LivePress at the production frontend. MU-plugin — always on.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

const AUXTECH_FRONTEND = 'https://auxtechint.com';

/* LivePress >= 1.1 reads the `livepress_frontend` option; this filter wins over it. */
add_filter( 'livepress_frontend_url', fn() => AUXTECH_FRONTEND );

/* Legacy filter kept for the headless bridge and any 0.x call sites. */
add_filter( 'auxtech_frontend_url', fn() => AUXTECH_FRONTEND );

/* CORS: the browser fetches footer, design tokens and nav straight from WP. */
add_filter( 'auxtech_allowed_origins', fn( $origins ) => array_merge(
	(array) $origins,
	array( AUXTECH_FRONTEND, 'https://www.auxtechint.com' )
) );

/*
 * Pretty permalinks. The headless frontend calls `<site>/wp-json/...`, which
 * only exists when `permalink_structure` is set — with the default plain
 * structure WordPress answers only `index.php?rest_route=...` and every
 * frontend fetch 404s (fail-soft, so the site silently serves fallback copy).
 * Set once, idempotent; the matching rewrite block lives in the docroot
 * .htaccess.
 */
add_action( 'init', function () {
	if ( '/%postname%/' !== get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
		flush_rewrite_rules( false );
	}
}, 99 );
