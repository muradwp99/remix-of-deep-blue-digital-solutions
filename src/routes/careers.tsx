import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { FeatureGrid, StatsRow, CTABand } from "@/components/sections";
import { Globe, DollarSign, GraduationCap, HeartPulse, Laptop, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Northline Studio" },
      { name: "description", content: "Build the future with a remote-first team working on cutting-edge enterprise projects." },
      { property: "og:title", content: "Careers — Northline Studio" },
      { property: "og:description", content: "Remote-first culture, real ownership, and zero bureaucracy." },
    ],
  }),
  component: Page,
});

const jobs = [
  { role: "Senior Full-Stack Engineer", dept: "Engineering", loc: "Remote" },
  { role: "Product Designer", dept: "Design", loc: "Remote" },
  { role: "Mobile Engineer (React Native)", dept: "Engineering", loc: "Remote" },
  { role: "Engineering Manager", dept: "Engineering", loc: "Remote / EU" },
  { role: "Growth Marketer", dept: "Marketing", loc: "Remote" },
];

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Careers"
        title="Build the future with us"
        subtitle="A remote-first team solving complex problems on cutting-edge enterprise projects — without the red tape."
      />
      <FeatureGrid
        eyebrow="Benefits"
        title="Why you'll love it here."
        items={[
          { icon: Globe, title: "Remote-First", desc: "Work from anywhere, async by default." },
          { icon: DollarSign, title: "Salary & Equity", desc: "Competitive pay and real ownership." },
          { icon: GraduationCap, title: "L&D Budget", desc: "Grow with a generous learning stipend." },
          { icon: HeartPulse, title: "Health & Wellness", desc: "Comprehensive coverage and time off." },
          { icon: Laptop, title: "Latest Gear", desc: "Top-tier equipment, your choice." },
          { icon: Clock, title: "Flexible Hours", desc: "Own your schedule and your impact." },
        ]}
      />
      <StatsRow
        stats={[
          { value: "50+", label: "Team members" },
          { value: "15+", label: "Countries" },
          { value: "98%", label: "Retention rate" },
          { value: "0%", label: "Bureaucracy" },
        ]}
      />

      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>Open roles</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold" data-reveal-child>We're hiring.</h2>
        </div>
        <div className="mt-12 space-y-3">
          {jobs.map((j) => (
            <div key={j.role} className="glass lift rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4" data-reveal-child>
              <div>
                <h3 className="font-display text-lg font-semibold">{j.role}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                  <span>{j.dept}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.loc}</span>
                </p>
              </div>
              <a href="/contact" className="rounded-full btn-navy shine px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40 transition">
                Apply
              </a>
            </div>
          ))}
        </div>
      </section>

      <CTABand
        title="Don't see the right role?"
        subtitle="We're always looking for great people. Send us a note and tell us what you'd love to build."
        primary={{ label: "Get in Touch", to: "/contact" }}
        secondary={{ label: "About Us", to: "/about" }}
      />
    </SiteShell>
  );
}
