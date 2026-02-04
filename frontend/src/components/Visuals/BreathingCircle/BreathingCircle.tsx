import { motion } from "framer-motion";
import type { VisualProps } from "../types";

export default function BreathingCircle({ isActive, speed = 1 }: VisualProps) {
  const duration = 8 / speed; // 8 seconds base cycle

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="w-48 h-48 rounded-full bg-primary/30 blur-xl"
        animate={
          isActive
            ? {
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }
            : {}
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-primary/50"
        animate={
          isActive
            ? {
                scale: [1, 1.4, 1],
              }
            : {}
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-primary"
        animate={
          isActive
            ? {
                scale: [1, 1.3, 1],
              }
            : {}
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
