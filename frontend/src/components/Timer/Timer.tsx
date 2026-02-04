import { useTimer } from "../../hooks/useTimer";
import TimerControls from "./TimerControls";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Timer() {
  const { remaining, duration, status } = useTimer();
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Progress Ring */}
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
          {status === "idle" && (
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)] mt-2">
              {Math.round(duration / 60)} min
            </span>
          )}
        </div>
      </div>

      <TimerControls />
    </div>
  );
}
