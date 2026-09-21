import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { ScoreBars } from "@/components/signature/meters";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import { cmsBlockData } from "@/lib/block-data";
import type { CmsBlockData } from "@/components/cms-blocks";

const SLUG = "seo-performance";

export const Route = createFileRoute("/services_/seo-performance")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null; blockData: CmsBlockData }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    const blockData = await cmsBlockData(doc?.pageBlocks ?? []);
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc, blockData };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "SEO & Performance Optimization — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "SEO & Performance Optimization — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

/* SERP mock: your result highlighted, climbing above competitors */
function SerpMock() {
  const results = [
    { name: "competitor-one.com", you: false },
    { name: "yoursite.com", you: true },
    { name: "competitor-two.com", you: false },
    { name: "competitor-three.com", you: false },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-panel backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">your money keyword</span>
      </div>
      <div className="space-y-3 p-4">
        {results.map((r) => (
          <div
            key={r.name}
            className={`rounded-xl p-3.5 ${
              r.you
                ? "border border-lime/50 bg-lime/8 shadow-[0_0_30px_-8px_var(--lime)]"
                : "bg-white/4 opacity-70"
            }`}
          >
            <p className={`text-[11px] ${r.you ? "text-lime" : "text-muted-foreground"}`}>
              {r.name}
            </p>
            <div className={`mt-1.5 h-3 w-2/3 rounded ${r.you ? "bg-white/25" : "bg-white/10"}`} />
            <div className="mt-1.5 h-2 w-5/6 rounded bg-white/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Page() {
  const { dto, doc, blockData } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "periwinkle-poster-hero": (
      <>
        {/* ── BOLD · periwinkle poster hero, giant Lighthouse number ── */}
        <section className="block-bold relative overflow-hidden">
          <div className="container-page pt-24 pb-12 md:pt-32">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
              data-split
            >
              Speed and search are the same job
            </h1>
            <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="max-w-xl text-lg text-muted-foreground" data-reveal>
                  {page.subtitle}
                </p>
                <HeroCtas primary="Get the Audit" />
              </div>
              <div data-reveal>
                <p
                  className="font-display text-[clamp(5rem,15vw,11rem)] font-semibold leading-none tracking-tight"
                  data-counter
                >
                  96
                </p>
                <p className="mt-2 max-w-[16rem] text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  median Lighthouse after an engagement, measured on real phones
                </p>
              </div>
            </div>
          </div>
          <p
            aria-hidden
            className="type-outline pointer-events-none select-none whitespace-nowrap pb-2 font-display text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-none opacity-50"
          >
            RANK · SPEED · RANK · SPEED
          </p>
        </section>

        {/* ── LIGHT · back + Core Web Vitals ── */}
        <div className="block-light">
          <BackToParent kind="services" />
          <section className="container-page py-24 border-t border-border/60" data-reveal-group>
            <div className="grid items-start gap-14 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                  Core Web Vitals
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                  data-reveal-child
                >
                  Red to green, measured in the field.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                  Lab scores flatter; field data pays. We work against real-user metrics from
                  mid-range phones — the numbers Google actually ranks on.
                </p>
              </div>
              <div className="gradient-card rounded-3xl p-8" data-reveal-child>
                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Typical engagement, week 0 → week 8
                </p>
                <ScoreBars
                  items={[
                    { label: "LCP — 4.8s → 1.6s", value: 92, display: "1.6s" },
                    { label: "INP — 410ms → 140ms", value: 88, display: "140ms" },
                    { label: "CLS — 0.31 → 0.02", value: 97, display: "0.02" },
                    { label: "Lighthouse — 54 → 96", value: 96, display: "96" },
                  ]}
                />
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "where-you-land": (
      <>
        {/* ── DEEP · where you land on the results page ── */}
        <section className="block-deep relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none opacity-60" />
          <div className="container-page relative grid items-center gap-14 py-24 md:py-28 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                The payoff
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal
              >
                When speed and structure agree, you climb.
              </h2>
              <p className="mt-6 max-w-md text-lg text-muted-foreground" data-reveal>
                Green vitals and clean markup are the same lever the ranking algorithm pulls — the
                result shows up where it counts, above the fold of the results page.
              </p>
            </div>
            <div data-slide="right">
              <SerpMock />
            </div>
          </div>
        </section>

      </>
    ),
    "whats-included": (
      <>
        {/* ── LIGHT · what's included ── */}
        <div className="block-light">
          <FeatureGrid
            variant="rows"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />
        </div>

      </>
    ),
    "how-it-runs": (
      <>
        {/* ── TINT · how it runs ── */}
        <div className="block-tint">
          <ProcessSteps
            variant="rail"
            eyebrow="How it runs"
            title="Audit, fix, structure, hold."
            steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
          />
        </div>

      </>
    ),
    benefits: (
      <>
        {/* ── DARK bookend ── */}
        <BenefitList
          eyebrow="Why Auxtech"
          title="What you get that others skip."
          items={page.benefits}
        />
      </>
    ),
    faq: (
      <>
        <FAQAccordion faqs={page.faqs} />
      </>
    ),
    banner: (
      <>
        <SubpageBanner page={page} />
      </>
    ),
    related: (
      <>
        <RelatedPages kind="services" slug={page.slug} />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["services/seo-performance"]}>
      <PageSections
        order={liveDto?.sectionOrder ?? []}
        blocks={blocks}
        cmsData={blockData}
        cmsBlocks={liveDto?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
