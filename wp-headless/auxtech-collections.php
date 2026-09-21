<?php
/**
 * Plugin Name: Auxtech Collections
 * Description: Registers every content type the headless frontend reads, with REST-visible meta, and hands them to LivePress for visual editing. MU-plugin — always on.
 * Version: 1.0.0
 *
 * The frontend's collection registry (src/lib/cms.ts) maps each collection to
 * a `/wp/v2/<type>` endpoint and reads flat meta keys off the doc. This file
 * is the server half of that contract: post type names are chosen so the
 * default `rest_base` already matches the path the frontend asks for, and
 * every meta key the mapper touches is registered `show_in_rest` so it comes
 * back on the doc instead of silently missing.
 *
 * Repeater fields are JSON strings and line-list fields are newline-joined,
 * because that is what the frontend's `rows()` and `lines()` helpers parse.
 * Booleans are the string "1" — `mBool()` accepts true, 1 and "1".
 *
 * `page-attributes` is on every type so `menu_order` is editable: that is how
 * the frontend orders catalogs, and how you rearrange them.
 */

defined( 'ABSPATH' ) || exit;

/* ------------------------------------------------------------------ */
/* Field groups                                                        */
/* ------------------------------------------------------------------ */

/** SEO pair carried by most public docs. */
const AUXTECH_SEO = array( 'meta_title', 'meta_description' );

/** Shared hero/banner block for the four catalog types. */
const AUXTECH_CATALOG = array(
	'eyebrow',
	'heading',
	'heading_em',
	'heading_after',
	'subtitle',
	'summary',
	'icon',
	/* Hero image as a URL. LivePress pairs an `image` field with `image_alt`
	 * and keeps the two in step when the picture changes, so the alt text can
	 * never end up describing a picture that is no longer there. */
	'image',
	'image_alt',
	/* Which sections the page renders, and in what order — one key per line.
	 * Empty means the page's own coded order. Removing a line hides that
	 * section, which is how a section is deleted without a deploy. */
	'section_order',
	/* Sections authored in the CMS, as a JSON repeater. Rendered wherever
	 * `section_order` names `cms-blocks`. */
	'page_blocks',
	'banner_message_line1',
	'banner_message_line2',
	'banner_title',
	'banner_title_em',
	'banner_title_after',
	'banner_label',
	'meta_title',
	'meta_description',
);

/**
 * Every post type this site exposes.
 *
 * `meta` lists the keys registered against the type. `menu_icon` and `label`
 * are cosmetic; `rest_base` is deliberately left to WordPress, which defaults
 * it to the post type name — the names below are the names the frontend asks
 * for.
 */
