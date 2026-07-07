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
import { Search, PenTool, Layout, Boxes, MousePointerClick, Accessibility } from "lucide-react";

export const Route = createFileRoute("/ui-ux-design")({
  head: () => ({
    meta: [
      { title: "UI/UX Design — Northline Studio" },
      { name: "description", content: "Research-driven, conversion-focused UI/UX design and scalable design systems." },
      { property: "og:title", content: "UI/UX Design — Northline Studio" },
      { property: "og:description", content: "User-centric design that bridges aesthetics and functionality." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="UI/UX Design"
        title="UI/UX design that drives growth"
        subtitle="Research-driven, conversion-focused, and built on scalable design systems."
      />
      <FeatureGrid
        eyebrow="Core services"
        title="Design, end to end."
        cols={3}
        items={[
          { icon: Search, title: "UX Research & Strategy", desc: "Interviews, testing, and journey mapping." },
          { icon: PenTool, title: "Interface Design", desc: "Beautiful, accessible, on-brand UI." },
          { icon: Layout, title: "Wireframing & Prototyping", desc: "Rapid, testable interactive prototypes." },
          { icon: Boxes, title: "Design Systems", desc: "Reusable tokens and component libraries." },
          { icon: MousePointerClick, title: "Interaction Design", desc: "Micro-interactions and motion that delight." },
          { icon: Accessibility, title: "Usability & A11y", desc: "WCAG-compliant, tested with real users." },
        ]}
      />
      <ProcessSteps
        eyebrow="How we work"
        title="A transparent 5-step design process."
        steps={[
          { n: "01", t: "Discovery & Research", d: "Understand users, goals, and constraints." },
          { n: "02", t: "Information Architecture", d: "Structure content and flows." },
          { n: "03", t: "Wireframing", d: "Low-fi layouts validated fast." },
          { n: "04", t: "Visual & Prototype", d: "Pixel-perfect UI and interactive prototypes." },
          { n: "05", t: "Handoff & Support", d: "Developer-ready specs and ongoing help." },
        ]}
      />
      <BenefitList
        eyebrow="Differentiators"
        title="Design that ships."
        items={[
          { title: "Pixel-perfect Figma", desc: "Clean, organised, developer-ready files." },
          { title: "Conversion-optimized", desc: "Layouts designed around business outcomes." },
          { title: "Accessibility built in", desc: "Compliant and inclusive from the start." },
          { title: "Rapid iteration", desc: "Fast feedback loops and revisions." },
        ]}
      />
      <Testimonials
        items={[
          { q: "They translated a messy brief into an interface our users instantly understood.", a: "Priya Shah", r: "VP Product, Meridian" },
          { q: "Our conversion rate jumped after the redesign. Beautiful and effective.", a: "Emily Carter", r: "CTO, Northwind" },
          { q: "The design system they built saved our team months.", a: "Marcus Chen", r: "Founder, Halcyon" },
        ]}
      />
      <FAQAccordion
        faqs={[
          { q: "How long does a design engagement take?", a: "Typically 4–10 weeks depending on scope and number of flows." },
          { q: "How many revision cycles are included?", a: "We iterate until it's right — feedback loops are built into every sprint." },
          { q: "What do you deliver at handoff?", a: "Figma files, a design system, specs, and developer support." },
          { q: "Do you offer ongoing design support?", a: "Yes, via monthly design retainers." },
        ]}
      />
      <CTABand title="Ready to elevate your product design?" primary={{ label: "Book a Call", to: "/contact" }} secondary={{ label: "View Our Work", to: "/works" }} />
    </SiteShell>
  );
}
