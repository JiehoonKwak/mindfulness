import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getStatsSummary, getHeatmap } from "../api/stats";
import type { StatsSummary, HeatmapEntry } from "../api/stats";
import SummaryCards from "../components/Stats/SummaryCards";
import Heatmap from "../components/Stats/Heatmap";

export default function Stats() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, heatmapData] = await Promise.all([
          getStatsSummary(),
          getHeatmap(),
        ]);
        setSummary(summaryData);
        setHeatmap(heatmapData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <header className="py-4">
        <Link to="/" className="text-[var(--color-text-muted)]">
          &larr; {t("app.title")}
        </Link>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-light tracking-wide">
          {t("stats.title")}
        </h1>

        <SummaryCards stats={summary} loading={loading} />

        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("stats.yearActivity")}
          </h2>
          <div className="p-4 rounded-2xl backdrop-blur-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/30">
            <Heatmap data={heatmap} loading={loading} />
          </div>
        </section>
      </main>
    </div>
  );
}
