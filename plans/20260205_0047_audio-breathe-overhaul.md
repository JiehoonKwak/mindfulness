# Plan: Audio Fixes + Breathe Page Overhaul

## Goal

Fix audio lifecycle bugs (stop/pause/preview) across Meditate and Settings pages, persist Discord webhook to SQLite, and completely redesign the Breathe page with multiple NEW creative Three.js visuals that sync with breathing phases.

## Requirements

### P0 - Audio Bugs
1. Audio stops when timer stopped (not just completed)
2. Audio pauses/resumes with timer pause/resume
3. Bell preview in Settings stops previous sound before playing new
4. Ambient preview in Settings stops previous before playing new
5. Background music mutually exclusive selection (stop previous when selecting new)

### P1 - Breathe Page Overhaul
1. Create NEW Three.js breathing visuals (minimum 3 options)
2. Responsive visual size (fills available viewport)
3. Visual selector component for breathing animations
4. Sync animations with breathing phases (inhale/hold/exhale)
5. Zen aesthetic: calm, monotonous, soothing
6. Fix layout: remove empty space, prevent button overlap

### P2 - Enhancements
1. Discord webhook URL persistence in SQLite
2. Preview sounds for background music in Settings

---

## Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `/frontend/src/pages/Meditate.tsx` | Modify | Add audio stop on timer stop, pause/resume audio with timer |
| `/frontend/src/hooks/useAudioLayers.ts` | Modify | Add `pauseAll()` and `resumeAll()` methods |
| `/frontend/src/pages/Settings.tsx` | Modify | Track bell/ambient preview Audio instances, stop previous on new selection, load webhook on mount |
| `/frontend/src/pages/Breathe.tsx` | Rewrite | Complete redesign with visual selector, responsive layout |
| `/frontend/src/components/BreathingVisuals/index.ts` | Create | Export breathing-specific visuals |
| `/frontend/src/components/BreathingVisuals/BreathingWaves.tsx` | Create | NEW: Concentric waves that pulse with breath |
| `/frontend/src/components/BreathingVisuals/BreathingLotus.tsx` | Create | NEW: Lotus flower that opens/closes with breath |
| `/frontend/src/components/BreathingVisuals/BreathingOrb.tsx` | Create | NEW: Minimal orb with particle halo |
| `/frontend/src/components/BreathingVisuals/BreathingVisualSelector.tsx` | Create | Selector UI for breathing visuals |
| `/frontend/src/stores/breathingStore.ts` | Modify | Add `selectedVisual` state |
| `/frontend/src/i18n/en.json` | Modify | Add breathing visual translation keys |
| `/frontend/src/i18n/ko.json` | Modify | Add breathing visual translation keys |
| `/backend/app/models/settings.py` | Create | SQLModel for app settings (webhook URL) |
| `/backend/app/routes/discord.py` | Modify | Load/save webhook from database |
| `/backend/app/database.py` | Modify | Register settings model |

---

## Pre-Verified (No Code Changes Required)

### Music Selector Stop-Previous Behavior

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/MusicSelector/MusicSelector.tsx`

The current implementation at lines 78-88 already handles stopping the current track before playing a new one. The `playTrack` function pauses the audio before setting a new src.

**Verification Steps:**
1. Start the app and navigate to Settings
2. Expand the Music section
3. Play track A (click play button)
4. While A is playing, click play on track B
5. **Expected**: Track A stops immediately, track B starts
6. Play track A, click pause on A
7. **Expected**: A pauses
8. Resume A
9. **Expected**: A continues from where it paused

If this fails, the fix would be to add explicit `audio.pause()` and `audio.currentTime = 0` before changing the src.

---

## Steps

### Step 1: Add Audio Pause/Resume to useAudioLayers Hook

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useAudioLayers.ts`

**Changes:**
1. Add `pauseAll()` method that suspends the AudioContext
2. Add `resumeAll()` method that resumes the AudioContext
3. These leverage the Web Audio API's built-in suspend/resume for clean pause behavior

**Implementation:**
```typescript
// Add after setMasterVolume callback (around line 138)

// Pause all audio (suspend context)
const pauseAll = useCallback(() => {
  if (contextRef.current && contextRef.current.state === "running") {
    contextRef.current.suspend();
  }
}, []);

// Resume all audio
const resumeAll = useCallback(() => {
  if (contextRef.current && contextRef.current.state === "suspended") {
    contextRef.current.resume();
  }
}, []);

// Update return object to include new methods
return {
  playBell,
  addAmbient,
  removeAmbient,
  setAmbientVolume,
  setMasterVolume,
  fadeOutAll,
  pauseAll,    // NEW
  resumeAll,   // NEW
  isAmbientPlaying,
};
```

