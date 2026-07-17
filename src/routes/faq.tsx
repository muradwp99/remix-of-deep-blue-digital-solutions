import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { CTABand } from "@/components/sections";
import {
  cmsFind,
  cmsFindOne,
  lexicalToPlainText,
  pageStr,
  type CmsFaq,
  type SitePageDoc,
} from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

type FaqGroup = {
  kicker: string;
  title: string;
  note: string;
  faqs: { q: string; a: string }[];
};

// The CMS `faqs` collection is a flat list tagged with a category enum; the page
// renders three editorial groups. Map each CMS category into one of those groups.
const CATEGORY_TO_GROUP: Record<NonNullable<CmsFaq["category"]>, number> = {
  process: 0,
  general: 0,
  pricing: 1,
  support: 2,
  legal: 2,
};

export const Route = createFileRoute("/faq")({
  // Content-managed: pull FAQs from the CMS, distribute them into the existing
  // editorial groups by category, and keep the group scaffold (kicker/title/note)
  // from the built-in data. Page chrome comes from the `faq` Site Page doc.
  loader: async (): Promise<{ groups: FaqGroup[]; doc: SitePageDoc }> => {
    const [docs, doc] = await Promise.all([
      cmsFind<CmsFaq>("faqs", { sort: "order", limit: 100 }),
      cmsFindOne<Record<string, unknown>>("sitepages", "faq"),
    ]);
    if (docs.length) {
      const scaffold: FaqGroup[] = groups.map((g) => ({ ...g, faqs: [] }));
      for (const d of docs) {
        const gi = CATEGORY_TO_GROUP[d.category ?? "general"] ?? 0;
        scaffold[gi].faqs.push({ q: d.question, a: lexicalToPlainText(d.answer) });
      }
      const filled = scaffold.filter((g) => g.faqs.length > 0);
      if (filled.length) return { groups: filled, doc };
    }
    return { groups, doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "FAQ — Auxtech");
    const description = pageStr(
      d,
      "meta_description",
      "Answers about engagement models, process, timelines, IP ownership, and support.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Page,
});

const groups = [
  {
    kicker: "01 — Working together",
    title: "How an engagement actually runs.",
    note: "Process, communication, and what week one looks like.",
    faqs: [
      {
        q: "How quickly can we start?",
        a: "Typically within 1–2 weeks. We scope discovery and align on a start date on our first call — and once we start, your first demo is on screen by day 7, with a shippable slice by day 14.",
      },
      {
        q: "Do you work with startups or enterprise?",
        a: "Both. We tailor process and team composition — the craft standard doesn't change. Since 2014 we've shipped for two-person founding teams and for public companies.",
      },
      {
        q: "How do you handle communication?",
        a: "Shared boards, a weekly demo every week, and a direct line to the senior team building your product. No account-manager relay, no status theater.",
      },
      {
        q: "Who will actually work on my project?",
        a: "Senior designers and engineers only — we're a remote-first team of 50+, and nobody on your build is learning on your dime. The people on the kickoff call are the people who ship.",
      },
      {
        q: "Can you sign an NDA?",
        a: "Absolutely. We're happy to sign your NDA before discovery — send it with your brief and it comes back signed with the first reply.",
      },
    ],
  },
  {
    kicker: "02 — Pricing & scope",
    title: "What it costs and why.",
    note: "Models, floors, and how scope changes are handled.",
    faqs: [
      {
        q: "What's your pricing model?",
        a: "Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery — and whichever model you pick, the number is in writing before work starts.",
      },
      {
        q: "Why do you publish \"from\" prices?",
        a: "Because scope is the price. The published floor is real — nobody has ever paid less, and after one scoping call you get an exact figure that doesn't move unless the scope does.",
      },
      {
        q: "What happens if scope changes mid-project?",
        a: "We quote the delta before building it, you approve in writing, and the timeline adjusts with it. That discipline is why we've issued $0 in surprise change orders since 2014.",
      },
      {
        q: "Can I pause a retainer?",
        a: "Yes — Care plans are month-to-month. Pause or cancel with 30 days' notice, no penalty, and your rate is locked when you return.",
      },
      {
        q: "What tech stacks do you use?",
        a: "TypeScript, React, Node, Go, Postgres, and cloud-native infrastructure on AWS/GCP. Boring where it should be boring, sharp where it earns its keep.",
      },
    ],
  },
  {
    kicker: "03 — After launch",
    title: "What happens when it ships.",
    note: "Ownership, handover, and the months after go-live.",
    faqs: [
      {
        q: "Who owns the code and IP?",
        a: "You do. Full transfer on delivery, with clean docs and repository handover. No licensing games, no hostage code.",
      },
      {
        q: "Do you offer post-launch support?",
        a: "Yes — 84% of clients continue on a Care plan for maintenance, iteration, and growth. It's month-to-month precisely so that staying is a choice, not a lock-in.",
      },
      {
        q: "Will my site stay fast after handover?",
        a: "We deliver at a 98 median Lighthouse score and document how to keep it there. On a Care plan we monitor performance monthly and fix regressions before you notice them.",
      },
      {
        q: "What if I want to take it in-house later?",
        a: "That's the plan working. Docs and handover are part of every engagement, and we'll onboard your hires on real calls — 98% client retention comes from being easy to leave, not hard to.",
      },
    ],
  },
];

function Page() {
  const { groups, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  return (
    <SiteShell>
      {/* ---- Hero (light editorial, asymmetric) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Questions")}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {s("hero_title", "Hard answers to")}{" "}
              <span className="text-gold">{s("hero_title_em", "soft")}</span> questions.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {s(
                "hero_subtitle",
                "We build for founders and executives who don't have time for spin. The truth about timelines, code ownership, and how we actually ship.",
              )}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <img
              src={s("hero_img", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=75")}
              alt="The Auxtech team answering questions"
              className="aspect-[4/5] w-full rounded-3xl border border-black/10 object-cover shadow-elegant"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.kicker} className={gi === 1 ? "block-tint" : "block-light"}>
          <div className="container-page py-24" data-reveal-group>
            <div className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:sticky md:top-28 md:col-span-5">
                <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                  {g.kicker}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl" data-reveal-child>
                  {g.title}
                </h2>
                <p className="mt-5 max-w-sm text-lg text-muted-foreground" data-reveal-child>
                  {g.note}
                </p>
              </div>
              <div className="space-y-3 md:col-span-7">
                {g.faqs.map((f) => (
                  <details key={f.q} className="group glass rounded-2xl p-6" data-reveal-child>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                      {f.q}
                      <span className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTABand
        eyebrow={s("cta_eyebrow", "Still have questions?")}
        title={s("cta_title", "Ask a person, not a page.")}
        subtitle={s(
          "cta_subtitle",
          "Send the question that isn't answered here. A senior replies within one business day — usually with more detail than you asked for.",
        )}
        primary={{ label: s("cta_primary_label", "Ask Us Directly"), to: "/contact" }}
        secondary={{ label: s("cta_secondary_label", "See Pricing"), to: "/pricing" }}
      />
    </SiteShell>
  );
}
