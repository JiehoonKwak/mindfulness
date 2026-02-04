import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "../Icons";

import { API_BASE } from "../../api/config";

interface Preset {
  id: string;
  label: string;
  prompt: string;
}

interface Track {
  id: number;
  prompt: string;
  filename: string;
  status: string;
}

export default function MusicSelector() {
  const { t } = useTranslation();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [library, setLibrary] = useState<Track[]>([]);
  const [generating, setGenerating] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [audio] = useState(() => new Audio());

  useEffect(() => {
    fetchPresets();
    fetchLibrary();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/music/presets`);
      if (res.ok) {
        setPresets(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    }
  };

  const fetchLibrary = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/music/library`);
      if (res.ok) {
        setLibrary(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch library:", error);
    }
  };

  const generateMusic = async (prompt: string) => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/music/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration_seconds: 120 }),
      });
      if (res.ok) {
        await fetchLibrary();
      }
    } catch (error) {
      console.error("Failed to generate music:", error);
    } finally {
      setGenerating(false);
    }
  };

  const playTrack = (track: Track) => {
    if (playing === track.id) {
      audio.pause();
      setPlaying(null);
    } else {
      audio.src = `${API_BASE}/sounds/music/generated/${track.filename}`;
      audio.play();
      setPlaying(track.id);
      audio.onended = () => setPlaying(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-title">{t("sounds.music") || "Background Music"}</h3>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => generateMusic(p.prompt)}
            disabled={generating}
            className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left transition-colors hover:border-[var(--color-primary)] disabled:opacity-50"
          >
            <div className="text-sm">{p.label}</div>
            <div className="text-caption text-xs mt-1">
              {generating ? "Generating..." : "Generate"}
            </div>
          </button>
        ))}
      </div>

      {/* Library */}
      {library.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-caption">Your Music</h4>
          {library.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <Icons.music className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-sm truncate">{track.prompt}</span>
              <button onClick={() => playTrack(track)} className="p-2">
                {playing === track.id ? (
                  <Icons.pause className="w-4 h-4" />
                ) : (
                  <Icons.play className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {library.length === 0 && presets.length > 0 && (
        <p className="text-caption text-center py-4">
          Generate music using the presets above
        </p>
      )}

      {presets.length === 0 && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">
            AI music generation requires GEMINI_API_KEY environment variable.
            Set it in backend/.env to enable this feature.
          </p>
        </div>
      )}
    </div>
  );
}
