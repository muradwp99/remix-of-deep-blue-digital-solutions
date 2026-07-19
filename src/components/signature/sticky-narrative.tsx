import type { ReactNode } from "react";

/**
 * StickyPinSteps — left panel stays pinned while the steps on the right
 * scroll past; the visible panel cross-fades to match the active step
 * (data-pin-steps hook in lib/animations.ts).
 */
export function StickyPinSteps({
  eyebrow,
  title,
  steps,
  panels,
  stepGap = 38, // vh — existing gap preserved as the default for every current call site
}: {
  eyebrow: string;
  title: ReactNode;
  steps: { t: string; d: string }[];
  panels: ReactNode[];
  stepGap?: number;
}) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-pin-steps>
      <div className="mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
          {eyebrow}
        </p>
        <h2
          className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
          data-reveal
        >
          {title}
        </h2>
      </div>
      <div className="grid gap-12 lg:grid-cols-2">
        {/* pinned visual — panels stacked, cross-faded by the hook */}
        <div className="relative hidden lg:block">
          <div className="sticky top-28 min-h-[420px]">
            {panels.map((panel, i) => (
              <div key={i} className="absolute inset-0" data-pin-panel>
                {panel}
              </div>
            ))}
          </div>
        </div>
        {/* scrolling steps */}
        <div
          className="space-y-10 lg:space-y-0 lg:py-[12vh]"
          style={{ ["--step-gap" as string]: `${stepGap}vh` }}
        >
          {steps.map((s, i) => (
            <div
              key={s.t}
              data-pin-step
              className={i === 0 ? "" : "lg:mt-[var(--step-gap)]"}
            >
              <span className="font-display text-3xl font-semibold text-gradient-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold">{s.t}</h3>
              <p className="mt-2 max-w-md text-muted-foreground">{s.d}</p>
              {/* mobile: show the panel inline under its step */}
              <div className="mt-6 lg:hidden">{panels[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
