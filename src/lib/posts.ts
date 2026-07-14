export type PostCategory = "engineering" | "design" | "news";

export type PostBlock = { h?: string; p?: string; list?: string[] };

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  date: string; // ISO
  readTime: string;
  excerpt: string;
  image: string;
  body: PostBlock[];
};

export const postCategories: { key: PostCategory; label: string }[] = [
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "news", label: "Company news" },
];

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const posts: Post[] = [
  {
    slug: "why-we-demo-on-day-7",
    title: "Why we demo on day 7 (and what it costs us)",
    category: "news",
    date: "2026-06-18",
    readTime: "6 min read",
    excerpt:
      "The day-7 demo is our most-copied promise and our most misunderstood one. Here's what it forces us to do differently — and the two projects where it nearly broke.",
    image: u("photo-1522071820081-009f0129c71c"),
    body: [
      {
        p: "Every Northline engagement includes the same contractual line: a live demo, on a real URL, on day 7. Prospects assume it's marketing. It isn't — it's an engineering constraint we impose on ourselves, and it shapes everything about how we start projects.",
      },
      {
        h: "What day 7 forces",
        p: "You cannot demo on day 7 if you spend week one 'onboarding'. So repo, CI, staging, and auth scaffolding all have to exist by day 2, which means they have to be boring and repeatable. Our project template is the accumulated scar tissue of 120+ launches.",
      },
      {
        list: [
          "Day 1: repo access, pipeline green, staging URL live",
          "Day 2–4: the walking skeleton — auth, navigation, one real screen",
          "Day 5–6: the first vertical slice of actual product",
          "Day 7: the demo, warts and all",
        ],
      },
      {
        h: "Where it nearly broke",
        p: "Twice. Once on a build where the client's security team needed three weeks to grant VPN access — we demoed on our own infrastructure instead, then migrated. Once on a data-heavy product where day 7 showed real screens over synthetic data, and we said so out loud. The promise survives because we never fake it quietly.",
      },
      {
        p: "The real function of the day-7 demo isn't speed. It's trust calibration: after one week, you know exactly how it feels to work with us — while your exit cost is still one week.",
      },
    ],
  },
  {
    slug: "core-web-vitals-2026",
    title: "Core Web Vitals in 2026: what actually moves the needle",
    category: "engineering",
    date: "2026-05-27",
    readTime: "9 min read",
    excerpt:
      "INP replaced FID, attention shifted to interaction latency, and half the classic advice went stale. The fixes that carried our client sites to green this year.",
    image: u("photo-1551288049-bebda4e38f71"),
    body: [
      {
        p: "Every performance audit we run starts the same way: field data first, lab data second, opinions last. Here's what the field data has been saying across our client portfolio this year.",
      },
      {
        h: "INP is where sites fail now",
        p: "Loading got easier — frameworks stream, CDNs are everywhere, images are finally responsive by default. Interaction latency is the new failure mode: hydration storms, third-party script pileups, and event handlers doing synchronous work they should defer.",
      },
      {
        list: [
          "Break up long tasks: anything over 200ms of main-thread work gets chunked or moved off-thread",
          "Defer analytics and chat widgets until first interaction — nobody's tracking pixel is worth a red INP",
          "Hydrate islands, not oceans: partial hydration converted three of our worst INP offenders to green",
          "Measure with real devices: your M3 laptop lies to you about mid-range Android",
        ],
      },
      {
        h: "The unglamorous winners",
        p: "Font subsetting, image dimension attributes, and deleting dead JavaScript remain the highest ROI-per-hour fixes we do. On one retail client, removing four abandoned marketing scripts moved LCP by 800ms — no rebuild required.",
      },
      {
        p: "Performance budgets in CI keep it green after we leave. A budget that fails the build is worth ten dashboards nobody reads.",
      },
    ],
  },
  {
    slug: "design-systems-that-get-adopted",
    title: "Design systems fail at the handoff, not the kickoff",
    category: "design",
    date: "2026-05-08",
    readTime: "7 min read",
    excerpt:
      "Every abandoned design system we've audited died the same way. The adoption mechanics that keep ours alive — and the Figma-only trap to avoid.",
    image: u("photo-1561070791-2526d30994b5"),
    body: [
      {
        p: "We're regularly hired to audit design systems that cost six figures and now decorate a Figma archive. The pattern is always the same: beautiful foundations, zero adoption mechanics.",
      },
      {
        h: "The Figma-only trap",
        p: "A design system that exists only in Figma is a picture of a design system. If the coded components lag the designs, engineers stop trusting the library, and every screen quietly forks. We build the Figma and code libraries in lockstep, and we prove the system inside a real feature before calling it done.",
      },
      {
        h: "Adoption is a product problem",
        list: [
          "Ship the system inside a feature teams already want — never as a standalone 'migration project'",
          "Make the right thing the lazy thing: importing the component must be easier than rebuilding it",
          "Give the system an owner and a release cadence, or it stops being true within a quarter",
          "Measure adoption like a product metric: percentage of screens on-system, tracked monthly",
        ],
      },
      {
        p: "The systems that survive aren't the most complete ones. They're the ones where using the system is faster than not using it, from the first week.",
      },
    ],
  },
  {
    slug: "strangler-pattern-in-practice",
    title: "The strangler pattern in practice: replatforming without the launch weekend",
    category: "engineering",
    date: "2026-04-15",
    readTime: "11 min read",
    excerpt:
      "How we re-platformed a 14-year-old claims system with zero downtime — traffic splitting, parity checks, and the rollback plan we never needed.",
    image: u("photo-1558494949-ef010cbdcc31"),
    body: [
      {
        p: "The Vantage claims platform was 14 years old, load-bearing, and terrifying to touch. The previous vendor quoted three years for a rewrite. We shipped the replacement in eleven months with zero minutes of downtime — by never having a launch day at all.",
      },
      {
        h: "Strangle, don't rewrite",
        p: "The strangler pattern replaces a system component by component while the old one keeps running. Each phase shifts a slice of traffic behind a flag, proves parity, and becomes the new normal. There is no big-bang cutover to bet the company on.",
      },
      {
        list: [
          "Phase by risk × revenue: highest-risk, highest-value flows move first, while everyone is paying attention",
          "Nightly parity checks: both systems process the same inputs; drift pages a human",
          "Reversible always: every phase has a rollback tested in staging, not written in hope",
          "The old system earns trust for the new one: read-only mode came only after 60 clean days",
        ],
      },
      {
        h: "What made it work",
        p: "Not the architecture — the instrumentation. We spent the first month making both systems observable enough to compare honestly. Once parity was a dashboard instead of an argument, every stakeholder conversation got shorter.",
      },
      {
        p: "The old vendor's three-year estimate wasn't wrong for a rewrite. It was wrong because a rewrite was the wrong plan.",
      },
    ],
  },
  {
    slug: "motion-earns-its-budget",
    title: "Motion has to earn its render budget",
    category: "design",
    date: "2026-03-20",
    readTime: "5 min read",
    excerpt:
      "Animation guides attention or confirms an action — anything else gets cut. Our working rules for motion that ships at 98 Lighthouse.",
    image: u("photo-1550745165-9bc0b252726f"),
    body: [
      {
        p: "Our sites animate constantly and still hit a 98 median Lighthouse score. The trick isn't clever engineering — it's an editorial rule: every animation must guide attention or confirm an action. Decoration doesn't survive review.",
      },
      {
        h: "The rules we actually use",
        list: [
          "Transforms and opacity only on the hot path — nothing that triggers layout",
          "Scroll-driven reveals run once; users re-reading a page shouldn't re-earn it",
          "Respect prefers-reduced-motion completely, not partially — it's an accessibility contract",
          "Duration under 600ms for interface motion; longer belongs to storytelling moments only",
          "If a stakeholder asks 'what does this animation do?', the honest answer can't be 'it's cool'",
        ],
      },
      {
        h: "Why restraint reads as quality",
        p: "Users can't articulate why restrained motion feels premium, but they feel the difference between choreography and noise. One well-timed reveal on a stat that matters outperforms a page where everything floats.",
      },
      {
        p: "Motion is typography's louder sibling: powerful in proportion to how rarely you raise your voice.",
      },
    ],
  },
  {
    slug: "ai-features-worth-shipping",
    title: "The AI features that survived contact with our clients' users",
    category: "engineering",
    date: "2026-02-11",
    readTime: "8 min read",
    excerpt:
      "We shipped LLM features into six client products last year. Half got removed within a quarter. What separated the keepers from the demos.",
    image: u("photo-1526374965328-7f61d4dc18c5"),
    body: [
      {
        p: "Last year we integrated LLM-powered features into six client products. Three are now load-bearing; three were quietly removed within a quarter. The difference was never model quality — it was where the feature sat in the workflow.",
      },
      {
        h: "What survived",
        list: [
          "Drafting inside an existing task: summaries, first-pass responses, extraction from documents users already had to read",
          "Search that answers instead of listing — grounded in the client's own data, with citations",
          "Classification that saves a human decision per row, thousands of rows a day",
        ],
      },
      {
        h: "What got removed",
        p: "Chatbots bolted onto products whose users had no question to ask; 'AI insights' panels that restated dashboards in longer sentences; anything where a wrong answer cost more than the typing it saved. The pattern: features that added a conversation where users wanted a button.",
      },
      {
        h: "The engineering that mattered",
        p: "Evals before launch, fallbacks for every model call, cost ceilings per tenant, and honest latency budgets. LLM calls are the new third-party script: they need the same discipline as a payment gateway, not the same optimism as a landing page.",
      },
      {
        p: "Our rule now: AI earns a place in the product when removing it would make a daily task slower. Demos don't count.",
      },
    ],
  },
  {
    slug: "pricing-transparency-experiment",
    title: "We published our pricing. Here's what happened to our pipeline.",
    category: "news",
    date: "2026-01-22",
    readTime: "5 min read",
    excerpt:
      "Twelve months after putting real numbers on our pricing page: fewer leads, better leads, shorter sales cycles, and one awkward competitor email.",
    image: u("photo-1554224155-6726b3ff858f"),
    body: [
      {
        p: "A year ago we put actual price ranges on our pricing page — against the standard agency advice that 'it depends' protects margins. Twelve months of pipeline data later, here's the honest scorecard.",
      },
      {
        h: "The numbers",
        list: [
          "Inbound leads dropped 31% — almost entirely enquiries that were never going to be a fit",
          "Discovery-call-to-proposal rate nearly doubled: conversations start pre-qualified",
          "Median sales cycle shortened from 6 weeks to 3.5: no dance around budget",
          "Zero projects lost to sticker shock after a proposal — the shock happens before the call now",
        ],
      },
      {
        h: "What we'd tell other studios",
        p: "Transparent pricing filters for clients who value clarity — which turns out to be exactly the clients who make good partners. The leads you lose are mostly the ones that would have cost you a proposal and gone quiet.",
      },
      {
        p: "The awkward competitor email was real, by the way. They said publishing ranges 'devalues the craft'. Their proposal process takes six weeks. We think about that email fondly, and often.",
      },
    ],
  },
  {
    slug: "accessibility-is-a-floor",
    title: "WCAG AA is a floor, not a feature",
    category: "design",
    date: "2025-12-10",
    readTime: "6 min read",
    excerpt:
      "Accessibility retrofits cost 5–10× what building it in costs. The checks we run in design review, before a line of code exists.",
    image: u("photo-1573164713988-8665fc963095"),
    body: [
      {
        p: "The most expensive accessibility work we do is the retrofit: auditing a shipped product, then fixing contrast, focus management, and screen-reader labels across hundreds of screens. It routinely costs five to ten times what building it in would have cost. So we moved the checks upstream.",
      },
      {
        h: "Checked in design review, not QA",
        list: [
          "Contrast AA verified on real tokens, including disabled and placeholder states everyone forgets",
          "Focus order and visible focus states designed explicitly — not left for the browser default that got reset away",
          "Touch targets 44px minimum, checked at the component level once, inherited everywhere",
          "Every interactive element named the way a screen reader will announce it — written in the design file",
        ],
      },
      {
        h: "The floor mindset",
        p: "Treating AA as a launch feature invites the question 'can we ship without it?' Treating it as a floor — like 'the site works in Chrome' — removes the question. No one asks whether the checkout can skip working.",
      },
      {
        p: "One design-system pass makes hundreds of future screens accessible by inheritance. It's the cheapest compounding investment we know in this business.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