**Test Requirements:**
- Unit test: Call pauseAll when context is running, verify state becomes "suspended"
- Unit test: Call resumeAll when context is suspended, verify state becomes "running"

**Verification:**
- TypeScript compiles without errors
- Methods are accessible from useAudioLayers() hook

---

### Step 2: Audio Stops on Timer Stop/Pause in Meditate Page

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx`

**Changes:**
1. Watch for `status` changes to "idle" (stop) and call `audio.fadeOutAll()`
2. Watch for `status` changes to "paused" and call `audio.pauseAll()`
3. Watch for `status` changes from "paused" to "running" and call `audio.resumeAll()`
4. Clear activeAmbients state when stopping
5. **Update prevStatusRef.current at end of effect**

**Implementation:**
```typescript
// Add new effect after existing audio effects (around line 49)
// Note: prevStatusRef already exists at line 27

// Handle audio on timer status changes
useEffect(() => {
  if (prevStatusRef.current === "running" && status === "paused") {
    // Timer paused - pause audio
    audio.pauseAll();
  } else if (prevStatusRef.current === "paused" && status === "running") {
    // Timer resumed - resume audio
    audio.resumeAll();
  } else if (prevStatusRef.current !== "idle" && status === "idle") {
    // Timer stopped - fade out and clear
    audio.fadeOutAll(500);
    setActiveAmbients(new Set());
  }
  // CRITICAL: Update ref to track current status for next comparison
  prevStatusRef.current = status;
}, [status, audio]);
```

**Test Requirements:**
- Manual test: Start meditation with ambient, click stop -> audio fades
- Manual test: Start meditation with ambient, click pause -> audio pauses, resume -> audio resumes

**Verification:**
- Start meditation with ambient sound, click stop -> audio fades out
- Start meditation with ambient sound, click pause -> audio pauses
- Resume from pause -> audio resumes
- Complete timer normally -> existing behavior unchanged (fade out on complete)

---

### Step 3: Bell Preview Stops Previous in Settings

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Settings.tsx`

**Changes:**
1. Update import to include `useRef` and `useEffect`
2. Add ref to track current bell preview Audio instance
3. Stop and clear previous instance before creating new one
4. Clean up on unmount

**Implementation:**
```typescript
// Line 1: Update import
import { useState, useRef, useEffect } from "react";

// Add after webhookTesting state (around line 56)
const bellPreviewRef = useRef<HTMLAudioElement | null>(null);

// Replace bell button onClick (around line 209-210)
onClick={() => {
  setBellSound(bell.id);
  // Stop previous preview
  if (bellPreviewRef.current) {
    bellPreviewRef.current.pause();
    bellPreviewRef.current.currentTime = 0;
  }
  // Play new preview
  bellPreviewRef.current = new Audio(`/sounds/bells/${bell.id}.mp3`);
  bellPreviewRef.current.play();
}}

// Add cleanup effect (after other state declarations, around line 57)
useEffect(() => {
  return () => {
    if (bellPreviewRef.current) {
      bellPreviewRef.current.pause();
      bellPreviewRef.current = null;
    }
  };
}, []);
```

**Test Requirements:**
- Manual test: Rapidly click different bell sounds - only one plays at a time
- Manual test: Navigate away from Settings - sound stops

**Verification:**
- Rapidly click different bell sounds - only one plays at a time
- Navigate away from Settings - sound stops

---

### Step 4: Ambient Preview with Stop-Previous in Settings

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Settings.tsx`

**Changes:**
1. Add ref for ambient preview Audio instance (import already updated in Step 3)
2. Add preview functionality to ambient buttons (currently only sets default, no preview)
3. Stop previous ambient preview before playing new
4. Update cleanup effect to include ambient preview

**Implementation:**
```typescript
// Add ref (near bellPreviewRef, around line 57)
const ambientPreviewRef = useRef<HTMLAudioElement | null>(null);

// Update ambient button onClick (around line 243)
onClick={() => {
  setDefaultAmbient(sound.id);
  // Stop previous preview
  if (ambientPreviewRef.current) {
    ambientPreviewRef.current.pause();
    ambientPreviewRef.current.currentTime = 0;
  }
  // Play preview if not "none"
  if (sound.id !== "none") {
    const filename = sound.id === "rain" ? "rain_light"
                   : sound.id === "ocean" ? "ocean_waves"
                   : sound.id;
    ambientPreviewRef.current = new Audio(`/sounds/ambient/${filename}.mp3`);
    ambientPreviewRef.current.loop = false;
    ambientPreviewRef.current.play();
    // Stop after 3 seconds (preview)
    setTimeout(() => {
      if (ambientPreviewRef.current) {
        ambientPreviewRef.current.pause();
      }
    }, 3000);
  }
}}

