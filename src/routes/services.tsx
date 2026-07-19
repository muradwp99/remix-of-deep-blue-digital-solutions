import { useEffect } from "react";
import type { CSSProperties } from "react";
import { cmsFindOne, pageStr, type SitePageDoc } from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { EclipseScene } from "@/components/eclipse-scene";
import { BentoShowcase } from "@/components/bento-features";
import { gsap } from "@/lib/animations";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Compass,
  Hammer,
  Palette,
  PenTool,
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "services");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Services — Auxtech');
    const description = pageStr(d, "meta_description", 'Design, engineering and growth — every capability under one roof.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServicesPage,
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// services.tsx is themeless (flagship gold) — a plain .block-deep wrapper
// would resolve --block-bold-deep to the gold-hued deep, not navy. Scoped
// local override, same pattern themes.ts uses per-page; never touches
// styles.css :root.
const NAVY_DEEP_OVERRIDE = {
  "--block-bold-deep": "oklch(0.16 0.073 268)", // navy·900
} as CSSProperties;

const groups = [
  {
    index: "01",
    tag: "Design",
    icon: Palette,
    title: "Design that earns trust at first glance.",
    desc: "Interfaces, identities and systems that look inevitable — and quietly do the selling for you.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    items: [
      { title: "UI/UX Design", desc: "Product interfaces, user flows, prototypes." },
      { title: "Brand Identity", desc: "Logo systems, guidelines, brand assets." },
      { title: "Design Systems", desc: "Scalable component libraries and tokens." },
      { title: "Motion & Prototyping", desc: "Interactive, animated concept work." },
    ],
  },
  {
    index: "02",
    tag: "Development",
    icon: Code2,
    title: "Engineering built to outlast the launch.",
    desc: "Custom-built, performance-obsessed software across web, mobile and AI — no template shortcuts.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    items: [
      { title: "Website Development", desc: "Marketing and corporate websites, custom-built." },
      { title: "CMS Based Websites", desc: "Sanity, Webflow, WordPress, Contentful." },
      { title: "Web Applications", desc: "Dashboards, portals, custom SaaS tools." },
      { title: "Mobile App Development", desc: "iOS, Android, React Native, Flutter." },
      { title: "API & Backend", desc: "Node, Go, Postgres, edge-first architectures." },
      { title: "AI Integrations", desc: "LLM features, RAG, agent workflows." },
    ],
  },
  {
    index: "03",
    tag: "Ongoing",
    icon: TrendingUp,
    title: "A partner long after the confetti drops.",
    desc: "Care plans and growth loops that keep compounding value months after launch day.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    items: [
      { title: "Monthly Care Plans", desc: "Maintenance, uptime, updates, small improvements." },
      { title: "Performance & SEO", desc: "Core Web Vitals, technical SEO, schema." },
      { title: "Security & Compliance", desc: "Audits, hardening, SOC2 readiness." },
      { title: "Analytics & CRO", desc: "Measurement, experimentation, iteration." },
    ],
  },
];

const processSteps = [
  {
    n: "01",
    icon: Compass,
    title: "Discover",
    desc: "A focused kickoff week — we map your users, audit what exists and agree on what winning looks like.",
    points: ["Stakeholder workshop", "Technical audit", "Scope & roadmap"],
  },
  {
    n: "02",
    icon: PenTool,
    title: "Design",
    desc: "Flows before pixels. You review real, clickable prototypes — never static promises.",
    points: ["User flows", "UI direction", "Clickable prototype"],
  },
  {
    n: "03",
    icon: Hammer,
    title: "Build",
    desc: "Weekly sprints with a live preview link from day one. You watch it come together, not wait for a reveal.",
    points: ["Weekly sprints", "Live preview links", "QA & accessibility"],
  },
  {
    n: "04",
    icon: Rocket,
    title: "Launch & grow",
    desc: "A zero-drama launch with analytics wired in — then a care plan keeps shipping improvements.",
    points: ["Zero-drama launch", "Analytics wired in", "Care plan handoff"],
  },
];

const toolsEngineering = [
  "React", "Next.js", "TypeScript", "TanStack", "Node.js", "Go",
  "PostgreSQL", "GraphQL", "Flutter", "React Native", "Swift", "AWS",
];
const toolsDesign = [
  "Figma", "Framer", "GSAP", "Three.js", "Tailwind CSS", "Sanity",
  "Contentful", "Webflow", "Vercel", "Stripe", "OpenAI", "Supabase",
];

