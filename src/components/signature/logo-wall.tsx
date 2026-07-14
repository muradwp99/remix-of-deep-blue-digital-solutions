/**
 * LogoMarquee — continuously drifting row of platform/tech wordmarks
 * (text-based; no image assets). BadgeGrid — the static, certified-partner
 * variant.
 */
export function LogoMarquee({
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
    <div className={`marquee ${className}`}>
      <div
        className={`marquee-track flex w-max items-center ${reverse ? "marquee-track-rev" : ""}`}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mr-4 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full glass px-6 py-3 font-display text-lg font-semibold text-foreground/85"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BadgeGrid({
  items,
  className = "",
}: {
  items: { label: string; sub?: string }[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${className}`} data-cards>
      {items.map((it) => (
        <div
          key={it.label}
          className="glare-card gradient-card lift rounded-2xl p-6 text-center"
          data-card
        >
          <div className="font-display text-lg font-semibold">{it.label}</div>
          {it.sub && <div className="mt-1 text-xs text-muted-foreground">{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}
