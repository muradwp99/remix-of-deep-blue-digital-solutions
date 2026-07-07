import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";

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
  { n: "01", t: "Craft over volume", d: "We take fewer projects and give each the attention it deserves." },
  { n: "02", t: "Design + engineering as one", d: "One team, one brief, one standard. No handoffs, no telephone game." },
  { n: "03", t: "Honesty about scope", d: "We say no to the wrong project, and yes to a fair timeline." },
  { n: "04", t: "Long-term partnerships", d: "The best work compounds. Most clients stay with us beyond launch." },
];

const team = [
  { name: "Ana Marković", role: "Founding Partner · Design" },
  { name: "Ravi Shankar", role: "Founding Partner · Engineering" },
  { name: "Iris Nakamura", role: "Design Director" },
  { name: "Theo Whelan", role: "Engineering Lead" },
  { name: "Lena Fischer", role: "Brand Strategist" },
  { name: "Marcus Ade", role: "Head of Growth" },
];

function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="About"
        title={<>A studio built for <em className="italic text-gradient">craft</em>.</>}
        subtitle="Northline is a 14-person software studio working with founders and product teams across three continents."
      />

      <section className="container-page py-24 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Our story</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
            Founded in 2018 by two friends who wanted to build better software.
          </h2>
        </div>
        <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
          <p>
            We started as a two-person studio taking on projects other agencies wouldn't:
            the ambitious ones, the technically hard ones, the ones with a clear point of view.
          </p>
          <p>
            Seven years later we're still small on purpose. 14 senior designers, engineers
            and strategists. No account managers. No offshore teams. Just the people doing the work,
            in the same room as the people making decisions.
          </p>
          <p>
            We work with early-stage founders, growth-stage product teams and household brands.
            We are equally happy to build a landing page, an ecommerce platform, or a full product
            from scratch — as long as the ambition matches ours.
          </p>
        </div>
      </section>

      <section className="container-page py-24 border-t border-border/60">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Principles</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">How we work.</h2>
        <div className="mt-12 grid gap-px bg-border/50 rounded-2xl overflow-hidden md:grid-cols-2">
          {values.map((v) => (
            <div key={v.n} className="bg-background p-8">
              <span className="text-xs text-muted-foreground">{v.n}</span>
              <h3 className="mt-6 font-display text-2xl">{v.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-24 border-t border-border/60">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Team</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">Senior. Every seat.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border bg-surface/40 p-6">
              <div className="aspect-[4/5] rounded-lg mb-5 grain-bg" style={{ background: "linear-gradient(135deg, oklch(0.28 0.06 265), oklch(0.16 0.03 265))" }} />
              <h3 className="font-display text-xl">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
