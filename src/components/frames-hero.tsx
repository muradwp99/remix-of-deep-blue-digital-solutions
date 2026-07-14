import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap } from "@/lib/animations";

/**
 * FramesHero — a scroll-scrubbed image sequence (the Apple-product-page
 * technique). The source video (24fps — every real frame it contains) was
 * pre-split into 240 WebP stills (public/seq); while the section is pinned,
 * scroll drives which frame is painted onto a full-bleed canvas — a frame
 * every ~11px of scroll. A live counter shows the current frame.
 *
 * The copy uses a wider stage than the header container on purpose:
 * min(94vw, 1600px) instead of container-page's 1320px.
 */

const FRAME_COUNT = 240;
const frameSrc = (i: number) => `/seq/f_${String(i + 1).padStart(4, "0")}.webp`;

export function FramesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const images: HTMLImageElement[] = [];
    const seq = { frame: 0 };

    const render = () => {
      const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(seq.frame)));
      const img = images[idx];
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      // cover-fit
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx2d.clearRect(0, 0, cw, ch);
      ctx2d.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      if (counterRef.current) {
        counterRef.current.textContent = String(idx + 1).padStart(3, "0");
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      // repaint when the frame under the playhead finishes loading
      img.onload = () => {
        if (Math.round(seq.frame) === i || (i === 0 && seq.frame < 1)) render();
      };
      images.push(img);
    }

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = section.clientWidth * dpr;
      canvas.height = section.clientHeight * dpr;
      render();
    };
    resize();
    window.addEventListener("resize", resize);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const els = gsap.utils
        .toArray<HTMLElement>("[data-fhero]", section)
        .filter((el) => el.offsetParent !== null);
      gsap.fromTo(
        els,
        { opacity: 0, y: 34, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power4.out", stagger: 0.11, delay: 0.2 },
      );

      // pin the hero and let scroll play the film
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      });
      tl.to(
        seq,
        { frame: FRAME_COUNT - 1, snap: "frame", ease: "none", duration: 1, onUpdate: render },
        0,
      )
        .to("[data-fhero-progress]", { scaleX: 1, ease: "none", duration: 1 }, 0)
        .to("[data-fhero-copy]", { y: -34, ease: "none", duration: 1 }, 0)
        .to("[data-fhero-cue]", { opacity: 0, duration: 0.12 }, 0.02);
    });

    return () => {
      mm.revert();
      window.removeEventListener("resize", resize);
      images.forEach((img) => (img.onload = null));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-20 w-full overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* navy wash + edges so the copy reads over any frame */}
      <div className="absolute inset-0 bg-background/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.135 0.028 265 / 0.75), transparent 38%, oklch(0.12 0.025 265 / 0.85))",
        }}
      />
      <div className="absolute inset-0 grain-bg" />

      {/* copy rides a wider stage than the header container */}
      <div
        data-fhero-copy
        className="relative z-20 mx-auto flex h-full w-[min(94vw,1600px)] flex-col justify-between pt-32 pb-14"
      >
        <div>
          <span
            data-fhero
            className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime"
          >
            <Sparkles className="h-3.5 w-3.5" /> Interactive — your scroll drives the film
          </span>
          <h1 className="mt-7 leading-[0.92] text-foreground">
            <span
              data-fhero
              className="block font-display text-6xl font-semibold md:text-7xl xl:text-8xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              Scroll to run
            </span>
            <span
              data-fhero
              className="block font-display text-6xl font-semibold md:text-7xl xl:text-8xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              the build.
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-sm">
            <p data-fhero className="text-sm leading-relaxed text-foreground/70">
              This film is split into 240 stills — every few pixels of scroll turns the page to
              the next frame. Keep scrolling to play it through.
            </p>
            <p
              data-fhero
              className="mt-5 inline-flex items-baseline gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.24em] text-foreground/80"
            >
              Frame
              <span ref={counterRef} className="font-semibold text-gold tabular-nums">
                001
              </span>
              <span className="text-foreground/50 tabular-nums">/ {FRAME_COUNT}</span>
            </p>
          </div>
          <p className="text-right leading-[0.95]">
            <span
              data-fhero
              className="block font-playfair text-5xl italic text-gold md:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              one frame
            </span>
            <span
              data-fhero
              className="block font-playfair text-5xl italic text-gold md:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              at a time
            </span>
          </p>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-fhero-cue
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span className="scroll-cue-line" aria-hidden="true" />
        Scroll
      </div>

      {/* scrub progress hairline */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/5" aria-hidden="true">
        <div data-fhero-progress className="h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  );
}
