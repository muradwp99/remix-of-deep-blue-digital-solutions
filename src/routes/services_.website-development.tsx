import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, BenefitList, FAQAccordion } from "@/components/sections";
import { BrowserFrame } from "@/components/signature/device-frames";
import { TerminalWindow } from "@/components/signature/terminal";
import { ScoreBars } from "@/components/signature/meters";
import { StatTicker } from "@/components/signature/ticker";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { BeforeAfterSlider } from "@/components/signature/before-after";
import { SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("services", "website-development")!;

export const Route = createFileRoute("/services_/website-development")({
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

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

function Page() {
  return (
    <SiteShell theme={pageThemes["services/website-development"]}>
      {/* ── DARK · hero: full-bleed workspace image, split copy/report ── */}
      <section className="relative overflow-hidden">
        <img
          src={u("photo-1498050108023-c5249f4df085", 1920)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          data-parallax-img
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-background/30" />
        <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Websites that load fast and sell
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas
              primary="Start Your Website"
              secondary={{ label: "See Shipped Sites", to: "/works" }}
            />
          </div>
          <div className="relative" data-slide="right">
            <BrowserFrame url="yoursite.com" className="relative">
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Launch report
                </p>
                <ScoreBars
                  className="mt-5"
                  items={[
                    { label: "Performance", value: 98, display: "98" },
                    { label: "SEO", value: 100, display: "100" },
                    { label: "Accessibility", value: 96, display: "96" },
                    { label: "Best practices", value: 100, display: "100" },
                  ]}
                />
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* ── BOLD · electric-blue ticker band ── */}
      <div className="block-bold">
        <StatTicker
          className="border-y-0 bg-transparent py-6"
          items={[
            "98 median Lighthouse at launch",
            "First live demo on day 7",
            "SEO-ready from the first commit",
            "Sub-second loads on mid-range phones",
            "Component kit included",
          ]}
        />
      </div>

      {/* ── LIGHT · what's included + photo strip ── */}
      <div className="block-light">
        <section className="container-page pt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services
          </Link>
        </section>

        <FeatureGrid
          variant="rows"
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />

        {/* tilted photo trio */}
        <section className="container-page pb-24" data-cards data-cards-stagger="0.12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { img: u("photo-1522542550221-31fd19575a2d"), cap: "Design, argued on real content", rot: "-rotate-1" },
              { img: u("photo-1461749280684-dccba630e2f6"), cap: "Code your next hire can read", rot: "rotate-1" },
              { img: u("photo-1460925895917-afdab827c52f"), cap: "Numbers watched after launch", rot: "-rotate-1" },
            ].map((f) => (
              <figure key={f.cap} data-card className={`${f.rot} overflow-hidden rounded-3xl bg-card shadow-panel`}>
                <div className="h-56 overflow-hidden">
                  <img src={f.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <figcaption className="flex items-center gap-2.5 p-5 text-sm font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
                  {f.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      {/* ── TINT · pinned build pipeline ── */}
      <div className="block-tint">
        <StickyPinSteps
          eyebrow="How it runs"
          title="Watch the site take shape."
          steps={page.steps}
          panels={[
            <div key="wire" className="overflow-hidden rounded-2xl shadow-panel">
              <img src={u("photo-1581291518857-4e27b48ff24e")} alt="Wireframes on a desk" className="h-full w-full object-cover" />
            </div>,
            <div key="design" className="overflow-hidden rounded-2xl shadow-panel">
              <img src={u("photo-1561070791-2526d30994b5")} alt="Design exploration" className="h-full w-full object-cover" />
            </div>,
            <TerminalWindow
              key="build"
              title="deploy — zsh"
              lines={[
                { prompt: "$", text: "git push origin main" },
                { text: "CI: 214 checks passed", ok: true, dim: true },
                { text: "Preview deployed → pr-42.yoursite.dev", ok: true, dim: true },
                { prompt: "$", text: "lighthouse https://pr-42.yoursite.dev" },
                { text: "Performance: 98  SEO: 100", ok: true },
              ]}
            />,
            <div key="launch" className="rounded-2xl bg-card p-8 shadow-panel">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Day 30</p>
              <p className="mt-3 font-display text-6xl font-semibold text-lime" data-counter>
                +46%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                median organic-traffic lift in the first month — the tuning window pays for itself.
              </p>
            </div>,
          ]}
        />
      </div>

      {/* ── LIGHT · before/after ── */}
      <div className="block-light">
        <section className="container-page py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Drag to compare
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              The redesign, side by side.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground" data-reveal>
              A recent replatform: same brand, same content — nine seconds to first click became 0.9.
            </p>
          </div>
          <div data-reveal>
            <BeforeAfterSlider
              before={u("photo-1504868584819-f8e8b4b6d7e3", 1600)}
              after={u("photo-1498050108023-c5249f4df085", 1600)}
              alt="Website redesign comparison"
            />
          </div>
        </section>
      </div>

      {/* ── DARK · why us + FAQ + banner ── */}
      <BenefitList eyebrow="Why Northline" title="What you get that others skip." items={page.benefits} />
      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="services" slug={page.slug} />
    </SiteShell>
  );
}
