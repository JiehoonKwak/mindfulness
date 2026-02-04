import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeId =
  | "ocean"
  | "forest"
  | "sunset"
  | "midnight"
  | "aurora"
  | "sakura"
  | "sand"
  | "zen";
type Language = "ko" | "en";

interface SettingsState {
  theme: ThemeId;
  language: Language;
  bellEnabled: boolean;
  setTheme: (theme: ThemeId) => void;
  setLanguage: (language: Language) => void;
  setBellEnabled: (enabled: boolean) => void;
}

const LIGHT_THEMES: ThemeId[] = ["sakura", "sand", "zen"];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "ocean",
      language: "ko",
      bellEnabled: true,
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.toggle(
          "dark",
          !LIGHT_THEMES.includes(theme),
        );
        set({ theme });
      },
      setLanguage: (language) => {
        localStorage.setItem("language", language);
        set({ language });
      },
      setBellEnabled: (enabled) => set({ bellEnabled: enabled }),
    }),
    { name: "mindfulness-settings" },
  ),
);

// Initialize theme on load
const initTheme = (): void => {
  const stored = localStorage.getItem("mindfulness-settings");
  if (stored) {
    const { state } = JSON.parse(stored) as { state: SettingsState };
    document.documentElement.setAttribute("data-theme", state.theme || "ocean");
    document.documentElement.classList.toggle(
      "dark",
      !LIGHT_THEMES.includes(state.theme),
    );
  }
};
initTheme();
