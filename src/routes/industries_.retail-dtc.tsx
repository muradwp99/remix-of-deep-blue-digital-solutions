import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { StatsRow } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { HorizontalPin } from "@/components/signature/horizontal-strip";
import { getIndustry } from "@/lib/industries";
import { caseStudies } from "@/lib/case-studies";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToIndustryDTO, hydrateIndustry, type IndustryDTO, type CmsIndustry } from "@/lib/cms-catalog";

const SLUG = "retail-dtc";

export const Route = createFileRoute("/industries_/retail-dtc")({
  loader: async (): Promise<{ dto: IndustryDTO | null; doc: CmsIndustry | null }> => {
    const doc = await cmsFindOne<CmsIndustry>("industries", SLUG, { depth: 1 });
    return { dto: doc ? cmsToIndustryDTO(doc) : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Retail & DTC — Northline Studio" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Retail & DTC — Northline Studio" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const MASONRY = [
  { img: u("photo-1441986300917-64674bd600d8"), h: "h-64" },
  { img: u("photo-1556742049-0cfed4f6a45d"), h: "h-44" },
  { img: u("photo-1523275335684-37898b6baf30"), h: "h-52" },
  { img: u("photo-1542291026-7eec264c27ff"), h: "h-64" },
  { img: u("photo-1505740420928-5e560c06d30e"), h: "h-44" },
  { img: u("photo-1556740738-b6a63e27c4df"), h: "h-52" },
];

const JOURNEY = [
  { t: "The scroll-stop", d: "A product page that loads before the thumb lifts — 0.9s median." },
  { t: "The consideration", d: "Reviews, UGC, and sizing answers exactly where doubt happens." },
  { t: "The cart", d: "One-tap add, persistent across devices, no login ambush." },
  { t: "The checkout", d: "Two steps, wallets first, address autocomplete — done in 40 seconds." },
  { t: "The unboxing email", d: "Post-purchase flows that turn one order into a subscription." },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToIndustryDTO(liveDoc) : dto;
  const ind = liveDto ? hydrateIndustry(liveDto, getIndustry(SLUG)!) : getIndustry(SLUG)!;
  const studies = caseStudies.filter((c) => ind.matches.includes(c.industry));
  return (
    <SiteShell theme={pageThemes["industries/retail-dtc"]}>
      {/* ── BOLD · brand-wall hero on saturated color ── */}
      <section className="block-bold">
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {ind.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Where brand meets buy
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {ind.subtitle}
            </p>
            <div className="mt-9" data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
              >
                {ind.banner.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
          <div className="columns-2 gap-4 [&>*]:mb-4" data-cards data-cards-stagger="0.1">
            {MASONRY.map((m, i) => (
              <div
                key={i}
                data-card
                className={`${m.h} overflow-hidden rounded-2xl border border-black/10`}
              >
                <img src={m.img} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHT · the domain — big-number editorial index ── */}
      <div className="block-light">
        <section className="container-page py-24 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              What it takes here
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal
            >
              The domain, taken seriously.
            </h2>
          </div>
          <div className="mt-14" data-reveal-group>
            {ind.points.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  data-reveal-child
                  className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-black/10 py-8 last:border-b md:gap-12"
                >
                  <span className="font-display text-4xl font-semibold tabular-nums text-gold/30 md:text-6xl">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gold" />
                      <h3 className="font-display text-xl font-semibold md:text-2xl">{p.title}</h3>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── BOLD · the purchase journey, unrolled sideways ── */}
      <div className="block-bold">
        <HorizontalPin eyebrow="Sideways through a sale" title="Five moments decide every order.">
          {JOURNEY.map((s, i) => (
            <div
              key={s.t}
              className="glare-card gradient-card w-[75vw] max-w-sm shrink-0 rounded-3xl p-8"
            >
              <span className="font-display text-4xl font-semibold text-gradient-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold">{s.t}</h3>
              <p className="mt-3 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </HorizontalPin>
      </div>

      {/* ── LIGHT · case studies ── */}
      {studies.length > 0 && (
        <div className="block-light">
          <section className="container-page py-24 md:py-28" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Proof in this sector
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                Shipped retail & DTC work.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2" data-cards>
              {studies.map((c) => (
                <Link
                  key={c.slug}
                  to="/works/$slug"
                  params={{ slug: c.slug }}
                  className="group glare-card gradient-card lift relative overflow-hidden rounded-3xl"
                  data-card
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={c.hero}
                      alt={c.heroAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.28em] text-gold">
                      {c.tag} · {c.year}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── TINT · proof metrics ── */}
      <div className="block-tint">
        <StatsRow stats={[...ind.stats, { value: "2014", label: "Shipping commerce since" }]} />
      </div>

      {/* ── DARK · conversion banner into footer ── */}
      <BannerCTA
        message={ind.banner.message}
        title={
          <>
            {ind.banner.title} <span className="text-gold">{ind.banner.titleEm}</span>.
          </>
        }
        cta={{ label: ind.banner.label, to: "/contact" }}
      />
    </SiteShell>
  );
}
