/**
 * LivePress design tokens — admin-editable visual style.
 *
 * Reads the `design` global ({ radius?, gold?, lime? }) and overrides the
 * root CSS variables. Only keys the editor has actually set are applied, so
 * an empty option changes nothing. In edit mode the same tokens stream in
 * live over `aux-design` postMessages (slider drags restyle instantly).
 */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsGlobal } from "@/lib/cms";
import { isEditMode } from "@/lib/edit-bridge";

type DesignTokens = { radius?: string; gold?: string; lime?: string };

function css(tokens: DesignTokens): string {
  const rules: string[] = [];
  if (tokens.radius) rules.push(`--radius: ${tokens.radius}px`);
  if (tokens.gold) rules.push(`--gold: ${tokens.gold}`);
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
