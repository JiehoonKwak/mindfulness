import { useRef, useCallback, useEffect } from "react";

export interface UseAudioOptions {
  volume?: number;
  onEnded?: () => void;
}

export interface UseAudioReturn {
  play: () => Promise<void>;
  setVolume: (volume: number) => void;
  loadAudio: () => Promise<void>;
}

// Extend Window interface for webkit prefix
interface WebkitWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}

export function useAudio(src: string, options: UseAudioOptions = {}): UseAudioReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isLoadedRef = useRef(false);

  // Initialize AudioContext on first user interaction (iOS requirement)
  const initAudioContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as WebkitWindow).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = options.volume ?? 1;
    }
    return audioContextRef.current;
  }, [options.volume]);

  // Load audio buffer
  const loadAudio = useCallback(async (): Promise<void> => {
    if (isLoadedRef.current || !src) return;

    try {
      const ctx = initAudioContext();
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      audioBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
      isLoadedRef.current = true;
    } catch (error) {
      console.error("Failed to load audio:", error);
    }
  }, [src, initAudioContext]);

  // Play the audio
  const play = useCallback(async (): Promise<void> => {
    const ctx = initAudioContext();

    // Resume context if suspended (iOS requirement)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Load if not already loaded
    if (!audioBufferRef.current) {
      await loadAudio();
    }

    if (!audioBufferRef.current || !gainNodeRef.current) return;

    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(gainNodeRef.current);

    if (options.onEnded) {
      source.onended = options.onEnded;
    }

    source.start(0);
  }, [initAudioContext, loadAudio, options.onEnded]);

  // Set volume
  const setVolume = useCallback((volume: number): void => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Preload audio on mount via user interaction
  useEffect(() => {
    const handleInteraction = (): void => {
      void loadAudio();
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, [loadAudio]);

  return { play, setVolume, loadAudio };
}
