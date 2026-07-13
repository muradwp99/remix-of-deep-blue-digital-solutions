import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { StatsRow, CTABand } from "@/components/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Northline Studio" },
      { name: "description", content: "A boutique software studio of designers, engineers and strategists." },
      { property: "og:title", content: "About — Northline Studio" },
      { property: "og:description", content: "A boutique software studio of designers, engineers and strategists." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { n: "01", t: "Craft over volume", d: "We take fewer projects and give each the attention it deserves. The calendar has white space on purpose." },
  { n: "02", t: "Design + engineering as one", d: "One team, one brief, one standard. Senior-only — no juniors, no handoffs, no telephone game." },
  { n: "03", t: "Honesty about scope", d: "We say no to the wrong project, and yes to a fair timeline. First demo on day 7, a shippable slice by day 14." },
  { n: "04", t: "Long-term partnerships", d: "The best work compounds. 84% of clients continue with us on a Care plan after launch." },
];

const wired = [
  { label: "Senior-only", accent: "lime" },
  { label: "No handoffs" },
  { label: "Remote-first, 15 countries" },
  { label: "First demo, day 7", accent: "gold" },
  { label: "Shippable slice, day 14" },
  { label: "98 median Lighthouse", accent: "lime" },
  { label: "No account managers" },
  { label: "Prototypes over decks" },
  { label: "Small on purpose", accent: "gold" },
  { label: "Async by default" },
  { label: "Opinionated, politely" },
  { label: "84% stay on Care", accent: "lime" },
];

const team = [
  { name: "Ana Marković", role: "Founding Partner · Design", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=70" },
  { name: "Ravi Shankar", role: "Founding Partner · Engineering", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=70" },
  { name: "Iris Nakamura", role: "Design Director", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=70" },
  { name: "Theo Whelan", role: "Engineering Lead", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=70" },
  { name: "Lena Fischer", role: "Brand Strategist", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=70" },
  { name: "Marcus Ade", role: "Head of Growth", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=70" },
];

function AboutPage() {
  return (
    <SiteShell theme={pageThemes["about"]}>
      {/* ---- Hero (light editorial, asymmetric split) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              About Northline
            </p>
            <h1
              className="mt-6 max-w-[14ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              A studio built for <span className="text-gold">craft</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              50+ senior designers and engineers, remote-first across 15 countries, for
              teams who care how things are made.
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75"
              alt="The Northline team collaborating"
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur">
              Est. 2014 · 15 countries
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Story ---- */}
      <section className="block-light">
        <div className="container-page grid items-start gap-16 border-t border-border py-24 md:grid-cols-2">
          <div data-slide="left" className="flex flex-col gap-8">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
              Founded in 2014 by two friends who wanted to build better software.
            </h2>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Founders collaborating"
              className="aspect-[4/3] w-full rounded-2xl border border-black/10 object-cover"
            />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground" data-slide="right">
            <p>
              We started as a two-person studio taking on projects other agencies wouldn't:
              the ambitious ones, the technically hard ones, the ones with a clear point of view.
            </p>
            <p>
              More than a decade later, we've grown to 50+ senior designers and engineers,
              remote-first across 15 countries — and stayed deliberately flat. Senior-only:
              no juniors, no handoffs. Just the people doing the work, in the same channel
              as the people making decisions.
            </p>
            <p>
              We work with early-stage founders, growth-stage product teams and household brands.
              We are equally happy to build a landing page, an ecommerce platform, or a full product
              from scratch — as long as the ambition matches ours.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Stats (tint band) ---- */}
      <div className="block-tint">
        <StatsRow
          stats={[
            { value: "2014", label: "Founded" },
            { value: "50+", label: "Senior designers & engineers" },
            { value: "15", label: "Countries, remote-first" },
            { value: "98%", label: "Client retention" },
          ]}
        />
      </div>

      {/* ---- Studio band (bold champagne color-block) ---- */}
      <section className="block-bold">
        <div className="container-page py-24 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal>
              <h2 className="font-display text-4xl font-semibold leading-[1.02] md:text-6xl">
                Fifteen time zones. One standard.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Somewhere between Lisbon and Osaka, someone from Northline is shipping right now.
                The sun never fully sets on a review.
              </p>
            </div>
            <figure className="overflow-hidden rounded-3xl border border-black/15" data-reveal>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                alt="The Northline studio at work"
                className="aspect-[16/10] w-full object-cover"
                data-parallax-img
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ---- Principles ---- */}
      <section className="block-light">
        <div className="container-page py-24">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
            How we work.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2" data-cards>
            {values.map((v) => (
              <div key={v.n} className="glare-card gradient-card lift shine rounded-2xl p-8" data-card>
                <span className="font-display text-3xl font-semibold text-gold">{v.n}</span>
                <h3 className="mt-6 font-display text-2xl font-semibold">{v.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How we're wired — value cloud (tint) ---- */}
      <section className="block-tint overflow-hidden">
        <div className="container-page py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>How we're wired</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
              The defaults we never negotiate.
            </h2>
          </div>
          <div className="mt-14 flex max-w-4xl flex-wrap gap-3" data-scatter>
            {wired.map((w) => (
              <span
                key={w.label}
                data-scatter-item
                className={`rounded-full px-5 py-2.5 text-sm font-medium glass ${
                  w.accent === "lime" || w.accent === "gold"
                    ? "border border-gold/40 text-gold"
                    : "text-foreground/85"
                }`}
              >
                {w.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Team ---- */}
      <section className="block-light">
        <div className="container-page py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              Senior. Every seat.
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
              The people below aren't the sales layer — they're who you'll work with on day one.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3" data-cards data-cards-stagger="0.1">
            {team.map((m) => (
              <div key={m.name} className="group glare-card gradient-card lift overflow-hidden rounded-2xl" data-card>
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{m.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA (dark bookend into footer) ---- */}
      <CTABand
        eyebrow="Work with us"
        title="Sound like your kind of studio?"
        subtitle="Tell us what you're building. A founding partner reads every brief and replies within one business day."
        primary={{ label: "Start a Project", to: "/contact" }}
        secondary={{ label: "Meet the Leadership", to: "/leadership" }}
      />
    </SiteShell>
  );
}
