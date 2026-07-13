import Link from "next/link";

/**
 * Branded dashboard hero (admin.components.beforeDashboard).
 * Replaces the bare default dashboard landing with a premium welcome +
 * quick links to the collections editors are most likely to reach for.
 */
const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Pages", href: "/admin/collections/pages" },
  { label: "Services", href: "/admin/collections/services" },
  { label: "Works", href: "/admin/collections/projects" },
  { label: "Blog", href: "/admin/collections/posts" },
  { label: "Team", href: "/admin/collections/team" },
  { label: "Site Settings", href: "/admin/globals/site-settings" },
];

export default function Welcome() {
  return (
    <section className="nl-welcome">
      <div className="nl-welcome__glow" aria-hidden />
      <div className="nl-welcome__inner">
        <p className="nl-welcome__eyebrow">Northline CMS</p>
        <h2 className="nl-welcome__title">Welcome back.</h2>
        <p className="nl-welcome__sub">
          Every piece of the site — content, images, pricing and settings — is editable here.
          Pick up where you left off.
        </p>
        <div className="nl-welcome__links">
          {QUICK_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nl-welcome__chip">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
