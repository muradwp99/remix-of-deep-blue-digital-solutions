<?php
/**
 * Auxtech/Auxtech — content migration: Payload JSON dumps → WP.
 * Idempotent: posts are matched by (post_type, slug) and updated in place.
 * Run: wp eval-file migrate.php <dump-dir>
 */

$dump_dir = isset( $args[0] ) ? rtrim( $args[0], '/\\' ) : null;
if ( ! $dump_dir || ! is_dir( $dump_dir ) ) {
	WP_CLI::error( 'Pass the payload-dump directory as the first argument.' );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function aux_load( $dir, $name ) {
	$file = $dir . '/' . $name . '.json';
	if ( ! file_exists( $file ) ) {
		return array();
	}
	$j = json_decode( file_get_contents( $file ), true );
	return $j['docs'] ?? $j; // collection or global
}

/** Minimal Payload-Lexical → HTML converter (paragraph/heading/list/quote/link/text formats). */
function aux_lexical_html( $rt ) {
	if ( ! is_array( $rt ) || empty( $rt['root']['children'] ) ) {
		return '';
	}
	return aux_lex_children( $rt['root']['children'] );
}
function aux_lex_children( $nodes ) {
	$html = '';
	foreach ( (array) $nodes as $n ) {
		$html .= aux_lex_node( $n );
	}
	return $html;
}
function aux_lex_node( $n ) {
	$type = $n['type'] ?? '';
	switch ( $type ) {
		case 'paragraph':
			$inner = aux_lex_children( $n['children'] ?? array() );
			return '' === trim( $inner ) ? '' : "<p>$inner</p>\n";
		case 'heading':
			$tag = in_array( $n['tag'] ?? '', array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $n['tag'] : 'h2';
			return "<$tag>" . aux_lex_children( $n['children'] ?? array() ) . "</$tag>\n";
		case 'list':
			$tag = ( ( $n['listType'] ?? '' ) === 'number' ) ? 'ol' : 'ul';
			return "<$tag>" . aux_lex_children( $n['children'] ?? array() ) . "</$tag>\n";
		case 'listitem':
			return '<li>' . aux_lex_children( $n['children'] ?? array() ) . '</li>';
		case 'quote':
			return '<blockquote>' . aux_lex_children( $n['children'] ?? array() ) . "</blockquote>\n";
		case 'link':
		case 'autolink':
			$url = esc_url( $n['fields']['url'] ?? ( $n['url'] ?? '#' ) );
			return '<a href="' . $url . '">' . aux_lex_children( $n['children'] ?? array() ) . '</a>';
		case 'linebreak':
			return '<br>';
		case 'text':
			$t = esc_html( $n['text'] ?? '' );
			$f = (int) ( $n['format'] ?? 0 );
			if ( $f & 16 ) { $t = "<code>$t</code>"; }
			if ( $f & 8 )  { $t = "<u>$t</u>"; }
			if ( $f & 4 )  { $t = "<s>$t</s>"; }
			if ( $f & 2 )  { $t = "<em>$t</em>"; }
			if ( $f & 1 )  { $t = "<strong>$t</strong>"; }
			return $t;
		default:
			return aux_lex_children( $n['children'] ?? array() );
	}
}

/** list[{...}] → JSON string of rows limited to $keys (renames via assoc). */
function aux_rows( $list, $keys ) {
	$out = array();
	foreach ( (array) $list as $row ) {
		if ( ! is_array( $row ) ) { continue; }
		$r = array();
		foreach ( $keys as $from => $to ) {
			$r[ $to ] = (string) ( $row[ $from ] ?? '' );
		}
		$out[] = $r;
	}
	return wp_json_encode( $out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
}
/** list[text] → newline-joined string. */
function aux_lines( $list ) {
	return implode( "\n", array_map( 'strval', (array) $list ) );
}

/** Create-or-update a post by (type, slug); returns post ID. */
function aux_upsert( $type, $slug, $postarr, $meta = array() ) {
	$existing = get_posts( array(
		'post_type' => $type, 'name' => $slug, 'post_status' => 'any',
		'numberposts' => 1, 'fields' => 'ids',
	) );
	$postarr = array_merge( array(
		'post_type' => $type, 'post_name' => $slug, 'post_status' => 'publish',
	), $postarr );
	if ( $existing ) {
		$postarr['ID'] = $existing[0];
		$id = wp_update_post( wp_slash( $postarr ), true );
	} else {
		$id = wp_insert_post( wp_slash( $postarr ), true );
	}
	if ( is_wp_error( $id ) ) {
		WP_CLI::warning( "$type/$slug: " . $id->get_error_message() );
		return 0;
	}
	foreach ( $meta as $k => $v ) {
		update_post_meta( $id, $k, $v );
	}
	return $id;
}

$counts = array();
$tally  = function ( $key ) use ( &$counts ) {
	$counts[ $key ] = ( $counts[ $key ] ?? 0 ) + 1;
};

/* ------------------------------------------------------------------ */
/* 0) Remove the POC sample post                                        */
/* ------------------------------------------------------------------ */
$poc = get_posts( array( 'post_type' => 'project', 'name' => 'aurora-bank-app', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids' ) );
if ( $poc ) {
	wp_delete_post( $poc[0], true );
	WP_CLI::log( 'Removed POC sample project.' );
}

/* ------------------------------------------------------------------ */
/* 1) Taxonomy terms: categories → category, tags → post_tag            */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'categories' ) as $doc ) {
	if ( ! term_exists( $doc['slug'], 'category' ) ) {
		wp_insert_term( $doc['title'], 'category', array( 'slug' => $doc['slug'], 'description' => $doc['description'] ?? '' ) );
	}
	$tally( 'category' );
}
foreach ( aux_load( $dump_dir, 'tags' ) as $doc ) {
	if ( ! term_exists( $doc['slug'], 'post_tag' ) ) {
		wp_insert_term( $doc['title'], 'post_tag', array( 'slug' => $doc['slug'] ) );
	}
	$tally( 'post_tag' );
}

/* ------------------------------------------------------------------ */
/* 2) Blog posts → built-in `post`                                      */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'posts' ) as $doc ) {
	$id = aux_upsert( 'post', $doc['slug'], array(
		'post_title'   => $doc['title'],
		'post_excerpt' => (string) ( $doc['excerpt'] ?? '' ),
		'post_content' => aux_lexical_html( $doc['content'] ?? null ),
		'post_date'    => ! empty( $doc['publishedAt'] ) ? get_date_from_gmt( $doc['publishedAt'] ) : current_time( 'mysql' ),
	), array(
		'meta_title'       => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description' => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	// Relations (arrays of term docs when present).
	foreach ( array( 'categories' => 'category', 'tags' => 'post_tag' ) as $from => $tax ) {
		$slugs = array();
		foreach ( (array) ( $doc[ $from ] ?? array() ) as $rel ) {
			if ( is_array( $rel ) && ! empty( $rel['slug'] ) ) { $slugs[] = $rel['slug']; }
		}
		if ( $slugs && $id ) { wp_set_object_terms( $id, $slugs, $tax ); }
	}
	$tally( 'post' );
}

/* ------------------------------------------------------------------ */
/* 3) Pages → built-in `page` with layout JSON                          */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'pages' ) as $doc ) {
	aux_upsert( 'page', $doc['slug'], array(
		'post_title' => $doc['title'],
	), array(
		'layout_json'      => wp_json_encode( $doc['layout'] ?? array(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ),
		'meta_title'       => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description' => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'page' );
}

/* ------------------------------------------------------------------ */
/* 4) Projects                                                          */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'projects' ) as $doc ) {
	aux_upsert( 'project', $doc['slug'], array(
		'post_title' => $doc['title'],
	), array(
		'client'             => (string) ( $doc['client'] ?? '' ),
		'industry'           => (string) ( $doc['industry'] ?? '' ),
		'summary'            => (string) ( $doc['summary'] ?? '' ),
		'tag'                => (string) ( $doc['tag'] ?? '' ),
		'challenge'          => (string) ( $doc['challenge'] ?? '' ),
		'approach'           => aux_rows( $doc['approach'] ?? array(), array( 'phase' => 'phase', 'detail' => 'detail' ) ),
		'results'            => aux_rows( $doc['results'] ?? array(), array( 'value' => 'value', 'label' => 'label', 'direction' => 'direction' ) ),
		'services_list'      => aux_lines( $doc['services'] ?? array() ),
		'stack'              => aux_lines( $doc['stack'] ?? array() ),
		'testimonial_quote'  => (string) ( $doc['testimonial']['quote'] ?? '' ),
		'testimonial_author' => (string) ( $doc['testimonial']['author'] ?? '' ),
		'testimonial_role'   => (string) ( $doc['testimonial']['role'] ?? '' ),
		'year'               => (string) ( $doc['year'] ?? '' ),
		'featured'           => ! empty( $doc['featured'] ) ? 1 : 0,
		'meta_title'         => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description'   => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'project' );
}

/* ------------------------------------------------------------------ */
/* 5) Catalog: services + solutions (same shape)                        */
/* ------------------------------------------------------------------ */
function aux_catalog_meta( $doc ) {
	return array(
		'eyebrow'             => (string) ( $doc['eyebrow'] ?? '' ),
		'heading'             => (string) ( $doc['heading'] ?? '' ),
		'heading_em'          => (string) ( $doc['headingEm'] ?? '' ),
		'heading_after'       => (string) ( $doc['headingAfter'] ?? '' ),
		'subtitle'            => (string) ( $doc['subtitle'] ?? '' ),
		'summary'             => (string) ( $doc['summary'] ?? '' ),
		'features'            => aux_rows( $doc['features'] ?? array(), array( 'icon' => 'icon', 'title' => 'title', 'desc' => 'desc' ) ),
		'steps'               => aux_rows( $doc['steps'] ?? array(), array( 'title' => 'title', 'desc' => 'desc' ) ),
		'benefits'            => aux_rows( $doc['benefits'] ?? array(), array( 'title' => 'title', 'desc' => 'desc' ) ),
		'faqs'                => aux_rows( $doc['faqs'] ?? array(), array( 'question' => 'question', 'answer' => 'answer' ) ),
		'banner_message_line1'=> (string) ( $doc['banner']['messageLine1'] ?? '' ),
		'banner_message_line2'=> (string) ( $doc['banner']['messageLine2'] ?? '' ),
		'banner_title'        => (string) ( $doc['banner']['title'] ?? '' ),
		'banner_title_em'     => (string) ( $doc['banner']['titleEm'] ?? '' ),
		'banner_title_after'  => (string) ( $doc['banner']['titleAfter'] ?? '' ),
		'banner_label'        => (string) ( $doc['banner']['label'] ?? '' ),
		'icon'                => (string) ( $doc['icon'] ?? '' ),
		'meta_title'          => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description'    => (string) ( $doc['meta']['description'] ?? '' ),
	);
}
foreach ( array( 'services' => 'service', 'solutions' => 'solution' ) as $file => $type ) {
	foreach ( aux_load( $dump_dir, $file ) as $doc ) {
		aux_upsert( $type, $doc['slug'], array(
			'post_title' => $doc['title'],
			'menu_order' => (int) ( $doc['order'] ?? 0 ),
		), aux_catalog_meta( $doc ) );
		$tally( $type );
	}
}

/* ------------------------------------------------------------------ */
/* 6) Industries                                                        */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'industries' ) as $doc ) {
	aux_upsert( 'industry', $doc['slug'], array(
		'post_title' => $doc['title'],
		'menu_order' => (int) ( $doc['order'] ?? 0 ),
	), array(
		'eyebrow'             => (string) ( $doc['eyebrow'] ?? '' ),
		'heading'             => (string) ( $doc['heading'] ?? '' ),
		'heading_em'          => (string) ( $doc['headingEm'] ?? '' ),
		'subtitle'            => (string) ( $doc['subtitle'] ?? '' ),
		'summary'             => (string) ( $doc['summary'] ?? '' ),
		'matches'             => aux_lines( $doc['matches'] ?? array() ),
		'points'              => aux_rows( $doc['points'] ?? array(), array( 'icon' => 'icon', 'title' => 'title', 'desc' => 'desc' ) ),
		'stats'               => aux_rows( $doc['stats'] ?? array(), array( 'value' => 'value', 'label' => 'label' ) ),
		'banner_message_line1'=> (string) ( $doc['banner']['messageLine1'] ?? '' ),
		'banner_message_line2'=> (string) ( $doc['banner']['messageLine2'] ?? '' ),
		'banner_title'        => (string) ( $doc['banner']['title'] ?? '' ),
		'banner_title_em'     => (string) ( $doc['banner']['titleEm'] ?? '' ),
		'banner_label'        => (string) ( $doc['banner']['label'] ?? '' ),
		'icon'                => (string) ( $doc['icon'] ?? '' ),
		'meta_title'          => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description'    => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'industry' );
}

/* ------------------------------------------------------------------ */
/* 7) Tools                                                             */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'tools' ) as $doc ) {
	aux_upsert( 'tool', $doc['slug'], array(
		'post_title' => $doc['title'],
		'menu_order' => (int) ( $doc['order'] ?? 0 ),
	), array(
		'eyebrow'          => (string) ( $doc['eyebrow'] ?? '' ),
		'heading'          => (string) ( $doc['heading'] ?? '' ),
		'heading_em'       => (string) ( $doc['headingEm'] ?? '' ),
		'heading_after'    => (string) ( $doc['headingAfter'] ?? '' ),
		'subtitle'         => (string) ( $doc['subtitle'] ?? '' ),
		'summary'          => (string) ( $doc['summary'] ?? '' ),
		'checks'           => aux_lines( $doc['checks'] ?? array() ),
		'icon'             => (string) ( $doc['icon'] ?? '' ),
		'meta_title'       => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description' => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'tool' );
}

/* ------------------------------------------------------------------ */
/* 8) Learning                                                          */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'learning' ) as $doc ) {
	aux_upsert( 'learning', $doc['slug'], array(
		'post_title'   => $doc['title'],
		'menu_order'   => (int) ( $doc['order'] ?? 0 ),
		'post_content' => aux_lexical_html( $doc['body'] ?? null ),
	), array(
		'type'             => (string) ( $doc['type'] ?? '' ),
		'summary'          => (string) ( $doc['summary'] ?? '' ),
		'format'           => (string) ( $doc['format'] ?? '' ),
		'meta_title'       => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description' => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'learning' );
}

/* ------------------------------------------------------------------ */
/* 9) Plans                                                             */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'plans' ) as $doc ) {
	$features = array();
	foreach ( (array) ( $doc['features'] ?? array() ) as $row ) {
		$features[] = is_array( $row ) ? ( $row['label'] ?? '' ) : (string) $row;
	}
	aux_upsert( 'plan', sanitize_title( $doc['name'] ), array(
		'post_title' => $doc['name'],
		'menu_order' => (int) ( $doc['order'] ?? 0 ),
	), array(
		'price'       => (string) ( $doc['price'] ?? '' ),
		'period'      => (string) ( $doc['period'] ?? '' ),
		'description' => (string) ( $doc['description'] ?? '' ),
		'features'    => implode( "\n", array_filter( $features ) ),
		'cta_label'   => (string) ( $doc['ctaLabel'] ?? '' ),
		'cta_url'     => (string) ( $doc['ctaUrl'] ?? '' ),
		'featured'    => ! empty( $doc['featured'] ) ? 1 : 0,
	) );
	$tally( 'plan' );
}

/* ------------------------------------------------------------------ */
/* 10) Resources                                                        */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'resources' ) as $doc ) {
	aux_upsert( 'resource', $doc['slug'], array(
		'post_title' => $doc['title'],
	), array(
		'summary'          => (string) ( $doc['summary'] ?? '' ),
		'type'             => (string) ( $doc['type'] ?? '' ),
		'url'              => (string) ( $doc['url'] ?? '' ),
		'file_url'         => '',
		'meta_title'       => (string) ( $doc['meta']['title'] ?? '' ),
		'meta_description' => (string) ( $doc['meta']['description'] ?? '' ),
	) );
	$tally( 'resource' );
}

