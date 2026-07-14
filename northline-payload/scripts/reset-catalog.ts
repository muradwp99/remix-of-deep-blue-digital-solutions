import "dotenv/config";
import { createRequire } from "node:module";

// `pg` is a transitive dep (via @payloadcms/db-postgres) and not hoisted to the
// workspace root under pnpm, so resolve it through the adapter that owns it.
const require = createRequire(import.meta.url);
const requireFromDb = createRequire(require.resolve("@payloadcms/db-postgres"));
const { Pool } = requireFromDb("pg") as typeof import("pg");

/**
 * Dev helper: drop the catalog tables whose column shape changed destructively
 * (services, solutions, industries, tools) so Payload's dev `push` recreates
 * them fresh instead of blocking on an interactive data-loss prompt.
 *
 * `learning` is intentionally excluded — its only change (+`format`) is additive
 * and pushes without a prompt.
 *
 * Lists matching tables by default; pass `--drop` to actually drop them.
 * Only ever touches tables named exactly one of the four slugs or prefixed
 * with `<slug>_` (Payload's array/group child tables).
 */
const ROOTS = ["services", "solutions", "industries", "tools"];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query<{ tablename: string }>(
  `SELECT tablename FROM pg_tables
     WHERE schemaname = 'public'
       AND (${ROOTS.map((_, i) => `tablename = $${i + 1} OR tablename LIKE $${i + 1} || '_%'`).join(" OR ")})
   ORDER BY tablename`,
  ROOTS,
);

console.log(`Matched ${rows.length} catalog table(s):`);
for (const r of rows) console.log("  •", r.tablename);

if (process.argv.includes("--drop")) {
  for (const r of rows) {
    await pool.query(`DROP TABLE IF EXISTS "${r.tablename}" CASCADE`);
    console.log("  ✗ dropped", r.tablename);
  }
  console.log("Done. Run the catalog seed next — Payload will recreate these fresh.");
} else {
  console.log("\n(dry run — pass --drop to drop the above)");
}

await pool.end();
process.exit(0);
