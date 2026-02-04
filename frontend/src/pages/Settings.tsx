import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useSettingsStore } from "../stores/settingsStore";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, bellEnabled, setBellEnabled } =
    useSettingsStore();

  const handleLanguageChange = (lang: "ko" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen p-4">
      <header className="py-4">
        <Link to="/" className="text-[var(--color-text-muted)]">
          &larr; {t("app.title")}
        </Link>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <h1 className="text-2xl font-light tracking-wide">
          {t("settings.title")}
        </h1>

        {/* Theme Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.theme")}
          </h2>
          <ThemeSwitcher />
        </section>

        {/* Language Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.language")}
          </h2>
          <div className="flex gap-3">
            {(["ko", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  px-6 py-3 rounded-2xl backdrop-blur-xl
                  bg-[var(--color-surface)]/40
                  border transition-all duration-200
                  uppercase tracking-widest text-sm
                  ${
                    language === lang
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                  }
                `}
              >
                {lang === "ko" ? "한국어" : "English"}
              </button>
            ))}
          </div>
        </section>

        {/* Bell Sound Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.bellSound")}
          </h2>
          <button
            onClick={() => setBellEnabled(!bellEnabled)}
            className={`
              w-full px-6 py-4 rounded-2xl backdrop-blur-xl
              bg-[var(--color-surface)]/40
              border transition-all duration-200
              flex items-center justify-between
              ${
                bellEnabled
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--color-border)]/50"
              }
            `}
          >
            <span className="text-[var(--color-text)]">
              {t("settings.bellEnabled")}
            </span>
            <div
              className={`
                w-12 h-6 rounded-full transition-colors duration-200
                ${bellEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-full bg-white shadow-sm
                  transform transition-transform duration-200
                  translate-y-0.5
                  ${bellEnabled ? "translate-x-6" : "translate-x-0.5"}
                `}
              />
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
