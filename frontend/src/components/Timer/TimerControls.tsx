import { useTimer } from "../../hooks/useTimer";
import { useTranslation } from "react-i18next";

export default function TimerControls() {
  const { t } = useTranslation();
  const { status, start, pause, resume, stop } = useTimer();

  return (
    <div className="flex gap-4 mt-8">
      {status === "idle" && (
        <button
          onClick={start}
          className="bg-primary text-white px-8 py-3 rounded-full text-lg"
        >
          {t("timer.start")}
        </button>
      )}

      {status === "running" && (
        <>
          <button
            onClick={pause}
            className="bg-surface border border-primary px-6 py-3 rounded-full"
          >
            {t("timer.pause")}
          </button>
          <button
            onClick={stop}
            className="bg-surface border border-red-500 text-red-500 px-6 py-3 rounded-full"
          >
            {t("timer.stop")}
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            onClick={resume}
            className="bg-primary text-white px-6 py-3 rounded-full"
          >
            {t("timer.resume")}
          </button>
          <button
            onClick={stop}
            className="bg-surface border border-red-500 text-red-500 px-6 py-3 rounded-full"
          >
            {t("timer.stop")}
          </button>
        </>
      )}

      {status === "complete" && (
        <div className="text-2xl text-primary">{t("timer.complete")}</div>
      )}
    </div>
  );
}
