import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { gsap } from "@/lib/animations";
import { RibbonSphere } from "./ribbon-sphere";

/**
 * Corner-composition hero: display headline pinned top-left, the closing line
 * answering it bottom-right, a small mission paragraph + CTAs bottom-left, and
 * an animated gradient orb (planet + orbit ring + shimmer) as the centerpiece.
 * The orb breathes and spins continuously, and parallaxes toward the cursor.
 */
export function ScatterHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const orb = orbRef.current;
    const plane = rippleRef.current;
    if (!section || !orb || !plane) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Entrance: reveal only the visible breakpoint's hero elements
      const els = gsap.utils
        .toArray<HTMLElement>("[data-hero]", section)
        .filter((el) => el.offsetParent !== null);

      if (reduceMotion) {
        gsap.set(els, { opacity: 1, y: 0, filter: "none" });
      } else {
        gsap.fromTo(
          els,
          { opacity: 0, y: 34, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.11,
            delay: 0.15,
          },
        );
      }

      // waves face the viewer; the plane only sways gently with the cursor
      gsap.set(plane, { rotationX: 0, transformPerspective: 1000 });
      if (reduceMotion) return;

      const tiltX = gsap.quickTo(plane, "rotationX", { duration: 1, ease: "power2.out" });
      const tiltY = gsap.quickTo(plane, "rotationY", { duration: 1, ease: "power2.out" });

      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        gsap.to(orb, { x: nx * 26, y: ny * 20, duration: 1.1, ease: "power2.out" });
        tiltX(ny * -6);
        tiltY(nx * 7);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-20 min-h-160 w-full overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
      {/* Atmosphere: full-bleed navy gradients breathing in from every side */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 45% at 10% 6%, oklch(0.27 0.07 265 / 0.6), transparent 68%)",
            "radial-gradient(ellipse 50% 40% at 90% 12%, oklch(0.23 0.06 250 / 0.5), transparent 68%)",
            "radial-gradient(ellipse 60% 50% at 8% 92%, oklch(0.25 0.07 265 / 0.45), transparent 68%)",
            "radial-gradient(ellipse 65% 55% at 92% 90%, oklch(0.28 0.07 88 / 0.12), transparent 62%)",
            "linear-gradient(180deg, oklch(0.135 0.028 265), oklch(0.12 0.025 265) 55%, oklch(0.125 0.03 265))",
          ].join(", "),
        }}
      />
      <div className="absolute inset-0 grain-bg" />

      {/* Center: WebGL ribbon sphere (GSAP-driven, cursor-reactive) */}
      <div className="hero-orb-scene pointer-events-none absolute inset-0 z-10 grid place-items-center">
        {/* border-circle waves rippling out on a tilted 3D plane */}
        <div
          ref={rippleRef}
          className="absolute inset-0"
          aria-hidden="true"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="hero-ripple" />
          <span className="hero-ripple" />
          <span className="hero-ripple" />
          <span className="hero-ripple" />
        </div>
        <div
          ref={orbRef}
          className="relative hero-anim hero-fade"
          style={{
            animationDelay: "0.15s",
            width: "min(78vw, 560px)",
            height: "min(78vw, 560px)",
          }}
        >
          <RibbonSphere className="h-full w-full" />
        </div>
      </div>

      {/* Desktop: corner composition */}
      <div className="container-page relative z-30 hidden h-full lg:block">
        {/* Top-left: display headline */}
        <div className="absolute left-6 top-[22%]">
          <span
            data-hero
            className="hero-anim inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime"
          >
            <Sparkles className="h-3.5 w-3.5" /> Premium Software Studio
          </span>
          <h1 className="mt-7 leading-[0.92] text-foreground">
            <span
              data-hero
              className="hero-anim block font-display text-7xl font-semibold xl:text-8xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              We engineer
            </span>
            <span
              data-hero
              className="hero-anim block font-display text-7xl font-semibold xl:text-8xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              software
            </span>
          </h1>
        </div>

        {/* Bottom-right: the answering line */}
        <div className="absolute right-6 bottom-[15%] text-right">
          <p className="leading-[0.95]">
            <span
              data-hero
              className="hero-anim block font-playfair text-6xl italic text-gold xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              that scales
            </span>
            <span
              data-hero
              className="hero-anim block font-playfair text-6xl italic text-gold xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              with you
            </span>
          </p>
        </div>

        {/* Bottom-left: mission + CTAs */}
        <div className="absolute left-6 bottom-[17%] max-w-sm">
          <p
            data-hero
            className="hero-anim text-sm leading-relaxed text-foreground/70"
          >
            Northline designs, builds, and grows enterprise-grade web platforms, apps, and AI
            products — one senior team, from strategy to scale.
          </p>
          <div data-hero className="hero-anim mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
            >
              Book a Call
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/works"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked flow */}
      <div className="container-page relative z-30 flex h-full flex-col items-center justify-center pt-20 pb-12 text-center lg:hidden">
        <span
          data-hero
          className="hero-anim inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime"
        >
          <Sparkles className="h-3.5 w-3.5" /> Premium Software Studio
        </span>
        <h1 className="mt-7 leading-[0.95]">
          <span
            data-hero
            className="hero-anim block font-display text-5xl font-semibold sm:text-6xl"
            style={{ letterSpacing: "-0.05em" }}
          >
            We engineer software
          </span>
          <span
            data-hero
            className="hero-anim block font-playfair text-5xl italic text-gold sm:text-6xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            that scales with you
          </span>
        </h1>
        <p
          data-hero
          className="hero-anim mt-6 max-w-md text-sm leading-relaxed text-foreground/70"
        >
          Northline designs, builds, and grows enterprise-grade web platforms, apps, and AI
          products — one senior team, from strategy to scale.
        </p>
        <div
          data-hero
          className="hero-anim mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-6 py-3 text-sm font-semibold"
          >
            Book a Call
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium"
          >
            View Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
