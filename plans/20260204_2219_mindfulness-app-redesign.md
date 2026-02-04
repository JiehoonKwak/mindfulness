# Mindfulness App Complete Overhaul - Execution Plan

## User Choices
- **Theme:** Pure AMOLED black (#000000) / clean white
- **Font:** System fonts (no extra loading)
- **Visuals:** 3 new breathing-synced (BreathSphere, FloatingOrbs, RippleWater)
- **Music:** Gemini API integration

---

## PHASE 1: Core UI Foundation

### Step 1.1: Strip Theme System

**File:** `frontend/src/styles/themes.css`

Delete all existing themes. Replace with:
```css
:root {
  color-scheme: dark light;
}

[data-theme="zen-dark"] {
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-surface-elevated: #121212;
  --color-primary: #ffffff;
  --color-primary-muted: #a0a0a0;
  --color-accent: #6366f1;
  --color-text: #ffffff;
  --color-text-muted: #71717a;
  --color-border: #27272a;
  --color-success: #22c55e;
  --color-error: #ef4444;
}

[data-theme="zen-light"] {
  --color-bg: #ffffff;
  --color-surface: #fafafa;
  --color-surface-elevated: #ffffff;
  --color-primary: #09090b;
  --color-primary-muted: #52525b;
  --color-accent: #6366f1;
  --color-text: #09090b;
  --color-text-muted: #71717a;
  --color-border: #e4e4e7;
  --color-success: #16a34a;
  --color-error: #dc2626;
}
```

### Step 1.2: Update Settings Store

**File:** `frontend/src/stores/settingsStore.ts`

```typescript
type ThemeId = "zen-dark" | "zen-light";
const LIGHT_THEMES: ThemeId[] = ["zen-light"];
// Update default: theme: "zen-dark"
```

### Step 1.3: Simplify ThemeSwitcher

**File:** `frontend/src/components/ThemeSwitcher.tsx`

Replace grid of 8 with toggle:
```tsx
export default function ThemeSwitcher() {
  const { theme, setTheme } = useSettingsStore();
  const isDark = theme === "zen-dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "zen-light" : "zen-dark")}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
```

### Step 1.4: Create SVG Icon System

**New file:** `frontend/src/components/Icons.tsx`

```tsx
export const Icons = {
  play: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>,
  pause: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>,
  stop: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 6h12v12H6z"/></svg>,
  settings: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  stats: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  moon: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  flame: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V6c0-1.66 1.34-3 3-3 .35 0 .69.06 1 .17V2c0-.55.45-1 1-1s1 .45 1 1v1.17c.31-.11.65-.17 1-.17 1.66 0 3 1.34 3 3v2.64c1.83 1.53 3 3.84 3 6.36 0 4.42-4.03 8-9 8z"/></svg>,
  check: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  x: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  chevronLeft: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="m15 18-6-6 6-6"/></svg>,
  music: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  bell: (p: SVGProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};
```

### Step 1.5: Typography in index.css

**File:** `frontend/src/index.css`

Add after `@import "tailwindcss"`:
```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography scale */
.text-display { font-size: 3.5rem; font-weight: 200; letter-spacing: -0.02em; line-height: 1; }
.text-title { font-size: 1.25rem; font-weight: 500; letter-spacing: -0.01em; }
.text-body { font-size: 1rem; font-weight: 400; }
.text-caption { font-size: 0.875rem; color: var(--color-text-muted); }
.text-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
```

---

### VERIFY PHASE 1

Use `agent-browser` to verify:
1. Navigate to localhost:5173/settings
2. Screenshot: Confirm only dark/light toggle exists
3. Toggle theme, confirm #000000 background in dark mode
4. Check no emojis visible in settings

---

## PHASE 2: Page Redesigns

### Step 2.1: Home Page

**File:** `frontend/src/pages/Home.tsx`

Complete rewrite:
```tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStats } from "../api/stats";
import { Heatmap } from "../components/Stats/Heatmap";
import { Icons } from "../components/Icons";

export default function Home() {
  const { t } = useTranslation();
  const { data: summary } = useStats();
  const { data: heatmap } = useHeatmap();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-title">{t("common.appName")}</h1>
        <Link to="/settings" className="p-2 -m-2">
          <Icons.settings className="w-6 h-6 text-[var(--color-text-muted)]" />
        </Link>
      </header>

      {/* Heatmap hero */}
      <section className="px-6 py-4">
        <Heatmap data={heatmap} compact />
        <div className="flex justify-between mt-3 text-caption">
          <span className="flex items-center gap-1.5">
            <Icons.flame className="w-4 h-4 text-orange-500" />
            {summary?.current_streak || 0} {t("stats.dayStreak")}
          </span>
          <span>{Math.round((summary?.total_seconds || 0) / 60)} min total</span>
        </div>
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <section className="p-6 space-y-3">
        <Link
          to="/meditate"
          className="flex items-center justify-center w-full py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-bg)] text-title"
        >
          {t("home.startMeditation")}
        </Link>
        <Link
          to="/breathe"
          className="flex items-center justify-center w-full py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text)]"
        >
          {t("home.breathingGuide")}
        </Link>
      </section>

      {/* Bottom nav */}
      <nav className="flex justify-around py-4 border-t border-[var(--color-border)]">
        <Link to="/insights" className="p-3">
          <Icons.stats className="w-6 h-6" />
        </Link>
        <Link to="/settings" className="p-3">
          <Icons.settings className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
}
```

### Step 2.2: Create Insights Page (Merge Stats + History)

**New file:** `frontend/src/pages/Insights.tsx`

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSummary, useHeatmap } from "../api/stats";
import { useSessions } from "../api/sessions";
import { Heatmap } from "../components/Stats/Heatmap";
import { Icons } from "../components/Icons";

