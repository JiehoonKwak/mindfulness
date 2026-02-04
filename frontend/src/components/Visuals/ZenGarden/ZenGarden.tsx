import { motion } from "framer-motion";
import type { VisualProps } from "../types";

export default function ZenGarden({ isActive, speed = 1 }: VisualProps) {
  const ripples = 12;
  const duration = 20 / speed;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-2xl">
        {/* Sand background */}
        <rect
          x="0"
          y="0"
          width="400"
          height="400"
          fill="var(--color-surface)"
        />

        {/* Ripple lines */}
        {Array.from({ length: ripples }).map((_, i) => {
          const yOffset = 30 + i * 28;
          const amplitude = 10 + Math.sin(i * 0.5) * 5;

          return (
            <motion.path
              key={i}
              d={`M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`}
              stroke="var(--color-text-muted)"
              strokeWidth="1"
              fill="none"
              opacity={0.3}
              animate={
                isActive
                  ? {
                      d: [
                        `M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                        `M 0 ${yOffset} Q 100 ${yOffset + amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                        `M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                      ],
                    }
                  : {}
              }
              transition={{
                duration: duration + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Stones */}
        <ellipse
          cx="320"
          cy="280"
          rx="25"
          ry="15"
          fill="var(--color-text-muted)"
          opacity="0.5"
        />
        <ellipse
          cx="80"
          cy="150"
          rx="20"
          ry="12"
          fill="var(--color-text-muted)"
          opacity="0.4"
        />
        <ellipse
          cx="250"
          cy="100"
          rx="15"
          ry="10"
          fill="var(--color-text-muted)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
