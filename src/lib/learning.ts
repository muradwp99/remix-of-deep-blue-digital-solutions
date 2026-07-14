import type { ComponentType } from "react";
import { BookOpen, FileDown, ListChecks, MonitorPlay } from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

export type LearningItem = { title: string; desc: string; meta: string };

export type LearningCategory = {
  slug: string;
  nav: string;
  icon: IconType;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  subtitle: string;
  image: string;
  itemCta: string;
  items: LearningItem[];
  note: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=70`;

export const learningCategories: LearningCategory[] = [
  {
    slug: "guides",
    nav: "Guides",
    icon: BookOpen,
    metaTitle: "Guides — Northline Studio",
    metaDesc:
      "Deep-dive playbooks on replatforming, MVP scoping, design systems, and vendor selection — from a team that ships.",
    eyebrow: "Learning · Guides",
    title: "Playbooks with the scars left",
    titleEm: "in",
    subtitle:
      "Long-form, opinionated, and written from shipped work — the guides we wish clients had read before their last vendor.",
    image: u("photo-1456513080510-7bf3a84b82f8"),
    itemCta: "Request the guide",
    items: [
      {
        title: "The Replatforming Playbook",
        desc: "Strangler-pattern migration, phase by phase — traffic splits, parity checks, and the rollback discipline that makes zero-downtime real.",
        meta: "38 pages",
      },
      {
        title: "Scoping an MVP That Can Raise",
        desc: "The cut-line method: how to shrink scope without shrinking the story investors need to see.",
        meta: "24 pages",
      },
      {
        title: "Design Systems That Get Adopted",
        desc: "Tokens, governance, and the adoption mechanics that separate living systems from Figma archives.",
        meta: "31 pages",
      },
      {
        title: "Hiring a Studio Without Getting Burned",
        desc: "The 20 questions that expose a weak vendor in the first call — including the ones that expose us.",
        meta: "18 pages",
      },
      {
        title: "The Enterprise Security Review Survival Kit",
        desc: "Every artifact your vendor-review team will ask for, and how to have them ready before they ask.",
        meta: "27 pages",
      },
      {
        title: "Core Web Vitals Without a Rebuild",
        desc: "The fix sequence that takes most sites to green — images, fonts, scripts, rendering — ranked by ms-per-hour.",
        meta: "22 pages",
      },
    ],
    note: "Guides are free. Ask for one on the contact form and it lands in your inbox the same day — no drip campaign attached.",
  },
  {
    slug: "tutorials",
    nav: "Tutorials",
    icon: ListChecks,
    metaTitle: "Tutorials — Northline Studio",
    metaDesc:
      "Step-by-step how-tos: performance budgets in CI, event taxonomies, accessible components, and staged rollouts.",
    eyebrow: "Learning · Tutorials",
    title: "Step-by-step, no steps",
    titleEm: "skipped",
    subtitle:
      "Practical how-tos your team can follow start to finish — the same internal checklists we run on client work, cleaned up for the public.",
    image: u("photo-1461749280684-dccba630e2f6"),
    itemCta: "Request the tutorial",
    items: [
      {
        title: "Set Up a Performance Budget in CI",
        desc: "Fail the build when the bundle bloats — Lighthouse CI, budgets file, and the thresholds we actually use.",
        meta: "45 min",
      },
      {
        title: "Design an Event Taxonomy That Answers Questions",
        desc: "From 'track everything' chaos to a schema your analysts trust — naming, properties, and QA.",
        meta: "60 min",
      },
      {
        title: "Build an Accessible Modal, Properly",
        desc: "Focus trapping, escape handling, screen-reader announcements — the component everyone gets wrong.",
        meta: "40 min",
      },
      {
        title: "Staged Rollouts with Feature Flags",
        desc: "Ship to 1%, then 10%, then everyone — flag hygiene, kill switches, and cleanup discipline.",
        meta: "50 min",
      },
      {
        title: "Migrate Content Without Losing SEO",
        desc: "Redirect maps, canonical hygiene, and the crawl-verification pass that protects your rankings.",
        meta: "55 min",
      },
      {
        title: "Instrument an Onboarding Funnel",
        desc: "Define activation, wire the events, and build the one dashboard that tells you where users vanish.",
        meta: "45 min",
      },
    ],
    note: "Tutorials are free. Request one via the contact form and we'll send the current version, updated as tools change.",
  },
  {
    slug: "webinars",
    nav: "Webinars",
    icon: MonitorPlay,
    metaTitle: "Webinars — Northline Studio",
    metaDesc:
      "Live sessions and recordings: replatforming Q&As, MVP scoping workshops, and performance teardowns of real sites.",
    eyebrow: "Learning · Webinars",
    title: "Live, unrehearsed, on the",
    titleEm: "record",
    subtitle:
      "Working sessions, not slide karaoke: we tear down real sites, scope real ideas, and answer the questions agencies usually dodge.",
    image: u("photo-1552664730-d307ca884978"),
    itemCta: "Get the recording",
    items: [
      {
        title: "Live Teardown: Your Homepage's First 5 Seconds",
        desc: "We audit attendee-submitted homepages live — hierarchy, message, and speed, no punches pulled.",
        meta: "60 min · monthly",
      },
      {
        title: "Scoping Hour: Bring Your MVP Idea",
        desc: "Open workshop applying the cut-line method to audience ideas. Leave with a smaller, better v1.",
        meta: "90 min · monthly",
      },
      {
        title: "Replatforming Without Downtime: AMA",
        desc: "The Vantage case study walked end to end, then open questions on your migration.",
        meta: "75 min · recorded",
      },
      {
        title: "The Enterprise Deal Checklist",
        desc: "SSO, audit logs, DPAs — what enterprise buyers actually check, with a procurement lead as guest.",
        meta: "60 min · recorded",
      },
    ],
    note: "Registration is free and every session is recorded. Ask via the contact form and we'll send the next dates plus any recording.",
  },
  {
    slug: "templates",
    nav: "Templates",
    icon: FileDown,
    metaTitle: "Templates — Northline Studio",
    metaDesc:
      "Free starter kits: project brief, MVP cut-line worksheet, design token starter, launch checklist, and vendor scorecard.",
    eyebrow: "Learning · Templates",
    title: "Start from our",
    titleEm: "paper",
    subtitle:
      "The working documents we use on real engagements, blanked out for your team — briefs, checklists, and worksheets that skip the blank-page hour.",
    image: u("photo-1497215728101-856f4ea42174"),
    itemCta: "Request the template",
    items: [
      {
        title: "The One-Page Project Brief",
        desc: "The brief we ask every client for — goals, constraints, success metric, and the question most briefs forget.",
        meta: "Doc",
      },
      {
        title: "MVP Cut-Line Worksheet",
        desc: "Rank features by proof-value, draw the line, and defend it — the workshop on one sheet.",
        meta: "Sheet",
      },
      {
        title: "Design Token Starter",
        desc: "Color, type, and spacing scales pre-structured for Tailwind or CSS variables.",
        meta: "Code + Figma",
      },
      {
        title: "Launch-Day Checklist",
        desc: "The 40 checks between 'done' and 'live' — DNS, redirects, monitoring, and rollback rehearsal.",
        meta: "Checklist",
      },
      {
        title: "Vendor Scorecard",
        desc: "Compare agencies on the axes that predict outcomes — including how to score us honestly.",
        meta: "Sheet",
      },
      {
        title: "Incident Postmortem Template",
        desc: "Blameless, timeboxed, action-oriented — the format that ends repeat incidents.",
        meta: "Doc",
      },
    ],
    note: "Templates are free and unbranded inside. Ask for any of them on the contact form — same-day delivery, no mailing list.",
  },
];

export const getLearningCategory = (slug: string) =>
  learningCategories.find((c) => c.slug === slug);
