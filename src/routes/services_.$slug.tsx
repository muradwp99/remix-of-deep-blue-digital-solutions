import { createFileRoute } from "@tanstack/react-router";
import { SubpageTemplate, SubpageNotFound } from "@/components/subpage-template";
import { getSubpage } from "@/lib/subpages";

export const Route = createFileRoute("/services_/$slug")({
  head: ({ params }) => {
    const page = getSubpage("services", params.slug);
    const title = page?.metaTitle ?? "Services — Auxtech";
    const description = page?.metaDesc ?? "Design and engineering services from Auxtech.";
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
  const page = getSubpage("services", slug);
  if (!page) return <SubpageNotFound kind="services" />;
  return <SubpageTemplate page={page} />;
}
