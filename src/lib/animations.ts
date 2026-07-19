import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global cursor glare: writes the real cursor position into CSS vars on every
 * `.glare-card`, so the gold sheen (styles.css) is anchored in page space and
 * travels continuously from one card onto the next as the mouse moves.
 */
function initGlare(): () => void {
  if (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return () => {};
  }

  const REACH = 320; // px beyond a card's edge where its glare stays live
  let cards: HTMLElement[] = [];
  let raf = 0;
  let active = false;
  let idleFrames = 0;
  const mouse = { x: -1e4, y: -1e4 };
  const eased = { x: -1e4, y: -1e4 };

  const tick = () => {
    eased.x += (mouse.x - eased.x) * 0.25;
    eased.y += (mouse.y - eased.y) * 0.25;

    // batch reads, then writes
    const rects = cards.map((c) => c.getBoundingClientRect());
    rects.forEach((r, i) => {
      const c = cards[i];
      const near =
        eased.x > r.left - REACH &&
        eased.x < r.right + REACH &&
        eased.y > r.top - REACH &&
        eased.y < r.bottom + REACH;
      if (near) {
        c.style.setProperty("--gx", `${eased.x - r.left}px`);
        c.style.setProperty("--gy", `${eased.y - r.top}px`);
        c.style.setProperty("--glare-o", "1");
      } else if (c.style.getPropertyValue("--glare-o") === "1") {
        c.style.setProperty("--glare-o", "0");
      }
    });

    const settled = Math.abs(mouse.x - eased.x) < 0.3 && Math.abs(mouse.y - eased.y) < 0.3;
    if (settled && ++idleFrames > 40) {
      active = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    idleFrames = 0;
    if (!active) {
      active = true;
      cards = Array.from(document.querySelectorAll<HTMLElement>(".glare-card"));
      raf = requestAnimationFrame(tick);
    }
  };
  const onMove = (e: PointerEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    wake();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", wake, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", wake);
    cancelAnimationFrame(raf);
  };
}

/**
 * Cursor-magnetic pull for primary CTAs (`data-magnetic`). The element eases
 * toward the pointer while hovered and springs home on leave. Uses gsap
 * quickTo so every move is a retargeted tween on the compositor.
 */
function initMagnetic(): () => void {
  if (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return () => {};
  }

  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.35");
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.55)" });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

/**
 * Site-wide motion. Reads declarative attributes:
 * - `data-reveal`            blur-dissolve reveal of a whole block
 * - `data-reveal-group`      staggers `data-reveal-child` descendants
 * - `data-split`             masked word-by-word heading reveal
 * - `data-slide="left|right"` slides in from a side (comparison panels)
 * - `data-timeline-line`     scroll-scrubbed line draw
 * - `data-parallax="0.2"`    scrubbed vertical drift (fraction of viewport;
 *                            negative drifts up). Transform-only.
 * - `data-parallax-img`      inner image drift inside an overflow-hidden frame
 * - `data-cards` + `data-card`  3D card-entry: children rise with perspective
 *                            tilt, staggered. Set `data-cards-stagger` to tune.
 * - `data-scatter` + `data-scatter-item`  elements start flung outward with
 *                            rotation and assemble into place on scroll.
 *                            Optional per-item `data-scatter="x,y,rot"`.
 * - `data-counter`           counts numeric text up from 0 on first view.
 *                            Keeps prefix/suffix (e.g. "+48%", "3.1×").
 * - `data-magnetic`          cursor-magnetic pull (buttons, chips)
 * - `data-hscroll` + `data-hscroll-track`  pinned section, track scrubs sideways
 * - `data-pin-steps` (+ `data-pin-step` / `data-pin-panel`)  sticky panel
 *                            cross-fades to match the step scrolling past
 * - `data-typewriter` + `data-typewriter-line`  terminal lines type out in turn
 * - `data-dial-arc="0.8"` / `data-dial-needle="30"`  SVG gauge sweep
 * - `data-draw` (= "scrub" for scrubbed)  SVG stroke draws itself in
 * Plus the `.glare-card` cursor glare engine.
 *
 * Perf rules: scrubbed tweens animate transform/opacity only (no filter),
 * one-shot entrances may blur. Everything respects prefers-reduced-motion.
 */
/**
 * SiteShell and many pages both call useScrollReveal(); a module refcount
 * makes exactly ONE instance own the GSAP context. Without this, counters
 * get processed twice (the second pass reads the already-zeroed text as the
 * target and animates everything to 0) and StrictMode remounts killed all
 * animations permanently.
 */
