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
  const setBreathingEnabled = useTimerStore(
    (state) => state.setBreathingEnabled,
  );
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

  const VisualComponent =
    visualComponents[selectedVisual as keyof typeof visualComponents];
  const isRunning = status === "running" || status === "paused";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Back button (only when idle) */}
      {status === "idle" && (
        <div className="absolute top-4 left-4 z-20">
          <Link
            to="/"
            className="text-[var(--color-text-muted)] text-sm tracking-wider hover:text-[var(--color-text)] transition-colors"
          >
            &larr; {t("app.title")}
          </Link>
        </div>
      )}

      {/* Visual background */}
      {isRunning && VisualComponent && (
        <Suspense
          fallback={<div className="absolute inset-0 bg-[var(--color-bg)]" />}
        >
          <VisualComponent isActive={status === "running"} />
        </Suspense>
      )}

      {/* Breathing overlay */}
      {isRunning && breathingEnabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-64 h-64 opacity-60">
            <BreathingGuide showControls={false} />
          </div>
        </div>
      )}

      {/* Timer UI */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Timer />

        {status === "idle" && (
          <>
            <DurationPicker />
            <VisualSelector />

            {/* Breathing toggle */}
            <button
              onClick={() => setBreathingEnabled(!breathingEnabled)}
              className={`
                mt-6 px-5 py-3 rounded-2xl backdrop-blur-xl
                border transition-all duration-200
                flex items-center gap-3
                text-sm tracking-wider
                ${
                  breathingEnabled
                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                    : "bg-[var(--color-surface)]/30 border-[var(--color-border)]/30 text-[var(--color-text-muted)]"
                }
              `}
            >
              <div
                className={`
                  w-10 h-5 rounded-full transition-colors duration-200
                  ${breathingEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded-full bg-white shadow-sm
                    transform transition-transform duration-200
                    translate-y-0.5
                    ${breathingEnabled ? "translate-x-5" : "translate-x-0.5"}
                  `}
                />
              </div>
              <span className="uppercase tracking-widest text-xs">
                {t("breathing.enableDuringMeditation")}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
