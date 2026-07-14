import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { HeroDeck } from "./hero-deck";

const BG_IMAGE_1 =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80";
const BG_IMAGE_2 =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80";

const SPOTLIGHT_R = 260;

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: number;
  cursorY: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
    gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
    gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = canvas.toDataURL();
    reveal.style.maskImage = `url(${mask})`;
    (reveal.style as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage = `url(${mask})`;
    reveal.style.maskSize = "100% 100%";
    (reveal.style as CSSStyleDeclaration & { webkitMaskSize?: string }).webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export function LithosHero() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
      {/* Base image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />
      {/* Navy wash so imagery stays on-brand */}
      <div className="absolute inset-0 z-20 bg-background/70 pointer-events-none" />

      {/* Cursor-spotlight reveal layer */}
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Navy gradient vignette */}
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 20%, transparent 30%, oklch(0.12 0.025 265 / 0.75) 100%)",
        }}
      />

      {/* Heading */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-5 pointer-events-none md:pb-44">
        <span
          className="hero-anim hero-fade inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs uppercase tracking-[0.24em] text-lime pointer-events-auto"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Premium Software Studio
        </span>

        <h1 className="mt-7 text-foreground leading-[0.95] max-w-5xl">
          <span
            className="block font-display font-semibold text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
          >
            We engineer software
          </span>
          <span
            className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: "-0.04em", animationDelay: "0.42s" }}
          >
            that scales with you
          </span>
        </h1>

        <p
          className="mt-7 max-w-xl text-base sm:text-lg text-foreground/75 hero-anim hero-fade"
          style={{ animationDelay: "0.62s" }}
        >
          Northline designs, builds, and grows enterprise-grade web platforms,
          apps, and AI products — one senior team, from strategy to scale.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 pointer-events-auto hero-anim hero-fade"
          style={{ animationDelay: "0.8s" }}
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full btn-navy shine px-7 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-lime/40"
          >
            Book a Call
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            View Our Work
          </Link>
        </div>
      </div>

      {/* Cursor hint (sits above the deck) */}
      <div
        className="hidden md:flex absolute bottom-62 left-1/2 -translate-x-1/2 z-50 items-center gap-2 text-xs uppercase tracking-[0.24em] text-foreground/50 hero-anim hero-fade"
        style={{ animationDelay: "1s" }}
      >
        <span className="h-2 w-2 rounded-full bg-lime animate-float" />
        Move your cursor to explore
      </div>

      {/* Fanned work deck along the fold */}
      <HeroDeck />
    </section>
  );
}
