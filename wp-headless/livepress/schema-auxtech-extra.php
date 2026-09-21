<?php
/**
 * LivePress schemas for the collections `schema-auxtech.php` does not cover.
 *
 * That file already defines collection:service, :solution, :industry, :tool
 * and :project. This one adds the remaining seven content types so every
 * collection on the site opens in the LivePress editor rather than the raw
 * custom-fields box.
 *
 * `frontendPath` is the page the preview iframe loads. Types with no detail
 * route of their own (team, plan, faq, testimonial) point at the page that
 * lists them, so edits are still visible while typing.
 *
 * kind: text | textarea | lines | repeater. `path` mirrors the meta key,
 * which is what the frontend's mappers read.
 */

defined( 'ABSPATH' ) || exit;

$t  = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'text', 'path' => $path );
$ta = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'textarea', 'path' => $path );
$ln = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'lines', 'path' => $path );

return array(

	'collection:team' => array(
		'title'        => 'Team Member',
		'frontendPath' => '/leadership',
		'sections'     => array(
			array( 'key' => 'details', 'label' => 'Details', 'fields' => array(
				$t( 'role', 'Role', 'role' ),
				$ta( 'bio', 'Bio', 'bio' ),
			) ),
		),
	),

	'collection:plan' => array(
		'title'        => 'Pricing Plan',
		'frontendPath' => '/pricing',
		'sections'     => array(
			array( 'key' => 'plan', 'label' => 'Plan', 'fields' => array(
				$t( 'price', 'Price', 'price' ),
				$t( 'period', 'Billing period', 'period' ),
				$ta( 'description', 'Description', 'description' ),
				$ln( 'features', 'Features (one per line)', 'features' ),
			) ),
			array( 'key' => 'cta', 'label' => 'Call to action', 'fields' => array(
				$t( 'cta_label', 'Button label', 'cta_label' ),
				$t( 'cta_url', 'Button URL', 'cta_url' ),
				$t( 'featured', 'Featured (1 or blank)', 'featured' ),
			) ),
		),
	),

	'collection:faq' => array(
		'title'        => 'FAQ',
		'frontendPath' => '/faq',
		'sections'     => array(
			array( 'key' => 'qa', 'label' => 'Question', 'fields' => array(
				$ta( 'answer', 'Answer', 'answer' ),
				$t( 'category', 'Category', 'category' ),
			) ),
		),
	),

	'collection:job' => array(
		'title'        => 'Job',
		'frontendPath' => '/careers',
		'sections'     => array(
			array( 'key' => 'role', 'label' => 'Role', 'fields' => array(
				$t( 'department', 'Department', 'department' ),
				$t( 'type', 'Employment type', 'type' ),
				$t( 'location', 'Location', 'location' ),
				$t( 'salary', 'Salary range', 'salary' ),
			) ),
			array( 'key' => 'apply', 'label' => 'Application', 'fields' => array(
				$ln( 'job_tags', 'Tags (one per line)', 'job_tags' ),
				$t( 'apply_url', 'Apply URL', 'apply_url' ),
				$t( 'open', 'Open (1 or blank)', 'open' ),
			) ),
		),
	),

	'collection:learning' => array(
		'title'        => 'Learning Item',
		'frontendPath' => '/resources',
		'sections'     => array(
			array( 'key' => 'item', 'label' => 'Item', 'fields' => array(
				$t( 'type', 'Type (guide, template, tutorial, webinar)', 'type' ),
				$ta( 'summary', 'Summary', 'summary' ),
				$t( 'format', 'Format', 'format' ),
			) ),
			array( 'key' => 'seo', 'label' => 'SEO', 'fields' => array(
				$t( 'meta_title', 'Meta title', 'meta_title' ),
				$ta( 'meta_description', 'Meta description', 'meta_description' ),
			) ),
		),
	),

	'collection:testimonial' => array(
		'title'        => 'Testimonial',
		'frontendPath' => '/',
		'sections'     => array(
			array( 'key' => 'quote', 'label' => 'Quote', 'fields' => array(
				$ta( 'quote', 'Quote', 'quote' ),
				$t( 'author', 'Author', 'author' ),
				$t( 'role', 'Role', 'role' ),
				$t( 'company', 'Company', 'company' ),
				$t( 'rating', 'Rating (1-5)', 'rating' ),
				$t( 'featured', 'Featured (1 or blank)', 'featured' ),
			) ),
		),
	),

	'collection:resource' => array(
		'title'        => 'Resource',
		'frontendPath' => '/resources',
		'sections'     => array(
			array( 'key' => 'resource', 'label' => 'Resource', 'fields' => array(
				$ta( 'summary', 'Summary', 'summary' ),
				$t( 'type', 'Type', 'type' ),
				$t( 'url', 'URL', 'url' ),
			) ),
			array( 'key' => 'seo', 'label' => 'SEO', 'fields' => array(
				$t( 'meta_title', 'Meta title', 'meta_title' ),
				$ta( 'meta_description', 'Meta description', 'meta_description' ),
			) ),
		),
	),
);
