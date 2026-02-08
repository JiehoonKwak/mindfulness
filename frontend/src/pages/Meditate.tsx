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
import { Icons } from "../components/Icons";
import PostSessionModal from "../components/Journal/PostSessionModal";
import SoundMixer from "../components/SoundMixer/SoundMixer";
import { getAmbientUrl } from "../constants/sounds";
import { API_BASE } from "../api/config";

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const reset = useTimerStore((state) => state.reset);
  const stop = useTimerStore((state) => state.stop);
  const { start: startBreathing, stop: stopBreathing } = useBreathingStore();
  const { currentSessionId, updateJournal } = useSessionStore();
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showSoundMixer, setShowSoundMixer] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [activeAmbients, setActiveAmbients] = useState<Set<string>>(new Set());
  const [isMusicActive, setIsMusicActive] = useState(false);
  const audio = useAudioLayers();
  const { defaultAmbient, defaultMusic, musicVolume, ambientVolumes } =
    useSettingsStore();
  const prevStatusRef = useRef(status);

  // Auto-play default ambient and music when meditation starts (only on transition TO running)
  useEffect(() => {
    if (status === "running" && prevStatusRef.current !== "running") {
      // Play default ambient sound
      if (defaultAmbient !== "none") {
        const soundUrl = getAmbientUrl(defaultAmbient);
        const volume =
          ambientVolumes[defaultAmbient as keyof typeof ambientVolumes] ?? 0.5;
        if (soundUrl) {
          audio.addAmbient(defaultAmbient, soundUrl, volume);
          // Use setTimeout to avoid synchronous setState in effect
          queueMicrotask(() =>
            setActiveAmbients((prev) => new Set([...prev, defaultAmbient])),
          );
        }
      }

      // Play default background music
      if (defaultMusic?.filename) {
        const musicUrl = `${API_BASE}/sounds/music/generated/${defaultMusic.filename}`;
        audio.playMusic(musicUrl, musicVolume);
        queueMicrotask(() => setIsMusicActive(true));
      }
    }
  }, [
    status,
    defaultAmbient,
    defaultMusic,
    musicVolume,
    ambientVolumes,
    audio,
  ]);

  // Handle audio on timer status changes
  useEffect(() => {
    if (prevStatusRef.current === "running" && status === "paused") {
      // Timer paused - pause audio
      audio.pauseAll();
    } else if (prevStatusRef.current === "paused" && status === "running") {
      // Timer resumed - resume audio
      audio.resumeAll();
    } else if (prevStatusRef.current !== "idle" && status === "idle") {
      // Timer stopped - fade out and clear
      audio.fadeOutAll(500);
      queueMicrotask(() => {
        setActiveAmbients(new Set());
        setIsMusicActive(false);
      });
    }
    // CRITICAL: Update ref to track current status for next comparison
    prevStatusRef.current = status;
  }, [status, audio]);

  // Show journal modal when session completes
  useEffect(() => {
    if (status === "complete" && currentSessionId) {
      // Fade out all sounds (ambient + music)
      audio.fadeOutAll(2000);
      queueMicrotask(() => {
        setShowJournalModal(true);
        setActiveAmbients(new Set());
        setIsMusicActive(false);
      });
    }
  }, [status, currentSessionId, audio]);

  // Handle stop with confirmation
  const handleStopRequest = () => {
    setShowStopConfirm(true);
  };

  const handleStopConfirm = () => {
    setShowStopConfirm(false);
    stop();
  };

  const handleStopCancel = () => {
    setShowStopConfirm(false);
  };

  const handleToggleAmbient = (id: string, url: string, active: boolean) => {
    if (active) {
      const volume = ambientVolumes[id as keyof typeof ambientVolumes] ?? 0.5;
      audio.addAmbient(id, url, volume);
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

  // Check if any audio is playing
  const hasActiveAudio = activeAmbients.size > 0 || isMusicActive;

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
  const isActive = isRunning || status === "countdown";

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

      {/* Visual background - show during countdown and running */}
      {isActive && VisualComponent && (
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
          className={`
            absolute top-4 right-4 z-20
            w-10 h-10 rounded-full
            bg-[var(--color-surface)]/50 backdrop-blur-sm
            flex items-center justify-center
            transition-all
            ${
              hasActiveAudio
                ? "text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }
          `}
          title={t("sounds.mixer")}
        >
          <Icons.music
            className={`w-5 h-5 ${hasActiveAudio ? "animate-pulse" : ""}`}
          />
          {hasActiveAudio && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-primary)]" />
          )}
        </button>
      )}

      {/* Audio error message */}
      {audio.audioError && (
        <div
          className="absolute top-16 right-4 z-20 p-3 rounded-xl bg-red-500/20 text-red-400 text-sm max-w-xs"
          onClick={() => audio.initializeAudio()}
        >
          {audio.audioError}
        </div>
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
        <Timer onStopRequest={handleStopRequest} />

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

      {/* Stop Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <h3 className="text-lg font-medium mb-2">
              {t("timer.stopConfirmTitle")}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {t("timer.stopConfirmMessage")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStopCancel}
                className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)]/20 transition-colors"
              >
                {t("timer.continue")}
              </button>
              <button
                onClick={handleStopConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t("timer.stop")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
