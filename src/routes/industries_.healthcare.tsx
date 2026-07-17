import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { StatsRow } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { getIndustry } from "@/lib/industries";
import { caseStudies } from "@/lib/case-studies";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToIndustryDTO, hydrateIndustry, type IndustryDTO, type CmsIndustry } from "@/lib/cms-catalog";

const SLUG = "healthcare";

export const Route = createFileRoute("/industries_/healthcare")({
  loader: async (): Promise<{ dto: IndustryDTO | null; doc: CmsIndustry | null }> => {
    const doc = await cmsFindOne<CmsIndustry>("industries", SLUG, { depth: 1 });
    return { dto: doc ? cmsToIndustryDTO(doc) : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Healthcare Software — Northline Studio" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Healthcare Software — Northline Studio" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

function EcgLine() {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-24 w-full" aria-hidden>
      <path
        d="M0 60 H300 l20 0 10 -18 12 36 12 -52 14 60 12 -26 10 0 H700 l20 0 10 -18 12 36 12 -52 14 60 12 -26 10 0 H1200"
        fill="none"
        stroke="var(--lime)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        data-draw
      />
    </svg>
  );
}

function PanelNote({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</p>
      <h3 className="mt-3 font-display text-2xl font-semibold">{t}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{d}</p>
    </div>
  );
}

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToIndustryDTO(liveDoc) : dto;
  const ind = liveDto ? hydrateIndustry(liveDto, getIndustry(SLUG)!) : getIndustry(SLUG)!;
  const studies = caseStudies.filter((c) => ind.matches.includes(c.industry));
  return (
    <SiteShell theme={pageThemes["industries/healthcare"]}>
      {/* ── DEEP · calm centered hero with a drawing ECG line ── */}
      <section className="block-deep overflow-hidden">
        <div className="container-page py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {ind.eyebrow}
          </p>
          <h1
            className="mx-auto mt-5 max-w-3xl font-display text-5xl md:text-7xl leading-[0.98] font-semibold"
            data-split
          >
            HIPAA-ready, human-first
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
            {ind.subtitle}
          </p>
          <div className="mt-9 flex justify-center" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
            >
              {ind.banner.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
        <EcgLine />
      </section>

      {/* ── TINT · the domain — header left, principles right ── */}
      <div className="block-tint">
        <section className="container-page py-24 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
                What it takes here
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-5xl leading-tight font-semibold"
                data-reveal
              >
                The domain, taken seriously.
              </h2>
            </div>
            <div data-reveal-group>
              {ind.points.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    data-reveal-child
                    className="flex gap-5 border-t border-black/10 py-7 first:border-t-0 first:pt-0"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/12">
                      <Icon className="h-5 w-5 text-gold" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHT · patient-journey pinned narrative ── */}
      <div className="block-light">
        <StickyPinSteps
          eyebrow="A patient's journey, engineered"
          title="Every step, private and painless."
          steps={[
            {
              t: "Find & book",
              d: "Accessible scheduling that works for a 74-year-old on a 4-year-old phone — WCAG AA as the floor, not the stretch goal.",
            },
            {
              t: "Share safely",
              d: "Intake forms and record access with PHI isolated, encrypted, and access-logged from the first field.",
            },
            {
              t: "Get care",
              d: "Telehealth, reminders, and results designed with clinicians — tested in real workflows, not conference rooms.",
            },
            {
              t: "Stay connected",
              d: "Follow-ups and care plans that patients actually open — 2.1× day-30 retention on our last rebuild.",
            },
          ]}
          panels={[
            <PanelNote
              key="1"
              k="Step 1"
              t="Three taps to booked"
              d="No login wall before value. Guest booking with verified contact — the drop-off killer, removed."
            />,
            <PanelNote
              key="2"
              k="Step 2"
              t="PHI, fenced"
              d="Separate encrypted store, least-privilege access, immutable audit trail. The BAA isn't a formality — it's the architecture."
            />,
            <PanelNote
              key="3"
              k="Step 3"
              t="Clinician-approved"
              d="Every flow shadowed with real staff before build. If a nurse has to double-enter data, we failed."
            />,
            <PanelNote
              key="4"
              k="Step 4"
              t="4.9★ and climbing"
              d="Care software people keep using is the only kind that improves outcomes. Retention is a clinical metric."
            />,
          ]}
        />
      </div>

      {/* ── TINT · case studies ── */}
      {studies.length > 0 && (
        <div className="block-tint">
          <section className="container-page py-24 md:py-28" data-reveal-group>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Proof in this sector
              </p>
              <h2
                className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
                data-reveal-child
              >
                Shipped healthcare work.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2" data-cards>
              {studies.map((c) => (
                <Link
                  key={c.slug}
                  to="/works/$slug"
                  params={{ slug: c.slug }}
                  className="group glare-card gradient-card lift relative overflow-hidden rounded-3xl"
                  data-card
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={c.hero}
                      alt={c.heroAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.28em] text-gold">
                      {c.tag} · {c.year}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── DEEP · proof metrics band ── */}
      <div className="block-deep">
        <StatsRow
          stats={[...ind.stats, { value: "2014", label: "Shipping in regulated rooms since" }]}
        />
      </div>

      {/* ── DARK · conversion banner into footer ── */}
      <BannerCTA
        message={ind.banner.message}
        title={
          <>
            {ind.banner.title} <span className="text-gold">{ind.banner.titleEm}</span>.
          </>
        }
        cta={{ label: ind.banner.label, to: "/contact" }}
      />
    </SiteShell>
  );
}
