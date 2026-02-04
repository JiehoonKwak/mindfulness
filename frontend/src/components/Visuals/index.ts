import { lazy } from "react";

export const visualComponents = {
  aurora: lazy(() => import("./Aurora/Aurora")),
  breathSphere: lazy(() => import("./BreathSphere/BreathSphere")),
  floatingOrbs: lazy(() => import("./FloatingOrbs/FloatingOrbs")),
  rippleWater: lazy(() => import("./RippleWater/RippleWater")),
};

export type VisualId = keyof typeof visualComponents;

export const VISUALS = [
  { id: "aurora", name: "Aurora" },
  { id: "breathSphere", name: "Breath Sphere" },
  { id: "floatingOrbs", name: "Floating Orbs" },
  { id: "rippleWater", name: "Ripple Water" },
] as const;

export { default as VisualSelector } from "./VisualSelector";
