# LivePress — realtime visual editing for headless WordPress

WordPress as a **live visual editor** for a modern JS frontend. Type in
wp-admin, watch the real rendered site change **before saving**. Sanity and
Storyblok sell this experience; WordPress headless never had it. This repo
contains the working reference implementation — built on TanStack Start, and
the pattern maps 1:1 to Next.js.

## What it does (all shipped, all verified)

- **Fullscreen editor** — WP chrome hidden; schema-driven field panel left,
  live iframe of the real page right. Accordion sections, drag-reorder
  repeaters, media-library image pickers, device-size preview
  (desktop/laptop/tablet/mobile).
- **Realtime streaming** — every keystroke posts into the preview and renders
  in <400ms. No save, no reload. Unsaved edits survive preview reloads.
- **One "Site Pages" list** — 25 pages in a single CPT list, not 25 sidebar
  menus. Collections (projects, services, …) open the same editor from their
  native lists.
- **Section drag-reorder** — the home page renders keyed blocks in
  CMS-driven order; drag rows, the live page rearranges.
- **Click-to-edit** — click any section in the preview; its panel opens,
  scrolls, flashes. Link navigation is suppressed in edit mode.
- **Design tokens** — border-radius slider + brand color pickers restyle the
  whole site live (`:root` CSS variable overrides), standalone "Design" screen.
- **Menu editor** — drag/rename/hide top-level nav + full footer columns
  editor, standalone "Menus" screen (mega-panel contents stay code-owned).
- **Fail-soft everywhere** — the frontend renders its built-in copy when WP
  is unreachable; the bridge is inert outside the editor. Zero prod cost.

## Architecture

```
┌───────────────────────────── wp-admin ──────────────────────────────┐
│  LivePress editor (plugin)                                          │
│  schema registry → field panel → postMessage per keystroke ──────┐  │
│  Save → REST (post meta / auxtech options)                       │  │
└──────────────────────────────────────────────────────────────────┼──┘
                                                                   ▼
┌───────────────────────── frontend (iframe) ─────────────────────────┐
│  edit-bridge: useLiveEdits(content) overlays paths immutably        │
│  DesignTokensStyle / useNavItems / footer listener (globals)        │
│  loaders fetch WP REST; inline fallbacks when CMS absent            │
└─────────────────────────────────────────────────────────────────────┘
```

### The protocol (adopt this, everything else follows)

```
admin → frontend:
  { type: "aux-edit",      path: "hero.headline", value }   // dot-path overlay
  { type: "aux-edit-bulk", edits: [{ path, value }] }
  { type: "aux-edit-reset" }
  { type: "aux-design",    tokens: { radius, gold, lime } } // CSS vars
  { type: "aux-menu",      nav: [{ key, label, visible }] }
  { type: "aux-footer",    footer: { blurb, columns } }
frontend → admin:
  { type: "aux-edit-ready" }                                // rebroadcast hook
  { type: "aux-focus",     section }                        // click-to-edit
```

`value` is a string, string[] (line lists) or row[] (repeaters). The frontend
validates path shape and applies immutably.

## The kit — what you copy into another project

**WordPress side** (drop into `wp-content/plugins/` + `mu-plugins/`):
- `wp-headless/livepress/` — the editor: CPT, schema registry, fullscreen
  screens, REST meta registration, redirects. No build step, vanilla JS.
- `wp-headless/auxtech-headless.php` — headless bridge mu-plugin: globals
  REST, option writer, CORS, contact endpoint, front-end redirect, post
  preview metabox. Rename the `auxtech_*` prefix to taste.

**Frontend side** (framework-agnostic React):
- `src/lib/edit-bridge.ts` — the whole runtime: `useLiveEdits(content)`,
  `isEditMode()`, click-to-edit sender. ~180 lines, zero deps beyond React.
- `src/lib/cms.ts` `sitepages` collection + `pageStr/pageRows/pageLines` —
  flat page-doc consumption with inline fallbacks.
- `src/components/design-tokens.tsx` — token overlay.

### Wiring a page (the proven 4-step recipe)

1. **Route**: loader fetches `cmsFindOne("sitepages", "<slug>")`; component
   runs `const d = useLiveEdits(doc)` and replaces literals with
   `pageStr(d, "key", "fallback")` / `pageRows` / `pageLines`.
2. **Schema**: add a `<slug>` entry in `livepress-schema.php` — flat paths
   (path == meta key) unless the page pre-maps nested docs.
3. **Seed**: `wp_insert_post` a `sitepage` doc with current copy so editors
   see real values, not blanks.
4. **Verify with a sentinel**: change one WP value, curl the page, expect the
   sentinel — fail-soft masks dead wiring; body length alone lies.

Collections work the same with `collection:{post_type}` schemas; the route
overlays the raw doc and re-maps (`works_.$slug.tsx` is the reference).

## Hard-won rules

- Register REST meta for **every schema field** in the plugin itself
  (`register_meta` on init) — meta invisible in REST is the silent killer.
- CPTs must include `custom-fields` support or WP omits `meta` from REST.
- Repeaters travel as JSON strings; parse at the adapter boundary.
- Icons/animation chrome stay code-owned, matched to CMS rows by index —
  serialization contract (loaders return data only).
- One `sitepage` CPT, never CPT-per-page — sidebars don't scale.
- Blog posts keep Gutenberg (best long-form editor) + a preview iframe.

## Status / roadmap

- ✅ Phases A–D shipped: bridge, editor, tokens, menus, sections,
  click-to-edit, device preview, 25 Site Pages + 32 collection editors.
- ◻ Extraction to standalone repos (`livepress` plugin + `@livepress/bridge`
  npm package) — mechanical: the code is already framework-clean.
- ◻ Production: LocalWP → Hostinger per `WP-MIGRATION.md` phases.
