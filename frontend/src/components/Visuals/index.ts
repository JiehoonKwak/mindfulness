import { lazy } from "react";

export const visualComponents = {
  breathingCircle: lazy(() => import("./BreathingCircle/BreathingCircle")),
  particleFlow: lazy(() => import("./ParticleFlow/ParticleFlow")),
  gradientWaves: lazy(() => import("./GradientWaves/GradientWaves")),
  aurora: lazy(() => import("./Aurora/Aurora")),
  mandala: lazy(() => import("./Mandala/Mandala")),
  cosmicDust: lazy(() => import("./CosmicDust/CosmicDust")),
  zenGarden: lazy(() => import("./ZenGarden/ZenGarden")),
  liquidMetal: lazy(() => import("./LiquidMetal/LiquidMetal")),
  sacredGeometry: lazy(() => import("./SacredGeometry/SacredGeometry")),
  oceanDepth: lazy(() => import("./OceanDepth/OceanDepth")),
};

export type VisualId = keyof typeof visualComponents;

export { default as VisualSelector } from "./VisualSelector";