const models = [
  {
    name: "Fixed scope",
    tagline: "For well-defined projects",
    price: "From $6,500",
    unit: "per project",
    features: [
      "Defined deliverables & timeline",
      "Fixed price, no surprises",
      "Weekly progress previews",
      "30-day post-launch support",
    ],
    featured: false,
  },
  {
    name: "Monthly partner",
    tagline: "Most popular",
    price: "From $1,200",
    unit: "per month",
    features: [
      "Ongoing design + development",
      "Priority response times",
      "Performance & SEO monitoring",
      "Pause or scale any month",
    ],
    featured: true,
  },
  {
    name: "Embedded team",
    tagline: "For scaling products",
    price: "Custom",
    unit: "quarterly",
    features: [
      "Designers & engineers in your team",
      "Your tools, your rituals",
      "Dedicated project lead",
      "Quarterly planning together",
    ],
    featured: false,
  },
];

const outcomes = [
  { value: 38, suffix: "%", decimals: 0, label: "Average conversion lift after a Auxtech rebuild" },
  { value: 2.1, suffix: "s", decimals: 1, label: "Median LCP across sites we ship and maintain" },
  { value: 4.9, suffix: "", decimals: 1, label: "Average client rating across 120+ projects" },
  { value: 24, suffix: "h", decimals: 0, label: "Response SLA on every active care plan" },
];

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

function useServicesMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        stack: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { motion, stack } = ctx.conditions as { motion: boolean; stack: boolean };
        if (!motion) return;

        // Hero entrance — badge, heading, copy, CTAs cascade in
        gsap.fromTo(
          "[data-hero-item]",
          { opacity: 0, y: 36, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.05, ease: "power4.out", stagger: 0.12, delay: 0.15 },
        );

        // Eclipse rises with the page, then lags behind the scroll (parallax)
        gsap.fromTo(
          "[data-eclipse]",
          { opacity: 0, y: 110 },
          { opacity: 1, y: 0, duration: 1.9, ease: "power3.out", delay: 0.4 },
        );
        gsap.to("[data-eclipse]", {
          yPercent: 26,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });

        // Hero exit — copy drifts up and dissolves as you scroll away
        gsap.to("[data-hero-copy]", {
          opacity: 0,
          y: -64,
          scale: 0.97,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "60% top", scrub: true },
        });

        // Stat cards — 3D tip-in on enter, reverse out when scrolled past
        gsap.fromTo(
          "[data-stat-card]",
          { opacity: 0, y: 70, rotateX: -10, transformPerspective: 900 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: "[data-stat-row]",
              start: "top 92%",
              toggleActions: "play reverse play reverse",
            },
          },
        );

        // Count-up numbers
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = parseFloat(el.dataset.count ?? "0");
          const decimals = Number(el.dataset.decimals ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
            onUpdate: () => {
              el.textContent = state.v.toFixed(decimals) + suffix;
            },
          });
        });

        // Service panels rise in — transform/opacity only, and never the same
        // properties the deck scrub animates, so the tweens can't fight
        gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 88%" },
            },
          );
        });

        // Process line draws with scroll
        gsap.utils.toArray<HTMLElement>("[data-process-line]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
            },
          );
        });

        // Stacked deck — as the next panel arrives, the pinned one recedes.
        // Scrubbing filter/opacity on these huge glass panels repaints their
        // backdrop-filter children every frame and stutters; instead scrub
        // only the card's scale plus a cheap dim-overlay's opacity.
        // Desktop only: on mobile panels flow normally.
        if (stack) {
          const panels = gsap.utils.toArray<HTMLElement>(".svc-panel");
          panels.forEach((panel, i) => {
            const card = panel.querySelector<HTMLElement>(".svc-card");
            const dim = panel.querySelector<HTMLElement>(".svc-dim");
            const next = panels[i + 1];
            if (!card || !next) return;
            const tl = gsap.timeline({
              scrollTrigger: { trigger: next, start: "top 92%", end: "top 28%", scrub: true },
            });
            tl.to(card, { scale: 0.94, transformOrigin: "center top", ease: "none" }, 0);
            if (dim) tl.to(dim, { opacity: 1, ease: "none" }, 0);
          });
        }
      },
    );
    return () => mm.revert();
  }, []);
}

/* ------------------------------------------------------------------ */
/* Hero stat cards                                                     */
/* ------------------------------------------------------------------ */

