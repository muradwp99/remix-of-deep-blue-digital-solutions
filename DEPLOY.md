# Deploying Auxtech

The frontend is **self-hosted on the owner's own cPanel**, not on a PaaS. That
changes the shape of a deploy: there is no git-push-to-deploy, no build runner,
no dashboard. A build is produced locally and uploaded.

> **The server's address, account name, filesystem layout, the Passenger wiring
> and the exact upload commands are in `HOSTING.local.md`, which is
> gitignored** — this repo is public, and while none of that is a credential,
> together it maps the box. Read that file before deploying. Claude's
> auto-memory (`cpanel-auxtechint-deploy.md`) carries the same recipe.

This file covers only the part that is safe to publish: what a deploy consists
of, and what will bite you.

## Build

```
NITRO_PRESET=node-server VITE_CMS_URL=https://admin.auxtechint.com npm run build
```

Both are required, and neither is optional in the way it looks:

- **`NITRO_PRESET=node-server`** — the repo's default Nitro target is
  **cloudflare**, which emits a `wrangler.json` and an entry the server cannot
  run. Build without this and you get a clean, useless bundle.
- **`VITE_CMS_URL`** — Vite bakes this into the bundle at build time. Changing
  where the CMS lives means a **rebuild**, not a restart. Without it the build
  falls back to a LocalWP address and the live site silently serves its
  built-in copy instead of CMS content.

`npm run build` also regenerates `public/robots.txt` and `public/sitemap.xml`
(`scripts/gen-sitemap.mjs`), pulling dynamic URLs from the CMS.

The `node-server` output in `.output/` is self-contained — there is no
`npm install` on the server.

## Deploy

Upload `.output/`, extract it over the app directory, then restart the app.
Commands in `HOSTING.local.md`.

## Verify, in this order

1. `npx tsc --noEmit`
2. `node scripts/check-pages.mjs` — 39 slugs, all routed and themed
3. After uploading, **check the served bundle hash matches the local one**:
   ```
   curl -s https://auxtechint.com/ | grep -o '/assets/site-shell-[^"]*\.js'
   ```
   against the matching filename in `.output/public/assets`. Pick a chunk you
   actually changed — an unchanged chunk matches whether or not the deploy
   landed, and proves nothing.
4. A **sentinel edit** if CMS wiring changed: set a unique string in
   WordPress, fetch the live page, grep for it, revert. The CMS layer fails
   soft by design, so a completely dead pipeline still returns 200 on every
   page. Status codes and body length prove nothing on their own.

## Two traps

**The app must stay unregistered in cPanel's Application Manager.** Registering
it there overrides the `.htaccess` that makes the site work and points it at a
Node binary that does not exist on the server — 503 on every page. Do not open
Application Manager for this domain.

**Deleting the restart file before re-uploading it.** The upload API refuses to
overwrite an existing file *silently*. A second deploy that skips the delete
uploads nothing, the app never restarts, and the old process keeps serving the
old asset manifest: new hashed chunks 404 while the HTML still points at the
previous ones. Everything looks fine on disk. Only step 3 above catches it.

## The CMS

WordPress at `admin.auxtechint.com`, edited through LivePress. **Pretty
permalinks are required** — with the plain structure `/wp-json/` 404s and only
`index.php?rest_route=` answers, so every frontend fetch fails soft and the
site looks fine while being entirely disconnected from its content.

Content changes need no deploy. Only code changes do.
