import { useRef, useCallback, useEffect } from "react";

interface AudioLayer {
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  buffer: AudioBuffer | null;
  isPlaying: boolean;
}

interface UseAudioLayersReturn {
  playBell: (url: string) => Promise<void>;
  addAmbient: (id: string, url: string) => Promise<void>;
  removeAmbient: (id: string) => void;
  setAmbientVolume: (id: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  pauseAll: () => void;
  resumeAll: () => void;
  fadeOutAll: (durationMs?: number) => void;
  isAmbientPlaying: (id: string) => boolean;
}

export function useAudioLayers(): UseAudioLayersReturn {
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientLayersRef = useRef<Map<string, AudioLayer>>(new Map());
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Initialize audio context on first use
  const getContext = useCallback(() => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
      masterGainRef.current = contextRef.current.createGain();
      masterGainRef.current.connect(contextRef.current.destination);
    }
    // Resume if suspended (browser autoplay policy)
    if (contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  // Load and cache audio buffer
  const loadBuffer = useCallback(
    async (url: string): Promise<AudioBuffer> => {
      const cached = bufferCacheRef.current.get(url);
      if (cached) return cached;

      const ctx = getContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      bufferCacheRef.current.set(url, audioBuffer);
      return audioBuffer;
    },
    [getContext],
  );

  // Play one-shot bell sound
  const playBell = useCallback(
    async (url: string) => {
      const ctx = getContext();
      const buffer = await loadBuffer(url);

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      gainNode.gain.value = 0.7;

      source.start();
    },
    [getContext, loadBuffer],
  );

  // Add looping ambient layer
  const addAmbient = useCallback(
    async (id: string, url: string) => {
      const ctx = getContext();

      // Stop existing layer if present
      const existing = ambientLayersRef.current.get(id);
      if (existing?.source) {
        existing.source.stop();
      }

      const buffer = await loadBuffer(url);
      const gainNode = ctx.createGain();
      gainNode.connect(masterGainRef.current!);
      gainNode.gain.value = 0;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();

      // Fade in
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientLayersRef.current.forEach((layer) => {
        layer.source?.stop();
      });
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
  };
}
