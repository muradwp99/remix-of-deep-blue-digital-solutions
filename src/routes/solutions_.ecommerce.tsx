import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { LogoMarquee } from "@/components/signature/logo-wall";
import { StatTicker } from "@/components/signature/ticker";
import { BackToParent, SubpageBanner, RelatedPages } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";
import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";

const SLUG = "ecommerce";

export const Route = createFileRoute("/solutions_/ecommerce")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Ecommerce Solutions — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Ecommerce Solutions — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

const PRODUCT_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=640&q=70",
    name: "Atlas Watch",
    price: "$249",
    rot: "-8deg",
    x: "-56%",
    y: "10%",
  },
  {
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=640&q=70",
    name: "Volt Runner",
    price: "$139",
    rot: "0deg",
    x: "0%",
    y: "0%",
  },
  {
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=70",
    name: "Echo Buds",
    price: "$89",
    rot: "8deg",
    x: "56%",
    y: "10%",
  },
];

const FUNNEL = [
  { stage: "Sessions", value: "100k", note: "monthly visits" },
  { stage: "Product views", value: "61k", note: "sub-second pages" },
  { stage: "Carts", value: "12.4k", note: "one-tap add" },
  { stage: "Orders", value: "4.1k", note: "two-step checkout" },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "emerald-storefront-hero": (
      <>
        {/* ── BOLD · emerald storefront hero: fanned product cards on saturated color ── */}
        <section className="block-bold">
          <div className="container-page pt-24 pb-16 text-center md:pt-32">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] md:text-7xl"
              data-split
            >
              Stores engineered to checkout
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3" data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
              >
                Audit My Store
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* fanned product cards — crisp white panels on the color block */}
            <div
              className="relative mx-auto mt-16 h-72 max-w-3xl sm:h-80"
              data-cards
              data-cards-stagger="0.14"
            >
              {PRODUCT_CARDS.map((c) => (
                // static fan transform lives on the wrapper; GSAP animates the inner data-card
                <div
                  key={c.name}
                  className="absolute left-1/2 top-0 w-52 sm:w-60"
                  style={{
                    transform: `translateX(calc(-50% + ${c.x})) translateY(${c.y}) rotate(${c.rot})`,
                  }}
                >
                  <div
                    data-card
                    className="glare-card overflow-hidden rounded-2xl border border-black/10 bg-card shadow-panel"
                  >
                    <div className="relative h-36 overflow-hidden sm:h-40">
                      <img src={c.img} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between p-4 text-left">
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.price}</p>
                      </div>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-lime-foreground">
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </>
    ),
    "cart-ticker-dark": (
      <>
        {/* Cart ticker — dark full-bleed breather between the two color moments */}
        <StatTicker
          items={[
            "+48% revenue in one quarter",
            "0.9s median product page",
            "Two-step checkout",
            "Black-Friday load-tested",
            "71% mobile traffic, finally converting",
          ]}
        />

        {/* ── DEEP · emerald funnel: bars step down, counters glow on deep color ── */}
        <div className="block-deep">
          <BackToParent kind="solutions" />
          <section className="container-page py-24" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                The money path
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                We engineer the funnel, not the theme.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {FUNNEL.map((f, i) => (
                <div key={f.stage} className="relative" data-reveal-child>
                  <div
                    className="glare-card gradient-card rounded-2xl p-7"
                    style={{ marginTop: `${i * 14}px` }}
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {f.stage}
                    </p>
                    <p
                      className="mt-3 font-display text-4xl font-semibold text-gradient-lime"
                      data-counter
                    >
                      {f.value}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{f.note}</p>
                  </div>
                  {i < FUNNEL.length - 1 && (
                    <svg
                      aria-hidden
                      className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-lime md:block"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M4 16h22m0 0-8-8m8 8-8 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        data-draw
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-sm text-muted-foreground" data-reveal-child>
              Illustrative funnel from a mid-market store after replatform — a 4.1% session-to-order
              rate against an industry median near 1.8%.
            </p>
          </section>
        </div>

      </>
    ),
    "platform-logos-work": (
      <>
        {/* ── LIGHT · platform logos + the work, concretely ── */}
        <div className="block-light">
          <section className="border-y border-border/60 bg-surface/40 py-10">
            <p
              className="container-page mb-6 text-xs uppercase tracking-[0.28em] text-muted-foreground"
              data-reveal
            >
              Fluent in your stack
            </p>
            <LogoMarquee
              items={[
                "Shopify",
                "Shopify Hydrogen",
                "Stripe",
                "BigCommerce",
                "Klaviyo",
                "Meta Ads",
                "Google Shopping",
                "Recharge",
              ]}
            />
          </section>

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
    benefits: (
      <>
        {/* ── TINT · soft emerald band for process + benefits ── */}
        <div className="block-tint">
          <ProcessSteps
            variant="rail"
            eyebrow="How it runs"
            title="Four moves to a store that sells."
            steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
          />

          <BenefitList
            variant="grid"
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
        <FAQAccordion variant="wide" faqs={page.faqs} />
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
    <SiteShell theme={pageThemes["solutions/ecommerce"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
