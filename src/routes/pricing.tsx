import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Northline Studio" },
      { name: "description", content: "Transparent pricing for websites, apps, ecommerce, SaaS and monthly care." },
      { property: "og:title", content: "Pricing — Northline Studio" },
      { property: "og:description", content: "Transparent pricing for websites, apps, and monthly care." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Launch",
    tagline: "For founders & new brands",
    price: "$6,500",
    unit: "starting",
    features: [
      "5–7 page marketing website",
      "Custom design + Framer/Webflow build",
      "Basic on-page SEO",
      "Analytics setup",
      "2 rounds of revisions",
      "Delivered in 3–4 weeks",
    ],
    cta: "Start Launch",
    highlight: false,
  },
  {
    name: "Studio",
    tagline: "Most popular for growing teams",
    price: "$18,000",
    unit: "starting",
    features: [
      "Custom website or web app",
      "UI/UX design + engineering",
      "CMS integration (Sanity / Webflow)",
      "Component design system",
      "Performance & SEO baseline",
      "Delivered in 6–8 weeks",
    ],
    cta: "Start Studio",
    highlight: true,
  },
  {
    name: "Scale",
    tagline: "For product & ecommerce teams",
    price: "$45,000",
    unit: "starting",
    features: [
      "Custom SaaS / ecommerce build",
      "Auth, billing, dashboards",
      "Headless commerce or multi-tenant",
      "Full design system",
      "Analytics, SEO, CRO baseline",
      "Delivered in 10–14 weeks",
    ],
    cta: "Start Scale",
    highlight: false,
  },
];

const services = [
  { title: "Website Development", from: "$6,500", desc: "5–15 page marketing sites, custom built." },
  { title: "UI/UX Design", from: "$4,500", desc: "Product interfaces, flows, prototypes." },
  { title: "CMS Based Websites", from: "$8,000", desc: "Sanity, Webflow, WordPress, Contentful." },
  { title: "Mobile App Development", from: "$28,000", desc: "iOS, Android, cross-platform apps." },
  { title: "Ecommerce Build", from: "$15,000", desc: "Shopify or headless commerce." },
  { title: "SaaS MVP Sprint", from: "$22,000", desc: "6-week MVP from brief to launch." },
  { title: "Brand Identity", from: "$7,500", desc: "Logo, system, guidelines." },
  { title: "Full Brand Consultancy", from: "$18,000", desc: "Strategy, identity, go-to-market." },
];

const care = [
  { name: "Care Basic", price: "$450/mo", items: ["Hosting monitoring", "Security updates", "Monthly backups", "1 hour dev time"] },
  { name: "Care Plus", price: "$1,200/mo", items: ["Everything in Basic", "Uptime & perf monitoring", "SEO monthly report", "4 hours dev time"] },
  { name: "Care Pro", price: "$3,000/mo", items: ["Everything in Plus", "Dedicated PM", "Priority response (4h SLA)", "12 hours dev/design"] },
];

function PricingPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Pricing"
        title={<>Fair, transparent, <em className="italic text-gradient">predictable</em>.</>}
        subtitle="Fixed-scope engagements, monthly care plans and per-service pricing. No surprise invoices."
      />

      {/* Tiers */}
      <section className="container-page py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 flex flex-col ${
                t.highlight
                  ? "border-gold/50 bg-gradient-to-b from-surface-2 to-surface shadow-elegant"
                  : "border-border bg-surface/40"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-3xl">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-5xl">{t.price}</span>
                <span className="text-sm text-muted-foreground mb-2">{t.unit}</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 text-center rounded-full px-4 py-2.5 text-sm font-medium ${
                  t.highlight
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "border border-border hover:bg-surface"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Per-service pricing */}
      <section className="container-page py-16 border-t border-border/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">By service</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Starting prices by service.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Every engagement is scoped from a fixed brief. These are typical starting points.
          </p>
        </div>
        <div className="grid gap-px bg-border/50 rounded-2xl overflow-hidden md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="bg-background p-6 flex items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              <span className="text-sm font-medium text-gold shrink-0">from {s.from}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly care */}
      <section className="container-page py-24 border-t border-border/60">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Monthly care</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Ongoing partnership plans.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {care.map((p) => (
            <div key={p.name} className="rounded-3xl border border-border bg-surface/40 p-8">
              <h3 className="font-display text-2xl">{p.name}</h3>
              <div className="mt-2 font-display text-4xl text-gradient">{p.price}</div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
