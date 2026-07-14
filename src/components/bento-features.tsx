import { useId, type ReactNode } from "react";
import { Check, ChevronDown, Ellipsis, Search, Settings, X } from "lucide-react";
import { SectionHead } from "@/components/sections";

/**
 * BentoShowcase — 2×2 grid of illustrated feature cards.
 * Each card pairs a mini-UI vignette (gauge, checklist, inbox, command
 * palette) with a title + description, over warm (gold) or cool (blue)
 * ambient glows. Content is fully data-driven so every page can tell its
 * own story with the same visual system.
 */

type Tone = "warm" | "cool";

export type BentoVisual =
  | { kind: "gauge"; stat: string; statLabel: string; value?: number }
  | { kind: "checklist"; rows: string[] }
  | {
      kind: "inbox";
      tabs: { label: string; count?: number; active?: boolean }[];
      rows: string[];
    }
  | {
      kind: "command";
      placeholder?: string;
      actions: { label: string; kbd?: string }[];
    };

export type BentoCardData = {
  title: string;
  desc: string;
  tone?: Tone;
  visual: BentoVisual;
};

/* ---------- shared bits ---------- */

function ToneGlow({ tone }: { tone: Tone }) {
  return tone === "warm" ? (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute -top-24 right-4 h-72 w-72 rounded-full opacity-35 blur-[85px]"
        style={{ background: "var(--glow-warm-1)" }}
      />
      <div
        className="absolute top-8 -right-12 h-44 w-44 rounded-full opacity-25 blur-[60px]"
        style={{ background: "var(--glow-warm-2)" }}
      />
    </div>
  ) : (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute -top-20 -left-12 h-72 w-72 rounded-full opacity-30 blur-[85px]"
        style={{ background: "var(--glow-cool-1)" }}
      />
      <div
        className="absolute bottom-4 right-1/4 h-40 w-40 rounded-full opacity-15 blur-[70px]"
        style={{ background: "var(--glow-cool-2)" }}
      />
    </div>
  );
}

/* ---------- gauge ---------- */

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const [sx, sy] = polar(cx, cy, r, start);
  const [ex, ey] = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

function GaugeVisual({
  stat,
  statLabel,
  value = 0.42,
}: {
  stat: string;
  statLabel: string;
  value?: number;
}) {
  const id = useId();
  const START = -120;
  const SWEEP = 240;
  const angle = START + SWEEP * Math.min(Math.max(value, 0), 1);
  const [nx, ny] = polar(130, 130, 74, angle);

  return (
    <div className="relative h-full">
      {/* dial, bleeding off the right edge like a cockpit instrument */}
      <svg viewBox="0 0 260 260" className="absolute -right-14 -top-4 h-[135%] w-auto" aria-hidden>
        <defs>
          <linearGradient id={`${id}-arc`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--lime) 62%, black)" />
            <stop offset="100%" stopColor="var(--lime)" />
          </linearGradient>
        </defs>
        {/* tick ring */}
        <path
          d={arcPath(130, 130, 88, START, START + SWEEP)}
          fill="none"
          stroke="oklch(1 0 0 / 14%)"
          strokeWidth="2"
          strokeDasharray="1 9"
        />
        {/* track */}
        <path
          d={arcPath(130, 130, 104, START, START + SWEEP)}
          fill="none"
          stroke="oklch(1 0 0 / 8%)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* progress */}
        <path
          d={arcPath(130, 130, 104, START, angle)}
          fill="none"
          stroke={`url(#${id}-arc)`}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* needle */}
        <line
          x1="130"
          y1="130"
          x2={nx.toFixed(2)}
          y2={ny.toFixed(2)}
          stroke="oklch(0.9 0.01 250)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="130"
          cy="130"
          r="9"
          fill="oklch(0.35 0.03 265)"
          stroke="oklch(0.9 0.01 250)"
          strokeWidth="2.5"
        />
        <circle cx="130" cy="130" r="3" fill="oklch(0.9 0.01 250)" />
      </svg>

      {/* stat chip */}
      <div className="absolute left-6 top-6 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
        <div className="font-display text-3xl font-semibold" data-counter>
          {stat}
        </div>
        <div className="mt-1 max-w-[9rem] text-[11px] leading-snug text-muted-foreground">
          {statLabel}
        </div>
      </div>

      {/* dotted connector flourish */}
      <div
        aria-hidden
        className="absolute left-12 top-[6.6rem] h-9 border-l border-dashed border-white/15"
      />
      <div
        aria-hidden
        className="absolute left-[2.85rem] top-[9rem] h-1.5 w-1.5 rounded-full bg-white/40"
      />
    </div>
  );
}

/* ---------- checklist ---------- */

