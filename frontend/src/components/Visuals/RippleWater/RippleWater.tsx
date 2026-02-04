import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";
import type { VisualProps } from "../types";

const vertexShader = `
  uniform float uTime;
  uniform float uRipple;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = length(uv - 0.5);
    float ripple = sin(dist * 20.0 - uTime * 2.0) * uRipple * 0.1;
    ripple *= smoothstep(0.5, 0.0, dist);

    pos.z += ripple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uRipple;
  varying vec2 vUv;

  void main() {
    float dist = length(vUv - 0.5);
    float alpha = smoothstep(0.5, 0.3, dist) * (0.2 + uRipple * 0.2);
    vec3 color = vec3(0.39, 0.4, 0.95);

    // Add subtle shimmer
    float shimmer = sin(uTime * 3.0 + dist * 10.0) * 0.1;
    color += shimmer;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function RippleWater({ isActive }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uRipple: { value: 0 },
  });
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

  const targetRipple = useMemo(() => {
    switch (phase) {
      case "exhale":
        return 0.3 + progress * 0.7;
      case "inhale":
        return 0.3 + progress * 0.2;
      case "holdIn":
        return 0.5;
      case "holdOut":
        return 0.1;
      default:
        return 0.3;
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
    cameraRef.current.position.set(0, 2, 3);
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);

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
      geometry.dispose();
      material.dispose();
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

    let animationId: number;
    const animate = () => {
      uniformsRef.current.uTime.value += 0.02;
      uniformsRef.current.uRipple.value +=
        (targetRipple - uniformsRef.current.uRipple.value) * 0.1;

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, targetRipple]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[var(--color-bg)]" />
  );
}
