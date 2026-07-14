/**
 * Read-only client for the Northline Payload CMS REST API.
 *
 * Used inside TanStack Start route loaders (server-side) to hydrate pages
 * with editable content. Every call fails soft — returns [] / null on any
 * error — so a page never hard-fails if the CMS is unreachable; callers
 * fall back to their built-in defaults.
 *
 * Set `VITE_CMS_URL` to point at the deployed Payload instance in prod.
 */
const CMS_URL =
  (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3000";

type FindOpts = {
  limit?: number;
  depth?: number;
  sort?: string;
  where?: Record<string, unknown>;
};

export async function cmsFind<T = Record<string, unknown>>(
  collection: string,
  opts: FindOpts = {},
): Promise<T[]> {
  const params = new URLSearchParams({
    limit: String(opts.limit ?? 100),
    depth: String(opts.depth ?? 1),
  });
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.where) params.set("where", JSON.stringify(opts.where));
  try {
    const res = await fetch(`${CMS_URL}/api/${collection}?${params.toString()}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { docs?: T[] };
    return json.docs ?? [];
  } catch {
    return [];
  }
}

export async function cmsFindOne<T = Record<string, unknown>>(
  collection: string,
  slug: string,
  opts: { depth?: number } = {},
): Promise<T | null> {
  const docs = await cmsFind<T>(collection, {
    depth: opts.depth ?? 2,
    limit: 1,
    where: { slug: { equals: slug } },
  });
  return docs[0] ?? null;
}

export async function cmsGlobal<T = Record<string, unknown>>(
  slug: string,
  depth = 1,
): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/${slug}?depth=${depth}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Resolve a Payload media relation to an absolute URL. */
export function cmsMedia(m: unknown): string | undefined {
  if (!m || typeof m !== "object") return undefined;
  const url = (m as { url?: string }).url;
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${CMS_URL}${url}`;
}

/**
 * Flatten a Payload/Lexical richText value to plain text.
 *
 * Walks the node tree and concatenates every `text` leaf — inline leaves are
 * joined with spaces, block-level nodes (the root's direct children) with
 * newlines. Returns "" on `null`/`undefined` or any unexpected shape, so it is
 * safe to hand a possibly-missing richText field straight to it.
 */
export function lexicalToPlainText(value: unknown): string {
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
 * Convert a Payload/Lexical richText value into the `{ h?, p?, list? }` block
 * shape the blog post renderer consumes. Headings → `{ h }`, paragraphs/quotes →
 * `{ p }`, lists → `{ list }`. Inline formatting (bold/links) is flattened to
 * text — the renderer displays plain block text. Returns [] on anything
 * unexpected, so a missing `content` field is safe.
 */
export function lexicalToBlocks(
  value: unknown,
): { h?: string; p?: string; list?: string[] }[] {
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

/** Shape of a Payload `team` doc (fields used by the site). */
export type CmsTeam = {
  name: string;
  role?: string;
  bio?: string;
  photo?: unknown;
  order?: number;
};

/** Shape of a Payload `projects` doc (fields used by the site). */
export type CmsProject = {
  slug: string;
  title: string;
  client?: string;
  industry?: string;
  year?: string;
  tag?: string;
  summary?: string;
  coverImage?: unknown;
  featured?: boolean;
  challenge?: string;
  approach?: { phase: string; detail: string }[];
  results?: { value: string; label: string; direction?: string }[];
  services?: string[];
  stack?: string[];
  gallery?: { image?: unknown }[];
  testimonial?: { quote?: string; author?: string; role?: string };
};

/** Shape of a Payload `plans` doc (fields used by the site). */
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

/** Shape of a Payload `faqs` doc (fields used by the site). `answer` is Lexical richText — run it through `lexicalToPlainText`. */
export type CmsFaq = {
  question: string;
  answer?: unknown;
  category?: "general" | "pricing" | "process" | "support" | "legal" | null;
  order?: number | null;
};

/** Shape of a Payload `posts` doc (fields used by the site). `content` is Lexical richText; `categories` resolves to objects when fetched with depth >= 1. */
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

/** Shape of the Payload `footer` global (fields used by the site footer). */
export type CmsFooter = {
  blurb?: string | null;
  columns?: { title: string; links?: { label: string; href: string }[] | null }[] | null;
  copyright?: string | null;
  legal?: { label: string; href: string }[] | null;
};
