import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { Wrench, GraduationCap, Newspaper, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Northline Studio" },
      { name: "description", content: "Free tools, learning material and writing from the Northline team." },
      { property: "og:title", content: "Resources — Northline Studio" },
      { property: "og:description", content: "Free tools, learning material and writing from the Northline team." },
    ],
  }),
  component: ResourcesPage,
});

const sections = [
  {
    icon: Wrench,
    tag: "Free Tools",
    title: "Tools we built for you",
    items: [
      { title: "Website Grader", desc: "Score your site in 30 seconds." },
      { title: "SEO Audit Tool", desc: "Technical + content audit report." },
      { title: "Brand Color Generator", desc: "Accessible palettes in one click." },
      { title: "Project Estimator", desc: "Ballpark your build in minutes." },
    ],
  },
  {
    icon: GraduationCap,
    tag: "Learning",
    title: "Courses & guides",
    items: [
      { title: "Design System Course", desc: "8 modules · free" },
      { title: "Ship-Fast Playbook", desc: "How we ship in 6 weeks." },
      { title: "Founder Handbook", desc: "Notes for early-stage teams." },
      { title: "Video Tutorials", desc: "Short-form, hands-on." },
    ],
  },
  {
    icon: Newspaper,
    tag: "Blog & News",
    title: "Writing from the studio",
    items: [
      { title: "Engineering Notes", desc: "Deep-dives from our team." },
      { title: "Design Essays", desc: "Craft, taste, process." },
      { title: "Studio Updates", desc: "What we shipped this month." },
      { title: "Announcements", desc: "New partnerships and hires." },
    ],
  },
];

function ResourcesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Resources"
        title={<>Free tools, learning and <em className="italic text-gradient">writing</em>.</>}
        subtitle="Everything we've built to help teams ship better software — no signup required."
      />

      <section className="container-page py-24 space-y-16">
        {sections.map((s) => (
          <div key={s.tag}>
            <div className="flex items-center gap-3 mb-8">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface">
                <s.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold">{s.tag}</p>
                <h2 className="font-display text-3xl">{s.title}</h2>
              </div>
            </div>
            <div className="grid gap-px bg-border/50 rounded-2xl overflow-hidden md:grid-cols-4">
              {s.items.map((it) => (
                <a key={it.title} href="#" className="group bg-background p-7 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl">{it.title}</h3>
                    <ArrowUpRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{it.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
