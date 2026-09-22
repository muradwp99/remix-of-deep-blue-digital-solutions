/**
 * LivePress design tokens — admin-editable visual style.
 *
 * Reads the `design` global and overrides root CSS variables. Only keys the
 * editor has actually set are applied, so an empty option changes nothing. In
 * edit mode the same tokens stream in live over `aux-design` postMessages
 * (slider drags restyle instantly).
 *
 * **Only the accent is wired, on purpose.** LivePress's Design screen offers
 * `gold500`, `gold400`, `gold300` and `ink950` — names from the codebase it
 * was first written against, not this one. Of the four, only the accent has a
 * variable here to land on (`--gold`); there is no separate hover or light
 * shade to set, and `ink950` would mean writing `--background`, which the
 * per-page theme system owns — overriding it breaks every themed route. So
 * the extra three are read and ignored rather than mapped onto something
 * approximate.
 *
 * `--gold` is also redefined inside the theme classes, which outrank a
 * `:root` rule, so a themed page keeps its own accent and only the default
 * pages follow the editor. That is the intended behaviour, not a limitation.
 */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsGlobal } from "@/lib/cms";
import { isEditMode } from "@/lib/edit-bridge";

type DesignTokens = {
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

function css(tokens: DesignTokens): string {
  const rules: string[] = [];
  const accent = tokens.gold500 || tokens.gold;
  if (tokens.radius) rules.push(`--radius: ${length(tokens.radius)}`);
  if (accent) rules.push(`--gold: ${accent}`);
  if (tokens.lime) rules.push(`--lime: ${tokens.lime}`);
  return rules.length ? `:root{${rules.join(";")}}` : "";
}

export function DesignTokensStyle() {
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

  const styles = css({ ...(data ?? {}), ...(live ?? {}) });
  if (!styles) return null;
  return <style id="aux-design-tokens">{styles}</style>;
}
