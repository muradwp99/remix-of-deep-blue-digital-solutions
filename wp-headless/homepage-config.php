<?php
/**
 * Home page as an editable single-doc CPT.
 * Registers the `homepage` post type + DynamicForge field group, then seeds
 * the one `home` doc with the site's current copy (idempotent: meta is only
 * written when the doc doesn't exist yet, so admin edits are never clobbered).
 * Run: wp eval-file homepage-config.php
 */
use DynamicForge\Data\Storage;

if ( ! class_exists( '\DynamicForge\Data\Storage' ) ) {
	WP_CLI::error( 'DynamicForge not active.' );
}

function hf( $key, $label, $type = 'text', $extra = array() ) {
	return array_merge(
		array( 'key' => $key, 'label' => $label, 'type' => $type, 'show_in_rest' => 1, 'required' => 0 ),
		$extra
	);
}
function hrep( $key, $label, $subs ) {
	$s = array();
	foreach ( $subs as $k => $l ) {
		$s[] = array( 'key' => $k, 'label' => $l[0], 'type' => $l[1] ?? 'text' );
	}
	return hf( $key, $label, 'repeater', array( 'subfields' => $s ) );
}

Storage::save_post_type( 'homepage', array(
	'singular'  => 'Home Page',
	'plural'    => 'Home Page',
	'supports'  => array( 'title', 'custom-fields' ),
	'menu_icon' => 'dashicons-admin-home',
	'advanced'  => array( 'public' => 1, 'show_in_rest' => 1, 'has_archive' => 0, 'rewrite_slug' => 'home' ),
) );

