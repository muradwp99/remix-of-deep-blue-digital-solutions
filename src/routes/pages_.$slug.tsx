import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BlockRenderer } from "@/components/block-renderer";
import { cmsFindOne } from "@/lib/cms";

/**
 * Generic CMS page route. Renders any published Payload `pages` doc from its
 * `layout` blocks via <BlockRenderer>. Lives under /pages/<slug> so it never
 * collides with the site's bespoke top-level routes (home, /about, …), which
 * stay hand-built. Fetches at depth 2 so block relationships (projects, team,
 * plans, testimonials, faqs) come back populated.
 */
type CmsPage = {
  title: string;
  slug?: string | null;
  layout?: Record<string, unknown>[] | null;
  meta?: { title?: string | null; description?: string | null } | null;
};

export const Route = createFileRoute("/pages_/$slug")({
  loader: async ({ params }): Promise<{ page: CmsPage | null }> => {
    const page = await cmsFindOne<CmsPage>("pages", params.slug, { depth: 2 });
    return { page };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const title = page ? `${page.meta?.title || page.title} — Northline Studio` : "Northline Studio";
    const description = page?.meta?.description ?? "";
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
  const { page } = Route.useLoaderData();

  if (!page) {
    return (
      <SiteShell>
        <section className="block-light">
          <div className="container-page py-36">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
              That page doesn't exist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              The link may be outdated or the page hasn't been published yet.
            </p>
            <Link
              to="/"
              data-magnetic
              className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back home
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <BlockRenderer blocks={page.layout ?? []} />
    </SiteShell>
  );
}
