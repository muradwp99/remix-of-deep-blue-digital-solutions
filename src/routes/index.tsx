import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Hero3D } from "@/components/hero-3d";
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Layers,
  Code2,
  Palette,
  Smartphone,
  Brain,
  ShoppingCart,
  Building2,
  Stethoscope,
  Coins,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northline — Premium Software Agency" },
      {
        name: "description",
        content:
          "Boutique software studio designing and engineering websites, apps, ecommerce, and SaaS products for ambitious teams.",
      },
    ],
  }),
  component: HomePage,
});

const clients = ["Meridian", "Halcyon", "Northwind", "Orbital", "Cascade", "Vantage", "Ridgeline"];

const capabilities = [
  { icon: Code2, title: "Custom Software", desc: "Web platforms engineered for speed, scale and reliability." },
  { icon: Palette, title: "UI/UX Design", desc: "Interfaces that feel obvious. Systems that scale." },
  { icon: Smartphone, title: "Mobile Apps", desc: "iOS, Android, and cross-platform, built to ship." },
  { icon: Brain, title: "AI Solutions", desc: "LLM-powered workflows integrated where it matters." },
];

const solutions = [
  { icon: ShoppingCart, title: "Ecommerce", desc: "Headless and platform stores that convert." },
  { icon: Layers, title: "SaaS Products", desc: "MVP to scale — auth, billing, dashboards." },
  { icon: Building2, title: "Fintech", desc: "Compliant, secure, and beautifully designed." },
  { icon: Stethoscope, title: "Healthcare", desc: "HIPAA-ready portals, apps, and dashboards." },
];

const process = [
  { n: "01", t: "Discovery", d: "Deep-dive workshops to align on goals, users, and success metrics." },
  { n: "02", t: "Design", d: "Wireframes, prototypes, and pixel-perfect interfaces validated with users." },
  { n: "03", t: "Build", d: "Engineering-first execution with weekly demos and transparent progress." },
  { n: "04", t: "Scale", d: "Launch, measure, iterate. Long-term partnership beyond delivery." },
];

const work = [
  {
    name: "Northwind SaaS",
    tag: "SaaS Rebrand",
    result: "+184% signups",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Halcyon Health",
    tag: "Mobile App",
    result: "4.9★ App Store",
    img: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Meridian Retail",
    tag: "Ecommerce",
    result: "3.1× revenue",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=70",
  },
  {
    name: "Orbital Cloud",
    tag: "Marketing Site",
    result: "98 Lighthouse",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=70",
  },
];

const testimonials = [
  {
    q: "Northline shipped in weeks what our previous partner promised in quarters. The bar for craft is off the charts.",
    a: "Emily Carter",
    r: "CTO, Northwind",
  },
  {
    q: "They think like founders. Every trade-off was made with our business outcome in mind — rare and invaluable.",
    a: "Marcus Chen",
    r: "Founder, Halcyon",
  },
  {
    q: "The team is genuinely senior. Code quality, design polish, communication — all top-tier.",
    a: "Priya Shah",
    r: "VP Product, Meridian",
  },
];

const faqs = [
  { q: "How quickly can we start?", a: "Typically within 1–2 weeks. We'll scope discovery and align on a start date on our first call." },
  { q: "Do you work with startups or enterprise?", a: "Both. We tailor process and team composition — the craft standard doesn't change." },
  { q: "What's your pricing model?", a: "Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery." },
  { q: "Who owns the code and IP?", a: "You do. Full transfer on delivery, with clean docs and repository handover." },
  { q: "Do you offer post-launch support?", a: "Yes — 84% of our clients continue on a Care plan for maintenance, iteration, and growth." },
];

