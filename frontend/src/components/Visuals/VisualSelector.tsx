import { useTimerStore } from "../../stores/timerStore";
import { useTranslation } from "react-i18next";

const VISUALS = [
  { id: "aurora", label: "Aurora" },
  { id: "breathingCircle", label: "Circle" },
  { id: "particleFlow", label: "Particle" },
  { id: "gradientWaves", label: "Waves" },
  { id: "mandala", label: "Mandala" },
  { id: "cosmicDust", label: "Cosmic" },
  { id: "zenGarden", label: "Zen" },
  { id: "liquidMetal", label: "Liquid" },
  { id: "sacredGeometry", label: "Sacred" },
  { id: "oceanDepth", label: "Ocean" },
];

export default function VisualSelector() {
  const { t } = useTranslation();
  const { selectedVisual, setSelectedVisual, status } = useTimerStore();

  if (status !== "idle") return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4 text-center">
        {t("visuals.select")}
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {VISUALS.map((visual) => (
          <button
            key={visual.id}
            onClick={() => setSelectedVisual(visual.id)}
            className={`
              px-4 py-2 rounded-2xl backdrop-blur-xl
              border transition-all duration-200
              text-xs uppercase tracking-widest
              ${
                selectedVisual === visual.id
                  ? "bg-[var(--color-surface)]/60 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-[var(--color-surface)]/30 border-[var(--color-border)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-border)]"
              }
            `}
            title={t(`visuals.${visual.id}`)}
          >
            {visual.label}
          </button>
        ))}
      </div>
    </div>
  );
}
