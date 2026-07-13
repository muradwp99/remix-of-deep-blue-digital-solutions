import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { MetricDial } from "@/components/signature/meters";
import { ComparisonTable } from "@/components/signature/compare-table";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("solutions", "growth-cro")!;

export const Route = createFileRoute("/solutions_/growth-cro")({
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
    <SiteShell theme={pageThemes["solutions/growth-cro"]}>
      {/* ── BOLD · green poster hero: the growth curve draws itself underneath ── */}
      <section className="block-bold relative overflow-hidden">
        <svg
          aria-hidden
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-64 w-full opacity-40"
        >
          <path
            d="M0 360 C150 350, 250 340, 350 320 S550 270, 680 220 S900 130, 1000 90 S1150 40, 1200 28"
            fill="none"
            stroke="var(--lime)"
            strokeWidth="3"
            data-draw="scrub"
          />
        </svg>
        <div className="container-page relative py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            {page.eyebrow}
          </p>
          <h1
            className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-split
          >
            Test, learn, compound
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {page.subtitle}
          </p>
          <HeroCtas primary="Start Experimenting" />
        </div>
      </section>

      {/* ── LIGHT · velocity dials — the program at speed ── */}
      <div className="block-light">
        <BackToParent kind="solutions" />
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              The program at speed
            </p>
            <h2
              className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
              data-reveal-child
            >
              A drumbeat, not a workshop.
            </h2>
          </div>
          <div className="flex flex-wrap justify-between gap-10" data-reveal-child>
            <MetricDial
              value={0.85}
              display="52"
              label="experiments run per year on a standing program"
            />
            <MetricDial
              value={0.31}
              display="31%"
              label="win rate — the honest industry-beating number"
            />
            <MetricDial
              value={0.72}
              display="+27%"
              label="median conversion lift after two quarters"
            />
          </div>
        </section>
      </div>

      {/* ── TINT · signature win table ── */}
      <div className="block-tint">
        <section className="container-page py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Before / after, from real programs
            </p>
            <h2
              className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
              data-reveal
            >
              What compounding looks like.
            </h2>
          </div>
          <ComparisonTable
            colA="Quarter 0"
            colB="Quarter 2, on program"
            rows={[
              { label: "Signup conversion", a: "2.4%", b: "4.1% (+71%)", win: "b" },
              { label: "Onboarding completion", a: "31%", b: "58% (+87%)", win: "b" },
              { label: "Pricing-page → trial", a: "6.2%", b: "9.8% (+58%)", win: "b" },
              {
                label: "Experiment cadence",
                a: "When someone remembers",
                b: "Weekly, with a ranked backlog",
                win: "b",
              },
              { label: "Decisions", a: "Loudest voice wins", b: "The data does", win: "b" },
            ]}
          />
        </section>
      </div>

      {/* ── LIGHT · what's included ── */}
      <div className="block-light">
        <FeatureGrid
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />
      </div>

      {/* ── DEEP · the cadence, dramatised ── */}
      <div className="block-deep">
        <ProcessSteps
          variant="rail"
          eyebrow="How it runs"
          title="Audit, fix, test, scale."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
        />
      </div>

      {/* ── LIGHT · why us + answers ── */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why Northline"
          title="What you get that others skip."
          items={page.benefits}
        />
        <FAQAccordion faqs={page.faqs} />
      </div>

      {/* ── DARK bookend ── */}
      <SubpageBanner page={page} />
      <RelatedPages kind="solutions" slug={page.slug} />
    </SiteShell>
  );
}
