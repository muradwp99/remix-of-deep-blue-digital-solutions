import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Auto reveal any element with `data-reveal` on scroll.
 * Also stagger children with `data-reveal-child`.
 */
export function useScrollReveal() {
  const ready = useRef(false);
  useEffect(() => {
    if (ready.current) return;
    ready.current = true;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((el) => {
        const kids = el.querySelectorAll<HTMLElement>("[data-reveal-child]");
        if (!kids.length) return;
        gsap.fromTo(
          kids,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    });

    // Refresh once fonts/images load
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);
}

export { gsap, ScrollTrigger };
