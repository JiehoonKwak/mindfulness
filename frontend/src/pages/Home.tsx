import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getStatsSummary, getHeatmap } from "../api/stats";
import type { StatsSummary, HeatmapEntry } from "../api/stats";
import Heatmap from "../components/Stats/Heatmap";
import { Icons } from "../components/Icons";
import { ZenQuote } from "../components/ZenQuote";

export default function Home() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
