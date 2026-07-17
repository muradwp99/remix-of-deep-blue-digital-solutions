<?php
/**
 * "Northline Home" page template — the home design rendered by WordPress.
 * Same content source as the headless frontend (the `homepage` doc).
 * Animations are CSS/vanilla-JS approximations of the React originals.
 */
defined( 'ABSPATH' ) || exit;

$caps     = nh_rows( 'capabilities_items' );
$stats    = nh_rows( 'stats' );
$sols     = nh_rows( 'solutions_items' );
$steps    = nh_rows( 'process_items' );
$works    = nh_rows( 'work_items' );
$kick     = nh_rows( 'kickoff_items' );
$whys     = nh_rows( 'why_items' );
$tiers    = nh_rows( 'pricing_tiers' );
$faqs     = nh_rows( 'faq_items' );
$clients  = nh_lines( 'clients_names' );
$typical  = nh_lines( 'compare_typical' );
$north    = nh_lines( 'compare_northline' );
$tfeat    = nh_lines( 'pricing_tier_features' );
$bullets  = nh_lines( 'audit_bullets' );
$quotes   = get_posts( array( 'post_type' => 'testimonial', 'numberposts' => 3 ) );
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo esc_html( nh_meta( 'hero_headline', 'Northline' ) ); ?> — Northline (WP render)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fustat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --bg:oklch(0.12 0.025 265);--fg:oklch(0.97 0.005 250);
  --surface:oklch(0.17 0.028 265);--card:oklch(0.16 0.028 265);
  --muted:oklch(0.72 0.02 260);--border:oklch(0.28 0.03 265/.6);
  --gold:oklch(0.80 0.13 88);--lime:oklch(0.82 0.14 90);
  --lime-fg:oklch(0.15 0.028 265);--radius:16px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:"Fustat",system-ui,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
