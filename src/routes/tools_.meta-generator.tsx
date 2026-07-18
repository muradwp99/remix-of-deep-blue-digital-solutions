import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { runMetaGenerate, type MetaResult } from "@/lib/tools-api";
import { ResultPanel, ToolError, ToolSkeleton } from "@/components/tool-shell";

export const Route = createFileRoute("/tools_/meta-generator")({
  head: () => ({
    meta: [
      { title: "SEO Meta Generator — Auxtech" },
      { name: "description", content: "Generate a copy-paste title tag, meta description, Open Graph set, and JSON-LD for your homepage." },
      { property: "og:title", content: "SEO Meta Generator — Auxtech" },
      { property: "og:description", content: "Title tag, meta description, OG set, and JSON-LD, ready to paste." },
    ],
  }),
  component: Page,
});

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function CopyBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080a1c]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-xs uppercase tracking-[0.14em] text-white/55">{label}</span>
        <button
          type="button"
          onClick={copy}
          className={`text-xs font-semibold ${copied ? "text-lime" : "text-gold hover:brightness-110"}`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Page() {
  const [business, setBusiness] = useState("");
  const [offering, setOffering] = useState("");
  const [audience, setAudience] = useState("");
  const [location, setLocation] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MetaResult | null>(null);

  const run = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!business.trim() || !offering.trim()) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runMetaGenerate({ data: { business, offering, audience, location } });
      if ("error" in res) setError(res.error);
      else setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const htmlBlock = (r: MetaResult) =>
    [
      `<title>${r.title}</title>`,
      `<meta name="description" content="${r.description}" />`,
      ...r.og.map((o) => `<meta property="${o.property}" content="${o.content}" />`),
    ].join("\n");

  return (
    <SiteShell>
      <section className="block-deep">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Free tool
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl" data-reveal>
              Meta tags, done <span className="text-gold">properly</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              Title tag, meta description, Open Graph set, and JSON-LD schema. Character-counted, benefit-led, ready to paste.
            </p>
          </div>

          <div className="mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.25fr]" data-reveal>
            <form onSubmit={run} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">Business name</span>
                <input required value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Auxtech" className={`mt-2 ${inputCls}`} />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">What you offer</span>
                <input required value={offering} onChange={(e) => setOffering(e.target.value)} placeholder="Custom websites and apps for growing teams" className={`mt-2 ${inputCls}`} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/60">Audience (optional)</span>
                  <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Founders" className={`mt-2 ${inputCls}`} />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/60">City (optional)</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Austin" className={`mt-2 ${inputCls}`} />
                </label>
              </div>
              <button
                type="submit"
                disabled={running || !business.trim() || !offering.trim()}
                className="w-full rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-[#00022D] transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {running ? "Writing…" : "Generate my meta"}
              </button>
            </form>

            <div aria-live="polite">
              {error && <ToolError message={error} />}
              {running && (
                <ResultPanel>
                  <ToolSkeleton />
                </ResultPanel>
              )}
              {result && (
                <ResultPanel footnote={result.ai ? "Written by AI, length-checked for Google's limits." : "Template output, length-checked for Google's limits."}>
                  {/* SERP preview */}
                  <div className="rounded-2xl border border-white/10 bg-white p-5">
                    <p className="truncate text-[13px] text-[#202124]">{location ? `${business} · ${location}` : business}</p>
                    <p className="mt-0.5 truncate font-display text-xl text-[#1a0dab]">{result.title}</p>
                    <p className="mt-1 text-sm leading-snug text-[#4d5156]">{result.description}</p>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-white/45">
                    <span>Title: {result.title.length}/60</span>
                    <span>Description: {result.description.length}/155</span>
                  </div>

                  <div className="mt-7 space-y-4">
                    <CopyBlock label="HTML head tags" code={htmlBlock(result)} />
                    <CopyBlock label="JSON-LD schema" code={`<script type="application/ld+json">\n${result.jsonLd}\n</script>`} />
                  </div>
                </ResultPanel>
              )}
              {!running && !result && !error && (
                <div className="grid h-full min-h-64 place-items-center rounded-3xl border border-dashed border-white/15 p-8 text-center">
                  <p className="max-w-xs text-sm leading-relaxed text-white/45">
                    Two fields in, a Google-preview and copy-paste head tags out.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BannerCTA
        message={["Meta gets the click,", "the site earns the sale."]}
        title={
          <>
            Need the page behind the
            <br />
            <span className="text-gold">search result</span>?
          </>
        }
        cta={{ label: "Start a Project", to: "/contact" }}
      />
    </SiteShell>
  );
}
