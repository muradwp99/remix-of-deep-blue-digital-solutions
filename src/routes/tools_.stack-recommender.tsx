import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { pageThemes } from "@/lib/themes";
import { runStackRecommend, type StackResult } from "@/lib/tools-api";
import { ResultPanel, ToolSkeleton } from "@/components/tool-shell";

export const Route = createFileRoute("/tools_/stack-recommender")({
  head: () => ({
    meta: [
      { title: "Tech Stack Recommender — Auxtech" },
      { name: "description", content: "Describe your product and get a pragmatic production stack with reasoning, alternatives, and hiring notes." },
      { property: "og:title", content: "Tech Stack Recommender — Auxtech" },
      { property: "og:description", content: "A principal-engineer stack recommendation in 30 seconds." },
    ],
  }),
  component: Page,
});

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const SCALES = ["Under 10k users", "10k to 100k users", "100k to 1M users", "1M+ users"];

function Page() {
  const [product, setProduct] = useState("");
  const [scale, setScale] = useState(SCALES[0]);
  const [team, setTeam] = useState("");
  const [priorities, setPriorities] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<StackResult | null>(null);

  const run = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product.trim()) return;
    setRunning(true);
    setResult(null);
    try {
      setResult(await runStackRecommend({ data: { product, scale, team, priorities } }));
    } finally {
      setRunning(false);
    }
  };

  return (
    <SiteShell theme={pageThemes["tools/stack-recommender"]}>
      <section className="block-deep">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Free tool
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl" data-reveal>
              The stack a principal would <span className="text-gold">pick</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              Describe the product. Get five layers of boring, proven tech with the reasoning, the strongest alternative, and how hard it is to hire for.
            </p>
          </div>

          <div className="mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]" data-reveal>
            <form onSubmit={run} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">What are you building?</span>
                <textarea
                  required
                  rows={3}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="A B2B invoicing SaaS with client portals and Stripe billing"
                  className={`mt-2 resize-none ${inputCls}`}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">Expected scale, year one</span>
                <select value={scale} onChange={(e) => setScale(e.target.value)} className={`mt-2 ${inputCls}`}>
                  {SCALES.map((s) => (
                    <option key={s} value={s} className="bg-background">
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">Team background (optional)</span>
                <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Two Python devs, one designer" className={`mt-2 ${inputCls}`} />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">Top priority (optional)</span>
                <input value={priorities} onChange={(e) => setPriorities(e.target.value)} placeholder="Speed to market" className={`mt-2 ${inputCls}`} />
              </label>
              <button
                type="submit"
                disabled={running || !product.trim()}
                className="w-full rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-gold-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {running ? "Thinking…" : "Recommend my stack"}
              </button>
            </form>

            <div aria-live="polite">
              {running && (
                <ResultPanel>
                  <ToolSkeleton />
                </ResultPanel>
              )}
              {result && (
                <ResultPanel footnote={result.ai ? "Recommended by AI with our engineering rubric." : "Our house-default stack; the AI take is briefly unavailable."}>
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    {result.stack.map((row, i) => (
                      <div
                        key={row.layer}
                        className={`grid gap-2 p-5 sm:grid-cols-[7rem_1fr] sm:gap-6 ${i > 0 ? "border-t border-white/10" : ""}`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{row.layer}</span>
                        <div>
                          <p className="font-display text-lg font-semibold">{row.pick}</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/65">{row.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/55">The alternative</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{result.alternatives}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Hiring reality</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{result.hiring}</p>
                    </div>
                  </div>
                </ResultPanel>
              )}
              {!running && !result && (
                <div className="grid h-full min-h-64 place-items-center rounded-3xl border border-dashed border-white/15 p-8 text-center">
                  <p className="max-w-xs text-sm leading-relaxed text-white/45">
                    One paragraph about your product gets you a five-layer stack with reasons, not buzzwords.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BannerCTA
        message={["Advice is free,", "execution is our job."]}
        title={
          <>
            Want this stack built by
            <br />
            people who <span className="text-gold">ship it daily</span>?
          </>
        }
        cta={{ label: "Start a Project", to: "/contact" }}
      />
    </SiteShell>
  );
}