// Update cleanup effect to include both refs
useEffect(() => {
  return () => {
    if (bellPreviewRef.current) {
      bellPreviewRef.current.pause();
      bellPreviewRef.current = null;
    }
    if (ambientPreviewRef.current) {
      ambientPreviewRef.current.pause();
      ambientPreviewRef.current = null;
    }
  };
}, []);
```

**Test Requirements:**
- Manual test: Click different ambient sounds rapidly - only one plays
- Manual test: Preview stops after 3 seconds
- Manual test: Selecting "none" stops any playing preview

**Verification:**
- Click different ambient sounds rapidly - only one plays
- Preview stops after 3 seconds
- Selecting "none" stops any playing preview

---

### Step 5: Create SQLite Model for App Settings

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/models/settings.py` (NEW)

**Changes:**
Create a new SQLModel for storing app-wide settings like Discord webhook URL.

**Implementation:**
```python
"""App settings model for persistent configuration."""

from typing import Optional
from sqlmodel import Field, SQLModel


class AppSetting(SQLModel, table=True):
    """Single-row settings table for app configuration."""

    __tablename__ = "app_setting"

    id: int = Field(default=1, primary_key=True)
    discord_webhook_url: Optional[str] = Field(default=None)


class AppSettingUpdate(SQLModel):
    """Schema for updating settings."""

    discord_webhook_url: Optional[str] = None
```

**Test Requirements:**
- Backend pytest: Create AppSetting, verify fields persist
- Backend pytest: Update discord_webhook_url, verify change persists

**Verification:**
- Model imports without errors
- `uv run python -c "from app.models.settings import AppSetting; print(AppSetting)"` succeeds

---

### Step 6: Register Settings Model in Database

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/database.py`

**Changes:**
Import the new settings model so SQLModel registers it.

**Implementation:**
```python
# Add to imports (around line 11)
from .models import settings as _settings_model  # noqa: F401
```

**Test Requirements:**
- Start backend, verify no import errors
- Check SQLite file for `app_setting` table

**Verification:**
- App starts without errors
- `app_setting` table exists in database after startup

---

### Step 7: Update Discord Routes for Persistence

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/routes/discord.py`

**Changes:**
1. Load webhook URL from database on GET /status
2. Add new GET /webhook endpoint to retrieve saved URL
3. Save webhook URL to database on PUT /webhook
4. Initialize discord_service with saved URL on startup
5. Use black color (0x000000) for test notification instead of purple

**Implementation:**
```python
"""Discord API routes for webhook management."""

from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import select

from ..database import SessionDep
from ..models.settings import AppSetting
from ..services.discord import discord_service

router = APIRouter(prefix="/api/discord", tags=["discord"])


class WebhookUpdate(BaseModel):
    """Schema for updating webhook URL."""

    webhook_url: str


class TestResult(BaseModel):
    """Schema for test result."""

    success: bool


def _get_or_create_settings(db: SessionDep) -> AppSetting:
    """Get or create the settings row."""
    settings = db.exec(select(AppSetting).where(AppSetting.id == 1)).first()
    if not settings:
        settings = AppSetting(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/status")
def get_status(db: SessionDep) -> dict:
    """Check if Discord webhook is configured."""
    settings = _get_or_create_settings(db)
    # Update service with saved URL
    if settings.discord_webhook_url:
        discord_service.set_webhook_url(settings.discord_webhook_url)
    return {"configured": settings.discord_webhook_url is not None}


@router.get("/webhook")
def get_webhook(db: SessionDep) -> dict:
    """Get current webhook URL."""
    settings = _get_or_create_settings(db)
    return {"webhook_url": settings.discord_webhook_url or ""}


@router.put("/webhook")
def update_webhook(data: WebhookUpdate, db: SessionDep) -> dict:
    """Save webhook URL to database."""
    settings = _get_or_create_settings(db)
    settings.discord_webhook_url = data.webhook_url
    db.add(settings)
    db.commit()
    # Update in-memory service
    discord_service.set_webhook_url(data.webhook_url)
    return {"ok": True}


@router.post("/test", response_model=TestResult)
async def test_webhook() -> TestResult:
    """Test the webhook connection."""
    if not discord_service.webhook_url:
        return TestResult(success=False)

    success = await discord_service.send_webhook(
        "",
        {
            "title": "Mindfulness App Connected",
            "description": "Test notification from your meditation app!",
            "color": 0x000000,  # Black for monochrome (not purple 0x6366F1)
        },
    )
    return TestResult(success=success)
```

**Test Requirements:**
- Backend pytest: PUT /webhook saves to DB, GET /webhook retrieves it
- Backend pytest: Restart backend, GET /webhook still returns saved URL

**Verification:**
- Set webhook URL, restart backend, URL persists
- GET /api/discord/status returns correct configured state
- Test notification appears with black embed color (not purple)

---

