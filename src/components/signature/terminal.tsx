import { Check } from "lucide-react";

export type TerminalLine = {
  /** Prompt glyph rendered before the typed text (not typed itself) */
  prompt?: string;
  text: string;
  /** Render a check mark after the line (build/test output) */
  ok?: boolean;
  /** Dim the line (comments, output) */
  dim?: boolean;
};

/**
 * TerminalWindow — a themed console that types its lines out on scroll
 * (data-typewriter hook in lib/animations.ts). Reduced motion shows the
 * final text instantly.
 */
export function TerminalWindow({
  title = "auxtech — zsh",
  lines,
  className = "",
}: {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.1_0.02_265/0.92)] shadow-panel backdrop-blur-sm ${className}`}
      data-typewriter
    >
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime/70" />
        <span className="ml-2 text-[11px] text-muted-foreground/70">{title}</span>
      </div>
      <div className="space-y-1.5 p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={`flex items-baseline gap-2 ${line.dim ? "opacity-55" : ""}`}>
            {line.prompt && <span className="shrink-0 select-none text-lime">{line.prompt}</span>}
            <span className="text-foreground/90" data-typewriter-line>
              {line.text}
            </span>
            {line.ok && <Check className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-lime" />}
          </div>
        ))}
      </div>
    </div>
  );
}