/* ------------------------------------------------------------------ */
/* 11) Team                                                             */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'team' ) as $doc ) {
	aux_upsert( 'team', $doc['slug'], array(
		'post_title' => $doc['name'],
		'menu_order' => (int) ( $doc['order'] ?? 0 ),
	), array(
		'role'     => (string) ( $doc['role'] ?? '' ),
		'bio'      => (string) ( $doc['bio'] ?? '' ),
		'linkedin' => (string) ( $doc['socials']['linkedin'] ?? '' ),
		'twitter'  => (string) ( $doc['socials']['twitter'] ?? '' ),
		'github'   => (string) ( $doc['socials']['github'] ?? '' ),
	) );
	$tally( 'team' );
}

/* ------------------------------------------------------------------ */
/* 12) Testimonials                                                     */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'testimonials' ) as $doc ) {
	aux_upsert( 'testimonial', sanitize_title( $doc['author'] . '-' . ( $doc['company'] ?? '' ) ), array(
		'post_title' => $doc['author'] . ( ! empty( $doc['company'] ) ? ' — ' . $doc['company'] : '' ),
	), array(
		'quote'    => (string) ( $doc['quote'] ?? '' ),
		'author'   => (string) ( $doc['author'] ?? '' ),
		'role'     => (string) ( $doc['role'] ?? '' ),
		'company'  => (string) ( $doc['company'] ?? '' ),
		'rating'   => (int) ( $doc['rating'] ?? 5 ),
		'featured' => ! empty( $doc['featured'] ) ? 1 : 0,
	) );
	$tally( 'testimonial' );
}

