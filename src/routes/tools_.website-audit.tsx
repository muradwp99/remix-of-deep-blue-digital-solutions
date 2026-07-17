import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowDown } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { TerminalWindow } from "@/components/signature/terminal";
import { AuditRequest } from "@/components/tool-widgets";
import { getTool, type Tool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";

const SLUG = "website-audit";

export const Route = createFileRoute("/tools_/website-audit")({
  loader: async (): Promise<{ tool: Tool; doc: CmsTool | null }> => {
    const fallback = getTool(SLUG)!;
    const doc = await cmsFindOne<CmsTool>("tools", SLUG, { depth: 1 });
    return { tool: doc ? cmsToTool(doc, fallback) : fallback, doc };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    return {
      meta: [
        { title: tool?.metaTitle ?? "Free Website Audit — Northline Studio" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Free Website Audit — Northline Studio" },
        { property: "og:description", content: tool?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { tool, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveTool = liveDoc ? cmsToTool(liveDoc, tool) : tool;
  return (
    <SiteShell theme={pageThemes["tools/website-audit"]}>
      {/* DEEP · deep-blue color hero — the audit runs live in the terminal */}
      <section className="block-deep">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {liveTool.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Twelve points, zero spin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {liveTool.subtitle}
            </p>
            <div className="mt-9" data-reveal>
              <a
                href="#request"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Request the audit
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
          <div data-slide="right">
            <TerminalWindow
              title="audit — northline"
              lines={[
                { prompt: "$", text: "northline audit https://yoursite.com" },
                { text: "crawling 214 pages…", dim: true },
                { text: "core web vitals: field data pulled", ok: true, dim: true },
                { text: "a11y: 3 contrast issues found", dim: true },
                { text: "seo: canonical drift on /blog/*", dim: true },
                { prompt: "→", text: "12-point report drafted by a human" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* LIGHT · the request widget on a clean, legible surface */}
      <div id="request" className="block-light scroll-mt-24">
        <AuditRequest checks={liveTool.checks} ctaLabel="Request the Audit" />
      </div>

      <BannerCTA
        message={["A free tool from us,", "no strings attached."]}
        title={
          <>
            Useful? The paid version is called <span className="text-gold">us</span>.
          </>
        }
        cta={{ label: "Work With Us", to: "/contact" }}
      />
    </SiteShell>
  );
}
