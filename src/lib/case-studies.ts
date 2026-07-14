export type CaseMetric = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  name: string;
  /** Short project tag, e.g. "Headless replatform" */
  tag: string;
  industry: string;
  year: string;
  hero: string;
  heroAlt: string;
  images: { src: string; alt: string }[];
  /** One-line outcome statement used on cards and the detail hero */
  summary: string;
  challenge: string;
  approach: { phase: string; detail: string }[];
  outcomes: CaseMetric[];
  services: string[];
  stack: string[];
  testimonial?: { quote: string; author: string; role: string };
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "northwind-commerce",
    name: "Northwind Commerce",
    tag: "Headless replatform",
    industry: "Ecommerce",
    year: "2025",
    hero: u("photo-1556742049-0cfed4f6a45d"),
    heroAlt: "Customer paying by card at a modern retail checkout",
    images: [
      {
        src: u("photo-1460925895917-afdab827c52f"),
        alt: "Revenue analytics dashboard open on a laptop",
      },
      {
        src: u("photo-1556740738-b6a63e27c4df"),
        alt: "Point-of-sale tablet during a customer purchase",
      },
    ],
    summary: "+48% revenue in one quarter after a headless replatform.",
    challenge:
      "Northwind's monolith theme took nine seconds to reach checkout on mid-range phones, and every promotion required a developer. Mobile carried 71% of traffic but only 44% of revenue. The board approved one quarter to fix it — not a year-long replatform.",
    approach: [
      {
        phase: "Instrument the funnel",
        detail:
          "Two weeks of session replays and RUM data located the loss: product-page load and a five-step checkout. We wrote the target numbers into the contract before designing anything.",
      },
      {
        phase: "Rebuild the buying path first",
        detail:
          "Product page, cart, and a two-step checkout shipped headless in week six behind a traffic split — 10%, then 50%, then all of it. The rest of the site followed the money.",
      },
      {
        phase: "Hand the levers to marketing",
        detail:
          "A block-based merchandising system in Sanity let the team ship campaign pages in hours. Developer tickets for content changes went to zero.",
      },
    ],
    outcomes: [
      { value: "+48%", label: "revenue in one quarter" },
      { value: "+27%", label: "mobile checkout conversion" },
      { value: "0.9s", label: "largest contentful paint, from 4.2s" },
    ],
    services: ["UX & UI design", "Headless build", "CRO", "Design system"],
    stack: ["Next.js", "Shopify Storefront API", "Sanity", "Vercel", "GSAP"],
    testimonial: {
      quote:
        "They tied every design decision to a number in our P&L. Six weeks in we were A/B testing the new checkout against the old one — and never looked back.",
      author: "Maya Lindqvist",
      role: "VP Ecommerce, Northwind Commerce",
    },
  },
  {
    slug: "ledgerly",
    name: "Ledgerly",
    tag: "SaaS site & product UI",
    industry: "Fintech",
    year: "2025",
    hero: u("photo-1551288049-bebda4e38f71"),
    heroAlt: "Financial analytics dashboard with usage charts on a large screen",
    images: [
      {
        src: u("photo-1559526324-4b87b5e36e44"),
        alt: "Market and cash-flow charts on a desktop workstation",
      },
      {
        src: u("photo-1554224155-6726b3ff858f"),
        alt: "Accountant reviewing ledgers beside a calculator and laptop",
      },
    ],
    summary: "3.1× signups and 62% faster loads for an accounting platform.",
    challenge:
      "Ledgerly's product was winning head-to-head evaluations, but its website was losing them: an eight-second marketing site, a signup flow with eleven fields, and a dashboard that looked five years older than the competition. Paid acquisition was profitable only on branded search.",
    approach: [
      {
        phase: "Reposition around proof",
        detail:
          "We cut the pitch to one claim — close your books in a day — and backed it with a live, anonymized demo ledger on the homepage instead of screenshots.",
      },
      {
        phase: "Collapse the signup",
        detail:
          "Eleven fields became three, with company enrichment filling the rest after the first session. Activation emails moved from day three to minute five.",
      },
      {
        phase: "Rebuild the surface, keep the core",
        detail:
          "A shared token system reskinned the dashboard screen by screen over eight weeks — no big-bang release, no retraining, no downtime.",
      },
    ],
    outcomes: [
      { value: "3.1×", label: "trial signups in 60 days" },
      { value: "62%", label: "faster page loads across the funnel" },
      { value: "+41%", label: "trial-to-paid conversion" },
    ],
    services: ["Positioning", "Marketing site", "Product UI", "Design tokens"],
    stack: ["React", "TanStack Start", "Tailwind CSS", "Radix UI", "PostHog"],
    testimonial: {
      quote:
        "Our sales team stopped apologizing for the website. Signups tripled before we touched ad spend, and the new UI closed the gap our champions kept flagging in evaluations.",
      author: "Daniel Okafor",
      role: "Co-founder & CEO, Ledgerly",
    },
  },
  {
    slug: "verda-health",
    name: "Verda Health",
    tag: "Patient mobile app",
    industry: "Healthcare",
    year: "2025",
    hero: u("photo-1576091160399-112ba8d25d1d"),
    heroAlt: "Clinician reviewing patient data on a tablet",
    images: [
      {
        src: u("photo-1512941937669-90a1b58e7e9c"),
        alt: "Patient checking a health app on a smartphone",
      },
      {
        src: u("photo-1434494878577-86c23bcb06b9"),
        alt: "Smartwatch tracking daily health metrics on a wrist",
      },
    ],
    summary: "A 4.9★ care companion that patients actually open every day.",
    challenge:
      "Verda's first app had a 2.8★ rating and a 9% week-four retention rate — patients downloaded it at the clinic and never returned. Medication adherence, the metric its clinic partners pay for, was unmeasurable because nobody logged anything.",
    approach: [
      {
        phase: "Shadow real patients",
        detail:
          "Twelve in-home sessions with patients aged 54–81 reshaped the brief: larger type, one action per screen, and reminders written in plain language a nurse would use.",
      },
      {
        phase: "Design for the worst day",
        detail:
          "Offline-first records, a three-tap refill flow, and caregiver sharing meant the app still worked in a hospital basement with no signal — where it matters most.",
      },
      {
        phase: "Rebuild native, ship weekly",
        detail:
          "One React Native codebase replaced two aging native apps. Weekly releases with staged rollouts let us fix rating-killers within days, not quarters.",
      },
    ],
    outcomes: [
      { value: "4.9★", label: "App Store rating, from 2.8★" },
      { value: "+38%", label: "medication adherence at 90 days" },
      { value: "3.4×", label: "week-four retention" },
    ],
    services: ["User research", "Mobile UX & UI", "React Native build", "Accessibility"],
    stack: ["React Native", "TypeScript", "HealthKit", "FHIR APIs", "Expo"],
    testimonial: {
      quote:
        "The research sessions changed how our clinicians think, not just how the app looks. Adherence is now a number we put in front of health-system buyers.",
      author: "Dr. Amara Chen",
      role: "Chief Medical Officer, Verda Health",
    },
  },
  {
    slug: "orbital-cloud",
    name: "Orbital Cloud",
    tag: "Marketing site",
    industry: "DevTools",
    year: "2024",
    hero: u("photo-1451187580459-43490279c0fa"),
    heroAlt: "Earth from orbit with city lights and network points",
    images: [
      {
        src: u("photo-1461749280684-dccba630e2f6"),
        alt: "Source code on a developer's monitor",
      },
      {
        src: u("photo-1558494949-ef010cbdcc31"),
        alt: "Server racks with network cabling in a data center",
      },
    ],
    summary: "Lighthouse 72 → 98, and demo requests up by half.",
    challenge:
      "Orbital sells edge infrastructure on speed — from a marketing site scoring 72 on Lighthouse. Developers noticed, and said so on Hacker News. The site also buried the product: fourteen pages of features, no pricing, and a demo form nobody found.",
    approach: [
      {
        phase: "Make the site the benchmark",
        detail:
          "Static-first rendering, zero client-side frameworks on landing paths, and a self-imposed 50KB JavaScript budget. The site became the company's favorite latency demo.",
      },
      {
        phase: "Write for engineers",
        detail:
          "We replaced feature prose with copy-pasteable quickstarts, real latency numbers per region, and transparent pricing. The docs got the same design language as the homepage.",
      },
      {
        phase: "Route intent, not traffic",
        detail:
          "One CTA per page, tied to reader intent: quickstart for builders, benchmark report for evaluators, a short demo form for buyers. Attribution finally became legible.",
      },
    ],
    outcomes: [
      { value: "98", label: "Lighthouse performance, from 72" },
      { value: "+52%", label: "demo requests per month" },
      { value: "2.4×", label: "organic traffic in six months" },
    ],
    services: ["Content strategy", "Web design", "Performance engineering", "Docs design"],
    stack: ["Astro", "TypeScript", "Tailwind CSS", "Cloudflare Pages", "Plausible"],
  },
  {
    slug: "meridian-retail",
    name: "Meridian Retail",
    tag: "Omnichannel ecommerce",
    industry: "Retail",
    year: "2024",
    hero: u("photo-1441986300917-64674bd600d8"),
    heroAlt: "Clothing racks inside a bright modern retail store",
    images: [
      {
        src: u("photo-1472851294608-062f824d29cc"),
        alt: "Online shop open on a laptop during a purchase",
      },
      {
        src: u("photo-1586528116311-ad8dd3c8310d"),
        alt: "Warehouse aisle with stocked fulfillment shelves",
      },
    ],
    summary: "3.1× online revenue year over year for a 40-store retailer.",
    challenge:
      "Meridian ran 40 physical stores and a website that behaved like a 41st — separate stock, separate pricing, separate customers. Online returns hit 31% because shoppers couldn't trust sizing or availability, and store associates actively steered customers away from the site.",
    approach: [
      {
        phase: "Unify inventory truth",
        detail:
          "A real-time inventory layer across all 40 stores unlocked the features that move retail revenue: buy-online-pickup-in-store, same-day store shipping, and honest availability on every product page.",
      },
      {
        phase: "Fix the confidence gap",
        detail:
          "Fit guidance from actual return data, store-level stock on product pages, and 30-second try-on videos cut the guesswork that drove returns.",
      },
      {
        phase: "Make stores allies",
        detail:
          "Online orders shipped from stores count toward store targets. Associates went from undermining the site to selling through it.",
      },
    ],
    outcomes: [
      { value: "3.1×", label: "online revenue year over year" },
      { value: "-38%", label: "return rate on apparel" },
      { value: "22%", label: "of online orders picked up in store" },
    ],
    services: ["Commerce strategy", "UX & UI design", "Headless build", "Systems integration"],
    stack: ["Remix", "Commercetools", "Algolia", "Contentful", "GraphQL"],
  },
  {
    slug: "cascade-ops",
    name: "Cascade",
    tag: "Internal ops platform",
    industry: "Logistics",
    year: "2024",
    hero: u("photo-1586528116493-a029325540fa"),
    heroAlt: "Freight containers stacked at a shipping terminal",
    images: [
      {
        src: u("photo-1504868584819-f8e8b4b6d7e3"),
        alt: "Operations team working across laptops and shared screens",
      },
      {
        src: u("photo-1551288049-bebda4e38f71"),
        alt: "Operational dashboard with live charts on a widescreen display",
      },
    ],
    summary: "One control tower replaced 41 screens for a freight operator.",
    challenge:
      "Cascade's operations team reconciled shipments across three ERPs, two carrier portals, and a wall of spreadsheets — 41 screens in a typical shift. Exceptions took hours to resolve, and the company hired ops staff linearly with volume just to keep up.",
    approach: [
      {
        phase: "Map the real workflow",
        detail:
          "A week embedded on the ops floor produced an exception taxonomy: 80% of hours went to six recurring problem types. We designed for those six first.",
      },
      {
        phase: "Build the control tower",
        detail:
          "A single queue ranks exceptions by cost of delay, with every carrier, order, and document in one pane. Keyboard-first, because power users live here eight hours a day.",
      },
      {
        phase: "Automate the repeat offenders",
        detail:
          "Rules engine plus audit trail: the system resolves routine mismatches itself and shows its work. Humans handle judgment calls, not copy-paste.",
      },
    ],
    outcomes: [
      { value: "-63%", label: "time to resolve a shipment exception" },
      { value: "41", label: "legacy screens consolidated into one" },
      { value: "2.2×", label: "shipment volume on the same headcount" },
    ],
    services: ["Service design", "Dashboard UX", "Full-stack build", "Systems integration"],
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Temporal"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudy {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
}
