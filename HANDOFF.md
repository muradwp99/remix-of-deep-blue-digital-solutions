# Auxtech — session handoff

Human-readable mirror of the project state. Claude's auto-memory at
`~/.claude/projects/F--Auxtech-Website-V2/memory/` carries the same facts in
more detail — trust memory for recipes, this file for orientation.

## What this project is
**Auxtech** (rebranded from Northline): premium software-studio marketing site
+ a self-invented realtime visual-editing framework (**LivePress**) on headless
WordPress. Frontend = TanStack Start (Vite SSR) + Tailwind v4 + GSAP. The
Payload CMS in `northline-payload/` is RETIRED (kept only as history).

## Live URLs
- **Frontend (prod demo):** https://auxtech-website.vercel.app — Vercel
  project `auxtech-website`, CLI authed as muradwp99. Deploy:
  `npx vercel deploy --prod --yes`. Env there: `VITE_CMS_URL=https://aux.rsautomartllc.com`,
  `GEMINI_API_KEY` (also in local `.env`, gitignored).
- **CMS (prod):** https://aux.rsautomartllc.com (Hostinger WP, migrated via
  All-in-One WP Migration). `wp-content/mu-plugins/prod-config.php` must point
  `auxtech_frontend_url` + CORS at the Vercel URL. **Prod DB may still contain
  "Northline" strings** until the user runs Better Search Replace there.
- **CMS (staging/dev):** LocalWP `auxtech-v2.local`
  (`C:\Users\murad\Local Sites\auxtech-v2\app\public`). WP-CLI recipe =
  `scratchpad/wpx.sh` pattern: Local's PHP + `-d extension=mysqli` + phar
  (DB_HOST 127.0.0.1:10016). Local dev frontend: `npm run dev` → :8080.
- **GitHub:** site = muradwp99/remix-of-deep-blue-digital-solutions (main);
  LivePress kit = **github.com/muradwp99/livepress** (plugin + npm bridge pkg,
  MIT, pushed).

## LivePress (the invention) — ALL SHIPPED
One "Site Pages" list (25 docs) + 32 collection detail editors. Fullscreen
editor (WP chrome hidden): schema-driven fields left, live iframe right,
keystrokes stream via postMessage (`aux-edit` protocol; also aux-design /
aux-menu / aux-footer / aux-focus). Drag repeaters, media pickers, section
drag-reorder, click-to-edit, device-width preview, Menus + Design standalone
screens. Frontend runtime = `src/lib/edit-bridge.ts` (`useLiveEdits`), page
helpers `pageStr/pageRows/pageLines` in `src/lib/cms.ts` (generic `sitepages`
collection). Plugin: `wp-headless/livepress/` (schema registry =
`livepress-schema.php`; plugin self-registers REST meta for every schema
field). WP contract + gotchas: `WP-MIGRATION.md`; deploy guide: `DEPLOY.md`;
kit README: `LIVEPRESS.md`. Key rule learned: sentinel-edit to verify (fail-
soft masks dead wiring); repeaters = JSON strings; one sitepage CPT, never
CPT-per-page.

## Free tools (all REAL, server-function backed)
`src/lib/tools-api.ts` (createServerFn + `.validator`) + `src/lib/gemini.server.ts`
(Gemini 2.0-flash REST; x-goog-api-key then Bearer fallback; ALWAYS heuristic
fallback so tools never break). Shared UI `src/components/tool-shell.tsx`
(ScoreRing/StatTile/FixList/CopyBlock/skeletons). Routes under `/tools/`:
website-audit (verified live w/ AI), speed-test, roi-calculator, brand-grader,
**project-estimator** (verified), **stack-recommender**, **headline-analyzer**,
**meta-generator**. Nova chat (floating-widgets) answers via `runChat`.
Mega menu lists the 6 strongest.

## Design state
- **Brand navy = #00022D** (user-final; revised from #0B0B45). styles.css
  :root dark tokens all hue-268 family (bg oklch(0.14 0.07 268)); hardcoded
  hexes in tools/favicon swapped too. Gold/lime accents unchanged.
