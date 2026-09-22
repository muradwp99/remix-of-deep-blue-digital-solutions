/**
 * Generate public/sitemap.xml and public/robots.txt before a build.
 *
 * Two sources, because the site has two kinds of page: the coded routes are
 * read from the filenames in src/routes (TanStack file routing, so the
 * filename IS the URL), and the dynamic ones are fetched from the CMS, since
 * a service added in WordPress has no route file to be found in.
 *
 * If the CMS is unreachable the coded routes are still written rather than
 * failing the build — a partial sitemap is worth more than none, and a build
 * that dies because a CMS blipped is worse than either.
 */

import { readdir, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.SITE_URL || "https://auxtechint.com").replace(/\/$/, "");
const CMS = (process.env.VITE_CMS_URL || "https://admin.auxtechint.com").replace(/\/$/, "");

/**
 * Routes that exist but should not be advertised.
 *
 * The home-N design experiments used to live here. They are deleted now, so
 * the set is empty — but the mechanism stays, because the next unfinished
 * page someone leaves behind should be easy to hide without rewriting this.
 */
const EXCLUDE = new Set([]);

/** CMS collection → the URL prefix its slugs live under. */
const COLLECTIONS = [
  ["service", "/services"],
  ["solution", "/solutions"],
  ["industry", "/industries"],
  ["tool", "/tools"],
  ["project", "/works"],
  // `learning` is deliberately absent. Its 22 docs are list entries on the
  // four coded category pages (/learning/templates and friends), not pages
  // of their own — there is no /learning/{item} route, so advertising one
  // URL per doc listed 22 addresses that have never resolved. Add this back
  // the day an item detail route exists.
  ["posts", "/blog"],
  ["pages", "/pages"],
];

function routeToPath(file) {
  if (!file.endsWith(".tsx")) return null;
  const base = file.slice(0, -4);
  if (base.startsWith("__") || base === "index") return base === "index" ? "/" : null;
  if (base.includes("$")) return null; // dynamic — comes from the CMS instead
  // `services_.mvp-development` → services/mvp-development
  return "/" + base.replace(/_\./g, "/").replace(/\./g, "/");
}

async function codedRoutes() {
  const files = await readdir(join(ROOT, "src", "routes"));
  return files
    .map(routeToPath)
    .filter((p) => p && !EXCLUDE.has(p))
    .sort();
}

async function cmsSlugs() {
  const out = [];
  for (const [type, prefix] of COLLECTIONS) {
    try {
      const res = await fetch(`${CMS}/wp-json/wp/v2/${type}?per_page=100&_fields=slug,modified`);
      if (!res.ok) continue;
      const docs = await res.json();
      if (!Array.isArray(docs)) continue;
      for (const d of docs) {
        if (d?.slug) out.push({ path: `${prefix}/${d.slug}`, lastmod: d.modified });
      }
    } catch {
      /* CMS unreachable — coded routes still get written. */
    }
  }
  return out;
}

const [coded, dynamic] = await Promise.all([codedRoutes(), cmsSlugs()]);

const seen = new Set();
const urls = [];
for (const path of coded) {
  if (seen.has(path)) continue;
  seen.add(path);
  urls.push({ path, priority: path === "/" ? "1.0" : "0.7" });
}
for (const { path, lastmod } of dynamic) {
  if (seen.has(path)) continue;
  seen.add(path);
  urls.push({ path, lastmod, priority: "0.6" });
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(({ path, lastmod, priority }) =>
      [
        "  <url>",
        `    <loc>${SITE}${path}</loc>`,
        lastmod ? `    <lastmod>${String(lastmod).slice(0, 10)}</lastmod>` : null,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n") +
  `\n</urlset>\n`;

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  ...[...EXCLUDE].map((p) => `Disallow: ${p}`),
  "",
  `Sitemap: ${SITE}/sitemap.xml`,
  "",
].join("\n");

await mkdir(join(ROOT, "public"), { recursive: true });
await writeFile(join(ROOT, "public", "sitemap.xml"), xml, "utf8");
await writeFile(join(ROOT, "public", "robots.txt"), robots, "utf8");

console.log(
  `sitemap: ${urls.length} urls (${coded.length} coded, ${urls.length - coded.length} from CMS)`,
);
