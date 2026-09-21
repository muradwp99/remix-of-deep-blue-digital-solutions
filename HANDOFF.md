# Auxtech — session handoff

Human-readable mirror of the project state. Claude's auto-memory at
`~/.claude/projects/F--Auxtech-Website-V2/memory/` carries the same facts in
more detail — trust memory for recipes, this file for orientation.

Last rewritten: 2026-09-21.

## What this project is
**Auxtech** (rebranded from Northline): premium software-studio marketing site
+ a self-invented realtime visual-editing framework (**LivePress**) on headless
WordPress. Frontend = TanStack Start (Vite SSR) + Tailwind v4 + GSAP. The
Payload CMS in `northline-payload/` is RETIRED (kept only as history).

## Live URLs

- **Frontend:** https://auxtechint.com — self-hosted on the user's cPanel
  (136.243.82.43, LiteSpeed, cPanel user `auxtechi`).
- **CMS:** https://admin.auxtechint.com — WordPress 7.1.1, PHP 8.2.33, same
  cPanel account, docroot `~/admin.auxtechint.com`.
- **GitHub:** site = muradwp99/remix-of-deep-blue-digital-solutions (main);
  LivePress kit = **github.com/muradwp99/livepress** (public, MIT).
- Local dev: `npm run dev` → :8080. Cold start ~45s, first SSR ~5s.

> **User rule (2026-09-21): no Vercel, no external hosting services. Do not
> suggest it.** The old `auxtech-website.vercel.app` and the
> `*.rsautomartllc.com` pair are abandoned; everything runs on the cPanel above.

## Hosting — how the frontend actually runs

**The server has no system Node.** `/usr/bin/node` does not exist, EasyApache
node packages are absent, and `Cpanel::API::NodeJS` is not installed, so the
CloudLinux Node.js Selector is unusable even though the `lvenodejssel` feature
bit is granted. cPanel's `PassengerApps::register_application` hard-codes
`nodejs: /usr/bin/node` and ignores any path you pass it, and
`edit_application` is permanently broken on this account because cPanel
auto-detected a bogus `python: /usr/bin/python-html2text` that it re-validates
on every call.

What works instead, all through the cPanel API (there is **no SSH** — ports 22,
2222, 2200, 22222, 21098, 7822, 18765, 2022 and 1022 are filtered; only
2082/2083/2087 answer):

1. A Node runtime lives **inside the account**:
   `/home/auxtechi/node-v24.21.0-linux-x64/bin/node`, installed by uploading
   the official nodejs.org linux-x64 tarball and extracting it server-side.
2. App root `/home/auxtechi/auxfront` holds `.output/` plus `app.js`, a
   CommonJS shim that does `import("./.output/server/index.mjs")`.
3. `/home/auxtechi/public_html/.htaccess` carries `PassengerAppRoot`,
   `PassengerBaseURI /`, `PassengerNodejs <the account node>`,
   `PassengerAppType node`, `PassengerStartupFile app.js`.

> **The trap:** a cPanel-**registered** Passenger app overrides that .htaccess
> and forces `/usr/bin/node`, which gives `lscgid: execve():/usr/bin/node: No
> such file or directory` in `~/auxfront/stderr.log` and a 503. The app must
> stay **unregistered**. Never open cPanel's Application Manager for this
> domain — it re-registers and takes the site down.

### Deploy / redeploy

```
NITRO_PRESET=node-server VITE_CMS_URL=https://admin.auxtechint.com npm run build
```
The repo's default Nitro target is **cloudflare** (emits `wrangler.json`) and is
useless here, so the preset is not optional. The `node-server` bundle is
self-contained — no `npm install` on the server. Then: tar `.output`, upload via
UAPI `Fileman/upload_files`, extract with **API2** `Fileman::fileop op=extract`
(there is no UAPI extract), and touch `~/auxfront/tmp/restart.txt` to restart
Passenger.

> **Delete `tmp/restart.txt` before re-uploading it.** `Fileman/upload_files`
> silently refuses to overwrite an existing file, so a second deploy uploads
> nothing, Passenger never restarts, and the old process keeps serving the old
> asset manifest — new hashed chunks 404 while the HTML still points at the
> previous ones. The files are on disk and the deploy looks clean; only the
> served bundle gives it away. Confirm with:
> `curl -s https://auxtechint.com/ | grep -o '/assets/site-shell-[^"]*\.js'`
> and check it matches the local `.output/public/assets` filename.

