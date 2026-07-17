import type { ReactNode } from "react";

/** BrowserFrame — chrome-style window around arbitrary content. */
export function BrowserFrame({
  url = "auxtech.studio",
  children,
  className = "",
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-panel backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="mx-auto flex items-center gap-1.5 rounded-full bg-background/60 px-4 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          {url}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** PhoneFrame — slim mobile device shell. */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[2.4rem] border-[6px] border-[oklch(0.24_0.02_265)] bg-background shadow-panel ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[oklch(0.24_0.02_265)]" />
      <div className="relative aspect-[9/19]">{children}</div>
    </div>
  );
}
