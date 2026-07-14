import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";

/**
 * Interactive widgets for the free-tool pages (/tools/*). Extracted from the
 * route so both the unique static pages and the $slug fallback can use them.
 */

export function AuditRequest({ checks, ctaLabel }: { checks: string[]; ctaLabel: string }) {
  const [url, setUrl] = useState("");
  const half = Math.ceil(checks.length / 2);
  return (
    <section className="container-page py-20 border-t border-border/60" data-reveal-group>
      <div className="grid gap-14 lg:grid-cols-2 items-start">
        <div data-reveal-child>
          <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
            What we check
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[checks.slice(0, half), checks.slice(half)].map((col, ci) => (
              <ul key={ci} className="space-y-3">
                {col.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[5px] bg-lime/15 border border-lime/30">
                      <Check className="h-3 w-3 text-lime" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-3xl p-8 md:p-10" data-reveal-child>
          <h3 className="font-display text-2xl font-semibold">Request yours</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Free, human-written, delivered within two business days. No drip campaign follows it.
          </p>
          <label
            className="mt-6 block text-xs uppercase tracking-[0.2em] text-muted-foreground"
            htmlFor="tool-url"
          >
            Your website URL
          </label>
          <input
            id="tool-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-lime/50"
          />
          <Link
            to="/contact"
            data-magnetic
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Mention your URL{url ? ` (${url})` : ""} in the message and we'll take it from there.
          </p>
        </div>
      </div>
    </section>
  );
}

export function RoiCalculator() {
  const [visitors, setVisitors] = useState(20000);
  const [convRate, setConvRate] = useState(1.8);
  const [value, setValue] = useState(120);
  const [uplift, setUplift] = useState(25);

  const { current, improved, delta } = useMemo(() => {
    const cur = visitors * (convRate / 100) * value * 12;
    const imp = visitors * ((convRate * (1 + uplift / 100)) / 100) * value * 12;
    return { current: cur, improved: imp, delta: imp - cur };
  }, [visitors, convRate, value, uplift]);

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const fields = [
    {
      label: "Monthly visitors",
      value: visitors,
      set: setVisitors,
      min: 100,
      max: 1000000,
      step: 100,
    },
    {
      label: "Conversion rate (%)",
      value: convRate,
      set: setConvRate,
      min: 0.1,
      max: 20,
      step: 0.1,
    },
    {
      label: "Value per conversion ($)",
      value: value,
      set: setValue,
      min: 1,
      max: 100000,
      step: 1,
    },
    { label: "Expected uplift (%)", value: uplift, set: setUplift, min: 1, max: 100, step: 1 },
  ];

  return (
    <section className="container-page py-20 border-t border-border/60" data-reveal-group>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] items-start">
        <div className="space-y-6" data-reveal-child>
          <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
            Your numbers
          </h2>
          {fields.map((f) => (
            <div key={f.label}>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {f.label}
              </label>
              <input
                type="number"
                value={f.value}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => f.set(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-lime/50"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground/70">
            Typical CRO programs compound 15–40% conversion improvement over two quarters — 25% is a
            defensible planning number, not a best case.
          </p>
        </div>
        <div className="glass-strong rounded-3xl p-8 md:p-12" data-reveal-child>
          <h3 className="font-display text-2xl font-semibold">Annual revenue impact</h3>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Current annual revenue
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-muted-foreground">
                {money(current)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                With {uplift}% conversion uplift
              </p>
              <p className="mt-1 font-display text-3xl font-semibold">{money(improved)}</p>
            </div>
            <div className="rounded-2xl gradient-card-gold border border-gold/25 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Added revenue per year</p>
              <p className="mt-1 font-display text-4xl md:text-5xl font-semibold text-gradient-lime">
                {money(delta)}
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            data-magnetic
            className="group mt-8 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
          >
            Make It Real
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const GRADER_QUESTIONS = [
  "Could a stranger describe what you do after 10 seconds on your homepage?",
  "Do your website, product, and sales deck use the same colors and type?",
  "Is your positioning written down — one page, current, agreed?",
  "Would your team give the same one-line pitch if asked separately?",
  "Does your logo survive small sizes (favicon, app icon) without mushing?",
  "Is there one place where brand assets and rules officially live?",
  "Has your visual identity been reviewed in the last three years?",
  "Do new hires and vendors reproduce the brand correctly on the first try?",
];

export function BrandGrader() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    GRADER_QUESTIONS.map(() => null),
  );
  const answered = answers.filter((a) => a !== null).length;
  const yes = answers.filter(Boolean).length;
  const done = answered === GRADER_QUESTIONS.length;
  const score = Math.round((yes / GRADER_QUESTIONS.length) * 100);

  const verdict =
    score >= 85
      ? "Coherent. Your brand is an asset — guard it with governance, not luck."
      : score >= 60
        ? "Solid bones, visible drift. A guidelines-and-tokens pass would pay for itself."
        : score >= 35
          ? "The brand is leaking. Every touchpoint is renegotiating who you are."
          : "There is no brand yet — there are logos. The good news: greenfield moves fast.";

  return (
    <section className="container-page py-20 border-t border-border/60" data-reveal-group>
      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] items-start">
        <div data-reveal-child>
          <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
            Eight honest questions
          </h2>
          <div className="mt-8 space-y-3">
            {GRADER_QUESTIONS.map((q, i) => (
              <div
                key={q}
                className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5"
              >
                <p className="max-w-md text-sm">{q}</p>
                <div className="flex gap-2">
                  {([true, false] as const).map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setAnswers((prev) => prev.map((a, j) => (j === i ? val : a)))}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        answers[i] === val
                          ? val
                            ? "bg-lime text-background"
                            : "bg-destructive/80 text-destructive-foreground"
                          : "glass hover:bg-white/5"
                      }`}
                    >
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-28 glass-strong rounded-3xl p-8 md:p-10" data-reveal-child>
          <h3 className="font-display text-2xl font-semibold">Your grade</h3>
          {done ? (
            <>
              <p className="mt-6 font-display text-7xl font-semibold text-gradient-lime">{score}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                out of 100
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{verdict}</p>
              <Link
                to="/contact"
                data-magnetic
                className="group mt-7 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Fix the Gaps
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-6 font-display text-5xl font-semibold text-muted-foreground/50">
                {answered}/{GRADER_QUESTIONS.length}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Answer all eight to see your score — no email required.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
