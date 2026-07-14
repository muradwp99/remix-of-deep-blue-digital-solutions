import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getLearningCategory, type LearningItem } from "@/lib/learning";
import { pageThemes } from "@/lib/themes";
import { cmsFind } from "@/lib/cms";
import { cmsToLearningItems, type CmsLearning } from "@/lib/cms-catalog";

const cat = getLearningCategory("templates")!;

export const Route = createFileRoute("/learning_/templates")({
  loader: async (): Promise<{ items: LearningItem[] }> => {
    const docs = await cmsFind<CmsLearning>("learning", {
      where: { type: { equals: "template" } },
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

/* Light paper-sheet preview — a blank working document */
function PaperSheet({ kind }: { kind: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-card shadow-elegant">
      <div className="h-1.5 w-full bg-gold/70" />
      <div className="space-y-2.5 p-6">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-1/2 rounded bg-foreground/15" />
          <span className="rounded bg-black/[0.05] px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            {kind}
          </span>
        </div>
        {[100, 84, 92, 60].map((w, i) => (
          <div key={i} className="h-2 rounded bg-foreground/10" style={{ width: `${w}%` }} />
        ))}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-9 rounded bg-black/[0.04]" />
          <div className="h-9 rounded bg-black/[0.04]" />
          <div className="h-9 rounded bg-gold/15" />
        </div>
      </div>
    </div>
  );
}

function Page() {
  const { items } = Route.useLoaderData();
  return (
    <SiteShell theme={pageThemes["learning/templates"]}>
      {/* Hero — light, left-aligned with a rule */}
      <section className="block-light">
        <div className="container-page py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {cat.eyebrow}
          </p>
          <h1
            className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            Start from our <span className="text-gold">paper</span>.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {cat.subtitle}
          </p>
        </div>
      </section>

      {/* Gallery of paper sheets */}
      <section className="block-light">
        <div className="container-page border-t border-border py-20">
          <div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            data-cards
            data-cards-stagger="0.08"
          >
            {items.map((item) => (
              <div key={item.title} className="group flex flex-col lift" data-card>
                <PaperSheet kind={item.meta} />
                <h3 className="mt-5 font-display text-xl font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{item.desc}</p>
                <Link
                  to="/contact"
                  className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
                >
                  {cat.itemCta}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note — pale tint strip */}
      <section className="block-tint">
        <div className="container-page py-14">
          <p className="max-w-3xl text-lg font-medium leading-relaxed" data-reveal>
            {cat.note}
          </p>
        </div>
      </section>

      <BannerCTA
        message={["Free material from us,", "zero spam ever."]}
        title={
          <>
            Skip the blank-page <span className="text-gold">hour</span>.
          </>
        }
        cta={{ label: "Request a Template", to: "/contact" }}
      />
    </SiteShell>
  );
}
