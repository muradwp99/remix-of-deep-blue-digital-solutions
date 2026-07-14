import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getLearningCategory, type LearningItem } from "@/lib/learning";
import { pageThemes } from "@/lib/themes";
import { cmsFind } from "@/lib/cms";
import { cmsToLearningItems, type CmsLearning } from "@/lib/cms-catalog";

const cat = getLearningCategory("guides")!;

export const Route = createFileRoute("/learning_/guides")({
  loader: async (): Promise<{ items: LearningItem[] }> => {
    const docs = await cmsFind<CmsLearning>("learning", {
      where: { type: { equals: "guide" } },
      sort: "order",
      depth: 0,
    });
    return { items: docs.length ? cmsToLearningItems(docs) : cat.items };
  },
  head: () => ({
    meta: [
      { title: cat.metaTitle },
      { name: "description", content: cat.metaDesc },
      { property: "og:title", content: cat.metaTitle },
      { property: "og:description", content: cat.metaDesc },
    ],
  }),
  component: Page,
});

function Page() {
  const { items } = Route.useLoaderData();
  return (
    <SiteShell theme={pageThemes["learning/guides"]}>
      {/* Hero — light editorial, asymmetric split with a cover figure */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {cat.eyebrow}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              Playbooks with the <span className="text-gold">scars</span> left in.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
              {cat.subtitle}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src={cat.image}
              alt=""
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur">
              {items.length} guides · free
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Index — numbered table of contents */}
      <section className="block-light">
        <div className="container-page border-t border-border py-20" data-reveal-group>
          <div className="divide-y divide-border">
            {items.map((item, i) => (
              <Link
                key={item.title}
                to="/contact"
                className="group grid gap-3 py-8 transition-colors hover:bg-black/[0.03] md:grid-cols-[90px_1.2fr_1.6fr_120px] md:items-baseline md:gap-6"
                data-reveal-child
              >
                <span className="font-display text-2xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-semibold leading-snug transition-colors group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
                <span className="flex items-center gap-2 text-sm text-muted-foreground md:justify-end">
                  {item.meta}
                  <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to get one — pale tint callout */}
      <section className="block-tint">
        <div className="container-page py-16">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            How to get one
          </p>
          <p className="mt-4 max-w-2xl text-xl font-medium leading-relaxed" data-reveal>
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
        cta={{ label: "Request a Guide", to: "/contact" }}
      />
    </SiteShell>
  );
}
