import { useTranslation } from "react-i18next";

interface MoodSelectorProps {
  value: string | null;
  onChange: (mood: string) => void;
}

const MOOD_IDS = ["calm", "happy", "peaceful", "neutral", "tired"] as const;

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center gap-2">
      {MOOD_IDS.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            px-3 py-2 rounded-xl text-sm transition-all duration-200
            ${
              value === id
                ? "bg-[var(--color-primary)] text-[var(--color-bg)] scale-105"
                : "bg-[var(--color-surface)]/50 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
            }
          `}
        >
          {t(`mood.${id}`)}
        </button>
      ))}
    </div>
  );
}
