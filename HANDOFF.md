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
- **Remaining design list:** deeper hero rebuilds on flagships (port services
  eclipse-hero ideas), the sparse blue pinned process section (steps data in
  subpages.ts ~1989 — find exact route), further per-page section variety,
  full animation audit. Design skills to reload when resuming:
  design-taste-frontend, gpt-taste, meta-skills:modern-web-design (rules held:
  zero em-dashes, eyebrow rationing, gapless grids, hero discipline).

## Verify before every commit
`npx tsc --noEmit` + `node scripts/check-pages.mjs` (35 slugs) + sentinel test
against WP when CMS wiring changed. Never trust bodyLen alone.

## Open items (in priority order)
1. Prod WP: Better Search Replace Northline→Auxtech + prod-config.php check.
2. Design round 3 (list above).
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
