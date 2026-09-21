import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";
import { cmsFind, cmsFindOne, pageRows, pageStr, type SitePageDoc } from "@/lib/cms";
import { iconFromName } from "@/lib/cms-catalog";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { CTABand } from "@/components/sections";
import { ShoppingBag, Boxes, Megaphone, Sparkles } from "lucide-react";

/** One row of the CMS-backed index below the curated cards. */
type SolutionLink = { slug: string; title: string; summary: string };

export const Route = createFileRoute("/solutions")({
  loader: async (): Promise<{ doc: SitePageDoc; all: SolutionLink[] }> => {
    // The cards below are a curated four, not the whole collection, so a
    // solution added in the CMS would otherwise never surface here.
    const [doc, docs] = await Promise.all([
      cmsFindOne<Record<string, unknown>>("sitepages", "solutions"),
      cmsFind<{ slug?: string; title?: string; summary?: string | null }>("solutions", {
        sort: "order",
        limit: 100,
      }),
    ]);
    const all: SolutionLink[] = docs
      .filter((d) => d.slug && d.title)
      .map((d) => ({ slug: d.slug as string, title: d.title as string, summary: d.summary ?? "" }));
    return { doc, all };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Solutions — Auxtech');
    const description = pageStr(d, "meta_description", 'Packaged programs designed to move a specific business number.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SolutionsPage,
});

type IconType = ComponentType<{ className?: string }>;

/** What a solution card renders, whichever source it came from. */
type RenderCard = {
  icon: IconType;
  tag: string;
  title: string;
  desc: string;
  metrics: { v: string; l: string }[];
  subs: string[];
};

/**
 * `Value | Label` per line → metric rows.
 *
 * A repeater sub-field is a single string, so a card's metrics ride in one
 * textarea rather than a nested repeater LivePress does not have.
 */
function pipeMetrics(src?: string): { v: string; l: string }[] {
  return (src ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const at = l.indexOf("|");
      return at === -1
        ? { v: l, l: "" }
        : { v: l.slice(0, at).trim(), l: l.slice(at + 1).trim() };
    });
}

const textLines = (src?: string): string[] =>
  (src ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const solutions = [
  {
    icon: ShoppingBag,
    tag: "Commerce",
    title: "Ecommerce",
    desc: "Shopify Plus, headless storefronts, marketplaces and subscriptions.",
    metrics: [
      { v: "+42%", l: "avg. conversion lift" },
      { v: "1.9s", l: "median LCP shipped" },
    ],
    subs: ["Shopify & Shopify Plus", "Headless Storefronts", "Marketplaces", "Subscriptions & Billing", "Post-purchase Experience", "Merchandising & PDPs"],
  },
  {
    icon: Boxes,
    tag: "Product",
    title: "SaaS",
    desc: "From MVP to scale. Auth, billing, dashboards, integrations.",
    metrics: [
      { v: "6", l: "weeks, idea to MVP" },
      { v: "$40M+", l: "raised by client products" },
    ],
    subs: ["MVP Sprint (6 weeks)", "Multi-tenant Platforms", "Admin & Ops Dashboards", "Billing (Stripe / Paddle)", "AI-powered Features", "Public API Platforms"],
  },
  {
    icon: Megaphone,
    tag: "Growth",
    title: "Digital Marketing",
    desc: "Paid, organic and lifecycle marketing that compounds.",
    metrics: [
      { v: "3.2×", l: "blended ROAS" },
      { v: "+180%", l: "organic traffic YoY" },
    ],
    subs: ["SEO & Content", "Paid Media (Google, Meta)", "Lifecycle & Email", "Landing Page Systems", "Analytics & Attribution", "CRO Programs"],
  },
  {
    icon: Sparkles,
    tag: "Brand",
    title: "Full Brand Consultancy",
    desc: "Positioning, narrative, identity and go-to-market as one system.",
    metrics: [
      { v: "40+", l: "brands repositioned" },
      { v: "98%", l: "client retention" },
    ],
    subs: ["Brand Strategy", "Positioning & Narrative", "Visual Identity", "Verbal Identity & Voice", "Launch Campaigns", "Brand Guidelines"],
  },
];

const industries = [
  { label: "Fintech", accent: "lime" },
  { label: "Healthcare" },
  { label: "Retail & DTC", accent: "gold" },
  { label: "B2B SaaS", accent: "lime" },
  { label: "Logistics" },
  { label: "Education" },
  { label: "Real Estate", accent: "gold" },
  { label: "Media & Publishing" },
  { label: "Hospitality" },
  { label: "Climate & Energy", accent: "lime" },
  { label: "Marketplaces" },
  { label: "Professional Services" },
];

function SolutionsPage() {
  const { doc, all } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);

  // CMS rows win wholesale — a half-filled repeater is an edit in progress,
  // not a reason to mix two sources.
  const cmsCards = pageRows<Record<string, string>>(d, "solution_cards", []);
  const cards: RenderCard[] = cmsCards.length
    ? cmsCards.map((c) => ({
        icon: iconFromName(c.icon),
        tag: c.tag ?? "",
        title: c.title ?? "",
        desc: c.desc ?? "",
        metrics: pipeMetrics(c.metrics),
        subs: textLines(c.items),
      }))
    : solutions.map((c) => ({
        icon: c.icon as IconType,
        tag: c.tag,
        title: c.title,
        desc: c.desc,
        metrics: c.metrics,
        subs: c.subs,
      }));
  return (
    <SiteShell>
      <PageHeader
        eyebrow={s("hero_eyebrow", "Solutions")}
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=70"
        title={<>{s("hero_title", "Outcomes, not just")} <em className="font-playfair font-medium text-gold">{s("hero_title_em", "deliverables")}</em>.</>}
        subtitle={s("hero_subtitle", "Packaged programs designed to move a specific business number — revenue, retention, brand equity, or speed to market.")}
      />

      {/* Solution programs */}
      <section className="container-page py-24 grid gap-6 md:grid-cols-2" data-cards data-cards-stagger="0.12">
        {cards.map((s) => (
          <div key={s.title} className="relative overflow-hidden rounded-3xl glare-card gradient-card lift p-10" data-card>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-background border border-border">
              <s.icon className="h-6 w-6 text-gold" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-gold">{s.tag}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">{s.title}</h2>
            <p className="mt-3 text-muted-foreground">{s.desc}</p>
            <div className="mt-8 flex gap-10 border-t border-white/10 pt-6">
              {s.metrics.map((m) => (
                <div key={m.l}>
                  <div className="font-display text-3xl font-semibold text-gradient-lime" data-counter>
                    {m.v}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-2 text-sm">
              {s.subs.map((sub) => (
                <li key={sub} className="text-foreground/85 border-t border-border/60 py-2.5">
                  {sub}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Complete, CMS-driven index — guarantees a newly added solution is
          reachable even though the cards above are a curated selection. */}
      {all.length > 0 && (
        <section className="container-page pb-24">
          <div className="border-t border-border/60 pt-12">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Every solution</p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {all.map((s) => (
                <Link
                  key={s.slug}
                  to="/solutions/$slug"
                  params={{ slug: s.slug }}
                  className="group glass glare-card lift rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl">{s.title}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-gold transition-all" />
                  </div>
                  {s.summary && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries */}
      <section className="border-t border-border/60 overflow-hidden">
        <div className="container-page py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
              Fluent in your domain.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal>
              Twelve years, 200+ projects. Chances are we've already shipped in your
              industry — and know where the bodies are buried.
            </p>
          </div>
          <div className="mt-14 flex flex-wrap gap-3 max-w-4xl" data-scatter>
            {industries.map((i) => (
              <span
                key={i.label}
                data-scatter-item
                className={`rounded-full px-5 py-2.5 text-sm font-medium glass ${
                  i.accent === "lime"
                    ? "border border-lime/30 text-lime"
                    : i.accent === "gold"
                      ? "border border-gold/30 text-gold"
                      : "text-foreground/85"
                }`}
              >
                {i.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow={s("cta_eyebrow", "Pick a number")}
        title={s("cta_title", "Which metric do you need to move?")}
        subtitle={s("cta_subtitle", "Tell us the business number that matters this quarter. We'll reply within one business day with the program, the timeline, and a fair budget.")}
        primary={{ label: "Start a Project", to: "/contact" }}
        secondary={{ label: "See Pricing", to: "/pricing" }}
      />
    </SiteShell>
  );
}
