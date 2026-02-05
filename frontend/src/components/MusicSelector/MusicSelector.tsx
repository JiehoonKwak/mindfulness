import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "../Icons";
import { useSettingsStore } from "../../stores/settingsStore";

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
  const { defaultMusic, setDefaultMusic, musicVolume, setMusicVolume } = useSettingsStore();
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

  const selectAsDefault = (track: Track) => {
    if (defaultMusic?.id === track.id) {
      // Deselect if already selected
      setDefaultMusic(null);
    } else {
      setDefaultMusic({
        id: track.id,
        filename: track.filename,
        prompt: track.prompt,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
        {t("sounds.music")}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)]">
        {t("sounds.musicDescription")}
      </p>

      {/* Music Volume Slider */}
      {library.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("sounds.musicVolume")}</span>
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>
      )}

      {/* Library - Select default music for meditation */}
      {library.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            {t("sounds.selectDefault")}
          </h4>

          {/* None option */}
          <button
            onClick={() => setDefaultMusic(null)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              bg-[var(--color-surface)] border transition-colors text-left
              ${!defaultMusic
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)]"}
            `}
          >
            <span className={`
              w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${!defaultMusic ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"}
            `}>
              {!defaultMusic && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              )}
            </span>
            <span className="text-sm">{t("sounds.none")}</span>
          </button>

          {library.map((track) => {
            const isSelected = defaultMusic?.id === track.id;
            return (
              <div
                key={track.id}
                className={`
                  flex items-center gap-3 p-3 rounded-xl
                  bg-[var(--color-surface)] border transition-colors
                  ${isSelected
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"}
                `}
              >
                {/* Radio button for selection */}
                <button
                  onClick={() => selectAsDefault(track)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"}
                  `}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </button>

                <Icons.music className="w-5 h-5 flex-shrink-0 text-[var(--color-text-muted)]" />
                <span
                  className={`flex-1 text-sm truncate cursor-pointer ${isSelected ? "text-[var(--color-primary)]" : ""}`}
                  onClick={() => selectAsDefault(track)}
                >
                  {track.prompt}
                </span>

                {/* Play/Preview button */}
                <button
                  onClick={() => playTrack(track)}
                  className="p-2 hover:bg-[var(--color-border)]/20 rounded-lg transition-colors"
                  title={playing === track.id ? t("sounds.pause") : t("sounds.preview")}
                >
                  {playing === track.id ? (
                    <Icons.pause className="w-4 h-4" />
                  ) : (
                    <Icons.play className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Presets for generating */}
      {presets.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            {t("sounds.generateNew")}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => generateMusic(p.prompt)}
                disabled={generating}
                className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left transition-colors hover:border-[var(--color-primary)] disabled:opacity-50"
              >
                <div className="text-sm">{p.label}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">
                  {generating ? t("sounds.generating") : t("sounds.generate")}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {library.length === 0 && presets.length > 0 && (
        <p className="text-xs text-[var(--color-text-muted)] text-center py-4">
          {t("sounds.generateHint")}
        </p>
      )}

      {presets.length === 0 && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">
            {t("sounds.apiKeyRequired")}
          </p>
        </div>
      )}
    </div>
  );
}
