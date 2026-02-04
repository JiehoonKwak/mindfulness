import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";
import type { VisualProps } from "../types";

const PARTICLE_COUNT = 120;

export default function BreathSphere({ isActive }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const connectionRadiusRef = useRef(1.2);

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

  // Update connection radius ref (avoids effect re-runs)
  useEffect(() => {
    switch (phase) {
      case "inhale":
        connectionRadiusRef.current = 0.8 + progress * 1.2;
        break;
      case "holdIn":
        connectionRadiusRef.current = 2.0;
        break;
      case "exhale":
        connectionRadiusRef.current = 2.0 - progress * 1.2;
        break;
      case "holdOut":
        connectionRadiusRef.current = 0.8;
        break;
      default:
        connectionRadiusRef.current = 1.2;
    }
  }, [phase, progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    cameraRef.current.position.z = 5;

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    // Create particles
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.5;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    positionsRef.current = positions;
    velocitiesRef.current = velocities;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    pointsRef.current = new THREE.Points(geometry, material);
    sceneRef.current.add(pointsRef.current);

    // Lines for connections
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    linesRef.current = new THREE.LineSegments(lineGeometry, lineMaterial);
    sceneRef.current.add(linesRef.current);

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      if (positions && velocities && pointsRef.current) {
        // Update particle positions with gentle drift
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          // Keep within bounds
          const dist = Math.sqrt(
            positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
          );
          if (dist > 2.5 || dist < 0.5) {
            velocities[i3] *= -1;
            velocities[i3 + 1] *= -1;
            velocities[i3 + 2] *= -1;
          }
        }
        (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        // Update connection lines using ref (avoids dependency)
        if (linesRef.current) {
          const connectionRadius = connectionRadiusRef.current;
          const linePositions: number[] = [];
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
              const i3 = i * 3;
              const j3 = j * 3;
              const dx = positions[i3] - positions[j3];
              const dy = positions[i3 + 1] - positions[j3 + 1];
              const dz = positions[i3 + 2] - positions[j3 + 2];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (dist < connectionRadius) {
                linePositions.push(
                  positions[i3], positions[i3 + 1], positions[i3 + 2],
                  positions[j3], positions[j3 + 1], positions[j3 + 2]
                );
              }
            }
          }
          linesRef.current.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(linePositions, 3)
          );
        }
      }

      // Rotate scene slowly
      if (sceneRef.current) {
        sceneRef.current.rotation.y = time * 0.1;
      }

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
      <div ref={containerRef} className="w-full h-full max-w-[500px] max-h-[500px]" />
    </div>
  );
}
