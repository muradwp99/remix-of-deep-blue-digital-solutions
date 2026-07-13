"use client";

import type { ComponentType } from "react";
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
  Gauge,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Landmark,
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
const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  posts: FileText,
  categories: FolderTree,
  tags: Tag,
  pages: LayoutTemplate,
  faqs: HelpCircle,
  resources: BookOpen,
  services: Wrench,
  solutions: Boxes,
  industries: Landmark,
  tools: Gauge,
  learning: GraduationCap,
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
    <nav className="nl-nav">
      <Link
        href={adminRoute}
        className={`nl-nav__link${pathname === adminRoute ? " is-active" : ""}`}
      >
        <LayoutDashboard size={17} className="nl-nav__icon" />
        <span>Dashboard</span>
      </Link>

      <div className="nl-nav__scroll">
        {groupNames.map((gn) => (
          <div key={gn} className="nl-nav__group">
            <div className="nl-nav__group-label">{gn}</div>
            <div className="nl-nav__links">
              {groups[gn].map((e) => {
                const IconEl = ICONS[e.slug] ?? FileText;
                const active = isActive(e.href);
                return (
                  <Link
                    key={e.slug}
                    href={e.href}
                    className={`nl-nav__link${active ? " is-active" : ""}`}
                  >
                    <IconEl size={17} className="nl-nav__icon" />
                    <span>{e.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Link href={`${adminRoute}/logout`} className="nl-nav__link nl-nav__logout">
        <LogOut size={17} className="nl-nav__icon" />
        <span>Log out</span>
      </Link>
    </nav>
  );
}
