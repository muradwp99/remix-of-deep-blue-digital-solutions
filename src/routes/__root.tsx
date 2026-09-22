import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { OG_IMAGE, OG_IMAGE_ALT, absolute, canonicalPath, siteJsonLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Error 404</p>
        <h1 className="mt-4 font-display text-6xl text-foreground">Off the map</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page doesn't exist. Let's get you back to base.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {}, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again, or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * Everything here is a default a route may override, plus the three things
   * no route can know on its own: the canonical URL, `og:url`, and the share
   * image. They are derived from the matches, so every page gets them —
   * including the CMS-driven ones that have no route file to edit.
   */
  head: ({ matches }) => {
    const url = absolute(canonicalPath(matches));
    const image = absolute(OG_IMAGE);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Auxtech — Premium Software Agency" },
        {
          name: "description",
          content:
            "Auxtech is a software studio designing and engineering premium websites, apps, and digital products for ambitious teams.",
        },
        { name: "author", content: "Auxtech" },
        { property: "og:title", content: "Auxtech — Premium Software Agency" },
        {
          property: "og:description",
          content:
            "Design, engineering, and growth for ambitious teams. Websites, apps, ecommerce, SaaS, and brand.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Auxtech" },
        { property: "og:locale", content: "en_US" },
        { property: "og:url", content: url },
        // Declared without an image since the beginning, so every link to this
        // site rendered a large blank card.
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: OG_IMAGE_ALT },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: image },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fustat:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap",
        },
        // Search params are dropped, which is the point: /blog?cat=design and
        // /blog are one page and only one of them is the address.
        { rel: "canonical", href: url },
      ],
      // Attributes go flat here, not nested under `attrs` — this router
      // version spreads the object's own keys onto the tag, and a nested one
      // renders as attrs="[object Object]".
      scripts: [{ type: "application/ld+json", children: JSON.stringify(siteJsonLd(url)) }],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
