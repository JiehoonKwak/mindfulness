import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useBreathingTimer } from "../hooks/useBreathingTimer";
import { useBreathingStore } from "../stores/breathingStore";
import { BREATHING_PATTERNS, getPhaseKey } from "../components/BreathingGuide/patterns";
import { breathingVisualComponents, BREATHING_VISUALS } from "../components/BreathingVisuals";
import type { BreathingVisualId } from "../components/BreathingVisuals";

export default function Breathe() {
  const { t } = useTranslation();
  const {
    pattern,
    phase,
    phaseTime,
    cycleCount,
    isActive,
    setPattern,
    start,
    stop,
  } = useBreathingTimer();
  const { selectedVisual, setSelectedVisual } = useBreathingStore();

  const VisualComponent =
    breathingVisualComponents[selectedVisual as BreathingVisualId] ||
    breathingVisualComponents.waves;

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[var(--color-bg)]">
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] animate-pulse" />
            </div>
          }
        >
          <VisualComponent />
        </Suspense>
      </div>

      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="text-[var(--color-text-muted)] text-sm tracking-wider hover:text-[var(--color-text)] transition-colors"
        >
          &larr; {t("app.title")}
        </Link>
      </div>

      {isActive && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <p className="text-3xl font-light tracking-[0.3em] uppercase text-[var(--color-text)]/80">
            {t(getPhaseKey(phase))}
          </p>
          <p className="text-6xl font-extralight mt-4 tabular-nums text-[var(--color-text)]">
            {phaseTime}
          </p>
        </div>
      )}

      {cycleCount > 0 && (
        <p className="absolute top-4 right-4 z-10 text-sm text-[var(--color-text-muted)] tracking-wider">
          {cycleCount} {t("breathing.cycles")}
        </p>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-md mx-auto space-y-4">
          {!isActive && (
            <div className="flex gap-2 justify-center mb-4">
              {BREATHING_VISUALS.map((visual) => (
                <button
                  key={visual.id}
                  onClick={() => setSelectedVisual(visual.id)}
                  className={`
                    px-3 py-1.5 rounded-lg transition-all duration-200
                    text-xs tracking-wider
                    ${
                      selectedVisual === visual.id
                        ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                        : "bg-[var(--color-surface)]/60 backdrop-blur-sm text-[var(--color-text-muted)]"
                    }
                  `}
                >
                  {t(visual.nameKey)}
                </button>
              ))}
            </div>
          )}

          {!isActive && (
            <div className="flex flex-wrap justify-center gap-2">
              {BREATHING_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`
                    px-4 py-2 rounded-2xl backdrop-blur-xl
                    border transition-all duration-200
                    text-sm tracking-wider
                    ${
                      pattern.id === p.id
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-bg)]"
                        : "bg-[var(--color-surface)]/40 border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                    }
                  `}
                >
                  {t(p.nameKey)}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-2">
            {!isActive ? (
              <button
                onClick={start}
                className="
                  w-16 h-16 rounded-full
                  bg-[var(--color-primary)] text-[var(--color-bg)]
                  flex items-center justify-center
                  shadow-lg shadow-black/20
                  hover:scale-105 transition-transform
                "
              >
                <svg
                  className="w-6 h-6 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={stop}
                className="
                  w-16 h-16 rounded-full
                  bg-[var(--color-surface)]/60 backdrop-blur-xl
                  border border-[var(--color-border)]
                  text-[var(--color-text)]
                  flex items-center justify-center
                  hover:bg-[var(--color-surface)] transition-colors
                "
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
