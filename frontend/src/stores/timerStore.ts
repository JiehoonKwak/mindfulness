import { create } from "zustand";
import { useSessionStore } from "./sessionStore";

type TimerStatus = "idle" | "countdown" | "running" | "paused" | "complete";

interface TimerState {
  duration: number; // seconds
  remaining: number; // seconds
  countdown: number; // countdown seconds before start (3, 2, 1)
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
  tickCountdown: () => void;
  complete: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  duration: 600, // 10 minutes default
  remaining: 600,
  countdown: 3,
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
    // Start with countdown phase
    set({ status: "countdown", countdown: 3 });
  },

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  stop: () => {
    const { duration, remaining, status } = get();
    // Only log if we were actually running (not just in countdown)
    if (status === "running" || status === "paused") {
      const actualDuration = duration - remaining;
      useSessionStore.getState().abandonSession(actualDuration);
    }
    set({ status: "idle", remaining: duration, countdown: 3 });
  },

  tickCountdown: () => {
    const { countdown, duration, selectedVisual } = get();
    if (countdown > 1) {
      set({ countdown: countdown - 1 });
    } else {
      // Countdown finished, start the actual session
      set({ status: "running", countdown: 3 });
      useSessionStore.getState().startSession(duration, selectedVisual);
    }
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

  reset: () => {
    const { duration } = get();
    set({ status: "idle", remaining: duration, countdown: 3 });
  },
}));
