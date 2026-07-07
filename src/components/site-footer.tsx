import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Services",
    links: ["Website Development", "UI/UX Design", "CMS Websites", "Mobile Apps", "Monthly Care"],
    href: "/services",
  },
  {
    title: "Solutions",
    links: ["Ecommerce", "SaaS", "Digital Marketing", "Brand Consultancy"],
    href: "/solutions",
  },
  {
    title: "Company",
    links: ["About", "Works", "Pricing", "Contact"],
    href: "/about",
  },
  {
    title: "Resources",
    links: ["Free Tools", "Learning", "Blog & News"],
    href: "/resources",
  },
];

export function SiteFooter() {
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
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              A software studio designing and engineering premium digital products for ambitious teams.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-base mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      to={c.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Northline Studio. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
