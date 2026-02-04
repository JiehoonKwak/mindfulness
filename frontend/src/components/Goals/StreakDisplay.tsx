import { useTranslation } from "react-i18next";

interface StreakDisplayProps {
  currentStreak: number;
  loading: boolean;
}

export default function StreakDisplay({
  currentStreak,
  loading,
}: StreakDisplayProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="h-8 w-20 bg-[var(--color-surface)]/30 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)]/40 backdrop-blur-sm">
      <span className="text-xl">{currentStreak > 0 ? "🔥" : "💭"}</span>
      <span className="text-sm">
        {currentStreak} {t("goals.dayStreak")}
      </span>
    </div>
  );
}
