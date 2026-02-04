import { useTranslation } from "react-i18next";
import type { GoalProgress } from "../../api/goals";

interface GoalRingProps {
  progress: GoalProgress | null;
  loading: boolean;
}

export default function GoalRing({ progress, loading }: GoalRingProps) {
  const { t } = useTranslation();

  const percent = progress?.progress_percent ?? 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const goalTypeLabels: Record<string, string> = {
    daily_minutes: t("goals.dailyMinutes"),
    daily_sessions: t("goals.dailySessions"),
    weekly_minutes: t("goals.weeklyMinutes"),
    weekly_sessions: t("goals.weeklySessions"),
  };

  if (loading) {
    return (
      <div className="w-28 h-28 rounded-full bg-[var(--color-surface)]/30 animate-pulse" />
    );
  }

  if (!progress) {
    return (
      <div className="w-28 h-28 rounded-full bg-[var(--color-surface)]/30 flex items-center justify-center">
        <span className="text-xs text-[var(--color-text-muted)]">
          {t("goals.noGoal")}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
          opacity="0.3"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-light">
          {progress.current_value}/{progress.target_value}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {goalTypeLabels[progress.goal_type] || progress.goal_type}
        </span>
      </div>
    </div>
  );
}
