import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeId = "zen-dark" | "zen-light";
type Language = "ko" | "en";
type BellSound = "tibetan_bowl" | "singing_bowl" | "zen_gong" | "soft_chime";
type AmbientSound = "rain" | "ocean" | "forest" | "tibetan_bowls" | "wind_chimes" |
                    "white_noise" | "river" | "campfire" | "wind" | "birds" | "none";

interface AmbientVolumes {
  master: number;
  rain: number;
  ocean: number;
  forest: number;
  tibetan_bowls: number;
  wind_chimes: number;
  white_noise: number;
  river: number;
  campfire: number;
  wind: number;
  birds: number;
}

interface MusicTrack {
  id: number;
  filename: string;
  prompt: string;
}

interface SettingsState {
  theme: ThemeId;
  language: Language;
  bellEnabled: boolean;
  bellSound: BellSound;
  defaultAmbient: AmbientSound;
  // Volume settings (persisted)
  ambientVolumes: AmbientVolumes;
  musicVolume: number;
  // Music selection
  defaultMusic: MusicTrack | null;
  setTheme: (theme: ThemeId) => void;
  setLanguage: (language: Language) => void;
  setBellEnabled: (enabled: boolean) => void;
  setBellSound: (sound: BellSound) => void;
  setDefaultAmbient: (sound: AmbientSound) => void;
  setAmbientVolume: (id: keyof AmbientVolumes, volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setDefaultMusic: (track: MusicTrack | null) => void;
}

const LIGHT_THEMES: ThemeId[] = ["zen-light"];

const DEFAULT_VOLUMES: AmbientVolumes = {
  master: 0.8,
  rain: 0.5,
  ocean: 0.5,
  forest: 0.5,
  tibetan_bowls: 0.5,
  wind_chimes: 0.5,
  white_noise: 0.5,
  river: 0.5,
  campfire: 0.5,
  wind: 0.5,
  birds: 0.5,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "zen-dark",
      language: "ko",
      bellEnabled: true,
      bellSound: "tibetan_bowl",
      defaultAmbient: "none",
      ambientVolumes: DEFAULT_VOLUMES,
      musicVolume: 0.5,
      defaultMusic: null,
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
      setDefaultAmbient: (sound) => set({ defaultAmbient: sound }),
      setAmbientVolume: (id, volume) =>
        set((state) => ({
          ambientVolumes: { ...state.ambientVolumes, [id]: volume },
        })),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setDefaultMusic: (track) => set({ defaultMusic: track }),
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
