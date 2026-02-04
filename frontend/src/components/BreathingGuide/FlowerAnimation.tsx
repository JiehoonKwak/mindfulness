import { useBreathingStore } from "../../stores/breathingStore";
import "./FlowerAnimation.css";

export default function FlowerAnimation() {
  const { pattern, phase, isActive } = useBreathingStore();

  const petalCount = 6;
  const petals = Array.from({ length: petalCount });

  return (
    <div className="flower-container">
      <div
        className={`flower ${isActive ? "active" : ""} ${phase}`}
        style={
          {
            "--inhale-duration": `${pattern.inhale}s`,
            "--hold-in-duration": `${pattern.holdIn}s`,
            "--exhale-duration": `${pattern.exhale}s`,
            "--hold-out-duration": `${pattern.holdOut}s`,
          } as React.CSSProperties
        }
      >
        {petals.map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{ transform: `rotate(${(360 / petalCount) * i}deg)` }}
          >
            <div className="petal-circle" />
          </div>
        ))}
      </div>
    </div>
  );
}
