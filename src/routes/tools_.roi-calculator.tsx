import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowDown } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { MetricDial } from "@/components/signature/meters";
import { RoiCalculator } from "@/components/tool-widgets";
import { getTool, type Tool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";

const SLUG = "roi-calculator";

export const Route = createFileRoute("/tools_/roi-calculator")({
  loader: async (): Promise<{ tool: Tool; doc: CmsTool | null }> => {
    const fallback = getTool(SLUG)!;
    const doc = await cmsFindOne<CmsTool>("tools", SLUG, { depth: 1 });
    return { tool: doc ? cmsToTool(doc, fallback) : fallback, doc };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    return {
      meta: [
        { title: tool?.metaTitle ?? "Website ROI Calculator — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Website ROI Calculator — Auxtech" },
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
    <SiteShell theme={pageThemes["tools/roi-calculator"]}>
      {/* BOLD · vivid green ledger hero with the return dial */}
      <section className="block-bold">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {liveTool.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              What's a better site actually worth?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {liveTool.subtitle}
            </p>
            <div className="mt-9" data-reveal>
              <a
                href="#calculator"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Run your numbers
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
          <div className="flex justify-center" data-reveal>
            <MetricDial
              value={0.78}
              display="7.8×"
              label="median first-year return across CRO engagements"
              size={250}
            />
          </div>
        </div>
      </section>

      {/* LIGHT · the calculator on a clean, legible surface */}
      <div id="calculator" className="block-light scroll-mt-24">
        <RoiCalculator />
      </div>

      <BannerCTA
        message={["Your numbers from you,", "the uplift from us."]}
        title={
          <>
            Like the math? Let's make it <span className="text-gold">real</span>.
          </>
        }
        cta={{ label: "Work With Us", to: "/contact" }}
      />
    </SiteShell>
  );
}