### Step 8: Load Webhook on Frontend Settings Mount

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Settings.tsx`

**Changes:**
Load saved webhook URL when Settings page mounts. Note: API_BASE already exists at line 9.

**Implementation:**
```typescript
// Add useEffect to load saved webhook (after cleanup effect, around line 65)
useEffect(() => {
  const loadWebhook = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/discord/webhook`);
      if (res.ok) {
        const data = await res.json();
        setWebhookUrl(data.webhook_url || "");
      }
    } catch (error) {
      console.error("Failed to load webhook:", error);
    }
  };
  loadWebhook();
}, []);
```

**Test Requirements:**
- Manual test: Save webhook, refresh page, webhook URL still shows in input

**Verification:**
- Save webhook, refresh page, webhook URL still shows in input

---

### Step 9: Add Visual Selection to Breathing Store

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/breathingStore.ts`

**Changes:**
Add `selectedVisual` state and `setSelectedVisual` action.

**Implementation:**
```typescript
// Update interface (around line 5-15)
interface BreathingState {
  pattern: BreathingPattern;
  phase: BreathPhase;
  phaseTime: number;
  cycleCount: number;
  isActive: boolean;
  selectedVisual: string;  // NEW
  setPattern: (id: string) => void;
  setSelectedVisual: (id: string) => void;  // NEW
  start: () => void;
  stop: () => void;
  tick: () => void;
}

// Update create() call - add after isActive: false
export const useBreathingStore = create<BreathingState>((set, get) => ({
  pattern: BREATHING_PATTERNS[1],
  phase: "inhale",
  phaseTime: 4,
  cycleCount: 0,
  isActive: false,
  selectedVisual: "waves",  // NEW - default to waves

  setPattern: (id) => {
    // ... existing implementation unchanged
  },

  setSelectedVisual: (id) => set({ selectedVisual: id }),  // NEW

  start: () => {
    // ... existing implementation unchanged
  },
  stop: () => set({ isActive: false }),
  tick: () => {
    // ... existing implementation unchanged
  },
}));
```

**Test Requirements:**
- Unit test: Initial selectedVisual is "waves"
- Unit test: setSelectedVisual("lotus") updates state to "lotus"

**Verification:**
- `useBreathingStore().selectedVisual` returns "waves"
- `setSelectedVisual("lotus")` updates state

---

### Step 10: Create Breathing Waves Visual (NEW)

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingVisuals/BreathingWaves.tsx` (NEW)

**Concept:** Concentric circles/waves that pulse outward during exhale and contract inward during inhale. Minimal, calm, hypnotic.

**Implementation:**
```typescript
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";

const RING_COUNT = 8;

export default function BreathingWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern, isActive } = useBreathingStore();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const ringsRef = useRef<THREE.Line[]>([]);

  // Calculate breath progress 0-1
  const getProgress = () => {
    if (!isActive) return 0;
    const durations: Record<string, number> = {
      inhale: pattern.inhale,
      holdIn: pattern.holdIn,
      exhale: pattern.exhale,
      holdOut: pattern.holdOut,
    };
    const duration = durations[phase] || 1;
    return 1 - phaseTime / duration;
  };

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    // Orthographic camera for 2D feel
    const frustumSize = 5;
    cameraRef.current = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    cameraRef.current.position.z = 5;

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    // Create concentric rings
    const rings: THREE.Line[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const radius = 0.3 + i * 0.25;
      const segments = 64;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((segments + 1) * 3);

      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle) * radius;
        positions[j * 3 + 1] = Math.sin(angle) * radius;
        positions[j * 3 + 2] = 0;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8 - i * 0.08,
      });

      const ring = new THREE.Line(geometry, material);
      ring.userData = { baseRadius: radius, index: i };
      rings.push(ring);
      sceneRef.current.add(ring);
    }
    ringsRef.current = rings;

    // Handle resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const a = w / h;
      const fs = 5;
      cameraRef.current.left = -fs * a / 2;
      cameraRef.current.right = fs * a / 2;
      cameraRef.current.top = fs / 2;
      cameraRef.current.bottom = -fs / 2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      rendererRef.current?.dispose();
      if (container.contains(rendererRef.current?.domElement!)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;
      const progress = getProgress();

      // Calculate breath-based scale
      let breathScale = 1;
      switch (phase) {
        case "inhale":
          breathScale = 0.6 + progress * 0.6; // 0.6 -> 1.2
          break;
        case "holdIn":
          breathScale = 1.2;
          break;
        case "exhale":
          breathScale = 1.2 - progress * 0.6; // 1.2 -> 0.6
          break;
        case "holdOut":
          breathScale = 0.6;
          break;
      }

      // Update rings
      ringsRef.current.forEach((ring, i) => {
        const baseRadius = ring.userData.baseRadius;
        // Stagger wave effect
        const offset = i * 0.15;
        const waveScale = breathScale + Math.sin(time * 2 - offset) * 0.05;
        ring.scale.setScalar(waveScale);

        // Pulse opacity
        const mat = ring.material as THREE.LineBasicMaterial;
        const baseOpacity = 0.8 - i * 0.08;
        mat.opacity = baseOpacity * (0.7 + breathScale * 0.3);
      });

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [phase, phaseTime, pattern, isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[var(--color-bg)]"
    />
  );
}
```

**Test Requirements:**
- Manual test: Visual renders concentric white rings on dark background
- Manual test: Rings expand on inhale, contract on exhale
- Manual test: Animation runs at smooth 60fps

**Verification:**
- Visual renders concentric white rings on dark background
- Rings expand on inhale, contract on exhale
- Smooth animation at 60fps

---

### Step 11: Create Breathing Lotus Visual (NEW)

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingVisuals/BreathingLotus.tsx` (NEW)

**Concept:** Stylized lotus flower petals that open during inhale and close during exhale. Elegant, zen-like, organic movement.

**Implementation:**
```typescript
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";

const PETAL_COUNT = 8;
const LAYERS = 3;

function createPetalShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.15, 0.3, 0.08, 0.6);
  shape.quadraticCurveTo(0, 0.75, -0.08, 0.6);
  shape.quadraticCurveTo(-0.15, 0.3, 0, 0);
  return shape;
}

