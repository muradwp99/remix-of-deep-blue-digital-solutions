import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsGlobal, type CmsFooter } from "@/lib/cms";
import { isEditMode } from "@/lib/edit-bridge";

type FooterLink = { label: string; href: string };

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Website Development", href: "/services/website-development" },
      { label: "UI/UX Design", href: "/ui-ux-design" },
      { label: "Custom Software", href: "/custom-software" },
      { label: "Mobile Apps", href: "/mobile-apps" },
      { label: "Monthly Care", href: "/services/monthly-care" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Ecommerce", href: "/solutions/ecommerce" },
      { label: "SaaS", href: "/saas" },
      { label: "Digital Transformation", href: "/digital-transformation" },
      { label: "Brand Consultancy", href: "/solutions/brand-consultancy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Story", href: "/our-story" },
      { label: "Works", href: "/works" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free Tools", href: "/resources" },
      { label: "Learning", href: "/learning/guides" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

export function SiteFooter() {
  // Footer content is CMS-editable via the `footer` global; fails soft to the
  // built-in columns/blurb/copyright when the CMS is unreachable.
  const { data: saved } = useQuery({
    queryKey: ["footer-global"],
    queryFn: () => cmsGlobal<CmsFooter>("footer"),
    staleTime: 5 * 60 * 1000,
  });
  // LivePress: footer edits stream in live while the admin edits columns.
  const [live, setLive] = useState<CmsFooter | null>(null);
  useEffect(() => {
    if (!isEditMode()) return;
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; footer?: CmsFooter } | null;
      if (d?.type === "aux-footer" && d.footer && typeof d.footer === "object") {
        setLive(d.footer);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const data = live ?? saved;
  const blurb =
    data?.blurb ||
    "A software studio designing and engineering premium digital products for ambitious teams.";
  const columns = data?.columns?.length
    ? data.columns.map((c) => ({ title: c.title, links: c.links ?? [] }))
    : cols;
  const copyright =
    data?.copyright || `© ${new Date().getFullYear()} Northline Studio. All rights reserved.`;

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-accent to-gold text-primary-foreground font-display text-lg">
                N
              </span>
              <span className="font-display text-xl">Northline</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">{blurb}</p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-lime link-underline"
            >
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-base mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
