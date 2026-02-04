import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";
import { useBreathProgress } from "./useBreathProgress";

const RING_COUNT = 8;

export default function BreathingWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase } = useBreathingStore();
  const progress = useBreathProgress();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const ringsRef = useRef<THREE.Line[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    const frustumSize = 5;

    cameraRef.current = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    cameraRef.current.position.z = 5;

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const rings: THREE.Line[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const radius = 0.3 + i * 0.25;
      const segments = 64;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((segments + 1) * 3);

      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle) * radius;
        positions[j * 3 + 1] = Math.sin(angle) * radius;
        positions[j * 3 + 2] = 0;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8 - i * 0.08,
      });

      const ring = new THREE.Line(geometry, material);
      ring.userData = { baseRadius: radius, index: i };
      rings.push(ring);
      sceneRef.current.add(ring);
    }
    ringsRef.current = rings;

    function handleResize() {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const a = w / h;
      const fs = 5;
      cameraRef.current.left = (-fs * a) / 2;
      cameraRef.current.right = (fs * a) / 2;
      cameraRef.current.top = fs / 2;
      cameraRef.current.bottom = -fs / 2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      rendererRef.current?.dispose();
      if (container.contains(rendererRef.current?.domElement as Node)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let animationId: number;
    let time = 0;

    function animate() {
      time += 0.016;

      let breathScale = 1;
      switch (phase) {
        case "inhale":
          breathScale = 0.6 + progress * 0.6;
          break;
        case "holdIn":
          breathScale = 1.2;
          break;
        case "exhale":
          breathScale = 1.2 - progress * 0.6;
          break;
        case "holdOut":
          breathScale = 0.6;
          break;
      }

      ringsRef.current.forEach((ring, i) => {
        const offset = i * 0.15;
        const waveScale = breathScale + Math.sin(time * 2 - offset) * 0.05;
        ring.scale.setScalar(waveScale);

        const mat = ring.material as THREE.LineBasicMaterial;
        const baseOpacity = 0.8 - i * 0.08;
        mat.opacity = baseOpacity * (0.7 + breathScale * 0.3);
      });

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [phase, progress]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[var(--color-bg)]" />
  );
}
