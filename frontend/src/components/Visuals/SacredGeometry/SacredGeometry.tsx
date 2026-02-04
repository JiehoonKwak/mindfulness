import { motion } from "framer-motion";
import type { VisualProps } from "../types";

export default function SacredGeometry({ isActive, speed = 1 }: VisualProps) {
  const duration = 30 / speed;

  // Flower of Life: 7 overlapping circles
  const circles = [
    { cx: 0, cy: 0 },
    { cx: 25, cy: 0 },
    { cx: -25, cy: 0 },
    { cx: 12.5, cy: 21.65 },
    { cx: -12.5, cy: 21.65 },
    { cx: 12.5, cy: -21.65 },
    { cx: -12.5, cy: -21.65 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        viewBox="-80 -80 160 160"
        className="w-3/4 h-3/4 max-w-lg"
        animate={isActive ? { rotate: 360 } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Outer rings */}
        {[1, 2, 3].map((ring) => (
          <motion.circle
            key={`ring-${ring}`}
            cx={0}
            cy={0}
            r={25 * ring}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            opacity={0.2}
            animate={
              isActive
                ? {
                    opacity: [0.2, 0.4, 0.2],
                  }
                : {}
            }
            transition={{
              duration: duration / 3,
              repeat: Infinity,
              delay: ring * 0.5,
            }}
          />
        ))}

        {/* Flower of Life circles */}
        {circles.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={25}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1"
            opacity={0.5}
            animate={
              isActive
                ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }
                : {}
            }
            transition={{
              duration: duration / 6,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Center point */}
        <circle cx={0} cy={0} r={3} fill="var(--color-primary)" />
      </motion.svg>
    </div>
  );
}
