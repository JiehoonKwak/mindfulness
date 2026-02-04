import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-2">{t("app.title")}</h1>
      <p className="text-[var(--color-text-muted)] mb-8">{t("app.tagline")}</p>
      <div className="flex flex-col gap-4">
        <Link
          to="/meditate"
          className="bg-primary px-8 py-4 rounded-full text-lg text-center"
        >
          {t("home.startMeditation")}
        </Link>
        <Link
          to="/breathe"
          className="bg-surface border border-primary px-8 py-4 rounded-full text-lg text-center"
        >
          {t("breathing.title") || "Breathing Guide"}
        </Link>
        <Link
          to="/settings"
          className="text-[var(--color-text-muted)] text-center mt-4"
        >
          {t("home.settings")}
        </Link>
      </div>
    </div>
  );
}
