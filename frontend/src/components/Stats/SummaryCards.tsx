import { useTranslation } from "react-i18next";
import type { StatsSummary } from "../../api/stats";

interface SummaryCardsProps {
  stats: StatsSummary | null;
  loading: boolean;
}

export default function SummaryCards({ stats, loading }: SummaryCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      key: "sessions",
      value: stats?.total_sessions ?? 0,
      label: t("stats.totalSessions"),
      icon: "🧘",
    },
    {
      key: "minutes",
      value: stats?.total_minutes ?? 0,
      label: t("stats.totalMinutes"),
      icon: "⏱",
    },
    {
      key: "current",
      value: stats?.current_streak ?? 0,
      label: t("stats.currentStreak"),
      icon: "🔥",
    },
    {
      key: "longest",
      value: stats?.longest_streak ?? 0,
      label: t("stats.longestStreak"),
      icon: "🏆",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="p-4 rounded-2xl backdrop-blur-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/30"
        >
          <div className="text-2xl mb-1">{card.icon}</div>
          <div className="text-3xl font-light text-[var(--color-text)]">
            {loading ? "—" : card.value}
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
