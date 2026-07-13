import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { CTABand } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { caseStudies } from "@/lib/case-studies";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Works — Northline Studio" },
      { name: "description", content: "Six case studies with the numbers attached: +48% revenue, 3.1× signups, Lighthouse 98." },
      { property: "og:title", content: "Works — Northline Studio" },
      { property: "og:description", content: "Six case studies with the numbers attached: +48% revenue, 3.1× signups, Lighthouse 98." },
    ],
  }),
  component: WorksPage,
});

const industries = [
  "All industries",
  "Ecommerce",
  "Fintech",
  "Healthcare",
  "DevTools",
  "Retail",
  "Logistics",
];

const aggregate = [
  { value: "+48%", label: "largest single-quarter revenue lift" },
  { value: "3.1×", label: "median signup growth on SaaS work" },
  { value: "98", label: "best Lighthouse performance score" },
  { value: "4.9★", label: "highest App Store rating shipped" },
];

function WorksPage() {
  return (
    <SiteShell theme={pageThemes["works"]}>
      {/* ---- Hero (light editorial) ---- */}
      <section className="block-light">
        <div className="container-page py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            Works
          </p>
          <h1
            className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            Six projects. Every number <span className="text-gold">audited</span>.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            We publish fewer, better case studies — each with the metric the client actually
            pays for.
          </p>
        </div>
      </section>

      {/* ---- Range + gallery grid ---- */}
      <section className="block-light">
        <div className="container-page border-t border-border pt-16 pb-24">
          {/* Industry chips — the range, not a filter */}
          <div className="flex flex-wrap items-center gap-2.5" data-scatter>
            {industries.map((ind, i) => (
              <span
                key={ind}
                data-scatter-item
                className={
                  i === 0
                    ? "rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold"
                    : "glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                }
              >
                {ind}
              </span>
            ))}
          </div>

          {/* Case gallery — images carry the color on white */}
          <div className="mt-12 grid gap-8 md:grid-cols-2" data-cards data-cards-stagger="0.12">
            {caseStudies.map((c) => (
              <Link
                key={c.slug}
                to="/works/$slug"
                params={{ slug: c.slug }}
                data-card
                className="group glare-card gradient-card lift overflow-hidden rounded-3xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.hero}
                    alt={c.heroAlt}
                    loading="lazy"
                    data-parallax-img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-gold">
                      {c.industry} · {c.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{c.year}</span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-semibold md:text-4xl">{c.name}</h3>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/10 pt-5">
                    <span className="text-sm text-muted-foreground">{c.summary}</span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BannerCTA
        message={["A short brief from you,", "the heavy lifting from us."]}
        title={
          <>
            You've seen the work.
            <br />
            Now imagine <span className="text-gold">yours</span>.
          </>
        }
        cta={{ label: "Start a Project", to: "/contact" }}
      />

      {/* ---- Results band (tint) ---- */}
      <section className="block-tint">
        <div className="container-page py-24" data-reveal-group>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              The scoreboard
            </p>
            <h2
              className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
              data-reveal-child
            >
              Twenty-four months, <span className="text-gold">measured</span>.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
              Highlights across the six studies above — the numbers clients report to their boards,
              not vanity metrics.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4" data-cards>
            {aggregate.map((s) => (
              <div key={s.label} className="glare-card gradient-card lift rounded-2xl p-8" data-card>
                <div
                  className="font-display text-4xl font-semibold text-gradient-lime md:text-5xl"
                  data-counter
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Your turn"
        title="What should your case study say?"
        subtitle="Tell us the number you need to move. We reply within one business day with a plan, a timeline, and a fair budget."
      />
    </SiteShell>
  );
}
