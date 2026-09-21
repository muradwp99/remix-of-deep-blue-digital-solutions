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
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=70`;

export const tools: Tool[] = [
  {
    slug: "website-audit",
    nav: "Website Audit Tool",
    metaTitle: "Free Website Audit — Auxtech",
    metaDesc:
      "A 12-point human audit of your website: speed, SEO, accessibility, and conversion — delivered as an annotated report within two business days.",
    eyebrow: "Free Tool · Website Audit",
    title: "Twelve points, zero",
    titleEm: "spin",
    subtitle:
      "Send us your URL. Two senior engineers run a 12-point audit — speed, SEO, accessibility, conversion — and you get an annotated report within two business days. Human-written, not a PDF from a crawler.",
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
      "A human Core Web Vitals review of your site: lab data, field data, and the prioritized fix list — free, within two business days.",
    eyebrow: "Free Tool · Speed Review",
    title: "Find the seconds you're",
    titleEm: "losing",
    subtitle:
      "Automated speed scores lie in both directions. Send your URL and we'll review lab and field Core Web Vitals on real devices, then send the prioritized fix list — free, within two business days.",
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
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
