import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getGoalsProgress, type GoalProgress } from "../api/goals";
import { getStreak, type StreakInfo } from "../api/stats";
import GoalRing from "../components/Goals/GoalRing";
import StreakDisplay from "../components/Goals/StreakDisplay";

export default function Home() {
  const { t } = useTranslation();
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, streakData] = await Promise.all([
          getGoalsProgress(),
          getStreak(),
        ]);
        // Use first active goal for display
        setGoalProgress(progressData[0] || null);
        setStreak(streakData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-2">{t("app.title")}</h1>
      <p className="text-[var(--color-text-muted)] mb-4">{t("app.tagline")}</p>

      {/* Goal & Streak Display */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <GoalRing progress={goalProgress} loading={loading} />
        <StreakDisplay currentStreak={streak?.current ?? 0} loading={loading} />
      </div>

      <div className="flex flex-col gap-4">
        <Link
          to="/meditate"
          className="bg-primary px-8 py-4 rounded-full text-lg text-center"
        >
          {t("home.startMeditation")}
        </Link>
        <Link
          to="/breathe"
          className="bg-surface border border-primary px-8 py-4 rounded-full text-lg text-center"
        >
          {t("breathing.title") || "Breathing Guide"}
        </Link>
        <div className="flex gap-6 mt-6">
          <Link
            to="/stats"
            className="text-[var(--color-text-muted)] text-center"
          >
            {t("nav.stats")}
          </Link>
          <Link
            to="/history"
            className="text-[var(--color-text-muted)] text-center"
          >
            {t("nav.history")}
          </Link>
          <Link
            to="/settings"
            className="text-[var(--color-text-muted)] text-center"
          >
            {t("home.settings")}
          </Link>
        </div>
      </div>
    </div>
  );
}
