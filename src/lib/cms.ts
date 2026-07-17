/**
 * Client for the headless WordPress CMS (WP REST API + DynamicForge fields).
 *
 * Drop-in replacement for the previous Payload client: the exported API and
 * the doc shapes it returns are unchanged, so route loaders and components
 * keep consuming "Payload-shaped" docs. Internally every call now hits
 * WordPress and re-assembles those shapes from `meta` fields:
 *
 *   - repeater fields arrive as JSON *strings*  → parsed here
 *   - line-list fields arrive newline-joined     → split here
 *   - flattened groups (banner_*, testimonial_*) → re-nested here
 *   - richtext arrives as HTML strings           → lexicalTo* helpers accept both
 *
 * Every call fails soft — returns [] / null / false on any error — so a page
 * never hard-fails if the CMS is unreachable; callers fall back to their
 * built-in defaults. Full contract: WP-MIGRATION.md.
 *
 * Set `VITE_CMS_URL` to point at the deployed WordPress instance in prod.
 */
const CMS_URL =
  (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://auxtech-v2.local";

type FindOpts = {
  limit?: number;
  depth?: number; // accepted for API compat; WP adapter ignores it
  sort?: string;
  where?: Record<string, unknown>;
};

/* ------------------------------------------------------------------ */
/* WP plumbing                                                         */
/* ------------------------------------------------------------------ */

type WpDoc = {
  id: number;
  slug?: string;
  date?: string;
  menu_order?: number;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  meta?: Record<string, unknown>;
  _embedded?: { "wp:term"?: { taxonomy?: string; name?: string; slug?: string }[][] };
};

async function wpFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}/wp-json${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const m = (d: WpDoc, key: string): string => {
  const v = d.meta?.[key];
  return typeof v === "string" ? v : v == null ? "" : String(v);
};
const mBool = (d: WpDoc, key: string): boolean => {
  const v = d.meta?.[key];
  return v === true || v === 1 || v === "1";
};
/** DynamicForge repeater: JSON string → array of rows. */
const rows = <T,>(d: WpDoc, key: string): T[] => {
  try {
    const parsed = JSON.parse(m(d, key) || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};
/** Line-list field: newline-joined string → string[]. */
const lines = (d: WpDoc, key: string): string[] =>
  m(d, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const wpTitle = (d: WpDoc): string => stripHtml(d.title?.rendered ?? "");

const seoMeta = (d: WpDoc) => ({
  title: m(d, "meta_title") || null,
  description: m(d, "meta_description") || null,
});
const banner = (d: WpDoc) => ({
  messageLine1: m(d, "banner_message_line1") || null,
  messageLine2: m(d, "banner_message_line2") || null,
  title: m(d, "banner_title") || null,
  titleEm: m(d, "banner_title_em") || null,
  titleAfter: m(d, "banner_title_after") || null,
  label: m(d, "banner_label") || null,
});
const catalogDoc = (d: WpDoc) => ({
  slug: d.slug ?? "",
  title: wpTitle(d),
  eyebrow: m(d, "eyebrow") || null,
  heading: m(d, "heading") || null,
  headingEm: m(d, "heading_em") || null,
  headingAfter: m(d, "heading_after") || null,
  subtitle: m(d, "subtitle") || null,
  summary: m(d, "summary") || null,
  image: undefined,
  order: d.menu_order ?? 0,
  banner: banner(d),
  meta: seoMeta(d),
});

/**
 * Collection registry: Payload collection name → WP endpoint + doc mapper.
 * Mappers rebuild the exact Payload doc shapes the site was written against.
 */
const COLLECTIONS: Record<
  string,
  { path: string; embed?: boolean; map: (d: WpDoc) => Record<string, unknown> }
> = {
  projects: {
    path: "/wp/v2/project",
    map: (d) => ({
      slug: d.slug ?? "",
      title: wpTitle(d),
      client: m(d, "client") || null,
      industry: m(d, "industry") || null,
      year: m(d, "year") || null,
      tag: m(d, "tag") || null,
      summary: m(d, "summary") || null,
      coverImage: m(d, "cover_image") || undefined,
      featured: mBool(d, "featured"),
      challenge: m(d, "challenge") || null,
      approach: rows(d, "approach"),
      results: rows(d, "results"),
      services: lines(d, "services_list"),
      stack: lines(d, "stack"),
      gallery: [],
      testimonial: {
        quote: m(d, "testimonial_quote") || null,
        author: m(d, "testimonial_author") || null,
        role: m(d, "testimonial_role") || null,
      },
      meta: seoMeta(d),
    }),
  },
  team: {
    path: "/wp/v2/team",
    map: (d) => ({
      slug: d.slug ?? "",
      name: wpTitle(d),
      role: m(d, "role") || null,
      bio: m(d, "bio") || null,
      photo: undefined,
      order: d.menu_order ?? 0,
    }),
  },
  plans: {
    path: "/wp/v2/plan",
    map: (d) => ({
      name: wpTitle(d),
      price: m(d, "price"),
      period: m(d, "period") || null,
      description: m(d, "description") || null,
      features: lines(d, "features").map((label) => ({ label })),
      ctaLabel: m(d, "cta_label") || null,
      ctaUrl: m(d, "cta_url") || null,
      featured: mBool(d, "featured"),
      order: d.menu_order ?? 0,
    }),
  },
  faqs: {
    path: "/wp/v2/faq",
    map: (d) => ({
      question: wpTitle(d),
      answer: m(d, "answer"), // HTML string — lexicalToPlainText handles it
      category: m(d, "category") || null,
      order: d.menu_order ?? 0,
    }),
  },
  posts: {
    path: "/wp/v2/posts",
    embed: true,
    map: (d) => ({
      slug: d.slug ?? "",
      title: wpTitle(d),
      excerpt: stripHtml(d.excerpt?.rendered ?? "") || null,
      heroImage: undefined,
      content: d.content?.rendered ?? "", // HTML string — lexicalTo* handle it
      categories: (d._embedded?.["wp:term"] ?? [])
        .flat()
        .filter((t) => t.taxonomy === "category")
        .map((t) => ({ title: t.name ?? "", slug: t.slug ?? null })),
      publishedAt: d.date ?? null,
      createdAt: d.date ?? null,
      meta: seoMeta(d),
    }),
  },
  jobs: {
    path: "/wp/v2/job",
    map: (d) => ({
      slug: d.slug ?? "",
      title: wpTitle(d),
      department: m(d, "department") || null,
      type: m(d, "type") || null,
      location: m(d, "location") || null,
      salary: m(d, "salary") || null,
      tags: lines(d, "job_tags"),
      applyUrl: m(d, "apply_url") || null,
      open: mBool(d, "open"),
      createdAt: d.date ?? null,
    }),
  },
  learning: {
    path: "/wp/v2/learning",
    map: (d) => ({
      slug: d.slug ?? "",
      title: wpTitle(d),
      type: m(d, "type") || null,
      summary: m(d, "summary") || null,
      format: m(d, "format") || null,
      order: d.menu_order ?? 0,
    }),
  },
  services: {
    path: "/wp/v2/service",
    map: (d) => ({
      ...catalogDoc(d),
      features: rows(d, "features"),
      steps: rows(d, "steps"),
      benefits: rows(d, "benefits"),
      faqs: rows(d, "faqs"),
      icon: m(d, "icon") || null,
    }),
  },
  solutions: {
    path: "/wp/v2/solution",
    map: (d) => ({
      ...catalogDoc(d),
      features: rows(d, "features"),
      steps: rows(d, "steps"),
      benefits: rows(d, "benefits"),
      faqs: rows(d, "faqs"),
      icon: m(d, "icon") || null,
    }),
  },
  industries: {
    path: "/wp/v2/industry",
    map: (d) => ({
      ...catalogDoc(d),
      matches: lines(d, "matches"),
      points: rows(d, "points"),
      stats: rows(d, "stats"),
      icon: m(d, "icon") || null,
    }),
  },
  tools: {
    path: "/wp/v2/tool",
    map: (d) => ({
      ...catalogDoc(d),
      checks: lines(d, "checks"),
    }),
  },
  homepage: {
    path: "/wp/v2/sitepage",
    map: (d) => ({
      slug: d.slug ?? "",
      sectionOrder: lines(d, "section_order"),
      hero: {
        trustedLine: m(d, "hero_trusted_line"),
        headline: m(d, "hero_headline"),
        subheadline: m(d, "hero_subheadline"),
        ctaLabel: m(d, "hero_cta_label"),
        ctaHref: m(d, "hero_cta_href"),
        ctaNote: m(d, "hero_cta_note"),
        cards: rows(d, "hero_cards"),
      },
      clients: { label: m(d, "clients_label"), names: lines(d, "clients_names") },
      capabilities: {
        eyebrow: m(d, "capabilities_eyebrow"),
        heading: m(d, "capabilities_heading"),
        items: rows(d, "capabilities_items"),
      },
      stats: rows(d, "stats"),
      solutions: {
        eyebrow: m(d, "solutions_eyebrow"),
        heading: m(d, "solutions_heading"),
        items: rows(d, "solutions_items"),
      },
      process: {
        eyebrow: m(d, "process_eyebrow"),
        heading: m(d, "process_heading"),
        intro: m(d, "process_intro"),
        items: rows(d, "process_items"),
      },
      work: {
        eyebrow: m(d, "work_eyebrow"),
        heading: m(d, "work_heading"),
        items: rows(d, "work_items"),
      },
      kickoff: {
        eyebrow: m(d, "kickoff_eyebrow"),
        heading: m(d, "kickoff_heading"),
        items: rows(d, "kickoff_items"),
      },
      why: {
        eyebrow: m(d, "why_eyebrow"),
        heading: m(d, "why_heading"),
        items: rows(d, "why_items"),
      },
      compare: {
        eyebrow: m(d, "compare_eyebrow"),
        heading: m(d, "compare_heading"),
        typicalTitle: m(d, "compare_typical_title"),
        northlineTitle: m(d, "compare_northline_title"),
        typical: lines(d, "compare_typical"),
        northline: lines(d, "compare_northline"),
      },
      testimonialsSection: {
        eyebrow: m(d, "testimonials_eyebrow"),
        heading: m(d, "testimonials_heading"),
      },
      pricing: {
        eyebrow: m(d, "pricing_eyebrow"),
        heading: m(d, "pricing_heading"),
        tiers: rows<{ t: string; d: string; p: string; featured?: unknown }>(d, "pricing_tiers").map(
          (t, i) => ({ ...t, featured: t.featured === "1" || t.featured === 1 || i === 1 }),
        ),
        tierFeatures: lines(d, "pricing_tier_features"),
      },
      faq: {
        eyebrow: m(d, "faq_eyebrow"),
        heading: m(d, "faq_heading"),
        items: rows(d, "faq_items"),
      },
      audit: {
        eyebrow: m(d, "audit_eyebrow"),
        heading: m(d, "audit_heading"),
        text: m(d, "audit_text"),
        bullets: lines(d, "audit_bullets"),
      },
      cta: {
        eyebrow: m(d, "cta_eyebrow"),
        heading: m(d, "cta_heading"),
        text: m(d, "cta_text"),
        primaryLabel: m(d, "cta_primary_label"),
        secondaryLabel: m(d, "cta_secondary_label"),
      },
    }),
  },
  testimonials: {
    path: "/wp/v2/testimonial",
    map: (d) => ({
      quote: m(d, "quote") || null,
      author: m(d, "author") || wpTitle(d),
      role: m(d, "role") || null,
      company: m(d, "company") || null,
      rating: Number(d.meta?.rating ?? 5) || 5,
      featured: mBool(d, "featured"),
    }),
  },
  resources: {
    path: "/wp/v2/resource",
    map: (d) => ({
      slug: d.slug ?? "",
      title: wpTitle(d),
      summary: m(d, "summary") || null,
      type: m(d, "type") || null,
      url: m(d, "url") || null,
      meta: seoMeta(d),
    }),
  },
  pages: {
    path: "/wp/v2/pages",
    map: (d) => {
      let layout: Record<string, unknown>[] = [];
      try {
        const parsed = JSON.parse(m(d, "layout_json") || "[]");
        if (Array.isArray(parsed)) layout = parsed as Record<string, unknown>[];
      } catch {
        /* fall through to empty layout */
      }
      return {
        slug: d.slug ?? "",
        title: wpTitle(d),
        layout,
        meta: seoMeta(d),
      };
    },
  },
};

/** Translate a Payload-style sort key to WP query params (or a JS comparator). */
function sortParams(sort?: string): {
  query: string;
  jsSort?: (a: Record<string, unknown>, b: Record<string, unknown>) => number;
} {
  switch (sort) {
    case "order":
      return { query: "&orderby=menu_order&order=asc" };
    case "createdAt":
      return { query: "&orderby=date&order=asc" };
    case "-publishedAt":
    case "-createdAt":
      return { query: "&orderby=date&order=desc" };
    case "-featured":
      return {
        query: "",
        jsSort: (a, b) => Number(b.featured === true) - Number(a.featured === true),
      };
    default:
      return { query: "" };
  }
}

/* ------------------------------------------------------------------ */
/* Public API (unchanged surface)                                      */
/* ------------------------------------------------------------------ */

export async function cmsFind<T = Record<string, unknown>>(
  collection: string,
  opts: FindOpts = {},
): Promise<T[]> {
  // The Payload form-builder is gone; the contact page just needs a truthy id.
  if (collection === "forms") return [{ id: "contact" } as T];

  const def = COLLECTIONS[collection];
  if (!def) return [];

  const limit = Math.min(opts.limit ?? 100, 100);
  const { query, jsSort } = sortParams(opts.sort);
  const embed = def.embed ? "&_embed=wp:term" : "";

  // slug equality is the one `where` WP can answer server-side.
  const where = opts.where ?? {};
  const slugEq = (where.slug as { equals?: string } | undefined)?.equals;
  const slugParam = slugEq ? `&slug=${encodeURIComponent(slugEq)}` : "";

  const docs = await wpFetch<WpDoc[]>(
    `${def.path}?per_page=${limit}${query}${embed}${slugParam}`,
  );
  if (!Array.isArray(docs)) return [];

  let mapped = docs.map(def.map);

  // Remaining `where` filters (equals only — all the site uses) run JS-side.
  for (const [field, cond] of Object.entries(where)) {
    if (field === "slug") continue;
    const eq = (cond as { equals?: unknown } | undefined)?.equals;
    if (eq !== undefined) mapped = mapped.filter((doc) => doc[field] === eq);
  }
  if (jsSort) mapped = [...mapped].sort(jsSort);

  return mapped as T[];
}

export async function cmsFindOne<T = Record<string, unknown>>(
  collection: string,
  slug: string,
  opts: { depth?: number } = {},
): Promise<T | null> {
  const docs = await cmsFind<T>(collection, {
    depth: opts.depth,
    limit: 1,
    where: { slug: { equals: slug } },
  });
  return docs[0] ?? null;
}

export async function cmsGlobal<T = Record<string, unknown>>(
  slug: string,
  _depth = 1,
): Promise<T | null> {
  const key = slug.replace(/-/g, "_"); // site-settings → site_settings
  return wpFetch<T>(`/auxtech/v1/globals/${key}`);
}

/**
 * Submit the contact form to WordPress (`/auxtech/v1/contact`, stored as a
 * `submission` post by the Auxtech Headless Bridge mu-plugin). Fails soft —
 * returns `false` on any non-ok response or thrown error — so callers can
 * always fall through to their success UX even if the CMS is unreachable.
 */
export async function cmsSubmitForm(
  _formId: string | number,
  data: Record<string, string>,
): Promise<boolean> {
  try {
    const res = await fetch(`${CMS_URL}/wp-json/auxtech/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Resolve a media value ({url} object or plain string) to an absolute URL. */
export function cmsMedia(media: unknown): string | undefined {
  if (!media) return undefined;
  const url =
    typeof media === "string" ? media : (media as { url?: string }).url;
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${CMS_URL}${url}`;
}

/* ------------------------------------------------------------------ */
/* Richtext helpers — accept WP HTML strings AND legacy Lexical trees  */
/* ------------------------------------------------------------------ */

/** Decode the handful of HTML entities our own generated markup contains. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Flatten a richtext value to plain text. Accepts a WP HTML string or a
 * legacy Payload/Lexical tree. Returns "" on anything unexpected.
 */
export function lexicalToPlainText(value: unknown): string {
  if (typeof value === "string") return stripHtml(value);
  if (!value || typeof value !== "object") return "";
  const root = (value as { root?: unknown }).root;
  if (!root || typeof root !== "object") return "";

  const walk = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const n = node as { text?: unknown; children?: unknown; type?: unknown };
    if (typeof n.text === "string") return n.text;
    if (Array.isArray(n.children)) {
      const parts = n.children.map(walk).filter(Boolean);
      return parts.join(n.type === "root" ? "\n" : " ");
    }
    return "";
  };

  try {
    return walk(root).replace(/\n{2,}/g, "\n").trim();
  } catch {
    return "";
  }
}

/**
 * Convert a richtext value into the `{ h?, p?, list? }` block shape the blog
 * renderer consumes. Accepts a WP HTML string (parsed with a light regex —
 * fine for our own generated markup) or a legacy Lexical tree. Returns [] on
 * anything unexpected.
 */
export function lexicalToBlocks(
  value: unknown,
): { h?: string; p?: string; list?: string[] }[] {
  if (typeof value === "string") {
    const blocks: { h?: string; p?: string; list?: string[] }[] = [];
    const re =
      /<(h[1-6]|p|ul|ol|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(value))) {
      const tag = match[1].toLowerCase();
      const inner = match[2];
      if (tag.startsWith("h")) {
        const h = stripHtml(inner);
        if (h) blocks.push({ h });
      } else if (tag === "ul" || tag === "ol") {
        const list = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
          .map((li) => stripHtml(li[1]))
          .filter(Boolean);
        if (list.length) blocks.push({ list });
      } else {
        const p = stripHtml(inner);
        if (p) blocks.push({ p });
      }
    }
    return blocks;
  }

  if (!value || typeof value !== "object") return [];
  const root = (value as { root?: unknown }).root;
  if (!root || typeof root !== "object") return [];
  const children = (root as { children?: unknown }).children;
  if (!Array.isArray(children)) return [];

  const textOf = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const n = node as { text?: unknown; children?: unknown };
    if (typeof n.text === "string") return n.text;
    if (Array.isArray(n.children)) return n.children.map(textOf).join("");
    return "";
  };

  const blocks: { h?: string; p?: string; list?: string[] }[] = [];
  for (const node of children) {
    if (!node || typeof node !== "object") continue;
    const type = (node as { type?: unknown }).type;
    if (type === "heading") {
      const h = textOf(node).trim();
      if (h) blocks.push({ h });
    } else if (type === "list") {
      const kids = (node as { children?: unknown }).children;
      const list = (Array.isArray(kids) ? kids : [])
        .map(textOf)
        .map((s) => s.trim())
        .filter(Boolean);
      if (list.length) blocks.push({ list });
    } else if (type === "paragraph" || type === "quote") {
      const p = textOf(node).trim();
      if (p) blocks.push({ p });
    }
  }
  return blocks;
}

/** Deterministic placeholder image for a project without a cover image. */
export const projectPlaceholder = (slug: string) =>
  `https://picsum.photos/seed/nl-${slug}/1200/900`;

/* ------------------------------------------------------------------ */
/* Doc shapes (unchanged — the adapter reconstructs these)             */
/* ------------------------------------------------------------------ */

/** Shape of a `team` doc (fields used by the site). */
export type CmsTeam = {
  name: string;
  role?: string | null;
  bio?: string | null;
  photo?: unknown;
  order?: number;
};

/** Shape of a `projects` doc (fields used by the site). */
export type CmsProject = {
  slug: string;
  title: string;
  client?: string | null;
  industry?: string | null;
  year?: string | null;
  tag?: string | null;
  summary?: string | null;
  coverImage?: unknown;
  featured?: boolean;
  challenge?: string | null;
  approach?: { phase: string; detail: string }[];
  results?: { value: string; label: string; direction?: string }[];
  services?: string[];
  stack?: string[];
  gallery?: { image?: unknown }[];
  testimonial?: { quote?: string | null; author?: string | null; role?: string | null };
};

/** Shape of a `plans` doc (fields used by the site). */
export type CmsPlan = {
  name: string;
  price: string;
  period?: string | null;
  description?: string | null;
  features?: { label: string }[] | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

/** Shape of a `faqs` doc (fields used by the site). `answer` is an HTML string — run it through `lexicalToPlainText`. */
export type CmsFaq = {
  question: string;
  answer?: unknown;
  category?: "general" | "pricing" | "process" | "support" | "legal" | null;
  order?: number | null;
};

/** Shape of a `posts` doc (fields used by the site). `content` is an HTML string; `categories` come resolved as objects. */
export type CmsPost = {
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  heroImage?: unknown;
  content?: unknown;
  categories?: (number | { title?: string; slug?: string | null })[] | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

/** Shape of the `footer` global (fields used by the site footer). */
export type CmsFooter = {
  blurb?: string | null;
  columns?: { title: string; links?: { label: string; href: string }[] | null }[] | null;
  copyright?: string | null;
  legal?: { label: string; href: string }[] | null;
};
