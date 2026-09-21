import { cmsFind } from "@/lib/cms";
import type { CmsBlockData, CmsBlockRow } from "@/components/cms-blocks";

/**
 * Fetch the live rows the collection-backed blocks need — and only those.
 *
 * Four of the block types list documents rather than copy: projects, team,
 * plans, testimonials. They have to be fetched in a route loader so they
 * server-render, which means every page carrying blocks would otherwise pay
 * for all four collections on every request, whether or not it uses any of
 * them. Most pages use none.
 *
 * So this reads the page's own block list first and fetches only the
 * collections named in it, in parallel. A page with no collection blocks —
 * the common case by far — makes no extra request at all.
 */
export async function cmsBlockData(blocks: CmsBlockRow[]): Promise<CmsBlockData> {
  const wanted = new Set(
    blocks.map((b) => (b.type ?? "").trim().toLowerCase()).filter(Boolean),
  );
  if (!wanted.size) return {};

  const out: CmsBlockData = {};
  const jobs: Promise<void>[] = [];

  if (wanted.has("projects")) {
    jobs.push(
      cmsFind<NonNullable<CmsBlockData["projects"]>[number]>("projects", {
        sort: "-featured",
        limit: 8,
      }).then((rows) => {
        out.projects = rows;
      }),
    );
  }
  if (wanted.has("team")) {
    jobs.push(
      cmsFind<NonNullable<CmsBlockData["team"]>[number]>("team", {
        sort: "order",
        limit: 12,
      }).then((rows) => {
        out.team = rows;
      }),
    );
  }
  if (wanted.has("plans")) {
    jobs.push(
      cmsFind<NonNullable<CmsBlockData["plans"]>[number]>("plans", {
        sort: "order",
        limit: 12,
      }).then((rows) => {
        out.plans = rows;
      }),
    );
  }
  if (wanted.has("testimonials")) {
    jobs.push(
      cmsFind<NonNullable<CmsBlockData["testimonials"]>[number]>("testimonials", {
        limit: 12,
      }).then((rows) => {
        out.testimonials = rows;
      }),
    );
  }

  await Promise.all(jobs);
  return out;
}
