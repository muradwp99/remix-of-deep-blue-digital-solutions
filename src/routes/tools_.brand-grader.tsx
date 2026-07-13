import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { BrandGrader } from "@/components/tool-widgets";
import { getTool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";

const tool = getTool("brand-grader")!;

export const Route = createFileRoute("/tools_/brand-grader")({
  head: () => ({
    meta: [
      { title: tool.metaTitle },
      { name: "description", content: tool.metaDesc },
      { property: "og:title", content: tool.metaTitle },
      { property: "og:description", content: tool.metaDesc },
    ],
  }),
  component: Page,
});

const GRADES = [
  { g: "A", note: "coherent" },
  { g: "B", note: "drifting" },
  { g: "C", note: "leaking" },
  { g: "D", note: "logos only" },
];

function Page() {
  return (
    <SiteShell theme={pageThemes["tools/brand-grader"]}>
      {/* BOLD · vivid magenta hero, grade tiles scatter in */}
      <section className="block-bold" data-scatter>
        <div className="container-page grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
              {tool.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              How coherent is your brand?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {tool.subtitle}
            </p>
            <div className="mt-9" data-reveal>
              <a
                href="#grader"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Grade my brand
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {GRADES.map((t, i) => (
              <div
                key={t.g}
                data-scatter-item
                className={`rounded-2xl p-6 text-center ${i === 0 ? "gradient-card-gold" : "glass opacity-75"}`}
              >
                <p
                  className={`font-display text-6xl font-semibold ${i === 0 ? "text-gradient-lime" : "text-foreground/60"}`}
                >
                  {t.g}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHT · the eight-question grader on a clean, legible surface */}
      <div id="grader" className="block-light scroll-mt-24">
        <BrandGrader />
      </div>

      <BannerCTA
        message={["An honest score from us,", "no email required."]}
        title={
          <>
            Scored below an A? We fix <span className="text-gold">that</span>.
          </>
        }
        cta={{ label: "Fix the Gaps", to: "/contact" }}
      />
    </SiteShell>
  );
}
