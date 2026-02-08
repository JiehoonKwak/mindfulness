import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getStatsSummary, getHeatmap } from "../api/stats";
import type { StatsSummary, HeatmapEntry } from "../api/stats";
import { listSessions, type Session } from "../api/sessions";
import Heatmap from "../components/Stats/Heatmap";
import { Icons } from "../components/Icons";

type Tab = "overview" | "history";

export default function Insights() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>("overview");
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, heatmapData, sessionsData] = await Promise.all([
          getStatsSummary(),
          getHeatmap(),
          listSessions(50),
        ]);
        setSummary(summaryData);
        setHeatmap(heatmapData);
        setSessions(sessionsData);
      } catch {
        // Fetch failed silently — UI shows loading/empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 p-6">
          <Link to="/" className="p-2 -m-2">
            <Icons.chevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-title">{t("nav.insights")}</h1>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 px-6 mb-6">
          <button
            onClick={() => setTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "overview"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                : "bg-[var(--color-surface)] border border-[var(--color-border)]"
            }`}
          >
            {t("insights.overview")}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "history"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                : "bg-[var(--color-surface)] border border-[var(--color-border)]"
            }`}
          >
            {t("insights.history")}
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)] py-8">
              {t("common.loading")}
            </div>
          ) : tab === "overview" ? (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label={t("stats.totalSessions")}
                  value={summary?.total_sessions || 0}
                />
                <StatCard
                  label={t("stats.totalMinutes")}
                  value={summary?.total_minutes || 0}
                />
                <StatCard
                  label={t("stats.currentStreak")}
                  value={summary?.current_streak || 0}
                  icon={
                    <Icons.flame className="w-4 h-4 text-[var(--color-text)]" />
                  }
                />
                <StatCard
                  label={t("stats.longestStreak")}
                  value={summary?.longest_streak || 0}
                />
              </div>

              {/* Heatmap */}
              <div>
                <h3 className="text-caption mb-3">{t("stats.yearActivity")}</h3>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <Heatmap data={heatmap} loading={false} />
                </div>
              </div>
            </div>
          ) : (
            <SessionList sessions={sessions} formatDate={formatDate} t={t} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="text-caption mb-1">{label}</div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-2xl font-medium text-mono">{value}</span>
      </div>
    </div>
  );
}

function SessionList({
  sessions,
  formatDate,
  t,
}: {
  sessions: Session[];
  formatDate: (d: string) => string;
  t: (key: string) => string;
}) {
  if (sessions.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-muted)] py-8">
        {t("history.noSessions")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <div
          key={s.id}
          className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm">{formatDate(s.started_at)}</div>
              <div className="text-caption text-mono">
                {Math.round((s.actual_duration_seconds || 0) / 60)} min
              </div>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded ${
                s.completed
                  ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                  : "bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]"
              }`}
            >
              {s.completed ? t("history.completed") : t("history.incomplete")}
            </div>
          </div>
          {s.note && <p className="mt-2 text-caption line-clamp-2">{s.note}</p>}
        </div>
      ))}
    </div>
  );
}
