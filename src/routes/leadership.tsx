import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { FeatureGrid, CTABand } from "@/components/sections";
import { Award, Handshake, Lightbulb, Eye } from "lucide-react";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Northline Studio" },
      { name: "description", content: "Meet the senior team leading Northline's engineering, design, and strategy." },
      { property: "og:title", content: "Leadership — Northline Studio" },
      { property: "og:description", content: "Deep expertise in software engineering, product design, and business strategy." },
    ],
  }),
  component: Page,
});

const leaders = [
  { name: "Elena Marsh", role: "CEO & Co-founder", bio: "Two decades building and scaling product organisations.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=70" },
  { name: "James Okoro", role: "CTO & Co-founder", bio: "Cloud-native architecture and platform engineering.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=70" },
  { name: "Sofia Alvarez", role: "VP of Design", bio: "Design systems and conversion-focused product design.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=70" },
  { name: "Daniel Wu", role: "VP of Engineering", bio: "Agile delivery, DevOps, and quality at scale.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=70" },
];

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Leadership"
        title="The senior team behind the work"
        subtitle="Deep expertise across engineering, design, and business strategy."
      />

      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l) => (
            <div key={l.name} className="group lift rounded-2xl overflow-hidden gradient-card" data-reveal-child>
              <div className="aspect-[4/5] overflow-hidden">
                <img src={l.img} alt={l.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{l.name}</h3>
                <p className="text-sm text-lime">{l.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{l.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeatureGrid
        eyebrow="Our values"
        title="The principles we lead by."
        items={[
          { icon: Award, title: "Technical Excellence", desc: "Craft is non-negotiable, on every project." },
          { icon: Handshake, title: "Client Partnership", desc: "Your outcomes are our scorecard." },
          { icon: Lightbulb, title: "Continuous Innovation", desc: "We stay curious and keep learning." },
          { icon: Eye, title: "Radical Transparency", desc: "Honest budgets, timelines, and trade-offs." },
        ]}
      />
      <CTABand title="Talk to a technical leader." primary={{ label: "Book a Call", to: "/contact" }} secondary={{ label: "Explore Careers", to: "/careers" }} />
    </SiteShell>
  );
}
