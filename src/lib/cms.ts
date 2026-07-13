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

/** Deterministic placeholder image for a project without a cover image. */
export const projectPlaceholder = (slug: string) =>
  `https://picsum.photos/seed/nl-${slug}/1200/900`;

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
