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
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Package },
  { label: "Solutions", href: "/solutions", icon: Layers },
  { label: "Works", href: "/works", icon: Briefcase },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "About", href: "/about", icon: Info },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="container-page">
        <div className="glass-strong flex h-16 items-center justify-between gap-4 rounded-full px-3 pl-5 shadow-panel">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-lime to-gold text-primary-foreground font-display text-lg font-bold">
              N
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Northline
            </span>
          </Link>

          {/* Desktop pill nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-background/40 px-1.5 py-1.5 border border-white/5">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                activeOptions={{ exact: item.href === "/" }}
                className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-foreground transition-colors [&.active]:bg-white/10 [&.active]:text-foreground"
                activeProps={{ className: "active" }}
              >
                <item.icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex group items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-lime-foreground hover:brightness-110 transition"
            >
              Start a Project
            </Link>
            <Link
              to="/contact"
              className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
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
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3">
            <div className="space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/80 hover:bg-white/5 hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-semibold text-lime-foreground"
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
