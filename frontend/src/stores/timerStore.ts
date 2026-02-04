import { create } from "zustand";
import { useSessionStore } from "./sessionStore";

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
  selectedVisual: "aurora",
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

  start: () => {
    const { duration, selectedVisual } = get();
    set({ status: "running" });
    // Log session to backend
    useSessionStore.getState().startSession(duration, selectedVisual);
  },

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  stop: () => {
    const { duration, remaining } = get();
    const actualDuration = duration - remaining;
    // Log abandoned session
    useSessionStore.getState().abandonSession(actualDuration);
    set({ status: "idle", remaining: duration });
  },

  tick: () => {
    const { remaining, status } = get();
    if (status === "running" && remaining > 0) {
      set({ remaining: remaining - 1 });
    } else if (remaining === 0) {
      get().complete();
    }
  },

  complete: () => {
    const { duration } = get();
    set({ status: "complete" });
    // Log completed session
    useSessionStore.getState().completeSession(duration);
  },
}));