function auxtech_collections_defs(): array {
	return array(
		'service'     => array(
			'label'  => 'Services',
			'single' => 'Service',
			'icon'   => 'dashicons-hammer',
			'meta'   => array_merge( AUXTECH_CATALOG, array( 'features', 'steps', 'benefits', 'faqs' ) ),
		),
		'solution'    => array(
			'label'  => 'Solutions',
			'single' => 'Solution',
			'icon'   => 'dashicons-lightbulb',
			'meta'   => array_merge( AUXTECH_CATALOG, array( 'features', 'steps', 'benefits', 'faqs' ) ),
		),
		'industry'    => array(
			'label'  => 'Industries',
			'single' => 'Industry',
			'icon'   => 'dashicons-building',
			'meta'   => array_merge( AUXTECH_CATALOG, array( 'matches', 'points', 'stats' ) ),
		),
		'tool'        => array(
			'label'  => 'Tools',
			'single' => 'Tool',
			'icon'   => 'dashicons-admin-tools',
			'meta'   => array_merge( AUXTECH_CATALOG, array( 'checks' ) ),
		),
		'project'     => array(
			'label'  => 'Works',
			'single' => 'Work',
			'icon'   => 'dashicons-portfolio',
			'meta'   => array_merge(
				AUXTECH_SEO,
				array(
					'client',
					'industry',
					'year',
					'tag',
					'summary',
					'cover_image',
					'cover_image_alt',
					'featured',
					'challenge',
					'approach',
					'results',
					'services_list',
					'stack',
					'testimonial_quote',
					'testimonial_author',
					'testimonial_role',
				)
			),
		),
		'team'        => array(
			'label'  => 'Team',
			'single' => 'Team Member',
			'icon'   => 'dashicons-groups',
			'meta'   => array( 'role', 'bio' ),
		),
		'plan'        => array(
			'label'  => 'Pricing Plans',
			'single' => 'Plan',
			'icon'   => 'dashicons-money-alt',
			'meta'   => array( 'price', 'period', 'description', 'features', 'cta_label', 'cta_url', 'featured' ),
		),
		'faq'         => array(
			'label'  => 'FAQs',
			'single' => 'FAQ',
			'icon'   => 'dashicons-editor-help',
			'meta'   => array( 'answer', 'category' ),
		),
		'job'         => array(
			'label'  => 'Jobs',
			'single' => 'Job',
			'icon'   => 'dashicons-businessperson',
			'meta'   => array( 'department', 'type', 'location', 'salary', 'job_tags', 'apply_url', 'open' ),
		),
		'learning'    => array(
			'label'  => 'Learning',
			'single' => 'Learning Item',
			'icon'   => 'dashicons-welcome-learn-more',
			'meta'   => array_merge( AUXTECH_SEO, array( 'type', 'summary', 'format' ) ),
		),
		'testimonial' => array(
			'label'  => 'Testimonials',
			'single' => 'Testimonial',
			'icon'   => 'dashicons-format-quote',
			'meta'   => array( 'quote', 'author', 'role', 'company', 'rating', 'featured' ),
		),
		'resource'    => array(
			'label'  => 'Resources',
			'single' => 'Resource',
			'icon'   => 'dashicons-media-document',
			'meta'   => array_merge( AUXTECH_SEO, array( 'summary', 'type', 'url' ) ),
		),
	);
}

/* ------------------------------------------------------------------ */
/* Registration                                                        */
/* ------------------------------------------------------------------ */

add_action( 'init', function () {
	foreach ( auxtech_collections_defs() as $type => $def ) {
		register_post_type( $type, array(
			'labels'       => array(
				'name'               => $def['label'],
				'singular_name'      => $def['single'],
				'add_new_item'       => 'Add ' . $def['single'],
				'edit_item'          => 'Edit ' . $def['single'],
				'new_item'           => 'New ' . $def['single'],
				'view_item'          => 'View ' . $def['single'],
				'search_items'       => 'Search ' . $def['label'],
				'not_found'          => 'No ' . strtolower( $def['label'] ) . ' yet',
				'all_items'          => 'All ' . $def['label'],
				'menu_name'          => $def['label'],
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
			'menu_icon'    => $def['icon'],
			'supports'     => array( 'title', 'editor', 'excerpt', 'page-attributes', 'thumbnail', 'custom-fields', 'revisions' ),
			'has_archive'  => false,
			'rewrite'      => false,
		) );

		foreach ( $def['meta'] as $key ) {
			register_post_meta( $type, $key, array(
				'type'          => 'string',
				'single'        => true,
				'default'       => '',
				'show_in_rest'  => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			) );
		}
	}

	/* Blog posts are core `post`; they still carry the SEO pair. */
	foreach ( AUXTECH_SEO as $key ) {
		register_post_meta( 'post', $key, array(
			'type'          => 'string',
			'single'        => true,
			'default'       => '',
			'show_in_rest'  => true,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
}, 5 );

/* ------------------------------------------------------------------ */
/* Hand the types to LivePress                                         */
/* ------------------------------------------------------------------ */

/**
 * Every type above opens in the LivePress fullscreen editor instead of the
 * block editor, provided a matching `collection:<type>` schema exists.
 */
add_filter( 'livepress_collections', function ( $types ) {
	return array_values( array_unique( array_merge(
		(array) $types,
		array_keys( auxtech_collections_defs() )
	) ) );
} );
