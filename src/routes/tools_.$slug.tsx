import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { AuditRequest, RoiCalculator, BrandGrader } from "@/components/tool-widgets";
import { getTool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";
import type { Tool } from "@/lib/tools";

export const Route = createFileRoute("/tools_/$slug")({
  loader: async ({ params }): Promise<{ tool: Tool | null }> => {
    const doc = await cmsFindOne<CmsTool>("tools", params.slug, { depth: 1 });
    return { tool: doc ? cmsToTool(doc, getTool(params.slug)) : null };
  },
  head: ({ loaderData, params }) => {
    const tool = loaderData?.tool ?? getTool(params.slug);
    const title = tool?.metaTitle ?? "Free Tools — Auxtech";
    const description = tool?.metaDesc ?? "Free tools from Auxtech.";
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
  const { tool: cmsTool } = Route.useLoaderData();

  // `cmsToTool` already folded the coded entry in as its fallback, so a tool
  // that exists only in the CMS renders too — see `services_.$slug.tsx`.
  const tool = cmsTool ?? getTool(slug);

  if (!tool) {
    return (
      <SiteShell>
        <section className="container-page py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-lime">404</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] font-semibold">
            That tool doesn't exist.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            All the free tools live on the resources page.
          </p>
          <Link
            to="/resources"
            data-magnetic
            className="group mt-10 inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to resources
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell theme={pageThemes[`tools/${tool.slug}`]}>
      <PageHeader
        eyebrow={tool.eyebrow}
        image={tool.image}
        title={
          <>
            {tool.title} <em className="font-playfair font-medium text-gold">{tool.titleEm}</em>
            {tool.titleAfter ?? null}
          </>
        }
        subtitle={tool.subtitle}
      />

      {tool.slug === "roi-calculator" && <RoiCalculator />}
      {tool.slug === "brand-grader" && <BrandGrader />}
      {(tool.slug === "website-audit" || tool.slug === "speed-test") && (
        <AuditRequest
          checks={tool.checks}
          ctaLabel={tool.slug === "website-audit" ? "Request the Audit" : "Request the Review"}
        />
      )}

      <BannerCTA
        message={["A free tool from us,", "no strings attached."]}
        title={
          <>
            Useful? The paid version is called{" "}
            <em className="font-playfair font-medium text-gold">us</em>.
          </>
        }
        cta={{ label: "Work With Us", to: "/contact" }}
      />
    </SiteShell>
  );
}
