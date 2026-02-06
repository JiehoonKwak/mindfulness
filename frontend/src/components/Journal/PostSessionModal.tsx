import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import MoodSelector from "./MoodSelector";
import NotesInput from "./NotesInput";
import { getStreak } from "../../api/stats";
import { useTimerStore } from "../../stores/timerStore";

interface PostSessionModalProps {
  isOpen: boolean;
  onSave: (mood: string | null, note: string) => void;
  onSkip: () => void;
}

export default function PostSessionModal({
  isOpen,
  onSave,
  onSkip,
}: PostSessionModalProps) {
  const { t } = useTranslation();
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [streak, setStreak] = useState<number>(0);
  const duration = useTimerStore((state) => state.duration);

  // Fetch streak when modal opens
  useEffect(() => {
    if (isOpen) {
      getStreak().then((data) => {
        setStreak(data.current);
      }).catch(() => {
        setStreak(0);
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(mood, note);
    setMood(null);
    setNote("");
  };

  const handleSkip = () => {
    onSkip();
    setMood(null);
    setNote("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="
              w-full max-w-md p-6 rounded-3xl
              bg-[var(--color-surface)]/90 backdrop-blur-xl
              border border-[var(--color-border)]/30
              space-y-6
            "
          >
            {/* Celebration Header */}
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-4xl"
              >
                ✨
              </motion.div>
              <h2 className="text-xl font-light text-[var(--color-primary)]">
                {t("timer.wellDone")}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {Math.floor(duration / 60)} {t("timer.minutes")} {t("timer.sessionComplete").toLowerCase()}
              </p>
              {streak > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-sm"
                >
                  <span className="text-orange-500">🔥</span>
                  <span className="text-[var(--color-text-muted)]">
                    {streak} {t("goals.dayStreak")}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="border-t border-[var(--color-border)]/30 pt-4 space-y-2">
              <p className="text-sm text-[var(--color-text-muted)] text-center">
                {t("journal.howDoYouFeel")}
              </p>
              <MoodSelector value={mood} onChange={setMood} />
            </div>

            <NotesInput value={note} onChange={setNote} />

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="
                  flex-1 py-3 rounded-xl
                  text-[var(--color-text-muted)]
                  hover:bg-[var(--color-surface)]/50
                  transition-colors
                "
              >
                {t("journal.skip")}
              </button>
              <button
                onClick={handleSave}
                className="
                  flex-1 py-3 rounded-xl
                  bg-[var(--color-primary)]
                  text-white font-medium
                  hover:opacity-90 transition-opacity
                "
              >
                {t("journal.save")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
