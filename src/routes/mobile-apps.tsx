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
import { Apple, Smartphone, Layers, Zap, Rocket, Activity } from "lucide-react";

export const Route = createFileRoute("/mobile-apps")({
  head: () => ({
    meta: [
      { title: "Mobile App Development — Northline Studio" },
      { name: "description", content: "Native and cross-platform mobile apps engineered for performance and growth." },
      { property: "og:title", content: "Mobile App Development — Northline Studio" },
      { property: "og:description", content: "iOS, Android, Flutter and React Native apps built to ship." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Mobile Apps"
        title="Mobile apps that drive growth"
        subtitle="Native and cross-platform expertise — from strategy to App Store and beyond."
      />
      <FeatureGrid
        eyebrow="Capabilities"
        title="Built for every platform."
        items={[
          { icon: Apple, title: "iOS (Swift)", desc: "Native, performant iPhone and iPad apps." },
          { icon: Smartphone, title: "Android (Kotlin)", desc: "Modern, Material-first Android apps." },
          { icon: Layers, title: "Flutter", desc: "One codebase, beautiful on both platforms." },
          { icon: Zap, title: "React Native", desc: "Fast cross-platform delivery." },
        ]}
      />
      <ProcessSteps
        eyebrow="How it works"
        title="A transparent 5-step build cycle."
        steps={[
          { n: "01", t: "Product Strategy", d: "Define scope, platforms, and success metrics." },
          { n: "02", t: "UX/UI Design", d: "Prototype and validate the experience." },
          { n: "03", t: "Agile Development", d: "Iterative sprints with weekly builds." },
          { n: "04", t: "QA & Testing", d: "Device coverage, performance, and edge cases." },
          { n: "05", t: "Launch & Scale", d: "Store submission, ASO, and growth." },
        ]}
      />
      <BenefitList
        eyebrow="Why our apps win"
        title="Performance, polish, and retention."
        items={[
          { title: "Performance-optimized", desc: "Smooth 60fps experiences on any device." },
          { title: "Pixel-perfect UI", desc: "Design that matches the spec exactly." },
          { title: "Offline-first", desc: "Resilient apps that work anywhere." },
          { title: "App Store optimization", desc: "Higher rankings and better conversion." },
        ]}
      />
      <FeatureGrid
        eyebrow="More services"
        title="Beyond the build."
        gold
        cols={4}
        items={[
          { icon: Rocket, title: "MVP Development", desc: "Validate ideas fast with a lean build." },
          { icon: Layers, title: "App Modernization", desc: "Refresh and re-platform aging apps." },
          { icon: Activity, title: "Mobile Analytics", desc: "Instrumentation and growth insights." },
          { icon: Zap, title: "Wearable Integration", desc: "watchOS, Wear OS, and IoT." },
        ]}
      />
      <Testimonials
        items={[
          { q: "Our app hit 4.9 stars and doubled retention in the first quarter.", a: "Lena Novak", r: "Founder, Halcyon" },
          { q: "Delivery speed without cutting corners — exactly what we needed.", a: "Sam Rivera", r: "Product Lead, Orbital" },
          { q: "Post-launch support has been flawless.", a: "Ade Ojo", r: "CEO, Ridgeline" },
        ]}
      />
      <FAQAccordion
        faqs={[
          { q: "Native or cross-platform?", a: "We recommend based on your goals, budget, and performance needs." },
          { q: "How long to launch?", a: "An MVP typically ships in 8–14 weeks." },
          { q: "What about maintenance costs?", a: "Care plans cover OS updates, fixes, and iteration." },
          { q: "Who owns the app and IP?", a: "You do — full transfer at delivery." },
        ]}
      />
      <CTABand title="Ready to build your mobile app?" primary={{ label: "Book a Call", to: "/contact" }} secondary={{ label: "View Case Studies", to: "/works" }} />
    </SiteShell>
  );
}
