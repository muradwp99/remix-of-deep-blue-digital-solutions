import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { FeatureGrid, StatsRow } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { getIndustry, industries } from "@/lib/industries";
import { caseStudies } from "@/lib/case-studies";
import { pageThemes } from "@/lib/themes";

export const Route = createFileRoute("/industries_/$slug")({
  head: ({ params }) => {
    const ind = getIndustry(params.slug);
    const title = ind?.metaTitle ?? "Industries — Auxtech";
    const description = ind?.metaDesc ?? "Industries Auxtech builds for.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const ind = getIndustry(slug);

  if (!ind) {
    return (
      <SiteShell>
        <section className="container-page py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-lime">404</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] font-semibold">
            That industry page doesn't exist.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Our shipped work across every sector lives on the works page.
          </p>
          <Link
            to="/works"
            data-magnetic
            className="group mt-10 inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to all works
          </Link>
        </section>
      </SiteShell>
    );
  }

  const studies = caseStudies.filter((c) => ind.matches.includes(c.industry));
  const others = industries.filter((i) => i.slug !== ind.slug);

  return (
    <SiteShell theme={pageThemes[`industries/${ind.slug}`]}>
      <PageHeader
        eyebrow={ind.eyebrow}
        image={ind.image}
        title={
          <>
            {ind.title} <em className="font-playfair font-medium text-gold">{ind.titleEm}</em>
          </>
        }
        subtitle={ind.subtitle}
      />

      <FeatureGrid
        variant="spotlight"
        eyebrow="What it takes here"
        title="The domain, taken seriously."
        cols={3}
        items={ind.points}
      />

      {studies.length > 0 && (
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Proof in this sector
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-reveal-child
            >
              Shipped {ind.nav.toLowerCase()} work.
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
                  <div className="absolute inset-0 bg-background/45" />
                </div>
                <div className="p-7">
                  <p className="text-xs uppercase tracking-[0.28em] text-lime">
                    {c.tag} · {c.year}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  <span className="link-underline mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
                    Read the case study
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <StatsRow
        stats={ind.stats
          .concat({ value: "2014", label: "Shipping in regulated rooms since" })
          .slice(0, 4)}
      />

      <BannerCTA
        message={ind.banner.message}
        title={
          <>
            {ind.banner.title}{" "}
            <em className="font-playfair font-medium text-gold">{ind.banner.titleEm}</em>.
          </>
        }
        cta={{ label: ind.banner.label, to: "/contact" }}
      />

      <section className="container-page pb-24" data-reveal-group>
        <p className="mb-6 text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
          Other industries
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((i) => (
            <Link
              key={i.slug}
              to="/industries/$slug"
              params={{ slug: i.slug }}
              className="group glass lift rounded-2xl p-6"
              data-reveal-child
            >
              <h3 className="font-display text-lg font-semibold">{i.nav}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{i.subtitle}</p>
              <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
                Explore
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
