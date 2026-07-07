import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Preloader } from "./preloader";
import { CostCalculator, Chatbot } from "./floating-widgets";
import { useScrollReveal } from "@/lib/animations";

export function SiteShell({ children }: { children: ReactNode }) {
  useScrollReveal();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 grain-bg pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none opacity-70"
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
