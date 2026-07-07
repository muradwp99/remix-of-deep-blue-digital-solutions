import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Interactive 3D hero: an icosahedron wireframe orb + particle field.
 * GSAP ScrollTrigger scrubs rotation/scale/position as user scrolls.
 */
export function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Orb: icosahedron with gradient-ish shader material
    const geometry = new THREE.IcosahedronGeometry(1.6, 4);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8ab4ff"),
      wireframe: true,
      metalness: 0.4,
      roughness: 0.2,
      emissive: new THREE.Color("#1a2a6b"),
      emissiveIntensity: 0.6,
    });
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#d4ff7a"),
      transparent: true,
      opacity: 0.12,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Particles
    const pCount = 800;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color("#c9a84c"),
      size: 0.025,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xbcd4ff, 1.4);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xd4ff7a, 0.8);
    dir2.position.set(-3, -2, 2);
    scene.add(dir2);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // Animate
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      orb.rotation.y += 0.003;
      orb.rotation.x += 0.001;
      core.rotation.y -= 0.005;
      core.rotation.z += 0.003;
      particles.rotation.y = t * 0.02;

      // Parallax
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // GSAP scroll: scrub the orb's transform based on hero scroll
    const st = ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        orb.scale.setScalar(1 - p * 0.4);
        orb.position.y = -p * 1.2;
        orb.rotation.z = p * Math.PI * 0.6;
        core.scale.setScalar(1 + p * 0.6);
        (pMat as THREE.PointsMaterial).opacity = 0.7 - p * 0.5;
      },
    });

    // Entrance
    gsap.from(orb.scale, { x: 0, y: 0, z: 0, duration: 1.6, ease: "power3.out" });
    gsap.from(particles.material, { opacity: 0, duration: 2, ease: "power2.out" });

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      st.kill();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}
