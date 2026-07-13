import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, BenefitList, FAQAccordion } from "@/components/sections";
import { MetricDial, PricingMeter } from "@/components/signature/meters";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { StatTicker } from "@/components/signature/ticker";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("services", "monthly-care")!;

export const Route = createFileRoute("/services_/monthly-care")({
  head: () => ({
    meta: [
      { title: page.metaTitle },
      { name: "description", content: page.metaDesc },
      { property: "og:title", content: page.metaTitle },
      { property: "og:description", content: page.metaDesc },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell theme={pageThemes["services/monthly-care"]}>
      {/* ── BOLD · amber poster hero, uptime as the promise ── */}
      <section className="block-bold">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Launch day is the start
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Get a Care Quote" />
          </div>
          <div className="flex justify-center" data-reveal>
            <MetricDial
              value={0.9995}
              display="99.95%"
              label="uptime across every product on a Care plan"
              size={260}
            />
          </div>
        </div>
      </section>

      {/* ── DEEP · reliability ticker ── */}
      <section className="block-deep">
        <StatTicker
          className="border-y-0 bg-transparent"
          items={[
            "84% of clients keep a Care plan",
            "P1 response under one hour",
            "Patches monthly, monitoring always",
            "Iteration hours that roll over",
            "Cheaper than one fire drill",
          ]}
        />
      </section>

      {/* ── LIGHT · back + what's included ── */}
      <div className="block-light">
        <BackToParent kind="services" />
        <FeatureGrid
          variant="spotlight"
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />
      </div>

      {/* ── TINT · a month on Care, pinned open ── */}
      <div className="block-tint">
        <StickyPinSteps
          eyebrow="How it runs"
          title="A month on Care, pinned open."
          steps={page.steps}
          panels={[
            <div key="audit" className="glass-strong rounded-2xl p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Handover audit
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Performance baseline captured",
                  "Error budget agreed",
                  "Secrets rotated & vaulted",
                  "Runbook drafted",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /> {t}
                  </li>
                ))}
              </ul>
            </div>,
            <div key="sla" className="glass-strong rounded-2xl p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                The SLA, in writing
              </p>
              <div className="mt-4 space-y-3">
                {[
                  ["P1 — production down", "< 1 hour"],
                  ["P2 — degraded", "< 4 hours"],
                  ["P3 — routine", "next business day"],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    className="flex items-center justify-between rounded-xl bg-black/[0.04] px-4 py-3 text-sm"
                  >
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-semibold text-lime">{v}</span>
                  </div>
                ))}
              </div>
            </div>,
            <div key="cadence" className="glass-strong rounded-2xl p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                This month shipped
              </p>
              <p
                className="mt-4 font-display text-5xl font-semibold text-gradient-lime"
                data-counter
              >
                14
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                improvements: 6 patches, 5 content updates, 2 experiments, 1 new landing page — all
                inside the plan.
              </p>
            </div>,
            <div key="review" className="glass-strong rounded-2xl p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Quarterly review
              </p>
              <p className="mt-4 font-display text-2xl font-semibold leading-snug">
                Health report, dependency forecast, and next quarter's priorities — decided with
                you.
              </p>
            </div>,
          ]}
        />
      </div>

      {/* ── LIGHT · plan tiers ── */}
      <div className="block-light">
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Three tiers
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal-child
            >
              Care, sized to what's at stake.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <PricingMeter
              label="Essential"
              display="8 hrs/mo"
              value={30}
              note="Monitoring, patches, and a small iteration budget — for stable marketing sites."
            />
            <PricingMeter
              label="Growth"
              display="20 hrs/mo"
              value={62}
              note="Everything in Essential plus experiments and feature iteration — our most common plan."
            />
            <PricingMeter
              label="Critical"
              display="24/7"
              value={100}
              note="On-call SLAs, staging rehearsals, and quarterly architecture reviews — for revenue-bearing systems."
            />
          </div>
        </section>
      </div>

      {/* ── DARK bookend ── */}
      <BenefitList
        eyebrow="Why Northline"
        title="What you get that others skip."
        items={page.benefits}
      />
      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="services" slug={page.slug} />
    </SiteShell>
  );
}
