import { create } from "zustand";

type TimerStatus = "idle" | "running" | "paused" | "complete";

interface TimerState {
  duration: number; // seconds
  remaining: number; // seconds
  status: TimerStatus;
  selectedVisual: string;
  breathingEnabled: boolean;
  breathingPattern: string;
  setDuration: (minutes: number) => void;
  setSelectedVisual: (visual: string) => void;
  setBreathingEnabled: (enabled: boolean) => void;
  setBreathingPattern: (pattern: string) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  complete: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  duration: 600, // 10 minutes default
  remaining: 600,
  status: "idle",
  selectedVisual: "breathingCircle",
  breathingEnabled: false,
  breathingPattern: "box",

  setDuration: (minutes) =>
    set({
      duration: minutes * 60,
      remaining: minutes * 60,
    }),

  setSelectedVisual: (visual) => set({ selectedVisual: visual }),

  setBreathingEnabled: (enabled) => set({ breathingEnabled: enabled }),

  setBreathingPattern: (pattern) => set({ breathingPattern: pattern }),

  start: () => set({ status: "running" }),

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  stop: () =>
    set((state) => ({
      status: "idle",
      remaining: state.duration,
    })),

  tick: () => {
    const { remaining, status } = get();
    if (status === "running" && remaining > 0) {
      set({ remaining: remaining - 1 });
    } else if (remaining === 0) {
      get().complete();
    }
  },

  complete: () => set({ status: "complete" }),
}));