section{padding:96px 0;border-top:1px solid var(--border)}
.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.28em;color:var(--lime);margin-bottom:14px}
h2{font-size:clamp(34px,5vw,56px);font-weight:600;line-height:1.12;letter-spacing:-.01em;max-width:22ch}
.grid4{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:48px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:transform .3s,border-color .3s}
.card:hover{transform:translateY(-4px);border-color:oklch(0.4 0.05 265)}
.card h3{font-size:22px;font-weight:600;margin-top:26px}
.card p{margin-top:8px;font-size:14px;color:var(--muted)}
.chip{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,oklch(0.82 0.14 90/.2),transparent);border:1px solid oklch(1 0 0/.1);color:var(--lime);font-size:18px}
.gold .chip{background:linear-gradient(135deg,oklch(0.8 0.13 88/.3),transparent);border-color:oklch(0.8 0.13 88/.25);color:var(--gold)}
/* hero */
.hero{border-top:0;padding:130px 0 80px;text-align:center;position:relative;overflow:hidden}
.hero:before{content:"";position:absolute;inset:-40% -20% auto;height:80%;background:radial-gradient(ellipse at 50% 0%,oklch(0.3 0.06 265/.55),transparent 65%);pointer-events:none}
.trusted{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:oklch(0.97 0.005 250/.8);background:oklch(1 0 0/.05);border:1px solid var(--border);padding:8px 18px;border-radius:999px}
.trusted .stars{color:var(--gold);letter-spacing:2px}
.hero h1{font-size:clamp(44px,7vw,84px);font-weight:600;line-height:1.05;letter-spacing:-.02em;max-width:15ch;margin:26px auto 0}
.hero .sub{max-width:640px;margin:24px auto 0;font-size:18px;color:var(--muted)}
.cta{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:var(--lime-fg);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:14px;padding:16px 40px;border-radius:999px;text-decoration:none;margin-top:38px;transition:filter .2s}
.cta:hover{filter:brightness(1.08)}
.cta-note{display:block;margin-top:12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
/* marquee */
.marquee{overflow:hidden;white-space:nowrap;mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent)}
.marquee-track{display:inline-block;animation:scroll 28s linear infinite}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.clients{display:flex;align-items:center;gap:40px;padding:34px 0}
.clients .label{font-size:12px;text-transform:uppercase;letter-spacing:.28em;color:var(--muted);flex-shrink:0}
.clients span.name{margin:0 32px;font-size:24px;font-weight:500;color:oklch(0.97 0.005 250/.6)}
/* stats */
.stats{display:grid;gap:40px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:40px}
.stat .v{font-size:clamp(48px,6vw,72px);font-weight:600;letter-spacing:-.02em}
.stat .bar{width:40px;height:1px;background:oklch(0.82 0.14 90/.6);margin:12px 0}
.stat p{font-size:14px;color:var(--muted);max-width:24ch}
/* process */
.split{display:grid;gap:56px;grid-template-columns:1fr;align-items:start}
@media(min-width:900px){.split{grid-template-columns:1fr 1fr}}
.rows{display:flex;flex-direction:column;gap:12px}
.row{display:flex;gap:20px;background:oklch(1 0 0/.03);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.row .n{font-size:30px;font-weight:600;color:var(--lime)}
.row h3{font-size:19px;font-weight:600}
.row p{margin-top:6px;font-size:14px;color:var(--muted)}
/* work */
.workgrid{display:grid;gap:24px;grid-template-columns:1fr;margin-top:48px}
@media(min-width:800px){.workgrid{grid-template-columns:1fr 1fr}}
.workcard{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/10;border:1px solid var(--border)}
.workcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.85;transition:transform .6s}
.workcard:hover img{transform:scale(1.04)}
.workcard .ov{position:absolute;inset:0;background:linear-gradient(to top,var(--bg),transparent 60%)}
.workcard .body{position:absolute;inset:auto 0 0;padding:28px}
.workcard .tag{font-size:11px;text-transform:uppercase;letter-spacing:.24em;color:var(--lime)}
.workcard h3{font-size:28px;font-weight:600;margin-top:6px}
.workcard .res{font-size:14px;color:var(--muted);margin-top:2px}
/* timeline */
.timeline{display:grid;gap:36px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:56px}
.timeline .day{font-size:11px;text-transform:uppercase;letter-spacing:.24em;color:var(--gold)}
.timeline h3{font-size:19px;margin-top:8px}
.timeline p{font-size:14px;color:var(--muted);margin-top:8px;max-width:30ch}
/* compare */
.light{background:oklch(0.96 0.005 250);color:oklch(0.15 0.02 265);border-radius:24px;padding:72px 40px;margin-top:0}
.light .eyebrow{color:oklch(0.55 0.12 130)}
.cols{display:grid;gap:24px;grid-template-columns:1fr;margin-top:44px}
@media(min-width:800px){.cols{grid-template-columns:1fr 1fr}}
.col{border-radius:24px;padding:36px;border:1px solid oklch(0 0 0/.1);background:#fff}
.col.win{background:linear-gradient(135deg,oklch(0.93 0.06 90),#fff);border-color:oklch(0.8 0.13 88/.4)}
.col h3{font-size:22px;font-weight:600}
.col ul{margin-top:24px;list-style:none;display:flex;flex-direction:column;gap:16px}
.col li{display:flex;gap:12px;font-size:14px;align-items:flex-start}
.col .x{opacity:.45}
.col .c{color:oklch(0.6 0.13 88);font-weight:700}
/* testimonials */
.quotes{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));margin-top:48px}
blockquote{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;font-size:15px}
blockquote footer{margin-top:18px;font-size:13px;color:var(--muted)}
blockquote b{color:var(--fg)}
/* pricing */
.tiers{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:48px}
.tier{border-radius:var(--radius);padding:32px;border:1px solid var(--border);background:var(--card)}
.tier.win{background:linear-gradient(135deg,oklch(0.35 0.06 90/.35),var(--card));border-color:oklch(0.82 0.14 90/.4)}
.tier .p{font-size:28px;font-weight:600;color:var(--lime);margin-top:26px}
.tier ul{list-style:none;margin-top:20px;display:flex;flex-direction:column;gap:8px;font-size:14px;color:var(--muted)}
.tier li:before{content:"✓";color:var(--lime);margin-right:8px}
/* faq */
details{background:oklch(1 0 0/.03);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:12px}
summary{font-size:17px;font-weight:600;cursor:pointer;list-style:none;display:flex;justify-content:space-between}
summary:after{content:"+";color:var(--lime);transition:transform .2s}
details[open] summary:after{transform:rotate(45deg)}
details p{margin-top:12px;font-size:14px;color:var(--muted)}
/* cta */
.final{text-align:left;position:relative;overflow:hidden;border-radius:24px;background:radial-gradient(ellipse at 20% 0%,oklch(0.3 0.07 100/.35),transparent 60%),var(--surface);padding:88px 48px;border:1px solid var(--border)}
.final h2{font-size:clamp(40px,6vw,72px)}
.final .sub{margin-top:20px;font-size:18px;color:var(--muted);max-width:52ch}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
.btn2{display:inline-flex;padding:14px 26px;border-radius:999px;border:1px solid var(--border);color:var(--fg);text-decoration:none;font-size:14px;background:oklch(1 0 0/.04)}
.btn2.primary{background:oklch(0.2 0.04 265);border-color:oklch(0.82 0.14 90/.4);font-weight:600}
.btn2:hover{background:oklch(1 0 0/.08)}
/* reveal */
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s,transform .7s}
.reveal.in{opacity:1;transform:none}
.wpbadge{position:fixed;bottom:16px;right:16px;z-index:50;background:var(--gold);color:var(--lime-fg);font-size:11px;font-weight:700;letter-spacing:.08em;padding:8px 14px;border-radius:999px}
</style>
</head>
<body>
<div class="wpbadge">RENDERED BY WORDPRESS</div>

