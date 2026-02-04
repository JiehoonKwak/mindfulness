import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-4">
      <header className="py-4">
        <Link to="/" className="text-[var(--color-text-muted)]">
          &larr; {t("app.title")}
        </Link>
      </header>
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>
        <p className="text-[var(--color-text-muted)]">
          Theme and language settings coming soon...
        </p>
      </main>
    </div>
  );
}
