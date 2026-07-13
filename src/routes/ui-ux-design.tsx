import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BentoShowcase } from "@/components/bento-features";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  Testimonials,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { ArrowUpRight, ArrowRight, Search, PenTool, Layout, Boxes, MousePointerClick, Accessibility } from "lucide-react";

export const Route = createFileRoute("/ui-ux-design")({
  head: () => ({
    meta: [
      { title: "UI/UX Design — Northline Studio" },
      { name: "description", content: "Research-driven product design measured in conversion, activation, and support tickets — not dribbble likes. Design systems your engineers actually adopt." },
      { property: "og:title", content: "UI/UX Design — Northline Studio" },
      { property: "og:description", content: "Product design measured in conversion and activation, not portfolio likes." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell theme={pageThemes["ui-ux-design"]}>
      {/* ---- Hero (bold rose color-block — energetic, ink on saturation) ---- */}
      <section className="block-bold">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            UI/UX Design
          </p>
          <h1
            className="mt-6 max-w-[14ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-split
          >
            Design measured in outcomes
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            Research-driven interfaces judged by the numbers they move — conversion, activation,
            support volume — not by how they look in a portfolio shot.
          </p>
          <div className="mt-10" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              Get a Free Teardown
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Light zone: services + the redesign ledger ---- */}
      <div className="block-light">
        <FeatureGrid
          eyebrow="Core services"
          title="Design, end to end."
          cols={3}
          items={[
            { icon: Search, title: "UX Research & Strategy", desc: "User interviews, session analysis, and journey maps that kill bad assumptions early — before they cost a sprint." },
            { icon: PenTool, title: "Interface Design", desc: "On-brand, accessible UI with the typographic discipline this page is demonstrating right now." },
            { icon: Layout, title: "Wireframing & Prototyping", desc: "Interactive prototypes in days, tested with real users before engineering commits." },
            { icon: Boxes, title: "Design Systems", desc: "Tokens, components, and usage docs — built with your engineers so they get adopted, not archived." },
            { icon: MousePointerClick, title: "Interaction Design", desc: "Choreographed motion with intent: guiding attention, confirming actions, never decorating for its own sake." },
            { icon: Accessibility, title: "Usability & A11y", desc: "WCAG AA as the floor. Tested with keyboards, screen readers, and actual users." },
          ]}
        />

        {/* The redesign ledger — before/after counters, doubles as case proof */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              The redesign ledger
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Meridian, before and after.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
              A B2B onboarding redesign we shipped last year. Ninety days of production data,
              same traffic, same pricing — only the design changed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3" data-cards data-cards-stagger="0.12">
            {[
              { before: "2.4%", after: "4.1%", delta: "+71%", label: "Trial signup conversion" },
              { before: "31%", after: "58%", delta: "+87%", label: "Day-1 activation" },
              { before: "220", after: "94", delta: "−57%", label: "Onboarding support tickets / mo" },
            ].map((r) => (
              <div key={r.label} className="glare-card gradient-card lift rounded-2xl p-8" data-card>
                <div className="flex items-center gap-3 font-display text-3xl font-semibold">
                  <span className="text-muted-foreground/60 line-through decoration-2">{r.before}</span>
                  <ArrowRight className="h-5 w-5 text-lime shrink-0" />
                  <span className="text-gradient-lime" data-counter>{r.after}</span>
                </div>
                <div className="mt-4 inline-flex rounded-full bg-lime/10 border border-lime/25 px-3 py-1 text-xs font-semibold text-lime">
                  {r.delta} in 90 days
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>
          <Link to="/works" className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-semibold text-lime" data-reveal-child>
            Full case study, with the failed iterations too <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      {/* ---- Tint band: how we work ---- */}
      <div className="block-tint">
        <ProcessSteps
          eyebrow="How we work"
          title="Five steps, evidence at every gate."
          steps={[
            { n: "01", t: "Discovery & Research", d: "Interviews and analytics review. We write down what we'd need to see to be wrong." },
            { n: "02", t: "Information Architecture", d: "Flows and content structure, tree-tested before any pixels." },
            { n: "03", t: "Wireframing", d: "Low-fi layouts in front of users within the first two weeks." },
            { n: "04", t: "Visual & Prototype", d: "High-fidelity UI and motion specs, prototyped at production quality." },
            { n: "05", t: "Handoff & Support", d: "Tokens, specs, and paired sessions with your engineers until it ships true." },
          ]}
        />
      </div>

      {/* ---- Deep color moment: design ops bento (dark vignettes) ---- */}
      <div className="block-deep">
        <BentoShowcase
          eyebrow="Design ops"
          title={
            <>
              A design process you can watch <span className="text-gold">working</span>.
            </>
          }
          subtitle="Taste is subjective; the system around it isn't. These four disciplines run on every design engagement."
          cards={[
            {
              title: "Usability, scored",
              desc: "Every redesign is benchmarked with task-completion tests before and after — the number, not the vibe, decides.",
              tone: "warm",
              visual: { kind: "gauge", stat: "+38%", statLabel: "task completion after redesign", value: 0.38 },
            },
            {
              title: "Accessible by default",
              desc: "Contrast, focus states, and screen-reader labels are checked in design review — not patched after launch.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["Contrast AA passed", "Focus states defined", "Screen-reader labels set"],
              },
            },
            {
              title: "Feedback on tap",
              desc: "Prototypes, test sessions, and design QA notes stream to your inbox — you see the thinking, not just the mockups.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 5 },
                  { label: "Research", count: 3, active: true },
                  { label: "QA", count: 1 },
                ],
                rows: [
                  "Prototype v3 shared for review",
                  "5 usability sessions booked",
                  "Design QA notes ready",
                ],
              },
            },
            {
              title: "One source of truth",
              desc: "Tokens, components, and dev handoff live in a system your engineers query — not a folder of stale exports.",
              tone: "warm",
              visual: {
                kind: "command",
                placeholder: "Search design system...",
                actions: [
                  { label: "Open Design Tokens", kbd: "T" },
                  { label: "Audit Component Usage", kbd: "A" },
                  { label: "Export Dev Handoff", kbd: "H" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- Light zone: the manifesto + what handoff includes ---- */}
      <div className="block-light">
        {/* Editorial manifesto — typographic, no cards */}
        <section className="container-page py-28">
          <div className="max-w-4xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
              Positions we argue for in every engagement.
            </h2>
            <div className="mt-14 space-y-0" data-reveal-group>
              {[
                { n: "01", t: "Taste is not the deliverable.", d: "Mockups are opinions. We hand over decisions — each screen tied to the metric it exists to move, so the next debate is settled by data, not seniority." },
                { n: "02", t: "Design in the browser's constraints.", d: "Every design is specced against real breakpoints, real content lengths, and real load states. If it can't survive a long German word, it isn't finished." },
                { n: "03", t: "Motion earns its render budget.", d: "Animation guides attention or confirms an action. Anything else gets cut — 98 median Lighthouse at launch is a design constraint, not an engineering afterthought." },
                { n: "04", t: "A design system is a hiring document.", d: "Done right, your next designer and next engineer onboard from it in a day. We've built them for teams of 3 and teams of 300 since 2014." },
              ].map((p) => (
                <div key={p.n} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-8 py-8 border-b border-border/60" data-reveal-child>
                  <span className="font-display text-2xl font-semibold text-gold/80">{p.n}</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-semibold">{p.t}</h3>
                    <p className="mt-3 text-muted-foreground max-w-2xl">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BenefitList
          eyebrow="What handoff includes"
          title="Files your engineers won't curse at."
          items={[
            { title: "Production-ready Figma", desc: "Auto-layout, variables, and naming that matches the codebase — not a 400-frame scrapbook." },
            { title: "Tokens as code", desc: "Color, type, and spacing exported as variables your build consumes directly." },
            { title: "Motion specs", desc: "Durations, easings, and reduced-motion fallbacks written down, not guessed from a video." },
            { title: "Paired implementation", desc: "We sit with your engineers through the first build sprints until the shipped UI matches the file." },
          ]}
        />
      </div>

      {/* ---- Dark bookend: studio band, testimonials, FAQ, CTA into footer ---- */}
      {/* Studio image band — parallax */}
      <section className="border-t border-border/60">
        <div className="relative overflow-hidden min-h-[420px] flex items-center">
          <img
            src="/images/canva/studio-workspace.jpg"
            alt="Northline design review in progress"
            className="absolute inset-0 h-full w-full object-cover"
            data-parallax-img
          />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
          <div className="container-page relative py-24">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Inside the studio
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl md:text-5xl leading-[1.02] font-semibold" data-reveal>
              Every screen is critiqued twice before you ever see it.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground" data-reveal>
              A 50+ senior, remote-first team means your work is reviewed across three time zones
              overnight. What reaches your inbox has already survived our hardest room.
            </p>
            <Link to="/our-story" className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-lime" data-reveal>
              How the studio works <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials
        items={[
          { q: "They translated a messy brief into an interface our users instantly understood.", a: "Priya Shah", r: "VP Product, Meridian" },
          { q: "Signup conversion up 71% in a quarter. The redesign paid for itself before the invoice cleared.", a: "Emily Carter", r: "CTO, Northwind" },
          { q: "The design system they built saved our team months.", a: "Marcus Chen", r: "Founder, Halcyon" },
        ]}
      />

      <FAQAccordion
        faqs={[
          { q: "How long does a design engagement take?", a: "4–10 weeks for most scopes. First testable wireframes inside two weeks — you'll know quickly whether the direction is right." },
          { q: "How many revision cycles are included?", a: "Feedback loops are built into every sprint, and each revision is tied to evidence. We iterate until the metric moves, not until everyone is merely tired." },
          { q: "What do you deliver at handoff?", a: "Production Figma, a token set as code, motion specs, and paired sessions with your engineers through the first build sprints." },
          { q: "Do you offer ongoing design support?", a: "Yes — monthly design retainers, which most clients pair with an engineering Care plan. 84% stay on one after launch." },
        ]}
      />

      <CTABand
        eyebrow="Next step"
        title="Show us the screen that leaks users."
        subtitle="Send the flow you suspect is underperforming. We'll come to the first call with an annotated teardown — free, and yours to keep either way."
        primary={{ label: "Get a Free Teardown", to: "/contact" }}
        secondary={{ label: "View Our Work", to: "/works" }}
      />
    </SiteShell>
  );
}
