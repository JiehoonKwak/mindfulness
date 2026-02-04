import { useTranslation } from "react-i18next";

interface NotesInputProps {
  value: string;
  onChange: (note: string) => void;
}

export default function NotesInput({ value, onChange }: NotesInputProps) {
  const { t } = useTranslation();

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("journal.notePlaceholder")}
      className="
        w-full h-24 p-4 rounded-xl
        bg-[var(--color-surface)]/40
        border border-[var(--color-border)]/30
        text-[var(--color-text)]
        placeholder:text-[var(--color-text-muted)]
        resize-none focus:outline-none
        focus:border-[var(--color-primary)]
        transition-colors
      "
    />
  );
}
