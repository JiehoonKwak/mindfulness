import { motion } from "framer-motion";
import { useBreathingStore } from "../../stores/breathingStore";

export default function CircleAnimation() {
  const { pattern, phase, phaseTime, isActive } = useBreathingStore();

  const getScale = (): number => {
    if (!isActive) return 0.5;
    switch (phase) {
      case "inhale":
        return 0.5 + (1 - phaseTime / pattern.inhale) * 0.5;
      case "holdIn":
        return 1;
      case "exhale":
        return 1 - (1 - phaseTime / pattern.exhale) * 0.5;
      case "holdOut":
        return 0.5;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <motion.div
        className="w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center"
        animate={{ scale: getScale() }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-primary/30"
          animate={{ scale: getScale() }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
