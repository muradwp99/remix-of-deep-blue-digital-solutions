import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

/**
 * Jobs seed — UPSERTS the Careers page roles into the `jobs` collection.
 *
 * Data is TRANSCRIBED VERBATIM from the site app's Careers route
 * (src/routes/careers.tsx). The free-text `dept` label there is mapped to a
 * valid `department` select option in src/collections/Jobs.ts. `description`
 * is intentionally omitted — the site card does not render it.
 *
 * Non-destructive and re-runnable: upsert-by-slug, no deletes.
 */

const payload = await getPayload({ config });

/** Mirror of src/fields/slug.ts `toSlug`. */
const toSlug = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

// ---------------------------------------------------------------------------
// Source-of-truth data (transcribed verbatim from src/routes/careers.tsx)
// ---------------------------------------------------------------------------

type JobSrc = {
  role: string;
  dept: string;
  loc: string;
  salary: string;
  tags: string[];
};

const jobs: JobSrc[] = [
  { role: "Senior Full-Stack Engineer", dept: "Engineering", loc: "Remote · Worldwide", salary: "$130k–$175k", tags: ["TypeScript", "React", "Node"] },
  { role: "Senior Product Designer", dept: "Design", loc: "Remote · Worldwide", salary: "$110k–$150k", tags: ["Product", "Systems", "Figma"] },
  { role: "Mobile Engineer (React Native)", dept: "Engineering", loc: "Remote · Worldwide", salary: "$115k–$155k", tags: ["React Native", "Swift", "Kotlin"] },
  { role: "Design Engineer (Motion)", dept: "Design × Engineering", loc: "Remote · EU overlap", salary: "$125k–$165k", tags: ["GSAP", "WebGL", "CSS"] },
  { role: "Senior Growth Marketer", dept: "Marketing", loc: "Remote · EU overlap", salary: "$95k–$130k", tags: ["Paid", "Lifecycle", "CRO"] },
];

/** Map the site's free-text `dept` to a valid Jobs.ts `department` select option. */
const deptToDepartment: Record<string, string> = {
  Engineering: "Engineering",
  Design: "Design",
  "Design × Engineering": "Design",
  Marketing: "Growth",
};

// ---------------------------------------------------------------------------
// Upsert (non-destructive, re-runnable — match by slug)
// ---------------------------------------------------------------------------

async function upsert(collection: string, rows: Record<string, unknown>[]): Promise<void> {
  for (const data of rows) {
    const found = await payload.find({
      collection: collection as never,
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
    });
    const existing = found.docs[0] as { id: number | string } | undefined;
    if (existing) {
      await payload.update({
        collection: collection as never,
        id: existing.id as never,
        data: data as never,
      });
    } else {
      await payload.create({ collection: collection as never, data: data as never });
    }
  }
  console.log(`✓ ${collection}: upserted ${rows.length}`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log("Seeding jobs…");

await upsert(
  "jobs",
  jobs.map((j) => ({
    title: j.role,
    department: deptToDepartment[j.dept],
    type: "full-time",
    location: j.loc,
    salary: j.salary,
    tags: j.tags,
    open: true,
    slug: toSlug(j.role),
  })),
);

console.log("Jobs seed complete.");
process.exit(0);
