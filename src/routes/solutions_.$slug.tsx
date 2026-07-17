import { createFileRoute } from "@tanstack/react-router";
import { SubpageTemplate, SubpageNotFound } from "@/components/subpage-template";
import { getSubpage } from "@/lib/subpages";

export const Route = createFileRoute("/solutions_/$slug")({
  head: ({ params }) => {
    const page = getSubpage("solutions", params.slug);
    const title = page?.metaTitle ?? "Solutions — Auxtech";
    const description = page?.metaDesc ?? "Industry and business solutions from Auxtech.";
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
  const page = getSubpage("solutions", slug);
  if (!page) return <SubpageNotFound kind="solutions" />;
  return <SubpageTemplate page={page} />;
}
