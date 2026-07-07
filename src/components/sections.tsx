import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Quote } from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}>
      <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
        {eyebrow}
      </p>
      <h2
        className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
        data-reveal
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-6 text-lg text-muted-foreground ${center ? "mx-auto" : ""}`}
          data-reveal
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FeatureGrid({
  eyebrow,
  title,
  subtitle,
  items,
  cols = 4,
  gold,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  items: { icon: IconType; title: string; desc: string }[];
  cols?: 2 | 3 | 4;
  gold?: boolean;
}) {
  const colClass =
    cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={`grid gap-4 ${colClass}`}>
        {items.map((it) => (
          <div
            key={it.title}
            className={`group lift shine rounded-2xl p-7 ${
              gold ? "gradient-card-gold" : "gradient-card"
            } hover:border-lime/30`}
            data-reveal-child
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-lime/25 to-transparent border border-lime/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              <it.icon className="h-5 w-5 text-lime" />
            </div>
            <h3 className="mt-7 font-display text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProcessSteps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: ReactNode;
  steps: { n: string; t: string; d: string }[];
}) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
            {title}
          </h2>
        </div>
        <div className="space-y-3">
          {steps.map((p) => (
            <div
              key={p.n}
              className="glass lift rounded-2xl p-6 flex gap-5"
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
  );
}

export function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="container-page py-20 border-t border-border/60" data-reveal-group>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="gradient-card lift rounded-2xl p-8 text-center"
            data-reveal-child
          >
            <div className="font-display text-4xl md:text-5xl font-semibold text-gradient-lime">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials({
  items,
}: {
  items: { q: string; a: string; r: string }[];
}) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <SectionHead eyebrow="What partners say" title="Trusted by founders and product leaders." />
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <blockquote key={t.a} className="gradient-card lift rounded-2xl p-7" data-reveal-child>
            <Quote className="h-6 w-6 text-lime/70" />
            <p className="mt-4 font-display text-lg leading-relaxed">"{t.q}"</p>
            <footer className="mt-6 pt-6 border-t border-white/10">
              <div className="font-semibold text-sm">{t.a}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.r}</div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            FAQ
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
            Answers to common questions.
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass rounded-2xl p-6 group" data-reveal-child>
              <summary className="font-display text-lg font-semibold cursor-pointer flex items-center justify-between list-none">
                {f.q}
                <span className="text-lime transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABand({
  eyebrow = "Let's build",
  title = "Have a project in mind?",
  subtitle = "Tell us about it. We reply within one business day with a plan, a timeline, and a fair budget.",
  primary = { label: "Start a Project", to: "/contact" },
  secondary = { label: "Book Discovery Call", to: "/contact" },
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="container-page py-24" data-reveal>
      <div className="relative overflow-hidden rounded-3xl gradient-card p-12 md:p-20 border border-lime/20">
        <div className="absolute inset-0 grain-bg pointer-events-none" />
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none animate-float"
          style={{ background: "var(--gradient-lime)", filter: "blur(80px)" }}
        />
        <div className="relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime">{eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl md:text-7xl leading-[0.95] font-semibold">
            {title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">{subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={primary.to}
              className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
            >
              {primary.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to={secondary.to}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: ReactNode;
  items: { title: string; desc: string }[];
}) {
  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
            {title}
          </h2>
        </div>
        <div className="space-y-4">
          {items.map((f) => (
            <div key={f.title} className="glass lift rounded-2xl p-6 flex gap-4" data-reveal-child>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime/15 border border-lime/25">
                <Check className="h-4 w-4 text-lime" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
