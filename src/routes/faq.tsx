import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { FAQAccordion, CTABand } from "@/components/sections";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Northline Studio" },
      { name: "description", content: "Answers about engagement models, process, timelines, IP ownership, and support." },
      { property: "og:title", content: "FAQ — Northline Studio" },
      { property: "og:description", content: "Common questions about working with Northline." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything you need to know before we start working together."
      />
      <FAQAccordion
        faqs={[
          { q: "How quickly can we start?", a: "Typically within 1–2 weeks. We scope discovery and align on a start date on our first call." },
          { q: "Do you work with startups or enterprise?", a: "Both. We tailor process and team composition — the craft standard doesn't change." },
          { q: "What's your pricing model?", a: "Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery." },
          { q: "Who owns the code and IP?", a: "You do. Full transfer on delivery, with clean docs and repository handover." },
          { q: "Do you offer post-launch support?", a: "Yes — most clients continue on a Care plan for maintenance, iteration, and growth." },
          { q: "How do you handle communication?", a: "Shared boards, weekly demos, and a direct line to the senior team building your product." },
          { q: "Can you sign an NDA?", a: "Absolutely. We're happy to sign your NDA before discovery." },
          { q: "What tech stacks do you use?", a: "TypeScript, React, Node, Go, Postgres, and cloud-native infrastructure on AWS/GCP." },
        ]}
      />
      <CTABand title="Still have questions?" primary={{ label: "Book a Call", to: "/contact" }} secondary={{ label: "See Pricing", to: "/pricing" }} />
    </SiteShell>
  );
}
