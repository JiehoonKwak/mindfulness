import { lazy } from "react";

export { useBreathProgress } from "./useBreathProgress";

export const breathingVisualComponents = {
  waves: lazy(() => import("./BreathingWaves")),
  lotus: lazy(() => import("./BreathingLotus")),
  orb: lazy(() => import("./BreathingOrb")),
};

export type BreathingVisualId = keyof typeof breathingVisualComponents;

export const BREATHING_VISUALS = [
  { id: "waves", nameKey: "breathing.visuals.waves" },
  { id: "lotus", nameKey: "breathing.visuals.lotus" },
  { id: "orb", nameKey: "breathing.visuals.orb" },
] as const;
