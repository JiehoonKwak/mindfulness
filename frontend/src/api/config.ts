const getApiBase = (): string => {
  // Explicit env override
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect for Tailscale HTTPS
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    if (hostname.endsWith(".ts.net")) {
      return `${protocol}//${hostname}:8141`;
    }
  }

  // Default local
  return "http://localhost:8141";
};

export const API_BASE = getApiBase();
