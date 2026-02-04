import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useTimerStore } from "../../stores/timerStore";
import { VISUALS, visualComponents } from "./index";
import type { VisualId } from "./index";

export default function VisualSelector() {
  const { t } = useTranslation();
  const { selectedVisual, setSelectedVisual, status } = useTimerStore();
  const [preview, setPreview] = useState<string | null>(null);

  if (status !== "idle") return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4 text-center">
        {t("visuals.select")}
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {VISUALS.map((visual) => {
          const Component = visualComponents[visual.id as VisualId];
          return (
            <div key={visual.id} className="relative">
              <button
                onClick={() => setSelectedVisual(visual.id)}
                onMouseEnter={() => setPreview(visual.id)}
                onMouseLeave={() => setPreview(null)}
                className={`
                  px-4 py-2 rounded-xl transition-all duration-200
                  text-sm
                  ${
                    selectedVisual === visual.id
                      ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                      : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
                  }
                `}
              >
                {visual.name}
              </button>

              {/* Preview popup */}
              {preview === visual.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-border)] shadow-xl z-50 bg-[var(--color-bg)]">
                  <Suspense
                    fallback={
                      <div className="w-full h-full bg-[var(--color-surface)] animate-pulse" />
                    }
                  >
                    <div className="w-full h-full relative">
                      <Component isActive={true} speed={1} />
                    </div>
                  </Suspense>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
