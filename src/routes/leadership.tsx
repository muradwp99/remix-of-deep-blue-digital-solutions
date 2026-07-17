import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { CTABand } from "@/components/sections";
import {
  cmsFind,
  cmsFindOne,
  cmsMedia,
  pageStr,
  type CmsTeam,
  type SitePageDoc,
} from "@/lib/cms";

type Leader = { name: string; role: string; bio: string; img: string };

export const Route = createFileRoute("/leadership")({
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Leadership — Northline Studio');
    const description = pageStr(d, "meta_description", 'The senior team behind Northline Studio.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  // Content-managed from the CMS `team` collection; falls back to the
  // built-in list if the CMS is unreachable. Photos fall back to the
  // matching built-in portrait (by name) when a team member has none.
  loader: async (): Promise<{ leaders: Leader[]; doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "leadership");
    const team = await cmsFind<CmsTeam>("team", { sort: "order", depth: 1, limit: 12 });
    if (team.length) {
      return {
        doc,
        leaders: team.map((t) => ({
          name: t.name,
          role: t.role || "",
          bio: t.bio || "",
          img:
            cmsMedia(t.photo) ||
            IMG_BY_NAME[t.name] ||
            `https://picsum.photos/seed/nl-${encodeURIComponent(t.name)}/600/750`,
        })),
      };
    }
    return { doc, leaders: fallbackLeaders };
  },
  component: Page,
});

const fallbackLeaders: Leader[] = [
  {
    name: "Elena Marsh",
    role: "CEO & Co-founder",
    bio: "Scaled product organisations at Shopify and Klarna before co-founding Northline in 2014. She still leads discovery on every new engagement herself.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "James Okoro",
    role: "CTO & Co-founder",
    bio: "Ex-platform engineering at Stripe and AWS, where his systems served 40M+ users. Every architecture that leaves the studio still crosses his desk.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Sofia Alvarez",
    role: "VP of Design",
    bio: "Built design systems at Intercom and led conversion design for three fintech unicorns. Her teams own outcomes and metrics, not mockups.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Daniel Wu",
    role: "VP of Engineering",
    bio: "Ran delivery for healthcare and logistics platforms at Thoughtworks for a decade. Keeper of the 98-median-Lighthouse bar and the day-14 shippable slice.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=70",
  },
];

const IMG_BY_NAME: Record<string, string> = Object.fromEntries(
  fallbackLeaders.map((l) => [l.name, l.img]),
);

const operating = [
  {
    n: "01",
    t: "No middle managers",
    d: "Four leaders, zero layers. The person who scoped your project is the person accountable for shipping it.",
  },
  {
    n: "02",
    t: "Leads bill hours",
    d: "Every leader spends most of their week on client projects — in the codebase, in the Figma file, not in status meetings.",
  },
  {
    n: "03",
    t: "Decisions in writing",
    d: "Architecture and design calls are documented in open RFCs anyone in the studio — or the client — can read and challenge.",
  },
  {
    n: "04",
    t: "A partner in your Slack",
    d: "You get a founder or VP directly in your channel, not an account manager relaying messages between rooms.",
  },
];

const values = [
  { t: "Technical Excellence", d: "Craft is non-negotiable, on every project." },
  { t: "Client Partnership", d: "Your outcomes are our scorecard." },
  { t: "Continuous Innovation", d: "We stay curious and keep learning." },
  { t: "Radical Transparency", d: "Honest budgets, timelines, and trade-offs." },
];

function Page() {
  const { leaders, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  return (
    <SiteShell theme={pageThemes["leadership"]}>
      {/* ---- Hero (light editorial, asymmetric split) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Leadership")}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {s("hero_title", "The senior team behind the")} <span className="text-gold">{s("hero_title_em", "work")}</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {s("hero_subtitle", "Deep expertise across engineering, design, and business strategy — still hands-on, every week.")}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=75"
              alt="Northline's leadership team"
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur">
              Four leaders · Hands-on weekly
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Leaders (portrait cards on white) ---- */}
      <section className="block-light">
        <div className="container-page border-t border-border py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              Senior leaders. Still shipping.
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
              No sales layer between you and the people accountable for the work.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-cards data-cards-stagger="0.12">
            {leaders.map((l) => (
              <div key={l.name} className="group glare-card gradient-card lift overflow-hidden rounded-2xl" data-card>
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={l.img}
                    alt={l.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{l.name}</h3>
                  <p className="mt-0.5 text-sm text-gold">{l.role}</p>
                  <p className="mt-2.5 text-sm text-muted-foreground">{l.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Operating model (pale tint band) ---- */}
      <section className="block-tint">
        <div className="container-page py-24 md:py-28" data-reveal-group>
          <div className="grid items-start gap-16 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                The operating model
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal-child>
                How leadership works here.
              </h2>
              <p className="mt-6 max-w-md text-lg text-muted-foreground" data-reveal-child>
                A studio of 50+ seniors doesn't need a management layer. It needs leaders who
                still do the work — and stay close enough to it to keep the standard.
              </p>
            </div>
            <div className="space-y-3">
              {operating.map((o) => (
                <div key={o.n} className="glass lift flex gap-5 rounded-2xl p-6" data-reveal-child>
                  <span className="shrink-0 font-display text-3xl font-semibold text-gold">{o.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{o.t}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{o.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Values (one bold color moment, editorial) ---- */}
      <section className="block-bold">
        <div className="container-page py-24 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div data-reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Our values</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] md:text-6xl">
                The principles we lead by.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
                The standards our leaders hold on every project, long after the kickoff call.
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2" data-cards data-cards-stagger="0.1">
              {values.map((v, i) => (
                <div key={v.t} className="border-t border-black/10 pt-5" data-card>
                  <span className="font-display text-sm font-semibold tabular-nums text-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{v.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA (dark bookend into footer) ---- */}
      <CTABand
        eyebrow="Direct line"
        title="Talk to a technical leader."
        subtitle="No sales layer — your first call is with one of the four people above."
        primary={{ label: "Book a Call", to: "/contact" }}
        secondary={{ label: "Explore Careers", to: "/careers" }}
      />
    </SiteShell>
  );
}
