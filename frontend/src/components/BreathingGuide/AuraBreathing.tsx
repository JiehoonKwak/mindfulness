import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";
import type { BreathPhase } from "./patterns";

const SIZE = 320;

function getPhaseTargets(phase: BreathPhase, progress: number) {
  switch (phase) {
    case "inhale":
      return { scale: 0.7 + progress * 0.5, intensity: 0.3 + progress * 0.7 };
    case "holdIn":
      return { scale: 1.2, intensity: 1.0 };
    case "exhale":
      return { scale: 1.2 - progress * 0.5, intensity: 1.0 - progress * 0.7 };
    case "holdOut":
      return { scale: 0.7, intensity: 0.3 };
    default:
      return { scale: 0.7, intensity: 0.3 };
  }
}

export default function AuraBreathing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationRef = useRef<number>(0);

  const { phase, phaseTime, pattern, isActive } = useBreathingStore();

  // Calculate progress within current phase (0 to 1)
  const progress = useMemo(() => {
    if (!isActive) return 0;
    const phaseDuration =
      phase === "inhale"
        ? pattern.inhale
        : phase === "holdIn"
          ? pattern.holdIn
          : phase === "exhale"
            ? pattern.exhale
            : pattern.holdOut;
    if (phaseDuration === 0) return 1;
    return 1 - phaseTime / phaseDuration;
  }, [phase, phaseTime, pattern, isActive]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 0.7 },
        uIntensity: { value: 0.3 },
        uColor1: { value: new THREE.Color("#2dd4bf") }, // teal
        uColor2: { value: new THREE.Color("#3b82f6") }, // blue
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uScale;

        void main() {
          vUv = uv;
          vNormal = normal;

          // Subtle wave displacement
          float wave = sin(uTime * 2.0 + position.y * 4.0) * 0.03;
          vec3 pos = position * (uScale + wave);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uIntensity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        void main() {
          // Gradient from bottom (teal) to top (blue)
          vec3 color = mix(uColor1, uColor2, vUv.y);

          // Fresnel-like edge glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float alpha = mix(0.3, 0.9, fresnel) * uIntensity;

          // Inner glow
          float center = 1.0 - smoothstep(0.0, 0.5, length(vUv - 0.5));
          alpha += center * 0.2 * uIntensity;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    materialRef.current = material;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      material.uniforms.uTime.value = elapsed;
      sphere.rotation.y = elapsed * 0.1;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update shader uniforms based on breath state
  useEffect(() => {
    if (!materialRef.current) return;

    const targets = isActive
      ? getPhaseTargets(phase, progress)
      : { scale: 0.7, intensity: 0.3 };

    // Smooth lerp
    const current = materialRef.current.uniforms;
    current.uScale.value = THREE.MathUtils.lerp(
      current.uScale.value,
      targets.scale,
      0.15,
    );
    current.uIntensity.value = THREE.MathUtils.lerp(
      current.uIntensity.value,
      targets.intensity,
      0.15,
    );
  }, [phase, progress, isActive]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background ambient orbs */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #2dd4bf 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          bottom: "-20%",
          right: "-10%",
        }}
      />

      {/* Three.js container */}
      <div
        ref={containerRef}
        className="relative z-10 pointer-events-none"
        style={{ width: SIZE, height: SIZE }}
      />
    </div>
  );
}
