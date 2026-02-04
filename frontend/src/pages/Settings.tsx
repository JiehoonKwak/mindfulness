import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import MusicSelector from "../components/MusicSelector/MusicSelector";
import { useSettingsStore } from "../stores/settingsStore";
import { Icons } from "../components/Icons";
import { BELL_SOUNDS, getAmbientUrl, getBellUrl } from "../constants/sounds";

import { API_BASE } from "../api/config";

const EXPORT_FORMATS = [
  { id: "json", labelKey: "settings.export.json", ext: ".json" },
  { id: "csv", labelKey: "settings.export.csv", ext: ".csv" },
  { id: "ical", labelKey: "settings.export.ical", ext: ".ics" },
  { id: "markdown", labelKey: "settings.export.markdown", ext: ".md" },
] as const;

const AMBIENT_OPTIONS = [
  { id: "none", labelKey: "sounds.none" },
  { id: "rain", labelKey: "sounds.rain" },
  { id: "ocean", labelKey: "sounds.ocean" },
  { id: "forest", labelKey: "sounds.forest" },
  { id: "tibetan_bowls", labelKey: "sounds.tibetanBowls" },
  { id: "wind_chimes", labelKey: "sounds.windChimes" },
  { id: "white_noise", labelKey: "sounds.whiteNoise" },
  { id: "river", labelKey: "sounds.river" },
  { id: "campfire", labelKey: "sounds.campfire" },
  { id: "wind", labelKey: "sounds.wind" },
  { id: "birds", labelKey: "sounds.birds" },
] as const;

export default function Settings() {
  const { t, i18n } = useTranslation();
  const {
    language,
    setLanguage,
    bellEnabled,
    setBellEnabled,
    bellSound,
    setBellSound,
    defaultAmbient,
    setDefaultAmbient,
  } = useSettingsStore();
  const [exportFormat, setExportFormat] = useState<string>("json");
  const [exporting, setExporting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const bellPreviewRef = useRef<HTMLAudioElement | null>(null);
  const ambientPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Load saved webhook URL on mount
  useEffect(() => {
    const loadWebhook = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/discord/webhook`);
        if (res.ok) {
          const data = await res.json();
          setWebhookUrl(data.webhook_url || "");
        }
      } catch (error) {
        console.error("Failed to load webhook:", error);
      }
    };
    loadWebhook();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (bellPreviewRef.current) {
        bellPreviewRef.current.pause();
        bellPreviewRef.current = null;
      }
      if (ambientPreviewRef.current) {
        ambientPreviewRef.current.pause();
        ambientPreviewRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (lang: "ko" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/api/export/${exportFormat}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const format = EXPORT_FORMATS.find((f) => f.id === exportFormat);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mindfulness-export${format?.ext || ".txt"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleSaveWebhook = async () => {
    try {
      await fetch(`${API_BASE}/api/discord/webhook`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhook_url: webhookUrl }),
      });
      setWebhookSaved(true);
      setTimeout(() => setWebhookSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save webhook:", error);
    }
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    try {
      const res = await fetch(`${API_BASE}/api/discord/test`, {
        method: "POST",
      });
      const data = await res.json();
      alert(
        data.success
          ? t("settings.discord.testSuccess")
          : t("settings.discord.testFailed"),
      );
    } catch {
      alert(t("settings.discord.testFailed"));
    } finally {
      setWebhookTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="flex items-center gap-4 p-6">
        <Link to="/" className="p-2 -m-2">
          <Icons.chevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-title">{t("settings.title")}</h1>
      </header>

      <main className="max-w-md mx-auto px-6 pb-6 space-y-8">
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

          {bellEnabled && (
            <div className="grid grid-cols-2 gap-3">
              {BELL_SOUNDS.map((bell) => (
                <button
                  key={bell.id}
                  onClick={() => {
                    setBellSound(bell.id);
                    // Stop previous preview
                    if (bellPreviewRef.current) {
                      bellPreviewRef.current.pause();
                      bellPreviewRef.current.currentTime = 0;
                    }
                    // Play new preview
                    bellPreviewRef.current = new Audio(getBellUrl(bell.id));
                    bellPreviewRef.current.play();
                  }}
                  className={`
                    px-4 py-3 rounded-xl backdrop-blur-xl
                    bg-[var(--color-surface)]/40
                    border transition-all duration-200
                    text-sm
                    ${
                      bellSound === bell.id
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                    }
                  `}
                >
                  {t(bell.labelKey)}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Default Ambient Sound Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.defaultAmbient")}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {t("settings.defaultAmbientDescription")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {AMBIENT_OPTIONS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => {
                  setDefaultAmbient(sound.id);
                  // Stop previous preview
                  if (ambientPreviewRef.current) {
                    ambientPreviewRef.current.pause();
                    ambientPreviewRef.current.currentTime = 0;
                  }
                  // Play preview if not "none"
                  const url = getAmbientUrl(sound.id);
                  if (url) {
                    ambientPreviewRef.current = new Audio(url);
                    ambientPreviewRef.current.loop = false;
                    ambientPreviewRef.current.play();
                    // Stop after 3 seconds (preview)
                    setTimeout(() => {
                      if (ambientPreviewRef.current) {
                        ambientPreviewRef.current.pause();
                      }
                    }, 3000);
                  }
                }}
                className={`
                  px-4 py-3 rounded-xl backdrop-blur-xl
                  bg-[var(--color-surface)]/40
                  border transition-all duration-200
                  text-sm
                  ${
                    defaultAmbient === sound.id
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                  }
                `}
              >
                {t(sound.labelKey)}
              </button>
            ))}
          </div>
        </section>

        {/* Export Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.export.title")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`
                  px-4 py-3 rounded-xl backdrop-blur-xl
                  bg-[var(--color-surface)]/40
                  border transition-all duration-200
                  text-sm
                  ${
                    exportFormat === format.id
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                  }
                `}
              >
                {t(format.labelKey)}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="
              w-full py-3 rounded-xl
              bg-[var(--color-primary)]
              text-[var(--color-bg)] font-medium
              hover:opacity-90 transition-opacity
              disabled:opacity-50
            "
          >
            {exporting
              ? t("settings.export.exporting")
              : t("settings.export.download")}
          </button>
        </section>

        {/* Music Section */}
        <section className="space-y-4">
          <MusicSelector />
        </section>

        {/* Discord Section */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("settings.discord.title")}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {t("settings.discord.description")}
          </p>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder={t("settings.discord.placeholder")}
            className="
              w-full px-4 py-3 rounded-xl
              bg-[var(--color-surface)]/40
              border border-[var(--color-border)]/30
              text-[var(--color-text)]
              placeholder:text-[var(--color-text-muted)]
              focus:outline-none focus:border-[var(--color-primary)]
            "
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveWebhook}
              disabled={!webhookUrl}
              className="
                flex-1 py-3 rounded-xl
                bg-[var(--color-primary)]
                text-[var(--color-bg)] font-medium
                hover:opacity-90 transition-opacity
                disabled:opacity-50
              "
            >
              {webhookSaved ? "✓" : t("settings.discord.save")}
            </button>
            <button
              onClick={handleTestWebhook}
              disabled={!webhookUrl || webhookTesting}
              className="
                flex-1 py-3 rounded-xl
                border border-[var(--color-primary)]
                text-[var(--color-primary)]
                hover:bg-[var(--color-primary)]/10 transition-colors
                disabled:opacity-50
              "
            >
              {webhookTesting ? "..." : t("settings.discord.test")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
