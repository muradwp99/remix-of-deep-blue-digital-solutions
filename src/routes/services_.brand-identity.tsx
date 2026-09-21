import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight, Package } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { AuxtechMark } from "@/components/auxtech-logo";
import { BenefitList, FAQAccordion } from "@/components/sections";
import { HorizontalPin } from "@/components/signature/horizontal-strip";
import { BeforeAfterSlider } from "@/components/signature/before-after";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "brand-identity";

export const Route = createFileRoute("/services_/brand-identity")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Brand Identity Design — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Brand Identity Design — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const MOODBOARD = [
  {
    img: u("photo-1541701494587-cb58502866ab", 900),
    alt: "Abstract paint textures used in mark exploration",
    label: "Mark studies",
    note: "Explorations 01–14",
  },
  {
    img: u("photo-1522542550221-31fd19575a2d", 900),
    alt: "Design sketches pinned across a studio wall",
    label: "Sketch wall",
    note: "Positioning week",
  },
  {
    img: u("photo-1558655146-9f40138edfeb", 900),
    alt: "Grid of brand mockups on real product surfaces",
    label: "Surface tests",
    note: "App · site · invoice",
  },
  {
    img: u("photo-1572044162444-ad60f128bdea", 900),
    alt: "Notebook with hand-written voice and messaging drafts",
    label: "Voice notebook",
    note: "The ten sentences",
  },
  {
    img: u("photo-1533750349088-cd871a92f312", 900),
    alt: "Team reviewing brand directions in a meeting",
    label: "Direction review",
    note: "Three in, one out",
  },
];

const MARK_SCALES = [
  { size: 96, label: "Billboard" },
  { size: 64, label: "Packaging" },
  { size: 40, label: "Social avatar" },
  { size: 26, label: "App icon" },
  { size: 16, label: "Favicon" },
];

