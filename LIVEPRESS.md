# LivePress — realtime visual editing for headless WordPress

**The invention:** WordPress as a *live visual editor* for a modern JS frontend
(React/TanStack here; the pattern fits Next.js identically). Sanity and
Storyblok sell this experience; WordPress headless has never had it. We build
it as a reusable, open pattern: schema-driven fields in WP, a postMessage
bridge, and a frontend overlay — **keystrokes in wp-admin appear on the real
rendered site instantly, before saving.**

## What already works (Phase A — DONE)
- **Edit bridge** (`src/lib/edit-bridge.ts`): when the site runs in the admin
  preview iframe (or `?edit=1`), it listens for `aux-edit` postMessages and
  overlays values onto page content via `useLiveEdits(content)` — one hook per
  page. Memory-only; saved content untouched until Update.
- **Broadcaster** (mu-plugin): every keystroke in a Home Page field streams
  into the preview iframe (debounced 120ms). Scalars + line-lists live now.
- **Preview metabox**: iframe of the real site on the edit screen.
- Verified end-to-end: message → React → DOM in <400ms.

## Message contract (the protocol other devs can adopt)
```
admin → frontend: { type: "aux-edit",       path: "hero.headline", value }
                  { type: "aux-edit-bulk",  edits: [{ path, value }] }
                  { type: "aux-edit-reset" }
frontend → admin: { type: "aux-edit-ready" }
```
`path` = dot path into the page content object; `value` = string | string[] |
row[]. Frontend validates path shape + applies immutably.

## Phase B — one "Site Pages" list + modern editor (next)
Kills the 35-CPT sidebar problem and the dated metabox UI in one move:
1. **Single CPT `sitepage`** — one doc per route, admin shows ONE list (like
   Pages). `homepage` CPT merges into it (doc `home`).
2. **Schema registry** — one JSON file (versioned in repo, mirrored to WP)
   declaring each page's sections/fields. Frontend types + admin UI + REST
   mapping all generate from it. Single source of truth.
3. **React edit screen** (replaces metaboxes for `sitepage`, built on
   @wordpress/components): left = modern field panel (sections, repeaters with
   **drag-reorder**, media-library image pickers), right = live preview
   iframe. Save via REST. Repeater edits stream as row arrays (bridge already
   accepts them).

## Phase C — design flexibility (images, radius, tokens, menus)
- **Design tokens doc** (global): radius, colors, spacing, font scale →
  frontend reads as CSS variables; token changes stream over the same bridge
  (instant restyle). This answers "border radius from admin".
- **Image fields** = WP media library picker; URL lands in the field, streams
  live like text. (Frontend `cmsMedia` already resolves relative URLs.)
- **Menu editor**: header/footer nav as drag-sortable tree in the React admin,
  stored in the `auxtech_header` / `auxtech_footer` options the frontend
  already reads; live preview via bridge.

## Phase D — polish to product
- Click-to-edit: clicking an element in the preview focuses its field
  (frontend sends `{type:"aux-focus", path}` upward).
- Draft/publish preview states; per-field revision diff.
- Extract plugin + `edit-bridge` into a standalone package: **the reusable
  "LivePress" kit any WP + React/Next project can drop in.**

## Design rules learned so far
- CPT-per-page does NOT scale in the admin sidebar — single `sitepage` CPT +
  per-page schema is the way.
- Fail-soft everywhere: bridge inactive outside iframe/?edit → zero prod cost.
- Keep the schema in the repo, mirror into WP — code review + types stay
  authoritative.
