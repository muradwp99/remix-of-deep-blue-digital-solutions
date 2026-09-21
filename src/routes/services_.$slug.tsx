import { createFileRoute } from "@tanstack/react-router";
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
 * Catch-all for services without a bespoke route file.
 *
 * The thirteen services that shipped with the site each have their own
 * hand-built page. Anything added in the CMS afterwards lands here, so this
 * route reads the `services` collection rather than only the coded registry —
 * otherwise a new service would resolve to a 200 with a "not found" body.
 *
 * The coded entry, when there is one, stays as the fallback so a half-filled
 * CMS doc never blanks a page that used to render.
 */
export const Route = createFileRoute("/services_/$slug")({
  loader: async ({ params }): Promise<{ dto: SubpageDTO | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", params.slug, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null };
  },
  head: ({ loaderData, params }) => {
    const dto = loaderData?.dto ?? null;
    const fb = getSubpage("services", params.slug);
    const title = dto?.metaTitle || fb?.metaTitle || "Services — Auxtech";
    const description =
      dto?.metaDesc || fb?.metaDesc || "Design and engineering services from Auxtech.";
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
  const fb = getSubpage("services", slug);

  const page = dto ? (fb ? hydrateSubpage(dto, fb) : subpageFromDTO(dto)) : fb;
  if (!page) return <SubpageNotFound kind="services" />;
  return <SubpageTemplate page={page} />;
}
