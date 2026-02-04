import { useTranslation } from "react-i18next";
import { useBreathingTimer } from "../../hooks/useBreathingTimer";
import { BREATHING_PATTERNS, getPhaseKey } from "./patterns";
import AuraBreathing from "./AuraBreathing";

interface Props {
  showControls?: boolean;
}

export default function BreathingGuide({ showControls = true }: Props) {
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

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-lg aspect-square flex items-center justify-center">
        <AuraBreathing />
      </div>

      {isActive && (
        <div className="text-center mt-4">
          <p className="text-2xl font-light tracking-widest uppercase">
            {t(getPhaseKey(phase))}
          </p>
          <p className="text-5xl font-extralight mt-2 tabular-nums">
            {phaseTime}
          </p>
        </div>
      )}

      {cycleCount > 0 && (
        <p className="text-sm text-[var(--color-text-muted)] mt-4 tracking-wider">
          {cycleCount} {t("breathing.cycles")}
        </p>
      )}

      {showControls && (
        <div className="mt-8 space-y-6">
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

          <div className="flex justify-center">
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
                  border border-red-500/50 text-red-500
                  flex items-center justify-center
                  hover:bg-red-500/10 transition-colors
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
      )}
    </div>
  );
}
