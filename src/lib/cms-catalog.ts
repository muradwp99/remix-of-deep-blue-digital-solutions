/**
 * CMS → catalog mappers for the bespoke detail pages (services, solutions,
 * industries, tools, learning).
 *
 * SERIALIZATION CONTRACT (important):
 * TanStack Start dehydrates route `loader` return values to the client, so a
 * loader must return ONLY serializable data — never React components. The
 * source shapes in `src/lib/subpages.ts` / `industries.ts` carry Lucide icons
 * as live COMPONENTS, which would blank the page on hydration. So the flow is:
 *
 *   loader:    CMS doc → `cmsTo*DTO()` → a plain DTO (icons as NAME strings)
 *   component: DTO      → `hydrate*()`  → the shape the JSX reads (icon COMPONENTS)
 *
 * `hydrate*` runs during render (server + client), never through serialization,
 * so resolving icon names to components there is safe. `Tool` and `LearningItem`
 * carry no component icons, so they need no DTO.
 *
 * CMS content wins field-by-field; anything the CMS lacks (notably images, which
 * are not seeded) falls back to the built-in value so a page never renders a
 * broken asset.
 */
import type { ComponentType } from "react";
import {
  Accessibility,
  Activity,
  AppWindow,
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
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
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Globe,
  HeartPulse,
  LayoutTemplate,
  LifeBuoy,
  LineChart,
  LockKeyhole,
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
  ShoppingBag,
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
import { cmsMedia } from "./cms";
import type { Subpage, SubpageKind } from "./subpages";
import type { Industry } from "./industries";
import type { Tool } from "./tools";
import type { LearningItem } from "./learning";

type IconType = ComponentType<{ className?: string }>;

/**
 * Every Lucide icon referenced by the catalog source files. Kept as an explicit
 * map (not a dynamic `import * as Icons`) so the bundle only ships these icons.
 */
const ICONS: Record<string, IconType> = {
  Accessibility,
  Activity,
  AppWindow,
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
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
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Globe,
  HeartPulse,
  LayoutTemplate,
  LifeBuoy,
  LineChart,
  LockKeyhole,
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
  ShoppingBag,
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
};

/** Resolve a Lucide icon name to its component; unknown names fall back to Sparkles. */
export const iconFromName = (name?: string | null): IconType =>
  (name && ICONS[name]) || Sparkles;

/* ------------------------------------------------------------------ */
/* CMS doc shapes (fields used by the site — mirror payload-types.ts) */
/* ------------------------------------------------------------------ */

type CmsArrayFeature = { icon?: string | null; title: string; desc: string };
type CmsBanner = {
  messageLine1?: string | null;
  messageLine2?: string | null;
  title?: string | null;
  titleEm?: string | null;
  titleAfter?: string | null;
  label?: string | null;
};
type CmsMeta = { title?: string | null; description?: string | null };

/** A Payload `services` or `solutions` doc (same schema → same shape). */
export type CmsSubpage = {
  slug: string;
  title: string;
  eyebrow?: string | null;
  heading?: string | null;
  headingEm?: string | null;
  headingAfter?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  image?: unknown;
  features?: CmsArrayFeature[] | null;
  steps?: { title: string; desc: string }[] | null;
  benefits?: { title: string; desc: string }[] | null;
  faqs?: { question: string; answer: string }[] | null;
  banner?: CmsBanner | null;
  meta?: CmsMeta | null;
  sectionOrder?: string[] | null;
};

/** A Payload `industries` doc. */
export type CmsIndustry = {
  slug: string;
  title: string;
  eyebrow?: string | null;
  heading?: string | null;
  headingEm?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  image?: unknown;
  matches?: string[] | null;
  points?: CmsArrayFeature[] | null;
  stats?: { value: string; label: string }[] | null;
  banner?: CmsBanner | null;
  meta?: CmsMeta | null;
};

/** A Payload `tools` doc. */
export type CmsTool = {
  slug: string;
  title: string;
  eyebrow?: string | null;
  heading?: string | null;
  headingEm?: string | null;
  headingAfter?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  image?: unknown;
  checks?: (string | null)[] | null;
  meta?: CmsMeta | null;
};

/** A Payload `learning` doc (an individual item). */
export type CmsLearning = {
  slug: string;
  title: string;
  summary?: string | null;
  format?: string | null;
  type?: string | null;
};

/* ------------------------------------------------------------------ */
/* Serializable DTOs (loader return shape — icons are NAME strings)   */
/* ------------------------------------------------------------------ */

/** Serializable form of `Subpage` (icons as names). Safe to return from a loader. */
export type SubpageDTO = {
  slug: string;
  kind: SubpageKind;
  nav: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  titleAfter?: string;
  subtitle: string;
  image: string;
  features: { icon: string; title: string; desc: string }[];
  steps: { t: string; d: string }[];
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  banner: {
    message: [string, string];
    title: string;
    titleEm: string;
    titleAfter?: string;
    label: string;
  };
  /** Section keys the page renders, in order. Empty = the coded order. */
  sectionOrder: string[];
};

/** Serializable form of `Industry` (icons as names). Safe to return from a loader. */
export type IndustryDTO = {
  slug: string;
  nav: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  subtitle: string;
  image: string;
  matches: string[];
  points: { icon: string; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  banner: { message: [string, string]; title: string; titleEm: string; label: string };
};

const bannerMessage = (b?: CmsBanner | null): [string, string] => [
  b?.messageLine1 ?? "",
  b?.messageLine2 ?? "",
];

/* ------------------------------------------------------------------ */
/* CMS doc → serializable DTO (run in loaders)                        */
/* ------------------------------------------------------------------ */

export function cmsToSubpageDTO(d: CmsSubpage, kind: SubpageKind): SubpageDTO {
  return {
    slug: d.slug,
    kind,
    nav: d.title ?? "",
    metaTitle: d.meta?.title ?? "",
    metaDesc: d.meta?.description ?? d.summary ?? "",
    eyebrow: d.eyebrow ?? "",
    title: d.heading ?? "",
    titleEm: d.headingEm ?? "",
    titleAfter: d.headingAfter ?? undefined,
    subtitle: d.subtitle ?? "",
    image: cmsMedia(d.image) ?? "",
    features: (d.features ?? []).map((f) => ({
      icon: f.icon ?? "",
      title: f.title,
      desc: f.desc,
    })),
    steps: (d.steps ?? []).map((s) => ({ t: s.title, d: s.desc })),
    benefits: (d.benefits ?? []).map((b) => ({ title: b.title, desc: b.desc })),
    faqs: (d.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
    banner: {
      message: bannerMessage(d.banner),
      title: d.banner?.title ?? "",
      titleEm: d.banner?.titleEm ?? "",
      titleAfter: d.banner?.titleAfter ?? undefined,
      label: d.banner?.label ?? "",
    },
    sectionOrder: d.sectionOrder ?? [],
  };
}

export function cmsToIndustryDTO(d: CmsIndustry): IndustryDTO {
  return {
    slug: d.slug,
    nav: d.title ?? "",
    metaTitle: d.meta?.title ?? "",
    metaDesc: d.meta?.description ?? d.summary ?? "",
    eyebrow: d.eyebrow ?? "",
    title: d.heading ?? "",
    titleEm: d.headingEm ?? "",
    subtitle: d.subtitle ?? "",
    image: cmsMedia(d.image) ?? "",
    matches: d.matches ?? [],
    points: (d.points ?? []).map((p) => ({
      icon: p.icon ?? "",
      title: p.title,
      desc: p.desc,
    })),
    stats: d.stats ?? [],
    banner: {
      message: bannerMessage(d.banner),
      title: d.banner?.title ?? "",
      titleEm: d.banner?.titleEm ?? "",
      label: d.banner?.label ?? "",
    },
  };
}

/* ------------------------------------------------------------------ */
/* DTO → render shape (run in components; resolves icons, fills gaps)  */
/* ------------------------------------------------------------------ */

/**
 * Render a `SubpageDTO` with no local fallback.
 *
 * The coded registry in `subpages.ts` only knows the pages that shipped with
 * the site. A service or solution added in the CMS afterwards has no entry
 * there, so `hydrateSubpage` has nothing to hydrate against — this fills the
 * gaps from the doc itself instead, which is what makes a brand-new catalog
 * item render at all.
 */
export function subpageFromDTO(dto: SubpageDTO): Subpage {
  return {
    slug: dto.slug,
    kind: dto.kind,
    nav: dto.nav,
    metaTitle: dto.metaTitle || `${dto.nav} — Auxtech`,
    metaDesc: dto.metaDesc,
    eyebrow: dto.eyebrow,
    title: dto.title || dto.nav,
    titleEm: dto.titleEm,
    titleAfter: dto.titleAfter,
    subtitle: dto.subtitle,
    image: dto.image,
    features: dto.features.map((f) => ({
      icon: iconFromName(f.icon),
      title: f.title,
      desc: f.desc,
    })),
    steps: dto.steps,
    benefits: dto.benefits,
    faqs: dto.faqs,
    banner: dto.banner,
  };
}

/** `subpageFromDTO`'s counterpart for industries. */
export function industryFromDTO(dto: IndustryDTO): Industry {
  return {
    slug: dto.slug,
    nav: dto.nav,
    metaTitle: dto.metaTitle || `${dto.nav} — Auxtech`,
    metaDesc: dto.metaDesc,
    eyebrow: dto.eyebrow,
    title: dto.title || dto.nav,
    titleEm: dto.titleEm,
    subtitle: dto.subtitle,
    image: dto.image,
    matches: dto.matches,
    points: dto.points.map((p) => ({
      icon: iconFromName(p.icon),
      title: p.title,
      desc: p.desc,
    })),
    stats: dto.stats,
    banner: dto.banner,
  };
}

/** Hydrate a `SubpageDTO` into a `Subpage`, filling empty fields from `fb`. */
export function hydrateSubpage(dto: SubpageDTO, fb: Subpage): Subpage {
  return {
    slug: dto.slug || fb.slug,
    kind: dto.kind,
    nav: dto.nav || fb.nav,
    metaTitle: dto.metaTitle || fb.metaTitle,
    metaDesc: dto.metaDesc || fb.metaDesc,
    eyebrow: dto.eyebrow || fb.eyebrow,
    title: dto.title || fb.title,
    titleEm: dto.titleEm || fb.titleEm,
    titleAfter: dto.titleAfter ?? fb.titleAfter,
    subtitle: dto.subtitle || fb.subtitle,
    image: dto.image || fb.image,
    features: dto.features.length
      ? dto.features.map((f) => ({ icon: iconFromName(f.icon), title: f.title, desc: f.desc }))
      : fb.features,
    steps: dto.steps.length ? dto.steps : fb.steps,
    benefits: dto.benefits.length ? dto.benefits : fb.benefits,
    faqs: dto.faqs.length ? dto.faqs : fb.faqs,
    banner: dto.banner.title || dto.banner.label ? dto.banner : fb.banner,
  };
}

/** Hydrate an `IndustryDTO` into an `Industry`, filling empty fields from `fb`. */
export function hydrateIndustry(dto: IndustryDTO, fb: Industry): Industry {
  return {
    slug: dto.slug || fb.slug,
    nav: dto.nav || fb.nav,
    metaTitle: dto.metaTitle || fb.metaTitle,
    metaDesc: dto.metaDesc || fb.metaDesc,
    eyebrow: dto.eyebrow || fb.eyebrow,
    title: dto.title || fb.title,
    titleEm: dto.titleEm || fb.titleEm,
    subtitle: dto.subtitle || fb.subtitle,
    image: dto.image || fb.image,
    matches: dto.matches.length ? dto.matches : fb.matches,
    points: dto.points.length
      ? dto.points.map((p) => ({ icon: iconFromName(p.icon), title: p.title, desc: p.desc }))
      : fb.points,
    stats: dto.stats.length ? dto.stats : fb.stats,
    banner: dto.banner.title || dto.banner.label ? dto.banner : fb.banner,
  };
}

/* ------------------------------------------------------------------ */
/* Tool + Learning — already serializable (no component icons)        */
/* ------------------------------------------------------------------ */

/** Map a CMS tools doc to the `Tool` shape (serializable — safe in a loader). */
export function cmsToTool(d: CmsTool, fallback?: Tool): Tool {
  return {
    slug: d.slug,
    nav: d.title || fallback?.nav || "",
    metaTitle: d.meta?.title || fallback?.metaTitle || `${d.title} — Auxtech`,
    metaDesc: d.meta?.description || d.summary || fallback?.metaDesc || "",
    eyebrow: d.eyebrow || fallback?.eyebrow || "",
    title: d.heading || fallback?.title || d.title,
    titleEm: d.headingEm || fallback?.titleEm || "",
    titleAfter: d.headingAfter || fallback?.titleAfter,
    subtitle: d.subtitle || fallback?.subtitle || "",
    image: cmsMedia(d.image) || fallback?.image || "",
    checks: d.checks?.length ? (d.checks.filter(Boolean) as string[]) : fallback?.checks ?? [],
  };
}

/** Map CMS learning docs (already filtered by type) to the `LearningItem[]` shape. */
export function cmsToLearningItems(docs: CmsLearning[]): LearningItem[] {
  return docs.map((d) => ({
    title: d.title,
    desc: d.summary || "",
    meta: d.format || "",
  }));
}
