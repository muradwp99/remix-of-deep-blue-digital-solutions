import { useId } from "react";

const polar = (cx: number, cy: number, rr: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)] as const;
};

const arcPath = (cx: number, cy: number, rr: number, start: number, end: number) => {
  const [sx, sy] = polar(cx, cy, rr, start);
  const [ex, ey] = polar(cx, cy, rr, end);
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${rr} ${rr} 0 ${end - start > 180 ? 1 : 0} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
};

/**
 * MetricDial — SVG gauge whose arc sweeps in on scroll (data-dial-arc hook)
 * with a counting value in the middle (data-counter hook).
 */
export function MetricDial({
  value,
  display,
  label,
  size = 220,
  className = "",
}: {
  /** 0..1 fill of the 240° sweep */
  value: number;
  /** Text shown in the middle, counts up (e.g. "99.98%") */
  display: string;
  label: string;
  size?: number;
  className?: string;
}) {
  const id = useId();
  const v = Math.min(1, Math.max(0, value));
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--lime) 62%, black)" />
              <stop offset="100%" stopColor="var(--lime)" />
            </linearGradient>
          </defs>
          <path
            d={arcPath(100, 100, 84, -120, 120)}
            fill="none"
            stroke="oklch(1 0 0 / 8%)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={arcPath(100, 100, 84, -120, -120 + 240 * v)}
            fill="none"
            stroke={`url(#${id}-g)`}
            strokeWidth="12"
            strokeLinecap="round"
            data-dial-arc="1"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-4xl font-semibold" data-counter>
            {display}
          </span>
        </div>
      </div>
      <p className="mt-2 max-w-[16rem] text-center text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** ScoreBars — labelled horizontal bars (Lighthouse-style). */
export function ScoreBars({
  items,
  className = "",
}: {
  items: { label: string; value: number; display?: string }[];
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`} data-reveal-group>
      {items.map((it) => (
        <div key={it.label} data-reveal-child>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">{it.label}</span>
            <span className="font-display text-base font-semibold" data-counter>
              {it.display ?? String(it.value)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, it.value)}%`,
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--lime) 55%, black), var(--lime))",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** PricingMeter — one budget/time bar with a marker, for plan comparisons. */
export function PricingMeter({
  label,
  note,
  value,
  display,
  className = "",
}: {
  label: string;
  note?: string;
  /** 0..100 */
  value: number;
  display: string;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`} data-reveal-child>
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold">{label}</h3>
        <span className="font-display text-xl font-semibold text-lime" data-counter>
          {display}
        </span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, value)}%`,
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--lime) 55%, black), var(--lime))",
          }}
        />
      </div>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