## CMS — everything is dynamic

**LivePress v1.5.2** (from the public GitHub kit, far newer than the 0.2.0 copy
still sitting in `wp-headless/livepress/`) + **Novamira** and **Novamira Pro**.
Pretty permalinks are **required**: with the plain structure `/wp-json/` 404s
and only `index.php?rest_route=` answers, while `src/lib/cms.ts:49` calls
`${CMS_URL}/wp-json${path}` — so every fetch fails soft into built-in copy and
the site looks fine while being entirely disconnected.

Since 1.1 LivePress globs `schema-*.php` beside itself rather than owning one
site's schema. On the server: `schema-auxtech.php` (the old
`livepress-schema.php`, 5 catalog types) and `schema-auxtech-extra.php` (the
other 7).

**mu-plugins** (`~/admin.auxtechint.com/wp-content/mu-plugins/`, sources in
`wp-headless/`):
- `auxtech-headless.php` — globals REST + CORS + contact form
- `prod-config.php` — points LivePress and the bridge at https://auxtechint.com
- `auxtech-collections.php` — the 12 post types

**12 post types**, named so their default `rest_base` matches `src/lib/cms.ts`:
`service` `solution` `industry` `tool` `project` `team` `plan` `faq` `job`
`learning` `testimonial` `resource`, plus core `post` (blog), core `page`
(free-form, renders at `/pages/{slug}`) and 25 `sitepage` docs. Meta is
`show_in_rest` strings: repeaters are JSON, line-lists newline-joined, booleans
`"1"`. `page-attributes` everywhere so `menu_order` drives ordering. All 12 are
handed to LivePress via the `livepress_collections` filter.

**87 documents seeded** from `wp-headless/payload-dump/` via REST, rebranded
Northline→Auxtech on the way in.

Add / edit / delete all work end to end — verified by creating a service only in
WordPress (its detail page and the hub listing both rendered) then deleting it
(page returned to 404).

## Free tools (all REAL, server-function backed)
`src/lib/tools-api.ts` (createServerFn + `.validator`) + `src/lib/gemini.server.ts`
(Gemini 2.0-flash REST; x-goog-api-key then Bearer fallback; ALWAYS heuristic
fallback so tools never break). Shared UI `src/components/tool-shell.tsx`.
Routes under `/tools/`: website-audit, speed-test, roi-calculator, brand-grader,
project-estimator, stack-recommender, headline-analyzer, meta-generator. Nova
chat (floating-widgets) answers via `runChat`. Mega menu lists the 6 strongest.
`GEMINI_API_KEY` lives in local `.env` (gitignored) and must be set on the host.

## Design state
- **Brand navy = #00022D** (user-final). styles.css `:root` dark tokens are all
  hue-268; hardcoded hexes in tools/favicon match.
- Logo: `src/components/auxtech-logo.tsx` (AuxtechMark) + `public/favicon.svg`.
  The user's real SVG can replace both (swap path data only).
- Counter bug fixed at root: `useScrollReveal` module refcount +
  `data-counter-value` stash.
- **Design round 3 shipped and committed** (`1c58741`): graded colour ramps,
  themes for the 4 newer tools, CTA unification (btn-gold is the one primary),
  services hub redesign, /solutions/scale-up StickyPinSteps, contrast fixes.
- Design skills to reload for design work: design-taste-frontend, gpt-taste,
  meta-skills:modern-web-design (rules held: zero em-dashes, eyebrow rationing,
  gapless grids, hero discipline).

## Known gaps — what is still code, not CMS
1. ~~Curated hub cards~~ — **done.** The services capability panels and the
   solutions cards are `service_groups` / `solution_cards` repeaters on their
   Site Page docs, seeded with the previous coded copy so nothing changed
   visually. Row order drives the 01/02/03 numbering, so dragging rows in
   LivePress reorders the page. Because a repeater sub-field is one string and
   LivePress has no nested repeater, the inner lists ride in textareas:
   `items` is `Title | Description` per line on services, and on solutions
   `metrics` is `Value | Label` per line with `items` one sub-service per line.
   Icons are Lucide names resolved through `iconFromName`, so a name outside
   the `ICONS` map in cms-catalog.ts silently becomes Sparkles — add the icon
   there first. The coded arrays remain as the fallback when the repeater is
   empty.
