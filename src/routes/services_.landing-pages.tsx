import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/sections";
import { ComparisonTable } from "@/components/signature/compare-table";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "landing-pages";

export const Route = createFileRoute("/services_/landing-pages")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Landing Page Development — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Landing Page Development — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const ANATOMY = [
  "Message-matched headline",
  "One CTA, repeated",
  "Proof above the fold",
  "Objection handling",
  "Scarcity used honestly",
  "Sub-second load",
  "Event tracking wired",
  "Mobile thumb-zone CTA",
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "coral-hero-giant": (
      <>
        {/* ── BOLD · coral hero: giant display type + huge live CVR counter ── */}
        <div className="block-bold">
          <section className="relative overflow-hidden">
            <div className="container-page pt-24 pb-10 md:pt-32">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime" data-reveal>
                {page.eyebrow}
              </p>
              <h1
                className="mt-6 font-display text-[clamp(3.2rem,11vw,9rem)] font-semibold leading-[0.9] tracking-tight"
                data-split
              >
                One page. One job. Convert.
              </h1>
              <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="max-w-xl text-lg text-muted-foreground" data-reveal>
                    {page.subtitle}
                  </p>
                  <HeroCtas primary="Brief Us a Page" />
                </div>
                <div data-reveal>
                  <p
                    className="font-display text-[clamp(5.5rem,16vw,12rem)] font-semibold leading-none tracking-tight"
                    data-counter
                  >
                    4.1%
                  </p>
                  <p className="mt-2 max-w-xs text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    median visitor→lead rate, last ten pages
                  </p>
                </div>
              </div>
            </div>
            <p
              aria-hidden
              className="type-outline pointer-events-none select-none whitespace-nowrap pb-2 font-display text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-none opacity-50"
            >
              CONVERT · CONVERT · CONVERT · CONVERT
            </p>
          </section>

          {/* white cards on coral — what's included */}
          <section className="border-t border-black/10">
            <div className="container-page py-16 md:py-20">
              <div className="grid gap-6 md:grid-cols-3" data-cards data-cards-stagger="0.12">
                {page.features.map(({ icon: Icon, title, desc }) => (
                  <article key={title} data-card className="rounded-3xl bg-card p-8 shadow-panel">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-lime">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── LIGHT · anatomy scatter chips + full-bleed desk band ── */}
        <div className="block-light">
          <BackToParent kind="services" />

          <section className="container-page overflow-hidden py-20 md:py-28" data-scatter>
            <div className="mb-12 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                Anatomy of a page that converts
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-split
              >
                Nothing decorative. Everything argued.
              </h2>
            </div>
            <div className="flex max-w-4xl flex-wrap gap-3">
              {ANATOMY.map((chip, i) => (
                <span
                  key={chip}
                  data-scatter-item
                  className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-card px-5 py-2.5 text-sm font-medium shadow-panel"
                >
                  <span className="font-display text-xs font-semibold text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <section className="relative pb-24">
            <div className="h-[55vh] min-h-[400px] overflow-hidden">
              <img
                src={u("photo-1561070791-2526d30994b5", 1920)}
                alt="A landing-page layout taking shape on a colorful studio desk"
                className="h-full w-full object-cover"
                loading="lazy"
                data-parallax-img
              />
            </div>
            <div className="container-page">
              <div
                className="relative -mt-24 max-w-md rounded-3xl bg-card p-8 shadow-panel md:-mt-28"
                data-reveal
              >
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  From a recent campaign
                </p>
                <p className="mt-3 font-display text-6xl font-semibold text-lime md:text-7xl" data-counter>
                  38%
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  lower cost per lead after we message-matched every ad group to its own page.
                </p>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "pays-us": (
      <>
        {/* ── TINT · the A/B that pays for us ── */}
        <div className="block-tint">
          <section className="container-page py-20 md:py-28">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                The A/B that pays for us
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-split
              >
                Homepage traffic versus a real landing page.
              </h2>
            </div>
            <div data-reveal>
              <ComparisonTable
                colA="Ads → homepage"
                colB="Ads → Auxtech landing page"
                rows={[
                  {
                    label: "Message match",
                    a: "Generic brand pitch",
                    b: "Continues the ad's exact promise",
                    win: "b",
                  },
                  {
                    label: "Load time",
                    a: "3–6s with full site weight",
                    b: "Sub-second, page-only bundle",
                    win: "b",
                  },
                  {
                    label: "Calls to action",
                    a: "Nav, footer, six competing links",
                    b: "One action, repeated three times",
                    win: "b",
                  },
                  {
                    label: "Quality score",
                    a: "Penalized for relevance",
                    b: "Rewarded — cheaper clicks",
                    win: "b",
                  },
                  {
                    label: "Measurement",
                    a: "Pageview and hope",
                    b: "Every scroll, click, and field tracked",
                    win: "b",
                  },
                  {
                    label: "Typical CVR",
                    a: "0.8–1.5%",
                    b: "3–6% after the first test cycle",
                    win: "b",
                  },
                ]}
              />
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6" data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-navy px-7 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
              >
                Run the A/B on your traffic
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <p className="text-sm text-muted-foreground">
                Losers die fast. Winners inherit the budget.
              </p>
            </div>
          </section>
        </div>

      </>
    ),
    "test-cycle-rail-tilted": (
      <>
        {/* ── LIGHT · test-cycle rail + tilted polaroid pair ── */}
        <div className="block-light">
          <section className="container-page py-20 md:py-28">
            <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  How it runs
                </p>
                <h2
                  className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl"
                  data-split
                >
                  Ship, test, keep the winner.
                </h2>
                <div className="relative mt-12">
                  <svg
                    aria-hidden
                    className="absolute left-[21px] top-3 h-[calc(100%-1.5rem)] w-0.5 text-lime"
                    viewBox="0 0 2 100"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path d="M1 0 L1 100" stroke="currentColor" strokeWidth="2" data-draw="scrub" />
                  </svg>
                  <ol className="space-y-12" data-reveal-group>
                    {page.steps.map((s, i) => (
                      <li key={s.t} className="relative pl-16" data-reveal-child>
                        <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-card font-display text-sm font-semibold text-lime shadow-panel">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">{s.d}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="space-y-10 lg:pt-16">
                <figure
                  data-slide="right"
                  className="rotate-2 rounded-2xl bg-card p-3 pb-5 shadow-panel"
                >
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={u("photo-1553877522-43269d4ea984", 900)}
                      alt="Test roadmap sketched on a whiteboard"
                      className="h-64 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 px-1 text-sm text-muted-foreground">
                    The test roadmap — headline, proof, offer, in that order.
                  </figcaption>
                </figure>
                <figure
                  data-slide="right"
                  className="-rotate-2 rounded-2xl bg-card p-3 pb-5 shadow-panel lg:ml-10"
                >
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={u("photo-1522542550221-31fd19575a2d", 900)}
                      alt="Variant sketches on paper before anything gets built"
                      className="h-64 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 px-1 text-sm text-muted-foreground">
                    Variants sketched on paper first — pixels are the expensive part.
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "why-us-image": (
      <>
        {/* ── DARK · why us with image+stat overlap, FAQ, banner ── */}
        <section className="container-page py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative" data-slide="left">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={u("photo-1460925895917-afdab827c52f", 1400)}
                  alt="Campaign analytics reviewed on a laptop"
                  className="h-[26rem] w-full object-cover"
                  loading="lazy"
                  data-parallax-img
                />
              </div>
              <div className="absolute -bottom-8 right-4 max-w-[15rem] rounded-2xl glass-strong p-6 shadow-panel md:-right-6">
                <p className="font-display text-5xl font-semibold text-gradient-lime" data-counter>
                  3.2×
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  median CVR lift after the first full test cycle
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                Why Auxtech
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl"
                data-reveal
              >
                What you get that others skip.
              </h2>
              <div className="mt-10" data-reveal-group>
                {page.benefits.map((b, i) => (
                  <div
                    key={b.title}
                    className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-[3.5rem_1fr]"
                    data-reveal-child
                  >
                    <span className="font-display text-sm font-semibold text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
    <SiteShell theme={pageThemes["services/landing-pages"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
