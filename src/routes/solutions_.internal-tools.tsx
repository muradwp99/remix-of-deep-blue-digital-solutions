import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { TerminalWindow } from "@/components/signature/terminal";
import { BeforeAfterSlider } from "@/components/signature/before-after";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("solutions", "internal-tools")!;

export const Route = createFileRoute("/solutions_/internal-tools")({
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
    <SiteShell theme={pageThemes["solutions/internal-tools"]}>
      {/* ── DEEP · console hero: dark ops terminal sits on deep mint color ── */}
      <section className="block-deep">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Retire the spreadsheet that runs the company
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Replace It" />
          </div>
          <div data-slide="right">
            <TerminalWindow
              title="ops-console"
              lines={[
                { prompt: "⌘K", text: "approve pending refunds" },
                { text: "12 refunds queued → approved in one action", ok: true, dim: true },
                { prompt: "⌘K", text: "assign new orders to carriers" },
                { text: "38 orders routed by rule, 2 flagged for review", ok: true, dim: true },
                { prompt: "⌘K", text: "export weekly ops report" },
                { text: "report sent — nobody re-keyed anything", ok: true },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── LIGHT · signature spreadsheet → app before/after ── */}
      <div className="block-light">
        <BackToParent kind="solutions" />

        <section className="container-page py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Drag to compare
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              The spreadsheet, retired.
            </h2>
          </div>
          <div data-reveal>
            <BeforeAfterSlider
              before="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=70"
              after="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70"
              beforeLabel="The spreadsheet"
              afterLabel="The ops tool"
              alt="Spreadsheet process replaced by an operations dashboard"
            />
          </div>
        </section>
      </div>

      {/* ── BOLD · bright mint stat band: the hours-back math ── */}
      <section className="block-bold">
        <div className="container-page py-24" data-reveal-group>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { v: "32", l: "staff-hours returned per week, median engagement" },
              { v: "−86%", l: "data-entry errors after single-source entry" },
              { v: "6wk", l: "typical first tool, shadowing to shipped" },
            ].map((s) => (
              <div
                key={s.l}
                className="glare-card gradient-card lift rounded-2xl p-8 text-center"
                data-reveal-child
              >
                <div className="font-display text-5xl font-semibold text-foreground" data-counter>
                  {s.v}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TINT · soft mint band for what's included + how it runs ── */}
      <div className="block-tint">
        <FeatureGrid
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />

        <ProcessSteps
          eyebrow="How it runs"
          title="Shadow, cut, build, automate."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
        />
      </div>

      {/* ── LIGHT · why Northline ── */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why Northline"
          title="What you get that others skip."
          items={page.benefits}
        />
      </div>

      {/* Dark bookend into the footer */}
      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="solutions" slug={page.slug} />
    </SiteShell>
  );
}
