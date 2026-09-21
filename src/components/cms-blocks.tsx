import { iconFromName } from "@/lib/cms-catalog";
import {
  BenefitList,
  CTABand,
  FAQAccordion,
  FeatureGrid,
  ProcessSteps,
  SectionHead,
  StatsRow,
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
function Block({ row }: { row: CmsBlockRow }) {
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

    default:
      // An unknown type is a typo or a block from a newer schema. Rendering
      // nothing is better than rendering a raw object into the page.
      return null;
  }
}

/** Render an authored block list in order. */
export function CmsBlocks({ blocks }: { blocks: CmsBlockRow[] }) {
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((row, i) => (
        <Block key={`${row.type ?? "block"}-${i}`} row={row} />
      ))}
    </>
  );
}
