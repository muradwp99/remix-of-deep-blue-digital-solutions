import { Link } from "@tanstack/react-router";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  Activity,
  ShoppingCart,
  Gauge,
  Zap,
  DollarSign,
  Users,
  Rocket,
  Headset,
} from "lucide-react";

/**
 * RecentProjects — a slow, continuous marquee of tall case-study cards.
 * Each card carries a brand line and three glass stat panels (icon + metric +
 * up/down arrow + label) over a project photo, in the Northline navy/gold
 * system. Hover pauses the rail; motion honours prefers-reduced-motion.
 */

type IconType = React.ComponentType<{ className?: string }>;
type Stat = { icon: IconType; value: string; dir: "up" | "down"; label: string };
type Project = { name: string; tag: string; img: string; alt: string; stats: Stat[] };

const PROJECTS: Project[] = [
  {
    name: "Northwind",
    tag: "SaaS · Rebrand",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=70",
    alt: "Analytics dashboard with usage charts",
    stats: [
      { icon: TrendingUp, value: "184%", dir: "up", label: "Increase in signups" },
      { icon: Users, value: "3.2×", dir: "up", label: "Higher retention" },
      { icon: TrendingDown, value: "41%", dir: "down", label: "Lower churn" },
    ],
  },
  {
    name: "Halcyon Health",
    tag: "Health · Mobile App",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70",
    alt: "Clinician reviewing patient data on a tablet",
    stats: [
      { icon: Star, value: "4.9★", dir: "up", label: "App Store rating" },
      { icon: Download, value: "250K", dir: "up", label: "Downloads in year one" },
      { icon: Activity, value: "180%", dir: "up", label: "Increase in engagement" },
    ],
  },
  {
    name: "Meridian Retail",
    tag: "Ecommerce · Headless",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=70",
    alt: "Customer paying with a card at checkout",
    stats: [
      { icon: ShoppingCart, value: "3.1×", dir: "up", label: "Revenue year over year" },
      { icon: TrendingUp, value: "48%", dir: "up", label: "Increase in conversion" },
      { icon: TrendingDown, value: "25%", dir: "down", label: "Lower cost per acquisition" },
    ],
  },
  {
    name: "Orbital Cloud",
    tag: "DevTools · Marketing",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=70",
    alt: "Earth from orbit with glowing city lights",
    stats: [
      { icon: Gauge, value: "98", dir: "up", label: "Median Lighthouse" },
      { icon: Zap, value: "62%", dir: "down", label: "Faster load time" },
      { icon: TrendingUp, value: "140%", dir: "up", label: "More trial signups" },
    ],
  },
  {
    name: "Cascade Finance",
    tag: "Fintech · Web App",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=70",
    alt: "Financial trading charts on a monitor",
    stats: [
      { icon: Headset, value: "40%", dir: "down", label: "Fewer support tickets" },
      { icon: TrendingUp, value: "90%", dir: "up", label: "Higher activation" },
      { icon: DollarSign, value: "2.4×", dir: "up", label: "Customer lifetime value" },
    ],
  },
  {
    name: "Ridgeline Studios",
    tag: "Media · CMS Platform",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=70",
    alt: "Stack of freshly printed newspapers",
    stats: [
      { icon: Rocket, value: "6×", dir: "up", label: "Publishing throughput" },
      { icon: Users, value: "210%", dir: "up", label: "Increase in traffic" },
      { icon: TrendingDown, value: "35%", dir: "down", label: "Lower bounce rate" },
    ],
  },
];

function StatRow({ stat }: { stat: Stat }) {
  const Dir = stat.dir === "up" ? ArrowUp : ArrowDown;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 backdrop-blur-md">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/12">
        <stat.icon className="h-3.5 w-3.5 text-gold" />
      </span>
      <span className="flex items-baseline gap-0.5 font-display text-lg font-semibold leading-none">
        {stat.value}
        <Dir className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
      </span>
      <span className="ml-auto max-w-[10ch] text-right text-[9px] font-medium uppercase leading-tight tracking-[0.08em] text-muted-foreground">
        {stat.label}
      </span>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      to="/works"
      className="group relative block h-[460px] w-[310px] shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-surface"
    >
      <img
        src={p.img}
        alt={p.alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/55 via-background/45 to-background/92" />
      <div className="relative flex h-full flex-col p-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">{p.tag}</span>
          <h3 className="mt-1.5 font-display text-2xl font-semibold leading-tight">{p.name}</h3>
        </div>
        <div className="mt-auto space-y-2">
          {p.stats.map((s) => (
            <StatRow key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </Link>
  );
}

export function RecentProjects() {
  const loop = [...PROJECTS, ...PROJECTS];
  return (
    <section className="relative overflow-hidden border-b border-border/60 py-14" data-reveal>
      <div className="proj-marquee">
        <div className="proj-marquee-track">
          {loop.map((p, i) => (
            <ProjectCard key={`${p.name}-${i}`} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