export default function BreathingLotus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern, isActive } = useBreathingStore();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const petalsRef = useRef<THREE.Mesh[][]>([]);

  const getProgress = () => {
    if (!isActive) return 0;
    const durations: Record<string, number> = {
      inhale: pattern.inhale,
      holdIn: pattern.holdIn,
      exhale: pattern.exhale,
      holdOut: pattern.holdOut,
    };
    const duration = durations[phase] || 1;
    return 1 - phaseTime / duration;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    cameraRef.current = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current.position.set(0, 2, 4);
    cameraRef.current.lookAt(0, 0, 0);

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    // Create petal layers
    const petalShape = createPetalShape();
    const allPetals: THREE.Mesh[][] = [];

    for (let layer = 0; layer < LAYERS; layer++) {
      const layerPetals: THREE.Mesh[] = [];
      const layerScale = 1 - layer * 0.2;
      const layerY = layer * 0.1;

      for (let i = 0; i < PETAL_COUNT; i++) {
        const geometry = new THREE.ShapeGeometry(petalShape);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9 - layer * 0.2,
          side: THREE.DoubleSide,
        });

        const petal = new THREE.Mesh(geometry, material);
        const angle = (i / PETAL_COUNT) * Math.PI * 2;
        petal.rotation.z = angle;
        petal.position.y = layerY;
        petal.scale.setScalar(layerScale);
        petal.userData = {
          angle,
          layer,
          baseRotationX: 0
        };

        layerPetals.push(petal);
        sceneRef.current.add(petal);
      }
      allPetals.push(layerPetals);
    }
    petalsRef.current = allPetals;

    // Center dot
    const dotGeo = new THREE.CircleGeometry(0.08, 32);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.rotation.x = -Math.PI / 2;
    sceneRef.current.add(dot);

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      allPetals.flat().forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      rendererRef.current?.dispose();
      if (container.contains(rendererRef.current?.domElement!)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;
      const progress = getProgress();

      // Calculate open amount (0 = closed, 1 = open)
      let openAmount = 0.3;
      switch (phase) {
        case "inhale":
          openAmount = 0.3 + progress * 0.7;
          break;
        case "holdIn":
          openAmount = 1.0;
          break;
        case "exhale":
          openAmount = 1.0 - progress * 0.7;
          break;
        case "holdOut":
          openAmount = 0.3;
          break;
      }

      // Animate petals
      petalsRef.current.forEach((layerPetals, layerIndex) => {
        layerPetals.forEach((petal) => {
          const { angle, layer } = petal.userData;
          // Tilt outward as flower opens
          const tiltAngle = openAmount * (Math.PI / 3) * (1 - layer * 0.15);
          petal.rotation.x = -tiltAngle;
          // Subtle breathing motion
          const breathOffset = Math.sin(time * 2 + angle) * 0.02 * openAmount;
          petal.rotation.x += breathOffset;
        });
      });

      // Slow rotation
      sceneRef.current!.rotation.y = time * 0.1;

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [phase, phaseTime, pattern, isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[var(--color-bg)]"
    />
  );
}
```

**Test Requirements:**
- Manual test: Lotus renders with multiple petal layers
- Manual test: Petals open outward on inhale, close on exhale
- Manual test: Test on Safari (ShapeGeometry can render differently)

**Verification:**
- Lotus renders with multiple petal layers
- Petals open outward on inhale
- Petals close on exhale
- Smooth, organic movement

---

### Step 12: Create Breathing Orb Visual (NEW)

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingVisuals/BreathingOrb.tsx` (NEW)

