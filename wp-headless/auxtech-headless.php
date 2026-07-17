<?php
/**
 * Plugin Name: Auxtech Headless Bridge
 * Description: Globals REST endpoints (header/footer/site settings) + CORS for the headless frontend. MU-plugin — always on.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/** Option keys holding the site globals (JSON-encoded arrays). */
const AUXTECH_GLOBAL_KEYS = array( 'site_settings', 'header', 'footer' );

/** Origins allowed to read the API. Filter `auxtech_allowed_origins` to extend in prod. */
function auxtech_allowed_origins(): array {
	return apply_filters( 'auxtech_allowed_origins', array(
		'http://localhost:8080',
		'http://127.0.0.1:8080',
	) );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'auxtech/v1', '/globals', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$out = array();
			foreach ( AUXTECH_GLOBAL_KEYS as $key ) {
				$out[ $key ] = get_option( 'auxtech_' . $key, null );
			}
			return rest_ensure_response( $out );
		},
	) );

	register_rest_route( 'auxtech/v1', '/globals/(?P<key>[a-z_]+)', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function ( $request ) {
			$key = sanitize_key( $request['key'] );
			if ( ! in_array( $key, AUXTECH_GLOBAL_KEYS, true ) ) {
				return new WP_Error( 'not_found', 'Unknown global', array( 'status' => 404 ) );
			}
			return rest_ensure_response( get_option( 'auxtech_' . $key, null ) );
		},
	) );
} );

/**
 * Headless: WP never renders a public site. Any normal front-end request is
 * redirected to the real frontend (filter `auxtech_frontend_url` in prod).
 * Admin, login, REST, and cron are untouched.
 */
add_action( 'template_redirect', function () {
	if ( is_admin() || is_user_logged_in() ) {
		return;
	}
	// The `wphome` experiment page renders inside WP itself — never redirect it.
	if ( is_page( 'wphome' ) ) {
		return;
	}
	$frontend = apply_filters( 'auxtech_frontend_url', 'http://localhost:8080' );
	wp_redirect( $frontend, 302 );
	exit;
} );

/**
 * Live preview while editing: an iframe of the real frontend on the Home Page
 * edit screen. Content saves → hit Refresh in the box → see it live.
 */
add_action( 'add_meta_boxes', function () {
	add_meta_box(
		'auxtech-live-preview',
		'Live Site Preview',
		function () {
			$url = apply_filters( 'auxtech_frontend_url', 'http://localhost:8080' );
			echo '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">';
			echo '<button type="button" class="button" onclick="document.getElementById(\'auxtech-preview-frame\').src=document.getElementById(\'auxtech-preview-frame\').src;">↻ Refresh preview</button>';
			echo '<a class="button" href="' . esc_url( $url ) . '" target="_blank" rel="noopener">Open site ↗</a>';
			echo '<span style="color:#777;">Save your changes, then refresh — the site renders your live content.</span>';
			echo '</div>';
			echo '<iframe id="auxtech-preview-frame" src="' . esc_url( $url ) . '" style="width:100%;height:640px;border:1px solid #333;border-radius:8px;background:#0b0e1a;"></iframe>';
		},
		array( 'homepage' ),
		'normal',
		'high'
	);
} );

/** Contact-form submissions: private CPT (readable in wp-admin) + POST endpoint. */
add_action( 'init', function () {
	register_post_type( 'submission', array(
		'labels'       => array( 'name' => 'Form Submissions', 'singular_name' => 'Submission' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-email-alt',
		'supports'     => array( 'title', 'custom-fields' ),
		'capabilities' => array( 'create_posts' => 'do_not_allow' ), // admin reads, API writes
		'map_meta_cap' => true,
	) );
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'auxtech/v1', '/contact', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( $request ) {
			$data = $request->get_json_params();
			if ( ! is_array( $data ) || empty( $data ) ) {
				return new WP_Error( 'bad_request', 'Empty submission', array( 'status' => 400 ) );
			}
			// Cheap abuse guards: cap field count + size, strip everything.
			if ( count( $data ) > 20 ) {
				return new WP_Error( 'bad_request', 'Too many fields', array( 'status' => 400 ) );
			}
			$clean = array();
			foreach ( $data as $k => $v ) {
				if ( ! is_scalar( $v ) ) { continue; }
				$clean[ sanitize_key( $k ) ] = mb_substr( sanitize_textarea_field( (string) $v ), 0, 5000 );
			}
			$name  = $clean['name'] ?? ( $clean['email'] ?? 'Submission' );
			$id    = wp_insert_post( array(
				'post_type'   => 'submission',
				'post_status' => 'private',
				'post_title'  => $name . ' — ' . gmdate( 'Y-m-d H:i' ),
				'meta_input'  => $clean,
			), true );
			if ( is_wp_error( $id ) ) {
				return new WP_Error( 'server_error', 'Could not save', array( 'status' => 500 ) );
			}
			$admin_email = get_option( 'admin_email' );
			if ( $admin_email ) {
				$body = '';
				foreach ( $clean as $k => $v ) { $body .= "$k: $v\n"; }
				wp_mail( $admin_email, 'New contact submission — ' . $name, $body );
			}
			return rest_ensure_response( array( 'ok' => true, 'id' => $id ) );
		},
	) );
} );

/** CORS: allow the frontend origin on REST GET requests. */
add_action( 'rest_api_init', function () {
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function ( $value ) {
		$origin = get_http_origin();
		if ( $origin && in_array( $origin, auxtech_allowed_origins(), true ) ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
			header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Content-Type' );
			header( 'Vary: Origin' );
		}
		return $value;
	} );
}, 15 );
