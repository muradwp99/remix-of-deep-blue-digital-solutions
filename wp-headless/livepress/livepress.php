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

/** Collections whose edit screens open in the LivePress live editor. */
const LIVEPRESS_COLLECTIONS = array( 'service', 'solution', 'industry' );

/** LivePress home in the sidebar: Site Pages · Menus · Design. */
add_action( 'admin_menu', function () {
	add_menu_page( 'LivePress', 'LivePress', 'edit_pages', 'livepress', function () {}, 'dashicons-visibility', 3 );
	add_submenu_page( 'livepress', 'Site Pages', 'Site Pages', 'edit_pages', 'edit.php?post_type=sitepage' );
	add_submenu_page( 'livepress', 'Menus', 'Menus', 'edit_theme_options', 'livepress-menus', 'livepress_render_menus' );
	add_submenu_page( 'livepress', 'Design', 'Design', 'edit_theme_options', 'livepress-design', 'livepress_render_design' );
	remove_submenu_page( 'livepress', 'livepress' ); // no empty landing page
	// The editor itself stays hidden (opened from lists).
	add_submenu_page( '', 'LivePress', 'LivePress', 'edit_pages', LIVEPRESS_PAGE, 'livepress_render_editor' );
} );

/** Editing a Site Page or a live-enabled collection doc opens LivePress. */
add_action( 'admin_init', function () {
	global $pagenow;
	if ( 'post.php' !== $pagenow || empty( $_GET['post'] ) || 'edit' !== ( $_GET['action'] ?? '' ) ) {
		return;
	}
	$post = get_post( (int) $_GET['post'] );
	if ( $post && ( 'sitepage' === $post->post_type || in_array( $post->post_type, LIVEPRESS_COLLECTIONS, true ) ) ) {
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
	$allowed = $post && ( 'sitepage' === $post->post_type || in_array( $post->post_type, LIVEPRESS_COLLECTIONS, true ) );
	if ( ! $allowed ) {
		echo '<div class="notice notice-error"><p>No LivePress-enabled document selected.</p></div>';
		return;
	}
	$schemas       = livepress_schema();
	$is_collection = 'sitepage' !== $post->post_type;
	$schema        = $is_collection
		? ( $schemas[ 'collection:' . $post->post_type ] ?? null )
		: ( $schemas[ $post->post_name ] ?? null );
	if ( ! $schema ) {
		echo '<div class="notice notice-error"><p>No LivePress schema for "' . esc_html( $post->post_name ) . '".</p></div>';
		return;
	}
	$frontend_path = str_replace( '{slug}', $post->post_name, $schema['frontendPath'] );

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
		'mode'     => $is_collection ? 'collection' : 'page',
		'postId'   => $post->ID,
		'restBase' => $post->post_type,
		'title'    => $post->post_title,
		'slug'     => $post->post_name,
		'frontend' => livepress_frontend(),
		'path'     => $frontend_path,
		'backUrl'  => admin_url( 'edit.php?post_type=' . $post->post_type ),
		'schema'   => $schema,
		'values'   => $values,
	) ) . ';', 'before' );

	echo '<div id="livepress-root"></div>';
}

/** Shared shell for the standalone Menus / Design fullscreen editors. */
function livepress_render_globals_editor( $mode, $title ) {
	wp_enqueue_script( 'wp-api-fetch' );
	wp_enqueue_script( 'livepress-editor', plugins_url( 'assets/editor.js', __FILE__ ), array( 'wp-api-fetch' ), '0.3.0', true );
	wp_enqueue_style( 'livepress-editor', plugins_url( 'assets/editor.css', __FILE__ ), array(), '0.3.0' );
	wp_add_inline_script( 'livepress-editor', 'window.LIVEPRESS = ' . wp_json_encode( array(
		'mode'     => $mode,
		'postId'   => 0,
		'title'    => $title,
		'frontend' => livepress_frontend(),
		'path'     => '/',
		'backUrl'  => admin_url(),
		'schema'   => array( 'sections' => array() ),
		'values'   => array(),
		'globals'  => array(
			'design' => (object) ( get_option( 'auxtech_design', array() ) ?: array() ),
			'nav'    => array_values( (array) get_option( 'auxtech_nav', array() ) ),
			'footer' => (object) ( get_option( 'auxtech_footer', array() ) ?: array() ),
		),
	) ) . ';', 'before' );
	echo '<div id="livepress-root"></div>';
}
function livepress_render_menus() {
	livepress_render_globals_editor( 'menus', 'Site Menus' );
}
function livepress_render_design() {
	livepress_render_globals_editor( 'design', 'Design' );
}

/** Fullscreen: hide every piece of WP admin chrome on the editor page. */
add_action( 'admin_head', function () {
	if ( ! in_array( $_GET['page'] ?? '', array( LIVEPRESS_PAGE, 'livepress-menus', 'livepress-design' ), true ) ) {
		return;
	}
	echo '<style>
		#adminmenumain, #adminmenuback, #adminmenuwrap, #wpadminbar, #wpfooter, #screen-meta-links { display: none !important; }
		#wpcontent, #wpbody-content { margin: 0 !important; padding: 0 !important; }
		html.wp-toolbar { padding-top: 0 !important; }
		#wpbody-content .notice { display: none; }
	</style>';
} );
