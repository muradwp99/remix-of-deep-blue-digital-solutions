/**
 * OutlineTypeSection — giant outlined display lines; words wrapped in ⟪⟫
 * render in the page accent instead of the outline.
 */
export function OutlineTypeSection({
  eyebrow,
  lines,
  footer,
}: {
  eyebrow?: string;
  lines: string[];
  footer?: string;
}) {
  return (
    <section
      className="container-page py-28 border-t border-border/60 overflow-hidden"
      data-reveal-group
    >
      {eyebrow && (
        <p className="mb-10 text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
          {eyebrow}
        </p>
      )}
      <div className="space-y-2">
        {lines.map((line) => (
          <p
            key={line}
            className="font-display text-[clamp(2.6rem,8vw,7rem)] font-semibold leading-[0.98] tracking-tight"
            data-reveal-child
          >
            {line.split(/(⟪[^⟫]+⟫)/).map((part, i) =>
              part.startsWith("⟪") ? (
                <span key={i} className="text-lime">
                  {part.slice(1, -1)}
                </span>
              ) : (
                <span key={i} className="type-outline">
                  {part}
                </span>
              ),
            )}
          </p>
        ))}
      </div>
      {footer && (
        <p className="mt-10 max-w-xl text-lg text-muted-foreground" data-reveal-child>
          {footer}
        </p>
      )}
    </section>
  );
}