function StatCardNetwork() {
  return (
    <div data-stat-card className="glass glare-card rounded-3xl p-8 relative overflow-hidden">
      <p className="font-display text-5xl md:text-6xl font-semibold leading-none">
        <span data-count="120" data-suffix="+">120+</span>
      </p>
      <p className="mt-3 text-sm text-muted-foreground max-w-[16rem]">
        Projects shipped across 14 industries
      </p>
      <div className="mt-8 relative h-28" aria-hidden="true">
        <svg viewBox="0 0 320 120" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
          <path d="M0 96h70V44h96v40h154" stroke="oklch(1 0 0 / 0.10)" strokeWidth="1.5" />
          <path d="M36 120V70h118V22h120" stroke="oklch(1 0 0 / 0.07)" strokeWidth="1.5" />
          <circle cx="70" cy="44" r="3.5" fill="oklch(1 0 0 / 0.25)" />
          <circle cx="166" cy="84" r="3.5" fill="oklch(1 0 0 / 0.25)" />
          <circle cx="154" cy="70" r="3.5" fill="oklch(1 0 0 / 0.18)" />
          <circle cx="244" cy="22" r="4.5" fill="oklch(0.82 0.14 90)" />
          <circle cx="244" cy="22" r="10" stroke="oklch(0.82 0.14 90 / 0.35)" />
        </svg>
        <span className="absolute left-2 top-0 inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/90">
          <Plus className="h-3 w-3 text-gold" />
          40% faster delivery
        </span>
      </div>
    </div>
  );
}

function StatCardGrid() {
  return (
    <div data-stat-card className="glass glare-card rounded-3xl p-8 relative overflow-hidden">
      <p className="font-display text-5xl md:text-6xl font-semibold leading-none">
        <span data-count="98" data-suffix="%">98%</span>
      </p>
      <p className="mt-3 text-sm text-muted-foreground max-w-[16rem]">
        Client retention, year over year
      </p>
      <div className="mt-8 grid grid-cols-8 gap-1.5" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) =>
          i === 4 ? (
            <span key={i} className="grid aspect-square place-items-center rounded-lg bg-gold text-gold-foreground">
              <Check className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span key={i} className="aspect-square rounded-lg border border-white/10" />
          ),
        )}
      </div>
    </div>
  );
}