type Tab = "overview" | "history";

export default function Insights() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("overview");
  const { data: summary } = useSummary();
  const { data: heatmap } = useHeatmap();
  const { data: sessions } = useSessions();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="flex items-center gap-4 p-6">
        <Link to="/" className="p-2 -m-2">
          <Icons.chevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-title">{t("nav.insights")}</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mb-6">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "overview"
              ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
              : "bg-[var(--color-surface)]"
          }`}
        >
          {t("insights.overview")}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "history"
              ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
              : "bg-[var(--color-surface)]"
          }`}
        >
          {t("insights.history")}
        </button>
      </div>

      {/* Content */}
      <div className="px-6">
        {tab === "overview" ? (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label={t("stats.totalSessions")} value={summary?.total_sessions || 0} />
              <StatCard label={t("stats.totalMinutes")} value={Math.round((summary?.total_seconds || 0) / 60)} />
              <StatCard label={t("stats.currentStreak")} value={summary?.current_streak || 0} icon={<Icons.flame className="w-4 h-4 text-orange-500" />} />
              <StatCard label={t("stats.longestStreak")} value={summary?.longest_streak || 0} />
            </div>

            {/* Heatmap */}
            <div>
              <h3 className="text-caption mb-3">{t("stats.yearOverview")}</h3>
              <Heatmap data={heatmap} />
            </div>
          </div>
        ) : (
          <SessionList sessions={sessions || []} />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="text-caption mb-1">{label}</div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-2xl font-medium text-mono">{value}</span>
      </div>
    </div>
  );
}

