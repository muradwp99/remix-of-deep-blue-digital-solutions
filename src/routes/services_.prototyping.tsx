import type { ReactNode } from "react";
import { PageSections } from "@/components/page-sections";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { Quote } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, FAQAccordion } from "@/components/sections";
import { PhoneFrame } from "@/components/signature/device-frames";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "prototyping";

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const Route = createFileRoute("/services_/prototyping")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Wireframing & Prototyping — Auxtech" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Wireframing & Prototyping — Auxtech" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

/* Mock phone screens — designed for light/tint contexts (black-alpha + tokens) */
function WireScreen() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 pt-10">
      <div className="h-5 w-2/3 rounded border-2 border-dashed border-black/20" />
      <div className="h-2.5 w-full rounded bg-black/10" />
      <div className="h-2.5 w-4/5 rounded bg-black/10" />
      <div className="mt-1 grid h-24 place-items-center rounded-xl border-2 border-dashed border-black/20">
        <div className="h-8 w-8 rounded-full border-2 border-dashed border-black/20" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-12 rounded-lg border-2 border-dashed border-black/15" />
        <div className="h-12 rounded-lg border-2 border-dashed border-black/15" />
      </div>
      <div className="mt-auto h-10 rounded-full bg-black/10" />
    </div>
  );
}

function HiFiScreen() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 pt-10">
      <div className="h-5 w-2/3 rounded bg-lime/80" />
      <div className="h-2.5 w-full rounded bg-black/10" />
      <div className="h-2.5 w-4/5 rounded bg-black/10" />
      <div className="mt-1 h-24 rounded-xl bg-lime/15 p-3">
        <div className="h-3 w-1/2 rounded bg-lime/70" />
        <div className="mt-2 h-2 w-2/3 rounded bg-black/15" />
        <div className="mt-1.5 h-2 w-1/2 rounded bg-black/10" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-12 rounded-lg bg-black/5" />
        <div className="h-12 rounded-lg bg-black/5" />
      </div>
      <div className="mt-auto h-10 rounded-full bg-lime" />
    </div>
  );
}

