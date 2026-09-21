import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, BenefitList, FAQAccordion } from "@/components/sections";
import { StatTicker } from "@/components/signature/ticker";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { TerminalWindow } from "@/components/signature/terminal";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";

const SLUG = "scale-up";

export const Route = createFileRoute("/solutions_/scale-up")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Scale-up Engineering — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Scale-up Engineering — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

/* Node-cluster diagrams for the pinned narrative */
function Cluster({ nodes }: { nodes: number }) {
  const positions = [
    [50, 50],
    [25, 30],
    [75, 30],
    [25, 70],
    [75, 70],
    [50, 15],
    [50, 85],
    [10, 50],
    [90, 50],
  ].slice(0, nodes);
  return (
    <div className="glass-strong relative aspect-[4/3] w-full rounded-2xl">
      <svg viewBox="0 0 100 75" className="h-full w-full" aria-hidden>
        {positions.slice(1).map(([x, y], i) => (
          <line
            key={i}
            x1="50"
            y1="37.5"
            x2={x}
            y2={(y * 75) / 100}
            stroke="var(--lime)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {positions.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={(y * 75) / 100}
            r={i === 0 ? 5 : 3.2}
            fill={i === 0 ? "var(--lime)" : "oklch(1 0 0 / 0.14)"}
            stroke="var(--lime)"
            strokeWidth={i === 0 ? 0 : 0.6}
          />
        ))}
      </svg>
      <span className="absolute bottom-3 right-4 text-[11px] text-muted-foreground">
        {nodes === 1 ? "the monolith" : `${nodes} services, one system`}
      </span>
    </div>
  );
}

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "big-type-systemic-hero": (
      <>
        {/* ── DEEP · big-type systemic hero ── */}
        <section className="block-deep relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
          <div className="container-page relative py-24 md:py-36">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 max-w-4xl font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tight"
              data-split
            >
              Your v1 worked. <span className="text-gold">That's the problem.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Book the Audit" />
          </div>
        </section>

      </>
    ),
    "growth-ticker-as": (
      <>
        {/* ── BOLD · the growth ticker as a bright teal strip ── */}
        <div className="block-bold">
          <StatTicker
            items={[
              "3× release cadence in two quarters",
              "Zero-downtime cutovers",
              "Strangler pattern, never big-bang",
              "40% median infra-cost reduction",
              "Your team levels up with us",
            ]}
          />
        </div>

        {/* ── LIGHT · what's included ── */}
        <div className="block-light">
          <BackToParent kind="solutions" />
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
    "pinned-1-node-cluster": (
      <>
        {/* ── DEEP · pinned 1-node → cluster narrative ── */}
        <div className="block-deep">
          <StickyPinSteps
            eyebrow="How it runs"
            title="One node becomes a system."
            steps={page.steps}
            stepGap={24}
            panels={[
              <Cluster key="mono" nodes={1} />,
              <TerminalWindow
                key="observe"
                title="observability — zsh"
                lines={[
                  { prompt: "$", text: "auxctl metrics --window 7d" },
                  { text: "p95 latency   212ms", ok: true, dim: true },
                  { text: "error rate    0.4%", ok: true, dim: true },
                  { text: "queue depth   1.2k, bottleneck" },
                ]}
              />,
              <Cluster key="partial" nodes={5} />,
              <div key="full" className="rounded-2xl bg-card p-8 shadow-panel">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Release cadence</p>
                <p className="mt-3 font-display text-6xl font-semibold text-lime" data-counter>
                  3×
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The median outcome across our transformation work within two quarters.
                </p>
              </div>,
            ]}
          />
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
    <SiteShell theme={pageThemes["solutions/scale-up"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
