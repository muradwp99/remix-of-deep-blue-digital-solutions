/**
 * StatTicker — full-bleed marquee strip of stats/claims separated by accent
 * dots. Reuses the site's .marquee CSS (pauses on hover, disabled under
 * reduced motion).
 */
export function StatTicker({
  items,
  reverse = false,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee border-y border-border/60 bg-surface/40 py-5 ${className}`}>
      <div
        className={`marquee-track flex w-max items-center ${reverse ? "marquee-track-rev" : ""}`}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
            <span className="font-display text-lg font-semibold md:text-xl">{item}</span>
            <span aria-hidden className="mx-8 h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}
