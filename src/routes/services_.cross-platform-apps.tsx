import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { CheckCircle2, GitBranch } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, FAQAccordion } from "@/components/sections";
import { BrowserFrame, PhoneFrame } from "@/components/signature/device-frames";
import { LogoMarquee } from "@/components/signature/logo-wall";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "cross-platform-apps";

export const Route = createFileRoute("/services_/cross-platform-apps")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Cross-Platform App Development — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Cross-Platform App Development — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "device-cluster-hero-real": (
      <>
        {/* ── DARK · device-cluster hero: real product photography in every frame ── */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
          <div className="container-page relative py-24 md:py-32 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mx-auto mt-5 max-w-4xl font-display text-5xl md:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              One codebase, two stores, zero compromise
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <div className="flex justify-center">
              <HeroCtas primary="Scope Your App" secondary={{ label: "See Shipped Apps", to: "/works" }} />
            </div>

            {/* cluster: laptop behind, two phones in front at different parallax speeds */}
            <div className="relative mx-auto mt-16 max-w-3xl">
              <div data-parallax="0.06">
                <BrowserFrame url="app.yourproduct.com" className="mx-auto max-w-xl">
                  <img
                    src={u("photo-1551288049-bebda4e38f71", 1200)}
                    alt="Analytics dashboard of the product, rendered from the shared codebase"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </BrowserFrame>
              </div>
              <div className="absolute -left-2 bottom-[-40px] hidden sm:block" data-parallax="-0.12">
                <PhoneFrame className="!w-36">
                  <img
                    src={u("photo-1551650975-87deedd944c3", 480)}
                    alt="Dark-mode app screen running on an iPhone"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </PhoneFrame>
              </div>
              <div className="absolute -right-2 bottom-[-64px] hidden sm:block" data-parallax="-0.2">
                <PhoneFrame className="!w-36">
                  <img
                    src={u("photo-1558655146-9f40138edfeb", 480)}
                    alt="Grid of app screen mockups on an Android build"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </PhoneFrame>
              </div>
            </div>
            <div className="h-20 sm:h-28" aria-hidden />
          </div>
        </section>

      </>
    ),
    "parity-scoreboard-four": (
      <>
        {/* ── BOLD · parity scoreboard: four stats on the accent field ── */}
        <div className="block-bold">
          <section className="relative overflow-hidden">
            <div className="container-page py-20 md:py-28">
              <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                    The parity promise
                  </p>
                  <h2
                    className="mt-4 max-w-2xl font-display text-4xl md:text-6xl leading-[1.02] font-semibold"
                    data-split
                  >
                    Same week. Both stores. Every feature.
                  </h2>
                </div>
                <p className="max-w-md text-lg text-muted-foreground lg:justify-self-end" data-reveal>
                  Platform drift is how cross-platform projects quietly become two codebases. Our CI
                  blocks a release until both builds pass the same test suite.
                </p>
              </div>

              <div className="mt-14 rounded-3xl bg-card p-6 shadow-panel md:p-10" data-reveal>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Parity scoreboard — release 4.2.0
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                      App Store · shipped
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                      Google Play · shipped
                    </span>
                  </div>
                </div>
                <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
                  {[
                    { v: "100%", l: "feature parity, enforced in CI" },
                    { v: "60fps", l: "animation budget on mid-range devices" },
                    { v: "40%", l: "typical saving vs two native teams" },
                    { v: "1", l: "backlog, one team, one release train" },
                  ].map((s) => (
                    <div key={s.l} data-reveal-child>
                      <div className="font-display text-5xl font-semibold md:text-6xl" data-counter>
                        {s.v}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── LIGHT · framework marquee, the work, and the one-codebase split ── */}
        <div className="block-light">
          <BackToParent kind="services" />

          <section className="border-b border-border/60 py-12">
            <p
              className="container-page mb-6 text-xs uppercase tracking-[0.28em] text-muted-foreground"
              data-reveal
            >
              The stack, argued honestly
            </p>
            <LogoMarquee
              items={[
                "Flutter",
                "React Native",
                "Expo",
                "Swift bridges",
                "Kotlin bridges",
                "Fastlane",
                "TestFlight",
                "App Store",
                "Google Play",
              ]}
            />
          </section>

          <FeatureGrid
            variant="spotlight"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />

          {/* bespoke: two photo panels joined by a drawn "one codebase" line */}
          <section className="container-page pb-24 md:pb-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                One codebase
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-split
              >
                Written once. Native twice.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground" data-reveal>
                One repository, one design language, one test suite — compiled into two apps that
                each feel at home on their platform.
              </p>
            </div>

            <div className="relative mt-16">
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-28 w-full -translate-y-1/2 text-lime lg:block"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M0 104 C 300 104 300 60 600 60 C 900 60 900 104 1200 104"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  data-draw="scrub"
                />
              </svg>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-32">
                <figure
                  className="relative overflow-hidden rounded-3xl bg-card shadow-panel"
                  data-slide="left"
                >
                  <div className="overflow-hidden">
                    <img
                      src={u("photo-1512941937669-90a1b58e7e9c", 1200)}
                      alt="Hand holding a phone running the shipped iOS build"
                      className="aspect-[4/3] w-full object-cover"
                      data-parallax-img
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <p className="font-display text-lg font-semibold">iOS — App Store</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Platform-correct navigation, gestures and haptics, reviewed on real devices.
                      </p>
                    </div>
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-lime" />
                  </figcaption>
                </figure>

                <div className="flex justify-center lg:hidden">
                  <span className="inline-flex items-center gap-2 rounded-full btn-navy px-6 py-3 text-sm font-semibold">
                    <GitBranch className="h-4 w-4" />
                    One codebase
                  </span>
                </div>

                <figure
                  className="relative overflow-hidden rounded-3xl bg-card shadow-panel"
                  data-slide="right"
                >
                  <div className="overflow-hidden">
                    <img
                      src={u("photo-1498050108023-c5249f4df085", 1200)}
                      alt="Laptop showing the shared application code"
                      className="aspect-[4/3] w-full object-cover"
                      data-parallax-img
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <p className="font-display text-lg font-semibold">Android — Google Play</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The same commit, the same suite — pixel parity checked before every release.
                      </p>
                    </div>
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-lime" />
                  </figcaption>
                </figure>
              </div>

              <div
                className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:inline-flex items-center gap-2 rounded-full btn-navy px-6 py-3 text-sm font-semibold"
                data-reveal
              >
                <GitBranch className="h-4 w-4" />
                One codebase
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "process-ledger-circle-crop": (
      <>
        {/* ── TINT · process ledger with circle-crop photos ── */}
        <div className="block-tint">
          <section className="container-page py-20 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  How it runs
                </p>
                <h2
                  className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold"
                  data-split
                >
                  Decision to double launch.
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground" data-reveal>
                  Four moves, one team — from the framework call to simultaneous store submissions,
                  with a build on your phone every week in between.
                </p>
                <div className="mt-12 flex items-center" data-reveal>
                  <img
                    src={u("photo-1553877522-43269d4ea984", 640)}
                    alt="Team mapping the release plan on a whiteboard"
                    className="h-44 w-44 rounded-full border-4 border-background object-cover md:h-52 md:w-52"
                    loading="lazy"
                  />
                  <img
                    src={u("photo-1522071820081-009f0129c71c", 640)}
                    alt="Engineers pairing over laptops during a build week"
                    className="-ml-10 h-32 w-32 rounded-full border-4 border-background object-cover md:h-40 md:w-40"
                    loading="lazy"
                  />
                </div>
              </div>
              <ol className="border-t border-border" data-reveal-group>
                {page.steps.map((s, i) => (
                  <li
                    key={s.t}
                    className="grid gap-3 border-b border-border py-8 sm:grid-cols-[auto_1fr] sm:gap-10"
                    data-reveal-child
                  >
                    <span className="font-display text-4xl font-semibold text-lime md:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
                      <p className="mt-2 text-muted-foreground">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

      </>
    ),
    "benefits-scatter-faq": (
      <>
        {/* ── DARK · benefits scatter, FAQ, banner ── */}
        <section className="container-page py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Why Auxtech
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-split
            >
              What you get that others skip.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2" data-scatter>
            {page.benefits.map((b) => (
              <div key={b.title} className="glass rounded-2xl p-7" data-scatter-item>
                <h3 className="font-display text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </>
    ),
    faq: (
      <>
        <FAQAccordion faqs={page.faqs} />
      </>
    ),
    banner: (
      <>
        <SubpageBanner page={page} />
      </>
    ),
    related: (
      <>
        <RelatedPages kind="services" slug={page.slug} />
      </>
    ),
  };

  return (
    <SiteShell theme={pageThemes["services/cross-platform-apps"]}>
      <PageSections order={liveDto?.sectionOrder ?? []} blocks={blocks} />
    </SiteShell>
  );
}