**Concept:** Central glowing orb with particle halo that expands/contracts. Minimal, meditative, similar to existing AuraBreathing but with subtle particle effects.

**Implementation:**
```typescript
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useBreathingStore } from "../../stores/breathingStore";

const PARTICLE_COUNT = 100;

export default function BreathingOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { phase, phaseTime, pattern, isActive } = useBreathingStore();

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlePositionsRef = useRef<Float32Array | null>(null);

  const getProgress = () => {
    if (!isActive) return 0;
    const durations: Record<string, number> = {
      inhale: pattern.inhale,
      holdIn: pattern.holdIn,
      exhale: pattern.exhale,
      holdOut: pattern.holdOut,
    };
    const duration = durations[phase] || 1;
    return 1 - phaseTime / duration;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    cameraRef.current = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    cameraRef.current.position.z = 5;

    sceneRef.current = new THREE.Scene();

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(rendererRef.current.domElement);

    // Central orb with glow effect
    const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    orbRef.current = new THREE.Mesh(orbGeometry, orbMaterial);
    sceneRef.current.add(orbRef.current);

    // Glow ring
    const ringGeometry = new THREE.RingGeometry(0.9, 1.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    sceneRef.current.add(ring);

    // Particles
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particlePositionsRef.current = positions;

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    particlesRef.current = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particlesRef.current);

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      rendererRef.current?.dispose();
      if (container.contains(rendererRef.current?.domElement!)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;
      const progress = getProgress();

      // Calculate breath scale
      let breathScale = 1;
      switch (phase) {
        case "inhale":
          breathScale = 0.7 + progress * 0.5;
          break;
        case "holdIn":
          breathScale = 1.2;
          break;
        case "exhale":
          breathScale = 1.2 - progress * 0.5;
          break;
        case "holdOut":
          breathScale = 0.7;
          break;
      }

      // Scale orb
      if (orbRef.current) {
        orbRef.current.scale.setScalar(breathScale);
        // Pulse opacity
        const orbMat = orbRef.current.material as THREE.MeshBasicMaterial;
        orbMat.opacity = 0.2 + breathScale * 0.15;
      }

      // Scale and rotate particles
      if (particlesRef.current) {
        particlesRef.current.scale.setScalar(breathScale);
        particlesRef.current.rotation.y = time * 0.1;
        particlesRef.current.rotation.x = time * 0.05;

        // Pulse particle opacity
        const pMat = particlesRef.current.material as THREE.PointsMaterial;
        pMat.opacity = 0.4 + breathScale * 0.2;
      }

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [phase, phaseTime, pattern, isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[var(--color-bg)]"
    />
  );
}
```

**Test Requirements:**
- Manual test: Orb with particle halo renders
- Manual test: Smooth breathing sync
- Manual test: Particles rotate gently

**Verification:**
- Orb with particle halo renders
- Smooth breathing sync
- Particles rotate gently

---

### Step 13: Create Breathing Visuals Index

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingVisuals/index.ts` (NEW)

**Implementation:**
```typescript
import { lazy } from "react";

export const breathingVisualComponents = {
  waves: lazy(() => import("./BreathingWaves")),
  lotus: lazy(() => import("./BreathingLotus")),
  orb: lazy(() => import("./BreathingOrb")),
};

export type BreathingVisualId = keyof typeof breathingVisualComponents;

export const BREATHING_VISUALS = [
  { id: "waves", nameKey: "breathing.visuals.waves" },
  { id: "lotus", nameKey: "breathing.visuals.lotus" },
  { id: "orb", nameKey: "breathing.visuals.orb" },
] as const;
```

**Test Requirements:**
- TypeScript compiles without errors
- All visuals accessible via lazy loading

**Verification:**
- Exports compile without errors
- All visuals accessible via lazy loading

---

### Step 14: Create Breathing Visual Selector

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingVisuals/BreathingVisualSelector.tsx` (NEW)

**Implementation:**
```typescript
import { useTranslation } from "react-i18next";
import { useBreathingStore } from "../../stores/breathingStore";
import { BREATHING_VISUALS } from "./index";

export default function BreathingVisualSelector() {
  const { t } = useTranslation();
  const { selectedVisual, setSelectedVisual, isActive } = useBreathingStore();

  if (isActive) return null;

  return (
    <div className="flex gap-2 justify-center">
      {BREATHING_VISUALS.map((visual) => (
        <button
          key={visual.id}
          onClick={() => setSelectedVisual(visual.id)}
          className={`
            px-4 py-2 rounded-xl transition-all duration-200
            text-sm tracking-wider
            ${
              selectedVisual === visual.id
                ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                : "bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
            }
          `}
        >
          {t(visual.nameKey)}
        </button>
      ))}
    </div>
  );
}
```

