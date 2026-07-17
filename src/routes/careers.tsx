import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { StatsRow } from "@/components/sections";
import {
  cmsFind,
  cmsFindOne,
  pageStr,
  type SitePageDoc,
} from "@/lib/cms";
import { MapPin, ArrowUpRight, ArrowDown } from "lucide-react";

type JobCard = {
  role: string;
  dept: string;
  loc: string;
  salary: string;
  tags: string[];
};

/** Shape of a Payload `jobs` doc (fields used by the Careers page). */
type CmsJob = {
  title: string;
  department?: string;
  location?: string;
  salary?: string;
  tags?: string[];
  open?: boolean;
};

export const Route = createFileRoute("/careers")({
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Careers — Northline Studio');
    const description = pageStr(d, "meta_description", 'Join a senior-only, remote-first studio. Open roles across design and engineering.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  // Content-managed: pull open roles from the CMS, fall back to the built-in
  // list if the CMS is unreachable so the page never hard-fails.
  loader: async (): Promise<{ jobs: JobCard[]; doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "careers");
    const docs = await cmsFind<CmsJob>("jobs", {
      where: { open: { equals: true } },
      sort: "createdAt",
      depth: 0,
    });
    if (docs.length) {
      return {
        doc,
        jobs: docs.map((j) => ({
          role: j.title,
          dept: j.department || "",
          loc: j.location || "",
          salary: j.salary || "",
          tags: j.tags || [],
        })),
      };
    }
    return { doc, jobs };
  },
  component: Page,
});

const jobs = [
  { role: "Senior Full-Stack Engineer", dept: "Engineering", loc: "Remote · Worldwide", salary: "$130k–$175k", tags: ["TypeScript", "React", "Node"] },
  { role: "Senior Product Designer", dept: "Design", loc: "Remote · Worldwide", salary: "$110k–$150k", tags: ["Product", "Systems", "Figma"] },
  { role: "Mobile Engineer (React Native)", dept: "Engineering", loc: "Remote · Worldwide", salary: "$115k–$155k", tags: ["React Native", "Swift", "Kotlin"] },
  { role: "Design Engineer (Motion)", dept: "Design × Engineering", loc: "Remote · EU overlap", salary: "$125k–$165k", tags: ["GSAP", "WebGL", "CSS"] },
  { role: "Senior Growth Marketer", dept: "Marketing", loc: "Remote · EU overlap", salary: "$95k–$130k", tags: ["Paid", "Lifecycle", "CRO"] },
];

const benefits = [
  { t: "Remote-first, always", d: "Work from anywhere in 15 countries. Async by default, meetings by exception." },
  { t: "Salary published, equity real", d: "Every band is public before you apply. Ownership that actually vests." },
  { t: "A budget to grow", d: "A generous learning stipend and conference time, no approval theatre." },
  { t: "Health and real time off", d: "Comprehensive coverage and a minimum-holiday policy we enforce." },
  { t: "Gear, your choice", d: "Top-tier equipment arrives before your first day. Pick your stack." },
  { t: "Hours you own", d: "Ship on your rhythm. We measure output, not hours at a keyboard." },
];

const weekOne = [
  { day: "Day 1", t: "Keys to everything", d: "Gear arrives before you do. Repos, Figma, Slack — full access by lunch." },
  { day: "Day 2", t: "Onto a live project", d: "Paired with a lead on real client work. No sandbox, no shadowing period." },
  { day: "Day 3", t: "First PR merged", d: "Something small and real, reviewed within hours. Seniors ship early." },
  { day: "Day 5", t: "Demo Friday", d: "Show what you shipped to the whole studio — everyone does, every week." },
];

function Page() {
  const { jobs, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  return (
    <SiteShell theme={pageThemes["careers"]}>
      {/* ---- Hero (bold coral color-block, poster-style) ---- */}
      <section className="block-bold">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            {s("hero_eyebrow", "Careers at Northline")}
          </p>
          <h1
            className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-reveal
          >
            {s("hero_title", "Do the best work of your career.")}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {s("hero_subtitle", "Join 50+ senior designers and engineers, remote-first across 15 countries. Senior-only. No juniors, no handoffs, no red tape.")}
          </p>
          <div className="mt-10" data-reveal>
            <a
              href="#roles"
              data-magnetic
              className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              See open roles
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ---- Stats (light) ---- */}
      <div className="block-light">
        <StatsRow
          stats={[
            { value: "50+", label: "Senior designers & engineers" },
            { value: "15", label: "Countries, remote-first" },
            { value: "98%", label: "Team retention" },
            { value: "100%", label: "Remote" },
          ]}
        />
      </div>

      {/* ---- Open roles (light — the primary action) ---- */}
      <section id="roles" className="block-light scroll-mt-24">
        <div className="container-page py-24">
          <div className="flex max-w-4xl flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              We're hiring.
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground" data-reveal>
              Every role is senior, every salary is published. Interviews are two calls and a
              paid working session — never a take-home marathon.
            </p>
          </div>
          <div className="mt-12 grid gap-4" data-cards data-cards-stagger="0.07">
            {jobs.map((j) => (
              <Link
                key={j.role}
                to="/contact"
                className="group glare-card gradient-card lift shine flex flex-wrap items-center justify-between gap-5 rounded-2xl p-6 hover:border-gold/40 md:p-7"
                data-card
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-gold">
                      {j.role}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/80">
                      <MapPin className="h-3 w-3 text-gold" /> {j.loc}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {j.dept}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {j.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-5">
                  <span className="font-display text-lg font-semibold text-gold">{j.salary}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full glass transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Benefits (tint band, editorial 2-col list — no icon-card grid) ---- */}
      <section className="block-tint">
        <div className="container-page py-24">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl" data-reveal>
            What you get for saying yes.
          </h2>
          <div className="mt-12 grid gap-x-12 md:grid-cols-2" data-reveal-group>
            {benefits.map((b, i) => (
              <div
                key={b.t}
                className={`flex gap-6 border-t border-border py-6 ${i < 2 ? "" : ""}`}
                data-reveal-child
              >
                <span className="font-display text-sm font-semibold text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{b.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Week one (light timeline) ---- */}
      <section className="block-light">
        <div className="container-page py-28" data-reveal-group>
          <div className="mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
              After you sign
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl" data-split>
              Week one at Northline.
            </h2>
          </div>
          <div className="relative">
            <div className="timeline-line hidden md:block" data-timeline-line />
            <div className="grid gap-10 md:grid-cols-4">
              {weekOne.map((step) => (
                <div key={step.day} data-reveal-child>
                  <div className="timeline-dot hidden md:block" />
                  <p className="text-xs uppercase tracking-[0.24em] text-gold md:mt-5">{step.day}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold">{step.t}</h3>
                  <p className="mt-2 max-w-[30ch] text-sm text-muted-foreground">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Pitch us (deep coral dramatic close) ---- */}
      <section className="block-deep">
        <div className="container-page py-28 md:py-36">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl font-semibold leading-[0.98] md:text-7xl">
              Don't see your role? Pitch us.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Half the studio joined through a cold note, not a job post. Tell us what
              you'd own here and show us one thing you've shipped that you're proud of.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Pitch us your role
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/about"
                data-magnetic="0.25"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/5"
              >
                Meet the studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
