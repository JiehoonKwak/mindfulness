import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";
import { useBreathProgress } from "./useBreathProgress";

const PETAL_COUNT = 8;
const LAYERS = 3;

function createPetalShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.15, 0.3, 0.08, 0.6);
  shape.quadraticCurveTo(0, 0.75, -0.08, 0.6);
  shape.quadraticCurveTo(-0.15, 0.3, 0, 0);
  return shape;
}

export default function BreathingLotus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase } = useBreathingStore();
  const progress = useBreathProgress();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const petalsRef = useRef<THREE.Mesh[][]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    cameraRef.current = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current.position.set(0, 2, 4);
    cameraRef.current.lookAt(0, 0, 0);

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    const petalShape = createPetalShape();
    const allPetals: THREE.Mesh[][] = [];

    for (let layer = 0; layer < LAYERS; layer++) {
      const layerPetals: THREE.Mesh[] = [];
      const layerScale = 1 - layer * 0.2;
      const layerY = layer * 0.1;

      for (let i = 0; i < PETAL_COUNT; i++) {
        const geometry = new THREE.ShapeGeometry(petalShape);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9 - layer * 0.2,
          side: THREE.DoubleSide,
        });

        const petal = new THREE.Mesh(geometry, material);
        const angle = (i / PETAL_COUNT) * Math.PI * 2;
        petal.rotation.z = angle;
        petal.position.y = layerY;
        petal.scale.setScalar(layerScale);
        petal.userData = { angle, layer };

        layerPetals.push(petal);
        sceneRef.current.add(petal);
      }
      allPetals.push(layerPetals);
    }
    petalsRef.current = allPetals;

    const dotGeo = new THREE.CircleGeometry(0.08, 32);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.rotation.x = -Math.PI / 2;
    sceneRef.current.add(dot);

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
      allPetals.flat().forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      dotGeo.dispose();
      dotMat.dispose();
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

      let openAmount = 0.3;
      switch (phase) {
        case "inhale":
          openAmount = 0.3 + progress * 0.7;
          break;
        case "holdIn":
          openAmount = 1.0;
          break;
        case "exhale":
          openAmount = 1.0 - progress * 0.7;
          break;
        case "holdOut":
          openAmount = 0.3;
          break;
      }

      petalsRef.current.forEach((layerPetals) => {
        layerPetals.forEach((petal) => {
          const { angle, layer } = petal.userData as { angle: number; layer: number };
          const tiltAngle = openAmount * (Math.PI / 3) * (1 - layer * 0.15);
          petal.rotation.x = -tiltAngle;
          const breathOffset = Math.sin(time * 2 + angle) * 0.02 * openAmount;
          petal.rotation.x += breathOffset;
        });
      });

      sceneRef.current!.rotation.y = time * 0.1;

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
