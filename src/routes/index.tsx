import { createFileRoute, Link } from "@tanstack/react-router";
import {
  cmsFind,
  cmsFindOne,
  cmsMedia,
  projectPlaceholder,
  type CmsProject,
} from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";
import {
  homeDefaults,
  mergeHomeContent,
  type HomeContent,
} from "@/lib/home-content";
import { SiteShell } from "@/components/site-shell";
import { BentoShowcase } from "@/components/bento-features";
import { useScrollReveal } from "@/lib/animations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import {
  ArrowUpRight,
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
  X,
  BadgeCheck,
  Star,
  Bookmark,
  Flame,
  Clock,
  Plus,
} from "lucide-react";

/** Serializable testimonial shape rendered by the home page. */
type HomeTestimonial = { q: string; a: string; r: string; img: string };

export const Route = createFileRoute("/")({
  // All page copy + testimonials are CMS-editable; fails soft to built-ins.
  loader: async (): Promise<{
    cmsTestimonials: HomeTestimonial[];
    home: HomeContent;
  }> => {
    const [docs, homeDoc, projects] = await Promise.all([
      cmsFind<{
        quote?: string | null;
        author?: string | null;
        role?: string | null;
        company?: string | null;
      }>("testimonials", { limit: 6 }),
      cmsFindOne<Partial<HomeContent>>("homepage", "home"),
      cmsFind<CmsProject>("projects", { sort: "-featured", limit: 4 }),
    ]);
    const home = mergeHomeContent(homeDoc);
    // "Selected work" mirrors the Projects collection: add a project in WP,
    // it shows up here (and on /works) automatically. Falls back to the
    // editable cards when the CMS is unreachable.
    if (projects.length) {
      home.work.items = projects.map((p) => ({
        name: p.title,
        tag: p.tag ?? p.industry ?? "",
        result: p.results?.[0]
          ? `${p.results[0].value} ${p.results[0].label}`
          : (p.summary ?? ""),
        img: cmsMedia(p.coverImage) ?? projectPlaceholder(p.slug),
      }));
    }
    return {
      home,
      cmsTestimonials: docs
        .filter((d) => d.quote && d.author)
        .map((d) => ({
          q: d.quote as string,
          a: d.author as string,
          r: [d.role, d.company].filter(Boolean).join(", "),
          // Portraits are not in the CMS — keep the known faces, generic otherwise.
          img:
            testimonialImgs[d.author as string] ??
            `https://i.pravatar.cc/160?u=${encodeURIComponent(d.author as string)}`,
        })),
    };
  },
  head: () => ({
    meta: [
      { title: "Auxtech — Premium Software Agency" },
      {
        name: "description",
        content:
          "Boutique software studio designing and engineering websites, apps, ecommerce, and SaaS products for ambitious teams.",
      },
    ],
  }),
  component: HomePage,
});

/** Icons per section, matched to CMS rows by index (icons never serialize). */
const capabilityIcons = [Code2, Palette, Smartphone, Brain];
const solutionIcons = [ShoppingCart, Layers, Building2, Stethoscope];
const whyIcons = [Zap, Layers, ShieldCheck, Coins];

/** Hero marquee card chrome (backgrounds/avatars stay design-owned, by index). */
const heroCardBg = ["#0c0f18", "#1a0b2e", "#0b1626", "#18181b", "#0a1f16", "#1f1012"];
const heroCardAvatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
];

/** Known portrait per author — CMS carries no avatars. */
const testimonialImgs: Record<string, string> = {
  "Emily Carter": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=70",
  "Marcus Chen": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=70",
  "Priya Shah": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=70",
};

const testimonials = [
  {
    q: "Auxtech shipped in weeks what our previous partner promised in quarters. The bar for craft is off the charts.",
    a: "Emily Carter",
    r: "CTO, Northwind",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=70",
  },
  {
    q: "They think like founders. Every trade-off was made with our business outcome in mind — rare and invaluable.",
    a: "Marcus Chen",
    r: "Founder, Halcyon",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=70",
  },
  {
    q: "The team is genuinely senior. Code quality, design polish, communication — all top-tier.",
    a: "Priya Shah",
    r: "VP Product, Meridian",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=70",
  },
];