/* Sticky-note findings for the tint-block corkboard */
const findings = [
  {
    note: "“I’d expect the price before the sign-up.”",
    tag: "6 of 8 users · pricing moved up a screen",
    color: "bg-[oklch(0.86_0.075_40)]",
    rotate: "-rotate-2",
    fling: "-140,70,-12",
    offset: "",
  },
  {
    note: "Nobody found the compare tab.",
    tag: "Nav relabelled · fix queued for build",
    color: "bg-[oklch(0.86_0.128_158)]",
    rotate: "rotate-1",
    fling: "120,90,9",
    offset: "lg:mt-10",
  },
  {
    note: "“Wait — is this already live?”",
    tag: "Asked twice, unprompted",
    color: "bg-[oklch(0.86_0.070_245)]",
    rotate: "rotate-2",
    fling: "-90,-80,7",
    offset: "lg:mt-4",
  },
  {
    note: "Checkout step 3: four fields too many.",
    tag: "Cut to two · completion up in retest",
    color: "bg-[oklch(0.86_0.106_335)]",
    rotate: "-rotate-1",
    fling: "150,-60,-8",
    offset: "lg:-mt-2",
  },
  {
    note: "The “smart feed” got zero taps.",
    tag: "Descoped from v1 — three weeks saved",
    color: "bg-[oklch(0.91_0.046_40)]",
    rotate: "rotate-3",
    fling: "90,130,11",
    offset: "lg:mt-8",
  },
];

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "services") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  const blocks: Record<string, ReactNode> = {
    "white-hero-dark": (
      <>
        {/* ============ WHITE HERO — dark text, fidelity trio of phones ============ */}
        <div className="block-light">
          <BackToParent kind="services" />
          <section className="relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 [background-image:radial-gradient(circle,oklch(0.2_0.03_265/0.09)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />
            <div className="container-page relative grid items-center gap-16 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  {page.eyebrow}
                </p>
                <h1
                  className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl xl:text-7xl"
                  data-split
                >
                  Test the idea before you fund it
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                  {page.subtitle}
                </p>
                <HeroCtas primary="Test Your Idea" />
                <p className="mt-10 max-w-md border-l-2 border-lime pl-4 text-sm text-muted-foreground" data-reveal>
                  Sketch to wireframe to production fidelity — the same screen, three times
                  cheaper each step earlier a flaw is caught.
                </p>
              </div>

              <div className="relative">
                {/* hand-drawn arc over the trio */}
                <svg
                  aria-hidden
                  viewBox="0 0 320 60"
                  fill="none"
                  className="absolute -top-8 left-1/2 hidden w-[72%] -translate-x-1/2 text-lime md:block"
                >
                  <path
                    d="M8 52 C 90 4, 230 4, 306 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    data-draw
                  />
                  <path
                    d="M296 28 L307 41 L291 44"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-draw
                  />
                </svg>
                <div className="flex items-start justify-center gap-3 sm:gap-5" data-cards data-cards-stagger="0.16">
                  <div data-card>
                    <div className="-rotate-3">
                      <PhoneFrame className="!w-28 sm:!w-36 lg:!w-40">
                        <img
                          src={u("photo-1581291518857-4e27b48ff24e", 600)}
                          alt="Hand sketching a mobile app wireframe on paper"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </PhoneFrame>
                    </div>
                    <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Sketch
                    </p>
                  </div>
                  <div className="mt-8" data-card>
                    <div className="rotate-1">
                      <PhoneFrame className="!w-28 sm:!w-36 lg:!w-40">
                        <WireScreen />
                      </PhoneFrame>
                    </div>
                    <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Wireframe
                    </p>
                  </div>
                  <div className="mt-16" data-card>
                    <div className="rotate-3">
                      <PhoneFrame className="!w-28 sm:!w-36 lg:!w-40">
                        <HiFiScreen />
                      </PhoneFrame>
                    </div>
                    <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-lime">
                      Hi-fi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "tint-pinned-fidelity": (
      <>
        {/* ============ TINT — pinned fidelity ladder + sticky-note findings ============ */}
        <div className="block-tint">
          <StickyPinSteps
            eyebrow="How it runs"
            title="Up the fidelity ladder in weeks."
            steps={page.steps}
            panels={[
              <div key="risk" className="glass-strong rounded-2xl p-8 shadow-panel">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  The kill question
                </p>
                <p className="mt-4 font-display text-2xl font-semibold leading-snug">
                  &ldquo;What would we need to see to know this idea is wrong?&rdquo;
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Written down first, so the test can&rsquo;t be argued away later.
                </p>
              </div>,
              <div key="wire" className="flex justify-center">
                <PhoneFrame className="!max-w-[230px]">
                  <WireScreen />
                </PhoneFrame>
              </div>,
              <div key="hifi" className="flex justify-center">
                <PhoneFrame className="!max-w-[230px]">
                  <HiFiScreen />
                </PhoneFrame>
              </div>,
              <div key="log" className="glass-strong rounded-2xl p-8 shadow-panel">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Session log — day four
                </p>
                <div className="mt-5 space-y-0 text-sm">
                  {[
                    ["Core task, unprompted", "7/8"],
                    ["Median time to first action", "11s"],
                    ["Navigation fixes queued", "2"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-border/60 py-3"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-display font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-semibold text-lime">Verdict: proceed to build.</p>
              </div>,
            ]}
          />

          {/* Bespoke: corkboard of test findings as sticky notes */}
          <section className="container-page pb-24 pt-4 md:pb-28">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                Field notes
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-split
              >
                What five users find in an afternoon.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground" data-reveal>
                Real findings from a recent test week — each one caught for the price of a
                sticky note instead of a sprint.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-scatter>
              {findings.map((f) => (
                <div key={f.note} className={f.offset} data-scatter-item={f.fling}>
                  <div
                    className={`relative flex min-h-[190px] flex-col p-6 ${f.color} ${f.rotate} shadow-[var(--shadow-panel)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
                  >
                    <span
                      aria-hidden
                      className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-black/10"
                    />
                    <p className="font-display text-lg font-semibold leading-snug text-[oklch(0.14_0.07_268)]">
                      {f.note}
                    </p>
                    <p className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.225_0.08_268)]">
                      {f.tag}
                    </p>
                  </div>
                </div>
              ))}
              {/* pinned polaroid among the notes */}
              <div className="lg:mt-6" data-scatter-item="-70,140,-6">
                <div className="relative -rotate-2 bg-card p-2.5 pb-8 shadow-[var(--shadow-panel)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1">
                  <span
                    aria-hidden
                    className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 bg-black/10"
                  />
                  <img
                    src={u("photo-1561070791-2526d30994b5", 700)}
                    alt="Design desk covered in colorful printed screens during a test debrief"
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                  <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Debrief, day five
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    "deep-verdict-stat": (
      <>
        {/* ============ DEEP — the verdict: 7/8 stat + quote over photo ============ */}
        <div className="block-deep">
          <section className="container-page grid items-center gap-16 py-24 md:py-32 lg:grid-cols-2">
            <div data-slide="left">
              <p className="text-xs uppercase tracking-[0.28em] text-lime">Test week verdict</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Evidence beats the meeting.
              </h2>
              <p
                className="mt-8 font-display text-7xl font-semibold text-gradient-lime md:text-8xl"
                data-counter
              >
                7/8
              </p>
              <p className="mt-3 max-w-md text-muted-foreground">
                users completed the core task unprompted — proceed, with two navigation fixes
                queued before a single sprint was committed.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div>
                  <p className="font-display text-3xl font-semibold md:text-4xl" data-counter>
                    8
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">sessions on camera</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold md:text-4xl" data-counter>
                    48h
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">to the findings report</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold md:text-4xl" data-counter>
                    0
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    lines of production code risked
                  </p>
                </div>
              </div>
            </div>

            <div className="relative pb-12" data-slide="right">
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={u("photo-1552664730-d307ca884978", 1200)}
                  alt="Team gathered around a whiteboard reviewing prototype test findings"
                  loading="lazy"
                  className="h-[380px] w-full object-cover md:h-[440px]"
                  data-parallax-img
                />
              </div>
              <figure className="glass-strong absolute -bottom-2 -left-2 max-w-sm rounded-2xl p-6 shadow-panel md:-left-8">
                <Quote className="h-5 w-5 text-gold" aria-hidden />
                <blockquote className="mt-3 font-display text-lg font-semibold leading-snug">
                  &ldquo;We watched eight strangers try to break it. Two fixes later we funded
                  the build with total confidence — and cut a feature nobody missed.&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  Product lead, B2B SaaS pilot
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

      </>
    ),
    "light-whats-included": (
      <>
        {/* ============ LIGHT — what's included + editorial benefits ledger ============ */}
        <div className="block-light">
          <FeatureGrid
            variant="rows"
            eyebrow="What's included"
            title="The work, concretely."
            cols={3}
            items={page.features}
          />

          <section className="container-page pb-24 pt-4 md:pb-28">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
              {/* tilted sketch pair */}
              <div className="relative min-h-[440px] self-start lg:sticky lg:top-28" data-slide="left">
                <div className="absolute left-0 top-0 w-3/4 -rotate-3 bg-card p-2.5 pb-9 shadow-panel">
                  <img
                    src={u("photo-1522542550221-31fd19575a2d", 900)}
                    alt="Interface design sketches spread across a desk"
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                  <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Week one — paper
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 rotate-2 bg-card p-2.5 pb-9 shadow-panel">
                  <img
                    src={u("photo-1572044162444-ad60f128bdea", 800)}
                    alt="Notebook page filled with app screen sketches"
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                  <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Argued over cheaply
                  </p>
                </div>
              </div>

              {/* numbered ledger of benefits */}
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
                  Why Auxtech
                </p>
                <h2
                  className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl"
                  data-split
                >
                  What you get that others skip.
                </h2>
                <div className="mt-10" data-reveal-group>
                  {page.benefits.map((b, i) => (
                    <div
                      key={b.title}
                      className="grid gap-3 border-t border-border py-7 md:grid-cols-[64px_1fr] md:gap-6"
                      data-reveal-child
                    >
                      <span className="font-display text-sm font-semibold text-lime">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold">{b.title}</h3>
                        <p className="mt-2 max-w-lg text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border" />
                </div>
              </div>
            </div>
          </section>
        </div>

      </>
    ),
    faq: (
      <>
        {/* ============ DARK — FAQ + banner + related ============ */}
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
    <SiteShell theme={pageThemes["services/prototyping"]}>
      <PageSections
        order={liveDto?.sectionOrder ?? []}
        blocks={blocks}
        cmsBlocks={liveDto?.pageBlocks ?? []}
      />
    </SiteShell>
  );
}
