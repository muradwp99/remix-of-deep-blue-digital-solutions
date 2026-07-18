/**
 * Shared UI for the free tools — deep-navy console aesthetic.
 * ScoreRing (animated SVG arc), StatTile, FixList, skeleton + error states.
 * One accent (gold) per the site system; all motion transform/opacity only.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Fix } from "@/lib/tools-api";

/* ---------------- Score ring ---------------- */

export function ScoreRing({
  value,
  label,
  size = 108,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / 1100, 1);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 80 ? "text-lime" : value >= 55 ? "text-gold" : "text-red-400";

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7" className="stroke-white/10" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            className={`${tone} stroke-current transition-[stroke-dashoffset] duration-200`}
            strokeDasharray={c}
            strokeDashoffset={c - (c * shown) / 100}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-2xl font-semibold tabular-nums">
          {shown}
        </span>
      </div>
      <span className="text-xs uppercase tracking-[0.18em] text-white/60">{label}</span>
    </div>
  );
}

/* ---------------- Stat tile ---------------- */

export function StatTile({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "good" | "warn" | "poor";
}) {
  const tone =
    status === "good" ? "border-lime/30 text-lime" : status === "warn" ? "border-gold/30 text-gold" : "border-red-400/30 text-red-400";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold tabular-nums`}>{value}</p>
      <span className={`mt-3 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${tone}`}>
        {status === "warn" ? "needs work" : status}
      </span>
    </div>
  );
}

/* ---------------- Fix list ---------------- */

const impactTone: Record<Fix["impact"], string> = {
  high: "bg-red-400/10 text-red-300 border-red-400/25",
  medium: "bg-gold/10 text-gold border-gold/25",
  low: "bg-white/5 text-white/70 border-white/15",
};

export function FixList({ fixes }: { fixes: Fix[] }) {
  return (
    <div className="space-y-3">
      {fixes.map((f) => (
        <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-display text-base font-semibold">{f.title}</h4>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${impactTone[f.impact] ?? impactTone.low}`}>
              {f.impact} impact
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{f.detail}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- URL form ---------------- */

export function UrlForm({
  onRun,
  running,
  cta,
  placeholder = "yoursite.com",
}: {
  onRun: (url: string) => void;
  running: boolean;
  cta: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState("");
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (!running && url.trim()) onRun(url.trim());
      }}
    >
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        inputMode="url"
        autoComplete="url"
        className="h-13 flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
      />
      <button
        type="submit"
        disabled={running || !url.trim()}
        className="rounded-xl bg-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-[#00022D] transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {running ? "Running…" : cta}
      </button>
    </form>
  );
}

/* ---------------- Skeleton + error ---------------- */

export function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="h-[108px] w-[108px] rounded-full border-[7px] border-white/10" />
            <div className="h-3 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}

export function ToolError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200">
      {message}
    </div>
  );
}

/* ---------------- Result frame ---------------- */

export function ResultPanel({ children, footnote }: { children: ReactNode; footnote?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#00022D]/40 p-6 backdrop-blur-sm md:p-9">
      {children}
      {footnote ? <p className="mt-6 text-xs text-white/40">{footnote}</p> : null}
    </div>
  );
}
