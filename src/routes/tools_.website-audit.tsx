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
import { runWebsiteAudit, type AuditResult } from "@/lib/tools-api";
import {
  FixList,
  ResultPanel,
  ScoreRing,
  ToolError,
  ToolSkeleton,
  UrlForm,
} from "@/components/tool-shell";

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
        { title: tool?.metaTitle ?? "Free Website Audit — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Free Website Audit — Auxtech" },
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

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const run = async (url: string) => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runWebsiteAudit({ data: { url } });
      if ("error" in res) setError(res.error);
      else setResult(res);
    } catch {
      setError("The audit hit a snag on our side. Try again in a moment.");
    } finally {
      setRunning(false);
    }
  };

  const blocks: Record<string, ReactNode> = {
    hero: (
      <>
        {/* Deep-navy console: hero + the live tool in one surface */}
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
              <UrlForm onRun={run} running={running} cta="Run the audit" />
              <p className="mt-3 text-xs text-white/40">
                We fetch your homepage, check 9 real signals, and score it with AI analysis. Nothing is stored.
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
                      ? "Scored from live measurements with AI analysis."
                      : "Scored from live measurements."
                  }
                >
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    <ScoreRing value={result.scores.performance} label="Performance" />
                    <ScoreRing value={result.scores.seo} label="SEO" />
                    <ScoreRing value={result.scores.accessibility} label="Accessibility" />
                    <ScoreRing value={result.scores.conversion} label="Conversion" />
                  </div>
                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/80">{result.summary}</p>

                  <div className="mt-8 grid gap-2 sm:grid-cols-3">
                    {result.signals.map((sig) => (
                      <div
                        key={sig.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <span className="text-xs uppercase tracking-[0.12em] text-white/55">{sig.label}</span>
                        <span className={`text-sm font-medium ${sig.ok ? "text-lime" : "text-destructive"}`}>
                          {sig.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-10 font-display text-2xl font-semibold">Where to start</h3>
                  <div className="mt-5">
                    <FixList fixes={result.fixes} />
                  </div>
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
          message={["Want these fixes shipped,", "not just listed?"]}
          title={
            <>
              A senior applies this to
              <br />
              your <span className="text-gold">whole site</span>.
            </>
          }
          cta={{ label: "Book the Free Audit Call", to: "/contact" }}
        />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["tools/website-audit"]}>
      <PageSections order={liveTool?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
