import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Star, TrendingUp } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/sections";
import { PhoneFrame } from "@/components/signature/device-frames";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "app-store-setup";

export const Route = createFileRoute("/services_/app-store-setup")({
  loader: async (): Promise<{ dto: SubpageDTO | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "App Store Setup & ASO — Northline Studio" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "App Store Setup & ASO — Northline Studio" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/* Store-listing mock inside the hero phone — token classes only, so it
   reads correctly on the tint block's pale screen. */
function StoreListing() {
  return (
    <div className="flex h-full flex-col p-4 pt-10 text-left">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
          N
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">Your App</p>
          <p className="text-[10px] text-muted-foreground">Your Company · Productivity</p>
        </div>
        <span className="rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Get
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between border-y border-border py-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-2.5 w-2.5 fill-lime text-lime" aria-hidden />
          4.9 · 2.4k
        </span>
        <span>#3 Productivity</span>
        <span>12+</span>
      </div>
      <div className="mt-3 flex-1 overflow-hidden rounded-xl">
        <img
          src={u("photo-1551650975-87deedd944c3", 600)}
          alt="Dark-themed mobile app running on a phone"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 space-y-1.5 pb-1" aria-hidden>
        <div className="h-2 w-full rounded bg-black/10" />
        <div className="h-2 w-4/5 rounded bg-black/10" />
        <div className="h-2 w-3/5 rounded bg-black/10" />
      </div>
    </div>
  );
}

const REJECTIONS = [
  "Privacy label mismatch",
  "Missing permission strings",
  "IAP rule 3.1.1",
  "Login without demo account",
  "Data-safety form drift",
  "Screenshot device frames",
  "Broken IPv6 network path",
  "Export compliance",
];

function Page() {
  const { dto } = Route.useLoaderData();
  const page = dto ? hydrateSubpage(dto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  return (
    <SiteShell theme={pageThemes["services/app-store-setup"]}>
      {/* ── TINT · pale-azure storefront hero with big PhoneFrame ── */}
      <div className="block-tint">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-44 -top-44 h-[560px] w-[560px] rounded-full border border-black/10"
          />
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full border border-black/10"
          />
          <div className="container-page relative grid items-center gap-16 py-24 md:py-32 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                {page.eyebrow}
              </p>
              <h1
                className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl xl:text-7xl"
                data-split
              >
                Through review on the first pass
              </h1>
              <svg className="mt-5 h-3 w-56 text-lime" viewBox="0 0 220 12" fill="none" aria-hidden>
                <path
                  d="M2 9C40 3 120 2 218 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  data-draw
                />
              </svg>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                {page.subtitle}
              </p>
              <div
                className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full glass-strong px-5 py-2.5"
                data-reveal
              >
                <span className="flex gap-1" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-lime text-lime" />
                  ))}
                </span>
                <span className="font-display text-sm font-bold" data-counter>
                  4.9
                </span>
                <span className="text-xs text-muted-foreground">
                  avg. rating across listings we've shipped
                </span>
              </div>
              <HeroCtas
                primary="Get Store-Ready"
                secondary={{ label: "See Shipped Work", to: "/works" }}
              />
            </div>
            <div className="relative flex justify-center lg:justify-end" data-slide="right">
              <div className="relative">
                <div aria-hidden className="absolute -inset-12 rounded-full bg-lime/15 blur-2xl" />
                <PhoneFrame className="relative">
                  <StoreListing />
                </PhoneFrame>
                <div
                  className="absolute -left-20 top-14 hidden items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold shadow-panel md:flex"
                  data-parallax="0.12"
                >
                  <BadgeCheck className="h-4 w-4 text-lime" aria-hidden />
                  Passed first review
                </div>
                <div
                  className="absolute -right-14 bottom-20 hidden items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold shadow-panel md:flex"
                  data-parallax="-0.08"
                >
                  <TrendingUp className="h-4 w-4 text-lime" aria-hidden />
                  +38% installs
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHT · rejection wall + what's included with circle photo duo ── */}
      <div className="block-light">
        <BackToParent kind="services" />

        <section className="container-page overflow-hidden py-20 md:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                60+ submissions of scar tissue
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-reveal
              >
                Every rejection reason, already met.
              </h2>
              <div className="mt-10 flex flex-wrap gap-3" data-scatter>
                {REJECTIONS.map((r) => (
                  <span
                    key={r}
                    data-scatter-item
                    className="glass rounded-full px-5 py-2.5 text-sm font-medium line-through decoration-lime/70 decoration-2"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-8 max-w-xl text-sm text-muted-foreground" data-reveal>
                Struck through because each one is on our pre-flight checklist — caught before
                submission, not after a week in the review queue.
              </p>
            </div>
            <figure data-slide="right">
              <div className="overflow-hidden rounded-3xl border border-black/10">
                <img
                  src={u("photo-1553877522-43269d4ea984", 1000)}
                  alt="Whiteboard covered in submission planning notes"
                  className="h-72 w-full object-cover md:h-96"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                The pre-flight checklist, built one rejection at a time
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="container-page pb-24 md:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="relative mx-auto h-[420px] w-full max-w-md" data-slide="left">
              <img
                src={u("photo-1512941937669-90a1b58e7e9c", 800)}
                alt="Hand holding a phone with an app open"
                className="absolute left-0 top-0 h-60 w-60 rounded-full border-4 border-background object-cover shadow-panel md:h-72 md:w-72"
                loading="lazy"
              />
              <img
                src={u("photo-1551650975-87deedd944c3", 800)}
                alt=""
                className="absolute bottom-0 right-0 h-48 w-48 rounded-full border-4 border-background object-cover shadow-panel md:h-60 md:w-60"
                loading="lazy"
              />
              <div className="absolute right-0 top-4 rounded-2xl bg-card p-4 text-center shadow-panel">
                <p className="font-display text-3xl font-semibold text-lime" data-counter>
                  60+
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  submissions shipped
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                What's included
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl" data-reveal>
                The work, concretely.
              </h2>
              <div className="mt-10 space-y-4" data-cards data-cards-stagger="0.12">
                {page.features.map((f) => (
                  <div
                    key={f.title}
                    className="flex gap-5 rounded-2xl bg-card p-6 shadow-panel"
                    data-card
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime/10 text-lime">
                      <f.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── DEEP · midnight process ledger + parallax team band ── */}
      <div className="block-deep">
        <section className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                How it runs
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl" data-reveal>
                Audit to approval.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground" data-reveal>
                Four moves, one owner. We file, we track, we answer the reviewer — you watch the
                status change.
              </p>
            </div>
            <ol data-reveal-group>
              {page.steps.map((s, i) => (
                <li
                  key={s.t}
                  className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/10 py-7 last:border-b"
                  data-reveal-child
                >
                  <span className="font-display text-4xl font-semibold type-outline">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mt-16">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={u("photo-1522071820081-009f0129c71c", 1600)}
                alt="Team working through a submission checklist on laptops"
                className="h-72 w-full object-cover md:h-96"
                data-parallax-img
                loading="lazy"
              />
            </div>
            <div
              className="glass-strong absolute -bottom-8 left-6 max-w-sm rounded-2xl p-6 shadow-panel md:left-12"
              data-reveal
            >
              <p className="text-xs uppercase tracking-[0.28em] text-lime">Submission & liaison</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviewer questions get answered by the people who built the listing — not forwarded
                to your inbox.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── BOLD · saturated azure: star-rating counter band + benefits ── */}
      <div className="block-bold">
        <section className="container-page py-20 text-center md:py-28">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
            Proof in the storefront
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl" data-reveal>
            Numbers a reviewer can't argue with.
          </h2>

          <div className="mt-12 flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
            <div className="flex gap-2" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-9 w-9 fill-lime text-lime md:h-12 md:w-12" />
              ))}
            </div>
            <p
              className="font-display text-6xl font-semibold leading-none md:text-8xl"
              data-counter
            >
              4.9/5
            </p>
          </div>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground" data-reveal>
            Average rating across the listings we've shipped — because a store page is a landing
            page, and we treat it like one.
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-3" data-reveal-group>
            {[
              { v: "94%", l: "first-pass approvals" },
              { v: "+38%", l: "median install lift after listing rework" },
              { v: "0", l: "hostage listings — accounts stay yours" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-card p-7 shadow-panel" data-reveal-child>
                <p className="font-display text-4xl font-semibold text-lime md:text-5xl" data-counter>
                  {s.v}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page pb-20 md:pb-28">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
            Why Northline
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold md:text-4xl" data-reveal>
            What you get that others skip.
          </h2>
          <div
            className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-cards
            data-cards-stagger="0.12"
          >
            {page.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-card p-6 shadow-panel" data-card>
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── DARK · FAQ + banner + related ── */}
      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="services" slug={page.slug} />
    </SiteShell>
  );
}
