import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";
import type { VisualProps } from "../types";

const orbData = [
  { pos: [-2, 1, 0], scale: 0.8, color: 0x6366f1 },
  { pos: [2, -1, -1], scale: 0.6, color: 0x8b5cf6 },
  { pos: [0, 2, -2], scale: 0.5, color: 0xa78bfa },
  { pos: [-1, -2, -1], scale: 0.7, color: 0x7c3aed },
  { pos: [1.5, 0.5, -0.5], scale: 0.4, color: 0xc4b5fd },
];

export default function FloatingOrbs({ isActive }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();
  const orbsRef = useRef<THREE.Mesh[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const progress = useMemo(() => {
    if (!pattern) return 0;
    const durations: Record<string, number> = {
      inhale: pattern.inhale,
      holdIn: pattern.holdIn,
      exhale: pattern.exhale,
      holdOut: pattern.holdOut,
    };
    const duration = durations[phase] || 1;
    return 1 - phaseTime / duration;
  }, [phase, phaseTime, pattern]);

  const breathScale = useMemo(() => {
    switch (phase) {
      case "inhale":
        return 1 + progress * 0.3;
      case "holdIn":
        return 1.3;
      case "exhale":
        return 1.3 - progress * 0.3;
      case "holdOut":
        return 1;
      default:
        return 1;
    }
  }, [phase, progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      100,
    );
    cameraRef.current.position.z = 10;

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    orbsRef.current = orbData.map(({ pos, scale, color }) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.scale.setScalar(scale);
      mesh.userData.baseScale = scale;
      mesh.userData.offset = Math.random() * Math.PI * 2;
      sceneRef.current!.add(mesh);
      return mesh;
    });

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
      orbsRef.current.forEach((orb) => {
        orb.geometry.dispose();
        (orb.material as THREE.Material).dispose();
      });
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !isActive ||
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;

      orbsRef.current.forEach((orb, i) => {
        // Gentle drift
        orb.position.x += Math.sin(time + i) * 0.002;
        orb.position.y += Math.cos(time + i * 0.7) * 0.002;

        // Keep orbs within bounds
        orb.position.x = Math.max(-4, Math.min(4, orb.position.x));
        orb.position.y = Math.max(-4, Math.min(4, orb.position.y));

        // Breath-synced scale
        const baseScale = orb.userData.baseScale;
        const targetScale = baseScale * breathScale;
        orb.scale.setScalar(orb.scale.x + (targetScale - orb.scale.x) * 0.05);

        // Opacity pulse
        const mat = orb.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.4 + Math.sin(time * 2 + orb.userData.offset) * 0.2;
      });

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, breathScale]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[var(--color-bg)]" />
  );
}
