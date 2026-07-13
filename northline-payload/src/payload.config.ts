import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { searchPlugin } from "@payloadcms/plugin-search";

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Pages } from "./collections/Pages";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Projects } from "./collections/Projects";
import { Services } from "./collections/Services";
import { Solutions } from "./collections/Solutions";
import { Industries } from "./collections/Industries";
import { Tools } from "./collections/Tools";
import { Learning } from "./collections/Learning";
import { Plans } from "./collections/Plans";
import { Resources } from "./collections/Resources";
import { Team } from "./collections/Team";
import { Testimonials } from "./collections/Testimonials";
import { Faqs } from "./collections/Faqs";
import { Jobs } from "./collections/Jobs";

// Globals
import { SiteSettings } from "./globals/SiteSettings";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "dark",
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · Northline CMS",
      description: "Northline Studio — content management",
    },
    components: {
      // Northline branding
      graphics: {
        Logo: "@/components/admin/graphics/Logo",
        Icon: "@/components/admin/graphics/Icon",
      },
      // Custom grouped nav with an icon beside every item
      Nav: "@/components/admin/Nav",
      // Branded dashboard hero
      beforeDashboard: ["@/components/admin/Welcome"],
    },
  },
  collections: [
    // Blog
    Posts,
    Categories,
    Tags,
    // Content
    Pages,
    Faqs,
    Resources,
    Learning,
    // Catalog
    Projects,
    Services,
    Solutions,
    Industries,
    Tools,
    Plans,
    // People
    Team,
    Testimonials,
    // Careers
    Jobs,
    // Settings
    Media,
    Users,
  ],
  globals: [SiteSettings, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    // SEO tab (meta title / description / og image + previews) on public content
    seoPlugin({
      collections: [
        "pages",
        "posts",
        "projects",
        "services",
        "solutions",
        "industries",
        "tools",
        "learning",
        "resources",
      ],
      uploadsCollection: "media",
      generateTitle: ({ doc }: { doc?: { title?: string; name?: string } }) =>
        `${doc?.title || doc?.name || "Northline"} · Northline`,
      generateDescription: ({ doc }: { doc?: { summary?: string; excerpt?: string } }) =>
        doc?.summary || doc?.excerpt || "",
      generateURL: ({ doc }: { doc?: { slug?: string } }) =>
        `${SITE_URL}/${doc?.slug || ""}`,
    }),
    // WordPress-style redirect manager
    redirectsPlugin({
      collections: ["pages", "posts"],
      overrides: {
        admin: { group: "Settings" },
      },
    }),
    // Hierarchical pages (parent → child + breadcrumbs)
    nestedDocsPlugin({
      collections: ["pages"],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    // Drag-and-drop form builder + submissions inbox
    formBuilderPlugin({
      fields: { payment: false },
      formOverrides: { admin: { group: "Forms" } },
      formSubmissionOverrides: { admin: { group: "Forms" } },
    }),
    // Site-wide search index
    searchPlugin({
      collections: ["posts", "projects", "pages"],
      defaultPriorities: { posts: 20, projects: 10, pages: 10 },
      searchOverrides: { admin: { group: "Settings" } },
    }),
  ],
});
