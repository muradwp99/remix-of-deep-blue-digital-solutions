import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { CmsBlocks, type CmsBlockData, type CmsBlockRow } from "@/components/cms-blocks";
import { cmsFindOne } from "@/lib/cms";
import { cmsBlockData } from "@/lib/block-data";

/**
 * Free-form CMS page. Any WordPress page composes itself from `page_blocks`
 * and renders here at /pages/<slug>, which never collides with the site's
 * bespoke top-level routes (home, /about, …) — those stay hand-built.
 *
 * This used to render a second, separate block vocabulary (`layout_json`,
 * fifteen Payload-era types) that nothing ever wrote to, so the route rendered
 * an empty page. It now uses the same blocks as every other page, so there is
 * one vocabulary to learn and one place to add a block type.
 *
 * The collection-backed blocks are fetched here rather than inside the block,
 * so they are server-rendered — `cmsBlockData` reads the page's own block list
 * and fetches only the collections it actually names.
 */
type CmsPage = {
  title: string;
  slug?: string | null;
  pageBlocks?: CmsBlockRow[] | null;
  meta?: { title?: string | null; description?: string | null } | null;
};

export const Route = createFileRoute("/pages_/$slug")({
  loader: async ({
    params,
  }): Promise<{ page: CmsPage | null; data: CmsBlockData }> => {
    const page = await cmsFindOne<CmsPage>("pages", params.slug);
    if (!page) return { page: null, data: {} };
    return { page, data: await cmsBlockData(page.pageBlocks ?? []) };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const title = page ? `${page.meta?.title || page.title} — Auxtech` : "Auxtech";
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
  const { page, data } = Route.useLoaderData();

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

  const blocks = page.pageBlocks ?? [];

  return (
    <SiteShell>
      {blocks.length ? (
        <CmsBlocks blocks={blocks} data={data} />
      ) : (
        <section className="container-page py-36">
          <h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-6xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            This page has no sections yet. Add them under Composed sections in the editor.
          </p>
        </section>
      )}
    </SiteShell>
  );
}
