import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { BannerCTA } from "@/components/banner-cta";
import { ScoreBars } from "@/components/signature/meters";
import { AuditRequest } from "@/components/tool-widgets";
import { getTool } from "@/lib/tools";
import { pageThemes } from "@/lib/themes";

const tool = getTool("speed-test")!;

export const Route = createFileRoute("/tools_/speed-test")({
  head: () => ({
    meta: [
      { title: tool.metaTitle },
      { name: "description", content: tool.metaDesc },
      { property: "og:title", content: tool.metaTitle },
      { property: "og:description", content: tool.metaDesc },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell theme={pageThemes["tools/speed-test"]}>
      {/* BOLD · vivid color hero, poster-scale headline */}
      <section className="block-bold">
        <div className="container-page py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            {tool.eyebrow}
          </p>
          <h1
            className="mt-6 max-w-[15ch] font-display text-5xl md:text-7xl xl:text-8xl leading-[0.95] font-semibold"
            data-split
          >
            Find the seconds you're losing
          </h1>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground" data-reveal>
            {tool.subtitle}
          </p>
          <div className="mt-9" data-reveal>
            <a
              href="#request"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              Request the review
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* DEEP · sample waterfall — the bars keep their dark-optimized read */}
      <section className="block-deep">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            Sample waterfall
          </p>
          <h2
            className="mt-4 max-w-xl font-display text-3xl md:text-5xl font-semibold leading-tight"
            data-split
          >
            The waterfall, honestly read.
          </h2>
          <div className="mt-10 max-w-2xl rounded-3xl glass-strong p-8" data-reveal>
            <ScoreBars
              items={[
                { label: "HTML — fine", value: 18, display: "0.2s" },
                { label: "Fonts — blocking render", value: 52, display: "0.9s" },
                { label: "Hero image — unoptimized", value: 78, display: "1.7s" },
                { label: "Third-party scripts — the thief", value: 100, display: "2.8s" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* TINT · the request widget on a clean pale surface */}
      <div id="request" className="block-tint scroll-mt-24">
        <AuditRequest checks={tool.checks} ctaLabel="Request the Review" />
      </div>

      <BannerCTA
        message={["A free tool from us,", "no strings attached."]}
        title={
          <>
            Every millisecond is <span className="text-gold">revenue</span>.
          </>
        }
        cta={{ label: "Work With Us", to: "/contact" }}
      />
    </SiteShell>
  );
}
