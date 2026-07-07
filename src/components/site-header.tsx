import { Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Code2,
  Palette,
  Smartphone,
  Cloud,
  Rocket,
  Users,
  History,
  Sparkles,
  ChevronDown,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string }>;

type MegaItem = { label: string; href: string; icon: IconType; desc: string };
type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  mega?: { blurb: string; items: MegaItem[] };
};

const NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  {
    label: "Services",
    href: "/services",
    icon: Package,
    mega: {
      blurb: "Full-stack delivery from concept to scale.",
      items: [
        { label: "All Services", href: "/services", icon: Package, desc: "Everything we do, end to end" },
        { label: "Custom Software", href: "/custom-software", icon: Code2, desc: "Bespoke, enterprise-grade platforms" },
        { label: "UI/UX Design", href: "/ui-ux-design", icon: Palette, desc: "Research-driven product design" },
        { label: "Mobile Apps", href: "/mobile-apps", icon: Smartphone, desc: "Native & cross-platform apps" },
      ],
    },
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: Layers,
    mega: {
      blurb: "Tailored strategies for every stage of growth.",
      items: [
        { label: "All Solutions", href: "/solutions", icon: Layers, desc: "By business and by goal" },
        { label: "SaaS Development", href: "/saas", icon: Cloud, desc: "Multi-tenant, billing, scale" },
        { label: "Digital Transformation", href: "/digital-transformation", icon: Rocket, desc: "Modernize legacy systems" },
      ],
    },
  },
  { label: "Works", href: "/works", icon: Briefcase },
  {
    label: "About",
    href: "/about",
    icon: Info,
    mega: {
      blurb: "Engineering-first. Design-led. Partnership-driven.",
      items: [
        { label: "About Us", href: "/about", icon: Info, desc: "Our mission and values" },
        { label: "Our Story", href: "/our-story", icon: History, desc: "How Northline came to be" },
        { label: "Leadership", href: "/leadership", icon: Users, desc: "Meet the senior team" },
        { label: "Careers", href: "/careers", icon: Sparkles, desc: "Build the future with us" },
      ],
    },
  },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="container-page">
        <div
          className="glass-strong flex h-16 items-center justify-between gap-4 rounded-full px-3 pl-5 shadow-panel"
          onMouseLeave={() => setOpenMega(null)}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold to-lime text-primary-foreground font-display text-lg font-bold transition-transform duration-500 group-hover:rotate-6">
              N
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Northline
            </span>
          </Link>

          {/* Desktop pill nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-background/40 px-1.5 py-1.5 border border-white/5">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMega(item.mega ? item.label : null)}
              >
                <Link
                  to={item.href}
                  activeOptions={{ exact: item.href === "/" }}
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

                {/* Mega dropdown */}
                {item.mega && openMega === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4 w-[440px] z-50">
                    <div className="glass-strong animate-mega-in rounded-2xl p-3 shadow-panel border border-white/10">
                      <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground">
                        {item.mega.blurb}
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {item.mega.items.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            onClick={() => setOpenMega(null)}
                            className="group flex items-start gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors"
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime/15 border border-lime/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                              <sub.icon className="h-4 w-4 text-lime" />
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-foreground">
                                {sub.label}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {sub.desc}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 animate-mega-in">
            <div className="space-y-1">
              {NAV.map((item) => (
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
                    <div className="ml-4 border-l border-white/10 pl-3 space-y-1 pb-1">
                      {item.mega.items.slice(1).map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
                        >
                          <sub.icon className="h-3.5 w-3.5 text-lime" />
                          {sub.label}
                        </Link>
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
