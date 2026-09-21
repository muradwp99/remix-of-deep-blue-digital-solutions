import { Fragment, type ReactNode } from "react";

/**
 * Render a page's sections in the order the CMS asks for.
 *
 * The bespoke service pages are hand-built: each one is a particular sequence
 * of sections whose dark/light/bold/tint alternation carries the rhythm of the
 * page. They were entirely fixed in code, so an editor could change every word
 * on the page but not drop a section that no longer applied or move one that
 * read better earlier.
 *
 * `blocks` is the page's own sections, keyed, in its coded order. `order` is
 * the `section_order` field on the doc.
 *
 * An empty `order` means the coded order with everything visible, which is
 * what an untouched page gets. A non-empty `order` is taken literally: exactly
 * those sections, in exactly that sequence, so **removing a key hides that
 * section**. That is the point — it is how a section gets deleted without a
 * deploy — but it does mean a half-typed list renders a half-built page, so
 * every page is seeded with its full list and the editor edits down from there
 * rather than up from nothing.
 *
 * Keys the page does not have are ignored rather than rendering a gap, so a
 * stale list left over from an earlier layout degrades to the sections that do
 * still exist instead of breaking the page.
 */
export function PageSections({
  order,
  blocks,
}: {
  order: string[];
  blocks: Record<string, ReactNode>;
}) {
  const wanted = order.filter((key) => key in blocks);
  const keys = wanted.length ? wanted : Object.keys(blocks);

  return (
    <>
      {keys.map((key) => (
        <Fragment key={key}>{blocks[key]}</Fragment>
      ))}
    </>
  );
}
