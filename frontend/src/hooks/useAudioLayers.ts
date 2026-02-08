import { useRef, useCallback, useEffect, useState } from "react";

interface AudioLayer {
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  buffer: AudioBuffer | null;
  isPlaying: boolean;
}

interface MusicLayer {
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  buffer: AudioBuffer | null;
  isPlaying: boolean;
}

interface UseAudioLayersReturn {
  playBell: (url: string) => Promise<void>;
  addAmbient: (
    id: string,
    url: string,
    initialVolume?: number,
  ) => Promise<void>;
  removeAmbient: (id: string) => void;
  setAmbientVolume: (id: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  pauseAll: () => void;
  resumeAll: () => void;
  fadeOutAll: (durationMs?: number) => void;
  isAmbientPlaying: (id: string) => boolean;
  // Music layer
  playMusic: (url: string, volume?: number) => Promise<void>;
  stopMusic: () => void;
  setMusicVolume: (volume: number) => void;
  isMusicPlaying: () => boolean;
  // Audio context state
  audioError: string | null;
  isAudioReady: boolean;
  initializeAudio: () => Promise<boolean>;
}

export function useAudioLayers(): UseAudioLayersReturn {
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientLayersRef = useRef<Map<string, AudioLayer>>(new Map());
  const musicLayerRef = useRef<MusicLayer | null>(null);
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Initialize audio context on first use
  const getContext = useCallback(() => {
    try {
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
        masterGainRef.current = contextRef.current.createGain();
        masterGainRef.current.connect(contextRef.current.destination);
        setIsAudioReady(true);
        setAudioError(null);
      }
      // Resume if suspended (browser autoplay policy)
      if (contextRef.current.state === "suspended") {
        contextRef.current.resume().catch(() => {
          setAudioError("Audio blocked. Tap to enable sound.");
        });
      }
      return contextRef.current;
    } catch {
      setAudioError("Audio not supported on this device.");
      return null;
    }
  }, []);

  // Manual initialization for user gesture
  const initializeAudio = useCallback(async (): Promise<boolean> => {
    try {
      const ctx = getContext();
      if (!ctx) return false;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      setIsAudioReady(true);
      setAudioError(null);
      return true;
    } catch {
      setAudioError("Failed to initialize audio.");
      return false;
    }
  }, [getContext]);

