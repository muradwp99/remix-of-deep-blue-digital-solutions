"use client";

import type { CSSProperties, ComponentType } from "react";
import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Briefcase,
  ClipboardList,
  CreditCard,
  FileText,
  FolderTree,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Milestone,
  PanelBottomOpen,
  PanelTopOpen,
  Search,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  UserPlus,
  Quote,
  Wrench,
} from "lucide-react";

/** slug → Lucide icon */
const ICONS: Record<string, ComponentType<{ size?: number; style?: CSSProperties }>> = {
  posts: FileText,
  categories: FolderTree,
  tags: Tag,
  pages: LayoutTemplate,
  faqs: HelpCircle,
  resources: BookOpen,
  services: Wrench,
  solutions: Boxes,
  projects: Briefcase,
  plans: CreditCard,
  team: Users,
  testimonials: Quote,
  jobs: UserPlus,
  media: ImageIcon,
  users: ShieldCheck,
  "site-settings": Settings,
  header: PanelTopOpen,
  footer: PanelBottomOpen,
  search: Search,
  redirects: Milestone,
  forms: ClipboardList,
  "form-submissions": Inbox,
};

const GROUP_ORDER = ["Content", "Catalog", "People", "Blog", "Careers", "Forms", "Settings"];

/** Payload's internal system collections — never show in the nav. */
const SYSTEM_SLUGS = new Set([
  "payload-locked-documents",
  "payload-preferences",
  "payload-migrations",
  "payload-kvs",
  "payload-jobs",
]);

type Entry = { slug: string; label: string; href: string; group: string };

const asLabel = (v: unknown, fallback: string): string => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.en === "string") return o.en;
    const first = Object.values(o).find((x) => typeof x === "string");
    if (typeof first === "string") return first;
  }
  return fallback;
};

const titleCase = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const rowStyle = (active: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 12px",
  borderRadius: 6,
  textDecoration: "none",
  fontSize: 14,
  lineHeight: 1.2,
  color: active ? "var(--theme-elevation-1000)" : "var(--theme-elevation-800)",
  background: active ? "var(--theme-elevation-100)" : "transparent",
  transition: "background 120ms ease, color 120ms ease",
});

const groupLabelStyle: CSSProperties = {
  padding: "4px 12px",
  marginBottom: 2,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontWeight: 600,
  color: "var(--theme-elevation-500)",
};

export default function Nav() {
  const { config } = useConfig();
  const pathname = usePathname();
  const adminRoute = config?.routes?.admin || "/admin";

  const entries: Entry[] = [];
  for (const c of config?.collections ?? []) {
    if (c.admin?.hidden) continue;
    if (SYSTEM_SLUGS.has(c.slug) || c.slug.startsWith("payload-")) continue;
    entries.push({
      slug: c.slug,
      label: asLabel(c.labels?.plural, titleCase(c.slug)),
      href: `${adminRoute}/collections/${c.slug}`,
      group: (c.admin?.group as string) || "Content",
    });
  }
  for (const g of config?.globals ?? []) {
    if (g.admin?.hidden) continue;
    entries.push({
      slug: g.slug,
      label: asLabel(g.label, titleCase(g.slug)),
      href: `${adminRoute}/globals/${g.slug}`,
      group: (g.admin?.group as string) || "Settings",
    });
  }

  const groups: Record<string, Entry[]> = {};
  for (const e of entries) (groups[e.group] ??= []).push(e);

  const groupNames = [
    ...GROUP_ORDER.filter((g) => groups[g]),
    ...Object.keys(groups).filter((g) => !GROUP_ORDER.includes(g)),
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px 14px",
        gap: 6,
      }}
    >
      <Link href={adminRoute} style={{ ...rowStyle(pathname === adminRoute), marginBottom: 6 }}>
        <LayoutDashboard size={17} style={{ flexShrink: 0 }} />
        <span>Dashboard</span>
      </Link>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingTop: 4,
        }}
      >
        {groupNames.map((gn) => (
          <div key={gn}>
            <div style={groupLabelStyle}>{gn}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {groups[gn].map((e) => {
                const IconEl = ICONS[e.slug] ?? FileText;
                const active = isActive(e.href);
                return (
                  <Link key={e.slug} href={e.href} style={rowStyle(active)}>
                    <IconEl size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />
                    <span>{e.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Link
        href={`${adminRoute}/logout`}
        style={{
          ...rowStyle(false),
          marginTop: 8,
          borderTop: "1px solid var(--theme-elevation-100)",
          borderRadius: 0,
          paddingTop: 14,
        }}
      >
        <LogOut size={17} style={{ flexShrink: 0 }} />
        <span>Log out</span>
      </Link>
    </nav>
  );
}
