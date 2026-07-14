import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

/**
 * HeroDeck — a fanned "hand of cards" drifting along a shallow arc at the base
 * of the hero. Tiles ride a large invisible circle (center far below the
 * fold), tilt with the curve's tangent, fade at the edges, and straighten +
 * lift when hovered. Work tiles, live result stats, and a CTA share the rail.
 */

type DeckTile =
  | { type: "work"; name: string; tag: string; result: string; img: string; href: string }
  | { type: "stat"; value: string; label: string; href: string }
  | { type: "cta"; href: string };

const TILES: DeckTile[] = [
  {
    type: "work",
    name: "Northwind SaaS",
    tag: "SaaS Rebrand",
    result: "+184% signups",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70",
    href: "/works",
  },
  { type: "stat", value: "12+", label: "products shipped this year", href: "/works" },
  {
    type: "work",
    name: "Halcyon Health",
    tag: "Mobile App",
    result: "4.9★ App Store",
    img: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?auto=format&fit=crop&w=800&q=70",
    href: "/works",
  },
  { type: "stat", value: "98", label: "median Lighthouse score", href: "/works" },
  {
    type: "work",
    name: "Meridian Retail",
    tag: "Ecommerce",
    result: "3.1× revenue",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=70",
    href: "/works",
  },
  { type: "stat", value: "84%", label: "clients stay after launch", href: "/about" },
  {
    type: "work",
    name: "Orbital Cloud",
    tag: "Marketing Site",
    result: "−62% load time",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=70",
    href: "/works",
  },
  { type: "cta", href: "/contact" },
];

const TILE_W = 224;
const TILE_H = 148;
const BASE_SPEED = 0.022; // full-arc traversals per second
const FADE = 0.12; // p-range over which tiles fade at each end

export function HeroDeck() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = TILES.length;
    // per-tile drift phase, straighten factor, and hover scale
    const phase = TILES.map((_, i) => i / n);
    const straight = TILES.map(() => 1);
    const scale = TILES.map(() => 1);
    let hovered = -1;
    let speed = reduceMotion ? 0 : BASE_SPEED;
    let width = wrap.clientWidth;
    let raf = 0;
    let last = performance.now();

    const onResize = () => {
      width = wrap.clientWidth;
    };
    window.addEventListener("resize", onResize);

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const targetSpeed = reduceMotion || hovered >= 0 ? 0 : BASE_SPEED;
      speed += (targetSpeed - speed) * 0.06;

      const R = width * 1.5;
      const maxTheta = Math.asin(Math.min(0.55, (width / 2 + TILE_W) / R));
      const cx = width / 2;
      const apex = 10;

      for (let i = 0; i < n; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;

        phase[i] = (phase[i] + speed * dt) % 1;
        const p = phase[i];
        const theta = -maxTheta + p * 2 * maxTheta;

        const targetStraight = hovered === i ? 0 : 1;
        straight[i] += (targetStraight - straight[i]) * 0.12;
        const targetScale = hovered === i ? 1.07 : 1;
        scale[i] += (targetScale - scale[i]) * 0.12;

        const x = cx + R * Math.sin(theta) - TILE_W / 2;
        const y = apex + R * (1 - Math.cos(theta)) + (1 - straight[i]) * -12;
        const rot = (theta * 180) / Math.PI;
        const fade = Math.min(1, p / FADE) * Math.min(1, (1 - p) / FADE);

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot * straight[i]}deg) scale(${scale[i]})`;
        el.style.opacity = String(Math.min(1, fade * 1.2));
        el.style.zIndex = hovered === i ? "30" : "10";
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const enter = (i: number) => () => (hovered = i);
    const leave = () => (hovered = -1);
    const cleanups: (() => void)[] = [];
    tileRefs.current.forEach((el, i) => {
      if (!el) return;
      const onEnter = enter(i);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden h-[230px] md:block"
      aria-label="Selected work and results"
    >
      {TILES.map((t, i) => (
        <div
          key={i}
          ref={(el) => {
            tileRefs.current[i] = el;
          }}
          className="deck-tile pointer-events-auto opacity-0"
          style={{ width: TILE_W, height: TILE_H }}
          onClick={() => navigate({ to: t.href })}
          role="link"
          tabIndex={-1}
        >
          {t.type === "work" && (
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/15 shadow-panel">
              <img
                src={t.img}
                alt={t.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-3.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-lime">{t.tag}</span>
                <span className="mt-0.5 font-display text-sm font-semibold leading-tight">
                  {t.name}
                </span>
                <span className="text-[11px] text-muted-foreground">{t.result}</span>
              </div>
            </div>
          )}
          {t.type === "stat" && (
            <div className="gradient-card flex h-full w-full flex-col justify-end rounded-xl p-3.5 shadow-panel">
              <span className="font-display text-3xl font-semibold text-gold">{t.value}</span>
              <span className="mt-1 text-[11px] leading-snug text-muted-foreground">{t.label}</span>
            </div>
          )}
          {t.type === "cta" && (
            <div className="gradient-card-gold flex h-full w-full flex-col justify-between rounded-xl p-3.5 shadow-panel">
              <span className="font-display text-base font-semibold leading-snug">
                Have a project in mind?
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                Start yours <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
      ))}
      <div className="deck-fade" />
    </div>
  );
}