function StatCardSteps() {
  return (
    <div data-stat-card className="glass glare-card rounded-3xl p-8 relative overflow-hidden">
      <p className="font-display text-5xl md:text-6xl font-semibold leading-none">3×</p>
      <p className="mt-3 text-sm text-muted-foreground max-w-[16rem]">
        Faster releases on our design systems
      </p>
      <div className="mt-8 space-y-5" aria-hidden="true">
        <div className="flex justify-end gap-2 flex-col items-end">
          <span className="h-2 w-28 rounded-full bg-white/10" />
          <span className="h-2 w-16 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) =>
            n === 3 ? (
              <span
                key={n}
                className="grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground text-sm font-semibold -translate-y-1.5 shadow-[0_14px_34px_-10px_oklch(0.8_0.13_88_/_0.7)]"
              >
                {n}
              </span>
            ) : (
              <span key={n} className="grid h-9 w-9 place-items-center rounded-full glass text-xs text-foreground/70">
                {n}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function ServicesPage() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  useServicesMotion();
  return (
    <SiteShell>
      {/* ---- Hero (Teco-style, on-brand) ---- */}
      <section data-hero className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 grain-bg pointer-events-none" />
        <div
          className="absolute inset-x-0 top-0 h-100 pointer-events-none opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="eclipse-stars" aria-hidden="true" />

        <div data-hero-copy className="container-page relative z-10 pt-32 md:pt-40 pb-6 text-center">
          <div data-hero-item className="flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-sm text-foreground/85">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/15">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
              </span>
              {s("hero_badge", "The full stack, under one roof.")}
            </span>
          </div>
          <h1
            data-hero-item
            className="mx-auto mt-8 max-w-4xl font-display text-5xl md:text-7xl leading-[0.98] font-semibold"
          >
            {s("hero_title", "Every capability you need to")} <em className="not-italic text-gradient">{s("hero_title_em", "ship")}</em> {s("hero_title_after", "and scale.")}
          </h1>
          <p data-hero-item className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {s("hero_subtitle", "From first sketch to long-term partnership — design, engineering and growth under one roof.")}
          </p>
          <div data-hero-item className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:brightness-105"
            >
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/works"
              className="group inline-flex items-center gap-2 rounded-full glass shine px-7 py-3.5 text-sm font-medium hover:bg-white/5"
            >
              See our work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div data-eclipse className="eclipse-stage h-44 md:h-64" aria-hidden="true">
          <EclipseScene />
        </div>

        <div data-stat-row className="container-page relative z-10 pb-24 grid md:grid-cols-3 gap-5">
          <StatCardNetwork />
          <StatCardGrid />
          <StatCardSteps />
        </div>
      </section>

      {/* ---- Services: stacking glass deck ---- */}
      <section className="container-page py-24 md:py-32">
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              What we do
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl md:text-6xl leading-tight" data-split>
              Three disciplines, one team.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground" data-reveal>
            Keep scrolling — each practice stacks onto the last, the same way our work compounds for clients.
          </p>
        </div>

        <div className="space-y-10 md:space-y-28">
          {groups.map((g, i) => (
            <div
              key={g.tag}
              className="svc-panel md:sticky"
              style={{ top: `${104 + i * 16}px`, zIndex: 10 + i }}
            >
              <article className="svc-card relative glass rounded-4xl overflow-hidden shadow-[var(--shadow-panel)]">
                <div className="svc-dim" aria-hidden="true" />
                <img src={g.img} alt={g.tag} className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
                <div className="relative p-8 md:p-12">
                  <div
                    aria-hidden="true"
                    className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25 pointer-events-none"
                    style={{ background: "radial-gradient(circle, oklch(0.8 0.13 88 / 0.5), transparent 70%)" }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-8 font-display text-[5rem] md:text-[8rem] leading-none font-semibold text-white/5 select-none pointer-events-none"
                  >
                    {g.index}
                  </span>

                  <div className="relative grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-4">
                      <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold">
                        <g.icon className="h-3.5 w-3.5" />
                        {g.tag}
                      </span>
                      <h3 className="mt-6 font-display text-3xl md:text-5xl leading-tight">{g.title}</h3>
                      <p className="mt-4 text-muted-foreground">{g.desc}</p>
                      <Link
                        to="/contact"
                        className="link-underline mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90"
                      >
                        Scope this with us
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="md:col-span-8 grid sm:grid-cols-2 gap-4" data-reveal-group>
                      {g.items.map((s, j) => (
                        <div
                          key={s.title}
                          data-reveal-child
                          className="group glass glare-card lift rounded-2xl p-6 relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-[11px] tracking-widest text-gold/80 tabular-nums">
                              {g.index}.{j + 1}
                            </span>
                            <ArrowUpRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:text-gold transition-all" />
                          </div>
                          <h4 className="mt-4 font-display text-xl md:text-2xl">{s.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ---- New section 1: Process ---- */}
      <section className="block-deep border-t border-border/60" style={NAVY_DEEP_OVERRIDE}>
        <div className="container-page py-24 md:py-32 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                How we work
              </p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight" data-split>
                A process tuned for momentum.
              </h2>
              <p className="mt-5 text-muted-foreground" data-reveal>
                No black boxes, no big reveals. You see the work every week, on a live link, from the first sprint.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 relative">
            <div data-process-line className="process-line hidden sm:block" aria-hidden="true" />
            <div className="space-y-5">
              {processSteps.map((step) => (
                <div key={step.n} className="relative sm:pl-14" data-reveal>
                  <span
                    aria-hidden="true"
                    className="hidden sm:block absolute left-0 top-9 h-4 w-4 rounded-full bg-surface border-2 border-gold/80 shadow-[0_0_0_4px_oklch(0.82_0.14_90_/_0.12)]"
                  />
                  <div className="glass glare-card rounded-2xl p-7 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/12 text-gold shrink-0">
                        <step.icon className="h-5 w-5" />
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-[11px] tracking-widest text-gold/80 tabular-nums">{step.n}</span>
                        <h3 className="font-display text-2xl md:text-3xl">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm md:text-base text-muted-foreground">{step.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {step.points.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-foreground/80"
                        >
                          <Check className="h-3 w-3 text-gold" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- New section 2: Toolbox marquee ---- */}
      <section className="border-t border-border/60 py-20 md:py-24 overflow-hidden">
        <div className="container-page mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Toolbox
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl" data-split>
              The stack behind the studio.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
            Boring where it should be boring, sharp where it wins — chosen per project, never by habit.
          </p>
        </div>
        <div className="space-y-4">
          <div className="marquee">
            <div className="marquee-track">
              {[...toolsEngineering, ...toolsEngineering].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="mr-3 inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm text-foreground/90 whitespace-nowrap"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="marquee">
            <div className="marquee-track marquee-track-rev">
              {[...toolsDesign, ...toolsDesign].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="mr-3 inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm text-foreground/90 whitespace-nowrap"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Delivery infrastructure: illustrated bento ---- */}
      <div className="block-deep" style={NAVY_DEEP_OVERRIDE}>
        <BentoShowcase
          eyebrow="Delivery infrastructure"
          title={
            <>
              Every engagement ships with an <em className="not-italic font-medium text-gold">operating system</em>.
            </>
          }
          subtitle="The pipelines, gates, and rituals below aren't add-ons — they're standing infrastructure on every project we take."
          cards={[
            {
              title: "Performance, budgeted",
              desc: "A 98 median Lighthouse score at launch — enforced in CI, not chased after the retro.",
              tone: "warm",
              visual: { kind: "gauge", stat: "98", statLabel: "median Lighthouse at launch", value: 0.98 },
            },
            {
              title: "Quality gates on every merge",
              desc: "Peer review, end-to-end tests, and accessibility audits run before code reaches your staging URL.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["Peer review approved", "E2E tests passed", "A11y audit clean"],
              },
            },
            {
              title: "Radical transparency",
              desc: "You're in the room where it happens: every push, demo, and sprint report lands in your inbox as it happens.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 4 },
                  { label: "Deploys", count: 2, active: true },
                  { label: "Reports", count: 1 },
                ],
                rows: [
                  "Nadia pushed to staging",
                  "Friday demo scheduled",
                  "Sprint 6 report ready",
                ],
              },
            },
            {
              title: "Ops on demand",
              desc: "Preview environments, load tests, and secret rotation — one command away for your team as much as ours.",
              tone: "warm",
              visual: {
                kind: "command",
                actions: [
                  { label: "Spin Up Preview Env", kbd: "P" },
                  { label: "Run Load Test", kbd: "L" },
                  { label: "Rotate Secrets", kbd: "R" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- New section 3: Engagement models ---- */}
      <section className="border-t border-border/60">
        <div className="container-page py-24 md:py-32">
          <div className="mb-14 md:mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Engagement
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl md:text-5xl leading-tight" data-split>
              Three ways to work with us.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-stretch" data-reveal-group>
            {models.map((m) => (
              <div
                key={m.name}
                data-reveal-child
                className={`relative flex flex-col rounded-3xl p-8 lift ${
                  m.featured ? "block-bold glare-card shadow-panel lg:-my-5 lg:p-10" : "glass glare-card"
                }`}
              >
                {m.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-gold-foreground shadow-[0_10px_30px_-10px_oklch(0.8_0.13_88_/_0.8)]">
                    Most popular
                  </span>
                )}
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{m.tagline}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{m.name}</h3>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-3xl md:text-4xl font-semibold">{m.price}</span>
                  <span className="text-sm text-muted-foreground">{m.unit}</span>
                </p>
                <ul className="mt-7 space-y-3 text-sm text-foreground/85">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto block pt-8">
                  <span
                    className={`block rounded-full px-4 py-3 text-center text-sm font-medium transition-colors ${
                      m.featured
                        ? "bg-gold text-gold-foreground hover:brightness-105"
                        : "btn-navy hover:border-gold/40"
                    }`}
                  >
                    Talk to us
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground" data-reveal>
            Need exact numbers?{" "}
            <Link to="/pricing" className="link-underline text-foreground/90">
              See the full pricing breakdown
            </Link>
          </p>
        </div>
      </section>

      {/* ---- New section 4a: Outcomes stats ---- */}
      <section className="block-bold border-t border-border/60">
        <div className="container-page py-24 md:py-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12" data-reveal-group>
            {outcomes.map((o) => (
              <div key={o.label} data-reveal-child>
                <p className="font-display text-4xl md:text-5xl font-semibold text-gradient">
                  <span data-count={o.value} data-suffix={o.suffix} data-decimals={o.decimals}>
                    {o.value.toFixed(o.decimals)}
                    {o.suffix}
                  </span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground max-w-[15rem]">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- New section 4b: Closing CTA ---- */}
      <section className="block-deep border-t border-border/60" style={NAVY_DEEP_OVERRIDE}>
        <div className="container-page py-24 md:py-32">
          <div className="relative overflow-hidden rounded-4xl glass-strong p-10 md:p-16 text-center" data-reveal>
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-160 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, oklch(0.8 0.13 88 / 0.35), transparent 70%)" }}
            />
            <p className="relative text-xs uppercase tracking-[0.28em] text-gold">Next step</p>
            <h2 className="relative mx-auto mt-4 max-w-2xl font-display text-4xl md:text-6xl leading-tight" data-split>
              Let's scope your project this week.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-muted-foreground">
              A 30-minute call, a clear recommendation and a fixed quote — whether or not you build with us.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:brightness-105"
              >
                Book a discovery call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full glass shine px-7 py-3.5 text-sm font-medium hover:bg-white/5"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
