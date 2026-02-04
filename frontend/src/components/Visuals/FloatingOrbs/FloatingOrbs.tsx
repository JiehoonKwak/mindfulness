import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";
import type { VisualProps } from "../types";

function createRing(radius: number, segments: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function createPolygon(radius: number, sides: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export default function FloatingOrbs({ isActive }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();
  const shapesRef = useRef<THREE.Line[]>([]);
  const materialsRef = useRef<THREE.LineBasicMaterial[]>([]);
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
      case "inhale": return 0.8 + progress * 0.4;
      case "holdIn": return 1.2;
      case "exhale": return 1.2 - progress * 0.4;
      case "holdOut": return 0.8;
      default: return 1.0;
    }
  }, [phase, progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    cameraRef.current.position.z = 6;

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    const dimMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });

    materialsRef.current = [lineMaterial, dimMaterial];

    // Create nested sacred geometry
    const shapes: THREE.Line[] = [];

    // Outer circles
    [2.2, 2.0, 1.8].forEach((r, i) => {
      const geo = createRing(r, 64);
      const line = new THREE.Line(geo, i === 1 ? lineMaterial : dimMaterial);
      line.userData = { baseRadius: r, type: "circle", speed: 0.1 + i * 0.05 };
      shapes.push(line);
      sceneRef.current!.add(line);
    });

    // Triangles (3 nested)
    [1.5, 1.2, 0.9].forEach((r, i) => {
      const geo = createPolygon(r, 3);
      const line = new THREE.Line(geo, i === 0 ? lineMaterial : dimMaterial);
      line.userData = { baseRadius: r, type: "triangle", speed: -0.15 - i * 0.05, rotOffset: i * Math.PI / 3 };
      shapes.push(line);
      sceneRef.current!.add(line);
    });

    // Hexagons (2 nested)
    [1.4, 1.0].forEach((r, i) => {
      const geo = createPolygon(r, 6);
      const line = new THREE.Line(geo, i === 0 ? lineMaterial : dimMaterial);
      line.userData = { baseRadius: r, type: "hexagon", speed: 0.08 + i * 0.04 };
      shapes.push(line);
      sceneRef.current!.add(line);
    });

    // Inner flower of life hint (small circles)
    const flowerRadius = 0.4;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const geo = createRing(flowerRadius, 32);
      const line = new THREE.Line(geo, dimMaterial);
      line.position.set(
        Math.cos(angle) * flowerRadius * 1.5,
        Math.sin(angle) * flowerRadius * 1.5,
        0
      );
      line.userData = { baseRadius: flowerRadius, type: "flower", speed: 0.05, index: i };
      shapes.push(line);
      sceneRef.current!.add(line);
    }

    // Center circle
    const centerGeo = createRing(0.3, 32);
    const centerLine = new THREE.Line(centerGeo, lineMaterial);
    centerLine.userData = { baseRadius: 0.3, type: "center", speed: -0.2 };
    shapes.push(centerLine);
    sceneRef.current!.add(centerLine);

    shapesRef.current = shapes;

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
      shapes.forEach((s) => s.geometry.dispose());
      materialsRef.current.forEach((m) => m.dispose());
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.008;

      shapesRef.current.forEach((shape) => {
        const { speed, type, rotOffset = 0 } = shape.userData;

        // Rotate
        shape.rotation.z = time * speed + rotOffset;

        // Scale with breath
        const targetScale = breathScale;
        shape.scale.setScalar(shape.scale.x + (targetScale - shape.scale.x) * 0.08);

        // Pulse opacity slightly
        const mat = shape.material as THREE.LineBasicMaterial;
        const baseOpacity = type === "circle" || type === "center" ? 0.6 : 0.25;
        mat.opacity = baseOpacity + Math.sin(time * 2) * 0.1;
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
