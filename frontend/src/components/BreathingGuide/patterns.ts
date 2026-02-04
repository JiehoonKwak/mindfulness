export interface BreathingPattern {
  id: string;
  nameKey: string; // i18n key
  inhale: number; // seconds
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: "478", nameKey: "breathing.patterns.478", inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  { id: "box", nameKey: "breathing.patterns.box", inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  { id: "calming", nameKey: "breathing.patterns.calming", inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
  { id: "energizing", nameKey: "breathing.patterns.energizing", inhale: 6, holdIn: 0, exhale: 2, holdOut: 0 },
];

export type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

export function getPhaseKey(phase: BreathPhase): string {
  switch (phase) {
    case "inhale":
      return "breathing.inhale";
    case "holdIn":
    case "holdOut":
      return "breathing.hold";
    case "exhale":
      return "breathing.exhale";
  }
}
