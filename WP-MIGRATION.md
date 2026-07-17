# WordPress headless backend — migration state + API contract

WP (LocalWP) replaces Payload as the headless CMS. All Payload content migrated.

## Where things run
- **WP site**: `http://auxtech-v2.local` · admin `http://auxtech-v2.local/wp-admin` (user `auxadmin`)
- **Disk**: `C:\Users\murad\Local Sites\auxtech-v2\app\public`
- **WP-CLI wrapper**: `scratchpad/wpx.sh` (Local's PHP + `-d extension=mysqli` + phar; `DB_HOST` was switched to `127.0.0.1:10016` TCP so external CLI works)
- **Plugins**: `dynamicforge` v1.8.0 (user's own, from github.com/muradwp99/WordpressPlugins) + `auxtech-headless.php` **mu-plugin** (globals REST + CORS)

## Structure (all defs in wp_options, applied by `scratchpad/dynf-config.php`, re-runnable)
12 CPTs: `project service solution industry tool learning plan resource team testimonial faq job`
+ built-in `post` (blog, native categories/tags) + built-in `page` (block pages via `layout_json` meta).
16 DynamicForge field groups (`dynf_field_groups` option). Ordering via native `menu_order` (Payload `order` migrated into it).

## REST contract (what the frontend loaders consume)
Base `http://auxtech-v2.local/wp-json`:
- Lists: `GET /wp/v2/{type}?per_page=100&orderby=menu_order&order=asc&_fields=slug,title,meta` (types = CPT slugs above; blog = `/wp/v2/posts`, block pages = `/wp/v2/pages`)
- Detail: `GET /wp/v2/{type}?slug={slug}` (returns array)
- Globals: `GET /auxtech/v1/globals` → `{site_settings, header, footer}` (or `/globals/{key}`)
- CORS: mu-plugin allows `http://localhost:8080` (extend via `auxtech_allowed_origins` filter for prod)

**Field shapes in `meta`:**
- Scalars (text/number/url) → native JSON types. Checkboxes → `1`/`0`.
- **Repeaters → JSON *string*** — frontend must `JSON.parse` (e.g. `approach`, `results`, `features`, `steps`, `benefits`, `faqs`, `points`, `stats`).
- **Line-lists → newline-joined string** — frontend must `.split("\n")` (`services_list`, `stack`, `matches`, `checks`, `features` on plan, `job_tags`).
- Flattened objects → prefixed scalars: `banner_*`, `testimonial_*` (project), `meta_title`/`meta_description` (SEO).
- Richtext migrated as HTML: post `content.rendered`, faq `meta.answer`, learning body → `content.rendered`.
- `pages.layout` → `meta.layout_json` (JSON string of the Payload block array, unchanged shape → existing block renderer works after parse).

## Migrated counts (match Payload exactly)
project 6 · service 13 · solution 10 · industry 4 · tool 4 · learning 22 · plan 3 · resource 5 · team 4 · testimonial 3 · faq 5 · job 5 · posts 3 · pages 1 · categories 4 · tags 6 · globals 3. Media: none existed.

## Gotchas (learned the hard way)
1. **CPT must include `custom-fields` in supports** or WP REST omits the whole `meta` object.
2. DynamicForge registers meta on the global `post` object type — all keys visible on all types (harmless).
3. WP-CLI outside Local needs `-d extension=mysqli` + TCP DB host (Local PHP has no loaded php.ini).
4. Repeater values store as JSON strings — REST returns them as strings, not arrays.
5. Migration script is idempotent (upsert by type+slug): `wp eval-file migrate.php <dump-dir>`.

## Scripts (scratchpad — copy somewhere durable if wanted)
`dynf-config.php` (structure) · `migrate.php` (content) · `payload-dump/` (source JSON) · `wpx.sh` (CLI wrapper) · mu-plugin source `auxtech-headless.php`

## Frontend wiring — DONE
`src/lib/cms.ts` rewritten in place as a WP adapter: **same exported API + Payload doc shapes**, so zero changes in loaders/components/cms-catalog. Internals: collection registry (Payload name → WP endpoint + mapper), repeater JSON.parse, line-split, banner/testimonial re-nesting, `_embed=wp:term` for post categories, sort translation (`order`→menu_order, `-publishedAt`→date desc, `-featured`→JS sort), `where equals` JS-side (slug server-side). `lexicalToPlainText`/`lexicalToBlocks` accept HTML strings AND legacy Lexical trees. `cmsGlobal` → `/auxtech/v1/globals/{key}`. `cmsSubmitForm` → POST `/auxtech/v1/contact` (mu-plugin stores as private `submission` CPT + mails admin). `cmsFind("forms")` returns a stub id.

**Verified:** tsc clean, check-pages 35 slugs OK, sentinel edit in WP rendered through SSR on /leadership (proof data flows, then reverted), 8 key pages SSR healthy, browser CORS OK (footer global 200 from :8080 origin), contact POST 200, zero console errors.

Also wired: **home testimonials** (index.tsx loader → `testimonials` collection, per-author portrait map, fail-soft; sentinel-verified). `testimonials` + `resources` added to the cms.ts registry. Resources page (`/resources`) intentionally NOT wired — its curated marketing sections differ from the 5 CMS resource docs; wiring would downgrade content.

## Roadmap to fully live

### Phase 1 — Content polish (local, no hosting needed)
- Review all 12 CPTs in wp-admin; fix copy, fill empty `meta_title`/`meta_description`.
- Add real media: project covers, team photos → WP media library. Needs a small mapper update in `cms.ts` (featured-image → `coverImage`/`photo`) — currently images use built-in fallbacks.
- Optional: extend DynamicForge with a flexible-content field type for a nicer Pages-builder admin (layout_json textarea works meanwhile).

### Phase 2 — Production WP (needs Hostinger)
- Create WP on `cms.` subdomain (Hostinger one-click).
- Migrate LocalWP → Hostinger (All-in-One WP Migration or Local export). **Gotcha:** most migration plugins skip `mu-plugins/` — copy `auxtech-headless.php` manually.
- DynamicForge defs travel in the DB (wp_options) — nothing to re-run.
- New strong admin password; delete/rename default `auxadmin` if exposed.
- Add prod frontend origin via the `auxtech_allowed_origins` filter (tiny mu-plugin edit).

### Phase 3 — Hardening (prod WP)
- Cloudflare in front (WAF, rate-limit login, bot protection — free tier).
- IP-allowlist `/wp-admin` + `/wp-login.php`; custom login path + 2FA.
- Disable XML-RPC, user enumeration (`?author=`, REST `/users`), file editing (`DISALLOW_FILE_EDIT`).
- Auto-update core + plugins; hide WP version; HTTPS-only + security headers.
- REST: world gets GET only (auth-gated writes are already the default; contact POST stays open by design).

### Phase 4 — Frontend production deploy
- Set `VITE_CMS_URL` = prod CMS URL at build time.
- `npm run build` + deploy (Vercel/Netlify/Hostinger Node — SSR needs a Node runtime).
- Smoke test with a **sentinel edit** in prod CMS → must render on the prod site (fail-soft masks dead wiring; bodyLen alone lies).
- DNS: apex → frontend, `cms.` → WP.

### Phase 5 — Retire Payload
- Stop `northline-payload` dev server; drop local Postgres db `northline-payload`.
- Archive or delete `northline-payload/` (untracked in this repo).
- Remove `:3000` references (env, docs); update HANDOFF.md + memory.
