import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import {
  AlignLeft,
  Check,
  CreditCard,
  HelpCircle,
  Image as ImageIcon,
  Images,
  LayoutTemplate,
  Megaphone,
  PenLine,
  Quote,
  Rows3,
  Type,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/sections";
import { BrowserFrame } from "@/components/signature/device-frames";
import { LogoMarquee } from "@/components/signature/logo-wall";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";

const SLUG = "cms-websites";

export const Route = createFileRoute("/services_/cms-websites")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "CMS Website Development — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "CMS Website Development — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/* Editor mock: content blocks with edit affordances, sidebar of block types */
function EditorMock() {
  return (
    <div className="grid grid-cols-[1fr_120px]">
      <div className="space-y-3 border-r border-white/8 p-5">
        <div className="rounded-lg border border-lime/60 bg-lime/8 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-lime">
            <PenLine className="h-3 w-3" /> Editing · Hero
          </div>
          <div className="h-4 w-3/4 rounded bg-white/20" />
          <div className="mt-2 h-2.5 w-full rounded bg-white/8" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-white/8 p-3 opacity-70">
            <div className="h-3 w-1/2 rounded bg-white/12" />
            <div className="mt-2 h-2.5 w-5/6 rounded bg-white/6" />
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-white/15 p-3 text-center text-[11px] text-muted-foreground">
          + Add block
        </div>
      </div>
      <div className="space-y-2 p-3">
        {[
          { icon: Type, l: "Heading" },
          { icon: ImageIcon, l: "Media" },
          { icon: PenLine, l: "Rich text" },
        ].map((b) => (
          <div
            key={b.l}
            className="flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-2 text-[11px] text-muted-foreground"
          >
            <b.icon className="h-3 w-3 text-lime" /> {b.l}
          </div>
        ))}
      </div>
    </div>
  );
}

const LIBRARY = [
  { icon: LayoutTemplate, t: "Hero", d: "Headline, media, one CTA" },
  { icon: Rows3, t: "Feature grid", d: "Three or four, never five" },
  { icon: Quote, t: "Testimonial", d: "Proof with a face on it" },
  { icon: CreditCard, t: "Pricing", d: "Tiers pulled from one source" },
  { icon: HelpCircle, t: "FAQ", d: "Schema-marked out of the box" },
  { icon: Images, t: "Gallery", d: "Auto-cropped, lazy-loaded" },
  { icon: Megaphone, t: "CTA band", d: "The ask, restated" },
  { icon: AlignLeft, t: "Article body", d: "Rich text that stays typeset" },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "hero-full-bleed-sketches": (
      <>
        {/* ── DEEP · hero: full-bleed sketches behind, live editor right ── */}
        <div className="block-deep">
          <section className="relative overflow-hidden">
            <img
              src={u("photo-1572044162444-ad60f128bdea", 1920)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              data-parallax-img
            />
            <div aria-hidden className="absolute inset-0 bg-black/70" />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/20"
            />
            <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.05fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  {page.eyebrow}
                </p>
                <h1
                  className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
                  data-split
                >
                  A site your team can edit without fear
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                  {page.subtitle}
                </p>
                <HeroCtas
                  primary="Plan Your CMS Build"
                  secondary={{ label: "See Shipped Work", to: "/works" }}
                />
              </div>
              <div className="relative" data-slide="right">
                <div
                  aria-hidden
                  className="absolute -inset-10 rounded-full opacity-20 blur-[90px]"
                  style={{ background: "var(--lime)" }}
                />
                <BrowserFrame url="cms.yoursite.com/editor" className="relative">
                  <EditorMock />
                </BrowserFrame>
              </div>
            </div>
          </section>
        </div>

        {/* ── LIGHT · what's included, platform marquee, editorial pair ── */}
        <div className="block-light">
          <BackToParent kind="services" />

          <section className="container-page pt-12 pb-20 md:pb-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  What's included
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold"
                  data-split
                >
                  The work, concretely
                </h2>
                <p className="mt-5 text-muted-foreground" data-reveal>
                  Not a theme with your logo on it — a content system shaped around the people who
                  will run it.
                </p>
              </div>
              <div data-reveal-group>
                {page.features.map((f, i) => (
                  <div
                    key={f.title}
                    className="flex gap-6 border-t border-border py-8 last:border-b"
                    data-reveal-child
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-black/5">
                      <f.icon className="h-5 w-5 text-lime" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold text-muted-foreground">
                          0{i + 1}
                        </span>
                        <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                      </div>
                      <p className="mt-2 max-w-lg text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-border py-12">
            <p
              className="container-page mb-6 text-xs uppercase tracking-[0.28em] text-muted-foreground"
              data-reveal
            >
              Fluent in every serious CMS
            </p>
            <LogoMarquee
              items={[
                "WordPress",
                "Webflow",
                "Sanity",
                "Contentful",
                "Payload",
                "Strapi",
                "Storyblok",
                "Craft",
              ]}
            />
          </section>

          {/* offset editorial pair */}
          <section className="container-page py-20 md:py-28">
            <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
              <figure data-slide="left">
                <div className="overflow-hidden rounded-3xl shadow-panel">
                  <img
                    src={u("photo-1522542550221-31fd19575a2d", 1400)}
                    alt="Design sketches spread across a working desk"
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                    data-parallax-img
                  />
                </div>
                <figcaption className="mt-4 flex items-center gap-2.5 text-sm font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
                  Content modeled with your editors in the room
                </figcaption>
              </figure>
              <figure className="md:mt-24" data-slide="right">
                <div className="overflow-hidden rounded-3xl shadow-panel">
                  <img
                    src={u("photo-1497215728101-856f4ea42174", 1400)}
                    alt="Clean, calm office where the publishing team works"
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                    data-parallax-img
                  />
                </div>
                <figcaption className="mt-4 flex items-center gap-2.5 text-sm font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
                  Handed over calm — trained, documented, owned by you
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

      </>
    ),
    "block-library-white": (
      <>
        {/* ── BOLD · the block library, white cards on saturated ground ── */}
        <div className="block-bold">
          <section className="container-page py-20 md:py-28">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  The block library
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                  data-split
                >
                  Editors compose. The design holds.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
                Every page is assembled from approved, brand-locked blocks — so the hundredth page
                looks as considered as the first.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-cards data-cards-stagger="0.12">
              {LIBRARY.map((b) => (
                <div key={b.t} className="rounded-2xl bg-card p-6 shadow-panel" data-card>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-black/5">
                    <b.icon className="h-5 w-5 text-lime" />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold">{b.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{b.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-xl text-sm text-muted-foreground" data-reveal>
              Need a block that doesn't exist yet? We design it into the system — versioned,
              previewable, on brand by construction.
            </p>
          </section>
        </div>

      </>
    ),
    "process-as-numbered": (
      <>
        {/* ── LIGHT · process as a numbered editorial ledger ── */}
        <div className="block-light">
          <section className="container-page pt-20 md:pt-28">
            <div className="mb-14 max-w-3xl" data-reveal-group>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                How it runs
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                From workflow to working editor.
              </h2>
            </div>
            <ol className="border-b border-border">
              {page.steps.map((s, i) => (
                <li
                  key={s.t}
                  className="grid gap-4 border-t border-border py-10 md:grid-cols-[120px_1fr_1.4fr] md:gap-10"
                  data-reveal
                >
                  <span className="font-display text-5xl font-semibold type-outline md:text-6xl">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
                  <p className="text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* bespoke: editors publish without tickets — stat overlap on photo */}
          <section className="container-page py-20 md:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
              <div className="relative mb-12 lg:mb-0" data-slide="left">
                <div className="overflow-hidden rounded-3xl shadow-panel">
                  <img
                    src={u("photo-1573164713988-8665fc963095", 1400)}
                    alt="Editor publishing a page from her laptop, no developer involved"
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    data-parallax-img
                  />
                </div>
                <div className="absolute -bottom-10 right-4 rounded-2xl border border-border bg-card p-6 shadow-panel md:-right-6">
                  <p className="font-display text-5xl font-semibold text-lime" data-counter>
                    92%
                  </p>
                  <p className="mt-1.5 max-w-[190px] text-xs text-muted-foreground">
                    of post-launch pages shipped by editors — zero developer tickets
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  Why Auxtech
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold"
                  data-split
                >
                  Editors publish without tickets
                </h2>
                <svg viewBox="0 0 220 12" className="mt-3 h-3 w-52 text-lime" fill="none" aria-hidden>
                  <path
                    d="M2 9C60 3 150 2 218 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    data-draw
                  />
                </svg>
                <ul className="mt-8 space-y-6" data-reveal-group>
                  {page.benefits.map((b) => (
                    <li key={b.title} className="flex gap-3.5" data-reveal-child>
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5">
                        <Check className="h-3.5 w-3.5 text-lime" />
                      </span>
                      <div>
                        <p className="font-semibold">{b.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    faq: (
      <>
        {/* ── DARK · FAQ + banner + related ── */}
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
    <SiteShell theme={pageThemes["services/cms-websites"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
