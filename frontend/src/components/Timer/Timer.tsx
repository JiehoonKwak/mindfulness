import { useTimer } from "../../hooks/useTimer";
import TimerControls from "./TimerControls";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Timer() {
  const { remaining, duration } = useTimer();
  const progress = ((duration - remaining) / duration) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Progress Ring */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="var(--color-surface)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="var(--color-primary)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-light">{formatTime(remaining)}</span>
        </div>
      </div>

      <TimerControls />
    </div>
  );
}