const PROOF_STATS = [
  { value: "3", label: "distinct directions, each tested on your hardest real surfaces" },
  { value: "16", label: "pixels — the smallest surface the mark has to win before we sign off" },
  { value: "10", label: "sentences of voice your team will say a thousand times, written down" },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const LEDGER = [
    ...page.features,
    {
      icon: Package,
      title: "Handoff Kit",
      desc: "Full asset library, design tokens, and templates for the collateral you use most.",
    },
  ];
  const blocks: Record<string, ReactNode> = {
    "full-bleed-paint-hero": (
      <>
        {/* ── DEEP · full-bleed paint hero + N-mark scale strip ── */}
        <div className="block-deep">
          <section className="relative overflow-hidden">
            <img
              src={u("photo-1541701494587-cb58502866ab", 1920)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60"
              data-parallax-img
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-background/25" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />

            <div className="container-page relative py-24 md:py-36">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                {page.eyebrow}
              </p>
              <h1
                className="mt-5 max-w-4xl font-display text-5xl md:text-7xl leading-[0.96] font-semibold"
                data-split
              >
                A brand that survives contact with the product
              </h1>
              <p className="mt-7 max-w-xl text-lg text-muted-foreground" data-reveal>
                {page.subtitle}
              </p>
              <HeroCtas
                primary="Start the Brand Work"
                secondary={{ label: "See Shipped Brands", to: "/works" }}
              />
            </div>

            {/* the same mark at five scales — identity stress test */}
            <div className="relative border-t border-white/10">
              <div className="container-page py-10">
                <div
                  className="flex flex-wrap items-end gap-x-10 gap-y-6"
                  data-reveal-group
                >
                  {MARK_SCALES.map((m) => (
                    <div key={m.label} className="flex flex-col items-center gap-3" data-reveal-child>
                      <AuxtechMark
                        style={{ width: m.size, height: m.size }}
                        className="text-gold"
                      />
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {m.label}
                      </span>
                    </div>
                  ))}
                  <p
                    className="max-w-xs text-sm text-muted-foreground md:ml-auto md:text-right"
                    data-reveal-child
                  >
                    One mark, every scale. If it breaks at sixteen pixels, it goes back to the wall.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── LIGHT · pinned moodboard strip with real photography ── */}
        <div className="block-light">
          <BackToParent kind="services" />
          <HorizontalPin eyebrow="Inside the process" title="The moodboard, unrolled.">
            {MOODBOARD.map((m, i) => (
              <figure
                key={m.label}
                className="w-[70vw] max-w-md shrink-0 overflow-hidden rounded-3xl bg-card shadow-panel"
              >
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <img
                    src={m.img}
                    alt={m.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 font-display text-xs font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="flex items-baseline justify-between gap-3 p-5">
                  <span className="text-sm font-semibold">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.note}</span>
                </figcaption>
              </figure>
            ))}
          </HorizontalPin>
        </div>

      </>
    ),
    "deliverables-as-numbered": (
      <>
        {/* ── BOLD · deliverables as a numbered ledger ── */}
        <div className="block-bold">
          <section className="container-page py-20 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  The deliverables
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-6xl leading-[1.02] font-semibold"
                  data-split
                >
                  Everything ships. Nothing is implied.
                </h2>
              </div>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-navy px-7 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
              >
                {page.banner.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-14 border-t border-border" data-reveal-group>
              {LEDGER.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.title}
                    data-reveal-child
                    className="grid gap-3 border-b border-border py-8 md:grid-cols-[5.5rem_1.2fr_2fr_auto] md:items-center md:gap-6"
                  >
                    <span className="font-display text-5xl font-semibold text-foreground/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{row.title}</h3>
                    <p className="text-muted-foreground">{row.desc}</p>
                    <span
                      aria-hidden
                      className="hidden h-12 w-12 place-items-center rounded-2xl bg-card shadow-panel md:grid"
                    >
                      <Icon className="h-5 w-5 text-lime" />
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3" data-cards data-cards-stagger="0.12">
              {PROOF_STATS.map((s) => (
                <div key={s.label} data-card className="rounded-3xl bg-card p-7 shadow-panel">
                  <p className="font-display text-5xl font-semibold text-lime" data-counter>
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </>
    ),
    "before-after-process": (
      <>
        {/* ── LIGHT · before/after, process, editorial pull-quote ── */}
        <div className="block-light">
          <section className="container-page py-20 md:py-28">
            <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div data-slide="left">
                <p className="text-xs uppercase tracking-[0.28em] text-lime">Drag to compare</p>
                <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold">
                  Same company, new spine.
                </h2>
              </div>
              <p className="text-lg text-muted-foreground lg:pb-2" data-slide="right">
                An inherited pile of ad-hoc collateral on the left; the codified system it became on
                the right. Every surface now agrees on who you are.
              </p>
            </div>
            <div data-reveal>
              <BeforeAfterSlider
                before={u("photo-1504868584819-f8e8b4b6d7e3", 1600)}
                after={u("photo-1558655146-9f40138edfeb", 1600)}
                beforeLabel="Inherited"
                afterLabel="Systemized"
                alt="Brand collateral before and after the identity system"
              />
            </div>
          </section>

          <section className="container-page pb-20 md:pb-24">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              How it runs
            </p>
            <h2
              className="mt-4 max-w-2xl font-display text-4xl md:text-5xl leading-tight font-semibold"
              data-reveal
            >
              Positioning to rollout.
            </h2>
            <div className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4" data-scatter>
              {page.steps.map((s, i) => (
                <div
                  key={s.t}
                  data-scatter-item
                  className={`rounded-3xl bg-card p-7 shadow-panel ${i % 2 === 1 ? "lg:mt-10" : ""}`}
                >
                  <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 font-display text-xs font-semibold">
                    Phase {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* bespoke: editorial serif-italic pull-quote */}
          <section className="relative overflow-hidden border-t border-border">
            <img
              src={u("photo-1456513080510-7bf3a84b82f8", 600)}
              alt=""
              loading="lazy"
              data-parallax="0.1"
              className="absolute -right-20 top-16 hidden h-72 w-72 rounded-full object-cover opacity-60 lg:block"
            />
            <div className="container-page relative py-24 md:py-32">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                From the studio
              </p>
              <blockquote
                className="mt-8 max-w-4xl font-playfair italic text-3xl md:text-5xl leading-[1.18] font-medium"
                data-reveal
              >
                “A logo is a promise made at sixteen pixels. If the mark can’t keep it there, the
                billboard was never going to save you.”
              </blockquote>
              <svg
                viewBox="0 0 320 24"
                className="mt-8 h-6 w-64 text-lime"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 16 C 80 4, 240 24, 316 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  data-draw
                />
              </svg>
              <p className="mt-5 text-sm text-muted-foreground" data-reveal>
                Creative direction — Auxtech
              </p>
            </div>
          </section>
        </div>

      </>
    ),
    benefits: (
      <>
        {/* ── DARK · why us, FAQ, banner ── */}
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
    <SiteShell theme={pageThemes["services/brand-identity"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
