import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BentoShowcase } from "@/components/bento-features";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  StatsRow,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { ArrowUpRight, Cloud, Boxes, Plug } from "lucide-react";

export const Route = createFileRoute("/saas")({
  head: () => ({
    meta: [
      { title: "SaaS Development — Northline Studio" },
      { name: "description", content: "SaaS platforms engineered to invoice: multi-tenant architecture, billing, and compliance from the first commit. First live demo day 7, MVP in a median 12 weeks." },
      { property: "og:title", content: "SaaS Development — Northline Studio" },
      { property: "og:description", content: "Multi-tenant architecture, billing, and compliance from the first commit. MVP in a median 12 weeks." },
    ],
  }),
  component: Page,
});

const growthFeatures = [
  { title: "Billing", desc: "Stripe or Chargebee: trials, seats, usage metering, dunning. Revenue logic tested like it's money — because it is." },
  { title: "Onboarding & Analytics", desc: "Activation funnels instrumented from launch, so week-2 retention is a dashboard, not a guess." },
  { title: "Compliance & Security", desc: "SOC2-ready logging, GDPR data flows, SSO/SAML — the checklist that unblocks enterprise deals." },
];

function Page() {
  return (
    <SiteShell theme={pageThemes["saas"]}>
      {/* ---- Hero (bold indigo color-block — energetic, ink on saturation) ---- */}
      <section className="block-bold">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            SaaS Development
          </p>
          <h1
            className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-split
          >
            SaaS engineered to invoice
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            Multi-tenant architecture, subscription billing, and compliance wired in from the
            first commit — because a platform that can't charge isn't a product yet.
          </p>
          <div className="mt-10" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              Start Your Build
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Light zone: the platform layer + growth features ---- */}
      <div className="block-light">
        <FeatureGrid
          variant="spotlight"
          eyebrow="Core capabilities"
          title="The platform layer, done once, done right."
          cols={3}
          items={[
            { icon: Cloud, title: "Cloud-Native", desc: "AWS or GCP, infrastructure as code, and a cost model you can defend in a board meeting." },
            { icon: Boxes, title: "Multi-Tenant & APIs", desc: "Tenant isolation, rate limits, and versioned public APIs — the parts that are brutal to retrofit." },
            { icon: Plug, title: "Integrations", desc: "Webhooks, OAuth apps, and the Zapier/Slack/CRM connections your buyers ask about on demo calls." },
          ]}
        />

        {/* Growth features — editorial numbered list (not a second card grid) */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Growth features
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Built to monetize from week one.
            </h2>
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            {growthFeatures.map((f, i) => (
              <div key={f.title} className="flex gap-6 border-t border-border py-6" data-reveal-child>
                <span className="font-display text-sm font-semibold text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Tint band: the first 14 days ---- */}
      <div className="block-tint">
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
              The first 14 days, in writing.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
              Most agencies spend the first month "onboarding." Here is our contractual cadence
              for every SaaS build since 2014.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { d: "Day 1", t: "Kickoff & repo", s: "You get repo access, a CI pipeline, and a staging URL before the first standup ends." },
              { d: "Day 7", t: "First live demo", s: "Real code on a real URL — auth, tenancy skeleton, and your first core screen." },
              { d: "Day 14", t: "Shippable slice", s: "One end-to-end flow a design partner could use today. Thin, but true." },
              { d: "Week 12", t: "Median MVP", s: "Billing live, onboarding instrumented, 98 median Lighthouse at launch." },
            ].map((m, i) => (
              <div key={m.d} className="relative glass lift rounded-2xl p-7" data-reveal-child>
                <span className="text-xs uppercase tracking-[0.28em] text-lime">{m.d}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{m.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.s}</p>
                {i < 3 && (
                  <span className="hidden md:block absolute top-1/2 -right-2.5 h-px w-5 bg-lime/40" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Light zone: lifecycle + the numbers ---- */}
      <div className="block-light">
        <ProcessSteps
          variant="rail"
          eyebrow="Lifecycle"
          title="From roadmap to recurring revenue."
          steps={[
            { n: "01", t: "Discovery & Roadmap", d: "One week: pricing model, tenancy strategy, and a cut-line for v1." },
            { n: "02", t: "UX/UI Prototyping", d: "Clickable flows tested with design partners before production code." },
            { n: "03", t: "Agile Sprints", d: "Demo every Friday, deployed to staging on every merge." },
            { n: "04", t: "Deploy & Iterate", d: "Zero-downtime releases, feature flags, and activation data driving the backlog." },
          ]}
        />

        <StatsRow
          stats={[
            { value: "12wk", label: "Median MVP timeline" },
            { value: "98", label: "Median Lighthouse at launch" },
            { value: "99.95%", label: "Uptime across client platforms" },
            { value: "84%", label: "Of clients stay on a Care plan" },
          ]}
        />
      </div>

      {/* ---- Deep color moment: platform operations bento (dark vignettes) ---- */}
      <div className="block-deep">
        <BentoShowcase
          eyebrow="Platform operations"
          title={
            <>
              Run it like week <span className="text-gold">100</span>, from week one.
            </>
          }
          subtitle="The operational layer buyers never see on the demo — and churn over when it's missing."
          cards={[
            {
              title: "Uptime you can sell",
              desc: "Status pages, SLOs, and on-call runbooks from launch — because enterprise buyers ask before they sign.",
              tone: "warm",
              visual: { kind: "gauge", stat: "99.95%", statLabel: "uptime across client platforms", value: 0.95 },
            },
            {
              title: "Close enterprise deals",
              desc: "SSO, audit logging, and GDPR data flows ship in v1 — the checklist that unblocks six-figure contracts.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["SSO / SAML enabled", "Audit logging live", "GDPR flows mapped"],
              },
            },
            {
              title: "Feel your revenue pulse",
              desc: "Trials, conversions, and usage spikes stream into one feed — churn risk surfaces before the invoice fails.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 6 },
                  { label: "Billing", count: 3, active: true },
                  { label: "Usage", count: 2 },
                ],
                rows: [
                  "Acme trial converted — 24 seats",
                  "Dunning recovered a failed invoice",
                  "Usage spike on tenant 42",
                ],
              },
            },
            {
              title: "Admin without the console",
              desc: "Tenant management, roles, and usage exports as first-class commands — support stops filing engineering tickets.",
              tone: "warm",
              visual: {
                kind: "command",
                actions: [
                  { label: "Create New Tenant", kbd: "N" },
                  { label: "Grant Admin Role", kbd: "G" },
                  { label: "Export Usage Report", kbd: "E" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- Light zone: why our SaaS engineering ---- */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why our SaaS engineering"
          title="Fast to first invoice, cheap to change."
          items={[
            { title: "Rapid time-to-market", desc: "A credible, billable MVP in a median 12 weeks — scope cut ruthlessly with you, not for you." },
            { title: "Infrastructure that scales", desc: "Tenant 1 and tenant 1,000 run the same code. No re-architecture tax at traction." },
            { title: "Clean, documented handover", desc: "Your future hires onboard from the repo README, not from meetings with us." },
            { title: "Post-launch partnership", desc: "Care plans keep shipping after launch — activation experiments, upgrades, and on-call." },
          ]}
        />
      </div>

      {/* ---- Dark bookend: case study, architecture review, FAQ, CTA into footer ---- */}
      {/* Case study — full-bleed image band with glass overlay */}
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 min-h-[440px] flex items-end">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70"
            alt="Orbital analytics dashboard"
            className="absolute inset-0 h-full w-full object-cover"
            data-parallax-img
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/10" />
          <div className="relative w-full p-8 md:p-14">
            <div className="glass-strong rounded-3xl p-8 md:p-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                Case study — Orbital
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight font-semibold" data-reveal-child>
                Zero to paying teams in one quarter.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground" data-reveal-child>
                Usage-based analytics platform: multi-tenant core, Stripe metering, and SSO
                shipped in the first release — which is why their first enterprise deal closed in month four.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4" data-reveal-child>
                {[
                  { v: "11wk", l: "to first paying customer" },
                  { v: "3.1×", l: "signups after onboarding rework" },
                  { v: "99.98%", l: "uptime since launch" },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-display text-3xl font-semibold text-gradient-lime" data-counter>{m.v}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
              <Link to="/works" className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-lime" data-reveal-child>
                Read the Orbital story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion band — free architecture review */}
      <section className="container-page py-24 border-t border-border/60" data-reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-card border border-lime/20 p-12 md:p-16">
          <div className="absolute inset-0 grain-bg pointer-events-none" />
          <div
            className="absolute -top-32 -right-24 h-80 w-80 rounded-full opacity-35 pointer-events-none"
            style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
            data-parallax="-0.15"
          />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime">Free architecture review</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.02] font-semibold">
                Pressure-test your SaaS before you fund it.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Send us your spec or your existing codebase. In 45 minutes, two senior engineers
                will walk you through tenancy, billing, and scaling risks — and what v1 should refuse to include. No deck, no obligation.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-8 py-4 text-sm font-semibold"
              >
                Book the Review
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { q: "What tech stack do you use for SaaS?", a: "TypeScript end to end, React, Node or Go services, Postgres with row-level tenant isolation, on AWS or GCP. Chosen so your first engineering hires can be productive in week one." },
          { q: "Can you integrate billing?", a: "Yes — Stripe and Chargebee, including seats, trials, usage metering, and dunning. Billing ships in v1, not 'after traction.'" },
          { q: "How do you handle scalability?", a: "Multi-tenant, horizontally scalable architecture from the first commit, load-tested before launch. Growth becomes a bill, not a rewrite." },
          { q: "What about compliance?", a: "SOC2-ready audit logging, GDPR data mapping, and SSO/SAML when enterprise deals need them. We've been through the auditor gauntlet since 2014." },
        ]}
      />

      <CTABand
        eyebrow="Next step"
        title="Ship the version that charges money."
        subtitle="Tell us what you're building. Within one business day you'll have a v1 cut-line, a 12-week plan, and a number."
        primary={{ label: "Start Your Build", to: "/contact" }}
        secondary={{ label: "See Platforms We've Shipped", to: "/works" }}
      />
    </SiteShell>
  );
}
