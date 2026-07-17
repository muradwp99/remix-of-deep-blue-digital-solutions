import { createFileRoute } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { FeatureGrid, ProcessSteps, BenefitList, FAQAccordion } from "@/components/sections";
import { BadgeGrid } from "@/components/signature/logo-wall";
import { BackToParent, SubpageBanner, RelatedPages, HeroCtas } from "@/components/subpage-bits";
import { getSubpage } from "@/lib/subpages";
import { pageThemes } from "@/lib/themes";
import { cmsFindOne } from "@/lib/cms";
import { cmsToSubpageDTO, hydrateSubpage, type SubpageDTO, type CmsSubpage } from "@/lib/cms-catalog";

const SLUG = "enterprise";

export const Route = createFileRoute("/solutions_/enterprise")({
  loader: async (): Promise<{ dto: SubpageDTO | null; doc: CmsSubpage | null }> => {
    const doc = await cmsFindOne<CmsSubpage>("solutions", SLUG, { depth: 1 });
    return { dto: doc ? cmsToSubpageDTO(doc, "solutions") : null, doc };
  },
  head: ({ loaderData }) => {
    const dto = loaderData?.dto;
    return { meta: [
      { title: dto?.metaTitle ?? "Enterprise Solutions — Auxtech" },
      { name: "description", content: dto?.metaDesc ?? "" },
      { property: "og:title", content: dto?.metaTitle ?? "Enterprise Solutions — Auxtech" },
      { property: "og:description", content: dto?.metaDesc ?? "" },
    ]};
  },
  component: Page,
});

function Page() {
  const { dto, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes on the raw doc, then re-map.
  const liveDoc = useLiveEdits(doc);
  const liveDto = liveDoc ? cmsToSubpageDTO(liveDoc, "solutions") : dto;
  const page = liveDto ? hydrateSubpage(liveDto, getSubpage("solutions", SLUG)!) : getSubpage("solutions", SLUG)!;
  return (
    <SiteShell theme={pageThemes["solutions/enterprise"]}>
      {/* ── DEEP · stately sapphire hero — slow parallax, restrained motion ── */}
      <section className="block-deep relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          data-parallax-img
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/40" />
        <div aria-hidden className="absolute inset-0 grain-bg pointer-events-none" />
        <div className="container-page relative py-28 md:py-40">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {page.eyebrow}
          </p>
          <h1
            className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.96] md:text-7xl"
            data-split
          >
            Boutique speed, enterprise spine
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-reveal>
            {page.subtitle}
          </p>
          <HeroCtas primary="Talk to Us" />
        </div>
      </section>

      {/* ── LIGHT · the security wall, pre-ticked ── */}
      <div className="block-light">
        <BackToParent kind="solutions" />
        <section className="container-page py-24" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              The checklist, pre-ticked
            </p>
            <h2
              className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
              data-reveal
            >
              Bring your security questionnaire.
            </h2>
          </div>
          <BadgeGrid
            items={[
              { label: "SSO / SAML", sub: "plus SCIM provisioning" },
              { label: "SOC2-ready", sub: "controls & evidence trails" },
              { label: "HIPAA", sub: "BAAs and PHI isolation" },
              { label: "GDPR", sub: "data maps & DPAs signed" },
              { label: "Pen-tested", sub: "every major release" },
              { label: "Audit logging", sub: "immutable, exportable" },
              { label: "VPN / on-prem", sub: "your perimeter, our pod" },
              { label: "Least privilege", sub: "2FA everywhere, always" },
            ]}
          />
        </section>
      </div>

      {/* ── TINT · what's included ── */}
      <div className="block-tint">
        <FeatureGrid
          variant="spotlight"
          eyebrow="What's included"
          title="The work, concretely."
          cols={3}
          items={page.features}
        />
      </div>

      {/* ── DEEP · how it runs, then procurement reassurance ── */}
      <div className="block-deep">
        <ProcessSteps
          eyebrow="How it runs"
          title="Security-first, milestone-billed."
          steps={page.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }))}
        />

        <section className="container-page border-t border-border/60 py-24" data-reveal-group>
          <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                For your procurement team
              </p>
              <h2
                className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl"
                data-reveal-child
              >
                We've filled in that form before.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground" data-reveal-child>
                MSAs, DPAs, vendor-risk questionnaires, insurance certificates, milestone POs — the
                paperwork moves in days because we keep it ready, not because we skip it.
              </p>
            </div>
            <div className="space-y-3" data-reveal-child>
              {[
                ["Redline turnaround", "3 business days"],
                ["Security questionnaire", "48 hours, any format"],
                ["Insurance & W-9 pack", "same day"],
                ["References in your sector", "on request"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex items-center justify-between rounded-xl glass px-5 py-4 text-sm"
                >
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-semibold text-lime">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHT · why us + answers ── */}
      <div className="block-light">
        <BenefitList
          eyebrow="Why Auxtech"
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
