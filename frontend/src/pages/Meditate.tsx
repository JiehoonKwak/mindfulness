import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTimer } from "../hooks/useTimer";
import { useTimerStore } from "../stores/timerStore";
import { useBreathingStore } from "../stores/breathingStore";
import { Timer, DurationPicker } from "../components/Timer";
import { VisualSelector, visualComponents } from "../components/Visuals";
import { BreathingGuide } from "../components/BreathingGuide";

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const setBreathingEnabled = useTimerStore((state) => state.setBreathingEnabled);
  const { start: startBreathing, stop: stopBreathing } = useBreathingStore();

  // Sync breathing with timer
  useEffect(() => {
    if (breathingEnabled) {
      if (status === "running") {
        startBreathing();
      } else {
        stopBreathing();
      }
    }
  }, [status, breathingEnabled, startBreathing, stopBreathing]);

  const VisualComponent = visualComponents[selectedVisual as keyof typeof visualComponents];
  const isRunning = status === "running" || status === "paused";

  return (
    <div className="min-h-screen relative">
      {/* Back button (only when idle) */}
      {status === "idle" && (
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="text-[var(--color-text-muted)]">
            &larr; {t("app.title")}
          </Link>
        </div>
      )}

      {/* Visual background */}
      {isRunning && VisualComponent && (
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <VisualComponent isActive={status === "running"} />
        </Suspense>
      )}

      {/* Breathing overlay */}
      {isRunning && breathingEnabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64">
            <BreathingGuide variant="circle" showControls={false} />
          </div>
        </div>
      )}

      {/* Timer UI */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Timer />
        <DurationPicker />
        <VisualSelector />

        {/* Breathing toggle */}
        {status === "idle" && (
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={breathingEnabled}
              onChange={(e) => setBreathingEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span>{t("breathing.enableDuringMeditation")}</span>
          </label>
        )}
      </div>
    </div>
  );
}
