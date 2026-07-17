import { Link } from "@tanstack/react-router";
import { AuxtechMark } from "./auxtech-logo";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsGlobal } from "@/lib/cms";
import { isEditMode } from "@/lib/edit-bridge";
import {
  Home,
  Package,
  Layers,
  Briefcase,
  BookOpen,
  DollarSign,
  Info,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Zap,
  ChevronDown,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string }>;

type MegaLink = { label: string; href: string; desc?: string; search?: Record<string, string> };
type MegaGroup = { kicker: string; items: MegaLink[] };
type MegaFeature = {
  kicker?: string;
  icon?: IconType;
  stat?: { value: string; suffix: string };
  title: string;
  desc: string;
  cta: string;
  href: string;
  variant: "gold" | "navy";
  ctaStyle: "button" | "link" | "outline";
};
type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  mega?: { groups: MegaGroup[]; feature?: MegaFeature };
};

const NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  {
    label: "Services",
    href: "/services",
    icon: Package,
    mega: {
      groups: [
        {
          kicker: "Build",
          items: [
            { label: "Website Development", href: "/services/website-development", desc: "Fast, SEO-ready sites" },
            { label: "CMS Based Website", href: "/services/cms-websites", desc: "WordPress, Webflow, Sanity" },
            { label: "Web Applications", href: "/custom-software", desc: "Dashboards & portals" },
            { label: "Landing Pages", href: "/services/landing-pages", desc: "High-converting campaigns" },
          ],
        },
        {
          kicker: "Design",
          items: [
            { label: "UI/UX Design", href: "/ui-ux-design", desc: "Research to hi-fi UI" },
            { label: "Design Systems", href: "/services/design-systems", desc: "Scalable component kits" },
            { label: "Brand Identity", href: "/services/brand-identity", desc: "Logo, voice, guidelines" },
            { label: "Prototyping", href: "/services/prototyping", desc: "Clickable, testable flows" },
          ],
        },
        {
          kicker: "Mobile",
          items: [
            { label: "Mobile App Development", href: "/mobile-apps", desc: "iOS & Android" },
            { label: "Cross-Platform Apps", href: "/services/cross-platform-apps", desc: "React Native & Flutter" },
            { label: "MVP Development", href: "/services/mvp-development", desc: "Launch in weeks" },
            { label: "App Store Setup", href: "/services/app-store-setup", desc: "Publishing & ASO" },
          ],
        },
        {
          kicker: "Ongoing",
          items: [
            { label: "Monthly Care", href: "/services/monthly-care", desc: "Updates & peace of mind" },
            { label: "SEO & Performance", href: "/services/seo-performance", desc: "Core Web Vitals" },
            { label: "Maintenance & Support", href: "/services/maintenance-support", desc: "SLAs & monitoring" },
            { label: "Analytics & CRO", href: "/services/analytics-cro", desc: "Measure & optimize" },
          ],
        },
      ],
      feature: {
        icon: Zap,
        title: "Free technical audit",
        desc: "Get a prioritized action plan for speed, SEO and UX within 48 hours — no strings attached.",
        cta: "Claim yours",
        href: "/contact",
        variant: "gold",
        ctaStyle: "button",
      },
    },
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: Layers,
    mega: {
      groups: [
        {
          kicker: "By Model",
          items: [
            { label: "Ecommerce", href: "/solutions/ecommerce", desc: "Shopify & headless stores" },
            { label: "SaaS Platforms", href: "/saas", desc: "Multi-tenant products" },
            { label: "Marketplaces", href: "/solutions/marketplaces", desc: "Two-sided platforms" },
            { label: "Internal Tools", href: "/solutions/internal-tools", desc: "Ops & admin systems" },
          ],
        },
        {
          kicker: "By Goal",
          items: [
            { label: "Digital Marketing", href: "/solutions/digital-marketing", desc: "SEO, ads & content" },
            { label: "Full Brand Consultancy", href: "/solutions/brand-consultancy", desc: "Strategy to rollout" },
            { label: "Growth & CRO", href: "/solutions/growth-cro", desc: "Test, learn, scale" },
            { label: "Automation & AI", href: "/digital-transformation", desc: "Workflows & copilots" },
          ],
        },
        {
          kicker: "By Stage",
          items: [
            { label: "Startup MVP", href: "/solutions/startup-mvp", desc: "From idea to launch" },
            { label: "Scale-up", href: "/solutions/scale-up", desc: "Re-architect for growth" },
            { label: "Enterprise", href: "/solutions/enterprise", desc: "Secure, compliant builds" },
            { label: "Rescue Projects", href: "/solutions/rescue-projects", desc: "Fix & ship stalled work" },
          ],
        },
      ],
      feature: {
        kicker: "Featured",
        title: "SaaS rebuild → 3.1× signups",
        desc: "How we re-platformed a fintech dashboard and cut load time by 62%.",
        cta: "Read case study",
        href: "/works",
        variant: "navy",
        ctaStyle: "link",
      },
    },
  },
  {
    label: "Works",
    href: "/works",
    icon: Briefcase,
    mega: {
      groups: [
        {
          kicker: "Case Studies",
          items: [
            { label: "Northwind Commerce", href: "/works/northwind-commerce", desc: "Ecommerce · +48% revenue" },
            { label: "Ledgerly", href: "/works/ledgerly", desc: "Fintech SaaS · 3.1× signups" },
            { label: "Verda Health", href: "/works/verda-health", desc: "Mobile app · 4.9★ rating" },
          ],
        },
        {
          kicker: "By Industry",
          items: [
            { label: "Fintech", href: "/industries/fintech" },
            { label: "Healthcare", href: "/industries/healthcare" },
            { label: "Retail & DTC", href: "/industries/retail-dtc" },
            { label: "B2B & Enterprise", href: "/industries/b2b-enterprise" },
          ],
        },
      ],
      feature: {
        stat: { value: "+48%", suffix: "revenue" },
        title: "Northwind Commerce",
        desc: "A headless replatform that doubled conversion in one quarter.",
        cta: "View all work",
        href: "/works",
        variant: "gold",
        ctaStyle: "link",
      },
    },
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
    mega: {
      groups: [
        {
          kicker: "Company",
          items: [
            { label: "About Us", href: "/about", desc: "Our mission and values" },
            { label: "Our Story", href: "/our-story", desc: "How Auxtech came to be" },
          ],
        },
        {
          kicker: "People",
          items: [
            { label: "Leadership", href: "/leadership", desc: "Meet the senior team" },
            { label: "Careers", href: "/careers", desc: "Build the future with us" },
          ],
        },
      ],
    },
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
    mega: {
      groups: [
        {
          kicker: "Free Tools",
          items: [
            { label: "Website Audit Tool", href: "/tools/website-audit", desc: "Score speed & SEO" },
            { label: "ROI Calculator", href: "/tools/roi-calculator", desc: "Estimate your return" },
            { label: "Speed Test", href: "/tools/speed-test", desc: "Core Web Vitals check" },
            { label: "Brand Grader", href: "/tools/brand-grader", desc: "Rate your identity" },
          ],
        },
        {
          kicker: "Learning",
          items: [
            { label: "Guides", href: "/learning/guides", desc: "Deep-dive playbooks" },
            { label: "Tutorials", href: "/learning/tutorials", desc: "Step-by-step how-tos" },
            { label: "Webinars", href: "/learning/webinars", desc: "Live & on-demand" },
            { label: "Templates", href: "/learning/templates", desc: "Free starter kits" },
          ],
        },
        {
          kicker: "Blog & News",
          items: [
            { label: "Latest articles", href: "/blog" },
            { label: "Engineering", href: "/blog", search: { cat: "engineering" } },
            { label: "Design", href: "/blog", search: { cat: "design" } },
            { label: "Company news", href: "/blog", search: { cat: "news" } },
          ],
        },
      ],
      feature: {
        kicker: "Newsletter",
        title: "Ship better, monthly",
        desc: "Product, design and growth tactics from our team — no fluff, unsubscribe anytime.",
        cta: "Subscribe free",
        href: "/resources",
        variant: "navy",
        ctaStyle: "outline",
      },
    },
  },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
];

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function FeatureCard({
  feature,
  onNavigate,
  delay,
}: {
  feature: MegaFeature;
  onNavigate: () => void;
  delay: number;
}) {
  return (
    <Link
      to={feature.href}
      onClick={onNavigate}
      className={`mega-item group flex flex-col rounded-2xl p-6 ${
        feature.variant === "gold" ? "gradient-card-gold" : "gradient-card"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {feature.icon && (
        <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-gold/40 bg-gold/10">
          <feature.icon className="h-4 w-4 text-gold" />
        </span>
      )}
      {feature.kicker && (
        <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
          {feature.kicker}
        </span>
      )}
      {feature.stat && (
        <span className="mb-4 block rounded-xl border border-white/10 bg-background/50 p-4">
          <span className="block h-1.5 w-3/4 rounded-full bg-gold/80" />
          <span className="mt-2 block h-1.5 w-1/2 rounded-full bg-white/15" />
          <span className="mt-3 block font-display text-2xl font-semibold">
            {feature.stat.value}{" "}
            <span className="text-xs font-normal text-muted-foreground">{feature.stat.suffix}</span>
          </span>
        </span>
      )}
      <span className="font-display text-lg font-semibold leading-snug">{feature.title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
        {feature.desc}
      </span>
      <span className="mt-auto pt-5">
        {feature.ctaStyle === "button" && (
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
            {feature.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        )}
        {feature.ctaStyle === "link" && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold">
            {feature.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
        {feature.ctaStyle === "outline" && (
          <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition-colors duration-300 group-hover:bg-white/5">
            {feature.cta}
          </span>
        )}
      </span>
    </Link>
  );
}

/** Admin nav config row: matches a coded NAV item by key (original label, lowercased). */
type NavConfigRow = { key: string; label?: string; visible?: boolean | number | string };

/**
 * LivePress menu config: order / rename / hide the top-level items from WP.
 * Mega-panel contents stay in code (they carry icons + layout); the admin
 * reorders and renames the entries. Fails soft to the coded NAV. In edit
 * mode, `aux-menu` messages apply the config live while dragging rows.
 */
function useNavItems(): NavItem[] {
  const { data } = useQuery({
    queryKey: ["nav-global"],
    queryFn: () => cmsGlobal<NavConfigRow[]>("nav"),
    staleTime: 5 * 60 * 1000,
  });
  const [live, setLive] = useState<NavConfigRow[] | null>(null);

  useEffect(() => {
    if (!isEditMode()) return;
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; nav?: NavConfigRow[] } | null;
      if (d?.type === "aux-menu" && Array.isArray(d.nav)) setLive(d.nav);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const config = live ?? data;
  if (!config || !Array.isArray(config) || !config.length) return NAV;
  const byKey = new Map(NAV.map((n) => [n.label.toLowerCase(), n]));
  const out: NavItem[] = [];
  for (const row of config) {
    const k = String(row.key ?? "").toLowerCase();
    const item = byKey.get(k);
    if (!item) continue;
    byKey.delete(k); // claimed by the config — hidden rows must not re-append below
    if (row.visible === false || row.visible === 0 || row.visible === "0") continue;
    out.push(row.label && row.label.trim() ? { ...item, label: row.label } : item);
  }
  // Anything the config doesn't mention keeps its place at the end.
  byKey.forEach((item) => out.push(item));
  return out.length ? out : NAV;
}

export function SiteHeader() {
  const nav = useNavItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Which mega is hovered/focused right now (null = closed)
  const [openMega, setOpenMega] = useState<string | null>(null);
  // Last mega shown — kept mounted so the close animation has content
  const [panelLabel, setPanelLabel] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const panelItem = nav.find((n) => n.label === panelLabel && n.mega) ?? null;
  const megaOpen = openMega !== null;

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  // Small grace period so diagonal mouse travel doesn't flicker the panel
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMega(null), 140);
  };
  const openFor = (item: NavItem) => {
    cancelClose();
    if (item.mega) {
      setOpenMega(item.label);
      setPanelLabel(item.label);
    } else {
      setOpenMega(null);
    }
  };
  const closeMega = () => setOpenMega(null);

  useIsoLayoutEffect(() => {
    if (openMega && contentRef.current) {
      setPanelHeight(contentRef.current.offsetHeight);
    }
  }, [openMega, panelLabel]);

  useEffect(() => cancelClose, []);

  return (
    <header className="fixed inset-x-0 top-0 z-9999 pt-4">
      <div className="container-page header-in">
        <div
          className="relative"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpenMega(null);
          }}
        >
          <div
            className="header-pill flex h-16 items-center justify-between gap-4 rounded-full border border-white/10 bg-background/92 px-3 pl-5 shadow-panel backdrop-blur-xl"
            data-mega-open={megaOpen}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <AuxtechMark className="h-9 w-9 text-foreground transition-transform duration-500 group-hover:rotate-6" />
              <span className="font-display text-lg font-semibold tracking-tight">Auxtech</span>
            </Link>

            {/* Desktop pill nav */}
            <nav className="hidden lg:flex items-center gap-1 rounded-full bg-background/40 px-1.5 py-1.5 border border-white/5">
              {nav.map((item) => (
                <div key={item.label} onMouseEnter={() => openFor(item)}>
                  <Link
                    to={item.href}
                    activeOptions={{ exact: item.href === "/" }}
                    onClick={closeMega}
                    onFocus={() => openFor(item)}
                    aria-haspopup={item.mega ? "true" : undefined}
                    aria-expanded={item.mega ? openMega === item.label : undefined}
                    className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-foreground transition-colors [&.active]:bg-white/10 [&.active]:text-foreground"
                    activeProps={{ className: "active" }}
                  >
                    <item.icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        className={`h-3 w-3 opacity-60 transition-transform duration-300 ${
                          openMega === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="hidden sm:inline-flex group items-center gap-2 rounded-full btn-navy shine px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
              >
                Start a Project
              </Link>
              <Link
                to="/contact"
                className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105 hover:rotate-12"
                aria-label="Contact"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                className="lg:hidden grid h-11 w-11 place-items-center rounded-full text-foreground hover:bg-white/5"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Full-header-width mega panel */}
          {panelItem?.mega && (
            <div className="absolute inset-x-0 top-full hidden pt-3 lg:block">
              <div
                className="mega-panel glass-strong rounded-[28px] shadow-panel"
                data-open={megaOpen}
                style={panelHeight !== null ? { height: panelHeight } : undefined}
              >
                <div ref={contentRef} key={panelItem.label} className="p-8">
                  <div
                    className={`grid gap-10 ${
                      panelItem.mega.feature ? "lg:grid-cols-[1fr_320px]" : ""
                    }`}
                  >
                    {/* Link columns */}
                    <div
                      className="grid gap-8"
                      style={{
                        gridTemplateColumns: `repeat(${panelItem.mega.groups.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {panelItem.mega.groups.map((group, gi) => (
                        <div
                          key={group.kicker}
                          className={`mega-item ${gi > 0 ? "border-l border-white/5 pl-8" : ""}`}
                          style={{ animationDelay: `${40 + gi * 50}ms` }}
                        >
                          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
                            {group.kicker}
                          </div>
                          <ul className="mt-4 space-y-1">
                            {group.items.map((li) => (
                              <li key={li.label}>
                                <Link
                                  to={li.href}
                                  search={li.search}
                                  onClick={closeMega}
                                  className="group -mx-2 block rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
                                >
                                  <span className="block text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-lime">
                                    {li.label}
                                  </span>
                                  {li.desc && (
                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {li.desc}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Featured card */}
                    {panelItem.mega.feature && (
                      <FeatureCard
                        feature={panelItem.mega.feature}
                        onNavigate={closeMega}
                        delay={40 + panelItem.mega.groups.length * 50}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 animate-mega-in">
            <div className="space-y-1">
              {nav.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/80 hover:bg-white/5 hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                  {item.mega && (
                    <div className="ml-4 border-l border-white/10 pl-3 space-y-2 pb-2">
                      {item.mega.groups.map((group) => (
                        <div key={group.kicker}>
                          <div className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                            {group.kicker}
                          </div>
                          {group.items.map((li) => (
                            <Link
                              key={li.label}
                              to={li.href}
                              search={li.search}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
                            >
                              {li.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl btn-navy px-4 py-3 text-sm font-semibold"
              >
                Start a Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
