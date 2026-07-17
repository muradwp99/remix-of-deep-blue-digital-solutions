import { createFileRoute, Link } from "@tanstack/react-router";
import { cmsFindOne, pageStr, type SitePageDoc } from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";
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
import { ArrowUpRight, Layers, Cloud, Building2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/custom-software")({
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "custom-software");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Custom Software — Northline Studio');
    const description = pageStr(d, "meta_description", 'Platforms, portals, and internal tools — architected and shipped by one senior team.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  return (
    <SiteShell theme={pageThemes["custom-software"]}>
      {/* ---- Hero (deep violet color-block — premium, light ink) ---- */}
      <section className="block-deep">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {s("hero_eyebrow", "Custom Software")}
          </p>
          <h1
            className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-reveal
          >
            {s("hero_title", "Software built like it has to")} <span className="text-gold">{s("hero_title_em", "last")}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {s("hero_subtitle", "Platforms, portals, and internal tools — architected and shipped by one senior team. You see it running on day 7, not in a deck on week 6.")}
          </p>
          <div className="mt-10" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              Book a Scoping Call
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Light zone: the numbers, then what we build ---- */}
      <div className="block-light">
        {/* Proof band — custom counters, heading-led (no eyebrow) */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] items-center">
            <div>
              <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
                Proof, not promises.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl" data-reveal-child>
                We've been shipping custom software since 2014 with a 50+ senior, remote-first team.
                These are the numbers we hold ourselves to on every engagement — ask us for the ones we missed, too.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "7", unit: "days", label: "to your first live demo — real code on a real URL" },
                { v: "14", unit: "days", label: "to a shippable slice your users can touch" },
                { v: "98", unit: "median", label: "Lighthouse performance score at launch" },
                { v: "84%", unit: "of clients", label: "stay on a Care plan after handover" },
              ].map((s) => (
                <div key={s.label} className="glare-card gradient-card lift rounded-2xl p-7" data-reveal-child>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl md:text-6xl font-semibold text-gradient-lime" data-counter>
                      {s.v}
                    </span>
                    <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{s.unit}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeatureGrid
          variant="spotlight"
          eyebrow="What we build"
          title="Four kinds of systems. All of them boring to operate."
          subtitle="Boring is the compliment: predictable deploys, readable code, dashboards nobody has to babysit."
          items={[
            { icon: Layers, title: "Web Applications", desc: "Dashboards, portals, and internal tools that replace the spreadsheet nobody admits runs the company." },
            { icon: Cloud, title: "SaaS Platforms", desc: "Multi-tenant from the first commit — billing, roles, and audit trails included, not bolted on." },
            { icon: Building2, title: "Enterprise Portals", desc: "Role-based systems that pass your security team's review the first time." },
            { icon: RefreshCw, title: "Legacy Modernization", desc: "Strangler-pattern re-platforms. The old system keeps running until the new one has earned trust." },
          ]}
        />
      </div>

      {/* ---- Tint band: delivery process ---- */}
      <div className="block-tint">
        <ProcessSteps
          variant="ladder"
          eyebrow="How we deliver"
          title="Five steps. No black box."
          steps={[
            { n: "01", t: "Product Strategy", d: "One week: requirements, architecture decision records, and a stack you can hire for." },
            { n: "02", t: "UX Prototyping", d: "Clickable flows validated with your users before a line of production code." },
            { n: "03", t: "Agile Sprints", d: "CI/CD from day one, automated tests, a live demo every Friday." },
            { n: "04", t: "QA & Security", d: "Pen testing, peer review on every merge, SOC2 / HIPAA / GDPR readiness." },
            { n: "05", t: "Continuous Delivery", d: "Zero-downtime deploys, 24/7 monitoring, and a runbook your team actually uses." },
          ]}
        />
      </div>

      {/* ---- Deep color moment: delivery tooling bento (dark vignettes) ---- */}
      <div className="block-deep">
        <BentoShowcase
          eyebrow="Delivery tooling"
          title={
            <>
              The unglamorous <span className="text-gold">machinery</span> behind every build.
            </>
          }
          subtitle="Boring to operate is a feature. This is the standing infrastructure that makes our systems predictable long after handover."
          cards={[
            {
              title: "Built to stay up",
              desc: "Zero-downtime deploys and 24/7 monitoring keep client platforms at four-nines availability.",
              tone: "warm",
              visual: { kind: "gauge", stat: "99.95%", statLabel: "uptime across client platforms", value: 0.95 },
            },
            {
              title: "Pass security review, first time",
              desc: "Pen testing, dependency scanning, and SOC2 / HIPAA / GDPR-ready controls baked into the pipeline.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["Pen test cleared", "SOC2 controls mapped", "Dependency scan clean"],
              },
            },
            {
              title: "Every commit, visible",
              desc: "You watch the build from day one — CI results, preview deploys, and architecture notes land as they happen.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 5 },
                  { label: "CI", count: 3, active: true },
                  { label: "Docs", count: 1 },
                ],
                rows: [
                  "Build #482 passed on main",
                  "Preview deploy ready",
                  "Architecture note added",
                ],
              },
            },
            {
              title: "Runbooks, not tribal knowledge",
              desc: "Deploys, rollbacks, and log access are documented commands your team can run without calling us.",
              tone: "warm",
              visual: {
                kind: "command",
                actions: [
                  { label: "Deploy to Production", kbd: "D" },
                  { label: "Rollback Last Release", kbd: "Z" },
                  { label: "Tail Service Logs", kbd: "T" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- Light zone: how to engage + why our engineers ---- */}
      <div className="block-light">
        {/* Engagement comparison — slide-in panels */}
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Two ways to engage
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal>
              Fixed scope, or an embedded <span className="text-gold">pod</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-strong rounded-3xl p-10 lift" data-slide="left">
              <h3 className="font-display text-2xl font-semibold">Fixed-scope build</h3>
              <p className="mt-2 text-sm text-lime">Best when the problem is well defined.</p>
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                <li>Locked spec, locked price, locked date — changes go through a written change order, not a surprise invoice.</li>
                <li>Typical range: 8–16 weeks, one delivery pod of 3–5 seniors.</li>
                <li>Full IP and repo transfer at delivery, with docs and a recorded architecture walkthrough.</li>
                <li>30-day defect warranty included.</li>
              </ul>
            </div>
            <div className="gradient-card-gold glare-card rounded-3xl p-10 lift border border-gold/20" data-slide="right">
              <h3 className="font-display text-2xl font-semibold">Embedded product pod</h3>
              <p className="mt-2 text-sm text-gold">Best when the roadmap is alive.</p>
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                <li>A dedicated pod inside your rituals — your standup, your Slack, your definition of done.</li>
                <li>Monthly rolling engagement; scale from 2 to 8 people with 2 weeks' notice.</li>
                <li>Velocity reported in shipped features, not hours logged.</li>
                <li>This is the model 84% of our clients graduate into.</li>
              </ul>
            </div>
          </div>
        </section>

        <BenefitList
          variant="grid"
          eyebrow="Why our engineers"
          title="Senior only. Your repo, your rules."
          items={[
            { title: "Domain depth", desc: "Fintech ledgers, HIPAA-bound healthcare flows, multi-tenant SaaS — we've shipped in regulated rooms." },
            { title: "Cloud-native by default", desc: "Infrastructure as code, autoscaling, and a monthly bill you can explain to finance." },
            { title: "Transparent code", desc: "You watch every commit land from day one. Full IP ownership at delivery — no hostage repos." },
            { title: "Support that stays", desc: "Care plans cover monitoring, patches, and iteration. 84% of clients keep one running." },
          ]}
        />
      </div>

      {/* ---- Dark bookend: case study, proof, FAQ, CTA into footer ---- */}
      {/* Case study callout — parallax image split card */}
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl gradient-card border border-border/60">
          <div className="relative min-h-[320px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=70"
              alt="Vantage claims platform in use"
              className="absolute inset-0 h-full w-full object-cover"
              data-parallax-img
            />
            <div className="absolute inset-0 bg-background/45" />
          </div>
          <div className="p-10 md:p-14">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Case study — Vantage
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight font-semibold" data-reveal-child>
              A 14-year-old claims system, re-platformed with zero downtime.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-lg" data-reveal-child>
              Eleven months, strangler pattern, both systems live in parallel until parity was proven.
              The old vendor said it would take three years.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6" data-reveal-child>
              {[
                { v: "62%", l: "faster claim processing" },
                { v: "0", l: "minutes of downtime" },
                { v: "3.4×", l: "release frequency" },
              ].map((m) => (
                <div key={m.l}>
                  <div className="font-display text-3xl font-semibold text-gradient-lime" data-counter>{m.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
            <Link to="/works" className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-semibold text-lime" data-reveal-child>
              Read the full case study <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials
        items={[
          { q: "Their technical depth and communication set a bar our internal team now measures against.", a: "David Kim", r: "VP Engineering, Orbital" },
          { q: "Demo on day 7, exactly as promised. We stopped checking references after week two.", a: "Nadia Rahman", r: "CTO, Vantage" },
          { q: "They solved architecture problems our last vendor couldn't even scope.", a: "Tom Barrett", r: "Founder, Cascade" },
        ]}
      />

      <FAQAccordion
        faqs={[
          { q: "What technology stacks do you use?", a: "TypeScript, React, Node, Go, and Postgres on AWS or GCP. We pick stacks you can hire for locally — not whatever is trending this quarter." },
          { q: "Who owns the IP?", a: "You do, in writing, from the contract's first page. Full repo and infra handover at delivery — no hostage code, no licensing tail." },
          { q: "How do you handle data security?", a: "Encryption at rest and in transit, least-privilege access, dependency scanning on CI, and SOC2 / HIPAA / GDPR-ready practices when you need auditors satisfied." },
          { q: "Can you scale the team?", a: "Pods flex from 2 to 8 seniors with two weeks' notice — up for a launch push, down after. You never pay for bench." },
        ]}
      />

      <CTABand
        eyebrow="Next step"
        title="Bring us the system nobody wants to touch."
        subtitle="A 45-minute technical scoping call. You leave with an architecture sketch, a realistic timeline, and a number — whether or not you hire us."
        primary={{ label: "Book a Scoping Call", to: "/contact" }}
        secondary={{ label: "See Shipped Work", to: "/works" }}
      />
    </SiteShell>
  );
}
