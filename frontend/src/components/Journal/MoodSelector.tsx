interface MoodSelectorProps {
  value: string | null;
  onChange: (mood: string) => void;
}

const MOODS = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "peaceful", emoji: "🙂", label: "Peaceful" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "tired", emoji: "😔", label: "Tired" },
];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex justify-center gap-3">
      {MOODS.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onChange(mood.id)}
          className={`
            text-3xl p-2 rounded-xl transition-all duration-200
            ${
              value === mood.id
                ? "bg-[var(--color-primary)]/30 scale-110"
                : "hover:bg-[var(--color-surface)]/50"
            }
          `}
          title={mood.label}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
}
