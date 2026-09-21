import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { pageThemes } from "@/lib/themes";
import { runProjectEstimate, type EstimateResult } from "@/lib/tools-api";
import { ResultPanel, ToolSkeleton } from "@/components/tool-shell";

import { getTool, type Tool } from "@/lib/tools";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";
import { useLiveEdits } from "@/lib/edit-bridge";
import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";

const SLUG = "project-estimator";

export const Route = createFileRoute("/tools_/project-estimator")({
  loader: async (): Promise<{ tool: Tool; doc: CmsTool | null }> => {
    const fallback = getTool(SLUG)!;
    const doc = await cmsFindOne<CmsTool>("tools", SLUG, { depth: 1 });
    return { tool: doc ? cmsToTool(doc, fallback) : fallback, doc };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    return {
      meta: [
        { title: tool?.metaTitle ?? "Project Estimator — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "Project Estimator — Auxtech" },
        { property: "og:description", content: tool?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const TYPES = [
  { id: "marketing-site", label: "Marketing site" },
  { id: "web-app", label: "Web app" },
  { id: "mobile-app", label: "Mobile app" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "saas-mvp", label: "SaaS MVP" },
];

const FEATURES = [
  { id: "auth", label: "Accounts & auth" },
  { id: "payments", label: "Payments" },
  { id: "cms", label: "CMS editing" },
  { id: "ai", label: "AI features" },
  { id: "integrations", label: "Integrations" },
  { id: "dashboard", label: "Dashboards" },
];

const chip = (on: boolean) =>
  `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    on
      ? "border-gold bg-gold/15 text-gold"
      : "border-input bg-input/15 text-white/70 hover:border-white/30"
  }`;

function Page() {
  const { tool, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveTool = liveDoc ? cmsToTool(liveDoc, tool) : tool;
  const [type, setType] = useState("marketing-site");
  const [size, setSize] = useState(10);
  const [features, setFeatures] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<"standard" | "fast">("standard");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const toggle = (id: string) =>
    setFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      setResult(await runProjectEstimate({ data: { type, size, features, urgency } }));
    } finally {
      setRunning(false);
    }
  };

  const money = (v: number) => `$${v.toLocaleString("en-US")}`;

  const blocks: Record<string, ReactNode> = {
    hero: (
      <>
        <section className="block-deep">
          <div className="container-page py-20 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                {liveTool.eyebrow}
              </p>
              <h1
                className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl"
                data-reveal
              >
                {liveTool.title} <span className="text-gold">{liveTool.titleEm}</span>
                {liveTool.titleAfter ?? ""}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                {liveTool.subtitle}
              </p>
            </div>

            <div className="mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.15fr]" data-reveal>
              <div className="space-y-7 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                    What are you building?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={chip(type === t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                      Pages / screens
                    </p>
                    <span className="font-display text-xl font-semibold tabular-nums">{size}</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={60}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[color:var(--gold)]"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Needs</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FEATURES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggle(f.id)}
                        className={chip(features.includes(f.id))}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Timeline</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgency("standard")}
                      className={chip(urgency === "standard")}
                    >
                      Standard pace
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency("fast")}
                      className={chip(urgency === "fast")}
                    >
                      As fast as possible
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={run}
                  disabled={running}
                  className="w-full rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-gold-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-40"
                >
                  {running ? "Estimating…" : "Estimate my project"}
                </button>
              </div>

              <div aria-live="polite">
                {running && (
                  <ResultPanel>
                    <ToolSkeleton />
                  </ResultPanel>
                )}
                {result && (
                  <ResultPanel
                    footnote={
                      result.ai
                        ? "Phase math from 200+ shipped projects, brief written by AI."
                        : "Phase math from 200+ shipped projects."
                    }
                  >
                    <div className="flex flex-wrap items-end justify-between gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                          Budget range
                        </p>
                        <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-gold md:text-5xl">
                          {money(result.low)} <span className="text-white/40">to</span>{" "}
                          {money(result.high)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/55">Timeline</p>
                        <p className="mt-2 font-display text-4xl font-semibold tabular-nums md:text-5xl">
                          {result.weeks}
                          <span className="text-lg text-white/45"> weeks</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      {result.phases.map((p) => (
                        <div
                          key={p.name}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="font-display text-base font-semibold">{p.name}</h4>
                            <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                              {p.weeks} {p.weeks === 1 ? "week" : "weeks"}
                            </span>
                          </div>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gold/70"
                              style={{ width: `${(p.weeks / result.weeks) * 100}%` }}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-white/65">{p.detail}</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-7 rounded-2xl border border-gold/25 bg-gold/[0.06] p-5 text-sm leading-relaxed text-white/85">
                      {result.brief}
                    </p>
                  </ResultPanel>
                )}
                {!running && !result && (
                  <div className="grid h-full min-h-64 place-items-center rounded-3xl border border-dashed border-white/15 p-8 text-center">
                    <p className="max-w-xs text-sm leading-relaxed text-white/45">
                      Pick your shape on the left. You get a budget range, a week count, and the four
                      phases mapped out.
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
          message={["The estimate is math,", "the quote is a promise."]}
          title={
            <>
              Make it a fixed number in
              <br />
              one <span className="text-gold">call</span>.
            </>
          }
          cta={{ label: "Book the Scoping Call", to: "/contact" }}
        />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["tools/project-estimator"]}>
      <PageSections
        order={liveTool?.sectionOrder ?? []}
        blocks={blocks}
        cmsBlocks={liveTool?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
