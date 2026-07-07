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
import { RefreshCw, Cloud, Workflow, BrainCircuit } from "lucide-react";

export const Route = createFileRoute("/digital-transformation")({
  head: () => ({
    meta: [
      { title: "Digital Transformation — Northline Studio" },
      { name: "description", content: "Modernize legacy systems, migrate to the cloud, and automate for enterprise agility." },
      { property: "og:title", content: "Digital Transformation — Northline Studio" },
      { property: "og:description", content: "From legacy systems to cloud-native, risk-mitigated modernization." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Digital Transformation"
        title="Modernize your business for the digital age"
        subtitle="Enterprise agility and growth — from legacy systems to cloud-native architectures."
      />
      <FeatureGrid
        eyebrow="Transformation pillars"
        title="Four pillars of modernization."
        items={[
          { icon: RefreshCw, title: "Legacy Modernization", desc: "Re-platform aging systems safely." },
          { icon: Cloud, title: "Cloud Migration", desc: "Move to scalable, resilient infra." },
          { icon: Workflow, title: "Process Automation", desc: "Automate manual, error-prone work." },
          { icon: BrainCircuit, title: "Data Intelligence", desc: "Turn data into decisions with AI." },
        ]}
      />
      <ProcessSteps
        eyebrow="Our approach"
        title="A risk-mitigated modernization path."
        steps={[
          { n: "01", t: "Assess & Strategize", d: "Audit systems and define a roadmap." },
          { n: "02", t: "Architect & Migrate", d: "Design and move to modern infra." },
          { n: "03", t: "Automate & Integrate", d: "Streamline and connect workflows." },
          { n: "04", t: "Optimize & Scale", d: "Continuously improve and grow." },
        ]}
      />
      <StatsRow
        stats={[
          { value: "40%", label: "Avg. cost reduction" },
          { value: "99.9%", label: "Post-migration uptime" },
          { value: "3×", label: "Faster releases" },
          { value: "15+", label: "Industries served" },
        ]}
      />
      <BenefitList
        eyebrow="Future-proof your enterprise"
        title="Outcomes that compound."
        items={[
          { title: "Reduced technical debt", desc: "Cleaner systems, lower maintenance cost." },
          { title: "Enhanced security", desc: "Modern, compliant, and resilient." },
          { title: "Seamless scalability", desc: "Handle growth without re-architecture." },
          { title: "Better CX", desc: "Faster, more reliable customer experiences." },
        ]}
      />
      <FAQAccordion
        faqs={[
          { q: "Will there be downtime during migration?", a: "We plan zero- or low-downtime cutovers with rollback safety." },
          { q: "How do you reduce risk?", a: "Incremental migration, thorough testing, and clear checkpoints." },
          { q: "Can you integrate with existing systems?", a: "Yes — we specialise in phased, non-disruptive integration." },
          { q: "How long does transformation take?", a: "It varies by scope; we deliver value in phases, not big bangs." },
        ]}
      />
      <CTABand title="Ready to modernize?" primary={{ label: "Book a Discovery Call", to: "/contact" }} />
    </SiteShell>
  );
}
