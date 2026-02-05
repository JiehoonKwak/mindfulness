import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getStatsSummary, getHeatmap } from "../api/stats";
import type { StatsSummary, HeatmapEntry } from "../api/stats";
import Heatmap from "../components/Stats/Heatmap";
import { Icons } from "../components/Icons";
import { ZenQuote } from "../components/ZenQuote";
import { useTimerStore } from "../stores/timerStore";
import { useSettingsStore } from "../stores/settingsStore";

// Quick session presets
const QUICK_SESSIONS = [
  { id: "quick", minutes: 3, ambient: "rain", labelKey: "home.quickSessions.quick" },
  { id: "focus", minutes: 10, ambient: "white_noise", labelKey: "home.quickSessions.focus" },
  { id: "relax", minutes: 15, ambient: "ocean", labelKey: "home.quickSessions.relax" },
] as const;

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const setDuration = useTimerStore((state) => state.setDuration);
  const setDefaultAmbient = useSettingsStore((state) => state.setDefaultAmbient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, heatmapData] = await Promise.all([
          getStatsSummary(),
          getHeatmap(90),
        ]);
        setSummary(summaryData);
        setHeatmap(heatmapData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startQuickSession = (minutes: number, ambient: string) => {
    setDuration(minutes);
    setDefaultAmbient(ambient as "rain" | "ocean" | "white_noise" | "none");
    navigate("/meditate");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-title">{t("app.title")}</h1>
          <Link to="/settings" className="p-2 -m-2">
            <Icons.settings className="w-6 h-6 text-[var(--color-text-muted)]" />
          </Link>
        </header>

        {/* Heatmap hero */}
        <section className="px-6 py-4">
          <Heatmap data={heatmap} loading={loading} />
          <div className="flex justify-between mt-3 text-caption">
            <span className="flex items-center gap-1.5">
              <Icons.flame className="w-4 h-4 text-orange-500" />
              {summary?.current_streak || 0} {t("goals.dayStreak")}
            </span>
            <span className="text-mono">
              {Math.round(summary?.total_minutes || 0)} min
            </span>
          </div>
        </section>

        {/* Zen Quote in center */}
        <div className="flex-1 flex items-center justify-center">
          <ZenQuote />
        </div>

        {/* Quick Sessions */}
        <section className="px-6 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            {t("home.quickSessions.title")}
          </h3>
          <div className="flex gap-2">
            {QUICK_SESSIONS.map((session) => (
              <button
                key={session.id}
                onClick={() => startQuickSession(session.minutes, session.ambient)}
                className="flex-1 py-3 px-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-center"
              >
                <div className="text-sm font-medium">{session.minutes} min</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {t(session.labelKey)}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="p-6 space-y-3">
          <Link
            to="/meditate"
            className="flex items-center justify-center w-full py-4 rounded-2xl bg-[var(--color-accent)] text-[var(--color-bg)] text-title font-medium"
          >
            {t("home.startMeditation")}
          </Link>
          <Link
            to="/breathe"
            className="flex items-center justify-center w-full py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
          >
            {t("breathing.title")}
          </Link>
        </section>
      </div>

      {/* Bottom nav */}
      <nav className="flex justify-around py-4 border-t border-[var(--color-border)] max-w-lg mx-auto w-full">
        <Link to="/insights" className="p-3 flex flex-col items-center gap-1">
          <Icons.stats className="w-6 h-6" />
          <span className="text-xs text-[var(--color-text-muted)]">
            {t("nav.insights")}
          </span>
        </Link>
        <Link to="/settings" className="p-3 flex flex-col items-center gap-1">
          <Icons.settings className="w-6 h-6" />
          <span className="text-xs text-[var(--color-text-muted)]">
            {t("home.settings")}
          </span>
        </Link>
      </nav>
    </div>
  );
}