let scrollRevealInstances = 0;

export function useScrollReveal() {
  useEffect(() => {
    scrollRevealInstances++;
    if (scrollRevealInstances > 1) {
      return () => {
        scrollRevealInstances--;
      };
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disposeGlare = initGlare();
    const disposeMagnetic = initMagnetic();
    if (reduceMotion) {
      return () => {
        scrollRevealInstances--;
        disposeGlare();
        disposeMagnetic();
      };
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
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
          { opacity: 0, y: 36, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Masked word reveal — plain-text headings only
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (el.dataset.splitDone) return;
        el.dataset.splitDone = "1";
        const text = (el.textContent ?? "").trim();
        el.setAttribute("aria-label", text);
        el.innerHTML = text
          .split(/\s+/)
          .map(
            (w) =>
              `<span class="split-w" aria-hidden="true"><span class="split-i">${w}</span></span>`,
          )
          .join(" ");
        gsap.fromTo(
          el.querySelectorAll(".split-i"),
          { yPercent: 115, rotate: 3 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-slide]").forEach((el) => {
        const dir = el.dataset.slide === "right" ? 44 : -44;
        gsap.fromTo(
          el,
          { opacity: 0, x: dir },
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Scrubbed vertical parallax — pure transform, compositor-only
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.2");
        gsap.fromTo(
          el,
          { y: () => speed * -0.5 * window.innerHeight },
          {
            y: () => speed * 0.5 * window.innerHeight,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Inner-image drift: image is ~16% taller than its frame and slides
      // within it while the frame crosses the viewport
      gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((el) => {
        // The image is scaled 1.16 and drifts ±8%, so it MUST be clipped by its
        // frame — otherwise it spills out and overlaps neighbouring content.
        // Enforce it on the parent here so every call site is safe regardless of
        // its own classes; inherit the image's own rounding so corners stay round.
        const frame = el.parentElement;
        if (frame) {
          frame.style.overflow = "hidden";
          const radius = getComputedStyle(el).borderRadius;
          if (radius && radius !== "0px") frame.style.borderRadius = radius;
        }
        gsap.fromTo(
          el,
          { yPercent: -8, scale: 1.16 },
          {
            yPercent: 8,
            scale: 1.16,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // 3D card entry: perspective tilt-up, staggered across the row
      gsap.utils.toArray<HTMLElement>("[data-cards]").forEach((el) => {
        const cards = el.querySelectorAll<HTMLElement>("[data-card]");
        if (!cards.length) return;
        gsap.set(el, { perspective: 900 });
        gsap.fromTo(
          cards,
          { opacity: 0, y: 72, rotateX: -14, scale: 0.96, transformOrigin: "50% 100%" },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.15,
            ease: "power4.out",
            force3D: true,
            stagger: parseFloat(el.dataset.cardsStagger || "0.09"),
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Scattered elements assemble as the section scrolls through.
      // Deterministic pseudo-random flings (seeded by index) unless the item
      // provides its own `data-scatter="x,y,rot"`.
      gsap.utils.toArray<HTMLElement>("[data-scatter]").forEach((el) => {
        const items = el.querySelectorAll<HTMLElement>("[data-scatter-item]");
        if (!items.length) return;
        items.forEach((item, i) => {
          let x: number, y: number, rot: number;
          const spec = item.dataset.scatterItem;
          if (spec && spec.includes(",")) {
            [x, y, rot] = spec.split(",").map(Number);
          } else {
            // golden-angle spread → organic but stable scatter
            const a = i * 2.39996;
            x = Math.cos(a) * (120 + (i % 3) * 90);
            y = Math.sin(a) * 70 + 140;
            rot = ((i * 47) % 24) - 12;
          }
          gsap.fromTo(
            item,
            { x, y, rotate: rot, opacity: 0 },
            {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 40%",
                scrub: 0.7,
              },
            },
          );
        });
      });

      // Count-up numbers — parses "3.1×", "+48%", "120", keeps affixes.
      // The true value is stashed in data-counter-value so re-inits (client
      // nav, StrictMode) never mistake an in-flight "0" for the target.
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const raw = (el.dataset.counterValue ?? el.textContent ?? "").trim();
        const m = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
        if (!m) return;
        el.dataset.counterValue = raw;
        const [, prefix, num, suffix] = m;
        const target = parseFloat(num);
        const decimals = num.includes(".") ? num.split(".")[1].length : 0;
        const state = { v: 0 };
        el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
          onUpdate() {
            el.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
          },
          onComplete() {
            el.textContent = raw;
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-timeline-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });

      // Horizontal pin: section pins while its data-hscroll-track scrubs
      // sideways. Track width beyond the viewport sets the scroll distance.
      gsap.utils.toArray<HTMLElement>("[data-hscroll]").forEach((el) => {
        const track = el.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track) return;
        const distance = () => track.scrollWidth - el.clientWidth;
        if (distance() <= 0) return;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      // Sticky step narrative: panels inside data-pin-panel cross-fade as the
      // matching data-pin-step blocks scroll past. Purely class/opacity based.
      gsap.utils.toArray<HTMLElement>("[data-pin-steps]").forEach((el) => {
        const panels = el.querySelectorAll<HTMLElement>("[data-pin-panel]");
        const steps = el.querySelectorAll<HTMLElement>("[data-pin-step]");
        if (!panels.length || panels.length !== steps.length) return;
        gsap.set(panels, { opacity: 0, y: 24, scale: 0.98 });
        gsap.set(panels[0], { opacity: 1, y: 0, scale: 1 });
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onToggle(self) {
              if (!self.isActive) return;
              panels.forEach((p, j) => {
                gsap.to(p, {
                  opacity: j === i ? 1 : 0,
                  y: j === i ? 0 : 24,
                  scale: j === i ? 1 : 0.98,
                  duration: 0.45,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              });
              steps.forEach((s, j) => s.classList.toggle("pin-step-active", j === i));
            },
          });
        });
      });

      // Terminal typewriter: children with data-typewriter-line type out in
      // sequence when the container scrolls into view.
      gsap.utils.toArray<HTMLElement>("[data-typewriter]").forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>("[data-typewriter-line]");
        if (!lines.length) return;
        const originals = Array.from(lines).map((l) => l.textContent ?? "");
        lines.forEach((l) => {
          l.textContent = "";
          l.style.visibility = "hidden";
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter() {
            const tl = gsap.timeline();
            lines.forEach((line, i) => {
              const text = originals[i];
              const state = { n: 0 };
              tl.set(line, { visibility: "visible" });
              tl.to(state, {
                n: text.length,
                duration: Math.min(1.1, 0.28 + text.length * 0.016),
                ease: "none",
                onUpdate() {
                  line.textContent = text.slice(0, Math.round(state.n));
                },
              });
              tl.to({}, { duration: 0.12 });
            });
          },
        });
      });

      // Arc dial: sweeps an SVG arc stroke (via stroke-dashoffset) and its
      // optional needle (data-dial-needle, rotation in `data-dial="deg"`).
      gsap.utils.toArray<SVGPathElement>("[data-dial-arc]").forEach((arc) => {
        const len = arc.getTotalLength();
        arc.style.strokeDasharray = `${len}`;
        arc.style.strokeDashoffset = `${len}`;
        gsap.to(arc, {
          strokeDashoffset: len * (1 - parseFloat(arc.dataset.dialArc || "1")),
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: arc, start: "top 85%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-dial-needle]").forEach((el) => {
        gsap.fromTo(
          el,
          { rotation: parseFloat(el.dataset.dialFrom || "-120"), transformOrigin: "50% 100%" },
          {
            rotation: parseFloat(el.dataset.dialNeedle || "0"),
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });

      // SVG line draw: strokes draw in on scroll (charts, ECG, pipelines).
      // Scrubbed when data-draw="scrub", one-shot otherwise.
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((path) => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        const scrubbed = path.dataset.draw === "scrub";
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: scrubbed ? "none" : "power2.inOut",
          duration: scrubbed ? 1 : 1.8,
          scrollTrigger: scrubbed
            ? { trigger: path, start: "top 85%", end: "top 30%", scrub: 0.6 }
            : { trigger: path, start: "top 85%", toggleActions: "play none none none" },
        });
      });
    });

    // Refresh once fonts/images load, and once more after hydration settles
    // (the preloader + late images shift trigger positions).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, 1200);

    return () => {
      scrollRevealInstances--;
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      ctx.revert();
      // Restore counter originals so the next init reads true targets.
      document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        if (el.dataset.counterValue) el.textContent = el.dataset.counterValue;
      });
      disposeGlare();
      disposeMagnetic();
    };
  }, []);
}

export { gsap, ScrollTrigger };
