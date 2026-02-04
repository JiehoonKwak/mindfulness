import { useEffect, useRef, useMemo } from "react";
import { useTimerStore } from "../stores/timerStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useAudio } from "../hooks/useAudio";

export default function BellPlayer(): null {
  const status = useTimerStore((state) => state.status);
  const bellEnabled = useSettingsStore((state) => state.bellEnabled);
  const bellSound = useSettingsStore((state) => state.bellSound);
  const prevStatusRef = useRef(status);

  const bellUrl = useMemo(() => `/sounds/bells/${bellSound}.mp3`, [bellSound]);

  const startBell = useAudio(bellUrl, { volume: 0.7 });
  const endBell = useAudio(bellUrl, { volume: 0.8 });

  useEffect(() => {
    if (!bellEnabled) return;

    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    // Play start bell when transitioning from idle to running
    if (prevStatus === "idle" && status === "running") {
      void startBell.play();
    }

    // Play end bell when transitioning to complete
    if (prevStatus === "running" && status === "complete") {
      void endBell.play();
    }
  }, [status, bellEnabled, startBell, endBell]);

  // This component doesn't render anything
  return null;
}
