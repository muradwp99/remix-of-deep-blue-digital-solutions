import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { ComparisonTable } from "@/components/signature/compare-table";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("services", "maintenance-support")!;

export const Route = createFileRoute("/services_/maintenance-support")({
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

const SYSTEMS = [
  { name: "API gateway", ms: "42ms" },
  { name: "Web app", ms: "118ms" },
  { name: "Database", ms: "6ms" },
  { name: "Job queue", ms: "0 backlog" },
  { name: "Payments", ms: "99.99%" },
  { name: "CDN", ms: "12ms" },
];

function Page() {
  return (
    <SiteShell theme={pageThemes["services/maintenance-support"]}>
      {/* ── DEEP · teal status-board hero, all systems green ── */}
      <section className="block-deep relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
        <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Production software needs a pulse
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Get Covered" />
          </div>
          <div className="glass-strong rounded-3xl p-6" data-slide="right">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Live status
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/12 px-3 py-1 text-[11px] font-semibold text-lime">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                All systems operational
              </span>
            </div>
            <div className="space-y-2" data-reveal-group>
              {SYSTEMS.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-xl bg-white/4 px-4 py-3 text-sm"
                  data-reveal-child
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
                    {s.name}
                  </span>
                  <span className="text-muted-foreground">{s.ms}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHT · back + what's included ── */}
      <div className="block-light">
        <BackToParent kind="services" />
        <FeatureGrid
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />
      </div>

      {/* ── TINT · SLAs, not vibes ── */}
      <div className="block-tint">
        <section className="container-page py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              SLAs, not vibes
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              "Best effort" vs. a signed number.
            </h2>
          </div>
          <ComparisonTable
            colA="Typical maintenance vendor"
            colB="Northline Maintenance & Support"
            rows={[
              {
                label: "P1 response",
                a: "“ASAP” — usually next day",
                b: "Under 1 hour, credited if missed",
                win: "b",
              },
              {
                label: "Monitoring",
                a: "They find out when you call",
                b: "24/7 synthetic + error alerting",
                win: "b",
              },
              {
                label: "Patching",
                a: "When something breaks",
                b: "Monthly cadence, staged first",
                win: "b",
              },
              {
                label: "Unknown codebases",
                a: "“We don't touch other people's code”",
                b: "Two-week adoption audit, then covered",
                win: "b",
              },
              {
                label: "Knowledge",
                a: "Lives in one contractor's head",
                b: "Runbooks you own, updated monthly",
                win: "b",
              },
            ]}
          />
        </section>
      </div>

      {/* ── BOLD · the pledge, in writing ── */}
      <section className="block-bold">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <p className="font-display text-[clamp(4rem,12vw,9rem)] font-semibold leading-none tracking-tight">
              &lt; 1 hr
            </p>
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/70">
                The pledge, in writing
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                P1 response when production is down — credited back if we miss it. Monitoring runs
                24/7, so usually we're paging ourselves before you notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHT · how it runs ── */}
      <div className="block-light">
        <ProcessSteps
          eyebrow="How it runs"
          title="Adopt, stabilize, maintain."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
        />
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
