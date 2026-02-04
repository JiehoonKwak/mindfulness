import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTimer } from "../hooks/useTimer";
import { useAudioLayers } from "../hooks/useAudioLayers";
import { useTimerStore } from "../stores/timerStore";
import { useBreathingStore } from "../stores/breathingStore";
import { useSessionStore } from "../stores/sessionStore";
import { Timer, DurationPicker } from "../components/Timer";
import { VisualSelector, visualComponents } from "../components/Visuals";
import { BreathingGuide } from "../components/BreathingGuide";
import PostSessionModal from "../components/Journal/PostSessionModal";
import SoundMixer from "../components/SoundMixer/SoundMixer";

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const setBreathingEnabled = useTimerStore(
    (state) => state.setBreathingEnabled,
  );
  const reset = useTimerStore((state) => state.reset);
  const { start: startBreathing, stop: stopBreathing } = useBreathingStore();
  const { currentSessionId, updateJournal } = useSessionStore();
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showSoundMixer, setShowSoundMixer] = useState(false);
  const [activeAmbients, setActiveAmbients] = useState<Set<string>>(new Set());
  const audio = useAudioLayers();

  // Show journal modal when session completes
  useEffect(() => {
    if (status === "complete" && currentSessionId) {
      setShowJournalModal(true);
      // Fade out ambient sounds
      audio.fadeOutAll(2000);
      setActiveAmbients(new Set());
    }
  }, [status, currentSessionId, audio]);

  const handleToggleAmbient = (id: string, url: string, active: boolean) => {
    if (active) {
      audio.addAmbient(id, url);
      setActiveAmbients((prev) => new Set([...prev, id]));
    } else {
      audio.removeAmbient(id);
      setActiveAmbients((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

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

      {/* Sound mixer toggle (when running) */}
      {isRunning && (
        <button
          onClick={() => setShowSoundMixer(!showSoundMixer)}
          className="
            absolute top-4 right-4 z-20
            w-10 h-10 rounded-full
            bg-[var(--color-surface)]/50 backdrop-blur-sm
            flex items-center justify-center
            text-[var(--color-text-muted)]
            hover:text-[var(--color-text)]
            transition-colors
          "
          title={t("sounds.mixer")}
        >
          🎵
        </button>
      )}

      <SoundMixer
        isOpen={showSoundMixer}
        onClose={() => setShowSoundMixer(false)}
        onToggleAmbient={handleToggleAmbient}
        onVolumeChange={audio.setAmbientVolume}
        onMasterVolumeChange={audio.setMasterVolume}
        activeAmbients={activeAmbients}
      />

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

      <PostSessionModal
        isOpen={showJournalModal}
        onSave={async (mood, note) => {
          await updateJournal(mood, note);
          setShowJournalModal(false);
          reset();
        }}
        onSkip={() => {
          setShowJournalModal(false);
          reset();
        }}
      />
    </div>
  );
}
