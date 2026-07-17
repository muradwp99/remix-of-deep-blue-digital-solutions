# Go-live guide

- WP (CMS): **aux.rsautomartllc.com** — All-in-One WP Migration from LocalWP
- Frontend (TanStack Start SSR, needs Node): **auxfront.rsautomartllc.com** — from GitHub

## Phase 0 — prep (Hostinger hPanel)
1. Create both subdomains under rsautomartllc.com: `aux` and `auxfront`.
2. Enable free SSL on both (hPanel → Security → SSL). Wait until both serve https.
3. Confirm your plan shows **Node.js** support in hPanel for auxfront (Website →
   Node.js). If it doesn't, host the frontend on Render/Railway/Vercel instead —
   same env var, same build.

## Phase 1 — WordPress migration (aux.)
1. Install fresh WordPress on `aux.rsautomartllc.com` (hPanel one-click).
2. LocalWP site → install **All-in-One WP Migration** → Export → File. 
3. Fresh WP admin → install All-in-One WP Migration → Import the file
   (free tier caps ~50–300MB — our site is tiny, fine).
4. Log in with your **LocalWP** admin credentials (import replaces users).
5. **Immediately change the admin password** to a strong unique one.
6. Permalinks: Settings → Permalinks → Save (flush rewrites).
7. Verify AIO carried mu-plugins: check `wp-content/mu-plugins/auxtech-headless.php`
   exists via hPanel File Manager. If missing, upload it from the repo
   (`wp-headless/auxtech-headless.php`).

## Phase 2 — point WP at the prod frontend
Create `wp-content/mu-plugins/prod-config.php` on the server (File Manager):

```php
<?php
// Production overrides for the headless bridge.
add_filter( 'auxtech_frontend_url', fn() => 'https://auxfront.rsautomartllc.com' );
add_filter( 'auxtech_allowed_origins', fn( $o ) => array_merge( $o, array(
    'https://auxfront.rsautomartllc.com',
) ) );
```

This fixes: the visitor redirect target, the LivePress preview iframe URL,
the post-preview metabox, and CORS for the browser-side fetches (footer,
design tokens, nav).

## Phase 3 — frontend deploy (auxfront.)
Frontend is **TanStack Start (Vite SSR)** — Node app, not static HTML.

1. hPanel → auxfront website → **Node.js** (or Git deploy):
   - Repo: your site's GitHub repo, branch `main`
   - Node version: 20+
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `node .output/server/index.mjs`
   - The host's `PORT` env is respected automatically by Nitro.
2. **Environment variable (build-time!):**
   ```
   VITE_CMS_URL=https://aux.rsautomartllc.com
   ```
   Vite bakes this into the bundle during `npm run build`. If you ever change
   it, you must **rebuild**, not just restart.
3. Deploy. First build takes a few minutes.

Fallback if hPanel lacks Node: Render.com free web service — same repo,
same build/start commands, same env var; then point the `auxfront` DNS
record (CNAME) at Render.

## Phase 4 — smoke test (do not skip the sentinel)
1. `https://aux.rsautomartllc.com` → must redirect to auxfront (headless redirect).
2. `https://aux.rsautomartllc.com/wp-json/wp/v2/service?per_page=1` → JSON.
3. `https://auxfront.rsautomartllc.com` → site renders.
4. **Sentinel test** — fail-soft masks dead wiring, so prove data flows:
   wp-admin → LivePress → Site Pages → Home → change the hero headline →
   Save → reload auxfront. Must show the change. Revert after.
5. Footer + menus render (browser-side CORS path): check the footer columns
   load and no CORS errors in devtools console.
6. Contact form: submit a test → appears in wp-admin → Form Submissions.
7. LivePress editor on prod: open Site Pages → Home — preview iframe must
   show auxfront and stream keystrokes.

## Phase 5 — hardening (prod WP only)
1. Cloudflare in front of `aux.` (free): WAF on, rate-limit `/wp-login.php`.
2. Limit login: 2FA plugin (e.g. Two-Factor) for the admin user.
3. Disable XML-RPC (plugin or Cloudflare rule blocking `/xmlrpc.php`).
4. `wp-config.php`: add `define( 'DISALLOW_FILE_EDIT', true );`
5. Auto-updates on for core + the 3 plugins (dynamicforge, livepress, AIO).
6. Delete the All-in-One WP Migration export file from the server after import.
7. Uploads/backups: enable Hostinger daily backups for the WP subdomain.

## Phase 6 — cleanup
- Retire the Payload stack: stop `northline-payload` dev use; local Postgres
  db can be dropped whenever.
- LocalWP site stays as your staging — edit → export → import to re-deploy
  content wholesale, or just edit prod directly (LivePress works there).

## Env var summary
| Where | Key | Value |
|---|---|---|
| auxfront (build-time) | `VITE_CMS_URL` | `https://aux.rsautomartllc.com` |
| aux. WP (mu-plugin) | `auxtech_frontend_url` filter | `https://auxfront.rsautomartllc.com` |
| aux. WP (mu-plugin) | `auxtech_allowed_origins` filter | `https://auxfront.rsautomartllc.com` |

Nothing else. No DB creds cross the boundary; the frontend reads public REST
+ posts to the open contact endpoint only.
