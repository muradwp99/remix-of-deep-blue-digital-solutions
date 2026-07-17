import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BannerCTA } from "@/components/banner-cta";
import { ArrowUpRight, Send } from "lucide-react";
import { useState } from "react";
import {
  cmsFindOne,
  pageRows,
  pageStr,
  type SitePageDoc,
} from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

export const Route = createFileRoute("/resources")({
  // LivePress: editable via the `resources` Site Page doc, fail-soft to copy below.
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "resources");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "Resources — Northline Studio");
    const description = pageStr(
      d,
      "meta_description",
      "Free tools, learning material and writing from the Northline team.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ResourcesPage,
});

const tools = [
  { title: "Website Grader", desc: "Score your site in 30 seconds — speed, SEO, accessibility." },
  { title: "SEO Audit", desc: "Technical + content audit with a prioritized fix list." },
  { title: "Brand Color Check", desc: "Accessible palette review against WCAG AA." },
  { title: "Project Estimator", desc: "Ballpark your build against our real pricing floors." },
];

const learning = [
  { title: "Design System Course", desc: "8 modules on tokens, components, and governance — drawn from client systems.", tag: "Course" },
  { title: "Ship-Fast Playbook", desc: "How we get a first demo up by day 7 and a shippable slice by day 14.", tag: "Guide" },
  { title: "Founder Handbook", desc: "Scoping, hiring, and budget notes for early-stage teams buying their first build.", tag: "Guide" },
  { title: "Video Tutorials", desc: "Short-form, hands-on walkthroughs from the engineers who ship.", tag: "Video" },
];

const writing = [
  { title: "Engineering Notes", desc: "Deep-dives from the team: performance budgets, migrations, hard-won fixes.", tag: "Series" },
  { title: "Design Essays", desc: "Craft, taste, process — why the details clients notice aren't the ones you expect.", tag: "Series" },
  { title: "Studio Updates", desc: "What we shipped this month, with the numbers that moved.", tag: "Monthly" },
  { title: "Announcements", desc: "New partnerships, new hires, new capabilities.", tag: "News" },
];

function ResourcesPage() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  const toolsRows = pageRows(d, "tools", tools);
  const learningRows = pageRows(d, "learning", learning);
  const writingRows = pageRows(d, "writing", writing);
  return (
    <SiteShell theme={pageThemes["resources"]}>
      {/* ---- Hero (light editorial, asymmetric split) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Resources")}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {s("hero_title", "Free tools, learning and")}{" "}
              <span className="text-gold">{s("hero_title_em", "writing")}</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {s("hero_subtitle", "Everything we've built to help teams ship better software — no signup, no gate.")}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src={s("hero_img", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=70")}
              alt="Open notebooks and reading material from the Northline studio"
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      {/* ---- Free tools — editorial index, requested through the free audit ---- */}
      <section className="block-light">
        <div className="container-page border-t border-border py-24">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                {s("tools_eyebrow", "Free tools")}
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
                {s("tools_heading", "Run by us, for you.")}
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
              {s("tools_note", "These run as part of our free audit — a senior runs the tool on your site and walks you through the results. No self-serve dashboard, no upsell script.")}
            </p>
          </div>
          <div className="border-t border-black/10" data-cards>
            {toolsRows.map((t, i) => (
              <Link
                key={t.title}
                to="/contact"
                className="group grid items-baseline gap-4 border-b border-black/10 py-8 md:grid-cols-[auto_1fr_auto] md:gap-10"
                data-card
              >
                <span className="font-display text-2xl font-semibold text-gold md:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold md:text-3xl">{t.title}</h3>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold md:justify-self-end">
                  Request via free audit
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Provenance image band ---- */}
      <section className="block-light">
        <div className="container-page pb-24">
          <div className="relative h-72 overflow-hidden rounded-3xl md:h-96" data-reveal>
            <img
              src="/images/canva/digital-flow.jpg"
              alt="Abstract digital flow artwork from the Northline studio"
              className="absolute inset-0 h-full w-full object-cover"
              data-parallax-img
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">{s("prov_eyebrow", "Since 2014")}</p>
              <p className="mt-3 max-w-xl font-display text-2xl font-semibold leading-snug md:text-4xl">
                {s("prov_text", "Everything here comes from paid client work — published once it's proven.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Learning — editorial catalog (tint band) ---- */}
      <section className="block-tint">
        <div className="container-page py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("learning_eyebrow", "Learning")}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
              {s("learning_heading", "Courses & guides.")}
            </h2>
          </div>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2" data-cards data-cards-stagger="0.08">
            {learningRows.map((it) => (
              <article key={it.title} className="border-t border-black/10 pt-6" data-card>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {it.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BannerCTA
        message={[
          s("banner_message_line1", "Your URL from you,"),
          s("banner_message_line2", "a 12-point teardown from us."),
        ]}
        title={
          <>
            {s("banner_title", "Want this applied to")}
            <br />
            your <span className="text-gold">{s("banner_title_em", "product")}</span>?
          </>
        }
        cta={{ label: s("banner_label", "Book the Free Audit"), to: "/contact" }}
      />

      {/* ---- Writing — studio index ---- */}
      <section className="block-light">
        <div className="container-page py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("writing_eyebrow", "Blog & news")}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
              {s("writing_heading", "Writing from the studio.")}
            </h2>
          </div>
          <ul className="border-t border-black/10" data-cards data-cards-stagger="0.08">
            {writingRows.map((it) => (
              <li
                key={it.title}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-black/10 py-7"
                data-card
              >
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl font-semibold">{it.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {it.tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NewsletterBand />
    </SiteShell>
  );
}

function NewsletterBand() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="container-page py-24" data-reveal>
      <div className="relative overflow-hidden rounded-3xl gradient-card border border-lime/20 p-10 md:p-16">
        <div className="pointer-events-none absolute inset-0 grain-bg" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-30"
          style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
          data-parallax="0.25"
        />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime">Newsletter</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              New guides land here <span className="text-gold">first</span>.
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              One email a month: what we shipped, what we learned, and the next free guide. No drip sequence, unsubscribe any time.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="glass rounded-2xl p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-lime">Subscribed</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">You're on the list.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Next issue lands early next month. Until then, the archive above is all yours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="glass rounded-2xl p-8"
              >
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Work email</span>
                  <input
                    required
                    type="email"
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30"
                  />
                </label>
                <button
                  type="submit"
                  data-magnetic
                  className="group mt-5 inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3 text-sm font-semibold hover:border-lime/40"
                >
                  Subscribe
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Read by 12,000+ founders and product leaders.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
