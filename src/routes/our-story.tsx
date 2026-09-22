import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { StatsRow, Testimonials, CTABand } from "@/components/sections";
import {
  cmsFindOne,
  pageRows,
  pageStr,
  type SitePageDoc,
} from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

export const Route = createFileRoute("/our-story")({
  // LivePress: editable via the `our-story` Site Page doc, fail-soft to copy below.
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "our-story");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "Our Story — Auxtech");
    const description = pageStr(
      d,
      "meta_description",
      "How Auxtech grew from a two-person studio into a trusted digital transformation partner.",
    );
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

const timelineFallback = [
  { year: "2014", t: "Founded", d: "Two engineers set out to build software worth being proud of." },
  { year: "2016", t: "First enterprise client", d: "Delivered a mission-critical platform, ahead of schedule." },
  { year: "2019", t: "Design + engineering merge", d: "One senior team, from strategy to ship." },
  { year: "2021", t: "SaaS practice launched", d: "Helping founders go from idea to funded product." },
  { year: "2024", t: "Still one team", d: "Senior-only and remote-first, deliberately flat." },
];

const statsFallback = [
  { value: "200+", label: "Projects shipped" },
  { value: "98%", label: "Client retention" },
  { value: "84%", label: "Continue on a Care plan" },
  { value: "98", label: "Median Lighthouse score" },
];

const quotesFallback = [
  { q: "A genuine partner — they care about our business as much as we do.", a: "Emily Carter", r: "CTO, Northwind" },
  { q: "Ten years in and they still ship like a hungry startup.", a: "Marcus Chen", r: "Founder, Halcyon" },
  { q: "The most reliable team we've ever worked with.", a: "Priya Shah", r: "VP Product, Meridian" },
];

function Page() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);

  const timeline = pageRows(d, "timeline", timelineFallback);
  const stats = pageRows(d, "stats", statsFallback);
  const quotes = pageRows(d, "quotes", quotesFallback);

  return (
    <SiteShell theme={pageThemes["our-story"]}>
      {/* ---- Hero (light editorial, asymmetric) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Our Story")}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {s("hero_title", "Built to bridge engineering and")}{" "}
              <span className="text-gold">{s("hero_title_em", "growth")}</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {s(
                "hero_subtitle",
                "We started Auxtech in 2014 to prove that craft, speed, and business outcomes aren't a trade-off.",
              )}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-gold/30" aria-hidden />
            <img
              src={s(
                "hero_img",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=75",
              )}
              alt="The Auxtech studio over the years"
              className="aspect-[4/5] w-full rounded-[2rem] border border-black/10 object-cover shadow-elegant transition-transform duration-700 hover:scale-[1.015]"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      {/* ---- The journey (light timeline) ---- */}
      <section className="block-light">
        <div className="container-page border-t border-border py-28" data-reveal-group>
          <div className="mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              {s("journey_eyebrow", "The journey")}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              {s("journey_heading", "A decade, drawn as one line.")}
            </h2>
          </div>
          <div className="relative">
            <div className="timeline-line hidden md:block" data-timeline-line />
            <div className="grid gap-10 md:grid-cols-5">
              {timeline.map((item) => (
                <div key={item.year} data-reveal-child>
                  <div className="timeline-dot hidden md:block" />
                  <p className="font-display text-4xl font-semibold text-gold md:mt-5" data-counter>
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold">{item.t}</h3>
                  <p className="mt-2 max-w-[30ch] text-sm text-muted-foreground">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Position statement (bold champagne moment) ---- */}
      <section className="block-bold">
        <div className="container-page grid items-start gap-16 py-24 md:grid-cols-2 md:py-28">
          <h2 className="font-display text-4xl font-semibold leading-[1.02] md:text-6xl" data-slide="left">
            {s("position_heading", "Still small, on purpose.")}
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground" data-slide="right">
            <p>
              {s(
                "position_p1",
                "Growth was never the goal — the work was. Every seat at Auxtech is senior: no juniors, no handoffs, no account managers translating between you and the people building your product.",
              )}
            </p>
            <p>
              {s(
                "position_p2",
                "That's why the numbers hold. 84% of clients continue with us on a Care plan after launch, and client retention has stayed at 98% for years. First demo on day 7, a shippable slice by day 14 — same promise since 2014.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ---- Stats (tint band) ---- */}
      <div className="block-tint">
        <StatsRow stats={stats} />
      </div>

      {/* ---- Testimonials (light) ---- */}
      <div className="block-light">
        <Testimonials items={quotes} />
      </div>

      {/* ---- CTA (dark bookend) ---- */}
      <CTABand
        eyebrow={s("cta_eyebrow", "Next chapter")}
        title={s("cta_title", "Join the journey.")}
        subtitle={s("cta_subtitle", "Build the next milestone with us — as a client, or from the inside.")}
        primary={{ label: s("cta_primary_label", "Explore Careers"), to: "/careers" }}
        secondary={{ label: s("cta_secondary_label", "Book a Call"), to: "/contact" }}
      />
    </SiteShell>
  );
}
