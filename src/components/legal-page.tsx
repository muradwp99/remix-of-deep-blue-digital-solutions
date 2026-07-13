import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export type LegalSection = { h: string; body: string[] };

export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <SiteShell>
      {/* Light document — legal reads best on white */}
      <section className="block-light">
        <div className="container-page border-b border-border py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            Legal
          </p>
          <h1
            className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
            data-reveal
          >
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
            {intro}
          </p>
          <p className="mt-4 text-sm text-muted-foreground/70" data-reveal>
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="block-light">
        <div className="container-page py-20">
          <div className="grid gap-16 lg:grid-cols-[240px_1fr]">
            <nav className="hidden lg:block" aria-label="Sections">
              <ol className="sticky top-28 space-y-2.5 text-sm text-muted-foreground">
                {sections.map((s, i) => (
                  <li key={s.h}>
                    <a href={`#s-${i + 1}`} className="transition-colors hover:text-foreground">
                      {i + 1}. {s.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="max-w-3xl space-y-12">
              {sections.map((s, i) => (
                <div key={s.h} id={`s-${i + 1}`} data-reveal>
                  <h2 className="font-display text-2xl font-semibold">
                    <span className="mr-3 text-gold">{String(i + 1).padStart(2, "0")}</span>
                    {s.h}
                  </h2>
                  {s.body.map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
              <div className="glass rounded-2xl p-7" data-reveal>
                <h2 className="font-display text-lg font-semibold">Questions about this policy?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Write to us any time — we answer legal and privacy questions within two business
                  days.
                </p>
                <Link
                  to="/contact"
                  className="link-underline mt-4 inline-block text-sm font-semibold text-gold"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