**Test Requirements:**
- Manual test: Renders 3 buttons for visual selection
- Manual test: Selected visual highlighted
- Manual test: Hidden when breathing is active

**Verification:**
- Renders 3 buttons for visual selection
- Selected visual highlighted
- Hidden when breathing is active

---

### Step 15: Rewrite Breathe Page with New Layout

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Breathe.tsx`

**Changes:**
Complete rewrite with:
1. Full viewport responsive visual area
2. Overlay controls (pattern selector, visual selector, start/stop)
3. Phase/timer display overlaid on visual
4. Minimal, clean layout

**Implementation:**
```typescript
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useBreathingTimer } from "../hooks/useBreathingTimer";
import { useBreathingStore } from "../stores/breathingStore";
import { BREATHING_PATTERNS, getPhaseKey } from "../components/BreathingGuide/patterns";
import { breathingVisualComponents, BREATHING_VISUALS } from "../components/BreathingVisuals";
import type { BreathingVisualId } from "../components/BreathingVisuals";

export default function Breathe() {
  const { t } = useTranslation();
  const {
    pattern,
    phase,
    phaseTime,
    cycleCount,
    isActive,
    setPattern,
    start,
    stop,
  } = useBreathingTimer();
  const { selectedVisual, setSelectedVisual } = useBreathingStore();

  const VisualComponent = breathingVisualComponents[selectedVisual as BreathingVisualId]
    || breathingVisualComponents.waves;

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[var(--color-bg)]">
      {/* Visual fills entire screen */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] animate-pulse" />
            </div>
          }
        >
          <VisualComponent />
        </Suspense>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="text-[var(--color-text-muted)] text-sm tracking-wider hover:text-[var(--color-text)] transition-colors"
        >
          &larr; {t("app.title")}
        </Link>
      </div>

      {/* Phase display (when active) */}
      {isActive && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <p className="text-3xl font-light tracking-[0.3em] uppercase text-[var(--color-text)]/80">
            {t(getPhaseKey(phase))}
          </p>
          <p className="text-6xl font-extralight mt-4 tabular-nums text-[var(--color-text)]">
            {phaseTime}
          </p>
        </div>
      )}

      {/* Cycle counter */}
      {cycleCount > 0 && (
        <p className="absolute top-4 right-4 z-10 text-sm text-[var(--color-text-muted)] tracking-wider">
          {cycleCount} {t("breathing.cycles")}
        </p>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-md mx-auto space-y-4">
          {/* Visual selector (when idle) */}
          {!isActive && (
            <div className="flex gap-2 justify-center mb-4">
              {BREATHING_VISUALS.map((visual) => (
                <button
                  key={visual.id}
                  onClick={() => setSelectedVisual(visual.id)}
                  className={`
                    px-3 py-1.5 rounded-lg transition-all duration-200
                    text-xs tracking-wider
                    ${
                      selectedVisual === visual.id
                        ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                        : "bg-[var(--color-surface)]/60 backdrop-blur-sm text-[var(--color-text-muted)]"
                    }
                  `}
                >
                  {t(visual.nameKey)}
                </button>
              ))}
            </div>
          )}

          {/* Pattern selector (when idle) */}
          {!isActive && (
            <div className="flex flex-wrap justify-center gap-2">
              {BREATHING_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`
                    px-4 py-2 rounded-2xl backdrop-blur-xl
                    border transition-all duration-200
                    text-sm tracking-wider
                    ${
                      pattern.id === p.id
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-bg)]"
                        : "bg-[var(--color-surface)]/40 border-[var(--color-border)]/50 text-[var(--color-text-muted)]"
                    }
                  `}
                >
                  {t(p.nameKey)}
                </button>
              ))}
            </div>
          )}

          {/* Start/Stop button */}
          <div className="flex justify-center pt-2">
            {!isActive ? (
              <button
                onClick={start}
                className="
                  w-16 h-16 rounded-full
                  bg-[var(--color-primary)] text-[var(--color-bg)]
                  flex items-center justify-center
                  shadow-lg shadow-black/20
                  hover:scale-105 transition-transform
                "
              >
                <svg
                  className="w-6 h-6 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={stop}
                className="
                  w-16 h-16 rounded-full
                  bg-[var(--color-surface)]/60 backdrop-blur-xl
                  border border-[var(--color-border)]
                  text-[var(--color-text)]
                  flex items-center justify-center
                  hover:bg-[var(--color-surface)] transition-colors
                "
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Test Requirements:**
- Manual test: Page fills entire viewport
- Manual test: Visual fills background
- Manual test: Controls overlay at bottom, phase text centered in upper third
- Manual test: No empty space, no overlap issues
- Manual test: Responsive on different screen sizes

**Verification:**
- Page fills entire viewport
- Visual fills background
- Controls overlay at bottom
- Phase text centered in upper third
- No empty space, no overlap issues
- Responsive on different screen sizes

---

### Step 16: Add i18n Keys for Breathing Visuals

**Files:** `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/en.json` and `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/ko.json`

**Changes:**
Add translation keys for the new breathing visuals. Note: Files are at `/i18n/en.json` NOT `/i18n/locales/en.json`.

**English (en.json):**
Add to the `breathing` object:
```json
{
  "breathing": {
    "visuals": {
      "waves": "Waves",
      "lotus": "Lotus",
      "orb": "Orb"
    }
  }
}
```

**Korean (ko.json):**
Add to the `breathing` object:
```json
{
  "breathing": {
    "visuals": {
      "waves": "파동",
      "lotus": "연꽃",
      "orb": "오브"
    }
  }
}
```

**Test Requirements:**
- Manual test: No i18n warnings in console
- Manual test: Correct labels show in both languages

**Verification:**
- No i18n warnings in console
- Correct labels show in both languages

---

## Dependencies

```
Step 1 -> Step 2 (audio hook must have pause/resume before Meditate uses them)
Step 5 -> Step 6 -> Step 7 (model -> register -> use in routes)
Step 7 -> Step 8 (backend endpoint before frontend fetches)
Step 9 -> Step 10-13 (store must have selectedVisual before visuals use it)
Step 10-13 -> Step 14 (visuals must exist before selector)
Step 9, 13, 14 -> Step 15 (all parts needed for Breathe page)
Step 15 -> Step 16 (i18n after page exists)

Independent steps (can run parallel):
- Steps 3, 4 (Settings audio fixes)
- Steps 5-8 (Discord persistence)
- Steps 9-16 (Breathe page)
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AudioContext suspend/resume not supported in older browsers | Audio doesn't pause | Fallback to fadeOutAll on pause |
| Three.js performance on low-end devices | Choppy animations | Reduce particle counts, limit to 30fps |
| ShapeGeometry not rendering lotus petals correctly | Visual broken | Test each visual independently, especially on Safari |
| Existing BreathingGuide tests break | CI fails | Update tests to mock new store fields |
| i18n keys missing | Console warnings | Verify all keys exist in both locales |
| Database migration needed for settings table | Startup errors | SQLModel auto-creates tables on init_db |

---

## Team Orchestration

### Team Lead Instructions

1. **Phase 1 (Parallel):** Assign Steps 1-2 to Builder A (audio fixes), Steps 3-4 to Builder B (Settings previews), Steps 5-8 to Builder C (Discord persistence)
2. **Phase 2 (Sequential):** After Phase 1 complete, assign Steps 9-16 to Builder A (Breathe page overhaul)
3. **Validation:** After each phase, Validator runs verification steps before proceeding

### Team Members

| Role | Assignment | Steps |
|------|------------|-------|
| Builder A | Audio + Breathe Page | 1-2, 9-16 |
| Builder B | Settings Previews | 3-4 |
| Builder C | Discord Persistence | 5-8 |
| Validator | All verification | Post-phase validation |

---

## Step by Step Tasks

| Task ID | Step | Dependencies | Assignment | Status |
|---------|------|--------------|------------|--------|
| T1 | Step 1: useAudioLayers pause/resume | None | Builder A | Pending |
| T2 | Step 2: Meditate audio lifecycle | T1 | Builder A | Pending |
| T3 | Step 3: Bell preview fix | None | Builder B | Pending |
| T4 | Step 4: Ambient preview fix | T3 | Builder B | Pending |
| T5 | Step 5: AppSetting model | None | Builder C | Pending |
| T6 | Step 6: Register model | T5 | Builder C | Pending |
| T7 | Step 7: Discord routes | T6 | Builder C | Pending |
| T8 | Step 8: Load webhook on mount | T7 | Builder C | Pending |
| T9 | Step 9: Breathing store visual | None | Builder A | Pending |
| T10 | Step 10: BreathingWaves | T9 | Builder A | Pending |
| T11 | Step 11: BreathingLotus | T9 | Builder A | Pending |
| T12 | Step 12: BreathingOrb | T9 | Builder A | Pending |
| T13 | Step 13: Visuals index | T10,T11,T12 | Builder A | Pending |
| T14 | Step 14: Visual selector | T13 | Builder A | Pending |
| T15 | Step 15: Breathe page rewrite | T9,T13,T14 | Builder A | Pending |
| T16 | Step 16: i18n keys | T15 | Builder A | Pending |
| V1 | Validate Phase 1 | T2,T4,T8 | Validator | Pending |
| V2 | Validate Phase 2 | T16 | Validator | Pending |
