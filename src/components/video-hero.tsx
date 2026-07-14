import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { gsap } from "@/lib/animations";
import heroVideo from "@/Boy_coding_on_laptop_website_202607092351.mp4";

/**
 * VideoHero — full-bleed autoplaying video hero on the wide stage
 * (min(94vw, 1600px)), laid out as the corner composition. The video drifts
 * toward the cursor while the copy counter-drifts for depth, and on scroll
 * GSAP scrubs a parallax: the video lags behind and zooms while the copy
 * lifts away and dissolves.
 */
function useVideoHeroMotion() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = section.querySelector<HTMLElement>("[data-vhero-media]");
    const copy = section.querySelector<HTMLElement>("[data-vhero-copy]");
    const video = section.querySelector<HTMLVideoElement>("video");
    if (!media || !copy || !video) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(gsap.utils.toArray<HTMLElement>("[data-hero]", section), {
        opacity: 1,
        y: 0,
        filter: "none",
      });
      video.pause();
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // entrance — visible breakpoint's elements blur-rise with stagger
      const els = gsap.utils
        .toArray<HTMLElement>("[data-hero]", section)
        .filter((el) => el.offsetParent !== null);
      gsap.fromTo(
        els,
        { opacity: 0, y: 34, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power4.out", stagger: 0.11, delay: 0.2 },
      );
      gsap.fromTo(media, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" });

      // mouse parallax — the video drifts toward the cursor, the copy
      // counter-drifts a touch for depth
      const mx = gsap.quickTo(media, "x", { duration: 1.2, ease: "power2.out" });
      const my = gsap.quickTo(media, "y", { duration: 1.2, ease: "power2.out" });
      const cx = gsap.quickTo(copy, "x", { duration: 1.5, ease: "power2.out" });
      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        mx(nx * 26);
        my(ny * 16);
        cx(nx * -10);
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // scroll parallax — video lags the scroll and zooms in while the
      // copy lifts away and dissolves
      gsap.to(media, {
        yPercent: 16,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(copy, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "75% top", scrub: true },
      });

      return () => window.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, []);

  return sectionRef;
}

export function VideoHero() {
  const sectionRef = useVideoHeroMotion();

  return (
    <section
      ref={sectionRef}
      className="relative -mt-20 min-h-160 w-full overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
      {/* Full-bleed video, oversized so the parallax never shows an edge */}
      <div data-vhero-media className="absolute -inset-[5%] will-change-transform">
        <video
          className="h-full w-full object-cover"
          src={heroVideo}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-label="A developer coding on a laptop"
        />
      </div>

      {/* Navy atmosphere over the footage — keeps it on-brand and legible */}
      <div className="absolute inset-0 bg-background/55" />
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 45% at 10% 6%, oklch(0.27 0.07 265 / 0.5), transparent 68%)",
            "radial-gradient(ellipse 60% 50% at 92% 90%, oklch(0.28 0.07 88 / 0.1), transparent 62%)",
            "linear-gradient(180deg, oklch(0.135 0.028 265 / 0.7), transparent 40%, oklch(0.12 0.025 265 / 0.85))",
          ].join(", "),
        }}
      />
      <div className="absolute inset-0 grain-bg" />

      <div data-vhero-copy className="relative z-30 h-full">
        {/* Desktop: corner composition on the wide stage */}
        <div className="relative mx-auto hidden h-full w-[min(94vw,1600px)] lg:block">
          {/* Top-left: display headline */}
          <div className="absolute left-0 top-[20%]">
            <span
              data-hero
              className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime"
            >
              <Sparkles className="h-3.5 w-3.5" /> Trusted by 40+ product teams
            </span>
            <h1 className="mt-7 leading-[0.92] text-foreground">
              <span
                data-hero
                className="block font-display text-7xl font-semibold xl:text-8xl"
                style={{ letterSpacing: "-0.05em" }}
              >
                From first commit
              </span>
              <span
                data-hero
                className="block font-display text-7xl font-semibold xl:text-8xl"
                style={{ letterSpacing: "-0.05em" }}
              >
                to launch day.
              </span>
            </h1>
          </div>

          {/* Bottom-center: scroll cue */}
          <div
            data-hero
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              Scroll
            </span>
            <span className="scroll-cue-line" />
          </div>

          {/* Bottom-right: the answering line */}
          <div className="absolute right-0 bottom-[16%] text-right">
            <p className="leading-[0.95]">
              <span
                data-hero
                className="block font-playfair text-6xl italic text-gold xl:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                in as little as
              </span>
              <span
                data-hero
                className="block font-playfair text-6xl italic text-gold xl:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                six weeks
              </span>
            </p>
          </div>

          {/* Bottom-left: value prop + conversion CTAs */}
          <div className="absolute left-0 bottom-[14%] max-w-md">
            <p data-hero className="text-sm leading-relaxed text-foreground/70">
              Web platforms, mobile apps and AI products — one senior team, a live preview link
              from week one, and a fixed quote before we write a line of code.
            </p>
            <div data-hero className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold px-6 py-3 text-sm font-semibold hover:brightness-105"
              >
                Get a fixed quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/works"
                data-magnetic="0.25"
                className="inline-flex items-center gap-2 rounded-full glass shine px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
              >
                See 120+ launches
              </Link>
            </div>
            <p data-hero className="mt-5 flex items-center gap-2 text-xs text-foreground/60">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              4.9 average client rating · 98% retention, year over year
            </p>
          </div>
        </div>

        {/* Mobile / tablet: stacked flow on the wide stage */}
        <div className="relative mx-auto flex h-full w-[min(94vw,1600px)] flex-col items-center justify-center px-2 pt-20 pb-12 text-center lg:hidden">
          <span
            data-hero
            className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime"
          >
            <Sparkles className="h-3.5 w-3.5" /> Trusted by 40+ product teams
          </span>
          <h1 className="mt-7 leading-[0.95]">
            <span
              data-hero
              className="block font-display text-5xl font-semibold sm:text-6xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              From first commit to launch day
            </span>
            <span
              data-hero
              className="block font-playfair text-5xl italic text-gold sm:text-6xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              in as little as six weeks
            </span>
          </h1>
          <p data-hero className="mt-6 max-w-md text-sm leading-relaxed text-foreground/70">
            One senior team, a live preview link from week one, and a fixed quote before we write
            a line of code.
          </p>
          <div data-hero className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full btn-gold px-6 py-3 text-sm font-semibold"
            >
              Get a fixed quote
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/works"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium"
            >
              See 120+ launches
            </Link>
          </div>
          <p data-hero className="mt-5 flex items-center gap-2 text-xs text-foreground/60">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            4.9 average rating · 98% retention
          </p>
        </div>
      </div>
    </section>
  );
}
