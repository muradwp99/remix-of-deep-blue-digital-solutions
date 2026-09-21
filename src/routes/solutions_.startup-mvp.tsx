import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, BenefitList, FAQAccordion } from "@/components/sections";
import { PricingMeter } from "@/components/signature/meters";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import { cmsBlockData } from "@/lib/block-data";
import type { CmsBlockData } from "@/components/cms-blocks";

const SLUG = "startup-mvp";

export const Route = createFileRoute("/solutions_/startup-mvp")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null; blockData: CmsBlockData }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    const blockData = await cmsBlockData(doc?.pageBlocks ?? []);
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc, blockData };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Startup MVP — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Startup MVP — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

const PIECES = [
  "Auth",
  "Core loop",
  "Billing",
  "Onboarding",
  "Analytics",
  "Landing page",
  "Admin",
  "API",
];

function Page() {
  const { dto, doc, blockData } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "yellow-scatter-hero": (
      <>
        {/* ── BOLD · yellow scatter hero: the product pieces fly into place ── */}
        <section className="block-bold" data-scatter>
          <div className="container-page py-24 text-center md:py-32">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
              data-split
            >
              From idea to launch
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <div className="flex justify-center">
              <HeroCtas primary="Book the Workshop" />
            </div>
            <div className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-3">
              {PIECES.map((p, i) => (
                <span
                  key={p}
                  data-scatter-item
                  className={`rounded-xl px-5 py-3 font-display text-sm font-semibold ${
                    i === 1 ? "bg-foreground text-background" : "glass"
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground" data-reveal>
              The core loop ships first. Everything else earns its way in.
            </p>
          </div>
        </section>

        {/* ── DEEP · the runway math, glowing ── */}
        <div className="block-deep">
          <BackToParent kind="solutions" />
          <section className="container-page py-24" data-reveal-group>
            <div className="mb-12 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                The runway math
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-reveal-child
              >
                Built to fit inside your burn.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                A fixed price and a fixed date mean the build is a line item, not a variable. Here's
                how a typical pre-seed engagement sits against an 18-month runway.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <PricingMeter
                label="Build window"
                display="10 wks"
                value={14}
                note="of an 18-month runway spent building — demo every Friday while it runs."
              />
              <PricingMeter
                label="Budget share"
                display="fixed"
                value={22}
                note="one known number from the cut-line workshop. Changes are written orders."
              />
              <PricingMeter
                label="Time to signal"
                display="wk 12"
                value={17}
                note="real users on the live product — months of runway left to iterate on evidence."
              />
            </div>
          </section>
        </div>

      </>
    ),
    "whats-included-then": (
      <>
        {/* ── LIGHT · what's included, then the dated 0→1 timeline ── */}
        <div className="block-light">
          <FeatureGrid
            variant="rows"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />

          <section className="container-page border-t border-black/10 py-24" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                How it runs
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-reveal-child
              >
                Zero to one, dated.
              </h2>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gold/50 md:block"
                data-timeline-line
              />
              <div className="grid gap-10 md:grid-cols-4">
                {page.steps.map((s, i) => (
                  <div key={s.t} className="relative" data-reveal-child>
                    <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-card font-display text-lg font-semibold text-gold shadow-panel">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold">{s.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    faq: (
      <>
        {/* ── TINT · why us + answers ── */}
        <div className="block-tint">
          <BenefitList
            eyebrow="Why Auxtech"
            title="What you get that others skip."
            items={page.benefits}
          />
          <FAQAccordion faqs={page.faqs} />
        </div>

      </>
    ),
    banner: (
      <>
        {/* ── DARK bookend ── */}
        <SubpageBanner page={page} />
      </>
    ),
    related: (
      <>
        <RelatedPages kind="solutions" slug={page.slug} />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["solutions/startup-mvp"]}>
      <PageSections
        order={liveDto?.sectionOrder ?? []}
        blocks={blocks}
        cmsData={blockData}
        cmsBlocks={liveDto?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
