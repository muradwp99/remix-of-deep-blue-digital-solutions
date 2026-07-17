import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Preloader } from "./preloader";
import { CostCalculator, Chatbot } from "./floating-widgets";
import { DesignTokensStyle } from "./design-tokens";
import { useScrollReveal } from "@/lib/animations";
import type { PageTheme } from "@/lib/themes";

export function SiteShell({ children, theme }: { children: ReactNode; theme?: PageTheme }) {
  useScrollReveal();
  return (
    <div
      style={theme?.vars}
      data-theme={theme?.id}
      className="min-h-screen flex flex-col bg-background text-foreground"
    >
      <DesignTokensStyle />
      <Preloader />
      <SiteHeader />
      <main className="flex-1" data-entrance>
        {children}
      </main>
      <SiteFooter />
      <CostCalculator />
      <Chatbot />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            data-parallax-img
          />
          {/* navy wash keeps imagery on-brand and the heading legible */}
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-background/20" />
        </>
      )}
      <div className="absolute inset-0 grain-bg pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-100 pointer-events-none opacity-70"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="container-page relative py-28 md:py-36">
        <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
          {eyebrow}
        </p>
        <h1
          className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl font-semibold"
          data-reveal
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 max-w-2xl text-lg text-muted-foreground"
            data-reveal
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