function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <div key={s.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm">{new Date(s.started_at).toLocaleDateString()}</div>
              <div className="text-caption">{Math.round((s.actual_duration_seconds || 0) / 60)} min</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${s.completed ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"}`}>
              {s.completed ? "Completed" : "Partial"}
            </div>
          </div>
          {s.note && <p className="mt-2 text-caption line-clamp-2">{s.note}</p>}
        </div>
      ))}
    </div>
  );
}
```

### Step 2.3: Update Routes

**File:** `frontend/src/App.tsx`

```tsx
// Remove History import
// Add: import Insights from "./pages/Insights";
// Change route: <Route path="/stats" ... /> and <Route path="/history" ... />
// To: <Route path="/insights" element={<Insights />} />
```

### Step 2.4: Delete History Page

**Delete:** `frontend/src/pages/History.tsx`

### Step 2.5: Update i18n

**File:** `frontend/src/i18n/en.json` and `ko.json`

Add:
```json
{
  "nav": { "insights": "Insights" },
  "insights": { "overview": "Overview", "history": "History" }
}
```

### Step 2.6: Meditate Page Cleanup

**File:** `frontend/src/pages/Meditate.tsx`

Key changes:
- Larger timer display using `text-display text-mono`
- Remove cluttered UI
- Add visual preview on hover (Step 3.4)

---

### VERIFY PHASE 2

Use `agent-browser`:
1. Navigate to localhost:5173
2. Screenshot: Confirm heatmap visible, no "목표 없음"
3. Navigate to /insights
4. Screenshot: Confirm tabs work, no emojis
5. Navigate to /meditate
6. Screenshot: Confirm clean timer UI

---

## PHASE 3: Visual Effects Overhaul

### Step 3.1: Delete Bad Visuals

**Delete these directories:**
- `frontend/src/components/Visuals/BreathingCircle/`
- `frontend/src/components/Visuals/ParticleFlow/`
- `frontend/src/components/Visuals/GradientWaves/`
- `frontend/src/components/Visuals/Mandala/`
- `frontend/src/components/Visuals/CosmicDust/`
- `frontend/src/components/Visuals/LiquidMetal/`
- `frontend/src/components/Visuals/SacredGeometry/`
- `frontend/src/components/Visuals/OceanDepth/`
- `frontend/src/components/Visuals/ZenGarden/`

### Step 3.2: Create BreathSphere Visual

**New file:** `frontend/src/components/Visuals/BreathSphere/BreathSphere.tsx`

```tsx
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";

const vertexShader = `
  uniform float uTime;
  uniform float uScale;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    float displacement = sin(position.y * 3.0 + uTime) * 0.05;
    vec3 newPosition = position * uScale + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

    vec3 color = uColor * (0.3 + fresnel * 0.7) * uIntensity;
    float alpha = 0.6 + fresnel * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function BreathSphere({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();

  const renderer = useRef<THREE.WebGLRenderer>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.PerspectiveCamera>();
  const mesh = useRef<THREE.Mesh>();
  const uniforms = useRef({
    uTime: { value: 0 },
    uScale: { value: 0.8 },
    uIntensity: { value: 0.5 },
    uColor: { value: new THREE.Color(0x6366f1) },
  });

  // Calculate breath progress
  const progress = useMemo(() => {
    if (!pattern) return 0;
    const durations: Record<string, number> = {
      inhale: pattern.inhale,
      holdIn: pattern.hold_in,
      exhale: pattern.exhale,
      holdOut: pattern.hold_out,
    };
    const duration = durations[phase] || 1;
    return 1 - phaseTime / duration;
  }, [phase, phaseTime, pattern]);

  // Target values based on phase
  const targets = useMemo(() => {
    switch (phase) {
      case "inhale": return { scale: 0.7 + progress * 0.5, intensity: 0.3 + progress * 0.7 };
      case "holdIn": return { scale: 1.2, intensity: 1.0 };
      case "exhale": return { scale: 1.2 - progress * 0.5, intensity: 1.0 - progress * 0.7 };
      case "holdOut": return { scale: 0.7, intensity: 0.3 };
      default: return { scale: 0.8, intensity: 0.5 };
    }
  }, [phase, progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.current.position.z = 3;

    renderer.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.current.setSize(400, 400);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.current.domElement);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms.current,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    mesh.current = new THREE.Mesh(geometry, material);
    scene.current.add(mesh.current);

    return () => {
      renderer.current?.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.current!.domElement);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !renderer.current) return;

    let animationId: number;
    const animate = () => {
      uniforms.current.uTime.value += 0.01;

      // Smooth lerp to targets
      uniforms.current.uScale.value += (targets.scale - uniforms.current.uScale.value) * 0.1;
      uniforms.current.uIntensity.value += (targets.intensity - uniforms.current.uIntensity.value) * 0.1;

      renderer.current!.render(scene.current!, camera.current!);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, targets]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
      <div ref={containerRef} className="w-[400px] h-[400px]" />
    </div>
  );
}
```

