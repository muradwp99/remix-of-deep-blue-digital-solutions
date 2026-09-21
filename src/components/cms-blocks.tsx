import { Link } from "@tanstack/react-router";
import { iconFromName } from "@/lib/cms-catalog";
import { cmsMedia, projectPlaceholder } from "@/lib/cms";
import {
  BenefitList,
  CTABand,
  FAQAccordion,
  FeatureGrid,
  ProcessSteps,
  SectionHead,
  StatsRow,
  Testimonials,
} from "@/components/sections";
import { ComparisonTable, type CompareRow } from "@/components/signature/compare-table";
import { LogoMarquee } from "@/components/signature/logo-wall";
import { OutlineTypeSection } from "@/components/signature/big-type";

/**
 * Composable sections, authored in the CMS.
 *
 * The bespoke pages own their structure in code, which is why they look like
 * themselves and not like each other. This is the other half: a set of blocks
 * an editor can add, reorder and delete, slotted into a page wherever
 * `section_order` puts the `cms-blocks` key.
 *
 * Every block type here renders a component the site already uses, so an
 * authored section inherits the same typography, spacing, reveal animation and
 * per-page theme as a hand-built one. Nothing new was designed for this; a
 * second visual vocabulary that only the CMS could produce is exactly what a
 * block system should not introduce.
 *
 * ONE ROW SHAPE, NOT ONE PER TYPE. A LivePress repeater has fixed sub-fields,
 * so a heterogeneous list of typed blocks cannot each carry their own schema.
 * Every block is therefore the same seven fields and each type reads the ones
 * it needs, with `items` carrying the type-specific part as one line per entry.
 * The alternative — a repeater per block type — cannot interleave types in a
 * single order, which is the whole point.
 */
export type CmsBlockRow = {
  type?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** One entry per line; the pipe-separated columns depend on `type`. */
  items?: string;
  image?: string;
  variant?: string;
};

/**
 * Live collection rows a block can draw on.
 *
 * These blocks list real documents rather than text an editor retyped, so a
 * new project or plan appears in them without anyone touching the page. The
 * route's loader supplies the rows, which keeps the fetch on the server and
 * leaves the block a pure render. A block that fetched for itself would come
 * back empty from the server and pop in after hydration, which is the wrong
 * trade for content a search engine should see.
 */
export type CmsBlockData = {
  projects?: {
    slug?: string;
    title?: string;
    summary?: string | null;
    industry?: string | null;
    tag?: string | null;
    coverImage?: unknown;
  }[];
  team?: { slug?: string; name?: string; role?: string | null; bio?: string | null }[];
  plans?: {
    name?: string;
    price?: string;
    period?: string | null;
    description?: string | null;
    featured?: boolean;
    features?: { label?: string }[];
  }[];
  testimonials?: {
    quote?: string | null;
    author?: string | null;
    role?: string | null;
    company?: string | null;
  }[];
};

/** `a | b | c` per line → trimmed columns, blanks dropped. */
function rows(src?: string): string[][] {
  return (src ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((cell) => cell.trim()));
}