Storage::save_field_group( 'cpt_homepage', array(
	'title'      => 'Home — Page Content',
	'post_types' => array( 'homepage' ),
	'fields'     => array(
		hf( 'hero_trusted_line', 'Hero — Trusted Line' ),
		hf( 'hero_headline', 'Hero — Headline' ),
		hf( 'hero_subheadline', 'Hero — Subheadline', 'textarea' ),
		hf( 'hero_cta_label', 'Hero — CTA Label' ),
		hf( 'hero_cta_href', 'Hero — CTA Link' ),
		hf( 'hero_cta_note', 'Hero — CTA Note' ),
		hf( 'clients_label', 'Clients — Label' ),
		hf( 'clients_names', 'Clients — Names (one per line)', 'textarea' ),
		hf( 'capabilities_eyebrow', 'Capabilities — Eyebrow' ),
		hf( 'capabilities_heading', 'Capabilities — Heading' ),
		hrep( 'capabilities_items', 'Capabilities — Cards', array(
			'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ) ) ),
		hrep( 'stats', 'Stats — Counters', array(
			'value' => array( 'Value' ), 'label' => array( 'Label' ) ) ),
		hf( 'solutions_eyebrow', 'Solutions — Eyebrow' ),
		hf( 'solutions_heading', 'Solutions — Heading' ),
		hrep( 'solutions_items', 'Solutions — Cards', array(
			'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ) ) ),
		hf( 'process_eyebrow', 'Process — Eyebrow' ),
		hf( 'process_heading', 'Process — Heading' ),
		hf( 'process_intro', 'Process — Intro', 'textarea' ),
		hrep( 'process_items', 'Process — Steps', array(
			'n' => array( 'Number' ), 't' => array( 'Title' ), 'd' => array( 'Description', 'textarea' ) ) ),
		hf( 'work_eyebrow', 'Work — Eyebrow' ),
		hf( 'work_heading', 'Work — Heading' ),
		hrep( 'work_items', 'Work — Cards', array(
			'name' => array( 'Name' ), 'tag' => array( 'Tag' ), 'result' => array( 'Result' ), 'img' => array( 'Image URL', 'url' ) ) ),
		hf( 'kickoff_eyebrow', 'Kickoff — Eyebrow' ),
		hf( 'kickoff_heading', 'Kickoff — Heading' ),
		hrep( 'kickoff_items', 'Kickoff — Timeline', array(
			'day' => array( 'Day' ), 't' => array( 'Title' ), 'd' => array( 'Description', 'textarea' ) ) ),
		hf( 'why_eyebrow', 'Why — Eyebrow' ),
		hf( 'why_heading', 'Why — Heading' ),
		hrep( 'why_items', 'Why — Cards', array(
			'title' => array( 'Title' ), 'desc' => array( 'Description', 'textarea' ) ) ),
		hf( 'compare_eyebrow', 'Compare — Eyebrow' ),
		hf( 'compare_heading', 'Compare — Heading' ),
		hf( 'compare_typical_title', 'Compare — Left Column Title' ),
		hf( 'compare_northline_title', 'Compare — Right Column Title' ),
		hf( 'compare_typical', 'Compare — Left Rows (one per line)', 'textarea' ),
		hf( 'compare_northline', 'Compare — Right Rows (one per line)', 'textarea' ),
		hf( 'testimonials_eyebrow', 'Testimonials — Eyebrow' ),
		hf( 'testimonials_heading', 'Testimonials — Heading' ),
		hf( 'pricing_eyebrow', 'Pricing — Eyebrow' ),
		hf( 'pricing_heading', 'Pricing — Heading' ),
		hrep( 'pricing_tiers', 'Pricing — Tiers', array(
			't' => array( 'Name' ), 'd' => array( 'Description', 'textarea' ), 'p' => array( 'Price' ), 'featured' => array( 'Featured (1/0)' ) ) ),
		hf( 'pricing_tier_features', 'Pricing — Shared Features (one per line)', 'textarea' ),
		hf( 'faq_eyebrow', 'FAQ — Eyebrow' ),
		hf( 'faq_heading', 'FAQ — Heading' ),
		hrep( 'faq_items', 'FAQ — Items', array(
			'q' => array( 'Question' ), 'a' => array( 'Answer', 'textarea' ) ) ),
		hf( 'audit_eyebrow', 'Audit — Eyebrow' ),
		hf( 'audit_heading', 'Audit — Heading' ),
		hf( 'audit_text', 'Audit — Text', 'textarea' ),
		hf( 'audit_bullets', 'Audit — Bullets (one per line)', 'textarea' ),
		hf( 'cta_eyebrow', 'Final CTA — Eyebrow' ),
		hf( 'cta_heading', 'Final CTA — Heading' ),
		hf( 'cta_text', 'Final CTA — Text', 'textarea' ),
		hf( 'cta_primary_label', 'Final CTA — Primary Button' ),
		hf( 'cta_secondary_label', 'Final CTA — Secondary Button' ),
	),
) );

/* Seed the single doc — only when it doesn't exist yet. */
$existing = get_posts( array( 'post_type' => 'homepage', 'name' => 'home', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids' ) );
if ( $existing ) {
	flush_rewrite_rules( false );
	WP_CLI::success( 'homepage structure updated; doc already exists (id ' . $existing[0] . ') — content untouched.' );
	return;
}

$j = function ( $rows ) { return wp_json_encode( $rows, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); };

$id = wp_insert_post( wp_slash( array(
	'post_type'   => 'homepage',
	'post_name'   => 'home',
	'post_title'  => 'Home',
	'post_status' => 'publish',
	'meta_input'  => array(
		'hero_trusted_line' => '25+ Founders & Leaders',
		'hero_headline'     => 'Software worth being proud of.',
		'hero_subheadline'  => 'A senior-only studio designing and engineering websites, apps, ecommerce and SaaS for ambitious teams. One team, from strategy to ship.',
		'hero_cta_label'    => 'Get a free audit',
		'hero_cta_href'     => '/contact',
		'hero_cta_note'     => 'Reviewed by a senior engineer, not a bot',
		'clients_label'     => 'Trusted by teams at',
		'clients_names'     => "Meridian\nHalcyon\nNorthwind\nOrbital\nCascade\nVantage\nRidgeline",
		'capabilities_eyebrow' => 'Core capabilities',
		'capabilities_heading' => 'End-to-end services, delivered by one senior team.',
		'capabilities_items'   => $j( array(
			array( 'title' => 'Custom Software', 'desc' => 'Web platforms engineered for speed, scale and reliability.' ),
			array( 'title' => 'UI/UX Design', 'desc' => 'Interfaces that feel obvious. Systems that scale.' ),
			array( 'title' => 'Mobile Apps', 'desc' => 'iOS, Android, and cross-platform, built to ship.' ),
			array( 'title' => 'AI Solutions', 'desc' => 'LLM-powered workflows integrated where it matters.' ),
		) ),
		'stats' => $j( array(
			array( 'value' => '120+', 'label' => 'Products designed, built, and shipped' ),
			array( 'value' => '98', 'label' => 'Median Lighthouse score at launch' ),
			array( 'value' => '84%', 'label' => 'Of clients stay on a Care plan' ),
			array( 'value' => '14', 'label' => 'Days to your first shippable slice' ),
		) ),
		'solutions_eyebrow' => 'Industry solutions',
		'solutions_heading' => 'Purpose-built for the industries we know deeply.',
		'solutions_items'   => $j( array(
			array( 'title' => 'Ecommerce', 'desc' => 'Headless and platform stores that convert.' ),
			array( 'title' => 'SaaS Products', 'desc' => 'MVP to scale — auth, billing, dashboards.' ),
			array( 'title' => 'Fintech', 'desc' => 'Compliant, secure, and beautifully designed.' ),
			array( 'title' => 'Healthcare', 'desc' => 'HIPAA-ready portals, apps, and dashboards.' ),
		) ),
		'process_eyebrow' => 'How we work',
		'process_heading' => 'A transparent, iterative process.',
		'process_intro'   => 'Weekly demos, shared boards, and honest trade-offs. No surprises, no hand-offs to strangers.',
		'process_items'   => $j( array(
			array( 'n' => '01', 't' => 'Discovery', 'd' => 'Deep-dive workshops to align on goals, users, and success metrics.' ),
			array( 'n' => '02', 't' => 'Design', 'd' => 'Wireframes, prototypes, and pixel-perfect interfaces validated with users.' ),
			array( 'n' => '03', 't' => 'Build', 'd' => 'Engineering-first execution with weekly demos and transparent progress.' ),
			array( 'n' => '04', 't' => 'Scale', 'd' => 'Launch, measure, iterate. Long-term partnership beyond delivery.' ),
		) ),
		'work_eyebrow' => 'Selected work',
		'work_heading' => 'Recent case studies.',
		'work_items'   => $j( array(
			array( 'name' => 'Northwind SaaS', 'tag' => 'SaaS Rebrand', 'result' => '+184% signups', 'img' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70' ),
			array( 'name' => 'Halcyon Health', 'tag' => 'Mobile App', 'result' => '4.9★ App Store', 'img' => 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?auto=format&fit=crop&w=1200&q=70' ),
			array( 'name' => 'Meridian Retail', 'tag' => 'Ecommerce', 'result' => '3.1× revenue', 'img' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=70' ),
			array( 'name' => 'Orbital Cloud', 'tag' => 'Marketing Site', 'result' => '98 Lighthouse', 'img' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=70' ),
		) ),
		'kickoff_eyebrow' => 'After you say go',
		'kickoff_heading' => 'Your first 14 days with us.',
		'kickoff_items'   => $j( array(
			array( 'day' => 'Day 1', 't' => 'Kickoff & access', 'd' => 'Shared Slack, repo, and board set up. You meet the whole pod — no bait and switch.' ),
			array( 'day' => 'Day 3', 't' => 'Clickable prototype', 'd' => 'The core flow, tappable in your browser. Direction validated before code is written.' ),
			array( 'day' => 'Day 7', 't' => 'First live demo', 'd' => 'Real features running in staging. Weekly demos from here on out.' ),
			array( 'day' => 'Day 14', 't' => 'Shippable slice', 'd' => 'A production-quality vertical slice, plus a costed roadmap for the rest.' ),
		) ),
		'why_eyebrow' => 'Why Northline',
		'why_heading' => 'A studio, not a factory.',
		'why_items'   => $j( array(
			array( 'title' => 'Senior team, always', 'desc' => 'No juniors farmed out. Principal designers and engineers on every project.' ),
			array( 'title' => 'Design + engineering', 'desc' => "One team, one brief. We build what we design, so quality doesn't fall through." ),
			array( 'title' => 'Long-term partners', 'desc' => '84% of our clients continue with a Care plan after launch.' ),
			array( 'title' => 'Transparent pricing', 'desc' => 'Clear scope, honest budgets, no surprises. Try the calculator on the left.' ),
		) ),
		'compare_eyebrow'         => 'Why teams switch',
		'compare_heading'         => 'The usual way, or the Northline way.',
		'compare_typical_title'   => 'A typical agency',
		'compare_northline_title' => 'Northline',
		'compare_typical'         => "Sales closes the deal, then juniors do the work\nMonthly PDF status reports\nDesign thrown over the wall to developers\nA change order for every tweak\nCode you can't take with you",
		'compare_northline'       => "The seniors you meet are the ones who build\nWeekly live demos in staging\nOne pod — design and engineering together\nTransparent scope and pricing up front\nFull IP and repo handover from day one",
		'testimonials_eyebrow' => 'What partners say',
		'testimonials_heading' => 'Trusted by founders and product leaders.',
		'pricing_eyebrow' => 'Engagement models',
		'pricing_heading' => 'Fair, transparent pricing.',
		'pricing_tiers'   => $j( array(
			array( 't' => 'Fixed Price', 'd' => 'Defined scope, defined budget. Perfect for launches.', 'p' => 'from $8k', 'featured' => '0' ),
			array( 't' => 'Monthly Retainer', 'd' => 'Ongoing partnership with a dedicated pod.', 'p' => 'from $9k/mo', 'featured' => '1' ),
			array( 't' => 'Dedicated Team', 'd' => 'Embedded team scaling with your product.', 'p' => 'custom', 'featured' => '0' ),
		) ),
		'pricing_tier_features' => "Senior team\nWeekly demos\nFull IP transfer",
		'faq_eyebrow' => 'FAQ',
		'faq_heading' => 'Answers to common questions.',
		'faq_items'   => $j( array(
			array( 'q' => 'How quickly can we start?', 'a' => "Typically within 1–2 weeks. We'll scope discovery and align on a start date on our first call." ),
			array( 'q' => 'Do you work with startups or enterprise?', 'a' => "Both. We tailor process and team composition — the craft standard doesn't change." ),
			array( 'q' => "What's your pricing model?", 'a' => 'Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery.' ),
			array( 'q' => 'Who owns the code and IP?', 'a' => 'You do. Full transfer on delivery, with clean docs and repository handover.' ),
			array( 'q' => 'Do you offer post-launch support?', 'a' => 'Yes — 84% of our clients continue on a Care plan for maintenance, iteration, and growth.' ),
		) ),
		'audit_eyebrow' => 'Not ready to commit?',
		'audit_heading' => 'Get a free 48-hour technical audit instead.',
		'audit_text'    => 'Send us your URL. Within two business days you get a prioritized action plan covering speed, SEO, accessibility, and conversion — yours to keep, whoever you build with.',
		'audit_bullets' => "Core Web Vitals breakdown with the three highest-impact fixes\nConversion leaks ranked by estimated revenue impact\nA senior engineer's notes — not an automated report",
		'cta_eyebrow'         => "Let's build",
		'cta_heading'         => 'Have a project in mind?',
		'cta_text'            => 'Tell us about it. We reply within one business day with a plan, a timeline, and a fair budget.',
		'cta_primary_label'   => 'Start a Project',
		'cta_secondary_label' => 'Book Discovery Call',
	),
) ), true );

if ( is_wp_error( $id ) ) {
	WP_CLI::error( 'Seed failed: ' . $id->get_error_message() );
}
flush_rewrite_rules( false );
WP_CLI::success( 'homepage CPT + fields registered, doc seeded (id ' . $id . ').' );
