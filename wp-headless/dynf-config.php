<?php
/**
 * Auxtech/Auxtech — full DynamicForge structure config.
 * Registers 12 CPTs + field groups (incl. built-in post/page groups).
 * Idempotent: safe to re-run (defs are overwritten wholesale).
 * Run: wp eval-file dynf-config.php
 */
use DynamicForge\Data\Storage;

if ( ! class_exists( '\DynamicForge\Data\Storage' ) ) {
	WP_CLI::error( 'DynamicForge not active.' );
}

/** Shorthand field builders. */
function f( $key, $label, $type = 'text', $extra = array() ) {
	return array_merge( array(
		'key' => $key, 'label' => $label, 'type' => $type,
		'show_in_rest' => 1, 'required' => 0,
	), $extra );
}
function rep( $key, $label, $subfields ) {
	$subs = array();
	foreach ( $subfields as $sk => $conf ) {
		$subs[] = array( 'key' => $sk, 'label' => $conf[0], 'type' => $conf[1] ?? 'text' );
	}
	return f( $key, $label, 'repeater', array( 'subfields' => $subs ) );
}
/** SEO pair used across CPTs. */
function seo_fields() {
	return array(
		f( 'meta_title', 'SEO Title' ),
		f( 'meta_description', 'SEO Description', 'textarea' ),
	);
}
/** The banner group shared by catalog CPTs (flattened). */
function banner_fields( $with_after = true ) {
	$out = array(
		f( 'banner_message_line1', 'Banner — Message Line 1' ),
		f( 'banner_message_line2', 'Banner — Message Line 2' ),
		f( 'banner_title', 'Banner — Title' ),
		f( 'banner_title_em', 'Banner — Title Emphasis' ),
	);
	if ( $with_after ) {
		$out[] = f( 'banner_title_after', 'Banner — Title After' );
	}
	$out[] = f( 'banner_label', 'Banner — CTA Label' );
	return $out;
}
/** Catalog hero fields shared by service/solution/industry/tool. */
function hero_fields( $with_after = true ) {
	$out = array(
		f( 'eyebrow', 'Eyebrow' ),
		f( 'heading', 'Heading' ),
		f( 'heading_em', 'Heading Emphasis' ),
	);
	if ( $with_after ) {
		$out[] = f( 'heading_after', 'Heading After' );
	}
	$out[] = f( 'subtitle', 'Subtitle', 'textarea' );
	$out[] = f( 'summary', 'Summary (card text)', 'textarea' );
	return $out;
}

function cpt( $slug, $singular, $plural, $icon, $rewrite, $supports, $extra_adv = array() ) {
	Storage::save_post_type( $slug, array(
		'singular'  => $singular,
		'plural'    => $plural,
		'supports'  => $supports,
		'menu_icon' => $icon,
		'advanced'  => array_merge( array(
			'public'       => 1,
			'show_in_rest' => 1,
			'has_archive'  => 0,
			'rewrite_slug' => $rewrite,
		), $extra_adv ),
	) );
}
function group( $id, $title, $post_types, $fields ) {
	Storage::save_field_group( $id, array(
		'title'      => $title,
		'post_types' => $post_types,
		'fields'     => $fields,
	) );
}

$base   = array( 'title', 'custom-fields' );
$sorted = array( 'title', 'custom-fields', 'page-attributes' );

/* ------------------------------------------------------------------ */
/* Custom post types                                                   */
/* ------------------------------------------------------------------ */

cpt( 'project', 'Project', 'Projects', 'dashicons-portfolio', 'works',
	array( 'title', 'thumbnail', 'custom-fields' ) );
cpt( 'service', 'Service', 'Services', 'dashicons-hammer', 'services', $sorted );
cpt( 'solution', 'Solution', 'Solutions', 'dashicons-lightbulb', 'solutions', $sorted );
cpt( 'industry', 'Industry', 'Industries', 'dashicons-building', 'industries', $sorted );
cpt( 'tool', 'Tool', 'Tools', 'dashicons-admin-tools', 'tools', $sorted );
cpt( 'learning', 'Learning Item', 'Learning', 'dashicons-welcome-learn-more', 'learning',
	array( 'title', 'editor', 'custom-fields', 'page-attributes' ) );
cpt( 'plan', 'Plan', 'Plans', 'dashicons-tickets-alt', 'pricing', $sorted );
cpt( 'resource', 'Resource', 'Resources', 'dashicons-media-document', 'resources', $base );
cpt( 'team', 'Team Member', 'Team', 'dashicons-groups', 'team',
	array( 'title', 'thumbnail', 'custom-fields', 'page-attributes' ) );
cpt( 'testimonial', 'Testimonial', 'Testimonials', 'dashicons-format-quote', 'testimonials', $base );
cpt( 'faq', 'FAQ', 'FAQs', 'dashicons-editor-help', 'faq', $sorted );
cpt( 'job', 'Job', 'Jobs', 'dashicons-id-alt', 'careers', $base );

/* ------------------------------------------------------------------ */
/* Field groups                                                        */
/* ------------------------------------------------------------------ */

