import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeId = "zen-dark" | "zen-light";
type Language = "ko" | "en";
type BellSound = "tibetan_bowl" | "singing_bowl" | "zen_gong" | "soft_chime";

interface SettingsState {
  theme: ThemeId;
  language: Language;
  bellEnabled: boolean;
  bellSound: BellSound;
  setTheme: (theme: ThemeId) => void;
  setLanguage: (language: Language) => void;
  setBellEnabled: (enabled: boolean) => void;
  setBellSound: (sound: BellSound) => void;
}

const LIGHT_THEMES: ThemeId[] = ["zen-light"];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "zen-dark",
      language: "ko",
      bellEnabled: true,
      bellSound: "tibetan_bowl",
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
      setBellSound: (sound) => set({ bellSound: sound }),
    }),
    { name: "mindfulness-settings" },
  ),
);

// Initialize theme on load
const initTheme = (): void => {
  const stored = localStorage.getItem("mindfulness-settings");
  if (stored) {
    const { state } = JSON.parse(stored) as { state: SettingsState };
    // Migrate old themes to new system
    const theme = state.theme;
    const newTheme: ThemeId =
      theme === "zen-dark" || theme === "zen-light" ? theme : "zen-dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle(
      "dark",
      !LIGHT_THEMES.includes(newTheme),
    );
  } else {
    document.documentElement.setAttribute("data-theme", "zen-dark");
    document.documentElement.classList.add("dark");
  }
};
initTheme();