<header class="hero">
  <div class="wrap">
    <span class="trusted"><span class="stars">★★★★★</span> <?php echo esc_html( nh_meta( 'hero_trusted_line' ) ); ?></span>
    <h1><?php echo esc_html( nh_meta( 'hero_headline' ) ); ?></h1>
    <p class="sub"><?php echo esc_html( nh_meta( 'hero_subheadline' ) ); ?></p>
    <div>
      <a class="cta" href="<?php echo esc_url( nh_meta( 'hero_cta_href', '#' ) ); ?>"><?php echo esc_html( nh_meta( 'hero_cta_label' ) ); ?> ↗</a>
      <span class="cta-note"><?php echo esc_html( nh_meta( 'hero_cta_note' ) ); ?></span>
    </div>
  </div>
</header>

<div class="wrap clients">
  <span class="label"><?php echo esc_html( nh_meta( 'clients_label' ) ); ?></span>
  <div class="marquee"><div class="marquee-track">
    <?php foreach ( array_merge( $clients, $clients ) as $c ) : ?><span class="name"><?php echo esc_html( $c ); ?></span><?php endforeach; ?>
  </div></div>
</div>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'capabilities_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'capabilities_heading' ) ); ?></h2>
  <div class="grid4">
    <?php $icons = array( '⌨', '◐', '▣', '✦' ); foreach ( $caps as $i => $c ) : ?>
    <div class="card"><div class="chip"><?php echo esc_html( $icons[ $i % 4 ] ); ?></div>
      <h3><?php echo esc_html( $c['title'] ?? '' ); ?></h3><p><?php echo esc_html( $c['desc'] ?? '' ); ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal">
  <div class="stats">
    <?php foreach ( $stats as $s ) : ?>
    <div class="stat"><div class="v" data-count><?php echo esc_html( $s['value'] ?? '' ); ?></div><div class="bar"></div><p><?php echo esc_html( $s['label'] ?? '' ); ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal gold">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'solutions_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'solutions_heading' ) ); ?></h2>
  <div class="grid4">
    <?php $icons2 = array( '◈', '▤', '◆', '✚' ); foreach ( $sols as $i => $s ) : ?>
    <div class="card"><div class="chip"><?php echo esc_html( $icons2[ $i % 4 ] ); ?></div>
      <h3><?php echo esc_html( $s['title'] ?? '' ); ?></h3><p><?php echo esc_html( $s['desc'] ?? '' ); ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap split reveal">
  <div>
    <p class="eyebrow"><?php echo esc_html( nh_meta( 'process_eyebrow' ) ); ?></p>
    <h2><?php echo esc_html( nh_meta( 'process_heading' ) ); ?></h2>
    <p style="margin-top:22px;color:var(--muted);max-width:44ch"><?php echo esc_html( nh_meta( 'process_intro' ) ); ?></p>
  </div>
  <div class="rows">
    <?php foreach ( $steps as $p ) : ?>
    <div class="row"><span class="n"><?php echo esc_html( $p['n'] ?? '' ); ?></span>
      <div><h3><?php echo esc_html( $p['t'] ?? '' ); ?></h3><p><?php echo esc_html( $p['d'] ?? '' ); ?></p></div></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'work_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'work_heading' ) ); ?></h2>
  <div class="workgrid">
    <?php foreach ( $works as $w ) : ?>
    <div class="workcard">
      <img src="<?php echo esc_url( $w['img'] ?? '' ); ?>" alt="<?php echo esc_attr( $w['name'] ?? '' ); ?>" loading="lazy">
      <div class="ov"></div>
      <div class="body"><span class="tag"><?php echo esc_html( $w['tag'] ?? '' ); ?></span>
        <h3><?php echo esc_html( $w['name'] ?? '' ); ?></h3>
        <div class="res"><?php echo esc_html( $w['result'] ?? '' ); ?></div></div>
    </div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'kickoff_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'kickoff_heading' ) ); ?></h2>
  <div class="timeline">
    <?php foreach ( $kick as $k ) : ?>
    <div><div class="day"><?php echo esc_html( $k['day'] ?? '' ); ?></div>
      <h3><?php echo esc_html( $k['t'] ?? '' ); ?></h3><p><?php echo esc_html( $k['d'] ?? '' ); ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'why_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'why_heading' ) ); ?></h2>
  <div class="grid4">
    <?php $icons3 = array( '⚡', '▤', '✓', '◎' ); foreach ( $whys as $i => $f ) : ?>
    <div class="card"><div class="chip"><?php echo esc_html( $icons3[ $i % 4 ] ); ?></div>
      <h3><?php echo esc_html( $f['title'] ?? '' ); ?></h3><p><?php echo esc_html( $f['desc'] ?? '' ); ?></p></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section style="border-top:0"><div class="wrap"><div class="light reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'compare_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'compare_heading' ) ); ?></h2>
  <div class="cols">
    <div class="col"><h3><?php echo esc_html( nh_meta( 'compare_typical_title' ) ); ?></h3><ul>
      <?php foreach ( $typical as $row ) : ?><li><span class="x">✕</span><?php echo esc_html( $row ); ?></li><?php endforeach; ?>
    </ul></div>
    <div class="col win"><h3><?php echo esc_html( nh_meta( 'compare_northline_title' ) ); ?></h3><ul>
      <?php foreach ( $north as $row ) : ?><li><span class="c">✓</span><?php echo esc_html( $row ); ?></li><?php endforeach; ?>
    </ul></div>
  </div>
