import { Check, X } from "lucide-react";

export type CompareRow = {
  label: string;
  a: string;
  b: string;
  /** Which column "wins" the row — gets the accent treatment */
  win?: "a" | "b";
};

/**
 * ComparisonTable — two-column A/B table with row-by-row reveal; the
 * winning cell of each row carries the page accent.
 */
export function ComparisonTable({
  colA,
  colB,
  rows,
  className = "",
}: {
  colA: string;
  colB: string;
  rows: CompareRow[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-border/60 ${className}`}
      data-reveal-group
    >
      <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border/60 bg-surface/60 text-sm font-semibold">
        <span className="px-5 py-4 text-muted-foreground">&nbsp;</span>
        <span className="px-5 py-4">{colA}</span>
        <span className="px-5 py-4 text-lime">{colB}</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border/40 text-sm last:border-b-0"
          data-reveal-child
        >
          <span className="px-5 py-4 font-medium">{row.label}</span>
          <span
            className={`flex items-start gap-2 px-5 py-4 ${row.win === "a" ? "" : "text-muted-foreground"}`}
          >
            {row.win === "b" && (
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            )}
            {row.a}
          </span>
          <span
            className={`flex items-start gap-2 px-5 py-4 ${row.win === "b" ? "font-medium" : "text-muted-foreground"}`}
          >
            {row.win === "b" && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />}
            {row.b}
          </span>
        </div>
      ))}
    </div>
  );
}
