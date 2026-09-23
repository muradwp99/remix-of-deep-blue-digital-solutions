/**
 * Home page editable content — defaults + type.
 *
 * The WP `homepage` doc (slug `home`) overrides these field-by-field via
 * `mergeHomeContent`; anything the CMS leaves empty falls back to the value
 * here, so the page never renders blank copy. Icons are NOT part of this
 * contract (serialization rule — see cms-catalog.ts): sections that render
 * icons keep them in the component, matched by row index.
 */

/** One floating hero marquee card (icons/colors stay coded by position). */
export type HeroCard = {
  category: string;
  title: string;
  team: string;
  img: string;
  s1v: string; s1l: string;
  s2v: string; s2l: string;
  s3v: string; s3l: string;
};

/** Orderable home sections (hero stays fixed on top). */
export const HOME_SECTION_KEYS = [
  "clients", "capabilities", "stats", "bento", "solutions", "process",
  "assemble", "work", "kickoff", "why", "compare", "testimonials",
  "pricing", "faq", "audit", "cta",
] as const;

export type HomeContent = {
  /** Render order of the page sections; unknown keys ignored, missing appended. */
  sectionOrder: string[];
  hero: {
    trustedLine: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaHref: string;
    ctaNote: string;
    cards: HeroCard[];
  };
  clients: { label: string; names: string[] };
  capabilities: {
    eyebrow: string;
    heading: string;
    items: { title: string; desc: string }[];
  };
  stats: { value: string; label: string }[];
  solutions: {
    eyebrow: string;
    heading: string;
    items: { title: string; desc: string }[];
  };
  process: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { n: string; t: string; d: string }[];
  };
  work: {
    eyebrow: string;
    heading: string;
    items: { name: string; tag: string; result: string; img: string }[];
  };
  kickoff: {
    eyebrow: string;
    heading: string;
    items: { day: string; t: string; d: string }[];
  };
  why: {
    eyebrow: string;
    heading: string;
    items: { title: string; desc: string }[];
  };
  compare: {
    eyebrow: string;
    heading: string;
    typicalTitle: string;
    auxtechTitle: string;
    typical: string[];
    auxtech: string[];
  };
  testimonialsSection: { eyebrow: string; heading: string };
  pricing: {
    eyebrow: string;
    heading: string;
    tiers: { t: string; d: string; p: string; featured?: boolean }[];
    tierFeatures: string[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: { q: string; a: string }[];
  };
  audit: {
    eyebrow: string;
    heading: string;
    text: string;
    bullets: string[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

export const homeDefaults: HomeContent = {
  sectionOrder: [...HOME_SECTION_KEYS],
  hero: {
    trustedLine: "25+ Founders & Leaders",
    headline: "Software worth being proud of.",
    subheadline:
      "A senior-only studio designing and engineering websites, apps, ecommerce and SaaS for ambitious teams. One team, from strategy to ship.",
    ctaLabel: "Get a free audit",
    ctaHref: "/contact",
    ctaNote: "Reviewed by a senior engineer, not a bot",
    cards: [
      {
        category: "Engineering", title: "Analytics Dashboards For Scale", team: "Data Architecture",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        s1v: "99.9%", s1l: "Uptime", s2v: "14", s2l: "Days", s3v: "A+", s3l: "Rating",
      },
      {
        category: "AI / ML", title: "Embed Generative Contextual AI", team: "Machine Learning",
        img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
        s1v: "10x", s1l: "Speed", s2v: "21", s2l: "Days", s3v: "PRO", s3l: "Level",
      },
      {
        category: "DevOps", title: "Cloud Scale Architecture", team: "Cloud Platform",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        s1v: "1M+", s1l: "Users", s2v: "30", s2l: "Days", s3v: "AAA", s3l: "Tier",
      },
      {
        category: "Product", title: "Native iOS & Android Apps", team: "App Development",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        s1v: "4.9", s1l: "Stars", s2v: "21", s2l: "Days", s3v: "TOP", s3l: "Rank",
      },
      {
        category: "Security", title: "Enterprise Infrastructure", team: "Cyber Ops",
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        s1v: "SOC2", s1l: "Ready", s2v: "14", s2l: "Days", s3v: "MAX", s3l: "Sec",
      },
      {
        category: "Fintech", title: "Frictionless E-Commerce", team: "Growth Team",
        img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
        s1v: "3x", s1l: "Revenue", s2v: "21", s2l: "Days", s3v: "ROI", s3l: "Growth",
      },
    ],
  },
  clients: {
    label: "Trusted by teams at",
    names: ["Meridian", "Halcyon", "Northwind", "Orbital", "Cascade", "Vantage", "Ridgeline"],
  },
  capabilities: {
    eyebrow: "Core capabilities",
    heading: "End-to-end services, delivered by one senior team.",
    items: [
      { title: "Custom Software", desc: "Web platforms engineered for speed, scale and reliability." },
      { title: "UI/UX Design", desc: "Interfaces that feel obvious. Systems that scale." },
      { title: "Mobile Apps", desc: "iOS, Android, and cross-platform, built to ship." },
      { title: "AI Solutions", desc: "LLM-powered workflows integrated where it matters." },
    ],
  },
  stats: [
    { value: "120+", label: "Products designed, built, and shipped" },
    { value: "98", label: "Median Lighthouse score at launch" },
    { value: "84%", label: "Of clients stay on a Care plan" },
    { value: "14", label: "Days to your first shippable slice" },
  ],
  solutions: {
    eyebrow: "Industry solutions",
    heading: "Purpose-built for the industries we know deeply.",
    items: [
      { title: "Ecommerce", desc: "Headless and platform stores that convert." },
      { title: "SaaS Products", desc: "MVP to scale — auth, billing, dashboards." },
      { title: "Fintech", desc: "Compliant, secure, and beautifully designed." },
      { title: "Healthcare", desc: "HIPAA-ready portals, apps, and dashboards." },
    ],
  },
  process: {
    eyebrow: "How we work",
    heading: "A transparent, iterative process.",
    intro:
      "Weekly demos, shared boards, and honest trade-offs. No surprises, no hand-offs to strangers.",
    items: [
      { n: "01", t: "Discovery", d: "Deep-dive workshops to align on goals, users, and success metrics." },
      { n: "02", t: "Design", d: "Wireframes, prototypes, and pixel-perfect interfaces validated with users." },
      { n: "03", t: "Build", d: "Engineering-first execution with weekly demos and transparent progress." },
      { n: "04", t: "Scale", d: "Launch, measure, iterate. Long-term partnership beyond delivery." },
    ],
  },
  work: {
    eyebrow: "Selected work",
    heading: "Recent case studies.",
    items: [
      {
        name: "Northwind SaaS",
        tag: "SaaS Rebrand",
        result: "+184% signups",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Halcyon Health",
        tag: "Mobile App",
        result: "4.9★ App Store",
        img: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Meridian Retail",
        tag: "Ecommerce",
        result: "3.1× revenue",
        img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Orbital Cloud",
        tag: "Marketing Site",
        result: "98 Lighthouse",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=70",
      },
    ],
  },
  kickoff: {
    eyebrow: "After you say go",
    heading: "Your first 14 days with us.",
    items: [
      { day: "Day 1", t: "Kickoff & access", d: "Shared Slack, repo, and board set up. You meet the whole pod — no bait and switch." },
      { day: "Day 3", t: "Clickable prototype", d: "The core flow, tappable in your browser. Direction validated before code is written." },
      { day: "Day 7", t: "First live demo", d: "Real features running in staging. Weekly demos from here on out." },
      { day: "Day 14", t: "Shippable slice", d: "A production-quality vertical slice, plus a costed roadmap for the rest." },
    ],
  },
  why: {
    eyebrow: "Why Auxtech",
    heading: "A studio, not a factory.",
    items: [
      { title: "Senior team, always", desc: "No juniors farmed out. Principal designers and engineers on every project." },
      { title: "Design + engineering", desc: "One team, one brief. We build what we design, so quality doesn't fall through." },
      { title: "Long-term partners", desc: "84% of our clients continue with a Care plan after launch." },
      { title: "Transparent pricing", desc: "Clear scope, honest budgets, no surprises. Try the calculator on the left." },
    ],
  },
  compare: {
    eyebrow: "Why teams switch",
    heading: "The usual way, or the Auxtech way.",
    typicalTitle: "A typical agency",
    auxtechTitle: "Auxtech",
    typical: [
      "Sales closes the deal, then juniors do the work",
      "Monthly PDF status reports",
      "Design thrown over the wall to developers",
      "A change order for every tweak",
      "Code you can't take with you",
    ],
    auxtech: [
      "The seniors you meet are the ones who build",
      "Weekly live demos in staging",
      "One pod — design and engineering together",
      "Transparent scope and pricing up front",
      "Full IP and repo handover from day one",
    ],
  },
  testimonialsSection: {
    eyebrow: "What partners say",
    heading: "Trusted by founders and product leaders.",
  },
  pricing: {
    eyebrow: "Engagement models",
    heading: "Fair, transparent pricing.",
    tiers: [
      { t: "Fixed Price", d: "Defined scope, defined budget. Perfect for launches.", p: "from $8k" },
      { t: "Monthly Retainer", d: "Ongoing partnership with a dedicated pod.", p: "from $9k/mo", featured: true },
      { t: "Dedicated Team", d: "Embedded team scaling with your product.", p: "custom" },
    ],
    tierFeatures: ["Senior team", "Weekly demos", "Full IP transfer"],
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Answers to common questions.",
    items: [
      { q: "How quickly can we start?", a: "Typically within 1–2 weeks. We'll scope discovery and align on a start date on our first call." },
      { q: "Do you work with startups or enterprise?", a: "Both. We tailor process and team composition — the craft standard doesn't change." },
      { q: "What's your pricing model?", a: "Fixed-scope projects, monthly retainers, and dedicated pods. We recommend the fit after discovery." },
      { q: "Who owns the code and IP?", a: "You do. Full transfer on delivery, with clean docs and repository handover." },
      { q: "Do you offer post-launch support?", a: "Yes — 84% of our clients continue on a Care plan for maintenance, iteration, and growth." },
    ],
  },
  audit: {
    eyebrow: "Not ready to commit?",
    heading: "Get a free 48-hour technical audit instead.",
    text: "Send your URL through the form and you'll have a prioritized action plan within two business days, covering speed, SEO, accessibility, and conversion — yours to keep, whoever you build with.",
    bullets: [
      "Core Web Vitals breakdown with the three highest-impact fixes",
      "Conversion leaks ranked by estimated revenue impact",
      "A senior engineer's notes — not an automated report",
    ],
  },
  cta: {
    eyebrow: "Let's build",
    heading: "Have a project in mind?",
    text: "Tell us about it. We reply within one business day with a plan, a timeline, and a fair budget.",
    primaryLabel: "Start a Project",
    secondaryLabel: "Book Discovery Call",
  },
};

/** Section-level merge: a CMS value wins when non-empty; arrays replace wholesale when non-empty. */
export function mergeHomeContent(
  cms: Partial<HomeContent> | null | undefined,
): HomeContent {
  if (!cms) return homeDefaults;
  const s = (v: string | undefined | null, fb: string) => (v && v.trim() ? v : fb);
  const arr = <T,>(v: T[] | undefined | null, fb: T[]) => (v && v.length ? v : fb);
  const d = homeDefaults;
  return {
    sectionOrder: arr(cms.sectionOrder, d.sectionOrder),
    hero: {
      trustedLine: s(cms.hero?.trustedLine, d.hero.trustedLine),
      headline: s(cms.hero?.headline, d.hero.headline),
      subheadline: s(cms.hero?.subheadline, d.hero.subheadline),
      ctaLabel: s(cms.hero?.ctaLabel, d.hero.ctaLabel),
      ctaHref: s(cms.hero?.ctaHref, d.hero.ctaHref),
      ctaNote: s(cms.hero?.ctaNote, d.hero.ctaNote),
      cards: arr(cms.hero?.cards, d.hero.cards),
    },
    clients: {
      label: s(cms.clients?.label, d.clients.label),
      names: arr(cms.clients?.names, d.clients.names),
    },
    capabilities: {
      eyebrow: s(cms.capabilities?.eyebrow, d.capabilities.eyebrow),
      heading: s(cms.capabilities?.heading, d.capabilities.heading),
      items: arr(cms.capabilities?.items, d.capabilities.items),
    },
    stats: arr(cms.stats, d.stats),
    solutions: {
      eyebrow: s(cms.solutions?.eyebrow, d.solutions.eyebrow),
      heading: s(cms.solutions?.heading, d.solutions.heading),
      items: arr(cms.solutions?.items, d.solutions.items),
    },
    process: {
      eyebrow: s(cms.process?.eyebrow, d.process.eyebrow),
      heading: s(cms.process?.heading, d.process.heading),
      intro: s(cms.process?.intro, d.process.intro),
      items: arr(cms.process?.items, d.process.items),
    },
    work: {
      eyebrow: s(cms.work?.eyebrow, d.work.eyebrow),
      heading: s(cms.work?.heading, d.work.heading),
      items: arr(cms.work?.items, d.work.items),
    },
    kickoff: {
      eyebrow: s(cms.kickoff?.eyebrow, d.kickoff.eyebrow),
      heading: s(cms.kickoff?.heading, d.kickoff.heading),
      items: arr(cms.kickoff?.items, d.kickoff.items),
    },
    why: {
      eyebrow: s(cms.why?.eyebrow, d.why.eyebrow),
      heading: s(cms.why?.heading, d.why.heading),
      items: arr(cms.why?.items, d.why.items),
    },
    compare: {
      eyebrow: s(cms.compare?.eyebrow, d.compare.eyebrow),
      heading: s(cms.compare?.heading, d.compare.heading),
      typicalTitle: s(cms.compare?.typicalTitle, d.compare.typicalTitle),
      auxtechTitle: s(cms.compare?.auxtechTitle, d.compare.auxtechTitle),
      typical: arr(cms.compare?.typical, d.compare.typical),
      auxtech: arr(cms.compare?.auxtech, d.compare.auxtech),
    },
    testimonialsSection: {
      eyebrow: s(cms.testimonialsSection?.eyebrow, d.testimonialsSection.eyebrow),
      heading: s(cms.testimonialsSection?.heading, d.testimonialsSection.heading),
    },
    pricing: {
      eyebrow: s(cms.pricing?.eyebrow, d.pricing.eyebrow),
      heading: s(cms.pricing?.heading, d.pricing.heading),
      tiers: arr(cms.pricing?.tiers, d.pricing.tiers),
      tierFeatures: arr(cms.pricing?.tierFeatures, d.pricing.tierFeatures),
    },
    faq: {
      eyebrow: s(cms.faq?.eyebrow, d.faq.eyebrow),
      heading: s(cms.faq?.heading, d.faq.heading),
      items: arr(cms.faq?.items, d.faq.items),
    },
    audit: {
      eyebrow: s(cms.audit?.eyebrow, d.audit.eyebrow),
      heading: s(cms.audit?.heading, d.audit.heading),
      text: s(cms.audit?.text, d.audit.text),
      bullets: arr(cms.audit?.bullets, d.audit.bullets),
    },
    cta: {
      eyebrow: s(cms.cta?.eyebrow, d.cta.eyebrow),
      heading: s(cms.cta?.heading, d.cta.heading),
      text: s(cms.cta?.text, d.cta.text),
      primaryLabel: s(cms.cta?.primaryLabel, d.cta.primaryLabel),
      secondaryLabel: s(cms.cta?.secondaryLabel, d.cta.secondaryLabel),
    },
  };
}
