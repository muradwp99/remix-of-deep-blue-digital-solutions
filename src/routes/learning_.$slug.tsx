import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { learningCategories, getLearningCategory } from "@/lib/learning";
import { pageThemes } from "@/lib/themes";

export const Route = createFileRoute("/learning_/$slug")({
  head: ({ params }) => {
    const cat = getLearningCategory(params.slug);
    const title = cat?.metaTitle ?? "Learning — Northline Studio";
    const description = cat?.metaDesc ?? "Learning material from the Northline team.";
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
  const cat = getLearningCategory(slug);

  if (!cat) {
    return (
      <SiteShell>
        <section className="block-light">
          <div className="container-page py-36">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
              That learning page doesn't exist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Everything we publish lives on the resources page.
            </p>
            <Link
              to="/resources"
              data-magnetic
              className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to resources
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  const others = learningCategories.filter((c) => c.slug !== cat.slug);

  return (
    <SiteShell theme={pageThemes[`learning/${cat.slug}`]}>
      {/* Hero — light, text over a cinematic band */}
      <section className="block-light">
        <div className="container-page py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {cat.eyebrow}
          </p>
          <h1
            className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            {cat.title} <span className="text-gold">{cat.titleEm}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {cat.subtitle}
          </p>
          <figure className="mt-14 overflow-hidden rounded-3xl border border-black/10" data-reveal>
            <img
              src={cat.image}
              alt=""
              className="aspect-[21/9] w-full object-cover"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      {/* Catalogue — numbered editorial index */}
      <section className="block-light">
        <div className="container-page border-t border-border py-20">
          <div className="grid gap-x-12 md:grid-cols-2" data-cards data-cards-stagger="0.08">
            {cat.items.map((item, i) => (
              <div
                key={item.title}
                className="group flex gap-5 border-t border-border py-7"
                data-card
              >
                <span className="font-display text-xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <Link
                    to="/contact"
                    className="link-underline mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
                  >
                    {cat.itemCta}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-muted-foreground" data-reveal>
            {cat.note}
          </p>
        </div>
      </section>

      <BannerCTA
        message={["Free material from us,", "zero spam ever."]}
        title={
          <>
            Learn from our <span className="text-gold">mistakes</span> — they're paid for.
          </>
        }
        cta={{ label: "Ask for Anything Here", to: "/contact" }}
      />

      {/* More learning — cross-links */}
      <section className="block-light">
        <div className="container-page border-t border-border pb-24 pt-20" data-reveal-group>
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
            More learning
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/learning/$slug"
                params={{ slug: c.slug }}
                className="group glass lift rounded-2xl p-6"
                data-reveal-child
              >
                <h3 className="font-display text-lg font-semibold">{c.nav}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.subtitle}</p>
                <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Explore
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
