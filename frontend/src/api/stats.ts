import { API_BASE } from "./config";

export interface StatsSummary {
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  longest_streak: number;
}

export interface HeatmapEntry {
  date: string;
  minutes: number;
  sessions: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
}

export async function getStatsSummary(): Promise<StatsSummary> {
  const res = await fetch(`${API_BASE}/api/stats/summary`);
  if (!res.ok) {
    throw new Error(`Failed to get stats summary: ${res.statusText}`);
  }
  return res.json();
}

export async function getHeatmap(days: number = 365): Promise<HeatmapEntry[]> {
  const res = await fetch(`${API_BASE}/api/stats/heatmap?days=${days}`);
  if (!res.ok) {
    throw new Error(`Failed to get heatmap: ${res.statusText}`);
  }
  return res.json();
}

export async function getStreak(): Promise<StreakInfo> {
  const res = await fetch(`${API_BASE}/api/stats/streak`);
  if (!res.ok) {
    throw new Error(`Failed to get streak: ${res.statusText}`);
  }
  return res.json();
}
