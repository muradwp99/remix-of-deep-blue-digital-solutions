import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getTool, type Tool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";
import { useLiveEdits } from "@/lib/edit-bridge";
import { runSpeedTest, type SpeedResult } from "@/lib/tools-api";
import {
  ResultPanel,
  StatTile,
  ToolError,
  ToolSkeleton,
  UrlForm,
} from "@/components/tool-shell";

const SLUG = "speed-test";

export const Route = createFileRoute("/tools_/speed-test")({
  loader: async (): Promise<{ tool: Tool; doc: CmsTool | null }> => {
    const fallback = getTool(SLUG)!;
    const doc = await cmsFindOne<CmsTool>("tools", SLUG, { depth: 1 });
    return { tool: doc ? cmsToTool(doc, fallback) : fallback, doc };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    return {
      meta: [
        { title: tool?.metaTitle ?? "Free Speed Test — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Free Speed Test — Auxtech" },
        { property: "og:description", content: tool?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const gradeCopy: Record<SpeedResult["grade"], { label: string; tone: string; blurb: string }> = {
  fast: {
    label: "Fast",
    tone: "text-lime border-lime/40 bg-lime/10",
    blurb: "This site responds like it respects its visitors. Keep it that way.",
  },
  moderate: {
    label: "Moderate",
    tone: "text-gold border-gold/40 bg-gold/10",
    blurb: "Usable, but visitors on slow connections feel the wait. The fixes below close the gap.",
  },
  slow: {
    label: "Slow",
    tone: "text-destructive border-destructive/40 bg-destructive/10",
    blurb: "Speed is costing this site conversions every day. Start with the first fix below.",
  },
};

function Page() {
  const { tool, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveTool = liveDoc ? cmsToTool(liveDoc, tool) : tool;

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeedResult | null>(null);

  const run = async (url: string) => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runSpeedTest({ data: { url } });
      if ("error" in res) setError(res.error);
      else setResult(res);
    } catch {
      setError("The test hit a snag on our side. Try again in a moment.");
    } finally {
      setRunning(false);
    }
  };

  const blocks: Record<string, ReactNode> = {
    hero: (
      <>
        <section className="block-deep">
          <div className="container-page py-20 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                {liveTool.eyebrow}
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl" data-reveal>
                {liveTool.title} <span className="text-gold">{liveTool.titleEm}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                {liveTool.subtitle}
              </p>
            </div>

            <div className="mt-12 max-w-3xl" data-reveal>
              <UrlForm onRun={run} running={running} cta="Test speed" />
              <p className="mt-3 text-xs text-white/40">
                Two live server passes, real timings, Core Web Vitals estimates. Nothing is stored.
              </p>
            </div>

            <div className="mt-12 max-w-4xl" aria-live="polite">
              {error && <ToolError message={error} />}
              {running && (
                <ResultPanel>
                  <ToolSkeleton />
                </ResultPanel>
              )}
              {result && (
                <ResultPanel
                  footnote={
                    result.ai
                      ? "Measured from our servers with AI-prioritized advice. Lab estimate; field data varies by device."
                      : "Measured from our servers. Lab estimate; field data varies by device."
                  }
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`rounded-full border px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider ${gradeCopy[result.grade].tone}`}
                    >
                      {gradeCopy[result.grade].label}
                    </span>
                    <p className="text-base text-white/75">{gradeCopy[result.grade].blurb}</p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {result.vitals.map((v) => (
                      <StatTile key={v.label} label={v.label} value={v.value} status={v.status} />
                    ))}
                  </div>

                  <div className="mt-8 grid gap-2 text-sm text-white/60 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      Compression: <span className={result.compressed ? "text-lime" : "text-destructive"}>{result.compressed ? "enabled" : "missing"}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      Server: <span className="text-white/85">{result.server}</span>
                    </div>
                  </div>

                  <h3 className="mt-10 font-display text-2xl font-semibold">Three fastest wins</h3>
                  <ol className="mt-5 space-y-3">
                    {result.advice.map((a, i) => (
                      <li key={a} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <span className="font-display text-2xl font-semibold text-gold">{i + 1}</span>
                        <p className="text-sm leading-relaxed text-white/75">{a}</p>
                      </li>
                    ))}
                  </ol>
                </ResultPanel>
              )}
            </div>
          </div>
        </section>

      </>
    ),
    banner: (
      <>
        <BannerCTA
          message={["We ship 98 median Lighthouse,", "at delivery, not in decks."]}
          title={
            <>
              Want your site this
              <br />
              <span className="text-gold">fast</span>?
            </>
          }
          cta={{ label: "Start a Project", to: "/contact" }}
        />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["tools/speed-test"]}>
      <PageSections
        order={liveTool?.sectionOrder ?? []}
        blocks={blocks}
        cmsBlocks={liveTool?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
