import React from "react";
import { useSettingsStore } from "../stores/settingsStore";
import { useTranslation } from "react-i18next";

const themes = [
  { id: "ocean", mode: "dark" },
  { id: "forest", mode: "dark" },
  { id: "sunset", mode: "dark" },
  { id: "midnight", mode: "dark" },
  { id: "aurora", mode: "dark" },
  { id: "sakura", mode: "light" },
  { id: "sand", mode: "light" },
  { id: "zen", mode: "light" },
] as const;

export default function ThemeSwitcher(): React.ReactNode {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="grid grid-cols-4 gap-2">
      {themes.map((themeItem) => (
        <button
          key={themeItem.id}
          onClick={() => setTheme(themeItem.id)}
          className={`p-3 rounded-lg border-2 ${
            theme === themeItem.id ? "border-primary" : "border-transparent"
          }`}
          data-theme={themeItem.id}
        >
          <div className="w-8 h-8 rounded-full bg-primary mx-auto" />
          <span className="text-xs mt-1 block">
            {t(`themes.${themeItem.id}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
