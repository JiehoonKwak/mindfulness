import { useBreathingStore } from "../../stores/breathingStore";

/**
 * Calculate breath progress (0-1) for the current phase.
 * Extracted as shared hook since all breathing visuals need this.
 */
export function useBreathProgress(): number {
  const { phase, phaseTime, pattern, isActive } = useBreathingStore();

  if (!isActive) return 0;

  const duration = pattern[phase] || 1;
  return 1 - phaseTime / duration;
}
