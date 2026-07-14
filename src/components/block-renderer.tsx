import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  FeatureGrid,
  ProcessSteps,
  StatsRow,
  Testimonials,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { cmsMedia, lexicalToBlocks, lexicalToPlainText, projectPlaceholder } from "@/lib/cms";
import { iconFromName } from "@/lib/cms-catalog";

/**
 * Renders a Payload `Pages.layout` blocks array into the site's design system.
 *
 * The loader hands us the raw block array (serializable: icons are name strings,
 * relationships are populated objects at depth >= 2); this component resolves
 * icon names to components and maps each block to an existing section component
 * or on-brand inline markup. Adding a block type in the CMS only needs a new
 * case here.
 */

type Block = Record<string, unknown>;
type CtaLink = { label?: string; url?: string; style?: string };

const s = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
/** Relationship fields come back as ids (number) unless populated; keep only populated docs. */
const rels = <T,>(v: unknown): T[] =>
  arr<unknown>(v).filter((x) => x && typeof x === "object") as T[];

function Prose({ value, width }: { value: unknown; width: string }) {
  const blocks = lexicalToBlocks(value);
  const max = width === "narrow" ? "max-w-[60ch]" : width === "wide" ? "max-w-5xl" : "max-w-[72ch]";
  return (
    <section className="container-page border-t border-border/60 py-20">
      <div className={`mx-auto ${max} space-y-6`}>
        {blocks.map((b, i) => (
          <div key={i} data-reveal>
            {b.h && <h2 className="pt-2 font-display text-2xl font-semibold md:text-3xl">{b.h}</h2>}
            {b.p && <p className="text-[17px] leading-relaxed text-muted-foreground">{b.p}</p>}
            {b.list && (
              <ul className="space-y-3">
                {b.list.map((it) => (
                  <li key={it.slice(0, 24)} className="flex gap-3 text-[17px] leading-relaxed text-muted-foreground">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Hero({ block }: { block: Block }) {
  const img = cmsMedia(block.image);
  const links = arr<CtaLink>(block.links);
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {img && (
        <>
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" data-parallax-img />
          <div className="absolute inset-0 bg-background/85" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/20" />
        </>
      )}
      <div className="absolute inset-0 grain-bg pointer-events-none" />
      <div className="container-page relative py-28 md:py-36">
        {s(block.eyebrow) && (
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
            {s(block.eyebrow)}
          </p>
        )}
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl" data-reveal>
          {s(block.heading)}
        </h1>
        {s(block.subheading) && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
            {s(block.subheading)}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3" data-reveal>
            {links.map((l, i) => (
              <Link
                key={s(l.url) + i}
                to={s(l.url) || "/contact"}
                className={
                  l.style === "secondary"
                    ? "inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
                    : "group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
                }
              >
                {s(l.label)}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BlockHead({ eyebrow, heading }: { eyebrow?: string; heading?: string }) {
  if (!eyebrow && !heading) return null;
  return (
    <div className="mb-12 max-w-3xl">
      {eyebrow && <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>{eyebrow}</p>}
      {heading && (
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
          {heading}
        </h2>
      )}
    </div>
  );
}

function renderBlock(block: Block, i: number) {
  switch (s(block.blockType)) {
    case "hero":
      return <Hero key={i} block={block} />;

    case "content":
      return <Prose key={i} value={block.content} width={s(block.width) || "normal"} />;

    case "featureGrid":
      return (
        <FeatureGrid
          key={i}
          eyebrow={s(block.eyebrow)}
          title={s(block.heading)}
          subtitle={s(block.intro) || undefined}
          cols={(Number(s(block.columns)) || 3) as 2 | 3 | 4}
          items={arr<{ icon?: string; title?: string; text?: string }>(block.items).map((it) => ({
            icon: iconFromName(it.icon),
            title: s(it.title),
            desc: s(it.text),
          }))}
        />
      );

    case "timeline":
      return (
        <ProcessSteps
          key={i}
          eyebrow={s(block.eyebrow)}
          title={s(block.heading)}
          steps={arr<{ marker?: string; title?: string; text?: string }>(block.steps).map((st, n) => ({
            n: s(st.marker) || String(n + 1).padStart(2, "0"),
            t: s(st.title),
            d: s(st.text),
          }))}
        />
      );

    case "stats":
      return (
        <div key={i}>
          {s(block.heading) && (
            <div className="container-page pt-20">
              <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl" data-reveal>
                {s(block.heading)}
              </h2>
            </div>
          )}
          <StatsRow
            stats={arr<{ value?: string; label?: string }>(block.items).map((x) => ({
              value: s(x.value),
              label: s(x.label),
            }))}
          />
        </div>
      );

    case "cta": {
      const links = arr<CtaLink>(block.links);
      return (
        <CTABand
          key={i}
          eyebrow="Next step"
          title={s(block.heading) || undefined}
          subtitle={s(block.text) || undefined}
          primary={links[0] ? { label: s(links[0].label), to: s(links[0].url) || "/contact" } : undefined}
          secondary={links[1] ? { label: s(links[1].label), to: s(links[1].url) || "/contact" } : undefined}
        />
      );
    }

    case "testimonialsBlock":
      return (
        <Testimonials
          key={i}
          items={rels<{ quote?: string; author?: string; role?: string; company?: string }>(
            block.testimonials,
          ).map((t) => ({
            q: s(t.quote),
            a: s(t.author),
            r: [s(t.role), s(t.company)].filter(Boolean).join(", "),
          }))}
        />
      );

    case "faqList":
      return (
        <FAQAccordion
          key={i}
          faqs={rels<{ question?: string; answer?: unknown }>(block.faqs).map((f) => ({
            q: s(f.question),
            a: lexicalToPlainText(f.answer),
          }))}
        />
      );

    case "projectsShowcase": {
      const projects = rels<{ slug?: string; title?: string; summary?: string; industry?: string; tag?: string; coverImage?: unknown }>(
        block.projects,
      );
      if (!projects.length) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={s(block.eyebrow)} heading={s(block.heading)} />
          <div className="grid gap-8 md:grid-cols-2" data-cards>
            {projects.map((p) => (
              <Link
                key={s(p.slug)}
                to="/works/$slug"
                params={{ slug: s(p.slug) }}
                className="group glare-card gradient-card lift overflow-hidden rounded-3xl"
                data-card
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cmsMedia(p.coverImage) || projectPlaceholder(s(p.slug))}
                    alt={s(p.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {[s(p.industry), s(p.tag)].filter(Boolean).join(" · ")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold md:text-3xl">{s(p.title)}</h3>
                  {s(p.summary) && <p className="mt-3 text-sm text-muted-foreground">{s(p.summary)}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      );
    }

    case "pricingBlock": {
      const plans = rels<{ name?: string; price?: string; period?: string; description?: string; featured?: boolean; features?: { label?: string }[] }>(
        block.plans,
      );
      if (!plans.length) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={s(block.eyebrow)} heading={s(block.heading)} />
          <div className="grid gap-5 md:grid-cols-3 items-stretch" data-cards>
            {plans.map((p) => (
              <div
                key={s(p.name)}
                className={`relative flex flex-col rounded-3xl p-8 lift ${p.featured ? "gradient-card-gold glare-card" : "glass glare-card"}`}
                data-card
              >
                <h3 className="font-display text-2xl font-semibold">{s(p.name)}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold">{s(p.price)}</span>
                  {s(p.period) && <span className="text-sm text-muted-foreground">{s(p.period)}</span>}
                </p>
                {s(p.description) && <p className="mt-4 text-sm text-muted-foreground">{s(p.description)}</p>}
                <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
                  {arr<{ label?: string }>(p.features).map((f) => (
                    <li key={s(f.label)} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                      {s(f.label)}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto block pt-8">
                  <span className={`block rounded-full px-4 py-3 text-center text-sm font-medium ${p.featured ? "bg-gold text-gold-foreground" : "btn-navy"}`}>
                    Get started
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "teamShowcase": {
      const members = rels<{ name?: string; role?: string; photo?: unknown }>(block.members);
      if (!members.length) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={s(block.eyebrow)} heading={s(block.heading)} />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3" data-cards data-cards-stagger="0.1">
            {members.map((m) => (
              <div key={s(m.name)} className="group glare-card gradient-card lift overflow-hidden rounded-2xl" data-card>
                {cmsMedia(m.photo) && (
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={cmsMedia(m.photo)} alt={s(m.name)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{s(m.name)}</h3>
                  {s(m.role) && <p className="mt-0.5 text-sm text-muted-foreground">{s(m.role)}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "gallery": {
      const images = arr<{ image?: unknown; caption?: string }>(block.images);
      if (!images.length) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-24">
          <BlockHead heading={s(block.heading)} />
          <div className="grid gap-6 md:grid-cols-2" data-reveal-group>
            {images.map((im, n) => {
              const src = cmsMedia(im.image);
              if (!src) return null;
              return (
                <figure key={n} className="overflow-hidden rounded-3xl border border-black/10" data-reveal-child>
                  <img src={src} alt={s(im.caption)} loading="lazy" data-parallax-img className="aspect-[4/3] w-full object-cover" />
                  {s(im.caption) && <figcaption className="p-4 text-sm text-muted-foreground">{s(im.caption)}</figcaption>}
                </figure>
              );
            })}
          </div>
        </section>
      );
    }

    case "media": {
      const src = cmsMedia(block.media);
      if (!src) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-20">
          <figure className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-black/10" data-reveal>
            <img src={src} alt={s(block.caption)} loading="lazy" data-parallax-img className="w-full object-cover" />
            {s(block.caption) && <figcaption className="p-4 text-center text-sm text-muted-foreground">{s(block.caption)}</figcaption>}
          </figure>
        </section>
      );
    }

    case "logoCloud": {
      const logos = arr<{ name?: string; logo?: unknown }>(block.logos);
      if (!logos.length) return null;
      return (
        <section key={i} className="container-page border-t border-border/60 py-20">
          <BlockHead heading={s(block.heading)} />
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6" data-reveal-group>
            {logos.map((lg, n) => {
              const src = cmsMedia(lg.logo);
              return src ? (
                <img key={n} src={src} alt={s(lg.name)} className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" data-reveal-child />
              ) : (
                <span key={n} className="font-display text-lg text-muted-foreground" data-reveal-child>{s(lg.name)}</span>
              );
            })}
          </div>
        </section>
      );
    }

    case "banner": {
      const tone = s(block.tone) || "info";
      const toneClass =
        tone === "gold" || tone === "warning"
          ? "border-gold/30 bg-gold/10"
          : tone === "success"
            ? "border-lime/30 bg-lime/10"
            : "border-border bg-surface";
      return (
        <section key={i} className="container-page py-12">
          <div className={`mx-auto max-w-4xl rounded-2xl border p-8 ${toneClass}`} data-reveal>
            {lexicalToBlocks(block.content).map((b, n) => (
              <p key={n} className="text-[17px] leading-relaxed text-foreground/90">{b.p || b.h}</p>
            ))}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => renderBlock(b, i))}</>;
}
