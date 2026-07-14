import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/sections";
import { StickyPinSteps } from "@/components/signature/sticky-narrative";
import { MetricDial } from "@/components/signature/meters";
import { TerminalWindow } from "@/components/signature/terminal";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "design-systems";

export const Route = createFileRoute("/services_/design-systems")({
  loader: async (): Promise<{ dto: SubpageDTO | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("services", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "services") : null };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return {
      meta: [
        { title: dto?.metaTitle ?? "Design Systems — Northline Studio" },
        { name: "description", content: dto?.metaDesc ?? "" },
        { property: "og:title", content: dto?.metaTitle ?? "Design Systems — Northline Studio" },
        { property: "og:description", content: dto?.metaDesc ?? "" },
      ],
    };
  },
  component: Page,
});

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/* ── Hero token wall: swatches, type ramp, spacing chips that scatter in ── */
const SWATCHES = [0.95, 0.85, 0.75, 0.62, 0.5, 0.38, 0.28, 0.2];

function TokenWall() {
  return (
    <div className="grid grid-cols-4 gap-3" aria-hidden>
      {SWATCHES.map((l, i) => (
        <div
          key={i}
          data-scatter-item
          className="aspect-square rounded-xl border border-white/10"
          style={{
            background: `color-mix(in oklab, var(--lime) ${Math.round(l * 100)}%, oklch(0.14 0.02 265))`,
          }}
        />
      ))}
      {["Display / 72", "H1 / 48", "H2 / 32", "Body / 16"].map((t, i) => (
        <div
          key={t}
          data-scatter-item
          className="col-span-2 flex items-center rounded-xl bg-white/4 px-4 py-3"
          style={{ fontSize: `${[26, 21, 17, 13][i]}px` }}
        >
          <span className="truncate font-display font-semibold">Aa</span>
          <span className="ml-3 truncate text-[11px] text-muted-foreground">{t}</span>
        </div>
      ))}
      {["4", "8", "12", "16", "24", "32", "48", "64"].map((s) => (
        <div
          key={s}
          data-scatter-item
          className="flex flex-col items-center justify-end rounded-xl bg-white/4 p-3"
        >
          <div className="w-2 rounded-full bg-lime/70" style={{ height: `${Number(s)}px` }} />
          <span className="mt-2 text-[10px] text-muted-foreground">{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Paint-chip swatch cards for the white block ── */
const CHIPS = [
  { name: "Iris", code: "IR-500", shades: ["#efe9fe", "#c8b3fb", "#8b5cf6", "#4c2d9c"] },
  { name: "Lime", code: "LM-400", shades: ["#f4fce3", "#d8f7a3", "#a3e635", "#4d7c0f"] },
  { name: "Ink", code: "NV-900", shades: ["#e2e8f4", "#94a3c4", "#3b4a6b", "#0b1226"] },
  { name: "Gold", code: "GD-300", shades: ["#fdf6e3", "#f5d878", "#eab308", "#854d0e"] },
  { name: "Coral", code: "CR-400", shades: ["#feecec", "#fbb4ab", "#f87171", "#9f2f2f"] },
  { name: "Slate", code: "SL-200", shades: ["#f8fafc", "#dbe3ee", "#94a3b8", "#334155"] },
];

function Page() {
  const { dto } = Route.useLoaderData();
  const page = dto ? hydrateSubpage(dto, getSubpage("services", SLUG)!) : getSubpage("services", SLUG)!;
  return (
    <SiteShell theme={pageThemes["services/design-systems"]}>
      {/* ══ DARK · hero — the token wall assembles itself ══ */}
      <section className="relative overflow-hidden border-b border-border/60" data-scatter>
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
        <div className="container-page relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] font-semibold"
              data-split
            >
              Design decisions, made once
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
              {page.subtitle}
            </p>
            <HeroCtas primary="Audit Our Interface" secondary={{ label: "See The Work", to: "/works" }} />
          </div>
          <TokenWall />
        </div>
      </section>

      <BackToParent kind="services" />

      {/* ══ LIGHT · paint-chip token grid — swatches pop on white ══ */}
      <div className="block-light">
        <section className="container-page py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
              Token architecture
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-split
            >
              Every color, printed and named.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground" data-reveal>
              We hand your team a deck of decisions, not a moodboard. Each ramp ships as a token —
              change the chip, and every screen follows.
            </p>
          </div>

          <div
            className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
            data-cards
            data-cards-stagger="0.12"
          >
            {CHIPS.map((chip, i) => (
              <figure
                key={chip.code}
                data-card
                className={`${i % 2 ? "rotate-1" : "-rotate-1"} overflow-hidden rounded-xl border border-black/10 bg-card shadow-panel transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0`}
              >
                <div aria-hidden>
                  {chip.shades.map((s) => (
                    <div key={s} className="h-9 first:h-16" style={{ background: s }} />
                  ))}
                </div>
                <figcaption className="flex items-baseline justify-between px-3.5 py-3">
                  <span className="text-sm font-semibold">{chip.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{chip.code}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* circle-crop duo + numbered feature ledger */}
        <section className="container-page grid items-center gap-16 pb-24 md:pb-32 lg:grid-cols-[auto_1fr]">
          <div className="relative pb-12 pr-6" data-slide="left">
            <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-card shadow-panel md:h-80 md:w-80">
              <img
                src={u("photo-1561070791-2526d30994b5", 900)}
                alt="Design desk covered in color and type explorations"
                className="h-full w-full object-cover"
                loading="lazy"
                data-parallax-img
              />
            </div>
            <div className="absolute -right-2 top-28 h-44 w-44 overflow-hidden rounded-full border-4 border-card shadow-panel md:h-56 md:w-56">
              <img
                src={u("photo-1521737604893-d14cc237f11d", 800)}
                alt="Designers and engineers collaborating around laptops"
                className="h-full w-full object-cover"
                loading="lazy"
                data-parallax-img
              />
            </div>
            <div className="absolute bottom-0 left-8 rounded-2xl border border-black/10 bg-card px-6 py-4 shadow-panel">
              <p className="font-display text-4xl font-semibold text-lime" data-counter>
                47
              </p>
              <p className="mt-1 max-w-[11rem] text-xs text-muted-foreground">
                distinct button styles found in one client audit
              </p>
            </div>
          </div>

          <div data-slide="right">
            <h3 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
              Built to be used, not admired.
            </h3>
            <svg viewBox="0 0 220 12" className="mt-3 h-3 w-48 text-lime" fill="none" aria-hidden>
              <path
                d="M2 9 C 60 2, 160 2, 218 8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                data-draw
              />
            </svg>
            <div className="mt-8" data-reveal-group>
              {page.features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    data-reveal-child
                    className="grid grid-cols-[auto_auto_1fr] items-start gap-5 border-t border-black/10 py-6 last:border-b"
                  >
                    <span className="font-mono text-xs text-muted-foreground pt-1">
                      0{i + 1}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-lime/15">
                      <Icon className="h-4.5 w-4.5 text-lime" />
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-semibold">{f.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ══ TINT · pinned narrative — audit to adopted ══ */}
      <div className="block-tint">
        <StickyPinSteps
          eyebrow="How it runs"
          title="From audit to adopted."
          steps={page.steps}
          panels={[
            <div key="audit" className="overflow-hidden rounded-2xl shadow-panel">
              <img
                src={u("photo-1553877522-43269d4ea984")}
                alt="Interface inventory mapped out on a whiteboard"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>,
            <TerminalWindow
              key="tokens"
              title="tokens — zsh"
              lines={[
                { prompt: "$", text: "npx style-dictionary build" },
                { text: "css/variables.css written", ok: true, dim: true },
                { text: "ts/tokens.ts written", ok: true, dim: true },
                { prompt: "$", text: "grep -c 'var(--' src/**/*.css" },
                { text: "1,204 usages · 0 hard-coded hex values", ok: true },
              ]}
            />,
            <div key="component" className="rounded-2xl bg-card p-8 shadow-panel">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Proven in product
              </p>
              <div className="mt-5 space-y-3">
                <button className="rounded-full btn-gold px-5 py-2.5 text-sm font-semibold">
                  Primary action
                </button>
                <div className="rounded-xl border border-border bg-surface p-4 text-sm">
                  Card / interactive
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full border border-lime/30 bg-lime/15 px-3 py-1 text-xs text-lime">
                    Tag
                  </span>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs">Tag</span>
                </div>
              </div>
            </div>,
            <div key="govern" className="overflow-hidden rounded-2xl shadow-panel">
              <img
                src={u("photo-1552664730-d307ca884978")}
                alt="Team workshop where engineers adopt the new system"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>,
          ]}
        />
      </div>

      {/* ══ BOLD · adoption dial band ══ */}
      <div className="block-bold">
        <section className="container-page py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground" data-reveal>
              Adoption, measured
            </p>
            <h2
              className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold"
              data-split
            >
              A system nobody uses is a PDF.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground" data-reveal>
              We track on-system coverage from week one — because the deliverable isn't a library,
              it's the habit of reaching for it.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3" data-reveal-group>
            {[
              { value: 0.92, display: "92%", label: "of screens on-system after two quarters" },
              { value: 0.64, display: "64%", label: "less duplicated UI code by quarter three" },
              { value: 0.41, display: "41%", label: "fewer visual-regression bugs reported" },
            ].map((d) => (
              <div
                key={d.display}
                data-reveal-child
                className="flex flex-col items-center rounded-3xl bg-card p-8 text-center shadow-panel"
              >
                <MetricDial value={d.value} display={d.display} label={d.label} size={170} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center" data-reveal>
            <Link
              to="/contact"
              data-magnetic
              className="btn-navy inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              Plan your system audit
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* ══ DARK · benefits ledger + FAQ + banner ══ */}
      <section className="container-page py-24 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal>
            Why Northline
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold" data-reveal>
            What you get that others skip.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2" data-cards data-cards-stagger="0.12">
          {page.benefits.map((b, i) => (
            <div
              key={b.title}
              data-card
              className={`glass rounded-2xl p-7 ${i % 2 === 1 ? "md:mt-10" : ""}`}
            >
              <span className="font-mono text-xs text-lime">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <FAQAccordion faqs={page.faqs} />
      <SubpageBanner page={page} />
      <RelatedPages kind="services" slug={page.slug} />
    </SiteShell>
  );
}
