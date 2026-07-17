import { useEffect, useState } from "react";
import { AuxtechMark } from "./auxtech-logo";
import gsap from "gsap";

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nl-preloaded") === "1") {
      setDone(true);
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("nl-preloaded", "1");
        setDone(true);
      },
    });
    tl.to("#pl-count", {
      innerText: 100,
      duration: 1.6,
      ease: "power2.out",
      snap: { innerText: 1 },
    })
      .to("#pl-bar", { scaleX: 1, duration: 1.6, ease: "power2.out" }, 0)
      .to(
        "#pl-mark",
        { rotate: 180, duration: 1.6, ease: "power2.inOut" },
        0,
      )
      .to("#pl-wrap", {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.2,
      })
      // entrance animation for page. clearProps removes the leftover inline
      // transform — a transformed <main> becomes the containing block for
      // position:fixed children and silently breaks ScrollTrigger pinning
      .fromTo(
        "[data-entrance]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform",
        },
        "-=0.5",
      );

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="pl-wrap"
      className="fixed inset-0 z-10000 grid place-items-center bg-background"
    >
      <div className="absolute inset-0 grain-bg opacity-60 pointer-events-none" />
      <div className="relative w-full max-w-md px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div id="pl-mark" className="grid h-9 w-9 place-items-center">
              <AuxtechMark className="h-9 w-9 text-foreground" />
            </div>
            <span className="font-display text-lg">Auxtech</span>
          </div>
          <div className="font-display text-sm tabular-nums">
            <span id="pl-count">0</span>%
          </div>
        </div>
        <div className="h-[2px] w-full bg-surface-2 overflow-hidden rounded-full">
          <div
            id="pl-bar"
            className="h-full w-full bg-gradient-to-r from-lime to-gold origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          A studio, not a factory
        </p>
      </div>
    </div>
  );
}
