import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { BannerCTA } from "@/components/banner-cta";
import { subpagesByKind, type Subpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";

export function SubpageNotFound({ kind }: { kind: Subpage["kind"] }) {
  const parent = kind === "services" ? "/services" : "/solutions";
  return (
    <SiteShell>
      <section className="block-light">
        <div className="container-page py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] font-semibold">
            That page doesn't exist.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            The link may be outdated. Everything we offer lives one level up.
          </p>
          <Link
            to={parent}
            data-magnetic
            className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to all {kind}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

export function SubpageTemplate({ page }: { page: Subpage }) {
  const parent = page.kind === "services" ? "/services" : "/solutions";
  const parentLabel = page.kind === "services" ? "All services" : "All solutions";
  const siblings = subpagesByKind(page.kind)
    .filter((s) => s.slug !== page.slug)
    .slice(0, 4);

  return (
    <SiteShell theme={pageThemes[`${page.kind}/${page.slug}`]}>
      {/* ---- Hero (deep color block on the page hue; keeps light ink + image) ---- */}
      <section className="block-deep">
        <div className="container-page grid items-center gap-12 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {page.eyebrow}
            </p>
            <h1
              className="mt-5 font-display text-5xl md:text-7xl leading-[0.98] max-w-[15ch] font-semibold"
              data-reveal
            >
              {page.title} <span className="text-gold">{page.titleEm}</span>
              {page.titleAfter ?? null}
            </h1>
            {page.subtitle && (
              <p className="mt-6 max-w-xl text-lg text-muted-foreground" data-reveal>
                {page.subtitle}
              </p>
            )}
            <Link
              to={parent}
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {parentLabel}
            </Link>
          </div>
          {page.image && (
            <figure className="overflow-hidden rounded-3xl border border-white/12" data-reveal>
              <img
                src={page.image}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                data-parallax-img
              />
            </figure>
          )}
        </div>
      </section>

      <div className="block-light">
        <FeatureGrid
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
          variant="rows"
        />
      </div>

      <div className="block-tint">
        <ProcessSteps
          eyebrow="How it runs"
          title="A process with no black box."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
          variant="ladder"
        />
      </div>

      <div className="block-light">
        <BenefitList
          eyebrow="Why Northline"
          title="What you get that others skip."
          items={page.benefits}
        />
        <FAQAccordion faqs={page.faqs} />
      </div>

      <BannerCTA
        message={page.banner.message}
        title={
          <>
            {page.banner.title} <span className="text-gold">{page.banner.titleEm}</span>
            {page.banner.titleAfter ?? "."}
          </>
        }
        cta={{ label: page.banner.label, to: "/contact" }}
      />

      {siblings.length > 0 && (
        <section className="container-page pb-24 pt-4" data-reveal-group>
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
            Related {page.kind}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                to={page.kind === "services" ? "/services/$slug" : "/solutions/$slug"}
                params={{ slug: s.slug }}
                className="group glass lift rounded-2xl p-6"
                data-reveal-child
              >
                <h3 className="font-display text-lg font-semibold">{s.nav}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{s.subtitle}</p>
                <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
                  Explore{" "}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
