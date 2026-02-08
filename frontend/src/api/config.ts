const getApiBase = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use same hostname as frontend, port 14301
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    return `http://${window.location.hostname}:14301`;
  }

  return "http://localhost:14301";
};

export const API_BASE = getApiBase();
