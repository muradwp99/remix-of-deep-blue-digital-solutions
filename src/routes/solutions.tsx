import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { CTABand } from "@/components/sections";
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
    metrics: [
      { v: "+42%", l: "avg. conversion lift" },
      { v: "1.9s", l: "median LCP shipped" },
    ],
    subs: ["Shopify & Shopify Plus", "Headless Storefronts", "Marketplaces", "Subscriptions & Billing", "Post-purchase Experience", "Merchandising & PDPs"],
  },
  {
    icon: Boxes,
    tag: "Product",
    title: "SaaS",
    desc: "From MVP to scale. Auth, billing, dashboards, integrations.",
    metrics: [
      { v: "6", l: "weeks, idea to MVP" },
      { v: "$40M+", l: "raised by client products" },
    ],
    subs: ["MVP Sprint (6 weeks)", "Multi-tenant Platforms", "Admin & Ops Dashboards", "Billing (Stripe / Paddle)", "AI-powered Features", "Public API Platforms"],
  },
  {
    icon: Megaphone,
    tag: "Growth",
    title: "Digital Marketing",
    desc: "Paid, organic and lifecycle marketing that compounds.",
    metrics: [
      { v: "3.2×", l: "blended ROAS" },
      { v: "+180%", l: "organic traffic YoY" },
    ],
    subs: ["SEO & Content", "Paid Media (Google, Meta)", "Lifecycle & Email", "Landing Page Systems", "Analytics & Attribution", "CRO Programs"],
  },
  {
    icon: Sparkles,
    tag: "Brand",
    title: "Full Brand Consultancy",
    desc: "Positioning, narrative, identity and go-to-market as one system.",
    metrics: [
      { v: "40+", l: "brands repositioned" },
      { v: "98%", l: "client retention" },
    ],
    subs: ["Brand Strategy", "Positioning & Narrative", "Visual Identity", "Verbal Identity & Voice", "Launch Campaigns", "Brand Guidelines"],
  },
];

const industries = [
  { label: "Fintech", accent: "lime" },
  { label: "Healthcare" },
  { label: "Retail & DTC", accent: "gold" },
  { label: "B2B SaaS", accent: "lime" },
  { label: "Logistics" },
  { label: "Education" },
  { label: "Real Estate", accent: "gold" },
  { label: "Media & Publishing" },
  { label: "Hospitality" },
  { label: "Climate & Energy", accent: "lime" },
  { label: "Marketplaces" },
  { label: "Professional Services" },
];

function SolutionsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Solutions"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=70"
        title={<>Outcomes, not just <em className="font-playfair font-medium text-gold">deliverables</em>.</>}
        subtitle="Packaged programs designed to move a specific business number — revenue, retention, brand equity, or speed to market."
      />

      {/* Solution programs */}
      <section className="container-page py-24 grid gap-6 md:grid-cols-2" data-cards data-cards-stagger="0.12">
        {solutions.map((s) => (
          <div key={s.title} className="relative overflow-hidden rounded-3xl glare-card gradient-card lift p-10" data-card>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-background border border-border">
              <s.icon className="h-6 w-6 text-gold" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-gold">{s.tag}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">{s.title}</h2>
            <p className="mt-3 text-muted-foreground">{s.desc}</p>
            <div className="mt-8 flex gap-10 border-t border-white/10 pt-6">
              {s.metrics.map((m) => (
                <div key={m.l}>
                  <div className="font-display text-3xl font-semibold text-gradient-lime" data-counter>
                    {m.v}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
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

      {/* Industries */}
      <section className="border-t border-border/60 overflow-hidden">
        <div className="container-page py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
              Fluent in your domain.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal>
              Twelve years, 200+ projects. Chances are we've already shipped in your
              industry — and know where the bodies are buried.
            </p>
          </div>
          <div className="mt-14 flex flex-wrap gap-3 max-w-4xl" data-scatter>
            {industries.map((i) => (
              <span
                key={i.label}
                data-scatter-item
                className={`rounded-full px-5 py-2.5 text-sm font-medium glass ${
                  i.accent === "lime"
                    ? "border border-lime/30 text-lime"
                    : i.accent === "gold"
                      ? "border border-gold/30 text-gold"
                      : "text-foreground/85"
                }`}
              >
                {i.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Pick a number"
        title="Which metric do you need to move?"
        subtitle="Tell us the business number that matters this quarter. We'll reply within one business day with the program, the timeline, and a fair budget."
        primary={{ label: "Start a Project", to: "/contact" }}
        secondary={{ label: "See Pricing", to: "/pricing" }}
      />
    </SiteShell>
  );
}
