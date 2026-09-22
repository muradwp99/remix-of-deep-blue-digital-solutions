/**
 * LivePress design tokens — admin-editable visual style.
 *
 * Reads the `design` global and overrides root CSS variables. Only keys the
 * editor has actually set are applied, so an empty option changes nothing. In
 * edit mode the same tokens stream in live over `aux-design` postMessages
 * (slider drags restyle instantly).
 *
 * ## Why this is more than four assignments
 *
 * The accent is not one variable. `--gold` colours text and rules, but the
 * buttons, glows, sheens, gradients, focus ring and section-block palette all
 * read from about twenty *derived* tokens that themes.ts recomputes per page
 * from a single hue. Setting `--gold` alone repaints the text and leaves every
 * button on the old colour — a control that half works, which is worse than
 * one that does not.
 *
 * So the Accent runs through `makeTheme`, the same generator the per-page
 * themes use, including its contrast guardrails and sRGB gamut clamping. The
 * light and lightest controls then override the specific tokens their labels
 * claim, and the page background derives the neutral ramp.
 *
 * ## The four controls
 *
 * - **Accent** (`gold500`) — the whole derived family, plus `--gold` itself
 *   set to the exact colour picked, so the flat accent is what the picker
 *   showed rather than the generator's slightly-darkened sibling.
 * - **Accent, light** (`gold400`) — the light end: the top stop of the button
 *   gradient, the warm glow, the two sheens, the bold section-block
 *   background, and the light stop of `--gradient-lime`.
 * - **Accent, lightest** (`gold300`) — `--lime`, which this codebase
 *   repurposed as the lighter sibling of gold (see styles.css), and the button
 *   border, which is the lightest accent surface on the page.
 * - **Page background** (`ink950`) — `--background` plus the surfaces,
 *   cards, popovers and inputs, keeping the lightness deltas the stylesheet
 *   uses today so the depth of the design survives a different base.
 *
 * ## Two deliberate limits
 *
 * A themed page sets these same variables as an inline style on the shell
 * root, and an inline style on an ancestor beats a `:root` rule, so the 31
 * themed routes keep their own accent and only the untuned pages follow the
 * editor. That is intended: the editor sets the brand accent, the themes stay
 * themselves.
 *
 * The background is clamped to stay dark. The control's own description is
 * "the near-black the whole site sits on" — it tunes that near-black, and it
 * is not a light-mode switch. Every foreground token in the stylesheet is
 * near-white, so an unclamped light pick would render the site unreadable in
 * one click. themes.ts clamps its accents for the same reason.
 *
 * ## The background is the one control themed pages cannot ignore
 *
 * Accents stop at the shell's inline style, but `--background` is not in a
 * theme's vars, so every page takes it — which is right, it is the page the
 * whole site sits on. The catch is that a theme's `--surface`, `--surface-2`
 * and `--card` are absolute lightnesses authored against the stylesheet's own
 * 0.14 base, so raising the base alone leaves the cards *darker than the page*
 * and the depth of the design reads inside out.
 *
 * `shiftSurfaces` fixes that by moving those three by the same delta the base
 * moved, keeping each theme's hue and chroma. The offsets were the design's
 * sense of depth; shifting preserves it instead of re-deciding it.
 */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsGlobal } from "@/lib/cms";
import { isEditMode } from "@/lib/edit-bridge";
import { makeTheme, oklchFromHex, type PageTheme } from "@/lib/themes";

export type DesignTokens = {
  /** LivePress's Design screen. */
  gold500?: string;
  gold400?: string;
  gold300?: string;
  ink950?: string;
  /** Hand-set keys this component has always accepted. */
  radius?: string;
  gold?: string;
  lime?: string;
};

/** Darkest the page may be told to be. Above this the near-white type fails. */
const INK_MAX_L = 0.32;

/**
 * A radius is a CSS length, and the stylesheet's own value is `0.75rem`.
 * A bare number means px — that is what a pixel slider would send — but a
 * value that already carries a unit is passed through, so a `rem` cannot end
 * up as `0.75px` and flatten every rounded corner on the site.
 */
function length(v: string): string {
  const t = v.trim();
  return /^-?[\d.]+$/.test(t) ? `${t}px` : t;
}

