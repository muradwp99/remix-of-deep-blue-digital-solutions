import type { CSSProperties } from "react";

/**
 * Per-page color themes. Each page keeps the dark navy base but swaps every
 * accent-derived token (accents, gradients, glows, sheens, CTA colors,
 * surface tints) to a hue that represents that service. Fonts never change.
 *
 * Applied via <SiteShell theme={pageThemes["services/ecommerce"]}> — the vars
 * land as an inline style on the shell root, and Tailwind's `@theme inline`
 * mapping makes classes like text-lime / bg-surface follow automatically.
 */

export type PageTheme = {
  id: string;
  vars: CSSProperties;
};

/** Shortest-path hue interpolation (degrees). */
const lerpHue = (a: number, b: number, t: number) => {
  const d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
};

const NAVY_HUE = 265;
const NAVY_FG = "oklch(0.15 0.028 265)";

const r = (n: number) => Math.round(n * 1000) / 1000;

export function makeTheme(
  id: string,
  {
    hue,
    chroma = 0.14,
    l = 0.8,
    hue2,
  }: { hue: number; chroma?: number; l?: number; hue2?: number },
): PageTheme {
  // Contrast guardrails: accents must read on dark surfaces and carry navy text.
  const L = Math.min(0.86, Math.max(0.74, l));
  const C = Math.min(0.17, chroma);
  const mix = lerpHue(NAVY_HUE, hue, 0.35);
  const cool = lerpHue(hue, NAVY_HUE, 0.6);
  const g2 = hue2 ?? hue - 8;

  const ok = (ll: number, cc: number, h: number, a?: number) =>
    `oklch(${r(ll)} ${r(Math.max(0, cc))} ${r(h)}${a !== undefined ? ` / ${a}` : ""})`;

  const vars: Record<string, string> = {
    // Core accents (lime = primary accent, gold = warm sibling)
    "--lime": ok(L, C, hue),
    "--lime-foreground": NAVY_FG,
    "--gold": ok(L - 0.02, C - 0.01, hue),
    "--gold-foreground": NAVY_FG,
    "--accent": ok(0.45, 0.06, hue),
    "--ring": ok(0.55, 0.07, hue),

    // Hue-tinted dark surfaces (navy stays dominant — 35% lerp toward page hue)
    "--surface": ok(0.17, 0.03, mix),
    "--surface-2": ok(0.21, 0.032, mix),
    "--card": ok(0.16, 0.028, mix),

    // Gradients
    "--gradient-hero": `radial-gradient(ellipse 80% 60% at 50% 0%, ${ok(0.3, 0.07, mix, 0.65)}, transparent 70%)`,
    "--gradient-glow": `linear-gradient(135deg, ${ok(0.34, 0.06, mix)}, ${ok(L, C, hue)})`,
    "--gradient-lime": `linear-gradient(135deg, ${ok(Math.min(0.88, L + 0.02), C, hue)}, ${ok(L - 0.14, C - 0.02, g2)})`,
    "--gradient-card-gold": `linear-gradient(135deg, ${ok(0.34, 0.08, hue, 0.32)}, oklch(0.16 0.03 265 / 0.35))`,

    // Hygiene tokens (see :root defaults in styles.css)
    "--wash-accent": ok(0.35, 0.1, hue, 0.15),
    "--sheen-soft": ok(0.85, 0.12, hue, 0.09),
    "--sheen-ring": ok(0.85, 0.13, hue, 0.6),
    "--sheen-ring-dim": ok(0.65, 0.09, hue, 0.14),
    "--btn-accent-1": ok(Math.min(0.87, L + 0.05), C, hue),
    "--btn-accent-2": ok(L - 0.07, C - 0.01, g2),
    "--btn-accent-border": ok(0.9, 0.12, hue, 0.45),
    "--btn-accent-shadow": `0 16px 44px -16px ${ok(L, C, hue, 0.55)}`,
    "--card-gold-border": ok(L, 0.13, hue, 0.2),
    "--glow-warm-1": ok(0.72, C, hue),
    "--glow-warm-2": ok(0.82, C, hue2 ?? lerpHue(hue, hue + 25, 1)),
    "--glow-cool-1": ok(0.55, 0.11, cool),
    "--glow-cool-2": ok(0.68, 0.09, cool),

    // Section-block tokens (see .block-light/.block-tint/.block-bold in styles.css)
    "--accent-strong": ok(0.42, Math.min(0.13, C), hue), // dark accent, readable on white
    "--accent-soft-bg": ok(0.96, 0.03, hue), // pale hue wash for tint blocks
    "--block-bold-bg": ok(Math.max(0.78, L), C, hue), // saturated color-block bg
    "--block-bold-deep": ok(0.3, Math.min(0.09, C), hue), // deep hue for dark color-blocks
  };

  return { id, vars: vars as CSSProperties };
}

