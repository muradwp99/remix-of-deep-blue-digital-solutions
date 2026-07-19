import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AuxtechMark } from "@/components/auxtech-logo";

/**
 * BannerCTA — wide ad-style conversion banner: near-black panel swept by
 * vertical gold light beams, logo mark top-left, a whispered promise
 * top-right, bold ask bottom-left, pill CTA bottom-right.
 */

// Per-beam peak intensity, left to right — dark on the text side,
// flaring past center like stage lighting.
const BEAMS = [0, 0.04, 0.1, 0.24, 0.5, 0.9, 1, 0.68, 0.42, 0.62, 0.3, 0.5, 0.16, 0.08];

export function BannerCTA({
  message,
  title,
  cta = { label: "Get in Touch", to: "/contact" },
}: {
  message: [string, string];
  title: ReactNode;
  cta?: { label: string; to: string };
}) {
  return (
    <section className="container-page py-14" data-reveal>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-[oklch(0.08_0.015_265)]">
        {/* light beams */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex">
          {BEAMS.map((a, i) => (
            <div
              key={i}
              className="h-full flex-1"
              style={{
                // Theme-aware beams: brighten toward white at the top, darken
                // toward black at the base, alpha scaled per beam.
                background: `linear-gradient(180deg,
                  color-mix(in oklab, color-mix(in oklab, var(--lime) ${100 - a * 42}%, white) ${a * 100}%, transparent) 0%,
                  color-mix(in oklab, var(--lime) ${a * 55}%, transparent) 55%,
                  color-mix(in oklab, color-mix(in oklab, var(--lime) 55%, black) ${a * 22}%, transparent) 100%)`,
              }}
            />
          ))}
        </div>
        {/* keep the copy side dark, ground the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.015_265)] from-15% via-[oklch(0.08_0.015_265/55%)] via-45% to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.015_265/80%)] to-35% to-transparent"
        />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />

        <div className="relative flex min-h-[280px] flex-col justify-between gap-10 p-8 md:min-h-[320px] md:p-12">
          <div className="flex items-start justify-between gap-6">
            <span className="flex items-center gap-2">
              <AuxtechMark className="h-8 w-8 text-gold" />
              <span className="font-display text-base font-semibold tracking-tight">Auxtech</span>
            </span>
            <p className="hidden text-right text-sm leading-snug text-foreground/80 sm:block">
              {message[0]}
              <br />
              {message[1]}
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-xl font-display text-3xl font-semibold leading-[1.08] md:text-5xl">
              {title}
            </h2>
            <Link
              to={cta.to}
              data-magnetic
              className="group inline-flex shrink-0 items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