/* ------------------------------------------------------------------ */
/* 13) FAQs                                                             */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'faqs' ) as $doc ) {
	aux_upsert( 'faq', sanitize_title( $doc['question'] ), array(
		'post_title' => $doc['question'],
		'menu_order' => (int) ( $doc['order'] ?? 0 ),
	), array(
		'answer'   => aux_lexical_html( $doc['answer'] ?? null ),
		'category' => (string) ( $doc['category'] ?? '' ),
	) );
	$tally( 'faq' );
}

/* ------------------------------------------------------------------ */
/* 14) Jobs                                                             */
/* ------------------------------------------------------------------ */
foreach ( aux_load( $dump_dir, 'jobs' ) as $doc ) {
	aux_upsert( 'job', $doc['slug'], array(
		'post_title' => $doc['title'],
	), array(
		'department'  => (string) ( $doc['department'] ?? '' ),
		'type'        => (string) ( $doc['type'] ?? '' ),
		'location'    => (string) ( $doc['location'] ?? '' ),
		'salary'      => (string) ( $doc['salary'] ?? '' ),
		'job_tags'    => aux_lines( $doc['tags'] ?? array() ),
		'apply_url'   => (string) ( $doc['applyUrl'] ?? '' ),
		'open'        => ! empty( $doc['open'] ) ? 1 : 0,
		'description' => aux_lexical_html( $doc['description'] ?? null ),
	) );
	$tally( 'job' );
}

