import { useEffect, useRef } from "react";
import { useTimerStore } from "../stores/timerStore";

export function useTimer() {
  const { status, tick, tickCountdown } = useTimerStore();
  const intervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // Handle countdown timer
  useEffect(() => {
    if (status === "countdown") {
      countdownRef.current = window.setInterval(tickCountdown, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [status, tickCountdown]);

  // Handle main timer
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
