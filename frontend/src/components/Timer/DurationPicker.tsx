import { useTimerStore } from "../../stores/timerStore";
import { useTranslation } from "react-i18next";
import ClockDial from "./ClockDial";

const PRESETS = [5, 10, 15, 20, 30];

export default function DurationPicker() {
  const { t } = useTranslation();
  const { duration, setDuration, status } = useTimerStore();
  const currentMinutes = duration / 60;

  if (status !== "idle") return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <ClockDial />

      {/* Quick presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((mins) => (
          <button
            key={mins}
            onClick={() => setDuration(mins)}
            className={`
              px-4 py-2 rounded-2xl backdrop-blur-xl
              border transition-all duration-200
              text-sm tracking-wider
              ${
                currentMinutes === mins
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)]/40 border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
              }
            `}
          >
            {mins} {t("timer.minutes")}
          </button>
        ))}
      </div>
    </div>
  );
}
