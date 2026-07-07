import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  Testimonials,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { Layers, Cloud, Building2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/custom-software")({
  head: () => ({
    meta: [
      { title: "Custom Software Development — Northline Studio" },
      { name: "description", content: "Enterprise-grade custom software: scalable, secure, bespoke platforms engineered end to end." },
      { property: "og:title", content: "Custom Software Development — Northline Studio" },
      { property: "og:description", content: "Scalable, secure, bespoke software built by a senior engineering team." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Custom Software"
        title="Enterprise-grade custom software development"
        subtitle="Scalable, secure, and bespoke platforms — architected, built, and supported by one senior team."
      />
      <FeatureGrid
        eyebrow="What we build"
        title="Software tailored to your business."
        items={[
          { icon: Layers, title: "Web Applications", desc: "Complex dashboards, portals, and internal tools." },
          { icon: Cloud, title: "SaaS Platforms", desc: "Multi-tenant products from MVP to enterprise scale." },
          { icon: Building2, title: "Enterprise Portals", desc: "Secure, role-based systems for large organisations." },
          { icon: RefreshCw, title: "Legacy Modernization", desc: "Re-platform aging systems without downtime." },
        ]}
      />
      <ProcessSteps
        eyebrow="How we deliver"
        title="A refined 5-step engineering process."
        steps={[
          { n: "01", t: "Product Strategy", d: "Requirements, architecture, and stack selection." },
          { n: "02", t: "UX Prototyping", d: "Validated flows and pixel-perfect interfaces." },
          { n: "03", t: "Agile Sprints", d: "CI/CD, automated tests, weekly demos." },
          { n: "04", t: "QA & Security", d: "Pen testing, code reviews, SOC2/HIPAA/GDPR." },
          { n: "05", t: "Continuous Delivery", d: "Zero-downtime deploys and 24/7 monitoring." },
        ]}
      />
      <BenefitList
        eyebrow="Why our engineers"
        title="Top 1% talent, transparent codebases."
        items={[
          { title: "Domain expertise", desc: "Fintech, healthcare, and SaaS specialists." },
          { title: "Cloud-native architecture", desc: "Scalable, resilient infrastructure by default." },
          { title: "Transparent code", desc: "Clean repos, full IP ownership on delivery." },
          { title: "Long-term support", desc: "Monitoring, iteration, and ongoing feature work." },
        ]}
      />
      <Testimonials
        items={[
          { q: "Their technical depth and communication set a bar our internal team now measures against.", a: "David Kim", r: "VP Engineering, Orbital" },
          { q: "Complex requirements, shipped cleanly and on time. Rare craftsmanship.", a: "Nadia Rahman", r: "CTO, Vantage" },
          { q: "They solved architecture problems our last vendor couldn't even scope.", a: "Tom Barrett", r: "Founder, Cascade" },
        ]}
      />
      <FAQAccordion
        faqs={[
          { q: "What technology stacks do you use?", a: "TypeScript, React, Node, Go, Postgres, and cloud-native infra on AWS/GCP." },
          { q: "Who owns the IP?", a: "You do — full transfer on delivery with clean documentation." },
          { q: "How do you handle data security?", a: "Encryption, least-privilege access, and compliance-ready practices (SOC2, HIPAA, GDPR)." },
          { q: "Can you scale the team?", a: "Yes — dedicated pods scale up or down with your roadmap." },
        ]}
      />
      <CTABand title="Let's build your software together." primary={{ label: "Book a Call", to: "/contact" }} />
    </SiteShell>
  );
}
