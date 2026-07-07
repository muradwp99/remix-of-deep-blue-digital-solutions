import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  StatsRow,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { Cloud, Boxes, Plug, CreditCard, LineChart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/saas")({
  head: () => ({
    meta: [
      { title: "SaaS Development — Northline Studio" },
      { name: "description", content: "Scalable, secure, high-performance SaaS platforms from MVP to enterprise scale." },
      { property: "og:title", content: "SaaS Development — Northline Studio" },
      { property: "og:description", content: "Multi-tenant architecture, subscription billing, and API-first design." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="SaaS Development"
        title="End-to-end SaaS engineering"
        subtitle="Multi-tenant architectures, subscription billing, and API-first design — MVP to enterprise scale."
      />
      <FeatureGrid
        eyebrow="Core capabilities"
        title="Everything your platform needs."
        cols={3}
        items={[
          { icon: Cloud, title: "Cloud-Native", desc: "AWS, GCP, and Azure architectures." },
          { icon: Boxes, title: "Microservices & APIs", desc: "Composable, API-first systems." },
          { icon: Plug, title: "Integrations", desc: "Third-party services wired in cleanly." },
        ]}
      />
      <FeatureGrid
        eyebrow="Growth features"
        title="Built to monetize and scale."
        cols={3}
        gold
        items={[
          { icon: CreditCard, title: "Billing", desc: "Stripe & Chargebee subscription management." },
          { icon: LineChart, title: "Onboarding & Analytics", desc: "Activation flows and product insights." },
          { icon: ShieldCheck, title: "Compliance & Security", desc: "SOC2, GDPR, and audit-ready." },
        ]}
      />
      <ProcessSteps
        eyebrow="Lifecycle"
        title="A streamlined SaaS delivery cycle."
        steps={[
          { n: "01", t: "Discovery & Roadmap", d: "Define the product and priorities." },
          { n: "02", t: "UX/UI Prototyping", d: "Validate flows before we build." },
          { n: "03", t: "Agile Sprints", d: "Iterative, demo-driven development." },
          { n: "04", t: "Deploy & Deliver", d: "CI/CD and continuous delivery." },
        ]}
      />
      <StatsRow
        stats={[
          { value: "99.9%", label: "Uptime delivered" },
          { value: "12wk", label: "Avg. MVP timeline" },
          { value: "0", label: "Technical debt goal" },
          { value: "24/7", label: "Monitoring" },
        ]}
      />
      <BenefitList
        eyebrow="Why our SaaS engineering"
        title="Zero technical debt, fast to market."
        items={[
          { title: "Rapid time-to-market", desc: "Ship a credible MVP in weeks." },
          { title: "Scalable infrastructure", desc: "Grows with your user base." },
          { title: "Clean, documented code", desc: "No surprises, easy handover." },
          { title: "Post-launch iteration", desc: "Ongoing product partnership." },
        ]}
      />
      <FAQAccordion
        faqs={[
          { q: "What tech stack do you use for SaaS?", a: "TypeScript, React, Node/Go, Postgres, and cloud-native infra." },
          { q: "Can you integrate billing?", a: "Yes — Stripe, Chargebee, and usage-based models." },
          { q: "How do you handle scalability?", a: "Multi-tenant, horizontally-scalable architecture from day one." },
          { q: "What about compliance?", a: "SOC2, GDPR, and industry-specific requirements." },
        ]}
      />
      <CTABand title="Validate your SaaS idea." primary={{ label: "Book a Free Consultation", to: "/contact" }} />
    </SiteShell>
  );
}
