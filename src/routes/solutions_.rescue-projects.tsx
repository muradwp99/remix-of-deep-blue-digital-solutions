import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, BenefitList, FAQAccordion } from "@/components/sections";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

const page = getSubpage("solutions", "rescue-projects")!;

export const Route = createFileRoute("/solutions_/rescue-projects")({
  head: () => ({
    meta: [
      { title: page.metaTitle },
      { name: "description", content: page.metaDesc },
      { property: "og:title", content: page.metaTitle },
      { property: "og:description", content: page.metaDesc },
    ],
  }),
  component: Page,
});

const TRIAGE = [
  { sev: "P1", label: "No repo access — agency gone dark", state: "resolved" },
  { sev: "P1", label: "Production credentials unknown", state: "resolved" },
  { sev: "P2", label: "No tests, deploys by FTP", state: "resolved" },
  { sev: "P2", label: "Payments failing silently", state: "resolved" },
  { sev: "P3", label: "18 months of dependency rot", state: "in progress" },
];

function Page() {
  return (
    <SiteShell theme={pageThemes["solutions/rescue-projects"]}>
      {/* ── BOLD · signal hero: urgency on the left, the triage board resolving on the right ── */}
      <section className="block-bold">
        <div className="container-page grid items-center gap-14 py-24 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-foreground/70"
              data-reveal
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl font-semibold leading-[0.98] md:text-6xl xl:text-7xl"
              data-split
            >
              Stalled project? Salvageable, usually.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Book the Triage" />
          </div>
          {/* Triage board — white panel on the signal block */}
          <div className="glass-strong rounded-3xl p-6" data-slide="right">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Triage board · week 2
              </p>
              <span className="rounded-full bg-black/[0.06] px-3 py-1 text-[11px] font-semibold">
                4 of 5 resolved
              </span>
            </div>
            <div className="space-y-2" data-reveal-group>
              {TRIAGE.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-3 rounded-xl bg-black/[0.04] px-4 py-3 text-sm"
                  data-reveal-child
                >
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      t.sev === "P1"
                        ? "bg-destructive/20 text-destructive"
                        : t.sev === "P2"
                          ? "bg-foreground/10 text-foreground"
                          : "bg-black/10 text-muted-foreground"
                    }`}
                  >
                    {t.sev}
                  </span>
                  <span
                    className={`flex-1 ${t.state === "resolved" ? "text-muted-foreground line-through decoration-foreground/40" : ""}`}
                  >
                    {t.label}
                  </span>
                  {t.state === "resolved" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHT · the first month resolves into order ── */}
      <div className="block-light">
        <BackToParent kind="solutions" />
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-14 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              The first month
            </p>
            <h2
              className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
              data-reveal-child
            >
              Urgency first. Then order.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "First 48 hours",
                d: "Access recovered, backups verified, anything on fire contained. You sleep again.",
                tag: "Stop the bleeding",
              },
              {
                t: "Week 2",
                d: "The triage report: what exists, what's salvageable, and three costed options — finish, fix, or restart.",
                tag: "Honest picture",
              },
              {
                t: "Month 1",
                d: "A visible win ships — a deploy, a fix, a demo. Momentum is the medicine.",
                tag: "Moving again",
              },
            ].map((s) => (
              <div
                key={s.t}
                className="glare-card gradient-card lift rounded-2xl p-8"
                data-reveal-child
              >
                <span className="rounded-full bg-gold/12 px-3 py-1 text-[11px] font-semibold text-gold">
                  {s.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── TINT · what's included ── */}
      <div className="block-tint">
        <FeatureGrid
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />
      </div>

      {/* ── LIGHT · why us + answers ── */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why Northline"
          title="What you get that others skip."
          items={page.benefits}
        />
        <FAQAccordion faqs={page.faqs} />
      </div>

      {/* ── DARK bookend ── */}
      <SubpageBanner page={page} />
      <RelatedPages kind="solutions" slug={page.slug} />
    </SiteShell>
  );
}