2. ~~Header mega menu~~ — **done.** Every `/services/{slug}` link takes its
   label and description from the CMS doc, and a service with no coded link is
   appended in a "More" column, so a service added in WordPress reaches the nav
   on its own. The curated Build/Design/Mobile/Ongoing grouping and the
   non-service links (Web Applications → /custom-software) are untouched. Top
   level order/rename/hide still comes from the `nav` global.
3. ~~Images~~ — **done.** `catalogDoc` in cms.ts used to hard-code
   `image: undefined`, so a CMS image could never reach a catalog page however
   it was set; it now reads the `image` meta. Hero images on service, solution,
   industry and tool docs and `cover_image` on projects are LivePress `image`
   fields — thumbnail plus Media Library picker — each paired with an
   `<key>_alt` field the plugin keeps in step when the picture changes. The 31
   catalog heroes were seeded with the exact coded URLs so nothing moved, and
   the six project covers, which were rendering random `picsum.photos`
   placeholders, got industry-matched Unsplash stock with real alt text.
   **Those six are stock standing in for real client work — replace them.**
   Images are stored as plain URLs, not attachment IDs, so an absolute URL and
   a Media Library pick both work (`cmsMedia` prefixes a site-relative path).
4. ~~Bespoke service and solution page layouts~~ — **done.** All 13 service and
   10 solution route files now build a
   keyed `blocks` record rendered through `src/components/page-sections.tsx`,
   driven by a `section_order` line-list on the doc. Empty = the page's coded
   order; a non-empty list is taken literally, so **removing a line hides that
   section**, which is how a section is deleted without a deploy. Every page is
   seeded with its full list so the editor edits down rather than up from
   nothing. Keys were derived from each section's own `{/* ══ TONE · … ══ */}`
   comment (e.g. `week-by-week-ledger-rail`), so they read as the designer
   named them. Unknown keys are ignored, so a stale list degrades to the
   sections that still exist. Verified by reordering and deleting a section on
   /services/mvp-development, /solutions/ecommerce and /industries/fintech,
   and by hiding the CTA band on /tools/speed-test, then reverting each.
   The 4 industry pages (6 sections each) and the 4 CMS-wired tool pages
   (`hero` + `banner` — the whole page is one surface plus the CTA) are
   converted too.
   All 8 tool pages are wired now: `headline-analyzer`, `meta-generator`,
   `project-estimator` and `stack-recommender` had no `tool` doc, no loader and
   no `cmsToTool` at all, so they were pure client pages. They now have registry
   entries in `tools.ts` (which is why check-pages counts 39 slugs, not 35),
   CMS docs seeded from that registry, and heroes that render the doc.
5. ~~Composable section internals~~ — **done.** `page_blocks` is a repeater on
   every catalog doc, rendered by `src/components/cms-blocks.tsx` wherever
   `section_order` names the reserved key **`cms-blocks`** — so authored
   sections land at a chosen point in the page, not always at the end.
   12 types: heading, prose, features, steps, benefits, stats, faq, compare,
   marquee, bigtype, cta, image. Each renders a component the site already
   uses (FeatureGrid, ProcessSteps, StatsRow, FAQAccordion, ComparisonTable,
   CTABand, LogoMarquee, OutlineTypeSection), so an authored section inherits
   the page's theme, spacing and reveal animation — no second visual
   vocabulary that only the CMS can produce.
   **One row shape, not one per type**: a LivePress repeater has fixed
   sub-fields, so every block is the same seven (type, eyebrow, heading, body,
   items, image, variant) and each type reads what it needs, with `items`
   carrying the type-specific part one entry per line, pipe-separated. A
   repeater per block type cannot interleave types in one order, which is the
   point. Unknown `type` renders nothing rather than dumping an object.
   `block-renderer.tsx` — the second, Payload-era vocabulary that rendered
   `/pages/{slug}` from a `layout_json` nothing ever wrote — is **deleted**.
   That route now uses these same blocks, so there is one vocabulary and one
   place to add a type. Its worthwhile part was ported: four collection-backed
   types (`projects`, `team`, `plans`, `testimonials`) that list live
   documents rather than retyped copy. Their rows are fetched in the route
   loader and passed to `CmsBlocks` via `data`, so they server-render; a block
   that fetched for itself would come back empty from the server. **Every
   catalog route supplies that data too**, via `cmsBlockData` in
   `src/lib/block-data.ts`, which reads the page's own block list and fetches
   only the collections it names — a page with no collection blocks, which is
   nearly all of them, makes no extra request.
   Core WP `page` carries `page_blocks` + the SEO pair, and edits in LivePress
   against `collection:page` (`wp-headless/livepress/schema-page-extra.php`).
   The bespoke sections' internals remain code, by design: they are what makes
   those pages look like themselves. This adds composition alongside them.