/** `color-mix` rather than an oklch alpha, so any CSS colour the editor sends works. */
const fade = (color: string, percent: number) =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)`;

const oklch = (l: number, c: number, h: number) =>
  `oklch(${Math.round(l * 1000) / 1000} ${Math.round(c * 1000) / 1000} ${Math.round(h * 1000) / 1000})`;

/**
 * The neutral ramp, rebuilt on a new base.
 *
 * The offsets are the ones :root uses today (background 0.14, card 0.175,
 * surface 0.18 …), so they are the design's own sense of depth rather than a
 * guess — applying them to a different base reproduces the same separation.
 */
const INK_STEPS: [string, number, number][] = [
  ["--background", 0, 0.07],
  ["--popover", 0.025, 0.075],
  ["--card", 0.035, 0.075],
  ["--surface", 0.04, 0.075],
  ["--muted", 0.065, 0.075],
  ["--surface-2", 0.075, 0.08],
  ["--secondary", 0.085, 0.08],
  ["--input", 0.16, 0.075],
];

function tokens(t: DesignTokens): Record<string, string> {
  const out: Record<string, string> = {};

  if (t.radius) out["--radius"] = length(t.radius);

  const accent = t.gold500 || t.gold;
  if (accent) {
    const base = oklchFromHex(accent);
    // Only a hex can drive the generator. Anything else still paints the flat
    // accent, so a hand-written oklch() in the option is not silently dropped.
    if (base) {
      const theme = makeTheme("cms-design", { hue: base.h, chroma: base.c, l: base.l });
      Object.assign(out, theme.vars as Record<string, string>);
    }
    out["--gold"] = accent;
  }

  if (t.gold400) {
    out["--btn-accent-1"] = t.gold400;
    out["--glow-warm-2"] = t.gold400;
    out["--block-bold-bg"] = t.gold400;
    out["--sheen-soft"] = fade(t.gold400, 9);
    out["--sheen-ring"] = fade(t.gold400, 60);
    out["--gradient-lime"] =
      `linear-gradient(135deg, ${t.gold400}, ${t.gold500 || t.gold || t.gold400})`;
  }

  const lightest = t.gold300 || t.lime;
  if (lightest) {
    out["--lime"] = lightest;
    out["--btn-accent-border"] = fade(lightest, 45);
  }

  if (t.ink950) {
    const ink = oklchFromHex(t.ink950);
    if (ink) {
      const l = Math.min(ink.l, INK_MAX_L);
      for (const [name, lift, chroma] of INK_STEPS) {
        out[name] = oklch(l + lift, Math.min(ink.c, chroma), ink.h);
      }
      out["--border"] = fade(oklch(l + 0.16, Math.min(ink.c, 0.075), ink.h), 60);
    } else {
      out["--background"] = t.ink950;
    }
  }

  return out;
}

/** Lightness the stylesheet's own `--background` sits at. */
const BASE_INK_L = 0.14;

/** `oklch(L C H)` as themes.ts writes it — both ends of this are ours. */
const OKLCH_RE = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/;

/** The dark surfaces a theme sets, which sit relative to the page base. */
const THEME_SURFACES = ["--surface", "--surface-2", "--card"] as const;

/**
 * Move a theme's dark surfaces onto the editor's page base.
 *
 * Returns the vars untouched when no background is set or it is not a hex,
 * which is the usual case — this costs nothing until someone uses the control.
 */
export function shiftSurfaces(
  vars: PageTheme["vars"] | undefined,
  design: DesignTokens | null | undefined,
): PageTheme["vars"] | undefined {
  if (!vars || !design?.ink950) return vars;
  const ink = oklchFromHex(design.ink950);
  if (!ink) return vars;

  const delta = Math.min(ink.l, INK_MAX_L) - BASE_INK_L;
  if (Math.abs(delta) < 0.001) return vars;

  const out = { ...(vars as Record<string, string>) };
  for (const name of THEME_SURFACES) {
    const parsed = OKLCH_RE.exec(out[name] ?? "");
    if (!parsed) continue;
    const [, l, c, h] = parsed;
    out[name] = oklch(Math.max(0.02, Number(l) + delta), Number(c), Number(h));
  }
  return out as PageTheme["vars"];
}

/**
 * The `design` global, plus whatever the editor is streaming in right now.
 *
 * Shared by the style tag and by SiteShell, which needs the same values to
 * adjust a page theme. Both calls hit one query.
 */
export function useDesignTokens(): DesignTokens | null {
  const { data } = useQuery({
    queryKey: ["design-global"],
    queryFn: () => cmsGlobal<DesignTokens>("design"),
    staleTime: 5 * 60 * 1000,
  });
  const [live, setLive] = useState<DesignTokens | null>(null);

  useEffect(() => {
    if (!isEditMode()) return;
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; tokens?: DesignTokens } | null;
      if (d?.type === "aux-design" && d.tokens && typeof d.tokens === "object") {
        setLive(d.tokens);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!data && !live) return null;
  return { ...(data ?? {}), ...(live ?? {}) };
}

export function css(t: DesignTokens): string {
  const rules = Object.entries(tokens(t)).map(([name, value]) => `${name}: ${value}`);
  return rules.length ? `:root{${rules.join(";")}}` : "";
}
