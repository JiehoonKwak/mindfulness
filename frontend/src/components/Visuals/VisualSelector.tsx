import { useTimerStore } from "../../stores/timerStore";
import { useTranslation } from "react-i18next";

const VISUALS = [
  { id: "breathingCircle", preview: "⭕" },
  { id: "particleFlow", preview: "✨" },
  { id: "gradientWaves", preview: "🌊" },
  { id: "aurora", preview: "🌌" },
  { id: "mandala", preview: "🔮" },
  { id: "cosmicDust", preview: "⭐" },
  { id: "zenGarden", preview: "🪨" },
  { id: "liquidMetal", preview: "💧" },
  { id: "sacredGeometry", preview: "📐" },
  { id: "oceanDepth", preview: "🐙" },
];

export default function VisualSelector() {
  const { t } = useTranslation();
  const { selectedVisual, setSelectedVisual, status } = useTimerStore();

  if (status !== "idle") return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm text-[var(--color-text-muted)] mb-3 text-center">
        {t("visuals.select")}
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {VISUALS.map((visual) => (
          <button
            key={visual.id}
            onClick={() => setSelectedVisual(visual.id)}
            className={`p-3 rounded-lg text-2xl ${
              selectedVisual === visual.id
                ? "bg-primary/20 ring-2 ring-primary"
                : "bg-surface"
            }`}
            title={t(`visuals.${visual.id}`)}
          >
            {visual.preview}
          </button>
        ))}
      </div>
    </div>
  );
}