group( 'cpt_project', 'Project — Case Study', array( 'project' ), array_merge( array(
	f( 'client', 'Client' ),
	f( 'industry', 'Industry' ),
	f( 'cover_image', 'Cover Image URL', 'url' ),
	f( 'summary', 'Summary', 'textarea' ),
	f( 'tag', 'Tag' ),
	f( 'challenge', 'Challenge', 'textarea' ),
	rep( 'approach', 'Approach Phases', array(
		'phase' => array( 'Phase' ), 'detail' => array( 'Detail', 'textarea' ),
	) ),
	rep( 'results', 'Results', array(
		'value' => array( 'Value' ), 'label' => array( 'Label' ), 'direction' => array( 'Direction' ),
	) ),
	f( 'services_list', 'Services (one per line)', 'textarea' ),
	f( 'stack', 'Stack (one per line)', 'textarea' ),
	f( 'testimonial_quote', 'Testimonial — Quote', 'textarea' ),
	f( 'testimonial_author', 'Testimonial — Author' ),
	f( 'testimonial_role', 'Testimonial — Role' ),
	f( 'year', 'Year' ),
	f( 'featured', 'Featured', 'checkbox' ),
), seo_fields() ) );

$catalog_fields = array_merge(
	hero_fields( true ),
	array(
		rep( 'features', 'Features', array(
			'icon' => array( 'Icon' ), 'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ),
		) ),
		rep( 'steps', 'Process Steps', array(
			'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ),
		) ),
		rep( 'benefits', 'Benefits', array(
			'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ),
		) ),
		rep( 'faqs', 'FAQs', array(
			'question' => array( 'Question' ), 'answer' => array( 'Answer', 'textarea' ),
		) ),
	),
	banner_fields( true ),
	array( f( 'icon', 'Icon' ) ),
	seo_fields()
);
group( 'cpt_service', 'Service — Page Content', array( 'service' ), $catalog_fields );
group( 'cpt_solution', 'Solution — Page Content', array( 'solution' ), $catalog_fields );

group( 'cpt_industry', 'Industry — Page Content', array( 'industry' ), array_merge(
	hero_fields( false ),
	array(
		f( 'matches', 'Matches (one per line)', 'textarea' ),
		rep( 'points', 'Points', array(
			'icon' => array( 'Icon' ), 'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ),
		) ),
		rep( 'stats', 'Stats', array(
			'value' => array( 'Value' ), 'label' => array( 'Label' ),
		) ),
	),
	banner_fields( false ),
	array( f( 'icon', 'Icon' ) ),
	seo_fields()
) );

group( 'cpt_tool', 'Tool — Page Content', array( 'tool' ), array_merge(
	hero_fields( true ),
	array(
		f( 'checks', 'Checklist (one per line)', 'textarea' ),
		f( 'icon', 'Icon' ),
	),
	seo_fields()
) );

group( 'cpt_learning', 'Learning — Details', array( 'learning' ), array_merge( array(
	f( 'type', 'Type', 'select', array( 'options' => array( 'article', 'guide', 'video', 'course', 'webinar' ) ) ),
	f( 'summary', 'Summary', 'textarea' ),
	f( 'format', 'Format' ),
), seo_fields() ) );

group( 'cpt_plan', 'Plan — Pricing', array( 'plan' ), array(
	f( 'price', 'Price' ),
	f( 'period', 'Period' ),
	f( 'description', 'Description', 'textarea' ),
	f( 'features', 'Features (one per line)', 'textarea' ),
	f( 'cta_label', 'CTA Label' ),
	f( 'cta_url', 'CTA URL', 'url' ),
	f( 'featured', 'Featured', 'checkbox' ),
) );

group( 'cpt_resource', 'Resource — Details', array( 'resource' ), array_merge( array(
	f( 'summary', 'Summary', 'textarea' ),
	f( 'type', 'Type' ),
	f( 'url', 'External URL', 'url' ),
	f( 'file_url', 'File URL', 'url' ),
), seo_fields() ) );

group( 'cpt_team', 'Team Member — Profile', array( 'team' ), array(
	f( 'role', 'Role' ),
	f( 'bio', 'Bio', 'textarea' ),
	f( 'linkedin', 'LinkedIn URL', 'url' ),
	f( 'twitter', 'Twitter URL', 'url' ),
	f( 'github', 'GitHub URL', 'url' ),
) );

group( 'cpt_testimonial', 'Testimonial — Details', array( 'testimonial' ), array(
	f( 'quote', 'Quote', 'textarea' ),
	f( 'author', 'Author' ),
	f( 'role', 'Role' ),
	f( 'company', 'Company' ),
	f( 'rating', 'Rating (1–5)', 'number' ),
	f( 'featured', 'Featured', 'checkbox' ),
) );

group( 'cpt_faq', 'FAQ — Answer', array( 'faq' ), array(
	f( 'answer', 'Answer', 'wysiwyg' ),
	f( 'category', 'Category' ),
) );

group( 'cpt_job', 'Job — Details', array( 'job' ), array(
	f( 'department', 'Department' ),
	f( 'type', 'Type' ),
	f( 'location', 'Location' ),
	f( 'salary', 'Salary' ),
	f( 'job_tags', 'Tags (one per line)', 'textarea' ),
	f( 'apply_url', 'Apply URL', 'url' ),
	f( 'open', 'Open', 'checkbox' ),
	f( 'description', 'Description', 'wysiwyg' ),
) );

/* Built-in post + page extra fields. */
group( 'core_post_seo', 'Post — SEO', array( 'post' ), seo_fields() );
group( 'core_page_layout', 'Page — Block Layout', array( 'page' ), array_merge( array(
	f( 'layout_json', 'Layout (block JSON — rendered by the frontend)', 'textarea' ),
), seo_fields() ) );

flush_rewrite_rules( false );
WP_CLI::success( 'DynamicForge structure config applied: 12 CPTs + 16 field groups.' );
