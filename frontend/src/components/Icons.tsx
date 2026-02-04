import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const Icons = {
  play: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  pause: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  stop: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 6h12v12H6z" />
    </svg>
  ),
  settings: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  stats: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  moon: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  sun: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  flame: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V6c0-1.66 1.34-3 3-3 .35 0 .69.06 1 .17V2c0-.55.45-1 1-1s1 .45 1 1v1.17c.31-.11.65-.17 1-.17 1.66 0 3 1.34 3 3v2.64c1.83 1.53 3 3.84 3 6.36 0 4.42-4.03 8-9 8z" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  chevronLeft: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  music: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  bell: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  home: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  wind: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  ),
  history: (p: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
};
