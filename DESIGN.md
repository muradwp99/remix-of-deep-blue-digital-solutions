# Design

Visual system for the Northline site. Source of truth: `src/styles.css` (Tailwind v4 `@theme` + utilities) and `src/lib/animations.ts` (GSAP engine).

## Theme

Committed dark: near-black navy body (`--background: oklch(0.12 0.025 265)`), light ink (`--foreground: oklch(0.97 0.005 250)`). No light mode.

## Color

| Token | Value | Role |
|---|---|---|
| `--background` | oklch(0.12 0.025 265) | body |
| `--surface` / `--surface-2` | oklch(0.17/0.21 0.03 265) | raised panels |
| `--card` | oklch(0.16 0.028 265) | cards |
| `--muted-foreground` | oklch(0.72 0.02 260) | secondary text |
| `--gold` | oklch(0.80 0.13 88) | warm accent (featured, glare) |
| `--lime` | oklch(0.82 0.14 90) | primary accent — kickers, hovers, focus (note: dark-yellow despite the name) |
| `--border` | oklch(0.28 0.03 265 / 60%) | hairlines |

Accent discipline: lime for interactive/emphasis, gold for warmth/featured. Never both on one element.

## Typography

- Display + body: **Fustat** (`--font-display`, weights 300–800). Italic serif accent: **Playfair Display** (`.font-playfair`) for single emphasized words inside display headings.
- Display headings: font-semibold, letter-spacing -0.03em, leading 0.95–1.05. Scale: hero `text-5xl md:text-7xl`, section `text-4xl md:text-6xl`.
- Kicker grammar: `text-xs uppercase tracking-[0.28em] text-lime` — the ONE named brand kicker. Use deliberately, not on literally every block.
- Body: `text-sm`/`text-lg` `text-muted-foreground`, max-w-2xl.

## Materials

- `glass` / `glass-strong`: white-tint gradient + backdrop-blur + 1px white/8 border.
- `gradient-card` / `gradient-card-gold`: navy or gold-tinted panel gradients.
- `.glare-card`: cursor-anchored gold sheen + border glow (global engine in animations.ts).
- `grain-bg`: soft navy/gold radial washes. `shadow-panel` for floating chrome.
- Radii: rounded-2xl cards, rounded-3xl feature panels, rounded-full pills.

## Motion

Engine: GSAP + ScrollTrigger via `useScrollReveal()` in SiteShell, declarative data-attributes:

- `data-reveal` — blur-dissolve up (one-shot)
- `data-reveal-group` + `data-reveal-child` — staggered children
- `data-split` — masked word-by-word heading reveal
- `data-slide="left|right"` — side entrances
- `data-timeline-line` — scrubbed line draw
- (v2 additions) `data-parallax` — scrubbed depth; `data-cards` + `data-card` — 3D card-entry stagger; `data-scatter` + `data-scatter-item` — scattered elements assembling on scroll; `data-counter` — count-up numbers; `data-magnetic` — cursor-magnetic CTAs; `data-parallax-img` — inner image drift

Rules: ease `power4.out` for entrances, `none` for scrubs. Scrubbed tweens animate transform/opacity ONLY (no filter/blur in scrub paths — 120fps bar). One-shot reveals may use blur. Every effect gated on `prefers-reduced-motion` with static/crossfade fallback. Marquees: CSS keyframes, pause on hover.

## Layout

- `container-page`: max-w-1320px, px-6.
- Section rhythm: `py-24`/`py-28`, separated by `border-t border-border/60`.
- Sections components live in `src/components/sections.tsx` (SectionHead, FeatureGrid, ProcessSteps, StatsRow, Testimonials, FAQAccordion, CTABand, BenefitList).
- Page scaffold: `SiteShell` → `PageHeader` (parallax image hero) → sections → `CTABand`.

## Voice

Outcome-led, concrete, short. Headlines state a position ("A studio, not a factory."). Metrics inline ("3.1× signups"). No "passionate", "crafting experiences", "unleash".