5. `DEPLOY.md` still describes the abandoned `rsautomartllc.com` hosts, and
   `src/lib/cms.ts:21` still defaults to `http://auxtech-v2.local`. Harmless
   (the build bakes `VITE_CMS_URL`) but both are stale.

## ROUND 4 — still queued (user-approved scope)
Same WORKFLOW.md team pattern:
1. Layout/IA de-genericization: per-page section ORDER varies, kill uniform
   BenefitList/FAQAccordion clones, add missing sections, trim bloat, animation
   audit + thinning.
2. Production-ready content site-wide, no filler; resolve copy contradictions
   (84% vs 98% retention, phantom API/AI/SOC2 services, service-name drift).
3. Pricing for ALL 13 services + 10 solutions, USA/UK/Europe oriented (USD
   primary + GBP/EUR, VAT note), per-subpage bands + pricing page.
4. Real images: Bloom MCP (trybloom) + Canva MCP + licensed stock
   (Unsplash/Pexels). NO Google Image scraping. Figma MCP needs user auth.

Constraints agreed: no invented named-client testimonials/logos/result numbers
(flag a list for the user instead); pricing = market-rate, user adjusts;
builders/QA at effort 'medium'; everything local, **no push**.

## Other open items
- Delete or gate the `home-2`..`home-5` experiment routes (home-4 shows an alien
  "HOMOLUDENS" brand).
- Optional: npm publish of `livepress-bridge`; swapping the
  `@lovable.dev/vite-tanstack-config` build dep (risky, needs care).

## Verify before every commit
`npx tsc --noEmit` + `node scripts/check-pages.mjs` (39 slugs) + a **sentinel
edit** against WP whenever CMS wiring changed. The CMS layer fails soft by
design, so a dead pipeline still returns 200 on every page — never trust
`bodyLen` or a status code alone. Set a unique string in WP, fetch the live
page, grep for it, then revert.

## Gotchas that bite
- Vite env vars are BUILD-time (change → rebuild, not restart).
- `.env*` is gitignored; the Gemini key never goes in code.
- TanStack loaders: serializable data only. Icon components blank the page on
  hydration — that is why the DTO + hydrate-in-component pattern exists.
- Git Bash rewrites `/home/...` in curl args (needs `MSYS_NO_PATHCONV=1`) but
  that same variable breaks curl's own `@localfile` paths — `cd` to the file and
  use a bare `@./name`. `tar` treats `C:/...` as a remote host; use `/c/...`.
- Python's TLS to admin.auxtechint.com gets reset; drive it with curl.
- Python on Windows writes CRLF in text mode — strip `\r` before feeding a file
  to a shell `read` loop.
- cPanel `Fileman/upload_files` will not overwrite without `overwrite=1`.
- PowerShell here-strings (`@'...'@`) are a parse error in the Bash tool; use a
  message file for multi-line commit messages.

## Credentials
cPanel password + API token and the WordPress application password were shared
in a chat transcript on 2026-09-21 and **should be rotated**. The WP app
password reaches Novamira's `execute-php` / `write-file` abilities, i.e. full
server control — treat it as the most sensitive of the three. No secrets are
stored in this repo.
