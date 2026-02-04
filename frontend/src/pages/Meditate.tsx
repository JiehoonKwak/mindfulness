import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTimer } from "../hooks/useTimer";
import { useAudioLayers } from "../hooks/useAudioLayers";
import { useTimerStore } from "../stores/timerStore";
import { useBreathingStore } from "../stores/breathingStore";
import { useSessionStore } from "../stores/sessionStore";
import { useSettingsStore } from "../stores/settingsStore";
import { Timer, DurationPicker } from "../components/Timer";
import { VisualSelector, visualComponents } from "../components/Visuals";
import { BreathingGuide } from "../components/BreathingGuide";
import PostSessionModal from "../components/Journal/PostSessionModal";
import SoundMixer from "../components/SoundMixer/SoundMixer";

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const reset = useTimerStore((state) => state.reset);
  const { start: startBreathing, stop: stopBreathing } = useBreathingStore();
  const { currentSessionId, updateJournal } = useSessionStore();
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showSoundMixer, setShowSoundMixer] = useState(false);
  const [activeAmbients, setActiveAmbients] = useState<Set<string>>(new Set());
  const audio = useAudioLayers();
  const { defaultAmbient } = useSettingsStore();
  const prevStatusRef = useRef(status);

  // Auto-play default ambient when meditation starts (only on transition TO running)
  useEffect(() => {
    if (status === "running" && prevStatusRef.current !== "running" && defaultAmbient !== "none") {
      const soundUrl = `/sounds/ambient/${defaultAmbient === "rain" ? "rain_light" :
                                          defaultAmbient === "ocean" ? "ocean_waves" :
                                          defaultAmbient}.mp3`;
      audio.addAmbient(defaultAmbient, soundUrl);
      setActiveAmbients((prev) => new Set([...prev, defaultAmbient]));
    }
    prevStatusRef.current = status;
  }, [status, defaultAmbient, audio]);

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
