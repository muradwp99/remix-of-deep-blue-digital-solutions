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
import { runBrandGrader, type BrandResult } from "@/lib/tools-api";
import { cmsBlockData } from "@/lib/block-data";
import type { CmsBlockData } from "@/components/cms-blocks";
import {
  FixList,
  ResultPanel,
  ScoreRing,
  ToolError,
  ToolSkeleton,
} from "@/components/tool-shell";

const SLUG = "brand-grader";

export const Route = createFileRoute("/tools_/brand-grader")({
  loader: async (): Promise<{ tool: Tool; doc: CmsTool | null; blockData: CmsBlockData }> => {
    const fallback = getTool(SLUG)!;
    const doc = await cmsFindOne<CmsTool>("tools", SLUG, { depth: 1 });
    const blockData = await cmsBlockData(doc?.pageBlocks ?? []);
    return { tool: doc ? cmsToTool(doc, fallback) : fallback, doc, blockData };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    return {
      meta: [
        { title: tool?.metaTitle ?? "Brand Grader — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Brand Grader — Auxtech" },
        { property: "og:description", content: tool?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function Page() {
  const { tool, doc, blockData } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveTool = liveDoc ? cmsToTool(liveDoc, tool) : tool;

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrandResult | null>(null);

  const run = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runBrandGrader({ data: { name, tagline, industry, audience } });
      if ("error" in res) setError(res.error);
      else setResult(res);
    } catch {
      setError("The grader hit a snag on our side. Try again in a moment.");
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

            <div className="mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]" data-reveal>
              <form onSubmit={run} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/60">Brand name</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Auxtech" className={`mt-2 ${inputCls}`} />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/60">Tagline</span>
                  <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Software worth being proud of." className={`mt-2 ${inputCls}`} />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-white/60">Industry</span>
                    <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="SaaS" className={`mt-2 ${inputCls}`} />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-white/60">Audience</span>
                    <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Founders" className={`mt-2 ${inputCls}`} />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={running || !name.trim()}
                  className="w-full rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-gold-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {running ? "Grading…" : "Grade the brand"}
                </button>
                <p className="text-xs leading-relaxed text-white/40">
                  Graded by AI on clarity, distinctiveness, consistency and memorability. Honest scores; 90+ is rare.
                </p>
              </form>

              <div aria-live="polite">
                {error && <ToolError message={error} />}
                {running && (
                  <ResultPanel>
                    <ToolSkeleton />
                  </ResultPanel>
                )}
                {result && (
                  <ResultPanel footnote={result.ai ? "Graded by AI with a strategist rubric." : "Graded with our strategist rubric."}>
                    <div className="flex flex-wrap items-center gap-6">
                      <ScoreRing value={result.overall} label="Overall" size={128} />
                      <p className="max-w-sm flex-1 text-base leading-relaxed text-white/80">{result.verdict}</p>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
                      <ScoreRing value={result.scores.clarity} label="Clarity" size={92} />
                      <ScoreRing value={result.scores.distinctiveness} label="Distinct" size={92} />
                      <ScoreRing value={result.scores.consistency} label="Consistent" size={92} />
                      <ScoreRing value={result.scores.memorability} label="Memorable" size={92} />
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-semibold">Level it up</h3>
                    <div className="mt-5">
                      <FixList fixes={result.suggestions} />
                    </div>
                  </ResultPanel>
                )}
                {!running && !result && !error && (
                  <div className="grid h-full min-h-64 place-items-center rounded-3xl border border-dashed border-white/15 p-8 text-center">
                    <p className="max-w-xs text-sm leading-relaxed text-white/45">
                      Fill in the brand and hit grade. You'll get four scores, a straight verdict, and the moves that raise them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </>
    ),
    banner: (
      <>
        <BannerCTA
          message={["Grades are free,", "great brands are built."]}
          title={
            <>
              Want the scores in the
              <br />
              <span className="text-gold">90s</span>?
            </>
          }
          cta={{ label: "Book a Brand Session", to: "/contact" }}
        />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["tools/brand-grader"]}>
      <PageSections
        order={liveTool?.sectionOrder ?? []}
        blocks={blocks}
        cmsData={blockData}
        cmsBlocks={liveTool?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
