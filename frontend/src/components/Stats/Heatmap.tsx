import { useMemo } from "react";
import type { HeatmapEntry } from "../../api/stats";

interface HeatmapProps {
  data: HeatmapEntry[];
  loading: boolean;
}

const DAYS_PER_WEEK = 7;
const WEEKS_TO_SHOW = 52;

function getIntensity(minutes: number): number {
  if (minutes === 0) return 0;
  if (minutes < 5) return 1;
  if (minutes < 15) return 2;
  if (minutes < 30) return 3;
  return 4;
}

export default function Heatmap({ data, loading }: HeatmapProps) {
  const grid = useMemo(() => {
    const dataMap = new Map(data.map((d) => [d.date, d]));
    const today = new Date();
    const cells: { date: string; intensity: number; minutes: number }[] = [];

    // Start from 52 weeks ago, aligned to week start
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - WEEKS_TO_SHOW * DAYS_PER_WEEK);
    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < WEEKS_TO_SHOW * DAYS_PER_WEEK; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const entry = dataMap.get(dateStr);
      cells.push({
        date: dateStr,
        intensity: entry ? getIntensity(entry.minutes) : 0,
        minutes: entry?.minutes ?? 0,
      });
    }

    return cells;
  }, [data]);

  // Split into weeks for column layout
  const weeks = useMemo(() => {
    const result: (typeof grid)[] = [];
    for (let i = 0; i < grid.length; i += DAYS_PER_WEEK) {
      result.push(grid.slice(i, i + DAYS_PER_WEEK));
    }
    return result;
  }, [grid]);

  const intensityColors = [
    "bg-[var(--color-border)]/20",
    "bg-[var(--color-primary)]/25",
    "bg-[var(--color-primary)]/50",
    "bg-[var(--color-primary)]/75",
    "bg-[var(--color-primary)]",
  ];

  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center text-[var(--color-text-muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.date}
                className={`w-3 h-3 rounded-sm ${intensityColors[cell.intensity]} transition-colors`}
                title={`${cell.date}: ${cell.minutes} min`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
