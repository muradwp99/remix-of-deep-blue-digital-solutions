# Northline — session handoff

Snapshot of the work so far so a new session can continue without re-discovery.
(Claude also keeps auto-loading memory at `~/.claude/projects/.../memory/` — this
file is the human-readable mirror.)

## Two apps in this repo
- **Live site** — `src/` — TanStack Start (Vite) SSR, Tailwind v4. This is the redesigned marketing site. Dev: `npm run dev` → **http://localhost:8080**.
- **CMS** — `northline-payload/` — Payload CMS 3.85 (Next 16, Postgres). Dev: `cd northline-payload && pnpm dev` → **http://localhost:3000/admin**. Untracked in the main repo (only hand-edited files committed surgically); **should become its own git repo** for GitHub→Hostinger deploy.

## Design system (site) — DONE
- Per-page **mode** system, not one dark template: **flagship-dark** (home, contact, faq hubs), **white/editorial** (about, our-story, leadership, blog, resources, learning, works, legal, pricing, faq, contact), **colorful/bold** (careers, solutions, industries, tools, standalone services). Modes via CSS classes `.block-light/.block-tint/.block-bold/.block-deep` in `src/styles.css` (wrap a full-width `<section class="block-X">` around an inner `container-page`; tokens auto-adapt; dark header/footer are brand bookends).
- **Palette**: 6 semantic brand colours in `src/lib/themes.ts` (BUILD/GROWTH/CREATIVE/ENERGY/CARE/EDITORIAL), assigned by content category. Never override `--background` in a theme.
- **Section variants**: `FeatureGrid` (cards|rows|spotlight), `ProcessSteps` (cards|rail|ladder), `BenefitList` (list|grid), `FAQAccordion` (split|wide) in `src/components/sections.tsx` — assigned per page so no two pages share one skeleton; 6 flagship pages open with different shapes.
- **Chrome**: header is `fixed` and overlays the hero (solid dark pill, readable over any hero); Cost Calculator + Chat widgets are solid dark, mobile-safe. Responsive verified 320/375/768/1280/2560.
- Gotcha: `data-parallax-img` frames are force-clipped in `src/lib/animations.ts`; `data-split` strips nested spans (use `data-reveal` for headings with a `text-gold` accent word); BentoShowcase only works on dark/block-deep.

## CMS admin — DONE (Phase 1)
- Runs on Postgres `127.0.0.1:5432` db `northline-payload` (local, already running). Admin user: `muradujjaman05@gmail.com` (reset pw via `payload.forgotPassword({..., disableEmail:true})` → `/admin/reset/<token>`).
- Premium admin: branded `beforeDashboard` Welcome hero, class-driven icon nav with gold active accent (`src/components/admin/Nav.tsx`), Logo/Icon graphics, refined cards/inputs/buttons — all styled in `src/app/(payload)/custom.scss`.
- 18 collections/globals polished for editorial UX (descriptions, list columns, search, sidebar meta, grouping via UNNAMED collapsibles/rows/tabs — a NAMED tab/group nests data paths and breaks the frontend contract).
- Added the missing collections: **Industries, Tools, Learning** (empty — need seeding).
- Deploy decision: Payload + free **Neon** Postgres (Hostinger Business runs Node but only offers MySQL; Payload has no MySQL adapter). Build is memory-hungry (`--max-old-space-size=8000`) — build in CI or host CMS on Railway/Render.
- Gotchas: component paths use `@/` alias; after adding admin components run `pnpm payload generate:importmap`; after field changes run `pnpm payload generate:types`; Turbopack HMR can throw a fatal `Cannot assign to read only property 'i18n'` after hot-swapping admin components — fix = `rm -rf .next` + restart.

## CMS integration (Phase 2) — IN PROGRESS
Client: `src/lib/cms.ts` (`cmsFind`/`cmsFindOne`/`cmsGlobal`/`cmsMedia`, types `CmsProject`/`CmsTeam`, `VITE_CMS_URL` default `:3000`, fails soft). Payload `cors` open to `:8080`.

**Pattern** (proven): TanStack route `loader` fetches from CMS → maps docs to the page's existing prop shape → falls back to hardcoded arrays; component reads `Route.useLoaderData()`.

**Done + verified:** `works` list + `works/$slug` detail (enriched `projects` schema for full case-study parity; backfilled 6 projects); `leadership → team`.

**NEXT (blocker first):** catalog collections don't match the site's slugs — `services` 6 vs 13 pages, `solutions` 5 vs 10, `industries`/`tools`/`learning` empty. **Seed them from `src/lib/subpages.ts` / `industries.ts` / `tools.ts` / `learning.ts` before wiring their detail pages.** Wire-ready now (collections already match): **pricing→plans, faq→faqs, blog→posts, header/footer globals**. Then services/solutions/industries/tools/learning; then about/home via the `Pages` block content.

## Verify before every commit
Site: `npx tsc --noEmit` + `node scripts/check-pages.mjs`. CMS: `pnpm payload generate:types`.

## Recent commits (site + CMS interleaved on `main`)
`af9cec6` leadership→team · `aab4953` projects schema enrichment · `66d9c3d` works wiring proof · `f6db3a8` Phase 2 foundation · `fb30e87` premium admin + missing collections · `04eeb38` editorial-UX · `69e03b9` admin nav+branding · plus the full design redesign (phases 1–4, chrome, palette, variants) before that.
