import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

/**
 * RibbonSphere — a WebGL take on the reference: a sphere wrapped in glossy
 * white ribbons that swirl into a deep-navy core. The ribbons never stop
 * undulating ("vibrating"), the whole object slowly spins and leans toward
 * the cursor, and hovering the sphere itself swells it and amplifies the
 * wave. GSAP drives the render loop (ticker) and every interaction tween.
 */

const R = 1;
const PHI_0 = Math.PI * 0.08;
const PHI_1 = Math.PI * 0.92;
const U_SEGS = 64;
const V_SEGS = 4;

type RibbonSpec = {
  theta0: number;
  swirl: number;
  sCurve: number;
  width: number;
  radius: number;
  phase: number;
  waveFreq: number;
};

function buildSpecs(): { white: RibbonSpec[]; navy: RibbonSpec[] } {
  const white: RibbonSpec[] = [];
  const navy: RibbonSpec[] = [];
  const NW = 18;
  for (let i = 0; i < NW; i++) {
    white.push({
      theta0: (i / NW) * Math.PI * 2,
      swirl: 2.1,
      sCurve: 1.05,
      width: ((Math.PI * 2) / NW) * 0.85,
      radius: R,
      phase: i * 1.31,
      waveFreq: 4 + (i % 2),
    });
  }
  const NN = 12;
  for (let i = 0; i < NN; i++) {
    navy.push({
      theta0: (i / NN) * Math.PI * 2 + 0.35,
      swirl: -1.5,
      sCurve: -0.75,
      width: ((Math.PI * 2) / NN) * 0.7,
      radius: R * 0.88,
      phase: i * 2.09,
      waveFreq: 3 + (i % 2),
    });
  }
  return { white, navy };
}

function makeGlowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(190, 205, 245, 0.55)");
  grad.addColorStop(0.35, "rgba(140, 160, 220, 0.22)");
  grad.addColorStop(0.7, "rgba(210, 180, 110, 0.07)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function RibbonSphere({ className = "" }: { className?: string }) {
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
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    // studio-render look: filmic tone mapping + image-based lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.set(0, 0, 3.45);

    // HDR-ish environment for physically-based reflections on the ribbons
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    // directional key + cool fill: strong light/shadow falloff sells the 3D
    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(2.2, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4a6db8, 0.35);
    fill.position.set(-3, -1, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xe8be5c, 7, 0, 2);
    rim.position.set(-2.6, -1.6, 2.2);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // navy core showing through the ribbon gaps
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.78, 48, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0c131b,
        roughness: 0.7,
        metalness: 0.1,
        emissive: 0x070c12,
        emissiveIntensity: 0.5,
      }),
    );
    group.add(core);

    // soft glow behind everything
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    // must fade out inside the camera frustum, or the canvas shows as a square
    // sits top-right like the reference render's backlight
    glow.scale.setScalar(2.1);
    glow.position.set(0.5, 0.4, -0.45);
    scene.add(glow);

    // ribbon materials — dark navy with a baked gradient (vertex colors) and
    // a wet clearcoat so the key light reads as a bright glare streak
    // fully matte navy: no clearcoat, near-zero reflections — form comes
    // from diffuse shading only
    const outerMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.03,
      clearcoat: 0,
      envMapIntensity: 0.06,
      side: THREE.DoubleSide,
    });
    const innerMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.04,
      clearcoat: 0,
      envMapIntensity: 0.03,
      emissive: 0x02050c,
      emissiveIntensity: 0.25,
      side: THREE.DoubleSide,
    });

    // gradient stops bracket the requested colors so the gentle shading
    // averages to #121F3D outside and #0C131B inside
    const OUTER_TOP = new THREE.Color(0x1a2c52);
    const OUTER_BOT = new THREE.Color(0x0a1428);
    const INNER_TOP = new THREE.Color(0x0f1720);
    const INNER_BOT = new THREE.Color(0x090f16);
    const tmpC = new THREE.Color();

    // build ribbon meshes with plane geometries we reshape every frame
    const { white, navy } = buildSpecs();
    const specs = [...white, ...navy];
    const meshes: THREE.Mesh[] = specs.map((_spec, si) => {
      const geo = new THREE.PlaneGeometry(1, 1, U_SEGS, V_SEGS);
      const outer = si < white.length;
      const top = outer ? OUTER_TOP : INNER_TOP;
      const bot = outer ? OUTER_BOT : INNER_BOT;
      const colors = new Float32Array((U_SEGS + 1) * (V_SEGS + 1) * 3);
      let k = 0;
      for (let vi = 0; vi <= V_SEGS; vi++) {
        for (let ui = 0; ui <= U_SEGS; ui++) {
          const u = ui / U_SEGS;
          tmpC.copy(top).lerp(bot, Math.pow(u, 0.6));
          colors[k * 3] = tmpC.r;
          colors[k * 3 + 1] = tmpC.g;
          colors[k * 3 + 2] = tmpC.b;
          k++;
        }
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mesh = new THREE.Mesh(geo, outer ? outerMat : innerMat);
      group.add(mesh);
      return mesh;
    });

    const wave = { amp: 1 }; // hover multiplies this
    const pos = new THREE.Vector3();

    const updateRibbons = (t: number) => {
      specs.forEach((spec, si) => {
        const geo = meshes[si].geometry as THREE.PlaneGeometry;
        const positions = geo.attributes.position as THREE.BufferAttribute;
        const normals = geo.attributes.normal as THREE.BufferAttribute;
        let k = 0;
        for (let vi = 0; vi <= V_SEGS; vi++) {
          const v = vi / V_SEGS;
          for (let ui = 0; ui <= U_SEGS; ui++) {
            const u = ui / U_SEGS;
            const phi = PHI_0 + u * (PHI_1 - PHI_0);
            const sinPhi = Math.sin(phi);
            // swirl + S-curve along the ribbon, tapered width near the poles
            const thetaC =
              spec.theta0 + spec.swirl * (u - 0.5) + spec.sCurve * Math.sin(u * Math.PI);
            const taper = 0.35 + 0.65 * sinPhi;
            const theta = thetaC + (v - 0.5) * spec.width * taper;
            // the permanent vibration
            const r =
              spec.radius *
              (1 +
                wave.amp *
                  0.028 *
                  Math.sin(u * spec.waveFreq * Math.PI + t * 2.1 + spec.phase));
            pos.set(
              r * sinPhi * Math.cos(theta),
              r * Math.cos(phi),
              r * sinPhi * Math.sin(theta),
            );
            positions.setXYZ(k, pos.x, pos.y, pos.z);
            pos.normalize();
            normals.setXYZ(k, pos.x, pos.y, pos.z);
            k++;
          }
        }
        positions.needsUpdate = true;
        normals.needsUpdate = true;
      });
    };
    updateRibbons(0);

    // sizing
    const resize = () => {
      const s = Math.min(host.clientWidth, host.clientHeight) || 320;
      renderer.setSize(s, s);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // hover detection against a bounding sphere
    const hitProxy = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.06, 16, 12),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    group.add(hitProxy);
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(-2, -2);
    const mouseLean = { x: 0, y: 0 };
    let hovered = false;

    const ctx = gsap.context(() => {
      const leanX = gsap.quickTo(mouseLean, "x", { duration: 0.9, ease: "power2.out" });
      const leanY = gsap.quickTo(mouseLean, "y", { duration: 0.9, ease: "power2.out" });

      const onMove = (e: PointerEvent) => {
        // lean the sphere toward the cursor, wherever it is on screen
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        leanY(nx * 0.5);
        leanX(ny * 0.35);
        // hover check against the canvas
        const rect = renderer.domElement.getBoundingClientRect();
        ndc.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // entrance
      gsap.fromTo(
        group.scale,
        { x: 0.55, y: 0.55, z: 0.55 },
        { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.3)", delay: 0.25 },
      );
      gsap.to(glow.material, { opacity: 0.5, duration: 1.6, delay: 0.5 });
      // the glow breathes
      if (!reduceMotion) {
        gsap.to(glow.material, {
          opacity: 0.34,
          duration: 2.6,
          delay: 2.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      let autoRot = 0;
      let running = true;
      const render = () => {
        if (!running) return;
        const t = gsap.ticker.time;
        if (!reduceMotion) {
          autoRot += gsap.ticker.deltaRatio(60) * 0.0021;
          updateRibbons(t);
        }
        group.rotation.y = autoRot + mouseLean.y;
        group.rotation.x = mouseLean.x * 0.7;
        group.rotation.z = 0.16 + mouseLean.y * 0.1;

        // hover: swell + stronger vibration
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObject(hitProxy, false).length > 0;
        if (hit !== hovered) {
          hovered = hit;
          gsap.to(group.scale, {
            x: hit ? 1.04 : 1,
            y: hit ? 1.04 : 1,
            z: hit ? 1.04 : 1,
            duration: 0.7,
            ease: "power3.out",
          });
          gsap.to(wave, { amp: hit ? 1.6 : 1, duration: 0.8, ease: "power2.out" });
          gsap.to(glow.material, { opacity: hit ? 0.6 : 0.45, duration: 0.6 });
        }

        renderer.render(scene, camera);
      };
      gsap.ticker.add(render);

      // pause off-screen
      const io = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting;
      });
      io.observe(host);

      return () => {
        gsap.ticker.remove(render);
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
      };
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", resize);
      meshes.forEach((m) => m.geometry.dispose());
      outerMat.dispose();
      innerMat.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      hitProxy.geometry.dispose();
      (hitProxy.material as THREE.Material).dispose();
      (glow.material.map as THREE.Texture).dispose();
      glow.material.dispose();
      envTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    // graceful fallback to the CSS orb
    return (
      <div className={`relative grid place-items-center ${className}`}>
        <div className="hero-orb" />
        <div className="hero-ring" />
      </div>
    );
  }

  return <div ref={hostRef} className={`grid place-items-center ${className}`} />;
}
