import { create } from "zustand";
import * as api from "../api/sessions";

interface SessionState {
  currentSessionId: number | null;
  isLoading: boolean;
  error: string | null;
  startSession: (duration: number, visual: string) => Promise<void>;
  completeSession: (actualDuration: number) => Promise<void>;
  abandonSession: (actualDuration: number) => Promise<void>;
  updateJournal: (mood: string | null, note: string) => Promise<void>;
  clearError: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSessionId: null,
  isLoading: false,
  error: null,

  startSession: async (duration, visual) => {
    set({ isLoading: true, error: null });
    try {
      const session = await api.createSession({
        planned_duration_seconds: duration,
        visual_type: visual,
      });
      set({ currentSessionId: session.id, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start session";
      set({ error: message, isLoading: false });
    }
  },

  completeSession: async (actualDuration) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    set({ isLoading: true, error: null });
    try {
      await api.updateSession(currentSessionId, {
        completed: true,
        actual_duration_seconds: actualDuration,
        ended_at: new Date().toISOString(),
      });
      // Keep currentSessionId for journal update
      set({ isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete session";
      set({ error: message, isLoading: false });
    }
  },

  updateJournal: async (mood, note) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    set({ isLoading: true, error: null });
    try {
      await api.updateSession(currentSessionId, {
        mood_after: mood ?? undefined,
        note: note || undefined,
      });
      set({ currentSessionId: null, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save journal";
      set({ error: message, isLoading: false });
    }
  },

  abandonSession: async (actualDuration) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    set({ isLoading: true, error: null });
    try {
      await api.updateSession(currentSessionId, {
        completed: false,
        actual_duration_seconds: actualDuration,
        ended_at: new Date().toISOString(),
      });
      set({ currentSessionId: null, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to abandon session";
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
