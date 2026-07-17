<?php
/**
 * Plugin Name: LivePress
 * Description: Realtime visual editor for the headless frontend. One "Site Pages" list; each page opens a fullscreen editor — fields left, live preview right — streaming every keystroke into the real rendered site.
 * Version: 0.2.0
 */

defined( 'ABSPATH' ) || exit;

const LIVEPRESS_PAGE = 'livepress-editor';

/** Frontend base URL (filter `auxtech_frontend_url` in prod). */
function livepress_frontend(): string {
	return apply_filters( 'auxtech_frontend_url', 'http://localhost:8080' );
}

/** Page schemas: key => { title, frontendPath, sections[] }. */
function livepress_schema(): array {
	return require __DIR__ . '/livepress-schema.php';
}

/* ------------------------------------------------------------------ */
/* Site Pages CPT — ONE list for every editable page                    */
/* ------------------------------------------------------------------ */

add_action( 'init', function () {
	register_post_type( 'sitepage', array(
		'labels'        => array(
			'name'          => 'Site Pages',
			'singular_name' => 'Site Page',
			'all_items'     => 'All Site Pages',
		),
		'public'        => false,
		'show_ui'       => true,
		'show_in_menu'  => true,
		'show_in_rest'  => true,
		'menu_icon'     => 'dashicons-welcome-widgets-menus',
		'menu_position' => 4,
		'supports'      => array( 'title', 'custom-fields' ),
	) );
} );

/* ------------------------------------------------------------------ */
/* Route edits into the fullscreen editor                               */
/* ------------------------------------------------------------------ */

/** Hidden admin page that hosts the editor app. */
add_action( 'admin_menu', function () {
	add_submenu_page( '', 'LivePress', 'LivePress', 'edit_pages', LIVEPRESS_PAGE, 'livepress_render_editor' );
} );

/** Clicking a Site Page anywhere in admin opens LivePress, not the metabox screen. */
add_action( 'admin_init', function () {
	global $pagenow;
	if ( 'post.php' !== $pagenow || empty( $_GET['post'] ) || 'edit' !== ( $_GET['action'] ?? '' ) ) {
		return;
	}
	$post = get_post( (int) $_GET['post'] );
	if ( $post && 'sitepage' === $post->post_type ) {
		wp_safe_redirect( admin_url( 'admin.php?page=' . LIVEPRESS_PAGE . '&post=' . $post->ID ) );
		exit;
	}
} );

/* ------------------------------------------------------------------ */
/* The fullscreen editor                                                */
/* ------------------------------------------------------------------ */

function livepress_render_editor() {
	$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
	$post    = $post_id ? get_post( $post_id ) : null;
	if ( ! $post || 'sitepage' !== $post->post_type ) {
		echo '<div class="notice notice-error"><p>No site page selected.</p></div>';
		return;
	}
	$schemas = livepress_schema();
	$schema  = $schemas[ $post->post_name ] ?? null;
	if ( ! $schema ) {
		echo '<div class="notice notice-error"><p>No LivePress schema for "' . esc_html( $post->post_name ) . '".</p></div>';
		return;
	}

	// Current values for every field in the schema.
	$values = array(
		'section_order' => (string) get_post_meta( $post->ID, 'section_order', true ),
	);
	foreach ( $schema['sections'] as $section ) {
		foreach ( $section['fields'] as $field ) {
			$raw = get_post_meta( $post->ID, $field['key'], true );
			if ( 'repeater' === $field['kind'] ) {
				$decoded                  = json_decode( is_string( $raw ) ? $raw : '[]', true );
				$values[ $field['key'] ] = is_array( $decoded ) ? $decoded : array();
			} else {
				$values[ $field['key'] ] = is_string( $raw ) ? $raw : '';
			}
		}
	}

	wp_enqueue_media();
	wp_enqueue_script( 'wp-api-fetch' );
	wp_enqueue_script(
		'livepress-editor',
		plugins_url( 'assets/editor.js', __FILE__ ),
		array( 'wp-api-fetch' ),
		'0.2.0',
		true
	);
	wp_enqueue_style( 'livepress-editor', plugins_url( 'assets/editor.css', __FILE__ ), array(), '0.2.0' );
	wp_add_inline_script( 'livepress-editor', 'window.LIVEPRESS = ' . wp_json_encode( array(
		'postId'   => $post->ID,
		'restBase' => 'sitepage',
		'title'    => $post->post_title,
		'slug'     => $post->post_name,
		'frontend' => livepress_frontend(),
		'path'     => $schema['frontendPath'],
		'backUrl'  => admin_url( 'edit.php?post_type=sitepage' ),
		'schema'   => $schema,
		'values'   => $values,
		'globals'  => array(
			'design' => (object) ( get_option( 'auxtech_design', array() ) ?: array() ),
			'nav'    => array_values( (array) get_option( 'auxtech_nav', array() ) ),
			'footer' => (object) ( get_option( 'auxtech_footer', array() ) ?: array() ),
		),
	) ) . ';', 'before' );

	echo '<div id="livepress-root"></div>';
}

/** Fullscreen: hide every piece of WP admin chrome on the editor page. */
add_action( 'admin_head', function () {
	if ( ( $_GET['page'] ?? '' ) !== LIVEPRESS_PAGE ) {
		return;
	}
	echo '<style>
		#adminmenumain, #adminmenuback, #adminmenuwrap, #wpadminbar, #wpfooter, #screen-meta-links { display: none !important; }
		#wpcontent, #wpbody-content { margin: 0 !important; padding: 0 !important; }
		html.wp-toolbar { padding-top: 0 !important; }
		#wpbody-content .notice { display: none; }
	</style>';
} );