function HomePage() {
  return (
    <SiteShell>
      {/* Hero with 3D */}
      <section className="relative overflow-hidden min-h-[100vh]">
        <div className="absolute inset-0 grain-bg pointer-events-none" />
        <div
          className="absolute inset-x-0 top-0 h-[800px] pointer-events-none"
          style={{ background: "var(--gradient-hero)" }}
        />
        <Hero3D />

        <div className="container-page relative pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
            <Sparkles className="h-3.5 w-3.5" />
            Software studio · Est. 2018
          </div>
          <h1
            className="mt-8 font-display text-5xl md:text-8xl leading-[0.92] max-w-5xl font-semibold"
            data-reveal
          >
            We build <span className="text-gradient-lime italic">premium</span> software
            <br /> for teams shaping what's next.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground" data-reveal>
            Northline is a boutique studio of designers and engineers. We partner
            with founders and product teams to ship websites, apps, and digital
            products with a craft-first standard.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-lime-foreground hover:brightness-110 transition"
            >
              Book a Call
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/works"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium text-foreground hover:bg-white/5"
            >
              View our work
            </Link>
          </div>

          <div
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
            data-reveal-group
          >
            {[
              { k: "150+", v: "Products shipped" },
              { k: "50+", v: "Enterprise clients" },
              { k: "98%", v: "Client retention" },
              { k: "15+", v: "Industry verticals" },
            ].map((s) => (
              <div
                key={s.v}
                className="glass rounded-2xl p-6"
                data-reveal-child
              >
                <div className="font-display text-4xl md:text-5xl font-semibold text-gradient-lime">
                  {s.k}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients marquee */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="container-page py-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Trusted by teams at
          </span>
          {clients.map((c) => (
            <span key={c} className="font-display text-2xl font-medium text-foreground/70">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="container-page py-28" data-reveal-group>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Core capabilities
            </p>
            <h2
              className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-2xl font-semibold"
              data-reveal-child
            >
              End-to-end services, delivered by one senior team.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm text-foreground hover:text-lime inline-flex items-center gap-1.5"
            data-reveal-child
          >
            All services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="group gradient-card rounded-2xl p-7 hover:border-lime/30 transition-all hover:-translate-y-1"
              data-reveal-child
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-accent/20 border border-white/10">
                <c.icon className="h-5 w-5 text-lime" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            Industry solutions
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold" data-reveal-child>
            Purpose-built for the industries we know deeply.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="gradient-card-gold rounded-2xl p-7 hover:-translate-y-1 transition-transform"
              data-reveal-child
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-transparent border border-gold/20">
                <s.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              How we work
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              A transparent, iterative process.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md" data-reveal-child>
              Weekly demos, shared boards, and honest trade-offs. No surprises, no
              hand-offs to strangers.
            </p>
          </div>
          <div className="space-y-3">
            {process.map((p) => (
              <div
                key={p.n}
                className="glass rounded-2xl p-6 flex gap-5 hover:bg-white/5 transition-colors"
                data-reveal-child
              >
                <span className="font-display text-3xl font-semibold text-gradient-lime shrink-0">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{p.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Selected work
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Recent case studies.
            </h2>
          </div>
          <Link
            to="/works"
            className="text-sm hover:text-lime inline-flex items-center gap-1.5"
            data-reveal-child
          >
            All works <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {work.map((w) => (
            <div
              key={w.name}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10"
              data-reveal-child
            >
              <img
                src={w.img}
                alt={w.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="relative h-full p-8 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-[0.24em] text-lime">
                  {w.tag}
                </span>
                <div className="mt-2 flex items-end justify-between gap-6">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl font-semibold">
                      {w.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{w.result}</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full glass shrink-0 group-hover:bg-lime group-hover:text-lime-foreground transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Why Northline
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              A studio, not a factory.
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { icon: Zap, title: "Senior team, always", desc: "No juniors farmed out. Principal designers and engineers on every project." },
              { icon: Layers, title: "Design + engineering", desc: "One team, one brief. We build what we design, so quality doesn't fall through." },
              { icon: ShieldCheck, title: "Long-term partners", desc: "84% of our clients continue with a Care plan after launch." },
              { icon: Coins, title: "Transparent pricing", desc: "Clear scope, honest budgets, no surprises. Try the calculator on the left." },
            ].map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 flex gap-5"
                data-reveal-child
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-transparent border border-lime/20">
                  <f.icon className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <p className="text-xs uppercase tracking-[0.28em] text-lime mb-4" data-reveal-child>
          What partners say
        </p>
        <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold mb-14" data-reveal-child>
          Trusted by founders and product leaders.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.a}
              className="gradient-card rounded-2xl p-7"
              data-reveal-child
            >
              <p className="font-display text-lg leading-relaxed">"{t.q}"</p>
              <footer className="mt-6 pt-6 border-t border-white/10">
                <div className="font-semibold text-sm">{t.a}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.r}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Engagement models
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Fair, transparent pricing.
            </h2>
          </div>
          <Link to="/pricing" className="text-sm hover:text-lime inline-flex items-center gap-1.5" data-reveal-child>
            Full pricing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Fixed Price", d: "Defined scope, defined budget. Perfect for launches.", p: "from $8k" },
            { t: "Monthly Retainer", d: "Ongoing partnership with a dedicated pod.", p: "from $9k/mo", featured: true },
            { t: "Dedicated Team", d: "Embedded team scaling with your product.", p: "custom" },
          ].map((tier) => (
            <div
              key={tier.t}
              className={`rounded-2xl p-8 border ${
                tier.featured
                  ? "gradient-card-gold border-lime/30"
                  : "gradient-card border-white/10"
              }`}
              data-reveal-child
            >
              <h3 className="font-display text-2xl font-semibold">{tier.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tier.d}</p>
              <div className="mt-8 font-display text-3xl font-semibold text-gradient-lime">
                {tier.p}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {["Senior team", "Weekly demos", "Full IP transfer"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-lime" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              FAQ
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Answers to common questions.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="glass rounded-2xl p-6 group"
                data-reveal-child
              >
                <summary className="font-display text-lg font-semibold cursor-pointer flex items-center justify-between">
                  {f.q}
                  <span className="text-lime group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-28" data-reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-card p-12 md:p-20 border border-lime/20">
          <div className="absolute inset-0 grain-bg pointer-events-none" />
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none"
            style={{ background: "var(--gradient-lime)", filter: "blur(80px)" }}
          />
          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime">Let's build</p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] font-semibold">
              Have a project in mind?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Tell us about it. We reply within one business day with a plan, a timeline, and a fair budget.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-lime-foreground hover:brightness-110"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
              >
                Book Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