const lines = (src?: string): string[] =>
  (src ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const col = (r: string[], i: number) => r[i] ?? "";

/**
 * The block types an editor can choose, and what `items` means for each.
 *
 * heading   —  (no items)
 * prose     —  (no items)
 * features  —  Icon | Title | Description
 * steps     —  Title | Description
 * benefits  —  Title | Description
 * stats     —  Value | Label
 * faq       —  Question | Answer
 * compare   —  Row label | Column A | Column B | a or b (which wins)
 * marquee   —  one word or phrase per line
 * bigtype   —  one line per line
 * cta       —  Label | /href     (first row primary, second secondary)
 * image     —  (no items)
 */
function Block({ row, data }: { row: CmsBlockRow; data: CmsBlockData }) {
  const type = (row.type ?? "").trim().toLowerCase();
  const eyebrow = row.eyebrow ?? "";
  const heading = row.heading ?? "";
  const body = row.body ?? "";
  const variant = (row.variant ?? "").trim();

  switch (type) {
    case "heading":
      return (
        <section className="container-page py-20">
          <SectionHead eyebrow={eyebrow} title={heading} subtitle={body || undefined} />
        </section>
      );

    case "prose":
      return (
        <section className="container-page py-16">
          {heading && <h2 className="font-display text-4xl md:text-5xl leading-tight">{heading}</h2>}
          {body && (
            <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted-foreground">
              {body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </section>
      );

    case "features":
      return (
        <section className="container-page py-20">
          <FeatureGrid
            eyebrow={eyebrow}
            title={heading}
            subtitle={body || undefined}
            items={rows(row.items).map((r) => ({
              icon: iconFromName(col(r, 0)),
              title: col(r, 1),
              desc: col(r, 2),
            }))}
            variant={
              variant === "rows" || variant === "spotlight" ? variant : "cards"
            }
          />
        </section>
      );

    case "steps":
      return (
        <section className="container-page py-20">
          <ProcessSteps
            eyebrow={eyebrow}
            title={heading}
            steps={rows(row.items).map((r, i) => ({
              n: String(i + 1).padStart(2, "0"),
              t: col(r, 0),
              d: col(r, 1),
            }))}
            variant={variant === "rail" || variant === "ladder" ? variant : "cards"}
          />
        </section>
      );

    case "benefits":
      return (
        <section className="container-page py-20">
          <BenefitList
            eyebrow={eyebrow}
            title={heading}
            items={rows(row.items).map((r) => ({ title: col(r, 0), desc: col(r, 1) }))}
            variant={variant === "grid" ? "grid" : "list"}
          />
        </section>
      );

    case "stats":
      return (
        <section className="container-page py-16">
          <StatsRow stats={rows(row.items).map((r) => ({ value: col(r, 0), label: col(r, 1) }))} />
        </section>
      );

    case "faq":
      return (
        <FAQAccordion
          faqs={rows(row.items).map((r) => ({ q: col(r, 0), a: col(r, 1) }))}
          variant={variant === "wide" ? "wide" : "split"}
        />
      );

    case "compare": {
      const [colA, colB] = (heading || "Typical | Auxtech").split("|").map((c) => c.trim());
      const table: CompareRow[] = rows(row.items).map((r) => ({
        label: col(r, 0),
        a: col(r, 1),
        b: col(r, 2),
        win: col(r, 3) === "a" ? "a" : col(r, 3) === "b" ? "b" : undefined,
      }));
      return (
        <section className="container-page py-20">
          {eyebrow && (
            <p className="mb-8 text-xs uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
          )}
          <ComparisonTable colA={colA || "Typical"} colB={colB || "Auxtech"} rows={table} />
        </section>
      );
    }

    case "marquee":
      return (
        <div className="py-10 border-y border-border/60">
          <LogoMarquee items={lines(row.items)} reverse={variant === "reverse"} />
        </div>
      );

    case "bigtype":
      return (
        <OutlineTypeSection eyebrow={eyebrow || undefined} lines={lines(row.items)} footer={body || undefined} />
      );

    case "cta": {
      const [primary, secondary] = rows(row.items);
      return (
        <CTABand
          eyebrow={eyebrow || undefined}
          title={heading || undefined}
          subtitle={body || undefined}
          primary={primary ? { label: col(primary, 0), to: col(primary, 1) || "/contact" } : undefined}
          secondary={
            secondary ? { label: col(secondary, 0), to: col(secondary, 1) || "/works" } : undefined
          }
        />
      );
    }

    case "image":
      return row.image ? (
        <section className="container-page py-16">
          <figure>
            <img
              src={row.image}
              alt={heading}
              loading="lazy"
              className="w-full rounded-3xl border border-border/60 object-cover"
            />
            {body && (
              <figcaption className="mt-3 text-sm text-muted-foreground">{body}</figcaption>
            )}
          </figure>
        </section>
      ) : null;

    /* ---- Backed by a collection: the block lists documents, not retyped copy ---- */

    case "projects": {
      const items = (data.projects ?? []).slice(0, Number(variant) || 4);
      if (!items.length) return null;
      return (
        <section className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={eyebrow} heading={heading} />
          <div className="grid gap-8 md:grid-cols-2" data-cards>
            {items.map((p) => (
              <Link
                key={p.slug}
                to="/works/$slug"
                params={{ slug: p.slug ?? "" }}
                className="group glare-card gradient-card lift overflow-hidden rounded-3xl"
                data-card
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cmsMedia(p.coverImage) || projectPlaceholder(p.slug ?? "")}
                    alt={p.title ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {[p.industry, p.tag].filter(Boolean).join(" · ")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold md:text-3xl">{p.title}</h3>
                  {p.summary && <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      );
    }

    case "team": {
      const items = data.team ?? [];
      if (!items.length) return null;
      return (
        <section className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={eyebrow} heading={heading} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((t) => (
              <div key={t.slug ?? t.name} data-reveal-child className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl">{t.name}</h3>
                {t.role && <p className="mt-1 text-sm text-gold">{t.role}</p>}
                {t.bio && <p className="mt-3 text-sm text-muted-foreground">{t.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "plans": {
      const items = data.plans ?? [];
      if (!items.length) return null;
      return (
        <section className="container-page border-t border-border/60 py-24" data-reveal-group>
          <BlockHead eyebrow={eyebrow} heading={heading} />
          <div className="grid items-stretch gap-5 md:grid-cols-3" data-cards>
            {items.map((p) => (
              <div
                key={p.name}
                data-card
                className={
                  p.featured
                    ? "gradient-card rounded-3xl border border-gold/40 p-8"
                    : "glass rounded-3xl p-8"
                }
              >
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className="mt-4 font-display text-4xl font-semibold text-gradient-lime">
                  {p.price}
                </p>
                {p.period && <p className="mt-1 text-xs text-muted-foreground">{p.period}</p>}
                {p.description && (
                  <p className="mt-4 text-sm text-muted-foreground">{p.description}</p>
                )}
                {!!p.features?.length && (
                  <ul className="mt-6 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f.label} className="border-t border-border/60 py-2 text-foreground/85">
                        {f.label}
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

    case "testimonials": {
      const items = (data.testimonials ?? []).filter((t) => t.quote);
      if (!items.length) return null;
      return (
        <Testimonials
          items={items.map((t) => ({
            q: t.quote ?? "",
            a: t.author ?? "",
            r: [t.role, t.company].filter(Boolean).join(", "),
          }))}
        />
      );
    }

    default:
      // An unknown type is a typo or a block from a newer schema. Rendering
      // nothing is better than rendering a raw object into the page.
      return null;
  }
}

/** Shared eyebrow + heading for the collection-backed blocks. */
function BlockHead({ eyebrow, heading }: { eyebrow?: string; heading?: string }) {
  if (!eyebrow && !heading) return null;
  return (
    <div className="mb-12">
      {eyebrow && <p className="text-xs uppercase tracking-[0.28em] text-gold">{eyebrow}</p>}
      {heading && (
        <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{heading}</h2>
      )}
    </div>
  );
}

/** Render an authored block list in order. */
export function CmsBlocks({
  blocks,
  data = {},
}: {
  blocks: CmsBlockRow[];
  /** Live rows for the collection-backed types; omit and those blocks render nothing. */
  data?: CmsBlockData;
}) {
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((row, i) => (
        <Block key={`${row.type ?? "block"}-${i}`} row={row} data={data} />
      ))}
    </>
  );
}
