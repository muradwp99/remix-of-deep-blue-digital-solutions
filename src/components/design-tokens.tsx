/**
 * The <style> tag that applies the CMS design tokens.
 *
 * All the logic lives in `@/lib/design-tokens` — SiteShell needs the same
 * values to adjust a page theme, and a component file that also exports
 * helpers loses fast refresh.
 */
import { css, useDesignTokens } from "@/lib/design-tokens";

export function DesignTokensStyle() {
  const design = useDesignTokens();
  const styles = design ? css(design) : "";
  if (!styles) return null;
  return <style id="aux-design-tokens">{styles}</style>;
}