</div></div></section>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'testimonials_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'testimonials_heading' ) ); ?></h2>
  <div class="quotes">
    <?php foreach ( $quotes as $q ) : ?>
    <blockquote>“<?php echo esc_html( get_post_meta( $q->ID, 'quote', true ) ); ?>”
      <footer><b><?php echo esc_html( get_post_meta( $q->ID, 'author', true ) ); ?></b><br>
      <?php echo esc_html( trim( get_post_meta( $q->ID, 'role', true ) . ', ' . get_post_meta( $q->ID, 'company', true ), ', ' ) ); ?></footer>
    </blockquote>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'pricing_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'pricing_heading' ) ); ?></h2>
  <div class="tiers">
    <?php foreach ( $tiers as $t ) : $win = ! empty( $t['featured'] ) && '0' !== $t['featured']; ?>
    <div class="tier<?php echo $win ? ' win' : ''; ?>"><h3><?php echo esc_html( $t['t'] ?? '' ); ?></h3>
      <p style="margin-top:8px;font-size:14px;color:var(--muted)"><?php echo esc_html( $t['d'] ?? '' ); ?></p>
      <div class="p"><?php echo esc_html( $t['p'] ?? '' ); ?></div>
      <ul><?php foreach ( $tfeat as $f ) : ?><li><?php echo esc_html( $f ); ?></li><?php endforeach; ?></ul></div>
    <?php endforeach; ?>
  </div>
</div></section>

<section><div class="wrap split reveal">
  <div>
    <p class="eyebrow"><?php echo esc_html( nh_meta( 'faq_eyebrow' ) ); ?></p>
    <h2><?php echo esc_html( nh_meta( 'faq_heading' ) ); ?></h2>
  </div>
  <div>
    <?php foreach ( $faqs as $f ) : ?>
    <details><summary><?php echo esc_html( $f['q'] ?? '' ); ?></summary><p><?php echo esc_html( $f['a'] ?? '' ); ?></p></details>
    <?php endforeach; ?>
  </div>
</div></section>

<section style="border-top:0"><div class="wrap"><div class="final reveal">
  <p class="eyebrow"><?php echo esc_html( nh_meta( 'cta_eyebrow' ) ); ?></p>
  <h2><?php echo esc_html( nh_meta( 'cta_heading' ) ); ?></h2>
  <p class="sub"><?php echo esc_html( nh_meta( 'cta_text' ) ); ?></p>
  <div class="btns">
    <a class="btn2 primary" href="#"><?php echo esc_html( nh_meta( 'cta_primary_label' ) ); ?> ↗</a>
    <a class="btn2" href="#"><?php echo esc_html( nh_meta( 'cta_secondary_label' ) ); ?></a>
  </div>
</div></div></section>

<script>
// Scroll reveal + naive count-up, approximating the React choreography.
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach((el) => {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return;
    const suffix = raw.replace(/^[\d.]+/, '');
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 1200, 1);
      el.textContent = Math.round(num * (0.2 + 0.8 * p)) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
    };
    requestAnimationFrame(step);
  });
  io.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
</script>
</body>
</html>