/* ------------------------------------------------------------------ */
/* 15) Globals → options (served by the Auxtech Headless Bridge)        */
/* ------------------------------------------------------------------ */
$g = aux_load( $dump_dir, 'global-site-settings' );
if ( $g ) {
	update_option( 'auxtech_site_settings', array(
		'siteName' => $g['siteName'] ?? '', 'tagline' => $g['tagline'] ?? '',
		'email' => $g['email'] ?? '', 'phone' => $g['phone'] ?? '', 'address' => $g['address'] ?? '',
		'twitter' => $g['twitter'] ?? '', 'linkedin' => $g['linkedin'] ?? '',
		'github' => $g['github'] ?? '', 'instagram' => $g['instagram'] ?? '',
	) );
	$tally( 'global' );
}
$g = aux_load( $dump_dir, 'global-header' );
if ( $g ) {
	$nav = array();
	foreach ( (array) ( $g['nav'] ?? array() ) as $item ) {
		$children = array();
		foreach ( (array) ( $item['children'] ?? array() ) as $c ) {
			$children[] = array( 'label' => $c['label'] ?? '', 'href' => $c['href'] ?? '' );
		}
		$nav[] = array( 'label' => $item['label'] ?? '', 'href' => $item['href'] ?? '', 'children' => $children );
	}
	update_option( 'auxtech_header', array(
		'nav' => $nav,
		'cta' => array( 'label' => $g['cta']['label'] ?? '', 'href' => $g['cta']['href'] ?? '' ),
	) );
	$tally( 'global' );
}
$g = aux_load( $dump_dir, 'global-footer' );
if ( $g ) {
	$columns = array();
	foreach ( (array) ( $g['columns'] ?? array() ) as $col ) {
		$links = array();
		foreach ( (array) ( $col['links'] ?? array() ) as $l ) {
			$links[] = array( 'label' => $l['label'] ?? '', 'href' => $l['href'] ?? '' );
		}
		$columns[] = array( 'title' => $col['title'] ?? '', 'links' => $links );
	}
	$legal = array();
	foreach ( (array) ( $g['legal'] ?? array() ) as $l ) {
		$legal[] = array( 'label' => $l['label'] ?? '', 'href' => $l['href'] ?? '' );
	}
	update_option( 'auxtech_footer', array(
		'blurb' => $g['blurb'] ?? '', 'columns' => $columns,
		'copyright' => $g['copyright'] ?? '', 'legal' => $legal,
	) );
	$tally( 'global' );
}

/* ------------------------------------------------------------------ */
$summary = array();
foreach ( $counts as $k => $n ) { $summary[] = "$k=$n"; }
WP_CLI::success( 'Migration complete: ' . implode( ', ', $summary ) );
