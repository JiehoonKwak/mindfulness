import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AMBIENT_SOUNDS } from "../../constants/sounds";

interface SoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAmbient: (id: string, url: string, active: boolean) => void;
  onVolumeChange: (id: string, volume: number) => void;
  onMasterVolumeChange: (volume: number) => void;
  activeAmbients: Set<string>;
}

export default function SoundMixer({
  isOpen,
  onClose,
  onToggleAmbient,
  onVolumeChange,
  onMasterVolumeChange,
  activeAmbients,
}: SoundMixerProps) {
  const { t } = useTranslation();
  const [volumes, setVolumes] = useState<Record<string, number>>({
    master: 0.8,
    rain: 0.5,
    ocean: 0.5,
    forest: 0.5,
    tibetan_bowls: 0.5,
    wind_chimes: 0.5,
    white_noise: 0.5,
    river: 0.5,
    campfire: 0.5,
    wind: 0.5,
    birds: 0.5,
  });

  const handleVolumeChange = (id: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    if (id === "master") {
      onMasterVolumeChange(value);
    } else {
      onVolumeChange(id, value);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="
            absolute bottom-24 left-1/2 -translate-x-1/2
            w-80 p-4 rounded-2xl z-30
            bg-[var(--color-surface)]/80 backdrop-blur-xl
            border border-[var(--color-border)]/30
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
              {t("sounds.mixer")}
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              ✕
            </button>
          </div>

          {/* Master volume */}
          <div className="mb-4 pb-4 border-b border-[var(--color-border)]/30">
            <div className="flex justify-between text-sm mb-2">
              <span>{t("sounds.master")}</span>
              <span>{Math.round(volumes.master * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes.master}
              onChange={(e) =>
                handleVolumeChange("master", parseFloat(e.target.value))
              }
              className="w-full accent-[var(--color-primary)]"
            />
          </div>

          {/* Ambient sounds */}
          <div className="space-y-3">
            {AMBIENT_SOUNDS.map((sound) => (
              <div key={sound.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      onToggleAmbient(
                        sound.id,
                        sound.url,
                        !activeAmbients.has(sound.id),
                      )
                    }
                    className={`
                      flex items-center gap-2 text-sm transition-colors
                      ${
                        activeAmbients.has(sound.id)
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-3 h-3 rounded-full transition-colors
                        ${
                          activeAmbients.has(sound.id)
                            ? "bg-[var(--color-primary)]"
                            : "bg-[var(--color-border)]"
                        }
                      `}
                    />
                    {t(sound.labelKey)}
                  </button>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {Math.round(volumes[sound.id] * 100)}%
                  </span>
                </div>
                {activeAmbients.has(sound.id) && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumes[sound.id]}
                    onChange={(e) =>
                      handleVolumeChange(sound.id, parseFloat(e.target.value))
                    }
                    className="w-full accent-[var(--color-primary)]"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
