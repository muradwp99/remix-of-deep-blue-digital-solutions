import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { StatsRow, Testimonials, CTABand } from "@/components/sections";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Northline Studio" },
      { name: "description", content: "How Northline grew from a two-person studio into a trusted digital transformation partner." },
      { property: "og:title", content: "Our Story — Northline Studio" },
      { property: "og:description", content: "Bridging engineering excellence with business growth since day one." },
    ],
  }),
  component: Page,
});

const timeline = [
  { year: "2014", t: "Founded", d: "Two engineers set out to build software worth being proud of." },
  { year: "2016", t: "First enterprise client", d: "Delivered a mission-critical platform, ahead of schedule." },
  { year: "2019", t: "Design + engineering merge", d: "One senior team, from strategy to ship." },
  { year: "2021", t: "SaaS practice launched", d: "Helping founders go from idea to funded product." },
  { year: "2024", t: "Global team", d: "50+ people across 15 countries, remote-first." },
];

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Our Story"
        title="Built to bridge engineering and growth"
        subtitle="We started Northline to prove that craft, speed, and business outcomes aren't a trade-off."
      />

      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>The journey</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold" data-reveal-child>Milestones that shaped us.</h2>
        </div>
        <div className="mt-14 space-y-3">
          {timeline.map((item) => (
            <div key={item.year} className="glass lift rounded-2xl p-6 flex gap-6 items-start" data-reveal-child>
              <span className="font-display text-3xl font-semibold text-gradient-lime w-24 shrink-0">{item.year}</span>
              <div>
                <h3 className="font-display text-xl font-semibold">{item.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StatsRow
        stats={[
          { value: "10+", label: "Years in business" },
          { value: "200+", label: "Projects delivered" },
          { value: "50+", label: "Engineers & designers" },
          { value: "98%", label: "Client retention" },
        ]}
      />
      <Testimonials
        items={[
          { q: "A genuine partner — they care about our business as much as we do.", a: "Emily Carter", r: "CTO, Northwind" },
          { q: "Ten years in and they still ship like a hungry startup.", a: "Marcus Chen", r: "Founder, Halcyon" },
          { q: "The most reliable team we've ever worked with.", a: "Priya Shah", r: "VP Product, Meridian" },
        ]}
      />
      <CTABand title="Join the journey." primary={{ label: "Explore Careers", to: "/careers" }} secondary={{ label: "Book a Call", to: "/contact" }} />
    </SiteShell>
  );
}
