import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";
import { useBreathProgress } from "./useBreathProgress";

const PARTICLE_COUNT = 100;

export default function BreathingOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase } = useBreathingStore();
  const progress = useBreathProgress();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    cameraRef.current = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    cameraRef.current.position.z = 5;

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    orbRef.current = new THREE.Mesh(orbGeometry, orbMaterial);
    sceneRef.current.add(orbRef.current);

    const ringGeometry = new THREE.RingGeometry(0.9, 1.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    sceneRef.current.add(ring);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    particlesRef.current = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particlesRef.current);

    function handleResize() {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
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
          breathScale = 0.7 + progress * 0.5;
          break;
        case "holdIn":
          breathScale = 1.2;
          break;
        case "exhale":
          breathScale = 1.2 - progress * 0.5;
          break;
        case "holdOut":
          breathScale = 0.7;
          break;
      }

      if (orbRef.current) {
        orbRef.current.scale.setScalar(breathScale);
        const orbMat = orbRef.current.material as THREE.MeshBasicMaterial;
        orbMat.opacity = 0.2 + breathScale * 0.15;
      }

      if (particlesRef.current) {
        particlesRef.current.scale.setScalar(breathScale);
        particlesRef.current.rotation.y = time * 0.1;
        particlesRef.current.rotation.x = time * 0.05;

        const pMat = particlesRef.current.material as THREE.PointsMaterial;
        pMat.opacity = 0.4 + breathScale * 0.2;
      }

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
