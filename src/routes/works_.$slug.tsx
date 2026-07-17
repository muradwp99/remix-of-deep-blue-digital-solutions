import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { CTABand } from "@/components/sections";
import { getCaseStudy, getNextCaseStudy } from "@/lib/case-studies";
import { cmsFind, cmsFindOne, cmsMedia, projectPlaceholder, type CmsProject } from "@/lib/cms";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type DetailStudy = {
  slug: string;
  name: string;
  tag: string;
  industry: string;
  year: string;
  hero: string;
  heroAlt: string;
  summary: string;
  services?: string[];
  stack?: string[];
  challenge?: string;
  approach?: { phase: string; detail: string }[];
  outcomes: { value: string; label: string }[];
  images?: { src: string; alt: string }[];
  testimonial?: { quote: string; author: string; role: string };
};

type NextCard = { slug: string; name: string; summary: string; hero: string; heroAlt: string };

const cmsToStudy = (p: CmsProject): DetailStudy => ({
  slug: p.slug,
  name: p.title,
  tag: p.tag || p.client || p.industry || "Case study",
  industry: p.industry || "",
  year: p.year || "",
  hero: cmsMedia(p.coverImage) || projectPlaceholder(p.slug),
  heroAlt: p.title,
  summary: p.summary || "",
  services: p.services?.length ? p.services : undefined,
  stack: p.stack?.length ? p.stack : undefined,
  challenge: p.challenge || undefined,
  approach: p.approach?.length ? p.approach : undefined,
  outcomes: (p.results || []).map((r) => ({ value: r.value, label: r.label })),
  images: (p.gallery || [])
    .map((g) => ({ src: cmsMedia(g.image) || "", alt: p.title }))
    .filter((i) => i.src),
  testimonial: p.testimonial?.quote
    ? {
        quote: p.testimonial.quote,
        author: p.testimonial.author || "",
        role: p.testimonial.role || "",
      }
    : undefined,
});

const cmsToCard = (p: CmsProject): NextCard => ({
  slug: p.slug,
  name: p.title,
  summary: p.summary || "",
  hero: cmsMedia(p.coverImage) || projectPlaceholder(p.slug),
  heroAlt: p.title,
});

