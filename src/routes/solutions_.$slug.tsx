import { createFileRoute, notFound } from "@tanstack/react-router";
import { SubpageTemplate, SubpageNotFound } from "@/components/subpage-template";
import { getSubpage } from "@/lib/subpages";
import { cmsFindOne } from "@/lib/cms";
import {
  cmsToSubpageDTO,
  hydrateSubpage,
  subpageFromDTO,
  type CmsSubpage,
  type SubpageDTO,
} from "@/lib/cms-catalog";

/**
 * Catch-all for solutions without a bespoke route file — the services
 * catch-all's twin. See `services_.$slug.tsx` for why this reads the CMS.
 */
export const Route = createFileRoute("/solutions_/$slug")({
  loader: async ({ params }): Promise<{ dto: SubpageDTO | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", params.slug, { depth: 1 });
    // Neither the CMS nor the built-in set has this slug. Returning null
    // rendered the empty shell with a 200 — a soft 404, which keeps the URL
    // indexed and shows a reader a blank page instead of telling them.
    if (!doc && !getSubpage("solutions", params.slug)) throw notFound();
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null };
  },
  head: ({ loaderData, params }) => {
    const dto = loaderData?.dto ?? null;
    const fb = getSubpage("solutions", params.slug);
    // A CMS solution with no meta_title should still get its own name in the
    // tab, not the generic hub title.
    const title =
      dto?.metaTitle ||
      (dto?.nav ? `${dto.nav} — Auxtech` : "") ||
      fb?.metaTitle ||
      "Solutions — Auxtech";
    const description = dto?.metaDesc || fb?.metaDesc || "Outcome-led solutions from Auxtech.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { dto } = Route.useLoaderData();
  const fb = getSubpage("solutions", slug);

  const page = dto ? (fb ? hydrateSubpage(dto, fb) : subpageFromDTO(dto)) : fb;
  if (!page) return <SubpageNotFound kind="solutions" />;
  return <SubpageTemplate page={page} />;
}
