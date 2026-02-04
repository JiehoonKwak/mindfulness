import { useEffect, useRef } from "react";
import { useTimerStore } from "../stores/timerStore";

export function useTimer() {
  const { status, tick } = useTimerStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  return useTimerStore();
}
