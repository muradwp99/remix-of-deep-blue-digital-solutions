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
  variant = "cards",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  items: { icon: IconType; title: string; desc: string }[];
  cols?: 2 | 3 | 4;
  gold?: boolean;
  /**
   * Layout shape. Use different variants on sibling pages so the "features"
   * section doesn't read as the same icon-card grid everywhere.
   * - cards    : icon cards grid (default)
   * - rows     : editorial numbered rows, hairline dividers, no cards
   * - spotlight: oversized lead feature + smaller supporting cards
   */
  variant?: "cards" | "rows" | "spotlight";
}) {
  const colClass =
    cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="container-page py-24 border-t border-border/60" data-reveal-group>
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />

      {variant === "rows" ? (
        <div className="border-t border-border">
          {items.map((it, i) => (
            <div
              key={it.title}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.5fr)] md:items-baseline md:gap-8"
              data-reveal-child
            >
              <span className="font-display text-2xl font-semibold tabular-nums text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold">{it.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      ) : variant === "spotlight" ? (
        <div className="grid gap-4 md:grid-cols-3" data-cards>
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`group glare-card lift shine relative flex flex-col overflow-hidden rounded-2xl p-7 ${
                gold ? "gradient-card-gold" : "gradient-card"
              } hover:border-lime/30 ${i === 0 ? "md:col-span-3 lg:col-span-2 lg:row-span-2" : ""}`}
              data-card
            >
              {i === 0 && (
                <it.icon
                  className="pointer-events-none absolute -bottom-8 -right-6 h-48 w-48 text-lime opacity-[0.07] transition-transform duration-700 group-hover:scale-105"
                  aria-hidden
                />
              )}
              <div
                className={`relative grid place-items-center rounded-xl border border-lime/20 bg-gradient-to-br from-lime/25 to-transparent transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                  i === 0 ? "h-14 w-14" : "h-12 w-12"
                }`}
              >
                <it.icon className={i === 0 ? "h-6 w-6 text-lime" : "h-5 w-5 text-lime"} />
              </div>
              <h3 className={`relative mt-7 font-display font-semibold ${i === 0 ? "text-3xl" : "text-xl"}`}>
                {it.title}
              </h3>
              <p className={`relative mt-2 text-muted-foreground ${i === 0 ? "text-base" : "text-sm"}`}>
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 ${colClass}`} data-cards>
          {items.map((it) => (
            <div
              key={it.title}
              className={`group glare-card lift shine rounded-2xl p-7 ${
                gold ? "gradient-card-gold" : "gradient-card"
              } hover:border-lime/30`}
              data-card
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-lime/25 to-transparent border border-lime/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <it.icon className="h-5 w-5 text-lime" />
              </div>
              <h3 className="mt-7 font-display text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProcessSteps({
  eyebrow,
  title,
  steps,
  variant = "cards",
}: {
  eyebrow: string;
  title: ReactNode;
  steps: { n: string; t: string; d: string }[];
  /**
   * - cards : two-column, numbered glass cards on the right (default)
   * - rail  : horizontal numbered timeline across a row
   * - ladder: full-width vertical list with oversized step numbers
   */
  variant?: "cards" | "rail" | "ladder";
}) {
  if (variant === "rail") {
    const railCols = steps.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
    return (
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
            {title}
          </h2>
        </div>
        <div className={`grid gap-10 ${railCols}`}>
          {steps.map((p) => (
            <div key={p.n} className="border-t border-border pt-6" data-reveal-child>
              <span className="font-display text-4xl font-semibold tabular-nums text-lime">{p.n}</span>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "ladder") {
    return (
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
            {title}
          </h2>
        </div>
        <div className="border-t border-border">
          {steps.map((p) => (
            <div
              key={p.n}
              className="grid gap-3 border-b border-border py-8 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-10"
              data-reveal-child
            >
              <span className="font-display text-5xl font-semibold leading-none tabular-nums text-lime/80">
                {p.n}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold">{p.t}</h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-cards>
        {stats.map((s) => (
          <div
            key={s.label}
            className="glare-card gradient-card lift rounded-2xl p-8 text-center"
            data-card
          >
            <div
              className="font-display text-4xl md:text-5xl font-semibold text-gradient-lime"
              data-counter
            >
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
      <div className="grid md:grid-cols-3 gap-6" data-cards data-cards-stagger="0.12">
        {items.map((t) => (
          <blockquote key={t.a} className="glare-card gradient-card lift rounded-2xl p-7" data-card>
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

export function FAQAccordion({
  faqs,
  variant = "split",
}: {
  faqs: { q: string; a: string }[];
  /**
   * - split: two-column, heading left / accordion right (default)
   * - wide: centered heading over a single full-width accordion column
   */
  variant?: "split" | "wide";
}) {
  const list = (
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
  );

  if (variant === "wide") {
    return (
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              FAQ
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              Answers to common questions.
            </h2>
          </div>
          {list}
        </div>
      </section>
    );
  }

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
        {list}
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
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
            >
              {primary.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to={secondary.to}
              data-magnetic="0.25"
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
  variant = "list",
}: {
  eyebrow: string;
  title: ReactNode;
  items: { title: string; desc: string }[];
  /**
   * - list: two-column, checklist of glass rows on the right (default)
   * - grid: full-width heading over a card grid of benefits
   */
  variant?: "list" | "grid";
}) {
  if (variant === "grid") {
    return (
      <section className="container-page py-24 border-t border-border/60" data-reveal-group>
        <SectionHead eyebrow={eyebrow} title={title} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-cards>
          {items.map((f) => (
            <div key={f.title} className="glare-card gradient-card lift rounded-2xl p-7" data-card>
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-lime/25 bg-lime/15">
                <Check className="h-4 w-4 text-lime" />
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
