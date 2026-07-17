import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveEdits } from "@/lib/edit-bridge";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BannerCTA } from "@/components/banner-cta";
import { posts, postCategories, formatPostDate, type PostCategory } from "@/lib/posts";
import {
  cmsFind,
  cmsFindOne,
  cmsMedia,
  lexicalToPlainText,
  pageStr,
  type CmsPost,
  type SitePageDoc,
} from "@/lib/cms";

type BlogSearch = { cat?: PostCategory };

// The fields the blog list actually renders. `category` is optional because a
// CMS post may be filed under a category that doesn't map to a page filter key.
type BlogListItem = {
  slug: string;
  title: string;
  category?: PostCategory;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
};

const CATEGORY_KEYS = postCategories.map((c) => c.key);

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Resolve a CMS category relationship to one of the page's filter keys, or
// undefined when it doesn't map (so the post shows only under "All posts").
const resolveCategory = (cats: CmsPost["categories"]): PostCategory | undefined => {
  if (!Array.isArray(cats)) return undefined;
  for (const c of cats) {
    if (c && typeof c === "object") {
      const key = (c.slug || c.title || "").toLowerCase();
      if ((CATEGORY_KEYS as string[]).includes(key)) return key as PostCategory;
    }
  }
  return undefined;
};

// The CMS has no read-time field; estimate it from the article body (~200 wpm).
const readTimeFromContent = (content: unknown): string => {
  const words = lexicalToPlainText(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

export const Route = createFileRoute("/blog")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const cat = search.cat;
    return CATEGORY_KEYS.includes(cat as PostCategory) ? { cat: cat as PostCategory } : {};
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", 'Blog — Northline Studio');
    const description = pageStr(d, "meta_description", 'Essays, engineering notes, and studio updates from the Northline team.');
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  // Content-managed: pull posts from the CMS (newest first), map each to the
  // card shape the list renders, and fall back to the built-in posts when empty.
  loader: async (): Promise<{ items: BlogListItem[]; doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "blog");
    const docs = await cmsFind<CmsPost>("posts", { sort: "-publishedAt", depth: 1, limit: 100 });
    if (docs.length) {
      return {
        doc,
        items: docs.map((p) => {
          const slug = p.slug || slugify(p.title);
          return {
            slug,
            title: p.title,
            category: resolveCategory(p.categories),
            date: (p.publishedAt || p.createdAt || "").slice(0, 10),
            readTime: readTimeFromContent(p.content),
            excerpt: p.excerpt || "",
            image: cmsMedia(p.heroImage) || `https://picsum.photos/seed/nl-post-${slug}/1600/900`,
          };
        }),
      };
    }
    return {
      doc,
      items: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        date: p.date,
        readTime: p.readTime,
        excerpt: p.excerpt,
        image: p.image,
      })),
    };
  },
  component: Page,
});

function Page() {
  const { cat } = Route.useSearch();
  const { items, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  const visible = cat ? items.filter((p) => p.category === cat) : items;
  const [featured, ...rest] = visible;

  return (
    <SiteShell theme={pageThemes["blog"]}>
      {/* Masthead + category filter (light editorial) */}
      <section className="block-light">
        <div className="container-page py-24 md:py-28">
          <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
            {s("hero_eyebrow", "Writing")}
          </p>
          <h1
            className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[1.0] md:text-7xl"
            data-reveal
          >
            {s("hero_title", "Notes from the")} <span className="text-gold">{s("hero_title_em", "workshop")}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground" data-reveal>
            {s("hero_subtitle", "What we learned shipping 120+ products — written down while the scars are fresh. No thought leadership, no AI-generated filler.")}
          </p>

          <div className="mt-10 flex flex-wrap gap-2.5" data-reveal>
            <Link
              to="/blog"
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                !cat
                  ? "border-transparent bg-lime text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              All posts
            </Link>
            {postCategories.map((c) => (
              <Link
                key={c.key}
                to="/blog"
                search={{ cat: c.key }}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                  cat === c.key
                    ? "border-transparent bg-lime text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured lead (tint band) */}
      {featured && (
        <section className="block-tint">
          <div className="container-page py-16 md:py-20">
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="group grid overflow-hidden rounded-3xl gradient-card border border-border/60 lift lg:grid-cols-2"
              data-reveal
            >
              <div className="relative min-h-[280px] overflow-hidden">
                <img
                  src={featured.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xs uppercase tracking-[0.28em] text-gold">
                  {postCategories.find((c) => c.key === featured.category)?.label} ·{" "}
                  {formatPostDate(featured.date)}
                </p>
                <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
                <span className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Read the post ({featured.readTime})
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* More writing (light) */}
      {(rest.length > 0 || !featured) && (
        <section className="block-light">
          <div className="container-page py-20 md:py-24">
            {rest.length > 0 ? (
              <div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                data-cards
                data-cards-stagger="0.08"
              >
                {rest.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group glare-card gradient-card lift overflow-hidden rounded-3xl"
                    data-card
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-7">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                        {postCategories.find((c) => c.key === p.category)?.label} · {p.readTime}
                      </p>
                      <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nothing in this category yet — check back soon.
              </p>
            )}
          </div>
        </section>
      )}

      <BannerCTA
        message={["The problems in these posts?", "We solve them for a living."]}
        title={
          <>
            Reading is free. So is the first <span className="text-gold">call</span>.
          </>
        }
        cta={{ label: "Talk to Us", to: "/contact" }}
      />
    </SiteShell>
  );
}
