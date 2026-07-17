import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { Flag } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/sections";
import { TerminalWindow } from "@/components/signature/terminal";
import { ComparisonTable } from "@/components/signature/compare-table";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "mvp-development";

export const Route = createFileRoute("/services_/mvp-development")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "MVP Development — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "MVP Development — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const WEEK_RAIL = ["Week 01", "Weeks 02–03", "Weeks 04–08", "Weeks 09–10"];

const FEATURE_PHOTOS = [
  { img: u("photo-1522542550221-31fd19575a2d", 800), alt: "Design sketches spread across a desk" },
  { img: u("photo-1551288049-bebda4e38f71", 800), alt: "Product analytics dashboard with charts" },
  { img: u("photo-1461749280684-dccba630e2f6", 800), alt: "Close-up of clean application code" },
];

const MILESTONE_FLAGS = [
  {
    num: "7",
    label: "First demo live",
    desc: "A clickable slice on a real URL — stakeholders react to a product, not a deck.",
  },
  {
    num: "14",
    label: "Shippable slice",
    desc: "The core loop runs end-to-end. Every Friday after this ships another slice.",
  },
  {
    num: "70",
    label: "v1 in users' hands",
    desc: "Billing live, instrumentation on, and a v1.1 backlog ranked from real evidence.",
  },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  return (
    <SiteShell theme={pageThemes["services/mvp-development"]}>
      {/* ══ DARK · terminal hero — the project scaffolds itself ══ */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
        <div
          aria-hidden
          data-parallax="0.15"
          className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-lime/10 blur-3xl"
        />
        <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Launch the version that proves the point
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Get Your v1 Plan" />
          </div>
          <div data-slide="right">
            <TerminalWindow
              title="day-one — zsh"
              lines={[
                { prompt: "$", text: "auxtech new your-product" },
                { text: "repo created · CI green · staging live", ok: true, dim: true },
                { prompt: "$", text: "git push  # day 7" },
                { text: "demo deployed → day7.your-product.dev", ok: true, dim: true },
                { prompt: "$", text: "ship v1 --week 10" },
                { text: "billing live · users onboarding", ok: true },
              ]}
            />
            <p className="mt-4 text-right text-xs uppercase tracking-[0.24em] text-muted-foreground" data-reveal>
              Ten weeks, replayed in three commands
            </p>
          </div>
        </div>
      </section>

      <BackToParent kind="services" />

      {/* ══ LIGHT · week-by-week ledger rail ══ */}
      <div className="block-light">
        <section className="container-page py-20 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                How it runs
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-split
              >
                Ten weeks, no black box.
              </h2>
              <svg aria-hidden className="mt-5 h-3 w-40 text-lime" viewBox="0 0 160 12" fill="none">
                <path
                  d="M2 8c20-8 40 8 60 0s40-8 60 0 26 2 36-2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  data-draw
                />
              </svg>
            </div>
            <p className="max-w-md text-muted-foreground lg:justify-self-end" data-reveal>
              The calendar is part of the contract. Each phase has a week number, a Friday demo,
              and a written definition of done — so you always know where the build stands.
            </p>
          </div>

          <div className="mt-14" data-reveal-group>
            {page.steps.map((s, i) => (
              <div
                key={s.t}
                data-reveal-child
                className="grid gap-2 border-t border-border py-7 md:grid-cols-[150px_minmax(0,300px)_1fr] md:gap-8 md:py-8 last:border-b"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
                  {WEEK_RAIL[i]}
                </span>
                <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:max-w-lg">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* circle-crop feature trio */}
        <section className="container-page pb-20 md:pb-24" data-cards data-cards-stagger="0.12">
          <div className="grid gap-12 md:grid-cols-3">
            {page.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} data-card>
                  <div className="relative h-40 w-40 md:h-44 md:w-44">
                    <div className="h-full w-full overflow-hidden rounded-full shadow-panel">
                      <img
                        src={FEATURE_PHOTOS[i].img}
                        alt={FEATURE_PHOTOS[i].alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 grid h-12 w-12 place-items-center rounded-full bg-lime text-lime-foreground shadow-panel">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* full-bleed whiteboard band + overlapping milestone flags */}
        <section className="relative pb-20 md:pb-24">
          <div className="relative h-[380px] overflow-hidden md:h-[520px]">
            <img
              src={u("photo-1553877522-43269d4ea984", 1920)}
              alt="Founders sketching the v1 cut-line on a whiteboard"
              className="h-full w-full object-cover"
              data-parallax-img
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
            />
            <div className="absolute left-0 top-8 w-full">
              <div className="container-page">
                <span
                  className="inline-flex rounded-full bg-card px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-panel"
                  data-reveal
                >
                  Week one — the cut-line workshop
                </span>
              </div>
            </div>
          </div>

          <div className="container-page relative z-10 -mt-20 md:-mt-24" data-scatter>
            <div className="grid gap-5 md:grid-cols-3">
              {MILESTONE_FLAGS.map((f) => (
                <div
                  key={f.num}
                  data-scatter-item
                  className="relative rounded-2xl border-t-4 border-lime bg-card p-6 pt-8 shadow-panel"
                >
                  <span className="absolute -top-4 left-6 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-foreground">
                    <Flag className="h-3 w-3" aria-hidden />
                    Milestone
                  </span>
                  <p className="font-display text-4xl font-semibold">
                    Day{" "}
                    <span className="text-lime" data-counter>
                      {f.num}
                    </span>
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold">{f.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══ BOLD · spring-green scope comparison on white card ══ */}
      <div className="block-bold">
        <section className="container-page py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              The cut-line
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-split
            >
              Everything versus the version that ships.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground" data-reveal>
              Every MVP that failed to launch tried to be the full product. Here is the same
              project, run both ways.
            </p>
          </div>

          <div className="mt-12 rounded-3xl bg-card p-3 shadow-panel md:p-5" data-reveal>
            <ComparisonTable
              colA="The everything build"
              colB="The Auxtech cut-line"
              rows={[
                {
                  label: "Scope",
                  a: "Every stakeholder's wishlist",
                  b: "One core loop that proves value",
                  win: "b",
                },
                {
                  label: "Timeline",
                  a: "9–18 months, drifting",
                  b: "8–14 weeks, in the contract",
                  win: "b",
                },
                {
                  label: "First user feedback",
                  a: "After the money is spent",
                  b: "Week 3, on a working slice",
                  win: "b",
                },
                {
                  label: "Investor story",
                  a: "A deck and a promise",
                  b: "A live product with a retention curve",
                  win: "b",
                },
                {
                  label: "Engineering quality",
                  a: "Rushed everywhere",
                  b: "Small surface, built to extend",
                  win: "b",
                },
                {
                  label: "What gets cut",
                  a: "Quality, quietly",
                  b: "Features, in writing, together",
                  win: "b",
                },
              ]}
            />
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3" data-reveal-group>
            {[
              { value: "84%", label: "of MVP clients keep building with us past launch" },
              { value: "10", label: "weeks, median, from workshop to first real users" },
              { value: "0", label: "rebuilds required — the v1 is the foundation" },
            ].map((s) => (
              <div key={s.label} className="border-l border-border pl-5" data-reveal-child>
                <p className="font-display text-4xl font-semibold" data-counter>
                  {s.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══ TINT · benefits ledger + team photo with stat overlap ══ */}
      <div className="block-tint">
        <section className="container-page py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="relative mb-10 lg:mb-0" data-slide="left">
              <div className="overflow-hidden rounded-3xl shadow-panel">
                <img
                  src={u("photo-1522071820081-009f0129c71c", 1400)}
                  alt="The build team pairing on laptops during a weekly slice"
                  className="h-[400px] w-full object-cover md:h-[500px]"
                  data-parallax-img
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -right-3 max-w-[230px] rounded-2xl bg-card p-6 shadow-panel md:-right-8">
                <p className="font-display text-5xl font-semibold text-lime" data-counter>
                  52
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Friday demos ran last year — none skipped
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                Why Auxtech
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold"
                data-split
              >
                What you get that others skip.
              </h2>
              <div className="mt-10" data-reveal-group>
                {page.benefits.map((b, i) => (
                  <div
                    key={b.title}
                    data-reveal-child
                    className="grid gap-2 border-t border-border py-6 md:grid-cols-[64px_1fr] last:border-b"
                  >
                    <span className="font-display text-sm font-semibold text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══ DARK · FAQ + banner ══ */}
      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="services" slug={page.slug} />
    </SiteShell>
  );
}