function HomePage() {
  useScrollReveal();

  // CMS copy wins when present; homeDefaults is the fail-soft baseline.
  // useLiveEdits overlays as-you-type values from the WP admin (LivePress).
  const { cmsTestimonials, home: hcBase = homeDefaults } = Route.useLoaderData();
  const hc = useLiveEdits(hcBase);
  const quotes = cmsTestimonials.length ? cmsTestimonials : testimonials;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yCards = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  /** Orderable page sections, keyed for CMS-driven ordering + click-to-edit. */
  const sectionBlocks: Record<string, ReactNode> = {
    clients: (
      <>
      {/* Clients marquee */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="container-page py-8 flex items-center gap-10">
          <span className="shrink-0 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {hc.clients.label}
          </span>
          <div className="marquee flex-1">
            <div className="marquee-track">
              {[...hc.clients.names, ...hc.clients.names].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="mx-8 font-display text-2xl font-medium text-foreground/60 whitespace-nowrap"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      </>
    ),
    capabilities: (
      <>
      {/* Capabilities */}
      <section className="container-page py-28" data-reveal-group>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.capabilities.eyebrow}
            </p>
            <h2
              className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-2xl font-semibold"
              data-split
            >
              {hc.capabilities.heading}
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-cards>
          {hc.capabilities.items.map((c, ci) => {
            const CapIcon = capabilityIcons[ci % capabilityIcons.length];
            return (
            <div
              key={c.title}
              className="group glare-card lift gradient-card rounded-2xl p-7"
              data-card
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-accent/20 border border-white/10">
                <CapIcon className="h-5 w-5 text-lime" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
            );
          })}
        </div>
      </section>

      </>
    ),
    stats: (
      <>
      {/* Proof in numbers — bold gold color band, ledger composition */}
      <section className="block-bold" data-reveal-group>
        <div className="container-page py-16 md:py-20">
          <div className="grid divide-y divide-black/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {hc.stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal-child
                className={`flex flex-col justify-between gap-8 py-8 sm:py-4 lg:px-10 ${i === 0 ? "lg:pl-0" : ""} ${i === hc.stats.length - 1 ? "lg:pr-0" : ""}`}
              >
                <div className="font-display text-7xl font-semibold leading-none tracking-tight md:text-8xl" data-counter>
                  {s.value}
                </div>
                <p className="max-w-[22ch] text-sm font-medium leading-snug text-black/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </>
    ),
    bento: (
      <>
      {/* How an engagement feels — illustrated bento */}
      <BentoShowcase
        eyebrow="The Auxtech way"
        title={
          <>
            What working with us actually <span className="text-gold">feels</span> like.
          </>
        }
        subtitle="No status-meeting theater. You watch the product take shape in real time — every build, every deploy, every decision visible."
        cards={[
          {
            title: "Build faster",
            desc: "Ship features 2× quicker with one senior pod. From idea to production in weeks, not months.",
            tone: "warm",
            visual: { kind: "gauge", stat: "46%", statLabel: "faster time to first launch", value: 0.46 },
          },
          {
            title: "Deploy with confidence",
            desc: "Automated security checks, CI/CD pipelines, and instant rollbacks. Ship safely, every time.",
            tone: "cool",
            visual: {
              kind: "checklist",
              rows: ["Code reviewed", "Tests passed", "Security scan clean"],
            },
          },
          {
            title: "Stay in sync",
            desc: "Real-time notifications for deploys, builds, and team activity. Never chase a status update again.",
            tone: "cool",
            visual: {
              kind: "inbox",
              tabs: [
                { label: "All", count: 3 },
                { label: "Team", count: 2, active: true },
                { label: "System", count: 1 },
              ],
              rows: [
                "Sarah deployed to production",
                "Friday demo recording ready",
                "Dependency update available",
              ],
            },
          },
          {
            title: "Command everything",
            desc: "Trigger deployments, inspect build logs, and manage workflows from a single command palette.",
            tone: "warm",
            visual: {
              kind: "command",
              actions: [
                { label: "Deploy to Production", kbd: "V" },
                { label: "View Build Logs", kbd: "B" },
                { label: "Rollback Last Deploy", kbd: "M" },
              ],
            },
          },
        ]}
      />

      </>
    ),
    solutions: (
      <>
      {/* Solutions */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {hc.solutions.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold" data-reveal-child>
            {hc.solutions.heading}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-cards>
          {hc.solutions.items.map((s, si) => {
            const SolIcon = solutionIcons[si % solutionIcons.length];
            return (
            <div
              key={s.title}
              className="glare-card lift gradient-card-gold rounded-2xl p-7"
              data-card
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-transparent border border-gold/20">
                <SolIcon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
            );
          })}
        </div>
      </section>

      </>
    ),
    process: (
      <>
      {/* Process */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.process.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              {hc.process.heading}
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md" data-reveal-child>
              {hc.process.intro}
            </p>
          </div>
          <div className="space-y-3">
            {hc.process.items.map((p) => (
              <div
                key={p.n}
                className="glare-card glass rounded-2xl p-6 flex gap-5 hover:bg-white/5 transition-colors"
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

      </>
    ),
    assemble: (
      <>
      {/* Everything a launch needs — scattered elements assemble on scroll */}
      <section className="container-page py-28 border-t border-border/60 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-lime">In every build</p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold">
              Scattered concerns,{" "}
              <span className="text-gold">assembled</span> into one
              launch.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Auth, payments, analytics, SEO, monitoring — the unglamorous parts most
              agencies bolt on late. We wire them in from sprint one, so launch day is a
              formality, not a fire drill.
            </p>
          </div>
          <div className="relative" data-scatter>
            <div
              className="absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-30 pointer-events-none"
              style={{ background: "var(--gradient-lime)", filter: "blur(100px)" }}
              data-parallax="-0.15"
            />
            <div className="relative flex flex-wrap justify-center gap-3">
              {[
                "Design system",
                "Auth & SSO",
                "Payments",
                "CI/CD",
                "Analytics",
                "SEO & schema",
                "Error monitoring",
                "A/B testing",
                "Accessibility",
                "Email flows",
                "Docs & handover",
                "Load testing",
                "i18n-ready",
                "Backups & DR",
              ].map((chip, i) => (
                <span
                  key={chip}
                  data-scatter-item
                  className={`rounded-full px-5 py-2.5 text-sm font-medium border will-change-transform ${
                    i % 5 === 0
                      ? "gradient-card-gold border-gold/25 text-foreground"
                      : "glass border-white/10 text-foreground/85"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-8 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Included in every engagement — never a change order
            </p>
          </div>
        </div>
      </section>

      </>
    ),
    work: (
      <>
      {/* Works */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.work.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-split>
              {hc.work.heading}
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
          {hc.work.items.map((w) => (
            <div
              key={w.name}
              className="group glare-card relative rounded-2xl overflow-hidden aspect-4/3 border border-white/10"
              data-reveal-child
            >
              <img
                src={w.img}
                alt={w.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                data-parallax-img
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

      </>
    ),
    kickoff: (
      <>
      {/* First 14 days */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            {hc.kickoff.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-split>
            {hc.kickoff.heading}
          </h2>
        </div>
        <div className="relative">
          <div className="timeline-line hidden md:block" data-timeline-line />
          <div className="grid gap-10 md:grid-cols-4">
            {hc.kickoff.items.map((step) => (
              <div key={step.day} data-reveal-child>
                <div className="timeline-dot hidden md:block" />
                <p className="md:mt-5 text-xs uppercase tracking-[0.24em] text-gold">{step.day}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{step.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[30ch]">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </>
    ),
    why: (
      <>
      {/* Why */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.why.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              {hc.why.heading}
            </h2>
            <div
              className="relative mt-10 overflow-hidden rounded-3xl border border-white/10"
              data-reveal-child
            >
              <img
                src="/images/canva/studio-workspace.jpg"
                alt="Laptop in a dark studio with glowing lime circuit lines — code in progress"
                loading="lazy"
                className="aspect-16/10 w-full object-cover"
              />
              <div className="absolute inset-0 bg-background/30" />
            </div>
          </div>
          <div className="space-y-4">
            {hc.why.items.map((f, fi) => {
              const WhyIcon = whyIcons[fi % whyIcons.length];
              return (
              <div
                key={f.title}
                className="glare-card glass rounded-2xl p-6 flex gap-5"
                data-reveal-child
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime/20 to-transparent border border-lime/20">
                  <WhyIcon className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      </>
    ),
    compare: (
      <>
      {/* Comparison — white band */}
      <section className="block-light">
        <div className="container-page py-28">
        <div className="mb-14" data-reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-lime">{hc.compare.eyebrow}</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold">
            {hc.compare.heading}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-3xl border border-black/10 bg-surface p-8 md:p-10"
            data-slide="left"
          >
            <h3 className="font-display text-2xl font-semibold text-muted-foreground">
              {hc.compare.typicalTitle}
            </h3>
            <ul className="mt-8 space-y-5">
              {hc.compare.typical.map((row) => (
                <li key={row} className="flex items-start gap-3 text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                  <span className="text-sm leading-relaxed">{row}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="glare-card gradient-card-gold rounded-3xl p-8 md:p-10"
            data-slide="right"
          >
            <h3 className="font-display text-2xl font-semibold">{hc.compare.auxtechTitle}</h3>
            <ul className="mt-8 space-y-5">
              {hc.compare.auxtech.map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed text-foreground/90">{row}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-9 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
            >
              Work the Auxtech way <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </div>
      </section>

      </>
    ),
    testimonials: (
      <>
      {/* Testimonials */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <p className="text-xs uppercase tracking-[0.28em] text-lime mb-4" data-reveal-child>
          {hc.testimonialsSection.eyebrow}
        </p>
        <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-3xl font-semibold mb-14" data-reveal-child>
          {hc.testimonialsSection.heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-6" data-cards data-cards-stagger="0.12">
          {quotes.map((t) => (
            <blockquote
              key={t.a}
              className="glare-card gradient-card rounded-2xl p-7"
              data-card
            >
              <p className="font-display text-lg leading-relaxed">"{t.q}"</p>
              <footer className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.a}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover border border-white/15"
                />
                <div>
                  <div className="font-semibold text-sm">{t.a}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.r}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      </>
    ),
    pricing: (
      <>
      {/* Pricing snapshot */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.pricing.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              {hc.pricing.heading}
            </h2>
          </div>
          <Link to="/pricing" className="text-sm hover:text-lime inline-flex items-center gap-1.5" data-reveal-child>
            Full pricing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6" data-cards>
          {hc.pricing.tiers.map((tier) => (
            <div
              key={tier.t}
              className={`glare-card lift rounded-2xl p-8 border ${
                tier.featured
                  ? "gradient-card-gold border-lime/30"
                  : "gradient-card border-white/10"
              }`}
              data-card
            >
              <h3 className="font-display text-2xl font-semibold">{tier.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tier.d}</p>
              <div className="mt-8 font-display text-3xl font-semibold text-gradient-lime">
                {tier.p}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {hc.pricing.tierFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-lime" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      </>
    ),
    faq: (
      <>
      {/* FAQ */}
      <section className="container-page py-28 border-t border-border/60" data-reveal-group>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              {hc.faq.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              {hc.faq.heading}
            </h2>
          </div>
          <div className="space-y-3">
            {hc.faq.items.map((f) => (
              <details
                key={f.q}
                className="glare-card faq-item glass rounded-2xl p-6 group"
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

      </>
    ),
    audit: (
      <>
      {/* Free audit — low-commitment conversion path */}
      <section className="container-page py-24 border-t border-border/60">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-slide="left">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{hc.audit.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold">
              {hc.audit.heading}
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg">
              {hc.audit.text}
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {hc.audit.bullets.map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-foreground/85">{row}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-slide="right">
            <div
              className="absolute -top-16 -left-10 h-56 w-56 rounded-full opacity-25 pointer-events-none"
              style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
              data-parallax="0.18"
            />
            <div className="glare-card gradient-card-gold relative rounded-3xl p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Audit snapshot</span>
                <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
                  48h turnaround
                </span>
              </div>
              <div className="mt-7 space-y-4">
                {[
                  { l: "Performance", w: "w-[62%]", note: "LCP 4.1s → target 1.8s" },
                  { l: "SEO", w: "w-[78%]", note: "Missing schema on 12 pages" },
                  { l: "Conversion", w: "w-[44%]", note: "Checkout drop-off at step 2" },
                ].map((bar) => (
                  <div key={bar.l}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{bar.l}</span>
                      <span className="text-xs text-muted-foreground">{bar.note}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gold/80 ${bar.w}`} />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                data-magnetic
                className="mt-9 inline-flex items-center gap-2 rounded-full btn-gold px-6 py-3.5 text-sm font-semibold"
              >
                Claim your free audit
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-xs text-muted-foreground">
                No sales call required. We email the report either way.
              </p>
            </div>
          </div>
        </div>
      </section>

      </>
    ),
    cta: (
      <>
      {/* CTA */}
      <section className="container-page py-28" data-reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-card p-12 md:p-20 border border-lime/20">
          <div className="absolute inset-0 grain-bg pointer-events-none" />
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none"
            style={{ background: "var(--gradient-lime)", filter: "blur(80px)" }}
          />
          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime">{hc.cta.eyebrow}</p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] font-semibold" data-split>
              {hc.cta.heading}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {hc.cta.text}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
              >
                {hc.cta.primaryLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                data-magnetic="0.25"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
              >
                {hc.cta.secondaryLabel}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-lime" /> You own all IP and code
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-lime" /> Reply within one business day
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-lime" /> Free technical audit included
              </span>
            </div>
          </div>
        </div>
      </section>
      </>
    ),
  };
  const orderedKeys = [
    ...hc.sectionOrder.filter((k) => k in sectionBlocks),
    ...Object.keys(sectionBlocks).filter((k) => !hc.sectionOrder.includes(k)),
  ];

  return (
    <SiteShell>
      <div ref={containerRef} className="relative bg-background">
        {/* New Hero from home-5 */}
        <div className="relative flex flex-col items-center overflow-hidden pt-24 pb-4">
          
        {/* Background glowing gradient and grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[500px] bg-lime opacity-[0.15] blur-[120px] rounded-[100%] pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            backgroundPosition: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        {/* Trust Badge */}
        <div className="flex items-center gap-3 mb-8 relative z-10">
           <span className="text-sm font-medium text-foreground/80">Trusted By</span>
           <div className="flex -space-x-3">
             {[
               "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=70",
               "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=70",
             ].map((a, i) => (
               <img key={i} src={a} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
             ))}
           </div>
           <span className="text-sm font-medium text-foreground/80">{hc.hero.trustedLine}</span>
           <div className="flex items-center gap-0.5 ml-2">
             {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-lime text-lime" />)}
           </div>
        </div>

        {/* Hero Copy */}
        <h1 className="relative z-10 mb-6 max-w-[15ch] text-center font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {hc.hero.headline}
        </h1>

        <p className="relative z-10 mb-10 max-w-2xl text-center text-lg font-normal leading-relaxed text-muted-foreground">
          {hc.hero.subheadline}
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 relative z-10 mb-16">
          <Link to="/contact" className="bg-lime hover:bg-lime/90 text-black px-10 py-4 rounded-full font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition-colors">
            {hc.hero.ctaLabel} <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{hc.hero.ctaNote}</span>
        </div>

        {/* Feature Cards Section */}
        <motion.div 
          style={{ y: yCards }}
          className="relative z-10 w-full proj-marquee mt-4"
        >
          {/* We keep the marquee mask so it fades nicely on the edges */}
          <div 
            className="w-full"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
          >
            <div className="proj-marquee-track flex gap-6 px-4">
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="flex gap-6 shrink-0">
                  {hc.hero.cards.map((card, ci) => (
                    <div
                      key={`${card.title}-${ci}`}
                      className="rounded-[32px] overflow-hidden group relative flex flex-col p-6 w-[340px] md:w-[380px] h-[550px] shrink-0 border border-white/5 hover:border-white/10 transition-colors"
                      style={{ backgroundColor: heroCardBg[ci % heroCardBg.length] }}
                    >
                      <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-[#020509]/60 to-transparent" />
                      <div className="relative z-20 flex justify-between items-start mb-auto">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                          {card.category}
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                          <Bookmark className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="relative z-20 mt-auto flex flex-col">
                        <h3 className="text-white font-display font-bold text-3xl leading-tight mb-4">
                          {card.title}
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                          <img src={heroCardAvatars[ci % heroCardAvatars.length]} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                          <span className="text-white/90 text-sm font-medium">{card.team}</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          {[
                            { icon: Flame, cls: "w-5 h-5 text-orange-500 fill-orange-500", v: card.s1v, l: card.s1l },
                            { icon: Clock, cls: "w-5 h-5 text-white fill-white", v: card.s2v, l: card.s2l },
                            { icon: Plus, cls: "w-5 h-5 text-purple-400 fill-purple-400 bg-purple-400/20 rounded-md p-0.5", v: card.s3v, l: card.s3l },
                          ].map((stat) => (
                            <div key={stat.l + stat.v} className="flex flex-col">
                              <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                                <stat.icon className={stat.cls} />
                                {stat.v}
                              </div>
                              <span className="text-white/60 text-xs uppercase tracking-wider">{stat.l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>



      {orderedKeys.map((k) => (
        <div key={k} data-lp={k}>
          {sectionBlocks[k]}
        </div>
      ))}
      </div>
    </SiteShell>
  );
}
