import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { listSessions, type Session } from "../api/sessions";
import { listTags, type Tag } from "../api/tags";
import { useSettingsStore } from "../stores/settingsStore";

export default function History() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, tagsData] = await Promise.all([
          listSessions(50, 0, selectedTag ?? undefined),
          listTags(),
        ]);
        setSessions(sessionsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTag]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const moodEmojis: Record<string, string> = {
    calm: "😌",
    happy: "😊",
    peaceful: "🙂",
    neutral: "😐",
    tired: "😔",
  };

  return (
    <div className="min-h-screen p-4">
      <header className="py-4">
        <Link to="/" className="text-[var(--color-text-muted)]">
          &larr; {t("app.title")}
        </Link>
      </header>

      <main className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-light tracking-wide">
          {t("history.title")}
        </h1>

        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`
                px-3 py-1.5 rounded-full text-sm transition-colors
                ${
                  selectedTag === null
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)]/40 text-[var(--color-text-muted)]"
                }
              `}
            >
              {t("history.all")}
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`
                  px-3 py-1.5 rounded-full text-sm transition-colors
                  ${
                    selectedTag === tag.id
                      ? "text-white"
                      : "bg-[var(--color-surface)]/40 text-[var(--color-text-muted)]"
                  }
                `}
                style={{
                  backgroundColor:
                    selectedTag === tag.id ? tag.color : undefined,
                }}
              >
                {language === "ko" ? tag.name_ko : tag.name_en}
              </button>
            ))}
          </div>
        )}

        {/* Session list */}
        {loading ? (
          <div className="text-center text-[var(--color-text-muted)] py-8">
            Loading...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-[var(--color-text-muted)] py-8">
            {t("history.noSessions")}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="
                  p-4 rounded-2xl backdrop-blur-xl
                  bg-[var(--color-surface)]/40
                  border border-[var(--color-border)]/30
                "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {formatDate(session.started_at)}
                    </div>
                    <div className="text-lg font-light mt-1">
                      {formatDuration(
                        session.actual_duration_seconds ??
                          session.planned_duration_seconds,
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.mood_after && (
                      <span className="text-xl" title={session.mood_after}>
                        {moodEmojis[session.mood_after] || ""}
                      </span>
                    )}
                    {session.completed ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-[var(--color-text-muted)] text-sm">
                        {t("history.incomplete")}
                      </span>
                    )}
                  </div>
                </div>
                {session.note && (
                  <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-2">
                    {session.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
