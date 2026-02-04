import { useTranslation } from "react-i18next";
import { useBreathingTimer } from "../../hooks/useBreathingTimer";
import { BREATHING_PATTERNS, getPhaseKey } from "./patterns";
import FlowerAnimation from "./FlowerAnimation";
import CircleAnimation from "./CircleAnimation";

interface Props {
  variant?: "flower" | "circle";
  showControls?: boolean;
}

export default function BreathingGuide({
  variant = "flower",
  showControls = true,
}: Props) {
  const { t } = useTranslation();
  const { pattern, phase, phaseTime, cycleCount, isActive, setPattern, start, stop } =
    useBreathingTimer();

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md aspect-square">
        {variant === "flower" ? <FlowerAnimation /> : <CircleAnimation />}
      </div>

      {isActive && (
        <div className="text-center mt-4">
          <p className="text-2xl font-light">{t(getPhaseKey(phase))}</p>
          <p className="text-4xl font-bold mt-2">{phaseTime}</p>
        </div>
      )}

      {cycleCount > 0 && (
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          {cycleCount} {t("breathing.cycles")}
        </p>
      )}

      {showControls && (
        <div className="mt-8 space-y-4">
          {!isActive && (
            <div className="flex flex-wrap justify-center gap-2">
              {BREATHING_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    pattern.id === p.id
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  }`}
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
                className="bg-primary text-white px-8 py-3 rounded-full text-lg"
              >
                {t("timer.start")}
              </button>
            ) : (
              <button
                onClick={stop}
                className="bg-surface border border-red-500 text-red-500 px-8 py-3 rounded-full"
              >
                {t("timer.stop")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
