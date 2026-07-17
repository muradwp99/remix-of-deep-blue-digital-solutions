<?php
/**
 * Plugin Name: Auxtech Home Template
 * Description: Experiment — renders the Auxtech home design fully inside WordPress as a page template ("Auxtech Home"). Pulls copy from the same `homepage` doc the headless frontend uses.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

const NH_TEMPLATE = 'wphome-template';

/** Offer the template in the Page editor's Template dropdown. */
add_filter( 'theme_page_templates', function ( $templates ) {
	$templates[ NH_TEMPLATE ] = 'Auxtech Home';
	return $templates;
} );

/** Serve our file when a page uses the template. */
add_filter( 'template_include', function ( $template ) {
	if ( is_page() ) {
		$assigned = get_page_template_slug( get_queried_object_id() );
		if ( NH_TEMPLATE === $assigned ) {
			return __DIR__ . '/templates/wphome.php';
		}
	}
	return $template;
} );

/* ---------------- Template data helpers ---------------- */

/** The single homepage doc the headless frontend also reads. */
function nh_home_doc() {
	static $doc = null;
	if ( null === $doc ) {
		$found = get_posts( array(
			'post_type' => 'sitepage', 'name' => 'home',
			'post_status' => 'publish', 'numberposts' => 1,
		) );
		$doc = $found ? $found[0] : false;
	}
	return $doc;
}
function nh_meta( $key, $fallback = '' ) {
	$doc = nh_home_doc();
	if ( ! $doc ) { return $fallback; }
	$v = get_post_meta( $doc->ID, $key, true );
	return ( '' !== $v && null !== $v ) ? (string) $v : $fallback;
}
function nh_rows( $key ) {
	$decoded = json_decode( nh_meta( $key, '[]' ), true );
	return is_array( $decoded ) ? $decoded : array();
}
function nh_lines( $key ) {
	return array_values( array_filter( array_map( 'trim', explode( "\n", nh_meta( $key ) ) ) ) );
}