### Step 3.3: Create FloatingOrbs Visual

**New file:** `frontend/src/components/Visuals/FloatingOrbs/FloatingOrbs.tsx`

```tsx
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";

export default function FloatingOrbs({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern } = useBreathingStore();

  // Similar structure to BreathSphere but with 5 floating orbs
  // Each orb has slight offset in timing for natural feel
  // Orbs drift slowly while pulsing with breath

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create 5 orbs with different positions and sizes
    const orbs: THREE.Mesh[] = [];
    const orbData = [
      { pos: [-2, 1, 0], scale: 0.8, color: 0x6366f1 },
      { pos: [2, -1, -1], scale: 0.6, color: 0x8b5cf6 },
      { pos: [0, 2, -2], scale: 0.5, color: 0xa78bfa },
      { pos: [-1, -2, -1], scale: 0.7, color: 0x7c3aed },
      { pos: [1.5, 0.5, -0.5], scale: 0.4, color: 0xc4b5fd },
    ];

    orbData.forEach(({ pos, scale, color }) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.scale.setScalar(scale);
      mesh.userData.baseScale = scale;
      mesh.userData.offset = Math.random() * Math.PI * 2;
      scene.add(mesh);
      orbs.push(mesh);
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;

      orbs.forEach((orb, i) => {
        // Gentle drift
        orb.position.x += Math.sin(time + i) * 0.002;
        orb.position.y += Math.cos(time + i * 0.7) * 0.002;

        // Breath-synced pulsing handled in separate effect
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    if (isActive) animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      orbs.forEach((orb) => {
        orb.geometry.dispose();
        (orb.material as THREE.Material).dispose();
      });
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isActive]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
```

### Step 3.4: Create RippleWater Visual

**New file:** `frontend/src/components/Visuals/RippleWater/RippleWater.tsx`

