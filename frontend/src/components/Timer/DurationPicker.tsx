import { useTimerStore } from "../../stores/timerStore";
import { useTranslation } from "react-i18next";

const PRESETS = [3, 5, 10, 12, 15, 20, 30, 45, 60];

export default function DurationPicker() {
  const { t } = useTranslation();
  const { duration, setDuration, status } = useTimerStore();
  const currentMinutes = duration / 60;

  if (status !== "idle") return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {PRESETS.map((mins) => (
        <button
          key={mins}
          onClick={() => setDuration(mins)}
          className={`px-4 py-2 rounded-full ${
            currentMinutes === mins
              ? "bg-primary text-white"
              : "bg-surface border border-border"
          }`}
        >
          {mins} {t("timer.minutes")}
        </button>
      ))}
    </div>
  );
}
