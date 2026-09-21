<?php
/**
 * LivePress schema for core WordPress pages.
 *
 * A page here has no fixed hero or sections of its own: it is entirely what
 * you compose, rendered by the frontend at /pages/<slug>. That is the one
 * place `page_blocks` stands alone rather than slotting into a page that
 * already has a shape, so there is no `section_order` to place it with.
 *
 * Item formats per block type are the same as the catalog schema:
 *   features  Icon | Title | Description
 *   steps     Title | Description
 *   benefits  Title | Description
 *   stats     Value | Label
 *   faq       Question | Answer
 *   compare   Row | Column A | Column B | a or b
 *   cta       Label | /href   (first row primary, second secondary)
 *   marquee / bigtype   one entry per line
 *   projects / team / plans / testimonials   list live documents; leave items
 *     empty and use variant for a count
 *   heading / prose / image   leave items empty
 */

defined( 'ABSPATH' ) || exit;

$t  = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'text', 'path' => $path );
$ta = fn( $key, $label, $path ) => array( 'key' => $key, 'label' => $label, 'kind' => 'textarea', 'path' => $path );
$rp = fn( $key, $label, $path, $subs ) => array( 'key' => $key, 'label' => $label, 'kind' => 'repeater', 'path' => $path, 'subs' => $subs );
$s  = fn( $key, $label, $kind = 'text' ) => array( 'key' => $key, 'label' => $label, 'kind' => $kind );

return array(
	'collection:page' => array(
		'title'        => 'Page',
		'frontendPath' => '/pages/{slug}',
		'sections'     => array(
			array( 'key' => 'blocks', 'label' => 'Composed sections', 'fields' => array(
				$rp( 'page_blocks', 'Sections', 'page_blocks', array(
					$s( 'type', 'Type (heading, prose, features, steps, benefits, stats, faq, compare, marquee, bigtype, cta, image, projects, team, plans, testimonials)' ),
					$s( 'eyebrow', 'Eyebrow' ),
					$s( 'heading', 'Heading' ),
					$s( 'body', 'Body', 'textarea' ),
					$s( 'items', 'Items - one per line', 'textarea' ),
					$s( 'image', 'Image URL', 'image' ),
					$s( 'variant', 'Variant' ),
				) ),
			) ),
			array( 'key' => 'seo', 'label' => 'SEO', 'fields' => array(
				$t( 'meta_title', 'SEO title', 'meta.title' ),
				$ta( 'meta_description', 'SEO description', 'meta.description' ),
			) ),
		),
	),
);
