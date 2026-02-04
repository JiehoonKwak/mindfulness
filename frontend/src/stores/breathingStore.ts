import { create } from "zustand";
import type { BreathingPattern, BreathPhase } from "../components/BreathingGuide/patterns";
import { BREATHING_PATTERNS } from "../components/BreathingGuide/patterns";

interface BreathingState {
  pattern: BreathingPattern;
  phase: BreathPhase;
  phaseTime: number;
  cycleCount: number;
  isActive: boolean;
  selectedVisual: string;
  setPattern: (id: string) => void;
  setSelectedVisual: (id: string) => void;
  start: () => void;
  stop: () => void;
  tick: () => void;
}

export const useBreathingStore = create<BreathingState>((set, get) => ({
  pattern: BREATHING_PATTERNS[1], // Box breathing default
  phase: "inhale",
  phaseTime: 4,
  cycleCount: 0,
  isActive: false,
  selectedVisual: "waves",

  setPattern: (id) => {
    const pattern = BREATHING_PATTERNS.find((p) => p.id === id) || BREATHING_PATTERNS[1];
    set({ pattern, phase: "inhale", phaseTime: pattern.inhale, cycleCount: 0 });
  },

  setSelectedVisual: (id) => set({ selectedVisual: id }),

  start: () => {
    const { pattern } = get();
    set({ isActive: true, phase: "inhale", phaseTime: pattern.inhale, cycleCount: 0 });
  },

  stop: () => set({ isActive: false }),

  tick: () => {
    const { pattern, phase, phaseTime, cycleCount, isActive } = get();
    if (!isActive) return;

    if (phaseTime > 1) {
      set({ phaseTime: phaseTime - 1 });
      return;
    }

    const phases: BreathPhase[] = ["inhale", "holdIn", "exhale", "holdOut"];
    const durations = [pattern.inhale, pattern.holdIn, pattern.exhale, pattern.holdOut];

    let nextPhaseIndex = phases.indexOf(phase) + 1;

    // Skip phases with 0 duration
    while (nextPhaseIndex < 4 && durations[nextPhaseIndex] === 0) {
      nextPhaseIndex++;
    }

    if (nextPhaseIndex >= 4) {
      set({ phase: "inhale", phaseTime: pattern.inhale, cycleCount: cycleCount + 1 });
    } else {
      set({ phase: phases[nextPhaseIndex], phaseTime: durations[nextPhaseIndex] });
    }
  },
}));
