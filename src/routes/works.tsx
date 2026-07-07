import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Works — Northline Studio" },
      { name: "description", content: "Selected case studies from the last 24 months." },
      { property: "og:title", content: "Works — Northline Studio" },
      { property: "og:description", content: "Selected case studies from the last 24 months." },
    ],
  }),
  component: WorksPage,
});

const cases = [
  { name: "Northwind", industry: "SaaS · Rebrand", result: "+184% signups in 90 days", year: "2025" },
  { name: "Halcyon Health", industry: "Health · Mobile App", result: "4.9★ App Store rating", year: "2025" },
  { name: "Meridian Retail", industry: "Ecommerce · Headless", result: "3.1× revenue year over year", year: "2024" },
  { name: "Orbital Cloud", industry: "DevTools · Marketing site", result: "Lighthouse 72 → 98", year: "2024" },
  { name: "Cascade Finance", industry: "Fintech · Web App", result: "40% support ticket reduction", year: "2024" },
  { name: "Ridgeline Studios", industry: "Media · CMS platform", result: "6× publishing throughput", year: "2023" },
];

function WorksPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Works"
        title={<>Case studies from the last <em className="italic text-gradient">24 months</em>.</>}
        subtitle="Selected work with measurable outcomes. We publish fewer, better case studies."
      />

      <section className="container-page py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {cases.map((c, i) => (
            <a
              key={c.name}
              href="#"
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface/40"
            >
              <div
                className="absolute inset-0 grain-bg"
                style={{
                  background:
                    i % 3 === 0
                      ? "linear-gradient(135deg, oklch(0.3 0.08 265), oklch(0.16 0.03 265))"
                      : i % 3 === 1
                      ? "linear-gradient(135deg, oklch(0.25 0.05 265), oklch(0.15 0.028 265))"
                      : "linear-gradient(135deg, oklch(0.22 0.06 250), oklch(0.15 0.03 265))",
                }}
              />
              <div className="relative flex h-full flex-col justify-between p-10">
                <div className="flex items-start justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold/90">{c.industry}</span>
                  <span className="text-xs text-muted-foreground">{c.year}</span>
                </div>
                <div>
                  <h3 className="font-display text-5xl md:text-6xl">{c.name}</h3>
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-sm text-foreground/85">{c.result}</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
