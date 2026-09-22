/**
 * The parts of a page's head that every page needs and none of them set.
 *
 * Titles, descriptions and `og:title` were already per-route — each route
 * hand-rolls them in its own `head()`. What was missing was everything that
 * depends on knowing *which URL this is*: a canonical link, `og:url`, and a
 * share image. The first two matter because the site has parameterised
 * duplicates (`/blog?cat=engineering` is the same page as `/blog`), and
 * without a canonical a crawler has to guess which one is the real address.
 *
 * The share image matters for a blunter reason: the root already declared
 * `twitter:card = summary_large_image` and never declared an image, so every
 * link to this site posted anywhere rendered a large blank card.
 *
 * All of it is computed from the route matches in `__root.tsx`, so it applies
 * to all 39 coded routes and every CMS-driven one without touching them.
 */

/**
 * The public origin. Vite bakes it in at build time, same as `VITE_CMS_URL`,
 * and `scripts/gen-sitemap.mjs` reads the same variable so the sitemap and
 * the canonicals cannot disagree about where the site lives.
 */
export const SITE =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://auxtechint.com";

/** The default share card. Generated from the brand tokens; see scripts/. */
export const OG_IMAGE = "/og.jpg";
export const OG_IMAGE_ALT = "Auxtech — software worth being proud of.";

/** A site-relative path as an absolute URL; anything already absolute is left alone. */
export function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * The canonical path for a set of route matches.
 *
 * The deepest match is the page; the shallower ones are layouts. Search
 * params are deliberately dropped — pointing `/blog?cat=design` at `/blog` is
 * the whole reason for having a canonical here. A trailing slash is stripped
 * so `/about/` and `/about` cannot both be advertised as the real one.
 */
export function canonicalPath(matches: ReadonlyArray<{ pathname: string }>): string {
  const deepest = matches[matches.length - 1]?.pathname ?? "/";
  const trimmed = deepest.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}
