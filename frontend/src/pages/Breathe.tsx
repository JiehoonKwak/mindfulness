import { BreathingGuide } from "../components/BreathingGuide";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Breathe() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="py-4">
        <Link to="/" className="text-[var(--color-text-muted)]">
          &larr; {t("app.title")}
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <BreathingGuide variant="flower" showControls={true} />
      </main>
    </div>
  );
}