function ChecklistVisual({ rows }: { rows: string[] }) {
  return (
    <div className="relative flex h-full items-center">
      {/* glossy check tile */}
      <div className="relative ml-7 grid h-24 w-24 shrink-0 place-items-center rounded-[1.35rem] border border-white/20 bg-gradient-to-br from-white/[0.18] via-white/[0.06] to-white/[0.02] shadow-[inset_0_1px_0_oklch(1_0_0/30%),0_18px_50px_-12px_oklch(0.55_0.11_255/55%)]">
        <div className="absolute inset-1.5 rounded-[1rem] bg-gradient-to-br from-surface-2/80 to-background/60" />
        <Check
          className="relative h-11 w-11 text-white drop-shadow-[0_2px_10px_oklch(1_0_0/35%)]"
          strokeWidth={2.5}
        />
      </div>

      {/* stacked status rows, bleeding off the right edge */}
      <div className="absolute -right-8 top-1/2 flex w-64 -translate-y-1/2 flex-col gap-2.5">
        {rows.map((label, i) => {
          const emphasized = i === 1;
          return (
            <div
              key={label}
              className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs ${
                emphasized
                  ? "-translate-x-6 border-white/15 bg-surface-2/95 font-medium shadow-panel"
                  : "border-white/8 bg-surface/50 text-muted-foreground opacity-60"
              }`}
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-[5px] bg-lime">
                <Check className="h-3 w-3 text-background" strokeWidth={3} />
              </span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- inbox ---------- */

function InboxVisual({
  tabs,
  rows,
}: {
  tabs: { label: string; count?: number; active?: boolean }[];
  rows: string[];
}) {
  return (
    <div className="relative h-full">
      <div className="absolute -left-5 right-8 top-7 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-panel backdrop-blur-sm">
        <div className="flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            Inbox <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
          <span className="flex items-center gap-2.5 text-muted-foreground">
            <Ellipsis className="h-3.5 w-3.5" />
            <Settings className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="mt-3 flex gap-5 border-b border-white/8 px-1 text-xs">
          {tabs.map((t) => (
            <span
              key={t.label}
              className={`inline-flex items-center gap-1.5 pb-2 ${
                t.active
                  ? "-mb-px border-b border-lime font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] leading-none ${
                    t.active ? "bg-lime text-background" : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-3 space-y-2.5 px-1">
          {rows.map((text, i) => (
            <div
              key={text}
              className={`flex items-center gap-3 text-xs ${i === 0 ? "" : i === 1 ? "opacity-70" : "opacity-35"}`}
            >
              <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-accent/80 to-surface-2 ring-1 ring-white/15" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* fade the panel into the card bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/85 to-transparent"
      />
    </div>
  );
}

/* ---------- command palette ---------- */

const KEY_ROWS = [
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function CommandVisual({
  placeholder = "Search command...",
  actions,
}: {
  placeholder?: string;
  actions: { label: string; kbd?: string }[];
}) {
  return (
    <div className="relative h-full">
      {/* faint keyboard behind the palette */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-1 flex flex-col items-center gap-1.5 opacity-70"
      >
        {KEY_ROWS.map((row) => (
          <div key={row.join("")} className="flex gap-1.5">
            {row.map((k) => (
              <span
                key={k}
                className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-medium text-white/30"
              >
                {k}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* palette */}
      <div className="absolute left-1/2 top-6 w-[86%] max-w-sm -translate-x-1/2 overflow-hidden rounded-xl border border-white/12 bg-popover/95 shadow-panel backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/8 px-3.5 py-2.5 text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-xs">{placeholder}</span>
          <X className="h-3.5 w-3.5" />
        </div>
        <div className="px-3.5 pb-1 pt-2.5 text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Actions
        </div>
        <div className="px-1.5 pb-2">
          {actions.map((a, i) => (
            <div
              key={a.label}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs ${
                i === 0 ? "bg-white/8 font-medium" : "text-muted-foreground"
              }`}
            >
              {a.label}
              {a.kbd && (
                <span className="rounded border border-white/15 bg-white/5 px-1.5 py-px text-[10px] text-muted-foreground">
                  {a.kbd}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- card + section ---------- */

function BentoVisualSwitch({ visual }: { visual: BentoVisual }) {
  switch (visual.kind) {
    case "gauge":
      return <GaugeVisual stat={visual.stat} statLabel={visual.statLabel} value={visual.value} />;
    case "checklist":
      return <ChecklistVisual rows={visual.rows} />;
    case "inbox":
      return <InboxVisual tabs={visual.tabs} rows={visual.rows} />;
    case "command":
      return <CommandVisual placeholder={visual.placeholder} actions={visual.actions} />;
  }
}

export function BentoCard({ card }: { card: BentoCardData }) {
  const tone = card.tone ?? "cool";
  return (
    <div
      className="group glare-card lift relative overflow-hidden rounded-3xl border border-border/60 gradient-card"
      data-card
    >
      <ToneGlow tone={tone} />
      <div className="relative h-60 overflow-hidden sm:h-64">
        <BentoVisualSwitch visual={card.visual} />
      </div>
      <div className="relative px-7 pb-7 pt-1">
        <h3 className="font-display text-xl font-semibold">{card.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
      </div>
    </div>
  );
}

export function BentoShowcase({
  eyebrow,
  title,
  subtitle,
  cards,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  cards: BentoCardData[];
}) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="grid gap-5 md:grid-cols-2" data-cards data-cards-stagger="0.12">
        {cards.map((card) => (
          <BentoCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
