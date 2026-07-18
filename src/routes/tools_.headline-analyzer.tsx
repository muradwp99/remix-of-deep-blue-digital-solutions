import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { runHeadlineAnalyze, type HeadlineResult } from "@/lib/tools-api";
import { ResultPanel, ScoreRing, ToolError, ToolSkeleton } from "@/components/tool-shell";

export const Route = createFileRoute("/tools_/headline-analyzer")({
  head: () => ({
    meta: [
      { title: "Headline Analyzer — Auxtech" },
      { name: "description", content: "Paste your homepage headline, get four scores, a straight verdict, and five stronger rewrites." },
      { property: "og:title", content: "Headline Analyzer — Auxtech" },
      { property: "og:description", content: "Four scores, a straight verdict, five stronger rewrites." },
    ],
  }),
  component: Page,
});

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function Page() {
  const [headline, setHeadline] = useState("");
  const [audience, setAudience] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HeadlineResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const run = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runHeadlineAnalyze({ data: { headline, audience } });
      if ("error" in res) setError(res.error);
      else setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <SiteShell>
      <section className="block-deep">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Free tool
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl" data-reveal>
              Is your headline doing its <span className="text-gold">job</span>?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              The headline decides the bounce. Paste yours and get four scores, a straight verdict, and five rewrites you can ship today.
            </p>
          </div>

          <div className="mt-12 max-w-4xl" data-reveal>
            <form onSubmit={run} className="space-y-4">
              <textarea
                required
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Paste your homepage headline"
                className={`resize-none text-lg ${inputCls}`}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Audience (optional): e.g. ecommerce founders"
                  className={`flex-1 ${inputCls}`}
                />
                <button
                  type="submit"
                  disabled={running || !headline.trim()}
                  className="rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-[#10142b] transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {running ? "Scoring…" : "Score it"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 max-w-4xl" aria-live="polite">
            {error && <ToolError message={error} />}
            {running && (
              <ResultPanel>
                <ToolSkeleton />
              </ResultPanel>
            )}
            {result && (
              <ResultPanel footnote={result.ai ? "Scored by AI with a conversion-copy rubric." : "Scored with our copy heuristics."}>
                <div className="flex flex-wrap items-center gap-8">
                  <ScoreRing value={result.overall} label="Overall" size={128} />
                  <p className="max-w-md flex-1 text-base leading-relaxed text-white/80">{result.verdict}</p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
                  <ScoreRing value={result.scores.clarity} label="Clarity" size={92} />
                  <ScoreRing value={result.scores.specificity} label="Specific" size={92} />
                  <ScoreRing value={result.scores.outcome} label="Outcome" size={92} />
                  <ScoreRing value={result.scores.energy} label="Energy" size={92} />
                </div>

                <h3 className="mt-10 font-display text-2xl font-semibold">Five stronger takes</h3>
                <div className="mt-5 space-y-2.5">
                  {result.rewrites.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => copy(r)}
                      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-gold/40"
                    >
                      <span className="font-display text-lg font-semibold">{r}</span>
                      <span className={`shrink-0 text-xs font-medium ${copied === r ? "text-lime" : "text-white/40 group-hover:text-gold"}`}>
                        {copied === r ? "Copied" : "Copy"}
                      </span>
                    </button>
                  ))}
                </div>
              </ResultPanel>
            )}
          </div>
        </div>
      </section>

      <BannerCTA
        message={["A headline is a promise,", "a site is the proof."]}
        title={
          <>
            Want copy and design that
            <br />
            <span className="text-gold">convert together</span>?
          </>
        }
        cta={{ label: "Start a Project", to: "/contact" }}
      />
    </SiteShell>
  );
}