export const Route = createFileRoute("/works_/$slug")({
  loader: async ({ params }): Promise<{ study: DetailStudy | null; next: NextCard | null; doc?: CmsProject | null }> => {
    const [one, all] = await Promise.all([
      cmsFindOne<CmsProject>("projects", params.slug, { depth: 2 }),
      cmsFind<CmsProject>("projects", { sort: "-featured", limit: 20, depth: 1 }),
    ]);
    if (one) {
      const idx = all.findIndex((x) => x.slug === one.slug);
      const nextDoc = all.length ? all[(idx + 1) % all.length] : one;
      return { study: cmsToStudy(one), next: cmsToCard(nextDoc), doc: one };
    }
    // Fallback to the built-in case studies
    const cs = getCaseStudy(params.slug);
    if (!cs) return { study: null, next: null };
    const nextCs = getNextCaseStudy(cs.slug);
    return {
      study: cs,
      next: { slug: nextCs.slug, name: nextCs.name, summary: nextCs.summary, hero: nextCs.hero, heroAlt: nextCs.heroAlt },
    };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.study;
    const title = s ? `${s.name} — Case Study — Northline Studio` : "Case Study — Northline Studio";
    const description = s
      ? `${s.name} (${s.industry}, ${s.year}): ${s.summary}`
      : "Selected case studies from Northline Studio.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { study: studyBase, next, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw project doc, then re-map.
  const liveDoc = useLiveEdits(doc ?? null);
  const study = liveDoc ? cmsToStudy(liveDoc) : studyBase;

  if (!study) {
    return (
      <SiteShell theme={pageThemes["works"]}>
        <section className="block-light">
          <div className="container-page py-36">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
              That case study doesn't exist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              The link may be outdated. Every published study lives on the works page.
            </p>
            <Link
              to="/works"
              data-magnetic
              className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to all works
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  const hasNarrative =
    !!study.challenge ||
    (study.approach?.length ?? 0) > 0 ||
    (study.services?.length ?? 0) > 0 ||
    (study.stack?.length ?? 0) > 0;

  return (
    <SiteShell theme={pageThemes["works"]}>
      {/* ---- Hero ---- */}
      <section className="block-light">
        <div className="container-page py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {[study.industry, study.tag, study.year].filter(Boolean).join(" · ")}
          </p>
          <h1
            className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            {study.name}
          </h1>
          <p
            className="mt-6 max-w-[68ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
            data-reveal
          >
            {study.summary}
          </p>
          <figure
            className="mt-12 overflow-hidden rounded-3xl border border-black/10 shadow-elegant"
            data-reveal
          >
            <img
              src={study.hero}
              alt={study.heroAlt}
              className="aspect-[4/3] w-full object-cover md:aspect-[16/9]"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      {/* ---- Meta rail + challenge / approach (only when we have that content) ---- */}
      {hasNarrative && (
        <section className="block-light">
          <div className="container-page grid items-start gap-12 border-t border-border py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-28" data-reveal>
              <div className="glass-strong space-y-7 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Industry</div>
                    <div className="mt-1.5 font-display text-lg font-semibold">{study.industry}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Year</div>
                    <div className="mt-1.5 font-display text-lg font-semibold">{study.year}</div>
                  </div>
                </div>
                {!!study.services?.length && (
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Services</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {study.services.map((s) => (
                        <span key={s} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!!study.stack?.length && (
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stack</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {study.stack.map((s) => (
                        <span key={s} className="glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="space-y-20">
              {study.challenge && (
                <div data-slide="left">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">The challenge</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
                    Where the numbers stood.
                  </h2>
                  <p className="mt-6 max-w-[68ch] text-lg leading-relaxed text-muted-foreground">
                    {study.challenge}
                  </p>
                </div>
              )}
              {!!study.approach?.length && (
                <div data-slide="right">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">The approach</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
                    Three moves, in order.
                  </h2>
                  <div className="mt-8 space-y-3">
                    {study.approach.map((step, i) => (
                      <div key={step.phase} className="glass lift flex gap-5 rounded-2xl p-6">
                        <span className="shrink-0 font-display text-3xl font-semibold text-gradient-lime">
                          0{i + 1}
                        </span>
                        <div>
                          <h3 className="font-display text-xl font-semibold">{step.phase}</h3>
                          <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- Outcomes ---- */}
      {!!study.outcomes.length && (
        <section className="block-tint">
          <div className="container-page py-24" data-reveal-group>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              The outcome
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal-child>
              What changed.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {study.outcomes.map((o) => (
                <div key={o.label} data-reveal-child>
                  <div className="font-display text-5xl font-semibold text-gradient-lime md:text-6xl" data-counter>
                    {o.value}
                  </div>
                  <div className="mt-3 max-w-[26ch] text-sm text-muted-foreground">{o.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Supporting imagery ---- */}
      {!!study.images?.length && (
        <section className="block-light">
          <div className="container-page py-24">
            <div className="grid gap-8 md:grid-cols-2">
              {study.images.map((img, i) => (
                <figure
                  key={img.src}
                  className={`overflow-hidden rounded-3xl border border-black/10 ${
                    i === 0 ? "aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3]" : "aspect-[4/3]"
                  }`}
                  data-reveal
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    data-parallax-img
                    className="h-full w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Testimonial ---- */}
      {study.testimonial && (
        <section className="block-deep" data-reveal-group>
          <div className="container-page py-24 md:py-28">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              In their words
            </p>
            <blockquote className="mt-8 max-w-4xl">
              <p className="font-display text-3xl font-semibold leading-[1.12] md:text-5xl" data-reveal-child>
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>
              <footer className="mt-10" data-reveal-child>
                <div className="font-display text-base font-semibold">{study.testimonial.author}</div>
                <div className="mt-1 text-sm text-muted-foreground">{study.testimonial.role}</div>
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* ---- Next case study ---- */}
      {next && (
        <section className="block-light">
          <Link to="/works/$slug" params={{ slug: next.slug }} className="group block border-t border-border">
            <div className="container-page grid items-center gap-10 py-20 md:grid-cols-[1fr_auto] md:py-24">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Next case study</p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight transition-colors group-hover:text-gold md:text-6xl">
                  {next.name}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{next.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  View case study
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-1" />
                </span>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-black/10 md:w-72">
                <img
                  src={next.hero}
                  alt={next.heroAlt}
                  loading="lazy"
                  data-parallax-img
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
            </div>
          </Link>
        </section>
      )}

      <CTABand
        eyebrow="Your turn"
        title="Want results like these?"
        subtitle="Bring us the metric that matters to your board. We reply within one business day with a plan, a timeline, and a fair budget."
      />
    </SiteShell>
  );
}
