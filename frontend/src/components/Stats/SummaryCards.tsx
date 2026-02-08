import { useTranslation } from "react-i18next";
import { Icons } from "../Icons";
import type { StatsSummary } from "../../api/stats";

interface SummaryCardsProps {
  stats: StatsSummary | null;
  loading: boolean;
}

const CARD_ICONS = {
  sessions: (p: React.SVGProps<SVGSVGElement>) => <Icons.home {...p} />,
  minutes: (p: React.SVGProps<SVGSVGElement>) => <Icons.history {...p} />,
  current: (p: React.SVGProps<SVGSVGElement>) => <Icons.flame {...p} />,
  longest: (p: React.SVGProps<SVGSVGElement>) => <Icons.check {...p} />,
};

export default function SummaryCards({ stats, loading }: SummaryCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      key: "sessions" as const,
      value: stats?.total_sessions ?? 0,
      label: t("stats.totalSessions"),
    },
    {
      key: "minutes" as const,
      value: stats?.total_minutes ?? 0,
      label: t("stats.totalMinutes"),
    },
    {
      key: "current" as const,
      value: stats?.current_streak ?? 0,
      label: t("stats.currentStreak"),
    },
    {
      key: "longest" as const,
      value: stats?.longest_streak ?? 0,
      label: t("stats.longestStreak"),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = CARD_ICONS[card.key];
        return (
          <div
            key={card.key}
            className="p-4 rounded-2xl backdrop-blur-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/30"
          >
            <Icon className="w-5 h-5 mb-1 text-[var(--color-text-muted)]" />
            <div className="text-3xl font-light text-[var(--color-text)]">
              {loading ? "—" : card.value}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
