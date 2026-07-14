import type { ComponentType } from "react";
import {
  Banknote,
  Building2,
  FileCheck2,
  Gauge,
  HeartPulse,
  LockKeyhole,
  Plug,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Workflow,
} from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

export type Industry = {
  slug: string;
  nav: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  subtitle: string;
  image: string;
  /** case-study `industry` values that belong to this page */
  matches: string[];
  points: { icon: IconType; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  banner: { message: [string, string]; title: string; titleEm: string; label: string };
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=70`;

export const industries: Industry[] = [
  {
    slug: "fintech",
    nav: "Fintech",
    metaTitle: "Fintech Development — Northline Studio",
    metaDesc:
      "Compliant, secure fintech products: ledgers, payments, and dashboards built for regulated rooms — with the case studies to prove it.",
    eyebrow: "Fintech",
    title: "Software that moves",
    titleEm: "money",
    subtitle:
      "Ledgers, payments, and financial dashboards built the way auditors like them: double-entry correct, permissioned to the field level, and fast enough that ops teams stop exporting to Excel.",
    image: u("photo-1554224155-6726b3ff858f"),
    matches: ["Fintech"],
    points: [
      {
        icon: Banknote,
        title: "Ledger-Grade Correctness",
        desc: "Double-entry data models, idempotent money movement, and reconciliation built in — cents never vanish.",
      },
      {
        icon: LockKeyhole,
        title: "Compliance-Ready",
        desc: "KYC/AML flows, audit trails, and SOC2-ready practices from the first commit.",
      },
      {
        icon: Gauge,
        title: "Real-Time Operations",
        desc: "Dashboards and alerting that keep risk and ops teams ahead of the queue, not behind it.",
      },
    ],
    stats: [
      { value: "3.1×", label: "signup growth on our last fintech SaaS engagement" },
      { value: "0", label: "compliance findings across shipped fintech builds" },
      { value: "99.95%", label: "uptime across client platforms" },
    ],
    banner: {
      message: ["A regulated problem from you,", "an auditable system from us."],
      title: "Fintech rewards the",
      titleEm: "careful",
      label: "Talk Fintech",
    },
  },
  {
    slug: "healthcare",
    nav: "Healthcare",
    metaTitle: "Healthcare Software — Northline Studio",
    metaDesc:
      "HIPAA-ready portals, patient apps, and clinical dashboards — healthcare software that respects both patients and auditors.",
    eyebrow: "Healthcare",
    title: "HIPAA-ready, human-",
    titleEm: "first",
    subtitle:
      "Patient portals, clinical tools, and health apps where privacy engineering and bedside-manner UX are the same discipline — because a confusing health app is a safety issue.",
    image: u("photo-1576091160399-112ba8d25d1d"),
    matches: ["Healthcare"],
    points: [
      {
        icon: ShieldCheck,
        title: "HIPAA by Architecture",
        desc: "PHI isolation, encryption, access logging, and BAAs — designed in, not declared later.",
      },
      {
        icon: HeartPulse,
        title: "Patient-Grade UX",
        desc: "Interfaces tested with real patients across ages and abilities — WCAG AA as the floor.",
      },
      {
        icon: Plug,
        title: "Clinical Integration",
        desc: "EHR connections, HL7/FHIR interfaces, and the scheduling systems care actually runs on.",
      },
    ],
    stats: [
      { value: "4.9★", label: "store rating on our last patient-facing app" },
      { value: "2.1×", label: "day-30 retention after the Halcyon rebuild" },
      { value: "100%", label: "of healthcare builds passed security review first time" },
    ],
    banner: {
      message: ["A care workflow from you,", "software patients trust from us."],
      title: "Health software should feel like",
      titleEm: "care",
      label: "Talk Healthcare",
    },
  },
  {
    slug: "retail-dtc",
    nav: "Retail & DTC",
    metaTitle: "Retail & DTC — Northline Studio",
    metaDesc:
      "Commerce experiences for retail and direct-to-consumer brands — headless storefronts, replatforms, and the +48% revenue case study.",
    eyebrow: "Retail & DTC",
    title: "Where brand meets",
    titleEm: "buy",
    subtitle:
      "Storefronts, replatforms, and omnichannel plumbing for brands that live on conversion — including the headless rebuild that lifted revenue 48% in one quarter.",
    image: u("photo-1441986300917-64674bd600d8"),
    matches: ["Ecommerce", "Retail"],
    points: [
      {
        icon: ShoppingCart,
        title: "Conversion-First Storefronts",
        desc: "Sub-second product pages and two-step checkouts — mobile revenue finally matching mobile traffic.",
      },
      {
        icon: Store,
        title: "Omnichannel Operations",
        desc: "Inventory, POS, and fulfillment integrated so online and in-store stop fighting.",
      },
      {
        icon: TrendingUp,
        title: "Peak-Season Proof",
        desc: "Load-tested before Black Friday, not during it — campaigns ship without engineers.",
      },
    ],
    stats: [
      { value: "+48%", label: "revenue in one quarter after the Northwind replatform" },
      { value: "62%", label: "faster order processing at Ridgeline Logistics" },
      { value: "98", label: "median Lighthouse score at launch" },
    ],
    banner: {
      message: ["Your conversion funnel from you,", "a stronger quarter from us."],
      title: "Retail margins live in the",
      titleEm: "checkout",
      label: "Talk Commerce",
    },
  },
  {
    slug: "b2b-enterprise",
    nav: "B2B & Enterprise",
    metaTitle: "B2B & Enterprise Software — Northline Studio",
    metaDesc:
      "Developer tools, logistics platforms, and enterprise systems — B2B software with SSO, audit trails, and procurement-friendly delivery.",
    eyebrow: "B2B & Enterprise",
    title: "Built for buyers with",
    titleEm: "checklists",
    subtitle:
      "DevTools, logistics platforms, and internal systems for organizations where the buyer has a security questionnaire and the users have real work to do.",
    image: u("photo-1497366216548-37526070297c"),
    matches: ["DevTools", "Logistics"],
    points: [
      {
        icon: Building2,
        title: "Enterprise Spine",
        desc: "SSO/SAML, SCIM, audit logging, and role models that mirror your customers' org charts.",
      },
      {
        icon: Workflow,
        title: "Operator-Grade Tools",
        desc: "Dense, fast, keyboard-first interfaces for people who use the product eight hours a day.",
      },
      {
        icon: FileCheck2,
        title: "Procurement-Fluent",
        desc: "Security reviews, DPAs, and SOWs handled like the routine they should be.",
      },
    ],
    stats: [
      { value: "11wk", label: "to first paying customer on the Orbital platform" },
      { value: "3.4×", label: "release frequency after the Vantage re-platform" },
      { value: "84%", label: "of clients stay on a Care plan after handover" },
    ],
    banner: {
      message: ["A security questionnaire from you,", "every box ticked from us."],
      title: "Enterprise deals die on",
      titleEm: "details",
      label: "Talk Enterprise",
    },
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
