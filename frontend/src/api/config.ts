const getApiBase = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use same hostname as frontend, port 8141
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    return `http://${window.location.hostname}:8141`;
  }

  return "http://localhost:8141";
};

export const API_BASE = getApiBase();
