import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { OutlineTypeSection } from "@/components/signature/big-type";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import { cmsBlockData } from "@/lib/block-data";
import type { CmsBlockData } from "@/components/cms-blocks";

const SLUG = "brand-consultancy";

export const Route = createFileRoute("/solutions_/brand-consultancy")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null; blockData: CmsBlockData }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    const blockData = await cmsBlockData(doc?.pageBlocks ?? []);
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc, blockData };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Brand Consultancy — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Brand Consultancy — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

function Page() {
  const { dto, doc, blockData } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "bright-rose-poster": (
      <>
        {/* ── BOLD · bright rose poster hero: pure typography, one ask ── */}
        <section className="block-bold">
          <div className="container-page py-28 md:py-40 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mx-auto mt-6 max-w-4xl font-display text-5xl md:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Strategy to rollout, one thread
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <div className="flex justify-center">
              <HeroCtas primary="Start the Conversation" />
            </div>
          </div>
        </section>

        {/* ── DEEP · the manifesto: giant outlined type on deep rose ── */}
        <div className="block-deep">
          <BackToParent kind="solutions" />

          <OutlineTypeSection
            eyebrow="What we believe about brands"
            lines={["A brand is a", "⟪promise⟫ kept in", "every ⟪pixel⟫."]}
            footer="Positioning that lives in a deck is decoration. Positioning that survives the website, the product, the sales call, and the hiring page — that's a brand. We build the second kind."
          />
        </div>

      </>
    ),
    "whats-included-how": (
      <>
        {/* ── LIGHT · what's included + how it runs ── */}
        <div className="block-light">
          <FeatureGrid
            variant="spotlight"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />

          <ProcessSteps
            variant="ladder"
            eyebrow="How it runs"
            title="Research to every touchpoint."
            steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
          />
        </div>

      </>
    ),
    "soft-rose-band": (
      <>
        {/* ── TINT · soft rose band for the deliverables ledger ── */}
        <div className="block-tint">
          <section className="container-page py-24" data-reveal-group>
            <div className="mb-12 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                What lands in your hands
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                The consultancy ledger.
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {[
                ["Positioning strategy", "One page, board-signed, with the trade-offs named"],
                ["Identity system", "Marks, palette, type, motion — delivered as tokens"],
                ["Messaging architecture", "Website copy, sales narrative, and the elevator answer"],
                ["Voice guidelines", "The ten sentences your team will say a thousand times"],
                ["Rollout plan", "Every touchpoint sequenced, biggest revenue surfaces first"],
                ["Governance kit", "Templates and rules that keep pixel 1,000 as sharp as pixel 1"],
              ].map(([t, d], i) => (
                <div
                  key={t}
                  className="grid gap-2 py-6 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline"
                  data-reveal-child
                >
                  <span className="font-display text-lg font-semibold text-gradient-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{t}</h3>
                  <p className="text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </>
    ),
    benefits: (
      <>
        {/* ── LIGHT · why Auxtech ── */}
        <div className="block-light">
          <BenefitList
            eyebrow="Why Auxtech"
            title="What you get that others skip."
            items={page.benefits}
          />
        </div>

      </>
    ),
    faq: (
      <>
        {/* Dark bookend into the footer */}
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
        <RelatedPages kind="solutions" slug={page.slug} />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["solutions/brand-consultancy"]}>
      <PageSections
        order={liveDto?.sectionOrder ?? []}
        blocks={blocks}
        cmsData={blockData}
        cmsBlocks={liveDto?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
