import { useTranslation } from "react-i18next";
import { useTimer } from "../../hooks/useTimer";
import TimerControls from "./TimerControls";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface TimerProps {
  onStopRequest?: () => void;
}

export default function Timer({ onStopRequest }: TimerProps = {}) {
  const { t } = useTranslation();
  const { remaining, duration, status, countdown } = useTimer();
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  // Don't render progress ring in idle state - ClockDial shows time
  if (status === "idle") {
    return (
      <div className="flex flex-col items-center">
        <TimerControls onStopRequest={onStopRequest} />
      </div>
    );
  }

  // Countdown phase - show preparation screen
  if (status === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/30 animate-ping" />
          <div className="absolute inset-4 rounded-full border border-[var(--color-primary)]/50" />

          <div className="flex flex-col items-center z-10">
            <span className="text-8xl font-extralight text-[var(--color-primary)] animate-pulse">
              {countdown}
            </span>
            <span className="text-sm text-[var(--color-text-muted)] mt-4 tracking-widest uppercase">
              {t("timer.getReady")}
            </span>
          </div>
        </div>

        {/* Cancel button during countdown */}
        <button
          onClick={onStopRequest}
          className="mt-8 px-6 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          {t("timer.cancel")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress Ring - only shown when not idle */}
      <div className="relative w-72 h-72">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="var(--color-border)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {/* Progress ring */}
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="var(--color-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
            className="transition-all duration-1000 ease-linear"
            opacity="0.8"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-6xl font-extralight tabular-nums tracking-tight"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      <TimerControls onStopRequest={onStopRequest} />
    </div>
  );
}
