import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { CTABand } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import {
  cmsFind,
  cmsFindOne,
  pageStr,
  type CmsPlan,
  type SitePageDoc,
} from "@/lib/cms";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";

type PricingTier = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

export const Route = createFileRoute("/pricing")({
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Pricing — Auxtech');
    const description = pageStr(d, "meta_description", 'Fixed-scope engagements, monthly care plans and per-service pricing.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  // Content-managed: pull pricing tiers from the CMS `plans` collection, fall
  // back to the built-in tiers if the CMS is unreachable or empty.
  loader: async (): Promise<{ tiers: PricingTier[]; doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "pricing");
    const docs = await cmsFind<CmsPlan>("plans", { sort: "order", limit: 20 });
    if (docs.length) {
      return {
        doc,
        tiers: docs.map((p) => ({
          name: p.name,
          tagline: p.description || "",
          price: p.price,
          unit: p.period || "",
          features: (p.features || []).map((f) => f.label),
          cta: p.ctaLabel || `Start ${p.name}`,
          highlight: p.featured ?? false,
        })),
      };
    }
    return { doc, tiers };
  },
  component: PricingPage,
});

const tiers = [
  {
    name: "Launch",
    tagline: "For founders & new brands",
    price: "$6,500",
    unit: "starting",
    features: [
      "5–7 page marketing website",
      "Custom design + Framer/Webflow build",
      "Basic on-page SEO",
      "Analytics setup",
      "2 rounds of revisions",
      "Delivered in 3–4 weeks",
    ],
    cta: "Start Launch",
    highlight: false,
  },
  {
    name: "Studio",
    tagline: "The engagement most teams pick",
    price: "$18,000",
    unit: "starting",
    features: [
      "Custom website or web app",
      "UI/UX design + engineering",
      "CMS integration (Sanity / Webflow)",
      "Component design system",
      "Performance & SEO baseline — 98 median Lighthouse",
      "First demo by day 7, delivered in 6–8 weeks",
    ],
    cta: "Start Studio",
    highlight: true,
  },
  {
    name: "Scale",
    tagline: "For product & ecommerce teams",
    price: "$45,000",
    unit: "starting",
    features: [
      "Custom SaaS / ecommerce build",
      "Auth, billing, dashboards",
      "Headless commerce or multi-tenant",
      "Full design system",
      "Analytics, SEO, CRO baseline",
      "Delivered in 10–14 weeks",
    ],
    cta: "Start Scale",
    highlight: false,
  },
];

const trust = [
  { value: "84%", label: "of clients stay on a Care plan after launch — they keep choosing us monthly." },
  { value: "1", label: "business day, max, to a reply on any thread. Usually the same afternoon." },
  { value: "$0", label: "in surprise change orders since 2014. Scope moves only when you sign off." },
];

const included = [
  "Senior team only — no juniors on your build",
  "First demo by day 7",
  "Shippable slice by day 14",
  "Weekly demo, every week",
  "Staging environment from day 1",
  "Full IP & code transfer",
  "Docs & clean handover",
  "Direct line to the people building",
  "98 median Lighthouse at delivery",
  "Accessibility to WCAG AA",
];

const services = [
  { title: "Website Development", from: "$6,500", desc: "5–15 page marketing sites, custom built." },
  { title: "UI/UX Design", from: "$4,500", desc: "Product interfaces, flows, prototypes." },
  { title: "CMS Based Websites", from: "$8,000", desc: "Sanity, Webflow, WordPress, Contentful." },
  { title: "Mobile App Development", from: "$28,000", desc: "iOS, Android, cross-platform apps." },
  { title: "Ecommerce Build", from: "$15,000", desc: "Shopify or headless commerce." },
  { title: "SaaS MVP Sprint", from: "$22,000", desc: "6-week MVP from brief to launch." },
  { title: "Brand Identity", from: "$7,500", desc: "Logo, system, guidelines." },
  { title: "Full Brand Consultancy", from: "$18,000", desc: "Strategy, identity, go-to-market." },
];

const care = [
  { name: "Care Basic", price: "$450/mo", items: ["Hosting monitoring", "Security updates", "Monthly backups", "1 hour dev time"] },
  { name: "Care Plus", price: "$1,200/mo", items: ["Everything in Basic", "Uptime & perf monitoring", "SEO monthly report", "4 hours dev time"] },
  { name: "Care Pro", price: "$3,000/mo", items: ["Everything in Plus", "Dedicated PM", "Priority response (4h SLA)", "12 hours dev/design"] },
];

const pricingFaqs = [
  {
    q: "Why \"from\" pricing instead of exact numbers?",
    a: "Because scope is the price. Two \"marketing websites\" can differ by 3× depending on pages, integrations, and content readiness. The from-price is the real floor for that service; after one scoping call you get a fixed number in writing — and that number doesn't move unless you change the scope.",
  },
  {
    q: "What actually affects the cost?",
    a: "Three things, in order: number of unique screens or templates, integrations (auth, billing, CMS, third-party APIs), and how much motion or custom interaction the design carries. Team seniority never varies — every engagement gets the same senior team.",
  },
  {
    q: "Can I pause a Care retainer?",
    a: "Yes. Care plans are month-to-month; pause or cancel with 30 days' notice, no penalty. When you come back, you keep your rate. 84% of clients stay on one — but that should be earned, not locked in.",
  },
  {
    q: "What if scope changes mid-project?",
    a: "We re-quote the delta before writing a line of it, you approve in writing, and the timeline is adjusted with it. That discipline is why we've issued $0 in surprise change orders since 2014.",
  },
];

