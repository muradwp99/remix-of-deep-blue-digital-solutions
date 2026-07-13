import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { StatsRow } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { LogoMarquee } from "@/components/signature/logo-wall";
import { getIndustry } from "@/lib/industries";
import { caseStudies } from "@/lib/case-studies";
import { pageThemes } from "@/lib/themes";

const ind = getIndustry("b2b-enterprise")!;

export const Route = createFileRoute("/industries_/b2b-enterprise")({
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

/* Pipeline diagram: nodes connect as the strokes draw in */
function Pipeline() {
  const nodes = [
    { x: 30, y: 60, t: "CRM" },
    { x: 150, y: 24, t: "Your platform" },
    { x: 150, y: 96, t: "ERP" },
    { x: 270, y: 60, t: "Warehouse" },
  ];
  return (
    <div className="glass-strong relative rounded-3xl p-6">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Systems, connected
      </p>
      <svg viewBox="0 0 300 120" className="w-full" aria-hidden>
        <path
          d="M52 60 C 90 60, 100 30, 128 27"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="1.6"
          data-draw
        />
        <path
          d="M52 60 C 90 60, 100 90, 128 93"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="1.6"
          data-draw
        />
        <path
          d="M172 27 C 210 30, 220 55, 248 58"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="1.6"
          data-draw
        />
        <path
          d="M172 93 C 210 90, 220 65, 248 62"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="1.6"
          data-draw
        />
        {nodes.map((n) => (
          <g key={n.t}>
            <rect
              x={n.x - 26}
              y={n.y - 13}
              width="52"
              height="26"
              rx="8"
              fill="oklch(1 0 0 / 0.06)"
              stroke="oklch(1 0 0 / 0.14)"
            />
            <text
              x={n.x}
              y={n.y + 3.5}
              textAnchor="middle"
              fontSize="8.5"
              fill="oklch(0.9 0.01 250)"
            >
              {n.t}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Page() {
  const studies = caseStudies.filter((c) => ind.matches.includes(c.industry));
  return (
    <SiteShell theme={pageThemes["industries/b2b-enterprise"]}>
      {/* ── DEEP · pipeline hero on royal midnight ── */}
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
              Built for buyers with checklists
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
          <div data-reveal>
            <Pipeline />
          </div>
        </div>
      </section>

      {/* ── BOLD · integration marquee — speaks to what you already run ── */}
      <div className="block-bold">
        <section className="py-12 md:py-14">
          <p
            className="container-page mb-6 text-xs uppercase tracking-[0.28em] text-foreground/70"
            data-reveal
          >
            Speaks to what you already run
          </p>
          <LogoMarquee
            items={[
              "Salesforce",
              "SAP",
              "NetSuite",
              "Okta",
              "Azure AD",
              "Snowflake",
              "Workday",
              "ServiceNow",
            ]}
          />
        </section>
      </div>

      {/* ── LIGHT · the domain — a procurement checklist ── */}
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
            {ind.points.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  data-reveal-child
                  className="flex items-start gap-5 border-t border-black/10 py-7 last:border-b"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/12">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                      <Check className="h-4 w-4 text-gold" />
                    </div>
                    <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── TINT · case studies ── */}
      {studies.length > 0 && (
        <div className="block-tint">
          <section className="container-page py-24 md:py-28" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Proof in this sector
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                Shipped B2B & enterprise work.
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

      {/* ── LIGHT · proof metrics ── */}
      <div className="block-light">
        <StatsRow stats={[...ind.stats, { value: "2014", label: "Enterprise delivery since" }]} />
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
