import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { BrowserFrame } from "@/components/signature/device-frames";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("services", "analytics-cro")!;

export const Route = createFileRoute("/services_/analytics-cro")({
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

/* Dashboard mock whose line chart draws itself in (data-draw) */
function ChartMock() {
  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conversion rate</p>
        <span className="font-display text-2xl font-semibold text-gradient-lime" data-counter>
          +38%
        </span>
      </div>
      <svg viewBox="0 0 400 140" className="w-full" aria-hidden>
        {[35, 70, 105].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="oklch(1 0 0 / 6%)" strokeWidth="1" />
        ))}
        <path
          d="M0 118 C40 112, 70 116, 100 104 S160 96, 200 78 S300 62, 340 42 S380 30, 400 24"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="3"
          strokeLinecap="round"
          data-draw="scrub"
        />
        <path
          d="M0 122 C50 120, 90 122, 130 118 S220 112, 270 108 S360 104, 400 100"
          fill="none"
          stroke="oklch(1 0 0 / 20%)"
          strokeWidth="2"
          strokeDasharray="4 5"
          data-draw="scrub"
        />
      </svg>
      <div className="mt-4 flex gap-5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-lime" /> With experiment program
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-white/25" /> Do-nothing baseline
        </span>
      </div>
    </div>
  );
}

function Page() {
  return (
    <SiteShell theme={pageThemes["services/analytics-cro"]}>
      {/* ── DEEP · chartreuse-dark dashboard hero ── */}
      <section className="block-deep relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
        <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Measure honestly, then move the number
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Find the Leaks" />
          </div>
          <div data-reveal>
            <BrowserFrame url="analytics.yoursite.com">
              <ChartMock />
            </BrowserFrame>
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

      {/* ── BOLD · the CRO math, one big number ── */}
      <section className="block-bold">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <p
              className="font-display text-[clamp(4.5rem,14vw,10rem)] font-semibold leading-none tracking-tight"
              data-counter
            >
              40%
            </p>
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/70">The CRO math</p>
              <p className="mt-4 text-lg text-muted-foreground">
                The top of the 15–40% conversion lift a disciplined two-quarter program tends to
                find — revenue pulled from traffic you already pay for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TINT · the experiment log ── */}
      <div className="block-tint">
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              The experiment log
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal-child
            >
              Winners ship. Losers teach. Both count.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { id: "EXP-041", h: "Two-step checkout", r: "+18% completion", win: true },
              { id: "EXP-042", h: "Social proof above fold", r: "+6% signups", win: true },
              { id: "EXP-043", h: "Video hero", r: "−4% — reverted, documented", win: false },
            ].map((e) => (
              <div
                key={e.id}
                className={`glare-card lift rounded-2xl p-7 ${e.win ? "gradient-card-gold" : "gradient-card opacity-80"}`}
                data-reveal-child
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${e.win ? "bg-lime text-background" : "bg-black/10 text-muted-foreground"}`}
                  >
                    {e.win ? "Shipped" : "Null"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{e.h}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.r}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── LIGHT · how it runs ── */}
      <div className="block-light">
        <ProcessSteps
          eyebrow="How it runs"
          title="Taxonomy to compounding wins."
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
