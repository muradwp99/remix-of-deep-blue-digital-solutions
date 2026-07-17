<?php
/**
 * LivePress schema registry — one entry per editable site page.
 * kind: text | textarea | lines | repeater. Sub kinds add: image (URL + media picker).
 * `path` mirrors the frontend content object (edit-bridge dot paths).
 */
defined( 'ABSPATH' ) || exit;

$t  = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'text', 'path' => $path );
$ta = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'textarea', 'path' => $path );
$ln = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'lines', 'path' => $path );
$rp = fn( $key, $label, $path, $subs ) => array( 'key' => $key, 'label' => $label, 'kind' => 'repeater', 'path' => $path, 'subs' => $subs );
$s  = fn( $key, $label, $kind = 'text' ) => array( 'key' => $key, 'label' => $label, 'kind' => $kind );

return array(
	'home' => array(
		'title'        => 'Home',
		'frontendPath' => '/',
		'sections'     => array(
			array( 'key' => 'hero', 'label' => 'Hero', 'fields' => array(
				$t( 'hero_trusted_line', 'Trusted line', 'hero.trustedLine' ),
				$t( 'hero_headline', 'Headline', 'hero.headline' ),
				$ta( 'hero_subheadline', 'Subheadline', 'hero.subheadline' ),
				$t( 'hero_cta_label', 'CTA label', 'hero.ctaLabel' ),
				$t( 'hero_cta_href', 'CTA link', 'hero.ctaHref' ),
				$t( 'hero_cta_note', 'CTA note', 'hero.ctaNote' ),
				$rp( 'hero_cards', 'Marquee cards', 'hero.cards', array(
					$s( 'category', 'Category' ), $s( 'title', 'Title' ), $s( 'team', 'Team label' ),
					$s( 'img', 'Cover image', 'image' ),
					$s( 's1v', 'Stat 1 value' ), $s( 's1l', 'Stat 1 label' ),
					$s( 's2v', 'Stat 2 value' ), $s( 's2l', 'Stat 2 label' ),
					$s( 's3v', 'Stat 3 value' ), $s( 's3l', 'Stat 3 label' ) ) ),
			) ),
			array( 'key' => 'clients', 'label' => 'Clients strip', 'fields' => array(
				$t( 'clients_label', 'Label', 'clients.label' ),
				$ln( 'clients_names', 'Client names', 'clients.names' ),
			) ),
			array( 'key' => 'capabilities', 'label' => 'Capabilities', 'fields' => array(
				$t( 'capabilities_eyebrow', 'Eyebrow', 'capabilities.eyebrow' ),
				$t( 'capabilities_heading', 'Heading', 'capabilities.heading' ),
				$rp( 'capabilities_items', 'Cards', 'capabilities.items', array(
					$s( 'title', 'Title' ), $s( 'desc', 'Description', 'textarea' ) ) ),
			) ),
			array( 'key' => 'stats', 'label' => 'Stats counters', 'fields' => array(
				$rp( 'stats', 'Counters', 'stats', array(
					$s( 'value', 'Value' ), $s( 'label', 'Label' ) ) ),
			) ),
			array( 'key' => 'solutions', 'label' => 'Solutions', 'fields' => array(
				$t( 'solutions_eyebrow', 'Eyebrow', 'solutions.eyebrow' ),
				$t( 'solutions_heading', 'Heading', 'solutions.heading' ),
				$rp( 'solutions_items', 'Cards', 'solutions.items', array(
					$s( 'title', 'Title' ), $s( 'desc', 'Description', 'textarea' ) ) ),
			) ),
			array( 'key' => 'process', 'label' => 'Process', 'fields' => array(
				$t( 'process_eyebrow', 'Eyebrow', 'process.eyebrow' ),
				$t( 'process_heading', 'Heading', 'process.heading' ),
				$ta( 'process_intro', 'Intro', 'process.intro' ),
				$rp( 'process_items', 'Steps', 'process.items', array(
					$s( 'n', 'Number' ), $s( 't', 'Title' ), $s( 'd', 'Description', 'textarea' ) ) ),
			) ),
			// Cards themselves auto-mirror the Projects collection (add a
			// project in WP → it appears here and on /works). Only the
			// section heading is edited here.
			array( 'key' => 'work', 'label' => 'Selected work', 'fields' => array(
				$t( 'work_eyebrow', 'Eyebrow', 'work.eyebrow' ),
				$t( 'work_heading', 'Heading', 'work.heading' ),
			) ),
			array( 'key' => 'kickoff', 'label' => 'First 14 days', 'fields' => array(
				$t( 'kickoff_eyebrow', 'Eyebrow', 'kickoff.eyebrow' ),
				$t( 'kickoff_heading', 'Heading', 'kickoff.heading' ),
				$rp( 'kickoff_items', 'Timeline', 'kickoff.items', array(
					$s( 'day', 'Day' ), $s( 't', 'Title' ), $s( 'd', 'Description', 'textarea' ) ) ),
			) ),
			array( 'key' => 'why', 'label' => 'Why Northline', 'fields' => array(
				$t( 'why_eyebrow', 'Eyebrow', 'why.eyebrow' ),
				$t( 'why_heading', 'Heading', 'why.heading' ),
				$rp( 'why_items', 'Cards', 'why.items', array(
					$s( 'title', 'Title' ), $s( 'desc', 'Description', 'textarea' ) ) ),
			) ),
			array( 'key' => 'compare', 'label' => 'Comparison', 'fields' => array(
				$t( 'compare_eyebrow', 'Eyebrow', 'compare.eyebrow' ),
				$t( 'compare_heading', 'Heading', 'compare.heading' ),
				$t( 'compare_typical_title', 'Left column title', 'compare.typicalTitle' ),
				$ln( 'compare_typical', 'Left rows', 'compare.typical' ),
				$t( 'compare_northline_title', 'Right column title', 'compare.northlineTitle' ),
				$ln( 'compare_northline', 'Right rows', 'compare.northline' ),
			) ),
			array( 'key' => 'testimonials', 'label' => 'Testimonials heading', 'fields' => array(
				$t( 'testimonials_eyebrow', 'Eyebrow', 'testimonialsSection.eyebrow' ),
				$t( 'testimonials_heading', 'Heading', 'testimonialsSection.heading' ),
			) ),
			array( 'key' => 'pricing', 'label' => 'Pricing snapshot', 'fields' => array(
				$t( 'pricing_eyebrow', 'Eyebrow', 'pricing.eyebrow' ),
				$t( 'pricing_heading', 'Heading', 'pricing.heading' ),
				$rp( 'pricing_tiers', 'Tiers', 'pricing.tiers', array(
					$s( 't', 'Name' ), $s( 'd', 'Description', 'textarea' ), $s( 'p', 'Price' ), $s( 'featured', 'Featured (1/0)' ) ) ),
				$ln( 'pricing_tier_features', 'Shared features', 'pricing.tierFeatures' ),
			) ),
			array( 'key' => 'faq', 'label' => 'FAQ', 'fields' => array(
				$t( 'faq_eyebrow', 'Eyebrow', 'faq.eyebrow' ),
				$t( 'faq_heading', 'Heading', 'faq.heading' ),
				$rp( 'faq_items', 'Questions', 'faq.items', array(
					$s( 'q', 'Question' ), $s( 'a', 'Answer', 'textarea' ) ) ),
			) ),
			array( 'key' => 'audit', 'label' => 'Free audit', 'fields' => array(
				$t( 'audit_eyebrow', 'Eyebrow', 'audit.eyebrow' ),
				$t( 'audit_heading', 'Heading', 'audit.heading' ),
				$ta( 'audit_text', 'Text', 'audit.text' ),
				$ln( 'audit_bullets', 'Bullets', 'audit.bullets' ),
			) ),
			array( 'key' => 'cta', 'label' => 'Final CTA', 'fields' => array(
				$t( 'cta_eyebrow', 'Eyebrow', 'cta.eyebrow' ),
				$t( 'cta_heading', 'Heading', 'cta.heading' ),
				$ta( 'cta_text', 'Text', 'cta.text' ),
				$t( 'cta_primary_label', 'Primary button', 'cta.primaryLabel' ),
				$t( 'cta_secondary_label', 'Secondary button', 'cta.secondaryLabel' ),
			) ),
		),
	),
);
