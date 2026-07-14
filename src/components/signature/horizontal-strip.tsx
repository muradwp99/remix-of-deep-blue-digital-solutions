import type { ReactNode } from "react";

/**
 * HorizontalPin — pins the section while its track scrubs sideways
 * (data-hscroll hook in lib/animations.ts). Under reduced motion the
 * track simply overflows and scrolls natively.
 */
export function HorizontalPin({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border/60 overflow-hidden" data-hscroll>
      <div className="container-page pt-24 pb-10">
        <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
          {eyebrow}
        </p>
        <h2
          className="mt-4 max-w-3xl font-display text-4xl md:text-6xl leading-tight font-semibold"
          data-reveal
        >
          {title}
        </h2>
      </div>
      <div className="pb-24">
        <div
          className="flex w-max gap-6 pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-24 max-lg:overflow-x-auto max-lg:w-full"
          data-hscroll-track
        >
          {children}
        </div>
      </div>
    </section>
  );
}