```tsx
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../../stores/breathingStore";

const vertexShader = `
  uniform float uTime;
  uniform float uRipple;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = length(uv - 0.5);
    float ripple = sin(dist * 20.0 - uTime * 2.0) * uRipple * 0.1;
    ripple *= smoothstep(0.5, 0.0, dist);

    pos.z += ripple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float dist = length(vUv - 0.5);
    float alpha = smoothstep(0.5, 0.3, dist) * 0.3;
    vec3 color = vec3(0.39, 0.4, 0.95); // Indigo

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function RippleWater({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase } = useBreathingStore();
  const uniforms = useRef({
    uTime: { value: 0 },
    uRipple: { value: 0 },
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms.current,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    const animate = () => {
      uniforms.current.uTime.value += 0.02;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    if (isActive) animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isActive]);

  // Update ripple intensity based on breath phase
  useEffect(() => {
    const target = phase === "exhale" ? 1 : phase === "inhale" ? 0.3 : 0.1;
    const interval = setInterval(() => {
      uniforms.current.uRipple.value += (target - uniforms.current.uRipple.value) * 0.1;
    }, 16);
    return () => clearInterval(interval);
  }, [phase]);

  return <div ref={containerRef} className="absolute inset-0 bg-[var(--color-bg)]" />;
}
```

### Step 3.5: Update Visual Index

**File:** `frontend/src/components/Visuals/index.ts`

```tsx
export { default as Aurora } from "./Aurora/Aurora";
export { default as BreathSphere } from "./BreathSphere/BreathSphere";
export { default as FloatingOrbs } from "./FloatingOrbs/FloatingOrbs";
export { default as RippleWater } from "./RippleWater/RippleWater";

export const VISUALS = [
  { id: "aurora", name: "Aurora", component: "Aurora" },
  { id: "breathsphere", name: "Breath Sphere", component: "BreathSphere" },
  { id: "floatingorbs", name: "Floating Orbs", component: "FloatingOrbs" },
  { id: "ripplewater", name: "Ripple Water", component: "RippleWater" },
] as const;
```

### Step 3.6: Visual Preview on Hover

**File:** `frontend/src/components/Visuals/VisualSelector.tsx`

```tsx
import { useState, Suspense, lazy } from "react";
import { VISUALS } from "./index";

const visualComponents = {
  Aurora: lazy(() => import("./Aurora/Aurora")),
  BreathSphere: lazy(() => import("./BreathSphere/BreathSphere")),
  FloatingOrbs: lazy(() => import("./FloatingOrbs/FloatingOrbs")),
  RippleWater: lazy(() => import("./RippleWater/RippleWater")),
};

export default function VisualSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex gap-2 flex-wrap">
        {VISUALS.map((v) => {
          const Component = visualComponents[v.component as keyof typeof visualComponents];
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              onMouseEnter={() => setPreview(v.id)}
              onMouseLeave={() => setPreview(null)}
              className={`relative px-4 py-2 rounded-lg text-sm transition-all ${
                selected === v.id
                  ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                  : "bg-[var(--color-surface)] border border-[var(--color-border)]"
              }`}
            >
              {v.name}

              {/* Preview popup */}
              {preview === v.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-border)] shadow-xl z-50">
                  <Suspense fallback={<div className="w-full h-full bg-[var(--color-surface)]" />}>
                    <Component isActive={true} />
                  </Suspense>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

### VERIFY PHASE 3

Use `agent-browser`:
1. Navigate to /meditate
2. Hover over visual selector buttons
3. Screenshot: Confirm preview popups appear
4. Select each visual, screenshot each
5. Confirm only 4 visuals available (Aurora, BreathSphere, FloatingOrbs, RippleWater)

---

## PHASE 4: Backend Completion

### Step 4.1: Discord Triggers

**File:** `backend/app/routes/sessions.py`

Add after session update:
```python
from ..services.discord import discord_service

@router.patch("/{session_id}")
async def update_session(session_id: int, session_update: SessionUpdate, db: SessionDep):
    session = db.get(Session, session_id)
    # ... existing update code ...

    db.commit()
    db.refresh(session)

    # Trigger Discord on completion
    if session_update.completed and session.completed:
        await discord_service.notify_session_complete(session)

        # Check streak milestone
        streak = await get_current_streak(db)
        if streak in [7, 14, 30, 60, 100, 365]:
            await discord_service.notify_streak_milestone(streak)

    return session
```

### Step 4.2: APScheduler Setup

**New file:** `backend/app/services/scheduler.py`

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from .discord import discord_service
from ..database import get_session

scheduler = AsyncIOScheduler()

async def send_daily_reminder():
    """Check if user meditated today, send reminder if not."""
    with get_session() as db:
        today = date.today()
        session_today = db.exec(
            select(Session).where(
                func.date(Session.started_at) == today
            )
        ).first()

        if not session_today:
            await discord_service.send_reminder(
                "🧘 Time for your daily mindfulness practice!"
            )

async def send_weekly_summary():
    """Send weekly stats summary."""
    with get_session() as db:
        stats = calculate_weekly_stats(db)
        await discord_service.send_weekly_summary(stats)

def init_scheduler(reminder_hour: int = 20, reminder_minute: int = 0):
    """Initialize scheduler with configurable reminder time."""
    # Daily reminder
    scheduler.add_job(
        send_daily_reminder,
        CronTrigger(hour=reminder_hour, minute=reminder_minute),
        id="daily_reminder",
        replace_existing=True,
    )

    # Weekly summary on Sunday 8pm
    scheduler.add_job(
        send_weekly_summary,
        CronTrigger(day_of_week="sun", hour=20, minute=0),
        id="weekly_summary",
        replace_existing=True,
    )

    scheduler.start()

def shutdown_scheduler():
    scheduler.shutdown()
```

### Step 4.3: Update main.py Lifespan

**File:** `backend/app/main.py`

```python
from .services.scheduler import init_scheduler, shutdown_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    init_scheduler()  # Add this
    yield
    shutdown_scheduler()  # Add this
```

### Step 4.4: Reminder Config API

**New file:** `backend/app/routes/reminders.py`

```python
from fastapi import APIRouter
from ..services.scheduler import scheduler
from apscheduler.triggers.cron import CronTrigger

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.get("/config")
async def get_config():
    job = scheduler.get_job("daily_reminder")
    if job and job.trigger:
        return {"enabled": True, "hour": job.trigger.hour, "minute": job.trigger.minute}
    return {"enabled": False}

@router.put("/config")
async def update_config(hour: int, minute: int, enabled: bool = True):
    if enabled:
        scheduler.reschedule_job(
            "daily_reminder",
            trigger=CronTrigger(hour=hour, minute=minute)
        )
    else:
        scheduler.pause_job("daily_reminder")
    return {"success": True}
```

### Step 4.5: Gemini Music Integration

**File:** `backend/app/services/music_gen.py`

```python
import os
import google.generativeai as genai
from typing import Optional
import aiofiles
import time

class MusicGenService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def generate(self, prompt: str, duration_seconds: int = 120) -> Optional[str]:
        if not self.api_key:
            return None

        try:
            model = genai.GenerativeModel("gemini-2.0-flash-exp")

            # Generate meditation music description
            full_prompt = f"""Generate ambient meditation music.
            Style: {prompt}
            Duration: {duration_seconds} seconds
            Requirements: No vocals, slow tempo, calming, suitable for meditation
            """

            response = await model.generate_content_async(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="audio/mp3"
                )
            )

            # Save to file
            filename = f"meditation_{int(time.time())}.mp3"
            filepath = f"./sounds/music/generated/{filename}"

            async with aiofiles.open(filepath, "wb") as f:
                await f.write(response.data)

            return filename

        except Exception as e:
            print(f"Music generation error: {e}")
            return None

music_gen_service = MusicGenService()
```

### Step 4.6: Music Selector UI

**New file:** `frontend/src/components/MusicSelector/MusicSelector.tsx`

```tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Icons } from "../Icons";

const presets = [
  { id: "ambient", label: "Ambient", prompt: "calm ambient drone" },
  { id: "nature", label: "Nature", prompt: "gentle nature sounds with soft music" },
  { id: "tibetan", label: "Tibetan", prompt: "tibetan singing bowls meditation" },
  { id: "binaural", label: "Binaural", prompt: "binaural beats theta waves" },
];

export default function MusicSelector() {
  const [generating, setGenerating] = useState(false);

  const { data: library } = useQuery({
    queryKey: ["music-library"],
    queryFn: () => fetch("/api/music/library").then(r => r.json()),
  });

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setGenerating(true);
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      return res.json();
    },
    onSettled: () => setGenerating(false),
  });

  return (
    <div className="space-y-4">
      <h3 className="text-title">Background Music</h3>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => generateMutation.mutate(p.prompt)}
            disabled={generating}
            className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left"
          >
            <div className="text-sm">{p.label}</div>
            <div className="text-caption text-xs">{generating ? "Generating..." : "Generate"}</div>
          </button>
        ))}
      </div>

      {/* Library */}
      {library?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-caption">Your Music</h4>
          {library.map((track: any) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)]"
            >
              <Icons.music className="w-5 h-5" />
              <span className="flex-1 text-sm">{track.prompt}</span>
              <button className="p-2">
                <Icons.play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 4.7: Add to Settings Page

**File:** `frontend/src/pages/Settings.tsx`

Add MusicSelector component in settings sections.

---

### VERIFY PHASE 4

1. Test Discord: `curl -X POST localhost:8000/api/discord/test`
2. Check scheduler started in backend logs
3. Create session, complete it, verify Discord notification sent
4. Test music generation (requires GEMINI_API_KEY)

---

## PHASE 5: Final Verification Loop

### Full E2E Test Script

Use `agent-browser` skill to run through:

```
1. HOME PAGE
   - Navigate to localhost:5173
   - Screenshot
   - Verify: Heatmap visible, no "목표 없음", clean layout

2. THEME TOGGLE
   - Navigate to /settings
   - Find theme toggle
   - Click toggle
   - Screenshot light mode
   - Verify: Pure white background
   - Toggle back
   - Screenshot dark mode
   - Verify: Pure #000 background

3. MEDITATION FLOW
   - Navigate to /meditate
   - Screenshot timer UI
   - Hover over visual buttons
   - Screenshot preview popup
   - Select each visual, screenshot
   - Start 3min meditation
   - Wait 10 seconds
   - Screenshot running state
   - Stop meditation
   - Screenshot completion modal

4. INSIGHTS PAGE
   - Navigate to /insights
   - Screenshot overview tab
   - Click history tab
   - Screenshot history tab
   - Verify: No emojis, clean stats cards

5. SETTINGS
   - Navigate to /settings
   - Screenshot
   - Verify: Only dark/light toggle, no 8-theme grid
   - Check music section exists
   - Check Discord section exists
```

---

## Files Summary

### Create
- `frontend/src/components/Icons.tsx`
- `frontend/src/pages/Insights.tsx`
- `frontend/src/components/Visuals/BreathSphere/BreathSphere.tsx`
- `frontend/src/components/Visuals/FloatingOrbs/FloatingOrbs.tsx`
- `frontend/src/components/Visuals/RippleWater/RippleWater.tsx`
- `frontend/src/components/MusicSelector/MusicSelector.tsx`
- `backend/app/services/scheduler.py`
- `backend/app/routes/reminders.py`

### Modify
- `frontend/src/styles/themes.css` (strip to 2 themes)
- `frontend/src/stores/settingsStore.ts` (update ThemeId)
- `frontend/src/components/ThemeSwitcher.tsx` (toggle)
- `frontend/src/index.css` (typography)
- `frontend/src/pages/Home.tsx` (heatmap hero)
- `frontend/src/pages/Settings.tsx` (simplify)
- `frontend/src/pages/Meditate.tsx` (cleanup)
- `frontend/src/components/Visuals/index.ts` (update exports)
- `frontend/src/components/Visuals/VisualSelector.tsx` (preview)
- `frontend/src/App.tsx` (routes)
- `frontend/src/i18n/en.json` and `ko.json`
- `backend/app/main.py` (scheduler lifespan)
- `backend/app/routes/sessions.py` (Discord triggers)
- `backend/app/services/music_gen.py` (Gemini)

### Delete
- `frontend/src/pages/History.tsx`
- `frontend/src/components/Visuals/BreathingCircle/`
- `frontend/src/components/Visuals/ParticleFlow/`
- `frontend/src/components/Visuals/GradientWaves/`
- `frontend/src/components/Visuals/Mandala/`
- `frontend/src/components/Visuals/CosmicDust/`
- `frontend/src/components/Visuals/LiquidMetal/`
- `frontend/src/components/Visuals/SacredGeometry/`
- `frontend/src/components/Visuals/OceanDepth/`
- `frontend/src/components/Visuals/ZenGarden/`