- Logo: `src/components/auxtech-logo.tsx` (AuxtechMark, currentColor
  approximation of user's angular-A wordmark) + `public/favicon.svg`. User's
  real SVG can replace both (swap path data only).
- Counter bug FIXED at root: `useScrollReveal` module refcount (SiteShell +
  pages double-called it → second pass zeroed counters; StrictMode killed
  anims) + `data-counter-value` stash. Verified sitewide.
- Shipped redesigns: stats = ledger composition (home + StatsRow); FeatureGrid
  spotlight lead filled (sibling chips); FeatureGrid default cards = tinted-
  cell diversity + ghost icons; shared editorial hero figure = offset gold
  frame (8 pages).
- **ROUND 3 (2026-07-19, multi-agent WORKFLOW.md run) — build done on disk,
  QA/commit UNFINISHED.** See "Round 3 in flight" section below. 36 files
  modified in working tree, NOT committed, NOT pushed (user rule: never push
  to live from these sessions).
- Design skills to reload for design work: design-taste-frontend, gpt-taste,
  meta-skills:modern-web-design (rules held: zero em-dashes, eyebrow
  rationing, gapless grids, hero discipline).

## Round 3 in flight — how to finish (do this FIRST next session)

The 2026-07-19 session ran a multi-agent team per the user's WORKFLOW.md
(orchestrator → researchers → design specs → design.lead review gate →
architect → builders → QA). All specs/findings/review-log live in
`deliverables/` (brief at `deliverables/_context/brief.md`). Workflow run
cache (`resumeFromRunId wf_9ace9835-36e`) is SAME-SESSION ONLY — tomorrow you
CANNOT resume it; but that's fine, all output is ordinary files on disk.

State at handoff (~04:28, 19 agents done): research + 3 approved specs +
architecture + foundation build + lead 50% spot-review + most route packages
DONE; "hero-variety" builder was mid-run; NOT yet run: lead 100% spot-review,
QA gate, final sign-off, commit.

What shipped (on disk, uncommitted): Tailwind-style graded ramps in
styles.css/themes.ts; theme entries for the 4 new tools (project-estimator,
stack-recommender, headline-analyzer, meta-generator — they had NONE and
rendered muddy-brown block-deep heroes); CTA unification (btn-navy demoted,
btn-gold = the one primary incl. header/CTABand/contact submit); homepage
marquee hex cleanup; tool-shell red-400 → --destructive grading; services.tsx
hub redesign (block modes, was 7 flat navy sections); /solutions/scale-up
StickyPinSteps filled; retail-dtc text-gold/30 contrast fix; stale "N" glyph
in banner-cta.tsx → AuxtechMark "A".

To finish round 3:
1. If hero-variety builder died mid-edit: `git status` + `npx tsc --noEmit`
   tells you; finish its 4 hero pages per
   `deliverables/design.motion/motion-spec.md` §hero-variety.
2. QA gate: `npx tsc --noEmit` && `npm run build` && `node
   scripts/check-pages.mjs`; then dev server :4321 + playwright/Edge
   screenshots (recipe in memory `verifying-pages-headless.md`) of ~12 pages;
   fix blockers.
3. Read `deliverables/design.lead/review-log.md` end-block for residual
   open issues to include in commit message / report.
4. Commit locally (surgical: the 36 src files + deliverables if wanted),
   message `feat(design): round 3 — graded color system + services/scale-up/
   hero variety`. **DO NOT git push** — user pushes when ready.

## ROUND 4 — QUEUED (user-approved scope, run after round 3 commits)

User asked for a full round 4 with the same WORKFLOW.md team pattern:
1. Layout/IA de-genericization: per-page section ORDER varies, kill uniform
   BenefitList/FAQAccordion clones, add missing sections, trim bloat,
   animation audit + thinning. (Known uniform spots list = memory
   `per-page-theme-system.md` round-6 notes.)
2. Production-ready content site-wide, no mock/filler; resolve found copy
   contradictions (84% vs 98% retention, phantom API/AI/SOC2 services,
   service-name drift, "a Auxtech" grammar).
3. Pricing for ALL 13 services + 10 solutions, USA/UK/Europe oriented (USD
   primary + GBP/EUR, VAT note), per-subpage bands + pricing page.
4. Real images: Bloom MCP (trybloom — onboard Auxtech brand, check credits)
   + Canva MCP (connected) + licensed stock (Unsplash/Pexels). NO Google
   Image scraping (copyright). Figma MCP needs user auth first.
Constraints agreed: no invented named-client testimonials/logos/result
numbers (flag list for user instead); pricing = market-rate, user adjusts;
speed = builders/QA at effort 'medium'; everything local, no push.

## Verify before every commit
`npx tsc --noEmit` + `node scripts/check-pages.mjs` (35 slugs) + sentinel test
against WP when CMS wiring changed. Never trust bodyLen alone.

## Open items (in priority order)
0. FINISH ROUND 3 (section above): QA gate + local commit, then ROUND 4.
   Also user-decision residuals from round-3 review: delete-or-gate
   home-2..home-5 experiment routes (home-4 shows alien "HOMOLUDENS" brand);
   register 4 new tools in tools.ts so check-pages guard sees them.
1. Prod WP: Better Search Replace Northline→Auxtech + prod-config.php check.
2. ~~Design round 3~~ → in flight, see section above.
3. Hostinger frontend (auxfront.rsautomartllc.com) per DEPLOY.md — Vercel is
   the demo host meanwhile.
4. Optional: npm publish of `livepress-bridge` (user's npm account);
   `@lovable.dev/vite-tanstack-config` build-dep swap (risky, needs care).
5. LocalWP → prod content sync flow when the user wants parity.

## Gotchas that bite
- Vite env vars are BUILD-time (change → redeploy, not restart).
- `.env*` gitignored; Gemini key never in code.
- `wp-headless/` copies deploy to LocalWP via `cp` (plugins dir) — prod WP gets
  them via AIO migration or manual upload.
- Heredocs with JS template literals break in Git Bash — append files via
  python instead.
- TanStack loaders: serializable data only (icons stay component-side).
