import { shareImageMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BannerCTA } from "@/components/banner-cta";
import {
  posts,
  getPost,
  postCategories,
  formatPostDate,
  type Post,
  type PostCategory,
  type PostBlock,
} from "@/lib/posts";
import {
  cmsFind,
  cmsFindOne,
  cmsMedia,
  projectPlaceholder,
  lexicalToBlocks,
  lexicalToPlainText,
  type CmsPost,
} from "@/lib/cms";

type MoreCard = { slug: string; title: string; category: PostCategory; readTime: string };

// CMS category titles → the site's fixed post-category keys.
const CATEGORY_KEY: Record<string, PostCategory> = {
  engineering: "engineering",
  design: "design",
  news: "news",
  product: "news",
  growth: "news",
};

const catKeyFromCms = (doc: CmsPost): PostCategory => {
  const first = (doc.categories || []).find((c) => c && typeof c === "object") as
    { title?: string } | undefined;
  return CATEGORY_KEY[(first?.title || "").toLowerCase()] ?? "news";
};

const estimateReadTime = (blocks: PostBlock[]): string => {
  const words = blocks.reduce(
    (n, b) =>
      n +
      (b.h ? b.h.split(/\s+/).length : 0) +
      (b.p ? b.p.split(/\s+/).length : 0) +
      (b.list ? b.list.join(" ").split(/\s+/).length : 0),
    0,
  );
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const cmsToPost = (doc: CmsPost, slug: string): Post => {
  const body = lexicalToBlocks(doc.content);
  return {
    slug,
    title: doc.title,
    category: catKeyFromCms(doc),
    date: (doc.publishedAt || doc.createdAt || "").slice(0, 10),
    readTime: estimateReadTime(body),
    excerpt: doc.excerpt || lexicalToPlainText(doc.content).slice(0, 160),
    image: cmsMedia(doc.heroImage) || projectPlaceholder(slug),
    body,
  };
};

const cmsToCard = (doc: CmsPost): MoreCard => ({
  slug: doc.slug || "",
  title: doc.title,
  category: catKeyFromCms(doc),
  readTime: estimateReadTime(lexicalToBlocks(doc.content)),
});

export const Route = createFileRoute("/blog_/$slug")({
  // CMS-first: pull the post + a couple of "keep reading" cards from the CMS,
  // fall back to the built-in posts if the CMS is unreachable or the slug is
  // only in the built-in set.
  loader: async ({ params }): Promise<{ post: Post | null; more: MoreCard[] }> => {
    const doc = await cmsFindOne<CmsPost>("posts", params.slug, { depth: 2 });
    if (doc) {
      const others = await cmsFind<CmsPost>("posts", { sort: "-publishedAt", limit: 6, depth: 1 });
      const more = others
        .filter((o) => (o.slug || "") !== params.slug)
        .slice(0, 2)
        .map(cmsToCard);
      return { post: cmsToPost(doc, params.slug), more };
    }
    const p = getPost(params.slug);
    if (!p) return { post: null, more: [] };
    const related = posts.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 2);
    const fill = posts
      .filter((x) => x.slug !== p.slug && !related.includes(x))
      .slice(0, 2 - related.length);
    const more = [...related, ...fill].map((x) => ({
      slug: x.slug,
      title: x.title,
      category: x.category,
      readTime: x.readTime,
    }));
    return { post: p, more };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} — Auxtech` : "Blog — Auxtech";
    const description = post?.excerpt ?? "Writing from the Auxtech team.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        // An article shares as itself, not as the brand card.
        ...shareImageMeta(post?.image),
      ],
    };
  },
  component: Page,
});

function Page() {
  const { post, more } = Route.useLoaderData();

  if (!post) {
    return (
      <SiteShell theme={pageThemes["blog"]}>
        <section className="block-light">
          <div className="container-page py-36">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] font-semibold">
              That post doesn't exist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              It may have moved. Everything we've published lives on the blog.
            </p>
            <Link
              to="/blog"
              data-magnetic
              className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to the blog
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  const catLabel = postCategories.find((c) => c.key === post.category)?.label;

  return (
    <SiteShell theme={pageThemes["blog"]}>
      {/* Article (light editorial) */}
      <article className="block-light">
        <div className="container-page py-20 md:py-24">
          <div className="mx-auto max-w-[68ch]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All posts
            </Link>
            <p className="mt-8 text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {catLabel} · {formatPostDate(post.date)} · {post.readTime}
            </p>
            <h1
              className="mt-5 font-display text-4xl md:text-6xl leading-[1.05] font-semibold"
              data-reveal
            >
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground" data-reveal>
              {post.excerpt}
            </p>
          </div>

          <figure
            className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-black/10"
            data-reveal
          >
            <img
              src={post.image}
              alt=""
              className="aspect-[16/9] w-full object-cover"
              data-parallax-img
            />
          </figure>

          <div className="mx-auto mt-14 max-w-[68ch] space-y-8">
            {post.body.map((block, i) => (
              <div key={i} data-reveal>
                {block.h && (
                  <h2 className="pt-4 font-display text-2xl md:text-3xl font-semibold">
                    {block.h}
                  </h2>
                )}
                {block.p && (
                  <p className="mt-3 text-[17px] leading-relaxed text-foreground/85">{block.p}</p>
                )}
                {block.list && (
                  <ul className="mt-3 space-y-3">
                    {block.list.map((item) => (
                      <li
                        key={item.slice(0, 32)}
                        className="flex gap-3 text-[17px] leading-relaxed text-foreground/85"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="border-t border-border pt-8" data-reveal>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All posts
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related (tint band) */}
      {more.length > 0 && (
        <section className="block-tint">
          <div className="container-page py-16 md:py-20" data-reveal-group>
            <div className="mx-auto max-w-4xl">
              <p className="mb-6 text-xs uppercase tracking-[0.28em] text-gold" data-reveal-child>
                Keep reading
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {more.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group glare-card gradient-card lift rounded-2xl p-7"
                    data-reveal-child
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                      {postCategories.find((c) => c.key === p.category)?.label} · {p.readTime}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                      {p.title}
                    </h3>
                    <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                      Read{" "}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <BannerCTA
        message={["A problem like this one?", "We've probably shipped through it."]}
        title={
          <>
            Less reading, more <span className="text-gold">shipping</span>.
          </>
        }
        cta={{ label: "Start a Project", to: "/contact" }}
      />
    </SiteShell>
  );
}
