import { useEffect, useRef } from "react";
import { useTimerStore } from "../stores/timerStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useAudio } from "../hooks/useAudio";

// Bell sounds from public/sounds/ directory
const startBellUrl = "/sounds/start-bell.mp3";
const endBellUrl = "/sounds/end-bell.mp3";

export default function BellPlayer(): null {
  const status = useTimerStore((state) => state.status);
  const bellEnabled = useSettingsStore((state) => state.bellEnabled);
  const prevStatusRef = useRef(status);

  const startBell = useAudio(startBellUrl, { volume: 0.7 });
  const endBell = useAudio(endBellUrl, { volume: 0.8 });

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
