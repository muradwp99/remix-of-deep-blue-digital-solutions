import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BentoShowcase } from "@/components/bento-features";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { ArrowUpRight, RefreshCw, Cloud, Workflow, BrainCircuit, Check } from "lucide-react";

export const Route = createFileRoute("/digital-transformation")({
  head: () => ({
    meta: [
      { title: "Digital Transformation — Northline Studio" },
      { name: "description", content: "Strangler-pattern modernization: legacy to cloud-native with zero-downtime cutovers, 40% average infra cost reduction, and releases that ship 3× faster." },
      { property: "og:title", content: "Digital Transformation — Northline Studio" },
      { property: "og:description", content: "Legacy to cloud-native with zero-downtime cutovers and releases that ship 3× faster." },
    ],
  }),
  component: Page,
});

const modernizeChips = [
  "Monolith → services",
  "On-prem → cloud",
  "Batch jobs → event streams",
  "Manual QA → CI pipelines",
  "Spreadsheets → dashboards",
  "Tickets → automation",
  "VMs → containers",
  "Nightly ETL → live data",
  "Passwords → SSO",
  "Tribal knowledge → runbooks",
];

function Page() {
  return (
    <SiteShell theme={pageThemes["digital-transformation"]}>
      {/* ---- Hero (deep magenta color-block — premium, editorial split) ---- */}
      <section className="block-deep">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            Digital Transformation
          </p>
          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h1
              className="max-w-[15ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
              data-reveal
            >
              Modernize without the <span className="text-gold">meltdown</span>
            </h1>
            <p className="max-w-sm text-lg leading-relaxed text-muted-foreground" data-reveal>
              Legacy systems carry your revenue — we migrate them like it. Strangler-pattern
              re-platforms, zero-downtime cutovers, and a rollback plan for every phase.
            </p>
          </div>
          <div className="mt-10" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              Book the Assessment
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Light zone: the four pillars + the payback ---- */}
      <div className="block-light">
        <FeatureGrid
          eyebrow="Transformation pillars"
          title="Four pillars, one operating system for change."
          subtitle="Each pillar ships value on its own. Together they compound into an organization that releases weekly instead of quarterly."
          items={[
            { icon: RefreshCw, title: "Legacy Modernization", desc: "Strangler-pattern re-platforms — the old system keeps earning while the new one earns trust." },
            { icon: Cloud, title: "Cloud Migration", desc: "Infrastructure as code, autoscaling, and a monthly bill your CFO can actually read." },
            { icon: Workflow, title: "Process Automation", desc: "The 40 hours a week your team spends re-keying data, given back." },
            { icon: BrainCircuit, title: "Data Intelligence", desc: "One source of truth, live dashboards, and LLM copilots where they genuinely help." },
          ]}
        />

        {/* Proof band — counters, heading-led */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] items-center">
            <div>
              <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
                What modernization pays back.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl" data-reveal-child>
                Medians across our transformation engagements since 2014. Every program is
                instrumented from day one, so you watch these numbers move in your own
                dashboards — not in our slide deck.
              </p>
              <Link
                to="/works"
                data-reveal-child
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-lime link-underline"
              >
                See it in a case study <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "40%", label: "lower infrastructure cost after migration" },
                { v: "3×", label: "faster release cadence within two quarters" },
                { v: "99.9%", label: "uptime through and after cutover" },
                { v: "0", label: "big-bang launches — value ships in phases" },
              ].map((s) => (
                <div key={s.label} className="glare-card gradient-card lift rounded-2xl p-7" data-reveal-child>
                  <div className="font-display text-5xl md:text-6xl font-semibold text-gradient-lime" data-counter>
                    {s.v}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---- Tint band: what we modernize (scattered chips assemble) ---- */}
      <div className="block-tint">
        <section className="container-page py-24 overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-14 items-center">
            <div data-reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-lime">Before → after</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold">
                The migrations we run most.
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md">
                Every arrow below is a phased program with its own rollback plan — not a
                rewrite that bets the company on one launch weekend.
              </p>
            </div>
            <div className="relative" data-scatter>
              <div
                className="absolute -top-20 right-0 h-64 w-64 rounded-full opacity-25 pointer-events-none"
                style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
                data-parallax="-0.15"
              />
              <div className="relative flex flex-wrap gap-3">
                {modernizeChips.map((chip, i) => (
                  <span
                    key={chip}
                    data-scatter-item
                    className={`rounded-full px-5 py-2.5 text-sm font-medium border will-change-transform ${
                      i % 4 === 0
                        ? "gradient-card-gold border-gold/25"
                        : "glass border-black/10 text-foreground/85"
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---- Light zone: the phased approach ---- */}
      <div className="block-light">
        <ProcessSteps
          eyebrow="Our approach"
          title="Risk-mitigated, phase by phase."
          steps={[
            { n: "01", t: "Assess & Strategize", d: "Two-week audit: system map, risk register, and a sequenced roadmap with cost per phase." },
            { n: "02", t: "Architect & Migrate", d: "Target architecture as code. Traffic shifts gradually behind feature flags — never all at once." },
            { n: "03", t: "Automate & Integrate", d: "CI/CD, automated testing, and integrations that retire the swivel-chair work." },
            { n: "04", t: "Optimize & Scale", d: "Cost tuning, observability, and a quarterly architecture review your team runs without us." },
          ]}
        />
      </div>

      {/* ---- Deep color moment: modernization cockpit bento (dark vignettes) ---- */}
      <div className="block-deep">
        <BentoShowcase
          eyebrow="Modernization cockpit"
          title={
            <>
              Legacy systems, watched like <span className="text-gold">new</span> ones.
            </>
          }
          subtitle="A migration you can't observe is a migration you can't trust. Both systems run under the same instruments until parity is proven."
          cards={[
            {
              title: "Efficiency, measured",
              desc: "Manual processing drops sprint by sprint, and the dashboard proves it — to you and to your board.",
              tone: "warm",
              visual: { kind: "gauge", stat: "62%", statLabel: "less manual processing", value: 0.62 },
            },
            {
              title: "Migrate without drama",
              desc: "Data parity checks, a signed cutover plan, and a rehearsed rollback — before anything moves.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["Data parity verified", "Cutover plan signed", "Rollback path tested"],
              },
            },
            {
              title: "Progress you can audit",
              desc: "Nightly sync results and migration batches post to a shared feed — status meetings become optional.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 4 },
                  { label: "Sync", count: 2, active: true },
                  { label: "Batches", count: 2 },
                ],
                rows: [
                  "Nightly sync: zero drift",
                  "Batch 7 of 12 migrated",
                  "Legacy goes read-only in 3 weeks",
                ],
              },
            },
            {
              title: "Cutover on command",
              desc: "Parity checks, sync pauses, and the final promotion are commands with rollbacks — not weekend war rooms.",
              tone: "warm",
              visual: {
                kind: "command",
                actions: [
                  { label: "Run Parity Check", kbd: "P" },
                  { label: "Pause Legacy Sync", kbd: "S" },
                  { label: "Promote New System", kbd: "G" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- Light zone: risk reversal + outcomes ---- */}
      <div className="block-light">
        {/* Risk reversal comparison */}
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal>
              Big-bang rewrites fail. <span className="text-gold">Phases</span> don't.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-surface/40 p-8 md:p-10" data-slide="left">
              <h3 className="font-display text-2xl font-semibold text-muted-foreground">The rewrite trap</h3>
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                <li>18 months of building with nothing in production</li>
                <li>Old system rots while the new one slips</li>
                <li>One terrifying cutover weekend</li>
                <li>Budget exhausted before feature parity</li>
              </ul>
            </div>
            <div className="glare-card gradient-card-gold rounded-3xl p-8 md:p-10 border border-gold/20" data-slide="right">
              <h3 className="font-display text-2xl font-semibold">The Northline path</h3>
              <ul className="mt-8 space-y-4">
                {[
                  "First module live in production by week 6",
                  "Old and new run side by side, verified against each other",
                  "Every phase has a rollback switch",
                  "Budget released phase by phase — stop anytime, keep everything",
                ].map((row) => (
                  <li key={row} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm leading-relaxed text-foreground/90">{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <BenefitList
          eyebrow="Outcomes that compound"
          title="What your team keeps."
          items={[
            { title: "Reduced technical debt", desc: "Readable services, documented decisions, and a codebase new hires ship to in week one." },
            { title: "Enhanced security posture", desc: "SSO, least-privilege access, audit trails — SOC2 and GDPR readiness built into the platform." },
            { title: "Scalability without drama", desc: "Autoscaling absorbs your best traffic day; nobody gets paged for success." },
            { title: "Faster customer experiences", desc: "Sub-2s loads and live data — the improvements your customers feel immediately." },
          ]}
        />
      </div>

      {/* ---- Dark bookend: FAQ + CTA into footer ---- */}
      <FAQAccordion
        faqs={[
          { q: "Will there be downtime during migration?", a: "Our cutovers are zero- or low-downtime by design: traffic shifts incrementally behind flags, with automated rollback if error budgets are exceeded. Most users never notice the switch." },
          { q: "How do you reduce risk?", a: "Phases, not big bangs. Each phase is independently valuable, independently reversible, and verified against the legacy system before it takes real traffic." },
          { q: "Can you integrate with our existing systems?", a: "Yes — that's the default. The strangler pattern means new services wrap and gradually replace old ones, talking to everything you already run in the meantime." },
          { q: "How long does a transformation take?", a: "First production value in about six weeks; full programs run 6–18 months depending on scope. You see the sequenced roadmap with per-phase costs after the two-week assessment." },
        ]}
      />

      <CTABand
        eyebrow="Start with the audit"
        title="Get your modernization roadmap."
        subtitle="A two-week assessment: system map, risk register, and a phased plan with real costs. Fixed price, yours to keep — whoever you build with."
        primary={{ label: "Book the Assessment", to: "/contact" }}
        secondary={{ label: "See Transformation Work", to: "/works" }}
      />
    </SiteShell>
  );
}