/* ------------------------------------------------------------------ */
/* The map — hue chosen to represent each service                      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Six-colour brand palette, assigned by CONTENT CATEGORY (not per page)
 * so related pages share a hue and the site reads as intentional, not a
 * random rotation. Every page maps to exactly one of these.
 * ------------------------------------------------------------------ */
const BUILD = { hue: 245, chroma: 0.14, l: 0.78 }; // tech / engineering — signal blue
const GROWTH = { hue: 158, chroma: 0.15, l: 0.82 }; // commerce / growth / value — green
const CREATIVE = { hue: 335, chroma: 0.15, l: 0.8 }; // design / brand — magenta-rose
const ENERGY = { hue: 40, chroma: 0.15, l: 0.8 }; // people / marketing / launch — amber-coral
const CARE = { hue: 188, chroma: 0.12, l: 0.82 }; // care / trust / health — teal
const EDITORIAL = { hue: 215, chroma: 0.12, l: 0.82 }; // content / learning / portfolio — cyan-slate

export const pageThemes: Record<string, PageTheme> = Object.fromEntries(
  (
    [
      // Services (13)
      ["services/website-development", BUILD],
      ["services/cms-websites", BUILD],
      ["services/landing-pages", ENERGY],
      ["services/design-systems", CREATIVE],
      ["services/brand-identity", CREATIVE],
      ["services/prototyping", CREATIVE],
      ["services/cross-platform-apps", BUILD],
      ["services/mvp-development", GROWTH],
      ["services/app-store-setup", BUILD],
      ["services/monthly-care", CARE],
      ["services/seo-performance", GROWTH],
      ["services/maintenance-support", CARE],
      ["services/analytics-cro", GROWTH],

      // Solutions (10)
      ["solutions/ecommerce", GROWTH],
      ["solutions/marketplaces", GROWTH],
      ["solutions/internal-tools", BUILD],
      ["solutions/digital-marketing", ENERGY],
      ["solutions/brand-consultancy", CREATIVE],
      ["solutions/growth-cro", GROWTH],
      ["solutions/startup-mvp", GROWTH],
      ["solutions/enterprise", BUILD],
      ["solutions/rescue-projects", ENERGY],
      ["solutions/scale-up", BUILD],

      // Industries (4)
      ["industries/fintech", BUILD],
      ["industries/healthcare", CARE],
      ["industries/retail-dtc", ENERGY],
      ["industries/b2b-enterprise", BUILD],

      // Tools (4)
      ["tools/website-audit", BUILD],
      ["tools/roi-calculator", GROWTH],
      ["tools/speed-test", BUILD],
      ["tools/brand-grader", CREATIVE],

      // Learning (4)
      ["learning/guides", EDITORIAL],
      ["learning/tutorials", EDITORIAL],
      ["learning/webinars", EDITORIAL],
      ["learning/templates", EDITORIAL],

      // Main pages (index/contact/faq keep flagship gold — no entry)
      ["works", EDITORIAL],
      ["about", ENERGY],
      ["our-story", ENERGY],
      ["leadership", ENERGY],
      ["pricing", GROWTH],
      ["careers", ENERGY],
      ["resources", EDITORIAL],
      ["blog", EDITORIAL],
      ["custom-software", BUILD],
      ["digital-transformation", CREATIVE],
      ["mobile-apps", BUILD],
      ["saas", BUILD],
      ["ui-ux-design", CREATIVE],
    ] as [string, Parameters<typeof makeTheme>[1]][]
  ).map(([id, spec]) => [id, makeTheme(id, spec)]),
);
