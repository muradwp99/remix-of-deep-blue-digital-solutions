import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/animations";

/**
 * EclipseScene — a WebGL eclipse sunrise for the services hero. An
 * orthographic, pixel-mapped scene: a shader planet whose gold-ember rim
 * gradient drifts along the arc, an additive atmosphere halo that breathes,
 * a pulsing sun-point with a lens streak, and gold dust motes rising off the
 * crest. Three depth layers lean toward the cursor for parallax. Falls back
 * to the CSS eclipse when WebGL is unavailable.
 *
 * Renders inside `.eclipse-stage` (which also carries the GSAP entrance and
 * scroll-parallax tweens); the canvas overflows the stage downward so the
 * planet body sits behind the stat cards, and the planet shader fades to
 * transparent before the canvas bottom so there is never a hard seam.
 */

const CANVAS_H = 900;
const CREST_PX = 26; // crest offset from stage top — mirrors --ecl-top
// the canvas extends this far ABOVE the stage so the flare/haze have sky to
// bloom into instead of clipping at the canvas edge
const TOP_EXTEND = 170;

const ECLIPSE_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

// Shading is driven by pixel distance to the disc edge (not fresnel): only
// the top band of the huge sphere is ever on screen, so every visible
// fragment is near the silhouette and a normal-based fresnel would wash the
// whole planet in rim colour. Distance gives CSS-gradient-exact control.
const PLANET_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uFadeStart;
  uniform float uFadeEnd;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uScroll;
  varying vec3 vWorld;
  void main() {
    float dist = distance(vWorld.xy, uCenter);
    float dIn = max(uRadius - dist, 0.0); // px inside from the rim
    vec2 rim = normalize(vWorld.xy - uCenter + vec2(1e-4));
    float topness = rim.y;
    // glow confined to the crest, dying toward the sides like the reference
    float mask = smoothstep(0.25, 0.95, topness);
    float rimGlow = exp(-dIn / 70.0);
    float hair = exp(-dIn / 5.0);
    // near-black navy body, darkest deep inside the disc
    vec3 base = mix(vec3(0.010, 0.013, 0.026), vec3(0.004, 0.006, 0.013), clamp(dIn / (uRadius * 0.7), 0.0, 1.0));
    // deep-blue <-> ice-blue gradient sliding along the rim; deepens on scroll
    float drift = 0.5 + 0.5 * sin(uTime * 0.35 + rim.x * 2.2);
    vec3 cool = mix(vec3(0.07, 0.16, 0.42), vec3(0.36, 0.55, 0.95), drift);
    cool = mix(cool, vec3(0.05, 0.10, 0.30), uScroll * 0.55);
    // cursor lobe: the rim ignites where the pointer's angle meets the arc
    vec2 pdir = normalize(uPointer - uCenter + vec2(1e-4));
    float lobe = smoothstep(0.955, 0.998, dot(pdir, rim)) * uHover;
    vec3 col = base
      + cool * rimGlow * mask * (0.5 + lobe * 0.9)
      + vec3(0.72, 0.82, 1.0) * hair * mask * (0.85 + lobe * 0.9);
    // dissolve to transparent well below the crest — no seam at canvas edge
    float fade = smoothstep(uFadeEnd, uFadeStart, vWorld.y);
    gl_FragColor = vec4(col, fade);
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uFadeStart;
  uniform float uFadeEnd;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uScroll;
  varying vec3 vWorld;
  void main() {
    float dist = distance(vWorld.xy, uCenter);
    float dOut = dist - uRadius; // px outside the rim
    float falloff = dOut > 0.0 ? 52.0 : 24.0;
    float halo = exp(-abs(dOut) / falloff);
    vec2 rim = normalize(vWorld.xy - uCenter + vec2(1e-4));
    float topness = rim.y;
    float mask = smoothstep(0.2, 0.92, topness);
    float breathe = (0.75 + 0.2 * sin(uTime * 0.7)) * (1.0 - uScroll * 0.35);
    // animated blue gradient travelling around the arc; dims as you scroll
    float ang = atan(rim.x, rim.y);
    vec3 deep = vec3(0.10, 0.22, 0.60);
    vec3 ice = vec3(0.45, 0.65, 1.0);
    vec3 c = mix(deep, ice, 0.5 + 0.5 * sin(uTime * 0.45 + ang * 3.0));
    c = mix(c, deep * 0.7, uScroll * 0.5);
    // cursor lobe mirrors the planet shader's
    vec2 pdir = normalize(uPointer - uCenter + vec2(1e-4));
    float lobe = smoothstep(0.955, 0.998, dot(pdir, rim)) * uHover;
    float fade = smoothstep(uFadeEnd, uFadeStart, vWorld.y);
    float a = halo * mask * breathe * fade * (0.62 + lobe * 1.1);
    gl_FragColor = vec4(c, a);
  }
`;

function makeRadialTexture(stops: Array<[number, string]>, size = 256): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function makeStreakTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 16;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "rgba(150,185,255,0)");
  grad.addColorStop(0.3, "rgba(150,185,255,0.45)");
  grad.addColorStop(0.5, "rgba(235,244,255,0.95)");
  grad.addColorStop(0.7, "rgba(150,185,255,0.45)");
  grad.addColorStop(1, "rgba(150,185,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 16);
  return new THREE.CanvasTexture(c);
}

const DUST_COUNT = 130;

export function EclipseScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5000);
    camera.position.z = 2000;

    const uTime = { value: 0 };
    const uFadeStart = { value: 0 };
    const uFadeEnd = { value: 0 };
    const uCenter = { value: new THREE.Vector2() };
    const uRadius = { value: 1 };
    const uPointer = { value: new THREE.Vector2(1e5, 1e5) };
    const uHover = { value: 0 };
    const uScroll = { value: 0 };
    const sharedUniforms = { uTime, uFadeStart, uFadeEnd, uCenter, uRadius, uPointer, uHover, uScroll };

    // three parallax layers, leaning by different amounts
    const gPlanet = new THREE.Group();
    const gFx = new THREE.Group();
    const gDust = new THREE.Group();
    scene.add(gPlanet, gFx, gDust);

    // ---- planet + atmosphere ----
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: ECLIPSE_VERT,
      fragmentShader: PLANET_FRAG,
      uniforms: sharedUniforms,
      transparent: true,
      depthWrite: false,
    });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 80), planetMat);
    planet.renderOrder = 1;
    gPlanet.add(planet);

    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ECLIPSE_VERT,
      fragmentShader: ATMO_FRAG,
      uniforms: sharedUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 80), atmoMat);
    atmo.renderOrder = 0;
    gPlanet.add(atmo);

    // ---- sun flare, streak, wide haze ----
    const flareTex = makeRadialTexture([
      [0, "rgba(240,248,255,1)"],
      [0.12, "rgba(190,215,255,0.85)"],
      [0.3, "rgba(120,160,255,0.42)"],
      [0.55, "rgba(70,110,230,0.14)"],
      [1, "rgba(0,0,0,0)"],
    ]);
    const flare = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flareTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    flare.scale.setScalar(190);
    flare.renderOrder = 3;
    gFx.add(flare);

    const hazeTex = makeRadialTexture([
      [0, "rgba(90,140,255,0.45)"],
      [0.5, "rgba(50,90,210,0.14)"],
      [1, "rgba(0,0,0,0)"],
    ]);
    const haze = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: hazeTex,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    haze.scale.set(920, 340, 1);
    haze.renderOrder = 2;
    gFx.add(haze);

    const streakTex = makeStreakTexture();
    const streak = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: streakTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    streak.scale.set(560, 4, 1);
    streak.renderOrder = 4;
    gFx.add(streak);

    // ---- rising gold dust off the crest ----
    const dotTex = makeRadialTexture(
      [
        [0, "rgba(210,228,255,1)"],
        [0.4, "rgba(150,190,255,0.6)"],
        [1, "rgba(0,0,0,0)"],
      ],
      32,
    );
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const motes = Array.from({ length: DUST_COUNT }, () => ({
      ang: (Math.random() - 0.5) * 1.15, // radians from the crest
      off: Math.random() * 150,          // px beyond the rim
      speed: 8 + Math.random() * 16,     // px/s outward
      sway: Math.random() * Math.PI * 2,
    }));
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        map: dotTex,
        color: 0xbcd2ff,
        size: 2.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    dust.renderOrder = 5;
    gDust.add(dust);

    // ---- layout (pixel-mapped orthographic) ----
    let W = 0;
    let R = 0;
    let crestY = 0;
    const planetCenter = new THREE.Vector2();

    const layout = () => {
      W = host.clientWidth || window.innerWidth;
      renderer.setSize(W, CANVAS_H);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = CANVAS_H / 2;
      camera.bottom = -CANVAS_H / 2;
      camera.updateProjectionMatrix();

      // mirror the CSS sizing: diameter min(190vw | 150vw, 1900px)
      R = Math.min(W * (W < 768 ? 0.95 : 0.75), 950);
      crestY = CANVAS_H / 2 - CREST_PX - TOP_EXTEND;
      planetCenter.set(0, crestY - R);

      planet.scale.setScalar(R);
      atmo.scale.setScalar(R * 1.25); // room for the halo's outward falloff
      planet.position.set(0, planetCenter.y, 0);
      atmo.position.set(0, planetCenter.y, 0);
      flare.position.set(0, crestY + 2, 40);
      haze.position.set(0, crestY + 20, 20);
      streak.position.set(0, crestY + 2, 50);
      uFadeStart.value = crestY - 340;
      uFadeEnd.value = crestY - 700;
      uCenter.value.set(0, planetCenter.y);
      uRadius.value = R;
    };
    layout();
    window.addEventListener("resize", layout);

    const placeMote = (i: number, m: (typeof motes)[number]) => {
      const r = uRadius.value + 4 + m.off;
      dustPos[i * 3] = planetCenter.x + Math.sin(m.ang) * r + Math.sin(m.sway + uTime.value) * 6;
      dustPos[i * 3 + 1] = planetCenter.y + Math.cos(m.ang) * r;
      dustPos[i * 3 + 2] = 30;
    };
    motes.forEach((m, i) => placeMote(i, m));
    dustGeo.attributes.position.needsUpdate = true;

    // ---- motion ----
    const lean = { x: 0 };
    const sunset = { v: 0 }; // scroll progress: the eclipse closes as you leave
    const pointer = new THREE.Vector2(1e5, 1e5); // canvas world coords
    let hoverV = 0;
    let removePointerMove: (() => void) | undefined;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const leanTo = gsap.quickTo(lean, "x", { duration: 1.1, ease: "power2.out" });
        const onMove = (e: PointerEvent) => {
          leanTo(((e.clientX / window.innerWidth) * 2 - 1) * 14);
          // pointer in canvas world space, for the rim's cursor lobe
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.set(
            e.clientX - rect.left - rect.width / 2,
            rect.height / 2 - (e.clientY - rect.top),
          );
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        removePointerMove = () => window.removeEventListener("pointermove", onMove);

        // scrolling out of the hero closes the eclipse: planet swells, the
        // sun sinks behind the rim and everything cools and dims
        gsap.to(sunset, {
          v: 1,
          ease: "none",
          scrollTrigger: {
            trigger: host.closest("section") ?? host,
            start: "top top",
            end: "bottom 40%",
            scrub: true,
          },
        });
      }

      let running = true;
      let stillFrames = 0;
      const render = () => {
        if (!running) return;
        if (!reduceMotion) {
          const t = gsap.ticker.time;
          uTime.value = t;
          uScroll.value = sunset.v;

          // scroll: the planet swells and swallows the sun
          const eff = R * (1 + sunset.v * 0.05);
          planet.scale.setScalar(eff);
          atmo.scale.setScalar(eff * 1.25);
          uRadius.value = eff;
          const crest = planetCenter.y + eff;
          flare.position.y = crest + 2 - sunset.v * 85;
          streak.position.y = flare.position.y;
          haze.position.y = crest + 20;

          // hover: glare wakes as the cursor approaches the rim
          const dRim = Math.abs(
            Math.hypot(pointer.x - uCenter.value.x, pointer.y - uCenter.value.y) - eff,
          );
          hoverV += (Math.exp(-dRim / 200) - hoverV) * 0.08;
          uHover.value = hoverV;
          uPointer.value.copy(pointer);

          const pulse = Math.sin(t * 1.15);
          const flareMat = flare.material as THREE.SpriteMaterial;
          flareMat.opacity = (0.6 + 0.1 * pulse) * (1 - sunset.v * 0.75) * (1 + hoverV * 0.5);
          flare.scale.setScalar((190 + 16 * pulse) * (1 - sunset.v * 0.25));
          streak.material.opacity = (0.55 + 0.1 * pulse) * (1 - sunset.v * 0.8);
          dust.material.opacity = 0.5 * (1 - sunset.v * 0.6);
          haze.material.opacity = 0.22 * (1 - sunset.v * 0.5);

          const dt = gsap.ticker.deltaRatio(60) / 60;
          motes.forEach((m, i) => {
            m.off += m.speed * dt;
            if (m.off > 160) {
              m.off = Math.random() * 8;
              m.ang = (Math.random() - 0.5) * 1.15;
            }
            placeMote(i, m);
          });
          dustGeo.attributes.position.needsUpdate = true;

          gPlanet.position.x = lean.x;
          gFx.position.x = lean.x * 1.6;
          gDust.position.x = lean.x * 1.25;
          // rim shading is computed from the disc centre in world space, so
          // it must follow the parallax lean
          uCenter.value.x = lean.x;
        } else if (++stillFrames > 3) {
          // static scene rendered; stop burning GPU
          running = false;
        }
        renderer.render(scene, camera);
      };
      gsap.ticker.add(render);

      const io = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting && (!reduceMotion || stillFrames <= 3);
      });
      io.observe(host);

      return () => {
        gsap.ticker.remove(render);
        io.disconnect();
        removePointerMove?.();
      };
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", layout);
      planet.geometry.dispose();
      atmo.geometry.dispose();
      planetMat.dispose();
      atmoMat.dispose();
      dustGeo.dispose();
      (dust.material as THREE.Material).dispose();
      streak.geometry.dispose();
      (streak.material as THREE.Material).dispose();
      flare.material.dispose();
      haze.material.dispose();
      flareTex.dispose();
      hazeTex.dispose();
      streakTex.dispose();
      dotTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    // graceful fallback: the pure-CSS eclipse
    return (
      <>
        <div className="eclipse-haze" />
        <div className="eclipse-glow" />
        <div className="eclipse-sphere" />
        <div className="eclipse-flare" />
      </>
    );
  }

  return (
    <div
      ref={hostRef}
      className="absolute left-0 right-0 overflow-visible"
      style={{ height: CANVAS_H, top: -TOP_EXTEND }}
    />
  );
}