  // Load and cache audio buffer
  const loadBuffer = useCallback(
    async (url: string): Promise<AudioBuffer | null> => {
      const cached = bufferCacheRef.current.get(url);
      if (cached) return cached;

      const ctx = getContext();
      if (!ctx) return null;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          setAudioError(`Failed to load audio: ${url}`);
          return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        bufferCacheRef.current.set(url, audioBuffer);
        return audioBuffer;
      } catch {
        setAudioError("Failed to decode audio file.");
        return null;
      }
    },
    [getContext],
  );

  // Play one-shot bell sound
  const playBell = useCallback(
    async (url: string) => {
      const ctx = getContext();
      if (!ctx || !masterGainRef.current) return;

      const buffer = await loadBuffer(url);
      if (!buffer) return;

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      gainNode.gain.value = 0.7;

      source.start();
    },
    [getContext, loadBuffer],
  );

  // Add looping ambient layer
  const addAmbient = useCallback(
    async (id: string, url: string, initialVolume: number = 0.5) => {
      const ctx = getContext();
      if (!ctx || !masterGainRef.current) return;

      // Stop existing layer if present
      const existing = ambientLayersRef.current.get(id);
      if (existing?.source) {
        existing.source.stop();
      }

      const buffer = await loadBuffer(url);
      if (!buffer) return;

      const gainNode = ctx.createGain();
      gainNode.connect(masterGainRef.current);
      gainNode.gain.value = 0;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();

      // Fade in to initial volume
      gainNode.gain.linearRampToValueAtTime(initialVolume, ctx.currentTime + 1);

      ambientLayersRef.current.set(id, {
        source,
        gainNode,
        buffer,
        isPlaying: true,
      });
    },
    [getContext, loadBuffer],
  );

  // Remove ambient layer with fade out
  const removeAmbient = useCallback((id: string) => {
    const layer = ambientLayersRef.current.get(id);
    if (!layer?.source) return;

    const ctx = contextRef.current;
    if (ctx) {
      layer.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        layer.source?.stop();
        ambientLayersRef.current.delete(id);
      }, 500);
    }
  }, []);

  // Set volume for specific ambient
  const setAmbientVolume = useCallback((id: string, volume: number) => {
    const layer = ambientLayersRef.current.get(id);
    if (layer) {
      layer.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Set master volume
  const setMasterVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Pause all audio (suspend context)
  const pauseAll = useCallback(() => {
    if (contextRef.current && contextRef.current.state === "running") {
      contextRef.current.suspend();
    }
  }, []);

  // Resume all audio
  const resumeAll = useCallback(() => {
    if (contextRef.current && contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }
  }, []);

  // Fade out all sounds
  const fadeOutAll = useCallback((durationMs: number = 2000) => {
    const ctx = contextRef.current;
    if (!ctx || !masterGainRef.current) return;

    const durationSec = durationMs / 1000;
    masterGainRef.current.gain.linearRampToValueAtTime(
      0,
      ctx.currentTime + durationSec,
    );

    // Stop all sources after fade
    setTimeout(() => {
      ambientLayersRef.current.forEach((layer) => {
        layer.source?.stop();
      });
      ambientLayersRef.current.clear();
      // Stop music too
      if (musicLayerRef.current?.source) {
        musicLayerRef.current.source.stop();
        musicLayerRef.current = null;
      }
      // Reset master volume
      if (masterGainRef.current) {
        masterGainRef.current.gain.value = 1;
      }
    }, durationMs);
  }, []);

  // Check if ambient is playing
  const isAmbientPlaying = useCallback((id: string) => {
    return ambientLayersRef.current.get(id)?.isPlaying ?? false;
  }, []);

  // Play background music (looping)
  const playMusic = useCallback(
    async (url: string, volume: number = 0.5) => {
      const ctx = getContext();
      if (!ctx || !masterGainRef.current) return;

      // Stop existing music if playing
      if (musicLayerRef.current?.source) {
        musicLayerRef.current.source.stop();
      }

      const buffer = await loadBuffer(url);
      if (!buffer) return;

      const gainNode = ctx.createGain();
      gainNode.connect(masterGainRef.current);
      gainNode.gain.value = 0;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();

      // Fade in
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

      musicLayerRef.current = {
        source,
        gainNode,
        buffer,
        isPlaying: true,
      };
    },
    [getContext, loadBuffer],
  );

  // Stop music with fade out
  const stopMusic = useCallback(() => {
    const layer = musicLayerRef.current;
    if (!layer?.source) return;

    const ctx = contextRef.current;
    if (ctx) {
      layer.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        layer.source?.stop();
        musicLayerRef.current = null;
      }, 500);
    }
  }, []);

  // Set music volume
  const setMusicVolume = useCallback((volume: number) => {
    if (musicLayerRef.current) {
      musicLayerRef.current.gainNode.gain.value = Math.max(
        0,
        Math.min(1, volume),
      );
    }
  }, []);

  // Check if music is playing
  const isMusicPlaying = useCallback(() => {
    return musicLayerRef.current?.isPlaying ?? false;
  }, []);

  // Unlock AudioContext on first user gesture (Mobile Safari autoplay policy)
  useEffect(() => {
    const handleInteraction = () => {
      getContext();
    };
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });
    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, [getContext]);

  // Cleanup on unmount
  useEffect(() => {
    const ambientLayers = ambientLayersRef.current;
    return () => {
      ambientLayers.forEach((layer) => {
        layer.source?.stop();
      });
      musicLayerRef.current?.source?.stop();
      contextRef.current?.close();
    };
  }, []);

  return {
    playBell,
    addAmbient,
    removeAmbient,
    setAmbientVolume,
    setMasterVolume,
    pauseAll,
    resumeAll,
    fadeOutAll,
    isAmbientPlaying,
    // Music layer
    playMusic,
    stopMusic,
    setMusicVolume,
    isMusicPlaying,
    // Audio context state
    audioError,
    isAudioReady,
    initializeAudio,
  };
}
