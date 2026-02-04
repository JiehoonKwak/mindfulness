import { useEffect, useRef } from "react";
import { useBreathingStore } from "../stores/breathingStore";

export function useBreathingTimer() {
  const { isActive, tick } = useBreathingStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
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
  }, [isActive, tick]);

  return useBreathingStore();
}
