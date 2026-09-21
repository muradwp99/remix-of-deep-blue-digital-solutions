import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getTool, type Tool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToTool, type CmsTool } from "@/lib/cms-catalog";
import { useLiveEdits } from "@/lib/edit-bridge";
import { runRoiNarrative } from "@/lib/tools-api";
import { ResultPanel } from "@/components/tool-shell";

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
        { title: tool?.metaTitle ?? "ROI Calculator — Auxtech" },
        { name: "description", content: tool?.metaDesc ?? "" },
        { property: "og:title", content: tool?.metaTitle ?? "ROI Calculator — Auxtech" },
        { property: "og:description", content: tool?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.16em] text-white/60">{label}</span>
        <span className="font-display text-xl font-semibold tabular-nums text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[color:var(--gold)]"
      />
    </label>
  );
}

function Page() {
  const { tool, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveTool = liveDoc ? cmsToTool(liveDoc, tool) : tool;

  const [visitors, setVisitors] = useState(20000);
  const [convRate, setConvRate] = useState(1.6);
  const [aov, setAov] = useState(120);
  const [uplift, setUplift] = useState(35);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);

  const model = useMemo(() => {
    const currentMonthly = visitors * (convRate / 100) * aov;
    const upliftedMonthly = visitors * ((convRate * (1 + uplift / 100)) / 100) * aov;
    const monthlyGain = upliftedMonthly - currentMonthly;
    return {
      currentMonthly,
      upliftedMonthly,
      monthlyGain,
      yearlyGain: monthlyGain * 12,
      paybackMonths: monthlyGain > 0 ? Math.max(0.4, 15000 / monthlyGain) : Infinity,
    };
  }, [visitors, convRate, aov, uplift]);

  const money = (v: number) =>
    `$${Math.round(v).toLocaleString("en-US")}`;

  const analyse = async () => {
    setThinking(true);
    try {
      const res = await runRoiNarrative({
        data: {
          visitors,
          convRate,
          aov,
          uplift,
          monthlyGain: model.monthlyGain,
          yearlyGain: model.yearlyGain,
        },
      });
      setNarrative(res.narrative);
    } catch {
      setNarrative(
        `At this profile you'd add roughly ${money(model.monthlyGain)} per month. Against a typical fixed-scope build, that pays back in about ${model.paybackMonths.toFixed(1)} months.`,
      );
    } finally {
      setThinking(false);
    }
  };

  const barMax = Math.max(model.upliftedMonthly, 1);

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

            <div className="mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr]" data-reveal>
              {/* Inputs */}
              <div className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <Slider label="Monthly visitors" value={visitors} min={1000} max={500000} step={1000} format={(v) => v.toLocaleString("en-US")} onChange={setVisitors} />
                <Slider label="Conversion rate" value={convRate} min={0.2} max={8} step={0.1} format={(v) => `${v.toFixed(1)}%`} onChange={setConvRate} />
                <Slider label="Average order value" value={aov} min={10} max={2000} step={10} format={(v) => `$${v}`} onChange={setAov} />
                <Slider label="Modeled conversion uplift" value={uplift} min={5} max={100} step={5} format={(v) => `+${v}%`} onChange={setUplift} />
                <p className="text-xs leading-relaxed text-white/40">
                  A well-executed redesign typically lifts conversion 20 to 40%. Drag the uplift to stress-test the model.
                </p>
              </div>

              {/* Live model */}
              <ResultPanel>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55">Revenue today</p>
                    <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{money(model.currentMonthly)}<span className="text-base text-white/45">/mo</span></p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55">After uplift</p>
                    <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-gold">{money(model.upliftedMonthly)}<span className="text-base text-white/45">/mo</span></p>
                  </div>
                </div>

                {/* Comparison bars */}
                <div className="mt-8 space-y-4">
                  {[
                    { label: "Today", value: model.currentMonthly, cls: "bg-white/25" },
                    { label: "Modeled", value: model.upliftedMonthly, cls: "bg-gold" },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs text-white/55">
                        <span>{b.label}</span>
                        <span className="tabular-nums">{money(b.value)}</span>
                      </div>
                      <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${b.cls} transition-[width] duration-500 ease-out`}
                          style={{ width: `${(b.value / barMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 rounded-2xl border border-gold/25 bg-gold/[0.06] p-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/55">Added / month</p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-gold">{money(model.monthlyGain)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/55">Added / year</p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-gold">{money(model.yearlyGain)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/55">Payback on $15k build</p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
                      {model.paybackMonths === Infinity ? "n/a" : `${model.paybackMonths.toFixed(1)} mo`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={analyse}
                  disabled={thinking}
                  className="mt-8 rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-gold-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-40"
                >
                  {thinking ? "Analysing…" : "Get the verdict"}
                </button>
                {narrative && (
                  <p className="mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/80">
                    {narrative}
                  </p>
                )}
              </ResultPanel>
            </div>
          </div>
        </section>

      </>
    ),
    banner: (
      <>
        <BannerCTA
          message={["The number in writing,", "before we start."]}
          title={
            <>
              Ready to make the model
              <br />
              <span className="text-gold">real</span>?
            </>
          }
          cta={{ label: "Start a Project", to: "/contact" }}
        />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["tools/roi-calculator"]}>
      <PageSections order={liveTool?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
