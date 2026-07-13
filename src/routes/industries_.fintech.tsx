import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { StatsRow } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { BadgeGrid } from "@/components/signature/logo-wall";
import { getIndustry } from "@/lib/industries";
import { caseStudies } from "@/lib/case-studies";
import { pageThemes } from "@/lib/themes";

const ind = getIndustry("fintech")!;

export const Route = createFileRoute("/industries_/fintech")({
  head: () => ({
    meta: [
      { title: ind.metaTitle },
      { name: "description", content: ind.metaDesc },
      { property: "og:title", content: ind.metaTitle },
      { property: "og:description", content: ind.metaDesc },
    ],
  }),
  component: Page,
});

const LEDGER = [
  ["09:41:02", "settle", "+$12,400.00", "cleared"],
  ["09:41:02", "ledger", "−$12,400.00", "balanced"],
  ["09:41:07", "payout", "+$3,180.50", "cleared"],
  ["09:41:07", "ledger", "−$3,180.50", "balanced"],
  ["09:41:12", "reconcile", "Δ $0.00", "0 drift"],
];

function Page() {
  const studies = caseStudies.filter((c) => ind.matches.includes(c.industry));
  return (
    <SiteShell theme={pageThemes["industries/fintech"]}>
      {/* ── DEEP · ledger hero: double-entry rows behind the headline ── */}
      <section className="block-deep">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {ind.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Software that moves money
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {ind.subtitle}
            </p>
            <div className="mt-9" data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
              >
                {ind.banner.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
          <div
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-panel"
            data-slide="right"
          >
            <div className="border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Live ledger · double-entry
            </div>
            <div className="divide-y divide-white/5 font-mono text-xs" data-reveal-group>
              {LEDGER.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[70px_1fr_auto_auto] gap-3 px-5 py-3"
                  data-reveal-child
                >
                  <span className="text-muted-foreground/60">{row[0]}</span>
                  <span className="text-foreground/80">{row[1]}</span>
                  <span className={row[2].startsWith("+") ? "text-gold" : "text-foreground/60"}>
                    {row[2]}
                  </span>
                  <span className="text-muted-foreground/60">{row[3]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHT · the domain, taken seriously — numbered ledger ── */}
      <div className="block-light">
        <section className="container-page py-24 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              What it takes here
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              The domain, taken seriously.
            </h2>
          </div>
          <div className="mt-14" data-reveal-group>
            {ind.points.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  data-reveal-child
                  className="grid grid-cols-[auto_auto_1fr] items-start gap-5 border-t border-black/10 py-7 last:border-b"
                >
                  <span className="pt-1.5 font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── BOLD · the auditor's shortlist (compliance badges) ── */}
      <div className="block-bold">
        <section className="container-page py-24 md:py-28" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              Regulated-room ready
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              The auditor's shortlist.
            </h2>
          </div>
          <BadgeGrid
            items={[
              { label: "KYC / AML", sub: "flows designed in" },
              { label: "PCI-aware", sub: "tokenized, never stored" },
              { label: "SOC2-ready", sub: "evidence by default" },
              { label: "Idempotent money", sub: "no double spends, ever" },
            ]}
          />
        </section>
      </div>

      {/* ── LIGHT · case studies ── */}
      {studies.length > 0 && (
        <div className="block-light">
          <section className="container-page py-24 md:py-28" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Proof in this sector
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                Shipped fintech work.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2" data-cards>
              {studies.map((c) => (
                <Link
                  key={c.slug}
                  to="/works/$slug"
                  params={{ slug: c.slug }}
                  className="group glare-card gradient-card lift relative overflow-hidden rounded-3xl"
                  data-card
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={c.hero}
                      alt={c.heroAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.28em] text-gold">
                      {c.tag} · {c.year}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── TINT · proof metrics ── */}
      <div className="block-tint">
        <StatsRow
          stats={[...ind.stats, { value: "2014", label: "Shipping in regulated rooms since" }]}
        />
      </div>

      {/* ── DARK · conversion banner into footer ── */}
      <BannerCTA
        message={ind.banner.message}
        title={
          <>
            {ind.banner.title} <span className="text-gold">{ind.banner.titleEm}</span>.
          </>
        }
        cta={{ label: ind.banner.label, to: "/contact" }}
      />
    </SiteShell>
  );
}
