import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { ShoppingBag, Boxes, Megaphone, Sparkles } from "lucide-react";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Northline Studio" },
      { name: "description", content: "Ecommerce, SaaS, digital marketing and full brand consultancy — outcomes we deliver." },
      { property: "og:title", content: "Solutions — Northline Studio" },
      { property: "og:description", content: "Ecommerce, SaaS, digital marketing and full brand consultancy." },
    ],
  }),
  component: SolutionsPage,
});

const solutions = [
  {
    icon: ShoppingBag,
    tag: "Commerce",
    title: "Ecommerce",
    desc: "Shopify Plus, headless storefronts, marketplaces and subscriptions.",
    subs: ["Shopify & Shopify Plus", "Headless Storefronts", "Marketplaces", "Subscriptions & Billing", "Post-purchase Experience", "Merchandising & PDPs"],
  },
  {
    icon: Boxes,
    tag: "Product",
    title: "SaaS",
    desc: "From MVP to scale. Auth, billing, dashboards, integrations.",
    subs: ["MVP Sprint (6 weeks)", "Multi-tenant Platforms", "Admin & Ops Dashboards", "Billing (Stripe / Paddle)", "AI-powered Features", "Public API Platforms"],
  },
  {
    icon: Megaphone,
    tag: "Growth",
    title: "Digital Marketing",
    desc: "Paid, organic and lifecycle marketing that compounds.",
    subs: ["SEO & Content", "Paid Media (Google, Meta)", "Lifecycle & Email", "Landing Page Systems", "Analytics & Attribution", "CRO Programs"],
  },
  {
    icon: Sparkles,
    tag: "Brand",
    title: "Full Brand Consultancy",
    desc: "Positioning, narrative, identity and go-to-market as one system.",
    subs: ["Brand Strategy", "Positioning & Narrative", "Visual Identity", "Verbal Identity & Voice", "Launch Campaigns", "Brand Guidelines"],
  },
];

function SolutionsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Solutions"
        title={<>Outcomes, not just <em className="italic text-gradient">deliverables</em>.</>}
        subtitle="Packaged programs designed to move a specific business number — revenue, retention, brand equity, or speed to market."
      />

      <section className="container-page py-24 grid gap-6 md:grid-cols-2">
        {solutions.map((s) => (
          <div key={s.title} className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 p-10">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-background border border-border">
              <s.icon className="h-6 w-6 text-gold" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-gold">{s.tag}</p>
            <h2 className="mt-2 font-display text-4xl">{s.title}</h2>
            <p className="mt-3 text-muted-foreground">{s.desc}</p>
            <ul className="mt-8 grid grid-cols-2 gap-2 text-sm">
              {s.subs.map((sub) => (
                <li key={sub} className="text-foreground/85 border-t border-border/60 py-2.5">
                  {sub}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