function PricingPage() {
  const { tiers, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  return (
    <SiteShell theme={pageThemes["pricing"]}>
      {/* ---- Hero (light editorial, asymmetric split) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Pricing")}
            </p>
            <h1
              className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {s("hero_title", "Numbers you can take to the")} <span className="text-gold">{s("hero_title_em", "board")}</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {s("hero_subtitle", "Fixed-scope engagements, monthly care plans and per-service pricing. A number in writing before we start — and no surprise invoices after.")}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75"
              alt="Pricing figures reviewed at a desk"
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur">
              Fixed quotes · $0 surprise change orders
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Tiers ---- */}
      <section className="block-light">
        <div className="container-page border-t border-border py-24">
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch" data-cards data-cards-stagger="0.12">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  t.highlight
                    ? "block-bold glare-card shadow-panel lg:-my-5 lg:p-10"
                    : "gradient-card glare-card lift border-border hover:border-lime/25"
                }`}
                data-card
              >
                {t.highlight && (
                  <span className="absolute -top-3.5 left-8 rounded-full bg-gold px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-foreground">
                    Most chosen
                  </span>
                )}
                <h3 className={`font-display font-semibold ${t.highlight ? "text-4xl" : "text-3xl"}`}>{t.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.tagline}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className={`font-display font-semibold ${t.highlight ? "text-6xl text-gradient" : "text-5xl"}`}>
                    {t.price}
                  </span>
                  <span className="mb-2 text-sm text-muted-foreground">{t.unit}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.highlight ? "text-gold" : "text-lime"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {t.highlight ? (
                  <Link
                    to="/contact"
                    data-magnetic
                    className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
                  >
                    {t.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ) : (
                  <Link
                    to="/contact"
                    className="mt-8 rounded-full border border-border px-4 py-3 text-center text-sm font-medium transition-colors hover:border-lime/40 hover:bg-surface"
                  >
                    {t.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-16 grid gap-4 md:grid-cols-3" data-reveal-group>
            {trust.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-7" data-reveal-child>
                <div className="font-display text-4xl font-semibold text-gradient-lime md:text-5xl" data-counter>
                  {s.value}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What every engagement includes (tint band) ---- */}
      <section className="block-tint overflow-hidden">
        <div className="container-page py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              In every tier
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              What every engagement includes.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal>
              The floor is the same whether you spend $6,500 or $450,000. None of this is an add-on.
            </p>
          </div>
          <div className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-3" data-scatter>
            {included.map((chip, i) => (
              <span
                key={chip}
                data-scatter-item
                className={`rounded-full px-5 py-2.5 text-sm font-medium ${
                  i % 3 === 0 ? "glass-strong text-foreground" : "glass text-muted-foreground"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Per-service pricing ---- */}
      <section className="block-light">
        <div className="container-page py-24" data-reveal-group>
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                By service
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl" data-reveal-child>
                Starting prices by service.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground" data-reveal-child>
              Every engagement is scoped from a fixed brief. These are honest floors, not teaser rates.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-border/50 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                data-reveal-child
                className="group flex items-center justify-between gap-6 bg-background p-6 transition-colors duration-300 hover:bg-surface"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold transition-colors duration-300 group-hover:text-lime">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-gold">
                  from {s.from}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Risk reversal (bold color-block band) ---- */}
      <section className="block-bold">
        <div className="container-page py-24 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-2" data-reveal>
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface">
                <ShieldCheck className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <div className="md:col-span-7" data-reveal>
              <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
                First sprint guarantee.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                If the first two weeks don't impress you, you pay nothing and keep the work. That's the whole clause — no fine print, no partial credits.
              </p>
            </div>
            <div className="md:col-span-3 md:text-right" data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Start risk-free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Monthly care (tint band) ---- */}
      <section className="block-tint">
        <div className="container-page py-24">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              Monthly care
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl" data-reveal>
              After launch, most teams stay.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground" data-reveal>
              84% of clients continue on a Care plan — month-to-month, pausable, with your rate locked.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3" data-cards>
            {care.map((p) => (
              <div key={p.name} className="glare-card gradient-card lift rounded-3xl p-8" data-card>
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <div className="mt-2 font-display text-4xl font-semibold text-gradient">{p.price}</div>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BannerCTA
        message={["A 30-minute call with you,", "a fixed quote in writing from us."]}
        title={
          <>
            Stop guessing.
            <br />
            Get a real <span className="text-gold">number</span>.
          </>
        }
        cta={{ label: "Get a Quote", to: "/contact" }}
      />

      {/* ---- Pricing FAQ ---- */}
      <section className="block-light">
        <div className="container-page py-24" data-reveal-group>
          <div className="grid items-start gap-16 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Pricing questions
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal-child>
                The fine print, out loud.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                Everything more involved lives on the <Link to="/faq" className="link-underline text-foreground">full FAQ</Link>.
              </p>
            </div>
            <div className="space-y-3">
              {pricingFaqs.map((f) => (
                <details key={f.q} className="group glass rounded-2xl p-6" data-reveal-child>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                    {f.q}
                    <span className="text-lime transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Get a real number"
        title="Want a fixed quote, not a range?"
        subtitle="Send the brief today. Within one business day you'll have a scoped number in writing — and a first demo on your screen by day 7."
        primary={{ label: "Get My Quote", to: "/contact" }}
        secondary={{ label: "See the Work First", to: "/works" }}
      />
    </SiteShell>
  );
}
