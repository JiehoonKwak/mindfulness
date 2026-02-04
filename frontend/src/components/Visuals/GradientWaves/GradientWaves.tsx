import type { VisualProps } from "../types";
import "./GradientWaves.css";

export default function GradientWaves({ isActive, speed = 1 }: VisualProps) {
  const animationDuration = `${20 / speed}s`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`gradient-wave wave-1 ${isActive ? "animate" : ""}`}
        style={{ animationDuration }}
      />
      <div
        className={`gradient-wave wave-2 ${isActive ? "animate" : ""}`}
        style={{ animationDuration }}
      />
      <div
        className={`gradient-wave wave-3 ${isActive ? "animate" : ""}`}
        style={{ animationDuration }}
      />
    </div>
  );
}
