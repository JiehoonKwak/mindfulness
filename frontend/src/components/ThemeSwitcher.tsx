import { useSettingsStore } from "../stores/settingsStore";
import { useTranslation } from "react-i18next";
import { Icons } from "./Icons";

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingsStore();
  const isDark = theme === "zen-dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "zen-light" : "zen-dark")}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-full"
    >
      {isDark ? (
        <Icons.moon className="w-5 h-5" />
      ) : (
        <Icons.sun className="w-5 h-5" />
      )}
      <span className="flex-1 text-left">
        {isDark ? t("themes.dark") : t("themes.light")}
      </span>
      <span className="text-[var(--color-text-muted)] text-sm">
        {t("settings.tapToToggle")}
      </span>
    </button>
  );
}
