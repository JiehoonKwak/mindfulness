import { useTimer } from "../../hooks/useTimer";

export default function TimerControls() {
  const { status, start, pause, resume, stop } = useTimer();

  return (
    <div className="flex gap-4 mt-8 items-center">
      {status === "idle" && (
        <button
          onClick={start}
          className="
            w-16 h-16 rounded-full
            bg-[var(--color-primary)] text-white
            flex items-center justify-center
            shadow-lg shadow-[var(--color-primary)]/30
            hover:scale-105 active:scale-95
            transition-transform
          "
          aria-label="Start"
        >
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {status === "running" && (
        <>
          <button
            onClick={pause}
            className="
              w-14 h-14 rounded-full
              bg-[var(--color-surface)]/60 backdrop-blur-xl
              border border-[var(--color-border)]/50
              flex items-center justify-center
              hover:bg-[var(--color-surface)] transition-colors
            "
            aria-label="Pause"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </button>
          <button
            onClick={stop}
            className="
              w-14 h-14 rounded-full
              bg-[var(--color-surface)]/60 backdrop-blur-xl
              border border-red-500/30
              text-red-500
              flex items-center justify-center
              hover:bg-red-500/10 transition-colors
            "
            aria-label="Stop"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            onClick={resume}
            className="
              w-16 h-16 rounded-full
              bg-[var(--color-primary)] text-white
              flex items-center justify-center
              shadow-lg shadow-[var(--color-primary)]/30
              hover:scale-105 active:scale-95
              transition-transform
            "
            aria-label="Resume"
          >
            <svg
              className="w-6 h-6 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            onClick={stop}
            className="
              w-14 h-14 rounded-full
              bg-[var(--color-surface)]/60 backdrop-blur-xl
              border border-red-500/30
              text-red-500
              flex items-center justify-center
              hover:bg-red-500/10 transition-colors
            "
            aria-label="Stop"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </>
      )}

      {status === "complete" && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-light tracking-widest uppercase text-[var(--color-primary)]">
            Complete
          </div>
          <button
            onClick={stop}
            className="
              px-6 py-3 rounded-2xl
              bg-[var(--color-surface)]/60 backdrop-blur-xl
              border border-[var(--color-border)]/50
              text-sm uppercase tracking-widest
              hover:bg-[var(--color-surface)] transition-colors
            "
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
