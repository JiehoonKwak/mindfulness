import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";
import type { VisualProps } from "../types";

const vertexShader = `
  uniform float uTime;
  uniform float uScale;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    float displacement = sin(position.y * 3.0 + uTime) * 0.05;
    vec3 newPosition = position * uScale + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

    vec3 color = uColor * (0.3 + fresnel * 0.7) * uIntensity;
    float alpha = 0.6 + fresnel * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function BreathSphere({ isActive }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uScale: { value: 0.8 },
    uIntensity: { value: 0.5 },
    uColor: { value: new THREE.Color(0x6366f1) },
  });

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

  const targets = useMemo(() => {
    switch (phase) {
      case "inhale":
        return { scale: 0.7 + progress * 0.5, intensity: 0.3 + progress * 0.7 };
      case "holdIn":
        return { scale: 1.2, intensity: 1.0 };
      case "exhale":
        return {
          scale: 1.2 - progress * 0.5,
          intensity: 1.0 - progress * 0.7,
        };
      case "holdOut":
        return { scale: 0.7, intensity: 0.3 };
      default:
        return { scale: 0.8, intensity: 0.5 };
    }
  }, [phase, progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      100,
    );
    cameraRef.current.position.z = 3;

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);

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
      uniformsRef.current.uTime.value += 0.01;
      uniformsRef.current.uScale.value +=
        (targets.scale - uniformsRef.current.uScale.value) * 0.1;
      uniformsRef.current.uIntensity.value +=
        (targets.intensity - uniformsRef.current.uIntensity.value) * 0.1;

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, targets]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
      <div
        ref={containerRef}
        className="w-full h-full max-w-[400px] max-h-[400px]"
      />
    </div>
  );
}
