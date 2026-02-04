import { useRef, useState, useCallback } from "react";
import { useTimerStore } from "../../stores/timerStore";

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 120;
const TICK_OUTER = RADIUS + 8;
const TICK_INNER_MAJOR = RADIUS - 8;
const TICK_INNER_MINOR = RADIUS - 4;

export default function ClockDial() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { duration, setDuration } = useTimerStore();
  const [isDragging, setIsDragging] = useState(false);
  const currentMinutes = Math.round(duration / 60);

  const angleToMinutes = useCallback((angle: number): number => {
    // Convert angle (0 at top, clockwise) to minutes (1-60)
    const normalized = ((angle + 360) % 360) / 360;
    const mins = Math.round(normalized * 60);
    return mins === 0 ? 60 : Math.max(1, mins);
  }, []);

  const minutesToAngle = useCallback((mins: number): number => {
    return (mins / 60) * 360;
  }, []);

  const getAngleFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent): number => {
      if (!svgRef.current) return 0;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - CENTER;
      const y = clientY - rect.top - CENTER;
      let angle = Math.atan2(x, -y) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      return angle;
    },
    [],
  );

  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const angle = getAngleFromEvent(e);
      const mins = angleToMinutes(angle);
      setDuration(mins);
    },
    [getAngleFromEvent, angleToMinutes, setDuration],
  );

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    handleInteraction(e);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Generate tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const inner = isMajor ? TICK_INNER_MAJOR : TICK_INNER_MINOR;
    return {
      x1: CENTER + Math.cos(rad) * inner,
      y1: CENTER + Math.sin(rad) * inner,
      x2: CENTER + Math.cos(rad) * TICK_OUTER,
      y2: CENTER + Math.sin(rad) * TICK_OUTER,
      isMajor,
    };
  });

  // Handle position
  const handleAngle = minutesToAngle(currentMinutes) - 90;
  const handleRad = (handleAngle * Math.PI) / 180;
  const handleX = CENTER + Math.cos(handleRad) * RADIUS;
  const handleY = CENTER + Math.sin(handleRad) * RADIUS;

  // Arc for selected duration
  const arcAngle = minutesToAngle(currentMinutes);
  const largeArc = arcAngle > 180 ? 1 : 0;
  const endRad = ((arcAngle - 90) * Math.PI) / 180;
  const arcEndX = CENTER + Math.cos(endRad) * RADIUS;
  const arcEndY = CENTER + Math.sin(endRad) * RADIUS;
  const arcPath = `
    M ${CENTER} ${CENTER - RADIUS}
    A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}
  `;

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        className="touch-none select-none cursor-pointer"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Background circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Selected duration arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="var(--color-text)"
            strokeWidth={tick.isMajor ? 2 : 1}
            opacity={tick.isMajor ? 0.6 : 0.2}
          />
        ))}

        {/* Center display */}
        <text
          x={CENTER}
          y={CENTER - 10}
          textAnchor="middle"
          fill="var(--color-text)"
          fontSize="48"
          fontWeight="200"
          fontFamily="system-ui"
        >
          {currentMinutes}
        </text>
        <text
          x={CENTER}
          y={CENTER + 20}
          textAnchor="middle"
          fill="var(--color-text-muted)"
          fontSize="12"
          letterSpacing="0.2em"
          style={{ textTransform: "uppercase" }}
        >
          MIN
        </text>

        {/* Handle */}
        <circle
          cx={handleX}
          cy={handleY}
          r={isDragging ? 14 : 12}
          fill="var(--color-primary)"
          className="transition-all duration-150"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
        <circle cx={handleX} cy={handleY} r={4} fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}
