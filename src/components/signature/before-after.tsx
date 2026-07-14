import { useCallback, useRef, useState } from "react";

/**
 * BeforeAfterSlider — pointer-draggable divider between two images.
 * The range input underneath keeps it keyboard- and screen-reader-usable.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "",
  className = "",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);

  const fromPointer = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div className={className}>
      <div
        ref={frame}
        className="relative aspect-[16/9] cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl border border-border/60 select-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons) fromPointer(e.clientX);
        }}
      >
        <img src={before} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img src={after} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        {/* divider */}
        <div
          className="absolute inset-y-0 z-10 w-px bg-lime shadow-[0_0_24px_2px_var(--lime)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-lime/60 bg-background/85 text-[10px] font-semibold text-lime backdrop-blur-sm">
            ⇄
          </span>
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute top-4 left-4 rounded-full bg-lime px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-background">
          {afterLabel}
        </span>
      </div>
      <label className="sr-only" htmlFor="ba-range">
        Compare {beforeLabel} and {afterLabel}
      </label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--lime)]"
      />
    </div>
  );
}
