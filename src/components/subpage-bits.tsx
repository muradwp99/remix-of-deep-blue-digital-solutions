import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BannerCTA } from "@/components/banner-cta";
import { subpagesByKind, type Subpage, type SubpageKind } from "@/lib/subpages";

/** Small shared pieces for the unique subpage routes. */

export function BackToParent({ kind }: { kind: SubpageKind }) {
  return (
    <section className="container-page pt-8">
      <Link
        to={kind === "services" ? "/services" : "/solutions"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All {kind}
      </Link>
    </section>
  );
}

export function SubpageBanner({ page }: { page: Subpage }) {
  return (
    <BannerCTA
      message={page.banner.message}
      title={
        <>
          {page.banner.title}{" "}
          <em className="font-playfair font-medium text-gold">{page.banner.titleEm}</em>
          {page.banner.titleAfter ?? "."}
        </>
      }
      cta={{ label: page.banner.label, to: "/contact" }}
    />
  );
}

export function RelatedPages({ kind, slug }: { kind: SubpageKind; slug: string }) {
  const siblings = subpagesByKind(kind)
    .filter((s) => s.slug !== slug)
    .slice(0, 4);
  return (
    <section className="container-page pb-24" data-reveal-group>
      <p className="mb-6 text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
        Related {kind}
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {siblings.map((s) => (
          <Link
            key={s.slug}
            to={kind === "services" ? "/services/$slug" : "/solutions/$slug"}
            params={{ slug: s.slug }}
            className="group glass lift rounded-2xl p-6"
            data-reveal-child
          >
            <h3 className="font-display text-lg font-semibold">{s.nav}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{s.subtitle}</p>
            <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
              Explore
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Standard hero CTA pair with page-accent primary. */
export function HeroCtas({
  primary,
  secondary,
}: {
  primary: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <div className="mt-9 flex flex-wrap gap-3" data-reveal>
      <Link
        to="/contact"
        data-magnetic
        className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-7 py-3.5 text-sm font-semibold"
      >
        {primary}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
      {secondary && (
        <Link
          to={secondary.to}
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
