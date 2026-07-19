import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { StatTicker } from "@/components/signature/ticker";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "digital-marketing";

export const Route = createFileRoute("/solutions_/digital-marketing")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Digital Marketing — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Digital Marketing — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

const CHANNELS = [
  { name: "Search", angle: 0 },
  { name: "Paid social", angle: 60 },
  { name: "Email", angle: 120 },
  { name: "Content", angle: 180 },
  { name: "Retargeting", angle: 240 },
  { name: "Partnerships", angle: 300 },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  return (
    <SiteShell theme={pageThemes["solutions/digital-marketing"]}>
      {/* ── BOLD · vivid orange hero: channels orbit a revenue core ── */}
      <section className="block-bold">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Marketing measured in pipeline
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Build the Engine" />
          </div>
          {/* orbit: channels circle a revenue core */}
          <div className="relative mx-auto aspect-square w-full max-w-sm" data-reveal>
            <div className="absolute inset-[12%] rounded-full border border-black/10" aria-hidden />
            <div className="absolute inset-[30%] rounded-full border border-black/5" aria-hidden />
            <div className="absolute inset-0 spin-slow">
              {CHANNELS.map((c) => (
                <span
                  key={c.name}
                  className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full glass px-3.5 py-1.5 text-xs font-medium"
                  style={{
                    transform: `rotate(${c.angle}deg) translateX(150px) rotate(-${c.angle}deg) translate(-50%, -50%)`,
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full gradient-card-gold text-center">
              <div>
                <p className="font-display text-xl font-semibold text-foreground">Revenue</p>
                <p className="text-[10px] text-muted-foreground">the only KPI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign ticker — dark full-bleed breather */}
      <StatTicker
        items={[
          "CAC down 34% in two quarters",
          "Landing pages built in-house",
          "One attribution picture",
          "Budgets follow performance monthly",
          "Content that compounds",
        ]}
      />

      {/* ── LIGHT · the work, concretely ── */}
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

      {/* ── TINT · soft band for how it runs ── */}
      <div className="block-tint">
        <ProcessSteps
          variant="rail"
          eyebrow="How it runs"
          title="Baseline to compounding engine."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
        />
      </div>

      {/* ── DEEP · the honest monthly report: four glowing numbers ── */}
      <div className="block-deep">
        <section className="container-page py-24" data-reveal-group>
          <div className="grid items-start gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                The monthly report
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                Four numbers. No theater.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                If a metric can't be traced to pipeline, it doesn't make the report. Impressions and
                "engagement" live in the appendix, where they belong.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "$412k", l: "attributed pipeline this month" },
                { v: "$187", l: "blended CAC, down from $284" },
                { v: "4.6%", l: "visitor→lead across landing pages" },
                { v: "31%", l: "of pipeline now from organic" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="glare-card gradient-card lift rounded-2xl p-7"
                  data-reveal-child
                >
                  <div
                    className="font-display text-3xl md:text-4xl font-semibold text-gradient-lime"
                    data-counter
                  >
                    {s.v}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHT · why Auxtech ── */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why Auxtech"
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
