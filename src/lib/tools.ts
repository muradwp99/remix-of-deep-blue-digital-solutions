import type { CmsBlockRow } from "@/components/cms-blocks";

export type Tool = {
  slug: string;
  nav: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  /** Rendered verbatim after the italic word */
  titleAfter?: string;
  subtitle: string;
  image: string;
  checks: string[];
  /** Section keys the page renders, in order. Empty = the coded order. */
  sectionOrder?: string[];
  /** Sections authored in the CMS. */
  pageBlocks?: CmsBlockRow[];
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=70`;

export const tools: Tool[] = [
  {
    slug: "website-audit",
    nav: "Website Audit Tool",
    metaTitle: "Free Website Audit — Auxtech",
    metaDesc:
      "Run an instant check of your site's speed, SEO, accessibility and conversion, then book the free call where two senior engineers take it through the full twelve points.",
    eyebrow: "Free Tool · Website Audit",
    title: "Twelve points, zero",
    titleEm: "spin",
    subtitle:
      "Paste your URL for an instant read on speed, SEO, accessibility and conversion. The full twelve-point audit is human-written by two senior engineers, not a PDF from a crawler, and it comes with the free call.",
    image: u("photo-1551288049-bebda4e38f71"),
    checks: [
      "Core Web Vitals against field data",
      "Render-blocking assets & script diet",
      "Technical SEO: crawl, canonical, schema",
      "Mobile experience on real devices",
      "Accessibility: contrast, focus, labels",
      "Conversion path friction points",
      "Security headers & TLS configuration",
      "Analytics & tracking integrity",
      "Content hierarchy & readability",
      "Image & font delivery",
      "Third-party script inventory",
      "The one fix we'd do first, and why",
    ],
  },
  {
    slug: "roi-calculator",
    nav: "ROI Calculator",
    metaTitle: "Website ROI Calculator — Auxtech",
    metaDesc:
      "Estimate the revenue impact of a faster, better-converting website with real numbers from your funnel.",
    eyebrow: "Free Tool · ROI Calculator",
    title: "What's a better site actually",
    titleEm: "worth",
    titleAfter: "?",
    subtitle:
      "Plug in your traffic and funnel numbers, and see what a realistic conversion improvement returns per year. Same math we use to scope engagements — no email gate.",
    image: u("photo-1460925895917-afdab827c52f"),
    checks: [],
  },
  {
    slug: "speed-test",
    nav: "Speed Test",
    metaTitle: "Website Speed Review — Auxtech",
    metaDesc:
      "An instant Core Web Vitals check of your site, and a free human review — field data, real devices, and the prioritized fix list — when you book the call.",
    eyebrow: "Free Tool · Speed Review",
    title: "Find the seconds you're",
    titleEm: "losing",
    subtitle:
      "Automated speed scores lie in both directions. The instant check gives you real server timings and Core Web Vitals estimates. The human review — field data, mid-range Android, the fixes ranked by return — comes with the free call.",
    image: u("photo-1558494949-ef010cbdcc31"),
    checks: [
      "LCP, INP, and CLS from real-user field data",
      "Mid-range Android testing, not just desktop lab runs",
      "Main-thread blocking and hydration cost",
      "Image, font, and script delivery review",
      "The three fixes with the highest ms-per-hour return",
      "Honest verdict: tuning job or architecture problem",
    ],
  },
  {
    slug: "brand-grader",
    nav: "Brand Grader",
    metaTitle: "Brand Grader — Auxtech",
    metaDesc:
      "Grade your brand's consistency in two minutes: eight questions, an honest score, and what to fix first.",
    eyebrow: "Free Tool · Brand Grader",
    title: "How coherent is your",
    titleEm: "brand",
    titleAfter: "?",
    subtitle:
      "Eight yes-or-no questions, two minutes, an honest score. This is the same first-pass we run in brand consultancy discovery — self-serve.",
    image: u("photo-1561070791-2526d30994b5"),
    checks: [],
  },
  {
    slug: "project-estimator",
    nav: "Project Estimator",
    metaTitle: "Project Estimator — Auxtech",
    metaDesc:
      "Scope your build in two minutes: budget range, timeline, and phase plan, before any sales call.",
    eyebrow: "Free tool",
    title: "Scope it before the",
    titleEm: "sales call",
    titleAfter: ".",
    subtitle:
      "Answer four questions, get a real budget range, timeline, and phase plan. The same math we use internally.",
    image: u("photo-1454165804606-c3d57bc86b40"),
    checks: [],
  },
  {
    slug: "stack-recommender",
    nav: "Tech Stack Recommender",
    metaTitle: "Tech Stack Recommender — Auxtech",
    metaDesc:
      "Describe your product and get a pragmatic production stack with reasoning, alternatives, and hiring notes.",
    eyebrow: "Free tool",
    title: "The stack a principal would",
    titleEm: "pick",
    titleAfter: ".",
    subtitle:
      "Describe the product. Get five layers of boring, proven tech with the reasoning, the strongest alternative, and how hard it is to hire for.",
    image: u("photo-1517180102446-f3ece451e9d8"),
    checks: [],
  },
  {
    slug: "headline-analyzer",
    nav: "Headline Analyzer",
    metaTitle: "Headline Analyzer — Auxtech",
    metaDesc:
      "Paste your homepage headline, get four scores, a straight verdict, and five stronger rewrites.",
    eyebrow: "Free tool",
    title: "Is your headline doing its",
    titleEm: "job",
    titleAfter: "?",
    subtitle:
      "The headline decides the bounce. Paste yours and get four scores, a straight verdict, and five rewrites you can ship today.",
    image: u("photo-1455390582262-044cdead277a"),
    checks: [],
  },
  {
    slug: "meta-generator",
    nav: "SEO Meta Generator",
    metaTitle: "SEO Meta Generator — Auxtech",
    metaDesc:
      "Generate a copy-paste title tag, meta description, Open Graph set, and JSON-LD for your homepage.",
    eyebrow: "Free tool",
    title: "Meta tags, done",
    titleEm: "properly",
    titleAfter: ".",
    subtitle:
      "Title tag, meta description, Open Graph set, and JSON-LD schema. Character-counted, benefit-led, ready to paste.",
    image: u("photo-1526628953301-3e589a6a8b74"),
    checks: [],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
