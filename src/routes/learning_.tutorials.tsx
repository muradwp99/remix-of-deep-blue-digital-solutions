import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { getLearningCategory } from "@/lib/learning";
import { pageThemes } from "@/lib/themes";

const cat = getLearningCategory("tutorials")!;

export const Route = createFileRoute("/learning_/tutorials")({
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
  return (
    <SiteShell theme={pageThemes["learning/tutorials"]}>
      {/* Hero — light, wide single column */}
      <section className="block-light">
        <div className="container-page max-w-4xl py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {cat.eyebrow}
          </p>
          <h1
            className="mt-6 font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            Step-by-step, <span className="text-gold">no steps skipped</span>.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {cat.subtitle}
          </p>
        </div>
      </section>

      {/* Tutorial cards on a pale tint band */}
      <section className="block-tint">
        <div className="container-page py-20">
          <div className="grid gap-5 md:grid-cols-2" data-cards data-cards-stagger="0.08">
            {cat.items.map((item, i) => (
              <div
                key={item.title}
                className="glare-card gradient-card lift flex gap-6 rounded-3xl p-7"
                data-card
              >
                <span className="font-display text-4xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <span className="shrink-0 rounded-full glass px-3 py-1 text-[11px] font-medium text-muted-foreground">
                      {item.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <Link
                    to="/contact"
                    className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
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
            The same checklists we run on <span className="text-gold">client work</span>.
          </>
        }
        cta={{ label: "Request a Tutorial", to: "/contact" }}
      />
    </SiteShell>
  );
}
