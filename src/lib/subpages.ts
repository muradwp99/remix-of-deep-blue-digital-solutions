import type { ComponentType } from "react";
import {
  Accessibility,
  Activity,
  AppWindow,
  ArrowLeftRight,
  BadgeCheck,
  BarChart3,
  Blocks,
  Boxes,
  BrainCircuit,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Cloud,
  Code2,
  CreditCard,
  Database,
  FileText,
  Fingerprint,
  Gauge,
  Globe,
  LayoutTemplate,
  LifeBuoy,
  LineChart,
  Megaphone,
  MousePointerClick,
  Package,
  Palette,
  PenTool,
  Plug,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  TabletSmartphone,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

export type SubpageKind = "services" | "solutions";

export type Subpage = {
  slug: string;
  kind: SubpageKind;
  nav: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  /** Heading text before the gold italic word */
  title: string;
  /** Gold italic word (Playfair) */
  titleEm: string;
  /** Optional heading text rendered verbatim after the italic word (include leading space/punctuation) */
  titleAfter?: string;
  subtitle: string;
  image: string;
  features: { icon: IconType; title: string; desc: string }[];
  steps: { t: string; d: string }[];
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  banner: {
    message: [string, string];
    title: string;
    titleEm: string;
    /** Rendered verbatim after the italic word; defaults to "." */
    titleAfter?: string;
    label: string;
  };
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=70`;

export const subpages: Subpage[] = [
  /* ------------------------------------------------------------------ */
  /* Services                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "website-development",
    kind: "services",
    nav: "Website Development",
    metaTitle: "Website Development — Northline Studio",
    metaDesc:
      "Marketing sites and company websites engineered for speed and search: 98 median Lighthouse at launch, SEO-ready architecture, first live demo on day 7.",
    eyebrow: "Website Development",
    title: "Websites that load fast and",
    titleEm: "sell",
    subtitle:
      "Your website is the salesperson that never sleeps. We build it to a 98 median Lighthouse score, structured for search, and wired to convert — not just to look good in a portfolio.",
    image: u("photo-1498050108023-c5249f4df085"),
    features: [
      {
        icon: Globe,
        title: "Marketing Sites",
        desc: "Company sites and product pages engineered around the one action you need visitors to take.",
      },
      {
        icon: Search,
        title: "SEO-Ready Architecture",
        desc: "Semantic markup, structured data, and sub-second loads — rankings are built in, not bolted on.",
      },
      {
        icon: Gauge,
        title: "Performance Budget",
        desc: "A 98 median Lighthouse score at launch, enforced in CI so it survives every future edit.",
      },
    ],
    steps: [
      {
        t: "Discovery",
        d: "One week: audience, message, sitemap, and the metric the site must move.",
      },
      { t: "Design", d: "On-brand layouts validated on real content — never lorem ipsum." },
      { t: "Build", d: "Component-driven build with CI, previews on every commit, demo on day 7." },
      {
        t: "Launch & Measure",
        d: "Zero-downtime cutover, analytics wired, and a 30-day tuning window.",
      },
    ],
    benefits: [
      {
        title: "Speed as a feature",
        desc: "Every 100ms of load time costs conversion. We treat performance as a design constraint from sprint one.",
      },
      {
        title: "Own it outright",
        desc: "Clean code, full repo transfer, and a CMS your team can drive without calling us.",
      },
      {
        title: "Search-first structure",
        desc: "Information architecture planned with your keywords, not retrofitted after launch.",
      },
      {
        title: "Built to iterate",
        desc: "Component library included — new landing pages in hours, not weeks.",
      },
    ],
    faqs: [
      {
        q: "How long does a website take?",
        a: "Most marketing sites ship in 4–8 weeks. You see the first live pages on a real URL by day 7.",
      },
      {
        q: "Can you migrate our existing content?",
        a: "Yes — content migration, redirect maps, and SEO preservation are part of the standard scope, not a change order.",
      },
      {
        q: "What stack do you use?",
        a: "Modern React frameworks with static or server rendering, deployed on edge infrastructure. Chosen for speed and hireability, not fashion.",
      },
    ],
    banner: {
      message: ["A sitemap from you,", "a 98-Lighthouse site from us."],
      title: "Your website should be your",
      titleEm: "best seller",
      label: "Start Your Website",
    },
  },
  {
    slug: "cms-websites",
    kind: "services",
    nav: "CMS Based Website",
    metaTitle: "CMS Website Development — Northline Studio",
    metaDesc:
      "WordPress, Webflow, and headless CMS builds your team can edit without engineers — structured content, editorial workflows, and full ownership.",
    eyebrow: "CMS Websites",
    title: "A site your team can edit without",
    titleEm: "fear",
    subtitle:
      "WordPress, Webflow, Sanity, or headless — we pick the CMS for your team's real workflow, then build it so publishing never needs a developer or breaks the design.",
    image: u("photo-1522542550221-31fd19575a2d"),
    features: [
      {
        icon: LayoutTemplate,
        title: "Structured Content",
        desc: "Content modeled as reusable blocks, so every page stays on-design no matter who edits it.",
      },
      {
        icon: FileText,
        title: "Editorial Workflow",
        desc: "Drafts, previews, roles, and scheduled publishing that match how your team actually works.",
      },
      {
        icon: Plug,
        title: "Headless Options",
        desc: "Sanity or Contentful feeding a fast front end when you need CMS ease and app-grade speed.",
      },
    ],
    steps: [
      {
        t: "CMS Selection",
        d: "We model your publishing workflow first, then recommend the platform — with reasoning in writing.",
      },
      {
        t: "Content Modeling",
        d: "Block library and content types designed with your editors in the room.",
      },
      {
        t: "Build & Migrate",
        d: "Theme-free custom build, content migrated with redirects preserved.",
      },
      {
        t: "Editor Training",
        d: "Recorded walkthroughs and a playbook — your team publishes on day one.",
      },
    ],
    benefits: [
      {
        title: "No developer bottleneck",
        desc: "Marketing publishes campaigns, pages, and posts without a ticket queue.",
      },
      {
        title: "Design that can't be broken",
        desc: "Editors compose from approved blocks — brand consistency is structural.",
      },
      {
        title: "Performance kept honest",
        desc: "CMS convenience without the bloat: we budget speed like any custom build.",
      },
      {
        title: "Portable content",
        desc: "Structured content exports cleanly — you're never locked into the platform or into us.",
      },
    ],
    faqs: [
      {
        q: "WordPress or headless?",
        a: "WordPress when your team lives in it and plugins earn their keep; headless when speed, multi-channel content, or app integration matter more. We model both against your workflow before recommending.",
      },
      {
        q: "Can you rescue our existing WordPress site?",
        a: "Usually, yes — we audit plugins, strip the dead weight, and rebuild the theme properly. If a rescue costs more than a rebuild, we'll show you the math.",
      },
      {
        q: "Will editors need training?",
        a: "One session plus recorded walkthroughs. If your editors need a manual thicker than that, we modeled the content wrong.",
      },
    ],
    banner: {
      message: ["Your content team's wishlist,", "a CMS that ships it from us."],
      title: "Publishing shouldn't need a",
      titleEm: "ticket",
      label: "Plan Your CMS Build",
    },
  },
  {
    slug: "landing-pages",
    kind: "services",
    nav: "Landing Pages",
    metaTitle: "Landing Page Development — Northline Studio",
    metaDesc:
      "High-converting campaign landing pages: designed around one action, A/B-test ready, shipped in days with sub-second loads.",
    eyebrow: "Landing Pages",
    title: "One page, one job:",
    titleEm: "convert",
    subtitle:
      "Campaign pages engineered around a single action — designed from your ad copy down, instrumented for testing, and shipped fast enough to match your media calendar.",
    image: u("photo-1460925895917-afdab827c52f"),
    features: [
      {
        icon: Target,
        title: "Message-Matched Design",
        desc: "The page continues the ad's promise — same words, same offer, zero scent loss.",
      },
      {
        icon: MousePointerClick,
        title: "Conversion Architecture",
        desc: "Proof, objection handling, and a single CTA sequenced by how visitors actually decide.",
      },
      {
        icon: Zap,
        title: "Speed to Ship",
        desc: "First page live in days; variants spin out of the component kit in hours.",
      },
    ],
    steps: [
      {
        t: "Offer & Audience",
        d: "We start from the ad and the audience temperature, not from a template.",
      },
      {
        t: "Wire & Write",
        d: "Copy and layout designed together — the argument drives the design.",
      },
      {
        t: "Build & Instrument",
        d: "Sub-second loads, event tracking, and A/B hooks from the first version.",
      },
      {
        t: "Test & Iterate",
        d: "Structured experiments on headline, proof, and offer — losers die fast.",
      },
    ],
    benefits: [
      {
        title: "Made for paid traffic",
        desc: "Quality-score-friendly loads and message match that lowers your cost per click.",
      },
      {
        title: "Variant velocity",
        desc: "New audiences and offers get pages in hours from your component kit.",
      },
      {
        title: "Honest measurement",
        desc: "Every page ships with events mapped — you know what converted and why.",
      },
      {
        title: "No platform hostage",
        desc: "Your pages, your domain, your data — not rented from a page builder.",
      },
    ],
    faqs: [
      {
        q: "How fast can you ship a landing page?",
        a: "First page in 5–10 working days including copy; variants from the kit in 24–48 hours.",
      },
      {
        q: "Do you write the copy?",
        a: "Yes — conversion copy is half the build. You review the argument before we design a pixel.",
      },
      {
        q: "Can you run the A/B tests too?",
        a: "We set up the tooling and can run a structured testing program under a Care plan, or hand it to your team with a playbook.",
      },
    ],
    banner: {
      message: ["Your ad budget deserves", "a page that pulls its weight."],
      title: "Stop sending paid clicks to your",
      titleEm: "homepage",
      label: "Brief Us a Page",
    },
  },
  {
    slug: "design-systems",
    kind: "services",
    nav: "Design Systems",
    metaTitle: "Design Systems — Northline Studio",
    metaDesc:
      "Design tokens, component libraries, and usage docs built with your engineers — systems that get adopted, not archived.",
    eyebrow: "Design Systems",
    title: "Design decisions, made",
    titleEm: "once",
    subtitle:
      "Tokens, components, and documentation built with your engineers in the room — so the system ships real product from week one instead of gathering dust in Figma.",
    image: u("photo-1561070791-2526d30994b5"),
    features: [
      {
        icon: Blocks,
        title: "Token Architecture",
        desc: "Color, type, and spacing as code — one change propagates everywhere, on purpose.",
      },
      {
        icon: Boxes,
        title: "Component Library",
        desc: "Accessible, documented components in Figma and code, kept in lockstep.",
      },
      {
        icon: ClipboardCheck,
        title: "Adoption Playbook",
        desc: "Contribution rules, review gates, and migration paths your team will actually follow.",
      },
    ],
    steps: [
      {
        t: "Interface Audit",
        d: "Inventory every button, form, and modal — the duplication report makes the business case.",
      },
      { t: "Foundations", d: "Tokens and primitives agreed with design and engineering together." },
      { t: "Build in Product", d: "Components proven inside a real feature, not a sandbox." },
      {
        t: "Govern & Grow",
        d: "Docs, versioning, and a contribution model that outlives our engagement.",
      },
    ],
    benefits: [
      {
        title: "Ship faster forever",
        desc: "Teams stop redesigning buttons and start shipping features — the system compounds.",
      },
      {
        title: "Accessible by default",
        desc: "WCAG AA baked into components once, inherited by every screen after.",
      },
      {
        title: "Designed for adoption",
        desc: "Built with your engineers, in your stack, inside your workflow — not thrown over a wall.",
      },
      {
        title: "A hiring document",
        desc: "New designers and engineers onboard from the system in a day.",
      },
    ],
    faqs: [
      {
        q: "How long does a design system take?",
        a: "A working foundation — tokens, core components, docs — in 6–10 weeks, proven inside one real feature before we call it done.",
      },
      {
        q: "Figma only, or code too?",
        a: "Both, always. A Figma-only system is a picture of a system. We keep design and code libraries synchronized.",
      },
      {
        q: "We have three inconsistent products. Where do we start?",
        a: "With the audit — it quantifies the drift and picks the highest-leverage surface to unify first. You get the roadmap before committing to the build.",
      },
    ],
    banner: {
      message: ["Your scattered UI from you,", "one coherent system from us."],
      title: "Stop paying the same design debt",
      titleEm: "twice",
      label: "Audit Our Interface",
    },
  },
  {
    slug: "brand-identity",
    kind: "services",
    nav: "Brand Identity",
    metaTitle: "Brand Identity Design — Northline Studio",
    metaDesc:
      "Logo, voice, and guidelines built for digital-first brands — identity systems that survive real product surfaces, not just a brand book.",
    eyebrow: "Brand Identity",
    title: "A brand that survives contact with the",
    titleEm: "product",
    subtitle:
      "Logo, palette, type, and voice designed where your customers actually meet you — the app, the site, the invoice — and codified so every future screen stays unmistakably yours.",
    image: u("photo-1561070791-2526d30994b5"),
    features: [
      {
        icon: PenTool,
        title: "Visual Identity",
        desc: "Logo system, color, and typography designed on real product surfaces from day one.",
      },
      {
        icon: Megaphone,
        title: "Voice & Messaging",
        desc: "Positioning, tone, and the ten sentences your team will say a thousand times.",
      },
      {
        icon: FileText,
        title: "Living Guidelines",
        desc: "Tokens and usage rules delivered as a working web guide, not a 90-page PDF.",
      },
    ],
    steps: [
      { t: "Positioning", d: "Workshops that end in words: who it's for, why you, and why now." },
      { t: "Explorations", d: "Three distinct directions tested on your hardest real surfaces." },
      { t: "Refinement", d: "One direction pushed to a full system — marks, type, color, motion." },
      {
        t: "Codify & Hand Over",
        d: "Digital-first guidelines plus design tokens your engineers can import.",
      },
    ],
    benefits: [
      {
        title: "Digital-first by design",
        desc: "Tested at 16px favicon and 60ft billboard — but built for the screen sizes that pay you.",
      },
      {
        title: "Voice included",
        desc: "Most identity projects stop at visuals. Yours ships with the words.",
      },
      {
        title: "Engineered handoff",
        desc: "Identity delivered as tokens and assets, ready to flow into product and site.",
      },
      {
        title: "Decisive process",
        desc: "Three directions, clear criteria, one recommendation — no fifty-logo carousel.",
      },
    ],
    faqs: [
      {
        q: "Do you do naming?",
        a: "Yes, as an optional first phase — shortlists screened for domain, trademark conflicts, and how they sound on a sales call.",
      },
      {
        q: "Rebrand or refresh?",
        a: "If recognition is an asset, we refresh and modernize. If the brand actively fights the business, we rebuild. The positioning phase makes that call with evidence.",
      },
      {
        q: "What do we receive at the end?",
        a: "Full asset library, a web-based guideline site, design tokens, and templates for the collateral you use most.",
      },
    ],
    banner: {
      message: ["Your ambition from you,", "an identity that carries it from us."],
      title: "Look like the company you're",
      titleEm: "becoming",
      label: "Start the Brand Work",
    },
  },
  {
    slug: "prototyping",
    kind: "services",
    nav: "Prototyping",
    metaTitle: "Wireframing & Prototyping — Northline Studio",
    metaDesc:
      "Clickable, testable prototypes in days — validate flows with real users before engineering commits a sprint.",
    eyebrow: "Prototyping",
    title: "Test the idea before you",
    titleEm: "fund",
    titleAfter: " it",
    subtitle:
      "Clickable prototypes at production fidelity, in front of real users within two weeks — because the cheapest place to find a flaw is before the first line of production code.",
    image: u("photo-1581291518857-4e27b48ff24e"),
    features: [
      {
        icon: AppWindow,
        title: "Clickable Flows",
        desc: "Real screens, real copy, real interactions — indistinguishable from product in a user's hands.",
      },
      {
        icon: Users,
        title: "User Testing",
        desc: "Moderated sessions with your actual audience, recorded and clipped to the moments that matter.",
      },
      {
        icon: Sparkles,
        title: "Production-Ready Fidelity",
        desc: "Validated prototypes flow straight into build — nothing gets designed twice.",
      },
    ],
    steps: [
      {
        t: "Frame the Risk",
        d: "Write down the assumption that kills the project if wrong — that's what we test.",
      },
      {
        t: "Wireframe",
        d: "Low-fi flows in days, argued over cheaply while change costs nothing.",
      },
      { t: "Prototype", d: "High-fidelity clickable build with real content and motion." },
      {
        t: "Test & Decide",
        d: "Five to eight user sessions, findings in a week, go/pivot recommendation attached.",
      },
    ],
    benefits: [
      {
        title: "Weeks, not quarters",
        desc: "Idea to tested prototype in 2–3 weeks — before a sprint of engineering is at stake.",
      },
      {
        title: "Evidence over opinions",
        desc: "Stakeholder debates end when users have spoken on camera.",
      },
      {
        title: "Investor-grade demos",
        desc: "A prototype that feels shipped raises better than a deck that promises.",
      },
      {
        title: "Nothing thrown away",
        desc: "Validated designs carry directly into the build phase, pixel for pixel.",
      },
    ],
    faqs: [
      {
        q: "How real does the prototype feel?",
        a: "Real enough that test users regularly ask when it launched. Actual screens, actual copy, working interactions — just no backend.",
      },
      {
        q: "Who recruits the test users?",
        a: "We can recruit against your audience profile, or test with your existing users and prospects — whichever produces honest signal faster.",
      },
      {
        q: "What if the idea fails the test?",
        a: "Then it cost you three weeks instead of two quarters. You get the findings, the recording clips, and a recommendation for the pivot.",
      },
    ],
    banner: {
      message: ["A risky assumption from you,", "evidence in two weeks from us."],
      title: "The cheapest failure is a",
      titleEm: "prototype",
      label: "Test Your Idea",
    },
  },
  {
    slug: "cross-platform-apps",
    kind: "services",
    nav: "Cross-Platform Apps",
    metaTitle: "Cross-Platform App Development — Northline Studio",
    metaDesc:
      "Flutter and React Native apps with pixel parity on iOS and Android — one codebase, two stores, native feel.",
    eyebrow: "Cross-Platform Apps",
    title: "One codebase, two stores, zero",
    titleEm: "compromise",
    subtitle:
      "Flutter and React Native builds that hold a 60fps budget and platform-correct feel on both stores — for roughly the cost and timeline of a single native app.",
    image: u("photo-1512941937669-90a1b58e7e9c"),
    features: [
      {
        icon: TabletSmartphone,
        title: "Flutter",
        desc: "Pixel-identical UI on both platforms — our default for content and commerce apps.",
      },
      {
        icon: Code2,
        title: "React Native",
        desc: "The pragmatic pick when your team already ships TypeScript and wants to own the code after us.",
      },
      {
        icon: Plug,
        title: "Native Bridges",
        desc: "Camera, biometrics, BLE, background tasks — we write the native modules when the framework runs out.",
      },
    ],
    steps: [
      {
        t: "Framework Decision",
        d: "Modeled against your roadmap and team — the reasoning delivered in writing.",
      },
      {
        t: "Design for Both",
        d: "One design language with platform-correct navigation, gestures, and haptics.",
      },
      {
        t: "Build & Test",
        d: "Weekly builds to your phone, 40-device lab, 60fps budget enforced in CI.",
      },
      {
        t: "Ship Both Stores",
        d: "Simultaneous App Store and Play submission, handled end to end.",
      },
    ],
    benefits: [
      {
        title: "One team, one backlog",
        desc: "Features land on iOS and Android the same week — no platform drift.",
      },
      {
        title: "40% typical savings",
        desc: "Versus two native teams — with the trade-offs mapped honestly before you commit.",
      },
      {
        title: "Native where it counts",
        desc: "Performance-critical paths drop to native modules; users never feel the framework.",
      },
      {
        title: "OTA updates",
        desc: "Ship fixes and content past the store review queue when policy allows it.",
      },
    ],
    faqs: [
      {
        q: "Flutter or React Native?",
        a: "Flutter for pixel-perfect parity and animation-heavy UI; React Native when your web team will inherit the code. We model both against your roadmap before recommending.",
      },
      {
        q: "Will it feel native?",
        a: "Yes — platform-specific navigation patterns, gestures, and haptics are part of our definition of done, and we test on real devices, not simulators.",
      },
      {
        q: "When is cross-platform the wrong call?",
        a: "Heavy AR, very custom hardware access, or platform-flagship polish as the product itself. When native wins, we'll tell you — we build that too.",
      },
    ],
    banner: {
      message: ["One roadmap from you,", "both app stores from us."],
      title: "Two platforms shouldn't cost two",
      titleEm: "teams",
      label: "Scope Your App",
    },
  },
  {
    slug: "mvp-development",
    kind: "services",
    nav: "MVP Development",
    metaTitle: "MVP Development — Northline Studio",
    metaDesc:
      "A lean, launchable first version in 8–14 weeks — scope cut ruthlessly, quality kept, demand tested with real users.",
    eyebrow: "MVP Development",
    title: "Launch the version that proves the",
    titleEm: "point",
    subtitle:
      "A shippable first product in 8–14 weeks: scope cut with you (not for you), engineering quality kept high enough to build on, and instrumentation that tells you what to do next.",
    image: u("photo-1553877522-43269d4ea984"),
    features: [
      {
        icon: Rocket,
        title: "Ruthless Scoping",
        desc: "The v1 cut-line drawn around one core loop — everything else earns its way in later.",
      },
      {
        icon: Activity,
        title: "Instrumented from Birth",
        desc: "Activation, retention, and the metric investors ask about — dashboarded at launch.",
      },
      {
        icon: ShieldCheck,
        title: "No-Throwaway Quality",
        desc: "Lean scope, real engineering — the MVP is the foundation, not a demo you rebuild.",
      },
    ],
    steps: [
      { t: "Cut-Line Workshop", d: "One week to a written v1 scope, timeline, and number." },
      {
        t: "Design the Core Loop",
        d: "The single flow that proves value, prototyped and tested first.",
      },
      { t: "Build in Weekly Slices", d: "Demo every Friday, shippable slice by day 14." },
      {
        t: "Launch & Learn",
        d: "Real users, real data, and a prioritized v1.1 backlog from the evidence.",
      },
    ],
    benefits: [
      {
        title: "Speed with a floor",
        desc: "Fast because the scope is small — never because the engineering is disposable.",
      },
      {
        title: "Fundraise-ready",
        desc: "A live product with usage data beats any deck in the room.",
      },
      {
        title: "Fixed price available",
        desc: "Locked scope, locked date, locked number — changes go through a written change order.",
      },
      {
        title: "A team that stays",
        desc: "84% of MVP clients continue with us past launch — the roadmap doesn't end at v1.",
      },
    ],
    faqs: [
      {
        q: "What does an MVP cost?",
        a: "Most land in a defined fixed-price band after the cut-line workshop — you get the number before you commit to the build.",
      },
      {
        q: "How do you decide what's in v1?",
        a: "One core loop that proves the value proposition, plus the boring essentials (auth, payments if you charge). Everything else goes to a ranked v1.1 list.",
      },
      {
        q: "What if we need to pivot mid-build?",
        a: "Weekly demos exist to catch that early. Small pivots absorb into the sprint; big ones get an honest re-scope conversation, not silent scope creep.",
      },
    ],
    banner: {
      message: ["An idea and a deadline from you,", "a live product from us."],
      title: "Your competitors are still writing the",
      titleEm: "spec",
      label: "Get Your v1 Plan",
    },
  },
  {
    slug: "app-store-setup",
    kind: "services",
    nav: "App Store Setup",
    metaTitle: "App Store Setup & ASO — Northline Studio",
    metaDesc:
      "Store listings, screenshots, review compliance, and ASO for App Store and Google Play — 60+ submissions shipped, rejections pre-empted.",
    eyebrow: "App Store Setup",
    title: "Through review on the first",
    titleEm: "pass",
    subtitle:
      "Sixty-plus store submissions have taught us exactly what reviewers punish. We handle listings, screenshots, compliance, and ASO so launch week is a date, not a gamble.",
    image: u("photo-1551650975-87deedd944c3"),
    features: [
      {
        icon: BadgeCheck,
        title: "Review Compliance",
        desc: "Guideline pre-audit against both stores — the rejection reasons we've already met, pre-empted.",
      },
      {
        icon: Store,
        title: "Listing & Screenshots",
        desc: "Copy, keywords, and designed screenshot sets that sell the app in three seconds.",
      },
      {
        icon: TrendingUp,
        title: "ASO Foundation",
        desc: "Keyword strategy, A/B-testable creatives, and the metadata loop that compounds installs.",
      },
    ],
    steps: [
      {
        t: "Compliance Audit",
        d: "Your build checked against current store guidelines before submission.",
      },
      {
        t: "Listing Production",
        d: "Titles, descriptions, keywords, screenshots, and preview video.",
      },
      {
        t: "Submission & Liaison",
        d: "We file, track, and answer reviewer questions until approval.",
      },
      { t: "Post-Launch ASO", d: "Ranking and conversion monitored; metadata iterated monthly." },
    ],
    benefits: [
      {
        title: "Rejections pre-empted",
        desc: "Privacy labels, permission strings, IAP rules — the traps are on our checklist, not your timeline.",
      },
      {
        title: "Launch-day certainty",
        desc: "Phased rollout plans and staged releases so launch is controlled, not chaotic.",
      },
      {
        title: "Listings that convert",
        desc: "Store pages treated as landing pages — because that's what they are.",
      },
      {
        title: "Accounts stay yours",
        desc: "Everything runs under your developer accounts from day one. No hostage listings.",
      },
    ],
    faqs: [
      {
        q: "Our app was rejected — can you help?",
        a: "Yes. Rejection triage is a fixed-scope service: we diagnose the guideline hit, fix or argue it, and resubmit. Most rejections we see are on our standard checklist.",
      },
      {
        q: "Do you handle both stores?",
        a: "Yes — App Store and Google Play, including the paperwork differences (privacy labels, data safety forms, export compliance) that trip teams up.",
      },
      {
        q: "Is ASO really worth it?",
        a: "Store search is the largest free install channel most apps have. A metadata loop takes hours a month and compounds — it's the cheapest growth you'll buy.",
      },
    ],
    banner: {
      message: ["A finished build from you,", "a clean approval from us."],
      title: "Don't let review week become review",
      titleEm: "month",
      label: "Get Store-Ready",
    },
  },
  {
    slug: "monthly-care",
    kind: "services",
    nav: "Monthly Care",
    metaTitle: "Monthly Care Plans — Northline Studio",
    metaDesc:
      "Monitoring, updates, security patches, and continuous iteration for sites and apps — the plan 84% of our clients keep after launch.",
    eyebrow: "Monthly Care",
    title: "Launch day is the",
    titleEm: "start",
    subtitle:
      "Monitoring, patches, priority fixes, and a monthly iteration budget — the unglamorous work that keeps your product fast, secure, and improving. 84% of our clients keep a plan running.",
    image: u("photo-1558494949-ef010cbdcc31"),
    features: [
      {
        icon: Activity,
        title: "Monitoring & On-Call",
        desc: "Uptime, errors, and performance watched 24/7 — we usually know before your users do.",
      },
      {
        icon: ShieldCheck,
        title: "Updates & Security",
        desc: "Dependencies, OS releases, and CVE patches applied on a schedule, not after an incident.",
      },
      {
        icon: RefreshCw,
        title: "Iteration Budget",
        desc: "Banked monthly hours for improvements — small enhancements ship weekly, not yearly.",
      },
    ],
    steps: [
      {
        t: "Handover Audit",
        d: "We baseline performance, security, and error rates — even on builds we didn't write.",
      },
      { t: "Runbook & SLAs", d: "Response times, escalation paths, and a runbook in writing." },
      {
        t: "Steady Cadence",
        d: "Patches monthly, monitoring continuous, iteration hours planned with you.",
      },
      {
        t: "Quarterly Review",
        d: "Performance report, dependency health, and next quarter's priorities.",
      },
    ],
    benefits: [
      {
        title: "Cheaper than one fire drill",
        desc: "A year of Care typically costs less than a single emergency rescue engagement.",
      },
      {
        title: "Response times in writing",
        desc: "P1 issues get a human in under an hour — it's in the SLA, not a hope.",
      },
      {
        title: "Compounding product",
        desc: "Weekly small improvements outrun competitors doing annual redesigns.",
      },
      {
        title: "Not our build? Fine.",
        desc: "We adopt codebases other teams wrote after a two-week audit.",
      },
    ],
    faqs: [
      {
        q: "What do plans cost?",
        a: "Three tiers based on response time and included iteration hours — quoted after a short audit of your stack. All tiers include monitoring and security patching.",
      },
      {
        q: "Can you maintain a product another agency built?",
        a: "Yes. A two-week adoption audit maps the codebase, risks, and quick wins; then normal Care cadence begins.",
      },
      {
        q: "What counts against iteration hours?",
        a: "Anything you ask for that isn't a defect: new sections, copy changes, small features, experiments. Unused hours roll over one month.",
      },
    ],
    banner: {
      message: ["A launched product from you,", "a decade of uptime from us."],
      title: "Great products are",
      titleEm: "maintained",
      label: "Get a Care Quote",
    },
  },
  {
    slug: "seo-performance",
    kind: "services",
    nav: "SEO & Performance",
    metaTitle: "SEO & Performance Optimization — Northline Studio",
    metaDesc:
      "Core Web Vitals, technical SEO, and structured data — measurable rankings and speed, engineered rather than promised.",
    eyebrow: "SEO & Performance",
    title: "Speed and search are the same",
    titleEm: "job",
    subtitle:
      "Google ranks what loads fast and reads clean. We fix Core Web Vitals, technical SEO, and structured data as one engineering discipline — measured weekly, reported honestly.",
    image: u("photo-1551288049-bebda4e38f71"),
    features: [
      {
        icon: Gauge,
        title: "Core Web Vitals",
        desc: "LCP, CLS, and INP brought into the green and held there with CI budgets.",
      },
      {
        icon: Search,
        title: "Technical SEO",
        desc: "Crawlability, canonical hygiene, redirects, and sitemaps — the plumbing rankings sit on.",
      },
      {
        icon: Database,
        title: "Structured Data",
        desc: "Schema markup that earns rich results and keeps you legible to AI-driven search.",
      },
    ],
    steps: [
      {
        t: "Audit & Baseline",
        d: "Field data, lab data, and crawl report — the honest starting numbers.",
      },
      {
        t: "Fix the Foundations",
        d: "Rendering, images, fonts, and third-party scripts — the weight nobody owns.",
      },
      {
        t: "Structure & Schema",
        d: "Information architecture and markup aligned with how people search.",
      },
      {
        t: "Hold the Line",
        d: "Performance budgets in CI and monthly reporting against real rankings.",
      },
    ],
    benefits: [
      {
        title: "Engineering, not incantations",
        desc: "No 'SEO magic' — measurable fixes to measurable problems, explained in plain language.",
      },
      {
        title: "Ranking-proof speed",
        desc: "Green Core Web Vitals protect you through every algorithm update that rewards them.",
      },
      {
        title: "Conversion side-effect",
        desc: "The same milliseconds that please Google raise your conversion rate.",
      },
      {
        title: "Honest reporting",
        desc: "Monthly numbers against baseline — including the ones that didn't move yet.",
      },
    ],
    faqs: [
      {
        q: "How long until rankings move?",
        a: "Technical fixes show in Core Web Vitals within weeks; ranking impact typically follows in 2–4 months. Anyone promising faster is guessing or lying.",
      },
      {
        q: "Do you do content SEO too?",
        a: "We handle structure, briefs, and on-page optimization; long-form content production comes through our digital marketing solution or your writers working from our briefs.",
      },
      {
        q: "Our site is slow but we can't rebuild. Options?",
        a: "Most sites get to green vitals without a rebuild — images, fonts, script diet, and rendering fixes carry further than people expect. The audit will tell us if yours is the exception.",
      },
    ],
    banner: {
      message: ["Your current scores from you,", "green vitals from us."],
      title: "Every millisecond is",
      titleEm: "revenue",
      label: "Get the Audit",
    },
  },
  {
    slug: "maintenance-support",
    kind: "services",
    nav: "Maintenance & Support",
    metaTitle: "Maintenance & Support — Northline Studio",
    metaDesc:
      "SLA-backed support, monitoring, and incident response for production software — including codebases we didn't build.",
    eyebrow: "Maintenance & Support",
    title: "Production software needs a",
    titleEm: "pulse",
    subtitle:
      "SLA-backed incident response, proactive monitoring, and scheduled maintenance for the systems your revenue stands on — including the ones another team built.",
    image: u("photo-1573164713988-8665fc963095"),
    features: [
      {
        icon: LifeBuoy,
        title: "Incident Response",
        desc: "P1 response under an hour, a runbook for every failure mode we can foresee.",
      },
      {
        icon: Activity,
        title: "Proactive Monitoring",
        desc: "Errors, uptime, queues, and cost anomalies watched before they become outages.",
      },
      {
        icon: Wrench,
        title: "Scheduled Maintenance",
        desc: "Dependency upgrades, database care, and backup drills on a calendar, not a crisis.",
      },
    ],
    steps: [
      {
        t: "Adoption Audit",
        d: "Two weeks mapping the system, its risks, and its escape hatches.",
      },
      {
        t: "Stabilize",
        d: "Monitoring, alerting, backups, and the runbook — the safety net first.",
      },
      {
        t: "Maintain",
        d: "Patches and upgrades on cadence, with staging rehearsals for the scary ones.",
      },
      {
        t: "Report & Improve",
        d: "Monthly health reports and a standing list of risk-reduction wins.",
      },
    ],
    benefits: [
      {
        title: "SLAs, not vibes",
        desc: "Response and resolution targets in a signed document, with credits if we miss.",
      },
      {
        title: "Orphaned code welcome",
        desc: "Original developers gone? We specialize in adopting undocumented systems.",
      },
      {
        title: "Downtime economics",
        desc: "One prevented outage typically pays the annual contract.",
      },
      {
        title: "Knowledge that stays",
        desc: "Everything we learn lands in runbooks you own — no new tribal knowledge.",
      },
    ],
    faqs: [
      {
        q: "Our developer disappeared. Can you take over?",
        a: "This is the most common way engagements start. The two-week adoption audit maps what exists; then we stabilize before touching features.",
      },
      {
        q: "What's covered by the SLA?",
        a: "Defined severity levels with response and resolution targets, business-hours or 24/7 depending on tier. You see the exact matrix before signing.",
      },
      {
        q: "How is this different from Monthly Care?",
        a: "Care bundles maintenance with a design/feature iteration budget for growing products. Maintenance & Support is the deeper operational tier for business-critical systems — SLAs, on-call, and incident management.",
      },
    ],
    banner: {
      message: ["A system you depend on from you,", "a team that answers from us."],
      title: "Who picks up when it breaks at",
      titleEm: "2am",
      titleAfter: "?",
      label: "Get Covered",
    }, // titleAfter replaces the default period
  },
  {
    slug: "analytics-cro",
    kind: "services",
    nav: "Analytics & CRO",
    metaTitle: "Analytics & CRO — Northline Studio",
    metaDesc:
      "Measurement that answers questions and experiments that move revenue — event taxonomy, funnels, and a disciplined testing program.",
    eyebrow: "Analytics & CRO",
    title: "Measure honestly, then move the",
    titleEm: "number",
    subtitle:
      "An event taxonomy that answers real questions, funnels that show where money leaks, and a disciplined experiment program that turns traffic you already have into revenue you don't.",
    image: u("photo-1460925895917-afdab827c52f"),
    features: [
      {
        icon: BarChart3,
        title: "Measurement Foundation",
        desc: "Event taxonomy, clean funnels, and dashboards your team actually opens.",
      },
      {
        icon: LineChart,
        title: "Experiment Program",
        desc: "Prioritized A/B tests run with statistical discipline — no peeking, no p-hacking.",
      },
      {
        icon: Fingerprint,
        title: "Privacy-Sound Setup",
        desc: "Consent-aware tracking that respects users and survives regulation.",
      },
    ],
    steps: [
      {
        t: "Audit & Taxonomy",
        d: "What's tracked, what's noise, and what questions the data must answer.",
      },
      { t: "Instrument", d: "Events, funnels, and dashboards wired and QA'd against reality." },
      {
        t: "Find the Leaks",
        d: "Session replays and funnel analysis locate the drop-offs worth testing.",
      },
      {
        t: "Test & Compound",
        d: "A weekly experiment cadence — winners ship, losers teach, both documented.",
      },
    ],
    benefits: [
      {
        title: "Decisions get cheaper",
        desc: "When the funnel is trustworthy, debates end and roadmaps write themselves.",
      },
      {
        title: "Revenue from existing traffic",
        desc: "CRO monetizes visitors you already paid for — the highest-ROI work most teams skip.",
      },
      {
        title: "Discipline included",
        desc: "Sample sizes, run times, and significance handled properly — no false winners.",
      },
      {
        title: "Your data, your stack",
        desc: "Built on tools you own; every dashboard and definition documented and portable.",
      },
    ],
    faqs: [
      {
        q: "Our analytics are a mess. Start over?",
        a: "Usually we keep the tool and rebuild the taxonomy — a clean event schema matters more than the logo on the dashboard.",
      },
      {
        q: "How much traffic do we need for CRO?",
        a: "Meaningful A/B testing generally needs ~1,000 conversions/month per test. Below that we lean on research, replays, and pre/post analysis — and we'll say so upfront.",
      },
      {
        q: "What results should we expect?",
        a: "Typical engagements find 15–40% conversion improvement over two quarters of disciplined testing. Your mileage depends on how untested the current experience is.",
      },
    ],
    banner: {
      message: ["Your traffic from you,", "more of it converting, from us."],
      title: "You don't have a traffic problem, you have a",
      titleEm: "conversion",
      titleAfter: " problem.",
      label: "Find the Leaks",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Solutions                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "ecommerce",
    kind: "solutions",
    nav: "Ecommerce",
    metaTitle: "Ecommerce Solutions — Northline Studio",
    metaDesc:
      "Shopify, headless, and custom commerce builds engineered for conversion — like the replatform that lifted revenue 48% in one quarter.",
    eyebrow: "Ecommerce",
    title: "Stores engineered to",
    titleEm: "checkout",
    subtitle:
      "Shopify, headless, or custom — we build commerce where the buying path is the product. Our last replatform lifted revenue 48% in a single quarter.",
    image: u("photo-1556742049-0cfed4f6a45d"),
    features: [
      {
        icon: ShoppingCart,
        title: "Headless Storefronts",
        desc: "Sub-second product pages and two-step checkouts on Shopify or custom backends.",
      },
      {
        icon: CreditCard,
        title: "Payments & Subscriptions",
        desc: "One-click wallets, subscriptions, and the localized payment methods that close carts.",
      },
      {
        icon: Package,
        title: "Operations Integration",
        desc: "Inventory, fulfillment, ERP, and support systems speaking one language.",
      },
    ],
    steps: [
      {
        t: "Funnel Forensics",
        d: "Two weeks of session data finds where carts die — targets go in the contract.",
      },
      {
        t: "Rebuild the Money Path",
        d: "Product page, cart, checkout first, behind a traffic split.",
      },
      {
        t: "Platform the Rest",
        d: "Content, merchandising, and promo tooling your team runs without developers.",
      },
      {
        t: "Optimize Forever",
        d: "A/B program on the funnel — every week, something gets faster or clearer.",
      },
    ],
    benefits: [
      {
        title: "Mobile-first economics",
        desc: "Most stores earn least where traffic is highest. We fix the mobile gap first.",
      },
      {
        title: "Marketing independence",
        desc: "Campaigns, landing pages, and promos ship without engineering tickets.",
      },
      {
        title: "Proven at scale",
        desc: "Black-Friday-tested architectures — load-tested before launch, not during it.",
      },
      {
        title: "Numbers in the contract",
        desc: "Speed and conversion targets written down before we start.",
      },
    ],
    faqs: [
      {
        q: "Shopify or custom?",
        a: "Shopify (often headless) for most brands — the ecosystem earns its fees. Custom when your catalog, pricing, or B2B logic outgrows platform assumptions. We model both with real numbers.",
      },
      {
        q: "Can you replatform without losing SEO?",
        a: "Yes — full redirect mapping, structured-data parity, and staged cutover. Our replatforms typically gain search traffic within a quarter because the new site is faster.",
      },
      {
        q: "What did the +48% case actually involve?",
        a: "Northwind Commerce: headless rebuild of the buying path behind a traffic split, two-step checkout, and marketing tooling. The full case study is on the works page.",
      },
    ],
    banner: {
      message: ["Your conversion rate from you,", "a better one from us."],
      title: "Your store has traffic. Now give it a",
      titleEm: "checkout",
      label: "Audit My Store",
    },
  },
  {
    slug: "marketplaces",
    kind: "solutions",
    nav: "Marketplaces",
    metaTitle: "Marketplace Development — Northline Studio",
    metaDesc:
      "Two-sided marketplace platforms: onboarding, matching, payments with escrow and payouts, trust systems, and liquidity mechanics.",
    eyebrow: "Marketplaces",
    title: "Two sides, one",
    titleEm: "flywheel",
    subtitle:
      "Marketplaces fail on liquidity, not features. We build the onboarding, matching, payments, and trust mechanics that get both sides to show up — and stay.",
    image: u("photo-1556740738-b6a63e27c4df"),
    features: [
      {
        icon: ArrowLeftRight,
        title: "Matching & Discovery",
        desc: "Search, ranking, and recommendation logic tuned for fill rate, not vanity engagement.",
      },
      {
        icon: CreditCard,
        title: "Split Payments & Escrow",
        desc: "Stripe Connect done right: holds, releases, refunds, disputes, and multi-party payouts.",
      },
      {
        icon: ShieldCheck,
        title: "Trust & Safety",
        desc: "Verification, reviews, and moderation tooling — the infrastructure of strangers transacting.",
      },
    ],
    steps: [
      {
        t: "Liquidity Strategy",
        d: "Which side first, in which niche, with what promise — decided before code.",
      },
      {
        t: "Supply-Side MVP",
        d: "Onboarding and inventory tooling that makes providers look great.",
      },
      {
        t: "Demand & Matching",
        d: "Search and booking flows tuned until transactions clear reliably.",
      },
      {
        t: "Scale the Loop",
        d: "Payouts, reviews, and retention mechanics that compound liquidity.",
      },
    ],
    benefits: [
      {
        title: "Liquidity-first roadmap",
        desc: "Every sprint prioritized by its effect on fill rate — the only metric that matters early.",
      },
      {
        title: "Payments that survive audits",
        desc: "Escrow, KYC, and payout flows built on compliant rails from day one.",
      },
      {
        title: "Leakage defenses",
        desc: "Product mechanics that keep transactions on-platform without punishing users.",
      },
      {
        title: "Cold-start honesty",
        desc: "We'll tell you which niche to constrain to — a marketplace of everything sells nothing.",
      },
    ],
    faqs: [
      {
        q: "How do we solve the chicken-and-egg problem?",
        a: "Constrain the niche, subsidize or hand-curate supply first, and fake nothing that touches money. The liquidity strategy phase turns this into a concrete sequence for your market.",
      },
      {
        q: "How do payments and payouts work?",
        a: "Typically Stripe Connect: the platform takes its fee, funds hold in escrow until service confirmation, then split-pay out. Disputes and refunds are designed flows, not support tickets.",
      },
      {
        q: "How long to a functioning marketplace?",
        a: "A constrained-niche v1 with real transactions in 12–16 weeks. Broad horizontal platforms take longer — and usually shouldn't be v1.",
      },
    ],
    banner: {
      message: ["Two sides of a market from you,", "the flywheel from us."],
      title: "Marketplaces don't fail on features. They fail on",
      titleEm: "liquidity",
      label: "Plan the Platform",
    },
  },
  {
    slug: "internal-tools",
    kind: "solutions",
    nav: "Internal Tools",
    metaTitle: "Internal Tools Development — Northline Studio",
    metaDesc:
      "Ops dashboards, admin panels, and workflow systems that replace the spreadsheet running your company — built in weeks.",
    eyebrow: "Internal Tools",
    title: "Retire the spreadsheet that runs the",
    titleEm: "company",
    subtitle:
      "Every company has one: the spreadsheet, the shared inbox, the swivel-chair process everyone fears. We replace it with an ops tool your team adopts because it's simply faster.",
    image: u("photo-1554224155-6726b3ff858f"),
    features: [
      {
        icon: AppWindow,
        title: "Ops Dashboards",
        desc: "The state of the business on one screen, pulling live from your real systems.",
      },
      {
        icon: Workflow,
        title: "Workflow Automation",
        desc: "Approvals, handoffs, and re-keying replaced with flows that enforce themselves.",
      },
      {
        icon: Database,
        title: "System Integration",
        desc: "CRM, ERP, billing, and that one legacy database — finally speaking to each other.",
      },
    ],
    steps: [
      {
        t: "Shadow the Work",
        d: "We watch the real process — the workarounds are the requirements.",
      },
      {
        t: "Map & Cut",
        d: "The workflow redesigned on paper first; steps that exist by habit get deleted.",
      },
      {
        t: "Build the Tool",
        d: "Weekly releases to the actual operators, tuned to their keyboard-speed reality.",
      },
      { t: "Automate the Edges", d: "Integrations and jobs that remove the remaining copy-paste." },
    ],
    benefits: [
      {
        title: "Hours back weekly",
        desc: "Typical engagements return 20–40 staff-hours a week — the ROI math is short.",
      },
      {
        title: "Operator-grade UX",
        desc: "Built for the person using it eight hours a day: dense, fast, keyboard-first.",
      },
      {
        title: "Error rates collapse",
        desc: "Validation and single-entry data kill the retype mistakes that cost real money.",
      },
      {
        title: "Institutional memory",
        desc: "Process lives in the tool, not in the head of the one person who knows it.",
      },
    ],
    faqs: [
      {
        q: "Why not just use a no-code tool?",
        a: "Sometimes you should — and we'll say so. Custom wins when the workflow is your competitive edge, the data model is gnarly, or per-seat pricing at your headcount exceeds a build.",
      },
      {
        q: "How do you get staff to adopt it?",
        a: "By shadowing them first and building for their speed. Adoption problems are design problems; operators switch instantly to tools that are obviously faster.",
      },
      {
        q: "Can it talk to our ancient ERP?",
        a: "Almost certainly. Between APIs, database views, file drops, and — worst case — supervised automation, we've integrated systems older than our engineers.",
      },
    ],
    banner: {
      message: ["Your messiest process from you,", "an ops tool from us."],
      title: "Somewhere, a spreadsheet is",
      titleEm: "screaming",
      label: "Replace It",
    },
  },
  {
    slug: "digital-marketing",
    kind: "solutions",
    nav: "Digital Marketing",
    metaTitle: "Digital Marketing — Northline Studio",
    metaDesc:
      "SEO, paid acquisition, and content engineered together with your site — a growth engine measured in pipeline, not impressions.",
    eyebrow: "Digital Marketing",
    title: "Marketing measured in",
    titleEm: "pipeline",
    subtitle:
      "SEO, paid, and content run by the same studio that builds your site — so landing pages match ads, tracking is honest, and the report shows revenue, not impressions.",
    image: u("photo-1533750349088-cd871a92f312"),
    features: [
      {
        icon: Search,
        title: "SEO & Content",
        desc: "Search strategy, briefs, and technical foundations that compound for years.",
      },
      {
        icon: Target,
        title: "Paid Acquisition",
        desc: "Google and social campaigns with message-matched landing pages built in-house.",
      },
      {
        icon: BarChart3,
        title: "Full-Funnel Measurement",
        desc: "One attribution picture from first click to closed revenue.",
      },
    ],
    steps: [
      {
        t: "Baseline & Targets",
        d: "Current CAC, funnel, and honest benchmarks — before promising anything.",
      },
      {
        t: "Foundations",
        d: "Tracking, landing pages, and SEO plumbing fixed so spend isn't wasted.",
      },
      {
        t: "Channel Sprints",
        d: "Test budgets across channels; double down where CAC proves out.",
      },
      {
        t: "Compound",
        d: "Content engine and retargeting layered on what's demonstrably working.",
      },
    ],
    benefits: [
      {
        title: "Site and campaigns, one team",
        desc: "No agency-vs-developer finger-pointing — the landing page and the ad ship together.",
      },
      {
        title: "Revenue reporting",
        desc: "Dashboards read in pipeline and CAC, not clicks and 'engagement'.",
      },
      {
        title: "No retainer theater",
        desc: "Channel budgets shift monthly to what performs; we cut our own busywork.",
      },
      {
        title: "Assets you keep",
        desc: "Content, audiences, and tracking live in accounts you own.",
      },
    ],
    faqs: [
      {
        q: "What budget do we need?",
        a: "Meaningful paid tests start around a few thousand per month in spend; SEO-led programs trade budget for time. We'll model both against your CAC targets before you commit.",
      },
      {
        q: "How fast does it work?",
        a: "Paid shows signal in weeks; SEO compounds over quarters. The plan sequences both so something is always producing while the long game builds.",
      },
      {
        q: "Do you work alongside an existing agency?",
        a: "Yes — often we fix the site, tracking, and landing pages while your agency runs media. Clean handoffs, shared dashboards, no turf wars.",
      },
    ],
    banner: {
      message: ["A growth target from you,", "the engine for it from us."],
      title: "Impressions don't pay",
      titleEm: "invoices",
      label: "Build the Engine",
    },
  },
  {
    slug: "brand-consultancy",
    kind: "solutions",
    nav: "Full Brand Consultancy",
    metaTitle: "Brand Consultancy — Northline Studio",
    metaDesc:
      "Positioning, identity, messaging, and rollout as one program — strategy that survives contact with product, sales, and hiring.",
    eyebrow: "Brand Consultancy",
    title: "Strategy to rollout, one",
    titleEm: "thread",
    subtitle:
      "Positioning workshops that end in decisions, identity built on real surfaces, messaging your sales team will actually say — and a rollout plan that touches every pixel you own.",
    image: u("photo-1552664730-d307ca884978"),
    features: [
      {
        icon: BrainCircuit,
        title: "Positioning & Strategy",
        desc: "Category, audience, and promise nailed down in words a board signs off on.",
      },
      {
        icon: Palette,
        title: "Identity & Voice",
        desc: "The full visual and verbal system — built digital-first, delivered as tokens.",
      },
      {
        icon: Megaphone,
        title: "Rollout & Governance",
        desc: "Site, product, decks, and social migrated on a plan — with rules that keep it coherent.",
      },
    ],
    steps: [
      {
        t: "Research & Positioning",
        d: "Customer interviews and competitor teardown → a one-page strategy that chooses.",
      },
      {
        t: "Identity System",
        d: "Visual and verbal identity designed against your hardest real surfaces.",
      },
      {
        t: "Messaging Architecture",
        d: "Website copy, sales narrative, and the answer to 'so what do you do?'",
      },
      {
        t: "Rollout",
        d: "Sequenced migration of every touchpoint, biggest revenue surfaces first.",
      },
    ],
    benefits: [
      {
        title: "Decisions, not decks",
        desc: "Every phase ends in a choice made, written down, and built upon.",
      },
      {
        title: "Strategy that ships",
        desc: "The same studio that writes the positioning rebuilds the website — no translation loss.",
      },
      {
        title: "Sales-tested messaging",
        desc: "Narratives rehearsed against real objections before they go public.",
      },
      {
        title: "Coherence machine",
        desc: "Guidelines, tokens, and templates that keep pixel one thousand as sharp as pixel one.",
      },
    ],
    faqs: [
      {
        q: "How is this different from your brand identity service?",
        a: "Identity is the visual/verbal system. Consultancy wraps it with positioning research before and rollout governance after — it's the full arc for companies whose story itself needs work.",
      },
      {
        q: "How long does the full program run?",
        a: "Typically 10–16 weeks from research to rollout plan, with the website rebuild often running as a parallel track in the back half.",
      },
      {
        q: "Will you tell us if our brand is fine?",
        a: "Yes — sometimes the research says the brand is healthy and the problem is the website or the message. You'll get that finding at week three, not after the full spend.",
      },
    ],
    banner: {
      message: ["An honest look at your brand from you,", "a sharper one from us."],
      title: "Companies outgrow their",
      titleEm: "story",
      label: "Start the Conversation",
    },
  },
  {
    slug: "growth-cro",
    kind: "solutions",
    nav: "Growth & CRO",
    metaTitle: "Growth & CRO — Northline Studio",
    metaDesc:
      "A disciplined experimentation program across funnel, onboarding, and pricing — test, learn, scale what works.",
    eyebrow: "Growth & CRO",
    title: "Test, learn,",
    titleEm: "compound",
    subtitle:
      "A standing experiment program across your funnel, onboarding, and pricing — run with statistical discipline, shipped by people who can change the product, not just the button color.",
    image: u("photo-1559526324-4b87b5e36e44"),
    features: [
      {
        icon: LineChart,
        title: "Experiment Engine",
        desc: "A prioritized backlog, weekly ship cadence, and results nobody can argue with.",
      },
      {
        icon: Users,
        title: "Activation & Onboarding",
        desc: "The first-session experience tuned until signups become users.",
      },
      {
        icon: TrendingUp,
        title: "Pricing & Packaging",
        desc: "Tests on the highest-leverage page you have — run carefully, measured properly.",
      },
    ],
    steps: [
      {
        t: "Growth Audit",
        d: "Funnel math, replay analysis, and the ranked list of leaks worth testing.",
      },
      {
        t: "Fix the Obvious",
        d: "Pre-test wins first — broken flows and dead ends don't need experiments.",
      },
      {
        t: "Weekly Experiments",
        d: "Hypothesis, sample size, run time, verdict — a drumbeat, not a workshop.",
      },
      {
        t: "Scale Winners",
        d: "Proven changes rolled through the product and fed back into the backlog.",
      },
    ],
    benefits: [
      {
        title: "Product-deep testing",
        desc: "We test onboarding flows and pricing logic, not just headlines — because we build product.",
      },
      {
        title: "Compounding math",
        desc: "Three 10% wins in sequence is a third more revenue — from traffic you already have.",
      },
      {
        title: "No false winners",
        desc: "Proper statistics, honest run times, documented nulls — discipline is the product.",
      },
      {
        title: "Knowledge base included",
        desc: "Every experiment logged with evidence; your team inherits the learning, not just the wins.",
      },
    ],
    faqs: [
      {
        q: "How is this different from Analytics & CRO?",
        a: "That service builds the measurement and testing foundation. Growth & CRO is the ongoing program on top — a standing team running experiments across the whole funnel, month after month.",
      },
      {
        q: "What results are realistic?",
        a: "Programs typically compound 15–40% conversion improvement across two quarters. We publish the nulls too — anyone showing only winners is curating.",
      },
      {
        q: "Do we need a data team first?",
        a: "No — the audit phase stands up whatever measurement is missing. You need traffic, a conversion event that matters, and the will to change what tests say to change.",
      },
    ],
    banner: {
      message: ["Your funnel from you,", "a fatter bottom of it from us."],
      title: "Growth isn't a hack. It's a",
      titleEm: "habit",
      label: "Start Experimenting",
    },
  },
  {
    slug: "startup-mvp",
    kind: "solutions",
    nav: "Startup MVP",
    metaTitle: "Startup MVP — Northline Studio",
    metaDesc:
      "Idea to launched product for founders: cut-line workshop, fixed price, live in 8–14 weeks, instrumented for the next fundraise.",
    eyebrow: "Startup MVP",
    title: "From idea to",
    titleEm: "launch",
    subtitle:
      "For founders: one senior pod takes you from napkin to live product in 8–14 weeks — fixed price, ruthless scope, and the usage data your next investor conversation needs.",
    image: u("photo-1522071820081-009f0129c71c"),
    features: [
      {
        icon: Rocket,
        title: "Founder-Speed Delivery",
        desc: "Cut-line workshop to live product in 8–14 weeks, demo every Friday.",
      },
      {
        icon: CalendarClock,
        title: "Fixed Price & Date",
        desc: "Locked scope, locked number, locked launch — changes are written orders, not surprises.",
      },
      {
        icon: BarChart3,
        title: "Fundraise Instrumentation",
        desc: "Activation and retention dashboards that answer the questions investors ask.",
      },
    ],
    steps: [
      { t: "Cut-Line Workshop", d: "One week: the core loop, the v1 scope, the price, the date." },
      {
        t: "Prototype the Risk",
        d: "The scariest assumption tested with users before full build.",
      },
      { t: "Build in Slices", d: "Shippable by day 14, feature-complete in weekly demos." },
      { t: "Launch & Iterate", d: "Real users, honest metrics, and a ranked v1.1 backlog." },
    ],
    benefits: [
      {
        title: "Senior pod, no bench",
        desc: "Three to five seniors who've shipped dozens of v1s — no juniors learning on your runway.",
      },
      {
        title: "Runway math respected",
        desc: "Fixed pricing means your burn model survives the build.",
      },
      { title: "Built to raise on", desc: "A live product with a retention curve beats any deck." },
      {
        title: "Equity stays yours",
        desc: "We charge money, not points. Full IP transfer at delivery.",
      },
    ],
    faqs: [
      {
        q: "Do you work for equity?",
        a: "No — cash keeps incentives clean and your cap table yours. We're the vendor your future Series A lawyers will be glad you used.",
      },
      {
        q: "What if we're pre-idea-validation?",
        a: "Start with the prototype service instead — three weeks and a fraction of the cost to find out if the MVP deserves to exist.",
      },
      {
        q: "Can our technical co-founder work alongside you?",
        a: "Ideal, actually. Shared repo from day one, PR reviews both ways, and a handover that's a merge, not a cliff.",
      },
    ],
    banner: {
      message: ["A napkin sketch from you,", "a live product from us."],
      title: "Runway is measured in",
      titleEm: "weeks",
      label: "Book the Workshop",
    },
  },
  {
    slug: "enterprise",
    kind: "solutions",
    nav: "Enterprise",
    metaTitle: "Enterprise Solutions — Northline Studio",
    metaDesc:
      "Secure, compliant builds for enterprise: SSO, audit trails, SOC2/HIPAA-ready practices, and procurement-friendly delivery.",
    eyebrow: "Enterprise",
    title: "Boutique speed,",
    titleEm: "enterprise",
    titleAfter: " spine",
    subtitle:
      "Systems that pass your security review the first time: SSO, audit trails, compliance-ready practices, and documentation your auditors will actually enjoy — shipped at studio speed.",
    image: u("photo-1497366216548-37526070297c"),
    features: [
      {
        icon: Building2,
        title: "Security & Compliance",
        desc: "SOC2 / HIPAA / GDPR-ready controls, pen-tested builds, least-privilege everything.",
      },
      {
        icon: Fingerprint,
        title: "Identity & Access",
        desc: "SSO/SAML, SCIM provisioning, and role models that mirror your org chart.",
      },
      {
        icon: Cloud,
        title: "Integration at Scale",
        desc: "Versioned APIs and event streams that coexist with the systems you can't replace.",
      },
    ],
    steps: [
      {
        t: "Security-First Discovery",
        d: "Your infosec requirements in the architecture from day one — not retrofitted for the audit.",
      },
      {
        t: "Architecture Review",
        d: "ADRs, threat model, and data flows documented for your review board.",
      },
      {
        t: "Compliant Delivery",
        d: "Peer-reviewed merges, scanned dependencies, audit-logged environments.",
      },
      {
        t: "Handover & Support",
        d: "Runbooks, training, and SLA-backed support your ops team signs off on.",
      },
    ],
    benefits: [
      {
        title: "Procurement-fluent",
        desc: "Security questionnaires, DPAs, insurance certificates — we've filled them all before.",
      },
      {
        title: "One pod, no cast of thousands",
        desc: "Senior people who were in the kickoff are in the final demo — decisions don't dilute.",
      },
      {
        title: "Weeks, not fiscal years",
        desc: "Studio cadence inside enterprise constraints: first demo day 7, even behind your VPN.",
      },
      {
        title: "Audit-ready by default",
        desc: "Evidence trails generated by the process, not reconstructed the week before the audit.",
      },
    ],
    faqs: [
      {
        q: "Can you work within our security requirements?",
        a: "Yes — VPN-only access, customer-managed cloud, background checks, your device policy. Constraints get priced honestly, never dodged.",
      },
      {
        q: "Do you sign our paper?",
        a: "We regularly work under client MSAs, DPAs, and NDAs. Our counsel turns redlines around in days, not months.",
      },
      {
        q: "How do you handle procurement?",
        a: "Fixed-scope SOWs with milestone billing that map cleanly to PO processes, plus every security artifact your vendor-review team asks for.",
      },
    ],
    banner: {
      message: ["Your compliance bar from you,", "a system that clears it from us."],
      title: "Enterprise-grade shouldn't mean enterprise-",
      titleEm: "slow",
      label: "Talk to Us",
    },
  },
  {
    slug: "rescue-projects",
    kind: "solutions",
    nav: "Rescue Projects",
    metaTitle: "Project Rescue — Northline Studio",
    metaDesc:
      "Stalled build? Vanished agency? We audit, stabilize, and ship stranded software projects — triage in two weeks.",
    eyebrow: "Rescue Projects",
    title: "Stalled project?",
    titleEm: "Salvageable",
    titleAfter: ", usually.",
    subtitle:
      "The agency vanished, the deadline passed, or the codebase scares everyone who opens it. We triage in two weeks, tell you the honest options, and ship what can be shipped.",
    image: u("photo-1504868584819-f8e8b4b6d7e3"),
    features: [
      {
        icon: Search,
        title: "Two-Week Triage",
        desc: "Code audit, risk map, and three honest options: finish, fix, or restart — with numbers.",
      },
      {
        icon: Wrench,
        title: "Stabilize & Ship",
        desc: "The shortest defensible path to a working release, then the cleanup.",
      },
      {
        icon: ShieldCheck,
        title: "De-Risk the Future",
        desc: "Tests, CI, docs, and monitoring so this never happens to you twice.",
      },
    ],
    steps: [
      {
        t: "Triage Audit",
        d: "Two weeks inside the code and the history — findings you can act on either way.",
      },
      {
        t: "Stop the Bleeding",
        d: "Backups, access recovery, security holes, and anything on fire — first.",
      },
      {
        t: "Shortest Path to Live",
        d: "Scope cut to shippable; the perfect refactor waits its turn.",
      },
      {
        t: "Rebuild Trust",
        d: "Tests, pipelines, and documentation — the boring armor against a repeat.",
      },
    ],
    benefits: [
      {
        title: "No judgment, all discretion",
        desc: "We've seen worse, we say so honestly, and we don't blame your last team in writing.",
      },
      {
        title: "Sunk cost, honestly assessed",
        desc: "If 70% is salvageable, we save it. If it isn't, you'll know in week two — not month six.",
      },
      {
        title: "Fixed-price triage",
        desc: "The audit costs a known number and pays for itself in avoided wrong turns.",
      },
      {
        title: "Momentum returns fast",
        desc: "Most rescues show a visible win — a deploy, a fix, a demo — within the first month.",
      },
    ],
    faqs: [
      {
        q: "The old agency won't hand over the code. Help?",
        a: "Common, unfortunately. We'll walk you through the access-recovery playbook — repos, domains, hosting, stores — and rebuild from artifacts if it comes to that.",
      },
      {
        q: "Is it cheaper to restart from scratch?",
        a: "Sometimes yes — about a third of triages recommend targeted rebuilds. You'll get the comparison with real numbers, and we're happy either way, so the advice is clean.",
      },
      {
        q: "Can you finish another team's half-built app?",
        a: "That's the core service. After triage we adopt the codebase, stabilize it, and drive it to launch — then Care keeps it healthy.",
      },
    ],
    banner: {
      message: ["The project nobody talks about,", "back on track, from us."],
      title: "Sunk costs sink deeper while you",
      titleEm: "wait",
      label: "Book the Triage",
    },
  },
  {
    slug: "scale-up",
    kind: "solutions",
    nav: "Scale-up",
    metaTitle: "Scale-up Engineering — Northline Studio",
    metaDesc:
      "Re-architect for growth: performance, reliability, and team velocity for products that outgrew their v1 — without a rewrite bet.",
    eyebrow: "Scale-up",
    title: "Your v1 worked. That's the",
    titleEm: "problem",
    subtitle:
      "Traction turns shortcuts into outages. We re-architect running products for scale — strangler-pattern, phase by phase, with zero downtime and the roadmap still shipping.",
    image: u("photo-1451187580459-43490279c0fa"),
    features: [
      {
        icon: TrendingUp,
        title: "Scale Architecture",
        desc: "The load-bearing rewrites — data model, queues, caching — sequenced by risk and revenue.",
      },
      {
        icon: Activity,
        title: "Reliability Engineering",
        desc: "Observability, SLOs, and incident discipline before growth finds the weak points.",
      },
      {
        icon: Zap,
        title: "Velocity Recovery",
        desc: "CI/CD, test coverage, and modular boundaries that make your team fast again.",
      },
    ],
    steps: [
      {
        t: "Architecture Audit",
        d: "Two weeks: bottleneck map, risk register, and a sequenced plan with cost per phase.",
      },
      {
        t: "Observability First",
        d: "You can't fix what you can't see — metrics and tracing before surgery.",
      },
      {
        t: "Strangle, Don't Rewrite",
        d: "Highest-risk components replaced in phases behind flags, traffic shifting gradually.",
      },
      { t: "Institutionalize", d: "Runbooks, SLOs, and reviews your team runs without us." },
    ],
    benefits: [
      {
        title: "No big-bang bets",
        desc: "The old system keeps earning while the new one earns trust — every phase reversible.",
      },
      {
        title: "Roadmap keeps shipping",
        desc: "Re-architecture runs alongside features, not instead of them.",
      },
      {
        title: "3× release cadence",
        desc: "The median outcome across our transformation work within two quarters.",
      },
      {
        title: "Your team levels up",
        desc: "We pair with your engineers through every phase — capability transfers, dependence doesn't.",
      },
    ],
    faqs: [
      {
        q: "How do we know if we need this?",
        a: "Symptoms: deploys feel dangerous, one table is always the bottleneck, incidents repeat, velocity halves yearly. The audit quantifies whether it's tuning or architecture.",
      },
      {
        q: "Rewrite or refactor?",
        a: "Strangler-pattern replacement of the riskiest components, almost always. Full rewrites bet the company on a launch weekend — we've made a specialty of never needing one.",
      },
      {
        q: "Can you work with our in-house team?",
        a: "That's the default. Your engineers know the bodies; we bring the scale patterns. Pairing through phases is how the knowledge stays.",
      },
    ],
    banner: {
      message: ["A creaking v1 from you,", "an architecture that scales from us."],
      title: "Success is the heaviest",
      titleEm: "load",
      label: "Book the Audit",
    },
  },
];

export const getSubpage = (kind: SubpageKind, slug: string) =>
  subpages.find((s) => s.kind === kind && s.slug === slug);

export const subpagesByKind = (kind: SubpageKind) => subpages.filter((s) => s.kind === kind);
