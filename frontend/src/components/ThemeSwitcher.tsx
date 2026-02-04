import React from "react";
import { useSettingsStore } from "../stores/settingsStore";
import { useTranslation } from "react-i18next";

const themes = [
  { id: "ocean", mode: "dark", preview: "#4ecdc4" },
  { id: "forest", mode: "dark", preview: "#7cb342" },
  { id: "sunset", mode: "dark", preview: "#ff6b35" },
  { id: "midnight", mode: "dark", preview: "#c0c0c0" },
  { id: "aurora", mode: "dark", preview: "#00d4aa" },
  { id: "sakura", mode: "light", preview: "#ff69b4" },
  { id: "sand", mode: "light", preview: "#c67c4e" },
  { id: "zen", mode: "light", preview: "#1a1a1a" },
] as const;

export default function ThemeSwitcher(): React.ReactNode {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="grid grid-cols-4 gap-3">
      {themes.map((themeItem) => (
        <button
          key={themeItem.id}
          onClick={() => setTheme(themeItem.id)}
          className={`
            p-3 rounded-2xl backdrop-blur-xl
            bg-[var(--color-surface)]/40
            border transition-all duration-200
            ${
              theme === themeItem.id
                ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/50"
                : "border-[var(--color-border)]/50 hover:border-[var(--color-border)]"
            }
          `}
        >
          <div
            className="w-8 h-8 rounded-full mx-auto ring-2 ring-white/10"
            style={{ backgroundColor: themeItem.preview }}
          />
          <span className="text-xs mt-2 block uppercase tracking-widest text-[var(--color-text-muted)]">
            {t(`themes.${themeItem.id}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
