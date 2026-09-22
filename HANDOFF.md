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

- **Frontend:** https://auxtechint.com — self-hosted on the user's own cPanel
  (LiteSpeed). Host detail in `HOSTING.local.md`.
- **CMS:** https://admin.auxtechint.com — WordPress 7.1.1, PHP 8.2.33, same
  account.
- **GitHub:** site = muradwp99/remix-of-deep-blue-digital-solutions (main);
  LivePress kit = **github.com/muradwp99/livepress** (public, MIT).
- Local dev: `npm run dev` → :8080. Cold start ~45s, first SSR ~5s.

> **User rule (2026-09-21): no Vercel, no external hosting services. Do not
> suggest it.** The old `auxtech-website.vercel.app` and the
> `*.rsautomartllc.com` pair are abandoned; everything runs on the cPanel above.

## Hosting

Self-hosted on the user's own cPanel. The server's address, account name,
filesystem layout, the Passenger wiring and the deploy recipe are in
**`HOSTING.local.md`**, which is gitignored: this repo is public, and while
none of that is a credential, together it maps the box. Claude's auto-memory
(`cpanel-auxtechint-deploy.md`) carries the same recipe.

Deploys are **not** automatic — the build is uploaded and extracted through the
cPanel API. See that file before deploying; there are two traps in it that will
cost you an afternoon otherwise.

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
2. ~~Header mega menu~~ — **done, both panels.** One `withCmsNav` in
   site-header.tsx takes the panel and the link prefix; Services and Free Tools
   both go through it. Every `/services/{slug}` and `/tools/{slug}` link takes
   its label and description from the matching CMS doc, so a rename in
   WordPress renames it in the nav, and a doc with no coded link is added on
   its own. Where the un-linked ones land is per panel: Services gets a "More"
   column (it has four already, and crowding one would unbalance it), tools are
   appended to Free Tools (a fourth column beside Learning and Blog & News
   would not fit). Tools were hardcoded until 2026-09-22, which is why Speed
   Test and Brand Grader had pages but no nav entry — the CMS held eight tool
   docs and the menu listed six. The curated Build/Design/Mobile/Ongoing
   grouping and the non-service links (Web Applications → /custom-software) are
   untouched. Top level order/rename/hide still comes from the `nav` global.
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
5. ~~Stale deploy docs and CMS default~~ — **done.** `DEPLOY.md` described
   the abandoned `rsautomartllc.com` hosts and was rewritten. `cms.ts` fell
   back to `http://auxtech-v2.local`, so a build that forgot `VITE_CMS_URL`
   returned 200 on every page while fetching nothing — the exact failure this
   layer is built to hide. The fallback is production now; developing against a
   local WordPress is the explicit case, set in `.env.local`.

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
- WordPress site title/tagline were "Born To Be Wild" / empty; set to
  "Auxtech" / "A studio, not a factory." on 2026-09-22.
- ~~**`design` global**~~ — **done, all four controls.** It was broken on three
  axes at once. (a) LivePress stores options as `livepress_<key>` and the
  bridge read `auxtech_<key>`, so the Design screen saved to a row nothing
  read. `auxtech_global()` in `wp-headless/auxtech-headless.php` resolves each
  global from whichever row owns it and falls back to the other name, and the
  write path follows the same rule; copied to the server by hand on 2026-09-22.
  Note that **writes into `wp-content/` are refused in these sessions** as a
  production deploy, so any future mu-plugin change has to be copied across by
  hand too. (An earlier note here claimed the server copy had mojibake
  em-dashes. It does not — that was Windows decoding a curl pipe as the console
  codepage. Read cPanel file content to a file and json.load it, never through
  a pipe.) (b) The screen edits `gold500`, `gold400`, `gold300` and `ink950` —
  names from the codebase LivePress was first written against, none of which
  exist here. `src/lib/design-tokens.ts` maps them onto this stylesheet: the
  accent runs through `makeTheme`, the same generator the per-page themes use,
  so all ~25 derived tokens follow it rather than `--gold` alone; light and
  lightest override the tokens their labels name; the background rebuilds the
  neutral ramp on the picked base. (c) The radius consumer appended `px`
  unconditionally, so the stylesheet's own `0.75rem` would have rendered as
  `0.75px` and flattened every rounded corner.

  Two things to know before using it. **The background is clamped to
  L ≤ 0.32** — it tunes the near-black, it is not a light-mode switch, and
  every foreground token in the stylesheet is near-white. And **themed pages
  keep their own accent**: they set the same variables as an inline style on
  the shell root, which outranks `:root`. They do take the background, which
  is why `shiftSurfaces` in SiteShell moves a theme's `--surface`,
  `--surface-2` and `--card` by the same delta the base moved — without it the
  cards end up darker than the page and the depth reads inside out.

  **Radius now has a control too**, added to LivePress 1.5.2 by
  `wp-headless/livepress/radius-control-1.5.2.patch` — a fifth token with
  `kind => 'length'` that renders as a slider and a number instead of a swatch.
  It stores a bare number and the frontend appends `px`. The patch header says
  what was and was not verified; the rendered control is the part that could
  not be, because installing it means writing into `wp-content/`.

  `oklchFromHex` in themes.ts is the bridge between the hex the editor sends
  and the hue `makeTheme` wants; checked against the canonical OKLCH for
  `#ff0000` (L .628 C .258 H 29.2). Verified live with all four set to
  primaries and with LivePress's own default palette, on a themed and an
  untuned page, then cleared. The option is empty, which is the right default —
  empty means "use the stylesheet".
- `header` and `site_settings` globals are read by nothing; seeding them would
  give an editor fields with no effect.
- The homepage's `work_items` meta key is not in the LivePress schema, so it
  alone of the homepage fields could not be seeded and is not editable.
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
No secrets are stored in this repo. Which credentials exist, where they are
used and what needs rotating is in `HOSTING.local.md`.
