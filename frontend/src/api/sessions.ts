const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8141";

export interface SessionCreate {
  planned_duration_seconds: number;
  visual_type?: string;
  bell_sound?: string;
}

export interface SessionUpdate {
  ended_at?: string;
  actual_duration_seconds?: number;
  completed?: boolean;
  mood_before?: string;
  mood_after?: string;
  note?: string;
}

export interface Session {
  id: number;
  started_at: string;
  ended_at?: string;
  planned_duration_seconds: number;
  actual_duration_seconds?: number;
  completed: boolean;
  visual_type?: string;
  bell_sound?: string;
  mood_before?: string;
  mood_after?: string;
  note?: string;
}

export async function createSession(data: SessionCreate): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/sessions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create session: ${res.statusText}`);
  }
  return res.json();
}

export async function updateSession(
  id: number,
  data: SessionUpdate,
): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update session: ${res.statusText}`);
  }
  return res.json();
}

export async function getSession(id: number): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/sessions/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to get session: ${res.statusText}`);
  }
  return res.json();
}

export async function listSessions(
  limit: number = 50,
  offset: number = 0,
  tagId?: number,
  fromDate?: string,
  toDate?: string,
  completedOnly: boolean = false,
): Promise<Session[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  if (tagId) params.set("tag_id", tagId.toString());
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  if (completedOnly) params.set("completed_only", "true");

  const res = await fetch(`${API_BASE}/api/sessions/?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to list sessions: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteSession(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/sessions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete session: ${res.statusText}`);
  }
  return res.json();
}
