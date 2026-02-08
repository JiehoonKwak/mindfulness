import { useTranslation } from "react-i18next";
import { Icons } from "../Icons";

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
      {currentStreak > 0 ? (
        <Icons.flame className="w-5 h-5" />
      ) : (
        <span className="text-sm">—</span>
      )}
      <span className="text-sm">
        {currentStreak} {t("goals.dayStreak")}
      </span>
    </div>
  );
}
