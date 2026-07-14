import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MonitorPlay, Radio } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getLearningCategory, type LearningItem } from "@/lib/learning";
import { pageThemes } from "@/lib/themes";
import { cmsFind } from "@/lib/cms";
import { cmsToLearningItems, type CmsLearning } from "@/lib/cms-catalog";

const cat = getLearningCategory("webinars")!;

export const Route = createFileRoute("/learning_/webinars")({
  loader: async (): Promise<{ items: LearningItem[] }> => {
    const docs = await cmsFind<CmsLearning>("learning", {
      where: { type: { equals: "webinar" } },
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
    <SiteShell theme={pageThemes["learning/webinars"]}>
      {/* Hero — light, centered */}
      <section className="block-light">
        <div className="container-page py-24 text-center md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {cat.eyebrow}
          </p>
          <h1
            className="mx-auto mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            Live, unrehearsed, <span className="text-gold">on the record</span>.
          </h1>
          <p
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-reveal
          >
            {cat.subtitle}
          </p>
        </div>
      </section>

      {/* Program schedule — broadcast listing rows */}
      <section className="block-light">
        <div className="container-page border-t border-border py-20" data-reveal-group>
          <div className="space-y-4">
            {items.map((item) => {
              const live = item.meta.includes("monthly");
              return (
                <div
                  key={item.title}
                  className="glare-card gradient-card lift grid gap-5 rounded-3xl p-7 md:grid-cols-[110px_1fr_auto] md:items-center"
                  data-reveal-child
                >
                  <div className="flex md:justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                        live
                          ? "bg-gold text-gold-foreground"
                          : "border border-border bg-black/[0.04] text-muted-foreground"
                      }`}
                    >
                      {live ? <Radio className="h-3 w-3" /> : <MonitorPlay className="h-3 w-3" />}
                      {live ? "Live" : "Replay"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground/70">{item.meta}</p>
                  </div>
                  <Link
                    to="/contact"
                    data-magnetic
                    className="group inline-flex items-center gap-2 self-start rounded-full btn-gold shine px-5 py-2.5 text-sm font-semibold md:self-center"
                  >
                    {live ? "Save a Seat" : cat.itemCta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Note — pale tint strip */}
      <section className="block-tint">
        <div className="container-page py-14 text-center">
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed" data-reveal>
            {cat.note}
          </p>
        </div>
      </section>

      <BannerCTA
        message={["Real sites, torn down live,", "your questions answered."]}
        title={
          <>
            Bring your homepage. Leave with a <span className="text-gold">plan</span>.
          </>
        }
        cta={{ label: "Get the Next Dates", to: "/contact" }}
      />
    </SiteShell>
  );
}
