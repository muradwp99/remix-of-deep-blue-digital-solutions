import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { Store, Users } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import { cmsBlockData } from "@/lib/block-data";
import type { CmsBlockData } from "@/components/cms-blocks";

const SLUG = "marketplaces";

export const Route = createFileRoute("/solutions_/marketplaces")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null; blockData: CmsBlockData }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    const blockData = await cmsBlockData(doc?.pageBlocks ?? []);
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc, blockData };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Marketplace Development — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Marketplace Development — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

/* Two-sided panel: supply violet, demand cyan — slides in from opposite edges */
function SidePanel({ side }: { side: "supply" | "demand" }) {
  const isSupply = side === "supply";
  const hue = isSupply ? "292" : "205";
  return (
    <div
      className="glass-strong flex-1 rounded-3xl p-8"
      data-slide={isSupply ? "left" : "right"}
      style={{ borderColor: `oklch(0.78 0.15 ${hue} / 0.3)` }}
    >
      <span
        className="grid h-11 w-11 place-items-center rounded-xl"
        style={{
          background: `oklch(0.78 0.15 ${hue} / 0.15)`,
          border: `1px solid oklch(0.78 0.15 ${hue} / 0.35)`,
        }}
      >
        {isSupply ? (
          <Store className="h-5 w-5" style={{ color: `oklch(0.78 0.15 ${hue})` }} />
        ) : (
          <Users className="h-5 w-5" style={{ color: `oklch(0.78 0.15 ${hue})` }} />
        )}
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold">
        {isSupply ? "Supply side" : "Demand side"}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        {(isSupply
          ? [
              "Onboarding that makes providers look great",
              "Inventory & calendar tooling",
              "Payouts, taxes, dispute shields",
            ]
          : [
              "Search & matching tuned for fill rate",
              "Trust signals at every decision",
              "One-tap booking and escrow-backed payment",
            ]
        ).map((t) => (
          <li key={t} className="flex gap-2.5">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: `oklch(0.78 0.15 ${hue})` }}
            />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Page() {
  const { dto, doc, blockData } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "dual-tone-platform-hero": (
      <>
        {/* ── DEEP · dual-tone platform hero: violet/cyan glows on deep color ── */}
        <section className="block-deep relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -left-32 top-20 h-96 w-96 rounded-full opacity-25 blur-[100px]"
            style={{ background: "oklch(0.78 0.15 292)" }}
          />
          <div
            aria-hidden
            className="absolute -right-32 top-20 h-96 w-96 rounded-full opacity-25 blur-[100px]"
            style={{ background: "oklch(0.78 0.15 205)" }}
          />
          <div className="container-page relative py-24 md:py-32 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mx-auto mt-5 max-w-4xl font-display text-5xl md:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Two sides, one flywheel
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <div className="flex justify-center">
              <HeroCtas primary="Plan the Platform" />
            </div>
            <div className="mt-16 flex flex-col gap-5 text-left lg:flex-row">
              <SidePanel side="supply" />
              <SidePanel side="demand" />
            </div>
          </div>
        </section>

        {/* ── LIGHT · the liquidity flywheel draws itself, then what's included ── */}
        <div className="block-light">
          <BackToParent kind="solutions" />

          <section className="container-page py-24" data-reveal-group>
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                  The liquidity flywheel
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                  data-reveal-child
                >
                  Every sprint feeds the loop.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                  More supply improves matches; better matches convert demand; converted demand
                  attracts supply. We prioritize the backlog by which feature spins this wheel
                  fastest — nothing else earns a sprint.
                </p>
              </div>
              <div className="relative mx-auto w-full max-w-md" data-reveal-child>
                <svg viewBox="0 0 320 320" className="w-full" aria-hidden>
                  <circle
                    cx="160"
                    cy="160"
                    r="110"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 160 50 A 110 110 0 1 1 159 50"
                    fill="none"
                    stroke="var(--lime)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    data-draw="scrub"
                  />
                  {[
                    { x: 160, y: 38, t: "Supply joins" },
                    { x: 282, y: 165, t: "Matches improve" },
                    { x: 160, y: 292, t: "Demand converts" },
                    { x: 38, y: 165, t: "Word spreads" },
                  ].map((n) => (
                    <g key={n.t}>
                      <circle cx={n.x} cy={n.y} r="6" fill="var(--lime)" />
                    </g>
                  ))}
                </svg>
                {[
                  { c: "left-1/2 top-0 -translate-x-1/2 -translate-y-1", t: "Supply joins" },
                  { c: "right-0 top-1/2 translate-x-3 -translate-y-1/2", t: "Matches improve" },
                  { c: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1", t: "Demand converts" },
                  { c: "left-0 top-1/2 -translate-x-3 -translate-y-1/2", t: "Word spreads" },
                ].map((n) => (
                  <span
                    key={n.t}
                    className={`absolute ${n.c} whitespace-nowrap rounded-full glass px-3.5 py-1.5 text-xs font-medium`}
                  >
                    {n.t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <FeatureGrid
            variant="spotlight"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />
        </div>

      </>
    ),
    "soft-violet-band": (
      <>
        {/* ── TINT · soft violet band for the process ── */}
        <div className="block-tint">
          <ProcessSteps
            variant="ladder"
            eyebrow="How it runs"
            title="Constrain, seed, match, scale."
            steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
          />
        </div>

      </>
    ),
    benefits: (
      <>
        {/* ── BOLD · bright violet pop before the dark close ── */}
        <div className="block-bold">
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
    <SiteShell theme={pageThemes["solutions/marketplaces"]}>
      <PageSections
        order={liveDto?.sectionOrder ?? []}
        blocks={blocks}
        cmsData={blockData}
        cmsBlocks={liveDto?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
