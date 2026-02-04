import { motion } from "framer-motion";
import type { VisualProps } from "../types";

export default function Mandala({ isActive, speed = 1 }: VisualProps) {
  const layers = 6;
  const petalsPerLayer = [6, 8, 12, 16, 20, 24];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="-100 -100 200 200" className="w-3/4 h-3/4 max-w-lg">
        {Array.from({ length: layers }).map((_, layerIndex) => {
          const radius = 15 + layerIndex * 12;
          const petals = petalsPerLayer[layerIndex];

          return (
            <motion.g
              key={layerIndex}
              animate={isActive ? { rotate: 360 } : {}}
              transition={{
                duration: (30 + layerIndex * 10) / speed,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "center" }}
            >
              {Array.from({ length: petals }).map((_, petalIndex) => {
                const angle = (360 / petals) * petalIndex;
                return (
                  <ellipse
                    key={petalIndex}
                    cx={0}
                    cy={-radius}
                    rx={8 - layerIndex * 0.5}
                    ry={15 - layerIndex}
                    fill="var(--color-primary)"
                    opacity={0.3 + layerIndex * 0.1}
                    transform={`rotate(${angle})`}
                  />
                );
              })}
            </motion.g>
          );
        })}

        {/* Center dot */}
        <circle cx={0} cy={0} r={5} fill="var(--color-primary)" />
      </svg>
    </div>
  );
}
