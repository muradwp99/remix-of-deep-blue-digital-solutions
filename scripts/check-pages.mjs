// Integrity guard: every content slug must have (a) a static unique route file
// and (b) a theme entry in src/lib/themes.ts. Fails loudly on drift so new
// data entries can't silently fall back to the generic template unthemed.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routesDir = join(root, "src", "routes");
const routes = new Set(readdirSync(routesDir));

const read = (p) => readFileSync(join(root, p), "utf8");
const slugsOf = (src) => [...src.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
// subpages.ts entries pair `slug:` with a `kind:` on the next line
const subpageSlugs = (kind) =>
  [
    ...read("src/lib/subpages.ts").matchAll(
      /slug:\s*"([a-z0-9-]+)",\s*\n\s*kind:\s*"(services|solutions)"/g,
    ),
  ]
    .filter((m) => m[2] === kind)
    .map((m) => m[1]);

const families = [
  { prefix: "services", slugs: subpageSlugs("services") },
  { prefix: "solutions", slugs: subpageSlugs("solutions") },
  { prefix: "industries", slugs: slugsOf(read("src/lib/industries.ts")) },
  { prefix: "tools", slugs: slugsOf(read("src/lib/tools.ts")) },
  { prefix: "learning", slugs: slugsOf(read("src/lib/learning.ts")) },
];

const themesSrc = read("src/lib/themes.ts");
const errors = [];

for (const { prefix, slugs } of families) {
  if (!slugs.length) errors.push(`no slugs parsed for family "${prefix}" — check the parser`);
  for (const slug of slugs) {
    const routeFile = `${prefix}_.${slug}.tsx`;
    if (!routes.has(routeFile)) errors.push(`missing unique route: src/routes/${routeFile}`);
    if (!themesSrc.includes(`"${prefix}/${slug}"`))
      errors.push(`missing theme entry: "${prefix}/${slug}" in src/lib/themes.ts`);
  }
}

if (!existsSync(join(routesDir, "services_.$slug.tsx"))) {
  errors.push("dynamic fallback services_.$slug.tsx was removed — unknown slugs would hard-404");
}

if (errors.length) {
  console.error(
    `check-pages: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join("\n"),
  );
  process.exit(1);
}
console.log(
  `check-pages: OK — ${families.reduce((n, f) => n + f.slugs.length, 0)} slugs, all routed and themed`,
);
