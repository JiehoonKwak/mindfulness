const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Tag {
  id: number;
  name_ko: string;
  name_en: string;
  color: string;
  is_default: boolean;
}

export interface TagCreate {
  name_ko: string;
  name_en: string;
  color?: string;
  is_default?: boolean;
}

export async function listTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/api/tags/`);
  if (!res.ok) {
    throw new Error(`Failed to list tags: ${res.statusText}`);
  }
  return res.json();
}

export async function createTag(tag: TagCreate): Promise<Tag> {
  const res = await fetch(`${API_BASE}/api/tags/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (!res.ok) {
    throw new Error(`Failed to create tag: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteTag(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/tags/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete tag: ${res.statusText}`);
  }
  return res.json();
}

export async function addTagsToSession(
  sessionId: number,
  tagIds: number[],
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/tags/sessions/${sessionId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tagIds),
  });
  if (!res.ok) {
    throw new Error(`Failed to add tags: ${res.statusText}`);
  }
  return res.json();
}

export async function getSessionTags(sessionId: number): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/api/tags/sessions/${sessionId}/tags`);
  if (!res.ok) {
    throw new Error(`Failed to get session tags: ${res.statusText}`);
  }
  return res.json();
}
