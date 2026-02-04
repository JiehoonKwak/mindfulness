const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Goal {
  id: number;
  goal_type: string;
  target_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface GoalCreate {
  goal_type: string;
  target_value: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface GoalUpdate {
  target_value?: number;
  end_date?: string;
  is_active?: boolean;
}

export interface GoalProgress {
  goal_id: number;
  goal_type: string;
  target_value: number;
  current_value: number;
  progress_percent: number;
}

export async function listGoals(activeOnly: boolean = true): Promise<Goal[]> {
  const res = await fetch(`${API_BASE}/api/goals/?active_only=${activeOnly}`);
  if (!res.ok) {
    throw new Error(`Failed to list goals: ${res.statusText}`);
  }
  return res.json();
}

export async function createGoal(goal: GoalCreate): Promise<Goal> {
  const res = await fetch(`${API_BASE}/api/goals/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  if (!res.ok) {
    throw new Error(`Failed to create goal: ${res.statusText}`);
  }
  return res.json();
}

export async function updateGoal(id: number, goal: GoalUpdate): Promise<Goal> {
  const res = await fetch(`${API_BASE}/api/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  if (!res.ok) {
    throw new Error(`Failed to update goal: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteGoal(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/goals/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete goal: ${res.statusText}`);
  }
  return res.json();
}

export async function getGoalsProgress(): Promise<GoalProgress[]> {
  const res = await fetch(`${API_BASE}/api/goals/progress/all`);
  if (!res.ok) {
    throw new Error(`Failed to get goals progress: ${res.statusText}`);
  }
  return res.json();
}
