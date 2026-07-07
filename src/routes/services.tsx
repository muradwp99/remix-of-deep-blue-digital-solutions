import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Northline Studio" },
      { name: "description", content: "Design, engineering and ongoing services for modern software teams." },
      { property: "og:title", content: "Services — Northline Studio" },
      { property: "og:description", content: "Design, engineering and ongoing services for modern software teams." },
    ],
  }),
  component: ServicesPage,
});

const groups = [
  {
    tag: "Design",
    title: "Design services",
    items: [
      { title: "UI/UX Design", desc: "Product interfaces, user flows, prototypes." },
      { title: "Brand Identity", desc: "Logo systems, guidelines, brand assets." },
      { title: "Design Systems", desc: "Scalable component libraries and tokens." },
      { title: "Motion & Prototyping", desc: "Interactive, animated concept work." },
    ],
  },
  {
    tag: "Development",
    title: "Engineering services",
    items: [
      { title: "Website Development", desc: "Marketing and corporate websites, custom-built." },
      { title: "CMS Based Websites", desc: "Sanity, Webflow, WordPress, Contentful." },
      { title: "Web Applications", desc: "Dashboards, portals, custom SaaS tools." },
      { title: "Mobile App Development", desc: "iOS, Android, React Native, Flutter." },
      { title: "API & Backend", desc: "Node, Go, Postgres, edge-first architectures." },
      { title: "AI Integrations", desc: "LLM features, RAG, agent workflows." },
    ],
  },
  {
    tag: "Ongoing",
    title: "Monthly Care & Growth",
    items: [
      { title: "Monthly Care Plans", desc: "Maintenance, uptime, updates, small improvements." },
      { title: "Performance & SEO", desc: "Core Web Vitals, technical SEO, schema." },
      { title: "Security & Compliance", desc: "Audits, hardening, SOC2 readiness." },
      { title: "Analytics & CRO", desc: "Measurement, experimentation, iteration." },
    ],
  },
];

function ServicesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Services"
        title={<>Every capability you need to <em className="italic text-gradient">ship</em> and scale.</>}
        subtitle="From first sketch to long-term partnership — design, engineering and growth under one roof."
      />
      <section className="container-page py-24 space-y-24">
        {groups.map((g) => (
          <div key={g.tag} className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">{g.tag}</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">{g.title}</h2>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden">
              {g.items.map((s) => (
                <div key={s.title} className="group bg-background p-7 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-2xl">{s.title}</h3>
                    <ArrowUpRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
