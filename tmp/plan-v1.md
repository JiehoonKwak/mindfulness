# Mindfulness Web App - Implementation Plan v1

## Goal

Implement Phase 1-3 of the mindfulness meditation web app: Foundation (scaffolding, timer, API, i18n, themes), all 10 meditation visuals with parallel development, and breathing guide with Apple Watch-style animations.

## Requirements

1. **Phase 1 - Foundation**: Project scaffolding, timer, session CRUD API, i18n (ko/en), light/dark + 8 color themes
2. **Phase 2 - Visuals**: All 10 meditation visuals with their specific rendering techniques
3. **Phase 3 - Breathing Guide**: Standalone + timer-integrated modes with 4 patterns
4. **Tech Stack**: SQLModel (backend), Zustand (frontend state), Vite + React + Tailwind
5. **Deployment**: Local macOS via Tailscale, PWA-ready structure
6. **Constraints**: Must work on iOS Safari, Korean primary / English secondary

---

## Steps

### Step 1: Project Scaffolding (P1-001)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/config/config.yaml`
- **Changes**: Create Vite React project, backend directory structure, config file
- **Test Requirements**: `bun run dev` starts frontend; directory structure matches PLAN.md
- **Verification**: Dev server runs on port 5173, all directories exist

### Step 2: Backend Setup with FastAPI + SQLModel (P1-002)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/main.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/config.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/database.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/models/session.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/pyproject.toml`
- **Changes**: FastAPI app with CORS, SQLModel session model, database initialization
- **Test Requirements**: `GET /api/health` returns 200 with `{"status": "healthy"}`
- **Verification**: Server runs on port 8000, database file created

### Step 3: Frontend Setup with React + Tailwind + Router (P1-003)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/main.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/App.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/index.css`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/tailwind.config.js`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Home.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Settings.tsx`
- **Changes**: React Router setup, Tailwind config with CSS variables, placeholder pages
- **Test Requirements**: Routes `/`, `/meditate`, `/settings` render correct pages
- **Verification**: Tailwind classes apply, CSS variables work

### Step 4: i18n Setup for Korean + English (P1-004)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/index.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/ko.json`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/en.json`
- **Changes**: react-i18next configuration, Korean and English translation files
- **Test Requirements**: `t('app.title')` returns correct text for each language
- **Verification**: Language switch persists to localStorage, Korean displays correctly

### Step 5: Theme System with 8 Color Themes (P1-005)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/styles/themes.css`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/settingsStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/ThemeSwitcher.tsx`
- **Changes**: CSS variables for 8 themes (ocean, forest, sunset, midnight, aurora, sakura, sand, zen), Zustand settings store, theme switcher UI
- **Test Requirements**: `setTheme('sakura')` applies light mode; theme persists across reloads
- **Verification**: Smooth transitions between themes, light themes show correct text colors

### Step 6: Timer Component (P1-006)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/Timer.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/TimerControls.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/DurationPicker.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useTimer.ts`
- **Changes**: Zustand timer store, timer display with progress ring, controls, duration presets
- **Test Requirements**: Timer decrements by 1 each second; pause stops countdown; stop resets
- **Verification**: Progress ring animates smoothly, all controls work

### Step 7: Session API Integration (P1-007)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/routes/sessions.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/sessionStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/api/sessions.ts`
- **Changes**: Session CRUD endpoints, frontend API client, session store
- **Test Requirements**: POST creates session; PATCH updates; GET lists sessions
- **Verification**: Full session lifecycle works from frontend to database

### Step 8: Breathing Circle Visual (P2-001)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/BreathingCircle/BreathingCircle.tsx`
- **Changes**: CSS transform + scale animation with Framer Motion, 3 concentric circles
- **Test Requirements**: Animation triggers when isActive=true; speed prop affects rate
- **Verification**: Circle expands/contracts smoothly

### Step 9: Particle Flow Visual (P2-002)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ParticleFlow/ParticleFlow.tsx`
- **Changes**: Canvas + requestAnimationFrame, 100 drifting particles
- **Test Requirements**: Canvas renders; no memory leaks on unmount
- **Verification**: Particles drift smoothly, wrap around edges

### Step 10: Gradient Waves Visual (P2-003)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.css`
- **Changes**: CSS keyframe animations, 3 rotating gradient layers
- **Test Requirements**: CSS animation applies; stops when isActive=false
- **Verification**: Waves rotate smoothly, no jank on mobile

### Step 11: Aurora Visual with WebGL Fallback (P2-004)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/Aurora.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/AuroraFallback.tsx`
- **Changes**: WebGL shader implementation, Canvas fallback for iOS Safari
- **Test Requirements**: `isWebGLSupported()` correctly detects support; fallback renders
- **Verification**: Works on desktop Chrome/Safari; fallback activates on iOS Safari if needed

### Step 12: Mandala Visual (P2-005)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Mandala/Mandala.tsx`
- **Changes**: SVG animation with Framer Motion, 6 layers of rotating petals
- **Test Requirements**: SVG renders correctly; all layers animate
- **Verification**: Mandala rotates with multiple layers at different speeds

### Step 13: Cosmic Dust Visual (P2-006)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/CosmicDust/CosmicDust.tsx`
- **Changes**: Canvas particles with radial gradient glow effects
- **Test Requirements**: Canvas renders stars; animation is smooth at 60fps
- **Verification**: Stars twinkle with glow effect, slow downward drift

### Step 14: Zen Garden Visual (P2-007)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ZenGarden/ZenGarden.tsx`
- **Changes**: SVG paths with animated stroke, sand ripple effect
- **Test Requirements**: SVG paths animate; performance is good on mobile
- **Verification**: Sand ripples animate smoothly, minimalist aesthetic

### Step 15: Liquid Metal Visual (P2-008)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/LiquidMetal/LiquidMetal.tsx`
- **Changes**: Metaball algorithm with Canvas, reduced particle count on mobile
- **Test Requirements**: Canvas renders; no frame drops on mobile
- **Verification**: Balls merge with metaball effect, metallic gradient visible

### Step 16: Sacred Geometry Visual (P2-009)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/SacredGeometry/SacredGeometry.tsx`
- **Changes**: SVG morph animation, Flower of Life pattern
- **Test Requirements**: SVG renders correctly; animation is smooth
- **Verification**: Gentle pulsing animation, slow rotation

### Step 17: Ocean Depth Visual (P2-010)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/OceanDepth/OceanDepth.tsx`
- **Changes**: Canvas with radial gradient glow for bioluminescence effect
- **Test Requirements**: Canvas renders; glow effects visible
- **Verification**: Organisms glow and pulse, deep ocean atmosphere

### Step 18: Visual Selector Component (P2-011)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/VisualSelector.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/index.ts`
- **Changes**: Grid of visual options, lazy loading for all 10 visuals
- **Test Requirements**: Clicking visual updates store; lazy loaded components render
- **Verification**: All 10 visuals selectable, selected visual highlighted

### Step 19: Breathing Pattern Engine (P3-001)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/patterns.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useBreathingTimer.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/breathingStore.ts`
- **Changes**: Pattern definitions (4-7-8, box, calming, energizing), phase state machine, cycle counter
- **Test Requirements**: Box breathing: 4-4-4-4 timing; phases with 0 duration skipped
- **Verification**: Pattern timing is accurate, cycle counter increments

### Step 20: Flower Animation - Apple Watch Style (P3-002)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/FlowerAnimation.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/FlowerAnimation.css`
- **Changes**: 6 petal circles with mix-blend-mode: screen, expand/contract with breathing
- **Test Requirements**: Animation syncs with breathing phase; CSS variables set duration
- **Verification**: Petals expand on inhale, contract on exhale, overlapping glow effect

### Step 21: Circle Animation - Simple Alternative (P3-003)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/CircleAnimation.tsx`
- **Changes**: Framer Motion scale animation, concentric circles
- **Test Requirements**: Scale updates each second; animation is smooth
- **Verification**: Circle grows/shrinks with breathing phases

### Step 22: Standalone Breathing Mode (P3-004)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/BreathingGuide.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Breathe.tsx`
- **Changes**: Breathing guide component with pattern selector, standalone page at /breathe
- **Test Requirements**: All 4 patterns selectable; start/stop controls work
- **Verification**: Phase text updates in real-time, cycle counter increments

### Step 23: Timer Integration for Breathing (P3-005)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts`
- **Changes**: Breathing toggle in timer settings, breathing overlay during meditation
- **Test Requirements**: Enabling breathing shows guide during meditation; pause/resume syncs
- **Verification**: Visual plays behind breathing guide, both sync with timer

---

## Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `frontend/package.json` | Create | Dependencies: react, zustand, framer-motion, react-i18next, tailwindcss |
| `frontend/src/main.tsx` | Create | App entry with i18n provider |
| `frontend/src/App.tsx` | Create | Router setup, theme provider |
| `frontend/src/stores/timerStore.ts` | Create | Zustand store for timer state |
| `frontend/src/stores/settingsStore.ts` | Create | Theme, language, preferences |
| `frontend/src/stores/sessionStore.ts` | Create | Current session state |
| `frontend/src/i18n/ko.json` | Create | Korean translations |
| `frontend/src/i18n/en.json` | Create | English translations |
| `frontend/src/i18n/index.ts` | Create | i18next configuration |
| `frontend/src/styles/themes.css` | Create | CSS variables for 8 themes |
| `frontend/src/components/Timer/*` | Create | Timer component suite |
| `frontend/src/components/Visuals/*` | Create | 10 visual components |
| `frontend/src/components/BreathingGuide/*` | Create | Breathing guide suite |
| `frontend/src/pages/Home.tsx` | Create | Dashboard page |
| `frontend/src/pages/Meditate.tsx` | Create | Meditation session page |
| `frontend/src/pages/Settings.tsx` | Create | Settings page |
| `backend/app/main.py` | Create | FastAPI app with CORS |
| `backend/app/models/session.py` | Create | SQLModel session model |
| `backend/app/routes/sessions.py` | Create | Session CRUD endpoints |
| `backend/app/config.py` | Create | YAML config loader |
| `config/config.yaml` | Create | App configuration |

---

## Dependencies

```
Phase 1 Foundation (Sequential):
  1.1 Project Scaffolding
    ├── 1.2 Backend Setup (depends on 1.1)
    ├── 1.3 Frontend Setup (depends on 1.1)
    │     ├── 1.4 i18n Setup (depends on 1.3)
    │     └── 1.5 Theme System (depends on 1.3)
    └── 1.6 Timer Component (depends on 1.3, 1.2)
        └── 1.7 Session API Integration (depends on 1.6, 1.2)

Phase 2 Visuals (Parallel after 1.5):
  All 10 visuals can be developed in parallel
  2.11 Visual Selector depends on at least 3 visuals complete

Phase 3 Breathing (After 1.6):
  3.1 Pattern Engine (depends on 1.6)
    ├── 3.2 Flower Animation (depends on 3.1)
    ├── 3.3 Circle Animation (depends on 3.1)
    └── 3.4 Standalone Mode (depends on 3.1)
  3.5 Timer Integration (depends on 3.1, 1.6)
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebGL on iOS Safari | Aurora visual may fail | Implement Canvas fallback, detect WebGL support |
| Metaball performance | Liquid Metal heavy on mobile | Use Web Worker, reduce particle count on mobile |
| Zustand + i18n re-renders | UI flicker on language change | Use shallow selectors, memoize components |
| Audio on iOS | Requires user gesture | Show "tap to enable audio" overlay on first load |
| 10 visuals scope creep | Delays delivery | Prioritize Core 3 first, then expand |

---

## Team Orchestration

### Team Lead Instructions

1. **Kick off Phase 1** sequentially - scaffolding must complete before other work
2. **After 1.5 completes** (Theme System), assign all 10 visuals to Builder agents in parallel
3. **After 1.6 completes** (Timer), start Phase 3 Breathing Guide
4. **Validator** runs after each component completes
5. **Final integration** test after all phases complete

### Parallel Workstreams

```
Workstream A (Foundation):
  Builder-A: 1.1 -> 1.2 -> 1.6 -> 1.7

Workstream B (Frontend Core):
  Builder-B: 1.3 -> 1.4 -> 1.5

Workstream C (Visuals - after 1.5):
  Builder-C1: 2.1 Breathing Circle, 2.4 Aurora, 2.7 Zen Garden
  Builder-C2: 2.2 Particle Flow, 2.5 Mandala, 2.8 Liquid Metal
  Builder-C3: 2.3 Gradient Waves, 2.6 Cosmic Dust, 2.9 Sacred Geometry, 2.10 Ocean Depth

Workstream D (Breathing - after 1.6):
  Builder-D: 3.1 -> 3.2 -> 3.3 -> 3.4 -> 3.5
```

---

## Team Members

| Role | Assignment | Skills Required |
|------|------------|-----------------|
| Builder-A | Backend + Timer | FastAPI, SQLModel, Python |
| Builder-B | Frontend Core | React, Zustand, i18n, CSS |
| Builder-C1 | Visuals (CSS/WebGL) | CSS animations, WebGL/GLSL |
| Builder-C2 | Visuals (Canvas) | Canvas API, requestAnimationFrame |
| Builder-C3 | Visuals (SVG/Canvas) | SVG animation, Canvas |
| Builder-D | Breathing Guide | Framer Motion, CSS, timing |
| Validator | Testing | Jest, Playwright, iOS Safari |

---

## Step by Step Tasks

### Phase 1: Foundation

#### Task 1.1: Project Scaffolding
- **ID**: P1-001
- **Dependencies**: None
- **Assigned**: Builder-A
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/` (create via Vite)
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/` (create structure)
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/config/config.yaml`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/sounds/bells/.gitkeep`

**Actions**:
```bash
# Frontend scaffolding
cd /Users/jiehoonk/DevHub/sideprojects/mindfulness
bun create vite frontend --template react-ts
cd frontend
bun add zustand framer-motion react-i18next i18next react-router-dom
bun add -d tailwindcss postcss autoprefixer @types/node
bunx tailwindcss init -p

# Backend scaffolding
mkdir -p backend/app/{routes,models,services}
mkdir -p backend/data
mkdir -p config sounds/bells sounds/ambient
```

**Verification**:
- `bun run dev` starts frontend on port 5173
- Directory structure matches PLAN.md
- `config/config.yaml` exists with basic structure

**Test Requirements**:
- Frontend dev server starts without errors
- Backend directory structure is correct

---

#### Task 1.2: Backend Setup (FastAPI + SQLModel)
- **ID**: P1-002
- **Dependencies**: P1-001
- **Assigned**: Builder-A
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/main.py`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/config.py`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/database.py`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/models/session.py`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/pyproject.toml`

**Actions**:

Create `backend/pyproject.toml`:
```toml
[project]
name = "mindfulness-backend"
version = "0.1.0"
dependencies = [
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
    "sqlmodel>=0.0.14",
    "pyyaml>=6.0",
    "python-multipart>=0.0.6",
]

[project.optional-dependencies]
dev = ["pytest>=8.0.0", "httpx>=0.26.0"]
```

Create `backend/app/config.py`:
```python
from pathlib import Path
from functools import lru_cache
import yaml

CONFIG_PATH = Path(__file__).parent.parent.parent / "config" / "config.yaml"

@lru_cache
def get_config() -> dict:
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)
```

Create `backend/app/database.py`:
```python
from sqlmodel import SQLModel, Session, create_engine
from typing import Annotated
from fastapi import Depends

DATABASE_URL = "sqlite:///./backend/data/mindfulness.db"
engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
```

Create `backend/app/models/session.py`:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class SessionBase(SQLModel):
    planned_duration_seconds: int
    visual_type: Optional[str] = None
    bell_sound: Optional[str] = None

class Session(SessionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    actual_duration_seconds: Optional[int] = None
    completed: bool = False
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SessionCreate(SessionBase):
    pass

class SessionUpdate(SQLModel):
    ended_at: Optional[datetime] = None
    actual_duration_seconds: Optional[int] = None
    completed: Optional[bool] = None
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    note: Optional[str] = None

class SessionRead(SessionBase):
    id: int
    started_at: datetime
    ended_at: Optional[datetime]
    actual_duration_seconds: Optional[int]
    completed: bool
```

Create `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import init_db
from .config import get_config

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Mindfulness API", lifespan=lifespan)

config = get_config()
origins = config.get("server", {}).get("cors_origins", ["http://localhost:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
```

**Verification**:
- `uv run uvicorn backend.app.main:app --reload` starts on port 8000
- `GET /api/health` returns `{"status": "healthy"}`
- Database file created at `backend/data/mindfulness.db`

**Test Requirements**:
```python
# backend/tests/test_health.py
def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

---

#### Task 1.3: Frontend Setup (React + Tailwind + Router)
- **ID**: P1-003
- **Dependencies**: P1-001
- **Assigned**: Builder-B
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/main.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/App.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/index.css`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/tailwind.config.js`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Home.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Settings.tsx`

**Actions**:

Update `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        background: 'var(--color-bg)',
      },
    },
  },
  plugins: [],
}
```

Update `frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-primary: #4ecdc4;
  --color-accent: #ff6b9d;
  --color-text: #ffffff;
  --color-text-muted: #a0a0a0;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, sans-serif;
}
```

Create `frontend/src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Meditate from './pages/Meditate';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

Create placeholder pages (`Home.tsx`, `Meditate.tsx`, `Settings.tsx`):
```tsx
// frontend/src/pages/Home.tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Mindfulness</h1>
      <a href="/meditate" className="bg-primary px-8 py-4 rounded-full text-lg">
        Start Meditation
      </a>
    </div>
  );
}
```

**Verification**:
- Routes work: `/`, `/meditate`, `/settings`
- Tailwind classes apply correctly
- CSS variables work for theming

**Test Requirements**:
- Router renders correct page for each route
- Tailwind classes compile without errors

---

#### Task 1.4: i18n Setup (Korean + English)
- **ID**: P1-004
- **Dependencies**: P1-003
- **Assigned**: Builder-B
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/index.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/ko.json`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/en.json`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/main.tsx` (update)

**Actions**:

Create `frontend/src/i18n/index.ts`:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './ko.json';
import en from './en.json';

const savedLang = localStorage.getItem('language') || 'ko';

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
```

Create `frontend/src/i18n/ko.json`:
```json
{
  "app": {
    "title": "마음챙김",
    "tagline": "매일의 명상 습관"
  },
  "home": {
    "startMeditation": "명상 시작",
    "settings": "설정",
    "todayGoal": "오늘의 목표"
  },
  "timer": {
    "minutes": "분",
    "start": "시작",
    "pause": "일시정지",
    "resume": "계속",
    "stop": "종료",
    "complete": "완료!"
  },
  "breathing": {
    "inhale": "들이쉬세요",
    "hold": "멈추세요",
    "exhale": "내쉬세요",
    "cycles": "사이클",
    "patterns": {
      "478": "4-7-8 릴렉싱",
      "box": "박스 브리딩",
      "calming": "카밍 브레스",
      "energizing": "에너자이징"
    }
  },
  "visuals": {
    "breathingCircle": "호흡 원",
    "particleFlow": "파티클 흐름",
    "gradientWaves": "그라데이션 물결",
    "aurora": "오로라",
    "mandala": "만다라",
    "cosmicDust": "우주 먼지",
    "zenGarden": "선 정원",
    "liquidMetal": "리퀴드 메탈",
    "sacredGeometry": "신성 기하학",
    "oceanDepth": "심해"
  },
  "settings": {
    "title": "설정",
    "language": "언어",
    "theme": "테마",
    "darkMode": "다크 모드",
    "lightMode": "라이트 모드"
  },
  "themes": {
    "ocean": "오션",
    "forest": "포레스트",
    "sunset": "선셋",
    "midnight": "미드나잇",
    "sakura": "사쿠라",
    "sand": "샌드",
    "aurora": "오로라",
    "zen": "젠"
  }
}
```

Create `frontend/src/i18n/en.json`:
```json
{
  "app": {
    "title": "Mindfulness",
    "tagline": "Daily meditation habit"
  },
  "home": {
    "startMeditation": "Start Meditation",
    "settings": "Settings",
    "todayGoal": "Today's Goal"
  },
  "timer": {
    "minutes": "min",
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "complete": "Complete!"
  },
  "breathing": {
    "inhale": "Breathe in",
    "hold": "Hold",
    "exhale": "Breathe out",
    "cycles": "cycles",
    "patterns": {
      "478": "4-7-8 Relaxing",
      "box": "Box Breathing",
      "calming": "Calming Breath",
      "energizing": "Energizing"
    }
  },
  "visuals": {
    "breathingCircle": "Breathing Circle",
    "particleFlow": "Particle Flow",
    "gradientWaves": "Gradient Waves",
    "aurora": "Aurora",
    "mandala": "Mandala",
    "cosmicDust": "Cosmic Dust",
    "zenGarden": "Zen Garden",
    "liquidMetal": "Liquid Metal",
    "sacredGeometry": "Sacred Geometry",
    "oceanDepth": "Ocean Depth"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode"
  },
  "themes": {
    "ocean": "Ocean",
    "forest": "Forest",
    "sunset": "Sunset",
    "midnight": "Midnight",
    "sakura": "Sakura",
    "sand": "Sand",
    "aurora": "Aurora",
    "zen": "Zen"
  }
}
```

Update `frontend/src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Verification**:
- `useTranslation()` hook works in components
- Language switch persists to localStorage
- Korean displays correctly (no encoding issues)

**Test Requirements**:
- `t('app.title')` returns "마음챙김" when lang=ko
- `t('app.title')` returns "Mindfulness" when lang=en
- Language persists after page reload

---

#### Task 1.5: Theme System (Light/Dark + 8 Color Themes)
- **ID**: P1-005
- **Dependencies**: P1-003
- **Assigned**: Builder-B
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/styles/themes.css`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/settingsStore.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/ThemeSwitcher.tsx`

**Actions**:

Create `frontend/src/styles/themes.css`:
```css
/* Base dark mode (default) */
:root {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-primary: #4ecdc4;
  --color-accent: #ff6b9d;
  --color-text: #ffffff;
  --color-text-muted: #a0a0a0;
  --color-border: #2a2a4a;
}

/* Ocean (Dark) - Default */
[data-theme="ocean"] {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-primary: #4ecdc4;
  --color-accent: #ff6b9d;
}

/* Forest (Dark) */
[data-theme="forest"] {
  --color-bg: #1a2e1a;
  --color-surface: #1e3d1e;
  --color-primary: #7cb342;
  --color-accent: #aed581;
}

/* Sunset (Dark) */
[data-theme="sunset"] {
  --color-bg: #2d1b4e;
  --color-surface: #3d2a5e;
  --color-primary: #ff6b35;
  --color-accent: #f7b731;
}

/* Midnight (Dark - OLED) */
[data-theme="midnight"] {
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-primary: #c0c0c0;
  --color-accent: #808080;
}

/* Aurora (Dark) */
[data-theme="aurora"] {
  --color-bg: #0f0f23;
  --color-surface: #1a1a3e;
  --color-primary: #00d4aa;
  --color-accent: #7c3aed;
}

/* Sakura (Light) */
[data-theme="sakura"] {
  --color-bg: #fff5f5;
  --color-surface: #ffffff;
  --color-primary: #ff69b4;
  --color-accent: #db7093;
  --color-text: #4a4a4a;
  --color-text-muted: #888888;
}

/* Sand (Light) */
[data-theme="sand"] {
  --color-bg: #f5f0e6;
  --color-surface: #ffffff;
  --color-primary: #c67c4e;
  --color-accent: #8b5a2b;
  --color-text: #4a4a4a;
  --color-text-muted: #888888;
}

/* Zen (Light) */
[data-theme="zen"] {
  --color-bg: #fafaf9;
  --color-surface: #ffffff;
  --color-primary: #1a1a1a;
  --color-accent: #4a4a4a;
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
}

/* Theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

Create `frontend/src/stores/settingsStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeId = 'ocean' | 'forest' | 'sunset' | 'midnight' | 'aurora' | 'sakura' | 'sand' | 'zen';
type Language = 'ko' | 'en';

interface SettingsState {
  theme: ThemeId;
  language: Language;
  setTheme: (theme: ThemeId) => void;
  setLanguage: (language: Language) => void;
}

const LIGHT_THEMES: ThemeId[] = ['sakura', 'sand', 'zen'];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'ocean',
      language: 'ko',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', !LIGHT_THEMES.includes(theme));
        set({ theme });
      },
      setLanguage: (language) => {
        localStorage.setItem('language', language);
        set({ language });
      },
    }),
    { name: 'mindfulness-settings' }
  )
);

// Initialize theme on load
const initTheme = () => {
  const stored = localStorage.getItem('mindfulness-settings');
  if (stored) {
    const { state } = JSON.parse(stored);
    document.documentElement.setAttribute('data-theme', state.theme || 'ocean');
    document.documentElement.classList.toggle('dark', !LIGHT_THEMES.includes(state.theme));
  }
};
initTheme();
```

Create `frontend/src/components/ThemeSwitcher.tsx`:
```tsx
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from 'react-i18next';

const themes = [
  { id: 'ocean', mode: 'dark' },
  { id: 'forest', mode: 'dark' },
  { id: 'sunset', mode: 'dark' },
  { id: 'midnight', mode: 'dark' },
  { id: 'aurora', mode: 'dark' },
  { id: 'sakura', mode: 'light' },
  { id: 'sand', mode: 'light' },
  { id: 'zen', mode: 'light' },
] as const;

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="grid grid-cols-4 gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`p-3 rounded-lg border-2 ${
            theme === t.id ? 'border-primary' : 'border-transparent'
          }`}
          data-theme={t.id}
        >
          <div className="w-8 h-8 rounded-full bg-primary mx-auto" />
          <span className="text-xs mt-1 block">{t.id}</span>
        </button>
      ))}
    </div>
  );
}
```

**Verification**:
- Theme changes apply immediately
- Theme persists across page reloads
- Light themes show correct text colors
- Smooth transitions between themes

**Test Requirements**:
- `setTheme('sakura')` applies light mode
- `setTheme('ocean')` applies dark mode
- Theme persists in localStorage

---

#### Task 1.6: Timer Component
- **ID**: P1-006
- **Dependencies**: P1-003, P1-004
- **Assigned**: Builder-A
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/Timer.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/TimerControls.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/DurationPicker.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useTimer.ts`

**Actions**:

Create `frontend/src/stores/timerStore.ts`:
```typescript
import { create } from 'zustand';

type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';

interface TimerState {
  duration: number; // seconds
  remaining: number; // seconds
  status: TimerStatus;
  selectedVisual: string;
  setDuration: (minutes: number) => void;
  setSelectedVisual: (visual: string) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  complete: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  duration: 600, // 10 minutes default
  remaining: 600,
  status: 'idle',
  selectedVisual: 'breathingCircle',

  setDuration: (minutes) => set({
    duration: minutes * 60,
    remaining: minutes * 60
  }),

  setSelectedVisual: (visual) => set({ selectedVisual: visual }),

  start: () => set({ status: 'running' }),

  pause: () => set({ status: 'paused' }),

  resume: () => set({ status: 'running' }),

  stop: () => set((state) => ({
    status: 'idle',
    remaining: state.duration
  })),

  tick: () => {
    const { remaining, status } = get();
    if (status === 'running' && remaining > 0) {
      set({ remaining: remaining - 1 });
    } else if (remaining === 0) {
      get().complete();
    }
  },

  complete: () => set({ status: 'complete' }),
}));
```

Create `frontend/src/hooks/useTimer.ts`:
```typescript
import { useEffect, useRef } from 'react';
import { useTimerStore } from '../stores/timerStore';

export function useTimer() {
  const { status, tick } = useTimerStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  return useTimerStore();
}
```

Create `frontend/src/components/Timer/Timer.tsx`:
```tsx
import { useTimer } from '../../hooks/useTimer';
import TimerControls from './TimerControls';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Timer() {
  const { remaining, duration, status } = useTimer();
  const progress = ((duration - remaining) / duration) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Progress Ring */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128" cy="128" r="120"
            stroke="var(--color-surface)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128" cy="128" r="120"
            stroke="var(--color-primary)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-light">{formatTime(remaining)}</span>
        </div>
      </div>

      <TimerControls />
    </div>
  );
}
```

Create `frontend/src/components/Timer/TimerControls.tsx`:
```tsx
import { useTimer } from '../../hooks/useTimer';
import { useTranslation } from 'react-i18next';

export default function TimerControls() {
  const { t } = useTranslation();
  const { status, start, pause, resume, stop } = useTimer();

  return (
    <div className="flex gap-4 mt-8">
      {status === 'idle' && (
        <button
          onClick={start}
          className="bg-primary text-white px-8 py-3 rounded-full text-lg"
        >
          {t('timer.start')}
        </button>
      )}

      {status === 'running' && (
        <>
          <button
            onClick={pause}
            className="bg-surface border border-primary px-6 py-3 rounded-full"
          >
            {t('timer.pause')}
          </button>
          <button
            onClick={stop}
            className="bg-surface border border-red-500 text-red-500 px-6 py-3 rounded-full"
          >
            {t('timer.stop')}
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <button
            onClick={resume}
            className="bg-primary text-white px-6 py-3 rounded-full"
          >
            {t('timer.resume')}
          </button>
          <button
            onClick={stop}
            className="bg-surface border border-red-500 text-red-500 px-6 py-3 rounded-full"
          >
            {t('timer.stop')}
          </button>
        </>
      )}

      {status === 'complete' && (
        <div className="text-2xl text-primary">{t('timer.complete')}</div>
      )}
    </div>
  );
}
```

Create `frontend/src/components/Timer/DurationPicker.tsx`:
```tsx
import { useTimerStore } from '../../stores/timerStore';
import { useTranslation } from 'react-i18next';

const PRESETS = [3, 5, 10, 12, 15, 20, 30, 45, 60];

export default function DurationPicker() {
  const { t } = useTranslation();
  const { duration, setDuration, status } = useTimerStore();
  const currentMinutes = duration / 60;

  if (status !== 'idle') return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {PRESETS.map((mins) => (
        <button
          key={mins}
          onClick={() => setDuration(mins)}
          className={`px-4 py-2 rounded-full ${
            currentMinutes === mins
              ? 'bg-primary text-white'
              : 'bg-surface border border-border'
          }`}
        >
          {mins} {t('timer.minutes')}
        </button>
      ))}
    </div>
  );
}
```

**Verification**:
- Timer counts down accurately
- Start/Pause/Resume/Stop all work
- Progress ring animates smoothly
- Duration presets change timer

**Test Requirements**:
- Timer decrements by 1 each second
- Pause stops the countdown
- Stop resets to initial duration
- Complete status triggers at 0

---

#### Task 1.7: Session API Integration
- **ID**: P1-007
- **Dependencies**: P1-002, P1-006
- **Assigned**: Builder-A
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/routes/sessions.py`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/main.py` (update)
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/sessionStore.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/api/sessions.ts`

**Actions**:

Create `backend/app/routes/sessions.py`:
```python
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from ..database import SessionDep
from ..models.session import Session, SessionCreate, SessionUpdate, SessionRead
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("/", response_model=SessionRead)
def create_session(session: SessionCreate, db: SessionDep):
    db_session = Session.model_validate(session)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/", response_model=List[SessionRead])
def list_sessions(db: SessionDep, limit: int = 50, offset: int = 0):
    sessions = db.exec(
        select(Session).order_by(Session.started_at.desc()).offset(offset).limit(limit)
    ).all()
    return sessions

@router.get("/{session_id}", response_model=SessionRead)
def get_session(session_id: int, db: SessionDep):
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.patch("/{session_id}", response_model=SessionRead)
def update_session(session_id: int, session_update: SessionUpdate, db: SessionDep):
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_data = session_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(session, key, value)

    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.delete("/{session_id}")
def delete_session(session_id: int, db: SessionDep):
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"ok": True}
```

Update `backend/app/main.py` to include router:
```python
# Add import
from .routes import sessions

# Add router after app creation
app.include_router(sessions.router)
```

Create `frontend/src/api/sessions.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSession(id: number, data: SessionUpdate): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listSessions(): Promise<Session[]> {
  const res = await fetch(`${API_BASE}/api/sessions/`);
  return res.json();
}
```

Create `frontend/src/stores/sessionStore.ts`:
```typescript
import { create } from 'zustand';
import * as api from '../api/sessions';

interface SessionState {
  currentSessionId: number | null;
  isLoading: boolean;
  startSession: (duration: number, visual: string) => Promise<void>;
  completeSession: (actualDuration: number) => Promise<void>;
  abandonSession: (actualDuration: number) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSessionId: null,
  isLoading: false,

  startSession: async (duration, visual) => {
    set({ isLoading: true });
    const session = await api.createSession({
      planned_duration_seconds: duration,
      visual_type: visual,
    });
    set({ currentSessionId: session.id, isLoading: false });
  },

  completeSession: async (actualDuration) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    set({ isLoading: true });
    await api.updateSession(currentSessionId, {
      completed: true,
      actual_duration_seconds: actualDuration,
      ended_at: new Date().toISOString(),
    });
    set({ currentSessionId: null, isLoading: false });
  },

  abandonSession: async (actualDuration) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    set({ isLoading: true });
    await api.updateSession(currentSessionId, {
      completed: false,
      actual_duration_seconds: actualDuration,
      ended_at: new Date().toISOString(),
    });
    set({ currentSessionId: null, isLoading: false });
  },
}));
```

**Verification**:
- POST /api/sessions/ creates a session in DB
- PATCH /api/sessions/{id} updates session
- GET /api/sessions/ returns list
- Frontend stores track session lifecycle

**Test Requirements**:
```python
# backend/tests/test_sessions.py
def test_create_session(client):
    response = client.post("/api/sessions/", json={
        "planned_duration_seconds": 600,
        "visual_type": "breathingCircle"
    })
    assert response.status_code == 200
    assert response.json()["planned_duration_seconds"] == 600

def test_complete_session(client):
    # Create then complete
    create_res = client.post("/api/sessions/", json={"planned_duration_seconds": 300})
    session_id = create_res.json()["id"]

    update_res = client.patch(f"/api/sessions/{session_id}", json={
        "completed": True,
        "actual_duration_seconds": 300
    })
    assert update_res.json()["completed"] == True
```

---

### Phase 2: Visuals (Parallel Development)

All visuals share common interface:

```typescript
// frontend/src/components/Visuals/types.ts
export interface VisualProps {
  isActive: boolean;
  speed?: number; // 0.5 - 2.0, default 1.0
  theme?: 'light' | 'dark';
}
```

#### Task 2.1: Breathing Circle Visual
- **ID**: P2-001
- **Dependencies**: P1-005
- **Assigned**: Builder-C1
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/BreathingCircle/BreathingCircle.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/BreathingCircle/index.ts`

**Technique**: CSS transform + scale with Framer Motion

**Actions**:
```tsx
// frontend/src/components/Visuals/BreathingCircle/BreathingCircle.tsx
import { motion } from 'framer-motion';
import { VisualProps } from '../types';

export default function BreathingCircle({ isActive, speed = 1 }: VisualProps) {
  const duration = 8 / speed; // 8 seconds base cycle

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="w-48 h-48 rounded-full bg-primary/30 blur-xl"
        animate={isActive ? {
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-primary/50"
        animate={isActive ? {
          scale: [1, 1.4, 1],
        } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-primary"
        animate={isActive ? {
          scale: [1, 1.3, 1],
        } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
```

**Verification**:
- Circle expands/contracts smoothly
- Speed prop affects animation rate
- Stops when isActive=false

**Test Requirements**:
- Renders without errors
- Animation triggers when isActive=true

---

#### Task 2.2: Particle Flow Visual
- **ID**: P2-002
- **Dependencies**: P1-005
- **Assigned**: Builder-C2
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ParticleFlow/ParticleFlow.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ParticleFlow/useParticles.ts`

**Technique**: Canvas + requestAnimationFrame

**Actions**:
```tsx
// frontend/src/components/Visuals/ParticleFlow/ParticleFlow.tsx
import { useRef, useEffect } from 'react';
import { VisualProps } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export default function ParticleFlow({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary').trim();

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${primaryColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
```

**Verification**:
- Particles drift smoothly
- Responsive to canvas resize
- Speed prop affects velocity
- Particles wrap around edges

**Test Requirements**:
- Canvas renders
- No memory leaks (cleanup on unmount)

---

#### Task 2.3: Gradient Waves Visual
- **ID**: P2-003
- **Dependencies**: P1-005
- **Assigned**: Builder-C3
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.css`

**Technique**: CSS animation + keyframes

**Actions**:
```tsx
// frontend/src/components/Visuals/GradientWaves/GradientWaves.tsx
import { VisualProps } from '../types';
import './GradientWaves.css';

export default function GradientWaves({ isActive, speed = 1 }: VisualProps) {
  const animationDuration = `${20 / speed}s`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`gradient-wave wave-1 ${isActive ? 'animate' : ''}`}
        style={{ animationDuration }}
      />
      <div
        className={`gradient-wave wave-2 ${isActive ? 'animate' : ''}`}
        style={{ animationDuration }}
      />
      <div
        className={`gradient-wave wave-3 ${isActive ? 'animate' : ''}`}
        style={{ animationDuration }}
      />
    </div>
  );
}
```

```css
/* frontend/src/components/Visuals/GradientWaves/GradientWaves.css */
.gradient-wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  opacity: 0.5;
  border-radius: 40%;
}

.wave-1 {
  background: linear-gradient(
    45deg,
    var(--color-primary) 0%,
    var(--color-accent) 50%,
    var(--color-primary) 100%
  );
}

.wave-2 {
  background: linear-gradient(
    135deg,
    var(--color-accent) 0%,
    var(--color-primary) 50%,
    var(--color-accent) 100%
  );
  animation-delay: -5s;
}

.wave-3 {
  background: linear-gradient(
    225deg,
    var(--color-primary) 0%,
    transparent 50%,
    var(--color-accent) 100%
  );
  animation-delay: -10s;
}

.gradient-wave.animate {
  animation: wave-rotate linear infinite;
}

@keyframes wave-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Verification**:
- Waves rotate smoothly
- Colors match theme
- No jank on mobile

**Test Requirements**:
- CSS animation applies
- Stops when isActive=false

---

#### Task 2.4: Aurora Visual
- **ID**: P2-004
- **Dependencies**: P1-005
- **Assigned**: Builder-C1
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/Aurora.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/shaders.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/AuroraFallback.tsx`

**Technique**: WebGL shaders with Canvas fallback for iOS Safari

**Actions**:
```tsx
// frontend/src/components/Visuals/Aurora/Aurora.tsx
import { useRef, useEffect, useState } from 'react';
import { VisualProps } from '../types';
import AuroraFallback from './AuroraFallback';
import { vertexShader, fragmentShader } from './shaders';

function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Aurora({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useWebGL, setUseWebGL] = useState(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setUseWebGL(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setUseWebGL(false);
      return;
    }

    // WebGL setup...
    // (Full implementation with shader compilation, buffers, etc.)

    let startTime = Date.now();
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      const time = (Date.now() - startTime) / 1000 * speed;
      // Update uniforms and render

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, speed]);

  if (!useWebGL) {
    return <AuroraFallback isActive={isActive} speed={speed} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
```

```tsx
// frontend/src/components/Visuals/Aurora/AuroraFallback.tsx
// Canvas-based fallback for devices without WebGL
import { useRef, useEffect } from 'react';
import { VisualProps } from '../types';

export default function AuroraFallback({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simplified aurora effect using gradients
    let time = 0;
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create aurora bands with gradients
      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createLinearGradient(
          0,
          canvas.height * 0.3 + Math.sin(time + i) * 50,
          0,
          canvas.height * 0.7 + Math.cos(time + i) * 50
        );
        gradient.addColorStop(0, 'rgba(0, 255, 128, 0)');
        gradient.addColorStop(0.5, `rgba(0, 255, 128, ${0.1 + i * 0.05})`);
        gradient.addColorStop(1, 'rgba(0, 255, 128, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      time += 0.01 * speed;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
```

**Verification**:
- WebGL version works on desktop Chrome/Safari
- Fallback activates on iOS Safari if WebGL fails
- Smooth animation in both modes

**Test Requirements**:
- `isWebGLSupported()` correctly detects support
- Fallback renders without WebGL

---

#### Task 2.5: Mandala Visual
- **ID**: P2-005
- **Dependencies**: P1-005
- **Assigned**: Builder-C2
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Mandala/Mandala.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Mandala/patterns.ts`

**Technique**: SVG animation with Framer Motion

**Actions**:
```tsx
// frontend/src/components/Visuals/Mandala/Mandala.tsx
import { motion } from 'framer-motion';
import { VisualProps } from '../types';

export default function Mandala({ isActive, speed = 1 }: VisualProps) {
  const layers = 6;
  const petalsPerLayer = [6, 8, 12, 16, 20, 24];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="-100 -100 200 200" className="w-3/4 h-3/4 max-w-lg">
        {Array.from({ length: layers }).map((_, layerIndex) => {
          const radius = 15 + layerIndex * 12;
          const petals = petalsPerLayer[layerIndex];

          return (
            <motion.g
              key={layerIndex}
              animate={isActive ? { rotate: 360 } : {}}
              transition={{
                duration: (30 + layerIndex * 10) / speed,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            >
              {Array.from({ length: petals }).map((_, petalIndex) => {
                const angle = (360 / petals) * petalIndex;
                return (
                  <ellipse
                    key={petalIndex}
                    cx={0}
                    cy={-radius}
                    rx={8 - layerIndex * 0.5}
                    ry={15 - layerIndex}
                    fill="var(--color-primary)"
                    opacity={0.3 + layerIndex * 0.1}
                    transform={`rotate(${angle})`}
                  />
                );
              })}
            </motion.g>
          );
        })}

        {/* Center dot */}
        <circle cx={0} cy={0} r={5} fill="var(--color-primary)" />
      </svg>
    </div>
  );
}
```

**Verification**:
- Mandala rotates with multiple layers at different speeds
- SVG scales properly on different screen sizes
- Smooth animation

**Test Requirements**:
- SVG renders correctly
- All layers animate

---

#### Task 2.6: Cosmic Dust Visual
- **ID**: P2-006
- **Dependencies**: P1-005
- **Assigned**: Builder-C3
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/CosmicDust/CosmicDust.tsx`

**Technique**: Canvas particles with glow effects

**Actions**:
```tsx
// frontend/src/components/Visuals/CosmicDust/CosmicDust.tsx
import { useRef, useEffect } from 'react';
import { VisualProps } from '../types';

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  twinkle: number;
}

export default function CosmicDust({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      z: Math.random(),
      radius: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const render = () => {
      if (!isActive) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      stars.forEach((star) => {
        // Twinkle effect
        const brightness = 0.5 + Math.sin(time * speed + star.twinkle) * 0.5;

        // Draw star with glow
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Move stars slowly
        star.y += star.z * 0.2 * speed;
        if (star.y > canvas.offsetHeight) {
          star.y = 0;
          star.x = Math.random() * canvas.offsetWidth;
        }
      });

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
    />
  );
}
```

**Verification**:
- Stars twinkle with glow effect
- Slow downward drift creates depth
- Works on mobile

**Test Requirements**:
- Canvas renders stars
- Animation is smooth at 60fps

---

#### Task 2.7: Zen Garden Visual
- **ID**: P2-007
- **Dependencies**: P1-005
- **Assigned**: Builder-C1
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ZenGarden/ZenGarden.tsx`

**Technique**: SVG paths with animated stroke

**Actions**:
```tsx
// frontend/src/components/Visuals/ZenGarden/ZenGarden.tsx
import { motion } from 'framer-motion';
import { VisualProps } from '../types';

export default function ZenGarden({ isActive, speed = 1 }: VisualProps) {
  const ripples = 12;
  const duration = 20 / speed;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-2xl">
        {/* Sand background */}
        <rect x="0" y="0" width="400" height="400" fill="var(--color-surface)" />

        {/* Ripple lines */}
        {Array.from({ length: ripples }).map((_, i) => {
          const yOffset = 30 + i * 28;
          const amplitude = 10 + Math.sin(i * 0.5) * 5;

          return (
            <motion.path
              key={i}
              d={`M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`}
              stroke="var(--color-text-muted)"
              strokeWidth="1"
              fill="none"
              opacity={0.3}
              animate={isActive ? {
                d: [
                  `M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                  `M 0 ${yOffset} Q 100 ${yOffset + amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                  `M 0 ${yOffset} Q 100 ${yOffset - amplitude} 200 ${yOffset} T 400 ${yOffset}`,
                ],
              } : {}}
              transition={{
                duration: duration + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Stones */}
        <ellipse cx="320" cy="280" rx="25" ry="15" fill="var(--color-text-muted)" opacity="0.5" />
        <ellipse cx="80" cy="150" rx="20" ry="12" fill="var(--color-text-muted)" opacity="0.4" />
        <ellipse cx="250" cy="100" rx="15" ry="10" fill="var(--color-text-muted)" opacity="0.3" />
      </svg>
    </div>
  );
}
```

**Verification**:
- Sand ripples animate smoothly
- Stones are static
- Calming, minimalist aesthetic

**Test Requirements**:
- SVG paths animate
- Performance is good on mobile

---

#### Task 2.8: Liquid Metal Visual
- **ID**: P2-008
- **Dependencies**: P1-005
- **Assigned**: Builder-C2
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/LiquidMetal/LiquidMetal.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/LiquidMetal/metaball.ts`

**Technique**: Metaball algorithm with Canvas (simplified for mobile)

**Actions**:
```tsx
// frontend/src/components/Visuals/LiquidMetal/LiquidMetal.tsx
import { useRef, useEffect } from 'react';
import { VisualProps } from '../types';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function LiquidMetal({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Reduce ball count on mobile for performance
    const isMobile = width < 768;
    const ballCount = isMobile ? 5 : 8;

    const balls: Ball[] = Array.from({ length: ballCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 50 + Math.random() * 30,
    }));

    let animationId: number;

    const render = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, width, height);

      // Update ball positions
      balls.forEach((ball) => {
        ball.x += ball.vx * speed;
        ball.y += ball.vy * speed;

        // Bounce off walls
        if (ball.x < ball.radius || ball.x > width - ball.radius) ball.vx *= -1;
        if (ball.y < ball.radius || ball.y > height - ball.radius) ball.vy *= -1;

        // Draw metallic gradient
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#c0c0c0');
        gradient.addColorStop(0.7, '#808080');
        gradient.addColorStop(1, '#404040');

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Apply blur filter for metaball effect
      ctx.filter = 'blur(20px) contrast(10)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
```

**Verification**:
- Balls merge with metaball effect
- Performance is acceptable on mobile (reduced ball count)
- Metallic gradient visible

**Test Requirements**:
- Canvas renders
- No frame drops on mobile

---

#### Task 2.9: Sacred Geometry Visual
- **ID**: P2-009
- **Dependencies**: P1-005
- **Assigned**: Builder-C3
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/SacredGeometry/SacredGeometry.tsx`

**Technique**: SVG morph animation (Flower of Life pattern)

**Actions**:
```tsx
// frontend/src/components/Visuals/SacredGeometry/SacredGeometry.tsx
import { motion } from 'framer-motion';
import { VisualProps } from '../types';

export default function SacredGeometry({ isActive, speed = 1 }: VisualProps) {
  const duration = 30 / speed;

  // Flower of Life: 7 overlapping circles
  const circles = [
    { cx: 0, cy: 0 },
    { cx: 25, cy: 0 },
    { cx: -25, cy: 0 },
    { cx: 12.5, cy: 21.65 },
    { cx: -12.5, cy: 21.65 },
    { cx: 12.5, cy: -21.65 },
    { cx: -12.5, cy: -21.65 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        viewBox="-80 -80 160 160"
        className="w-3/4 h-3/4 max-w-lg"
        animate={isActive ? { rotate: 360 } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Outer rings */}
        {[1, 2, 3].map((ring) => (
          <motion.circle
            key={`ring-${ring}`}
            cx={0}
            cy={0}
            r={25 * ring}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            opacity={0.2}
            animate={isActive ? {
              opacity: [0.2, 0.4, 0.2],
            } : {}}
            transition={{
              duration: duration / 3,
              repeat: Infinity,
              delay: ring * 0.5,
            }}
          />
        ))}

        {/* Flower of Life circles */}
        {circles.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={25}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1"
            opacity={0.5}
            animate={isActive ? {
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            } : {}}
            transition={{
              duration: duration / 6,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Center point */}
        <circle cx={0} cy={0} r={3} fill="var(--color-primary)" />
      </motion.svg>
    </div>
  );
}
```

**Verification**:
- Flower of Life pattern visible
- Gentle pulsing animation
- Slow rotation

**Test Requirements**:
- SVG renders correctly
- Animation is smooth

---

#### Task 2.10: Ocean Depth Visual
- **ID**: P2-010
- **Dependencies**: P1-005
- **Assigned**: Builder-C3
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/OceanDepth/OceanDepth.tsx`

**Technique**: Canvas with glow effects for bioluminescence

**Actions**:
```tsx
// frontend/src/components/Visuals/OceanDepth/OceanDepth.tsx
import { useRef, useEffect } from 'react';
import { VisualProps } from '../types';

interface Organism {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  pulse: number;
}

export default function OceanDepth({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const organisms: Organism[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 8 + 2,
      hue: 180 + Math.random() * 60, // Cyan to blue range
      pulse: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const render = () => {
      if (!isActive) return;

      // Dark blue gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#001220');
      bgGradient.addColorStop(1, '#000510');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw organisms with glow
      organisms.forEach((org) => {
        const brightness = 0.5 + Math.sin(time * speed + org.pulse) * 0.5;

        // Glow effect
        const glow = ctx.createRadialGradient(
          org.x, org.y, 0,
          org.x, org.y, org.radius * 4
        );
        glow.addColorStop(0, `hsla(${org.hue}, 100%, 70%, ${brightness})`);
        glow.addColorStop(0.5, `hsla(${org.hue}, 100%, 50%, ${brightness * 0.3})`);
        glow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(org.x, org.y, org.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(org.x, org.y, org.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${org.hue}, 100%, 80%, ${brightness})`;
        ctx.fill();

        // Update position
        org.x += org.vx * speed;
        org.y += org.vy * speed;

        // Wrap around
        if (org.x < -20) org.x = width + 20;
        if (org.x > width + 20) org.x = -20;
        if (org.y < -20) org.y = height + 20;
        if (org.y > height + 20) org.y = -20;
      });

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
```

**Verification**:
- Bioluminescent organisms glow and pulse
- Deep ocean atmosphere
- Smooth drifting motion

**Test Requirements**:
- Canvas renders
- Glow effects visible

---

#### Task 2.11: Visual Selector Component
- **ID**: P2-011
- **Dependencies**: P2-001, P2-002, P2-003 (at least 3 visuals)
- **Assigned**: Builder-B
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/VisualSelector.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/index.ts`

**Actions**:
```tsx
// frontend/src/components/Visuals/VisualSelector.tsx
import { useTimerStore } from '../../stores/timerStore';
import { useTranslation } from 'react-i18next';

const VISUALS = [
  { id: 'breathingCircle', preview: '⭕' },
  { id: 'particleFlow', preview: '✨' },
  { id: 'gradientWaves', preview: '🌊' },
  { id: 'aurora', preview: '🌌' },
  { id: 'mandala', preview: '🔮' },
  { id: 'cosmicDust', preview: '⭐' },
  { id: 'zenGarden', preview: '🪨' },
  { id: 'liquidMetal', preview: '💧' },
  { id: 'sacredGeometry', preview: '📐' },
  { id: 'oceanDepth', preview: '🐙' },
];

export default function VisualSelector() {
  const { t } = useTranslation();
  const { selectedVisual, setSelectedVisual, status } = useTimerStore();

  if (status !== 'idle') return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm text-text-muted mb-3 text-center">
        {t('visuals.select')}
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {VISUALS.map((visual) => (
          <button
            key={visual.id}
            onClick={() => setSelectedVisual(visual.id)}
            className={`p-3 rounded-lg text-2xl ${
              selectedVisual === visual.id
                ? 'bg-primary/20 ring-2 ring-primary'
                : 'bg-surface'
            }`}
            title={t(`visuals.${visual.id}`)}
          >
            {visual.preview}
          </button>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// frontend/src/components/Visuals/index.ts
import { lazy } from 'react';

export const visualComponents = {
  breathingCircle: lazy(() => import('./BreathingCircle/BreathingCircle')),
  particleFlow: lazy(() => import('./ParticleFlow/ParticleFlow')),
  gradientWaves: lazy(() => import('./GradientWaves/GradientWaves')),
  aurora: lazy(() => import('./Aurora/Aurora')),
  mandala: lazy(() => import('./Mandala/Mandala')),
  cosmicDust: lazy(() => import('./CosmicDust/CosmicDust')),
  zenGarden: lazy(() => import('./ZenGarden/ZenGarden')),
  liquidMetal: lazy(() => import('./LiquidMetal/LiquidMetal')),
  sacredGeometry: lazy(() => import('./SacredGeometry/SacredGeometry')),
  oceanDepth: lazy(() => import('./OceanDepth/OceanDepth')),
};

export type VisualId = keyof typeof visualComponents;
```

**Verification**:
- All 10 visuals selectable
- Lazy loading works
- Selected visual highlighted

**Test Requirements**:
- Clicking visual updates store
- Lazy loaded components render

---

### Phase 3: Breathing Guide

#### Task 3.1: Breathing Pattern Engine
- **ID**: P3-001
- **Dependencies**: P1-006
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/patterns.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useBreathingTimer.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/breathingStore.ts`

**Actions**:

```typescript
// frontend/src/components/BreathingGuide/patterns.ts
export interface BreathingPattern {
  id: string;
  nameKey: string; // i18n key
  inhale: number;  // seconds
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: '478', nameKey: 'breathing.patterns.478', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  { id: 'box', nameKey: 'breathing.patterns.box', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  { id: 'calming', nameKey: 'breathing.patterns.calming', inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
  { id: 'energizing', nameKey: 'breathing.patterns.energizing', inhale: 6, holdIn: 0, exhale: 2, holdOut: 0 },
];

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export function getPhaseKey(phase: BreathPhase): string {
  switch (phase) {
    case 'inhale': return 'breathing.inhale';
    case 'holdIn':
    case 'holdOut': return 'breathing.hold';
    case 'exhale': return 'breathing.exhale';
  }
}
```

```typescript
// frontend/src/stores/breathingStore.ts
import { create } from 'zustand';
import { BreathingPattern, BreathPhase, BREATHING_PATTERNS } from '../components/BreathingGuide/patterns';

interface BreathingState {
  pattern: BreathingPattern;
  phase: BreathPhase;
  phaseTime: number; // seconds remaining in current phase
  cycleCount: number;
  isActive: boolean;
  setPattern: (id: string) => void;
  start: () => void;
  stop: () => void;
  tick: () => void;
}

export const useBreathingStore = create<BreathingState>((set, get) => ({
  pattern: BREATHING_PATTERNS[1], // Box breathing default
  phase: 'inhale',
  phaseTime: 4,
  cycleCount: 0,
  isActive: false,

  setPattern: (id) => {
    const pattern = BREATHING_PATTERNS.find((p) => p.id === id) || BREATHING_PATTERNS[1];
    set({ pattern, phase: 'inhale', phaseTime: pattern.inhale, cycleCount: 0 });
  },

  start: () => {
    const { pattern } = get();
    set({ isActive: true, phase: 'inhale', phaseTime: pattern.inhale, cycleCount: 0 });
  },

  stop: () => set({ isActive: false }),

  tick: () => {
    const { pattern, phase, phaseTime, cycleCount, isActive } = get();
    if (!isActive) return;

    if (phaseTime > 1) {
      set({ phaseTime: phaseTime - 1 });
      return;
    }

    // Move to next phase
    const phases: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];
    const durations = [pattern.inhale, pattern.holdIn, pattern.exhale, pattern.holdOut];

    let nextPhaseIndex = phases.indexOf(phase) + 1;

    // Skip phases with 0 duration
    while (nextPhaseIndex < 4 && durations[nextPhaseIndex] === 0) {
      nextPhaseIndex++;
    }

    if (nextPhaseIndex >= 4) {
      // Complete cycle, restart
      set({
        phase: 'inhale',
        phaseTime: pattern.inhale,
        cycleCount: cycleCount + 1,
      });
    } else {
      set({
        phase: phases[nextPhaseIndex],
        phaseTime: durations[nextPhaseIndex],
      });
    }
  },
}));
```

```typescript
// frontend/src/hooks/useBreathingTimer.ts
import { useEffect, useRef } from 'react';
import { useBreathingStore } from '../stores/breathingStore';

export function useBreathingTimer() {
  const { isActive, tick } = useBreathingStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, tick]);

  return useBreathingStore();
}
```

**Verification**:
- Pattern timing is accurate
- Phase transitions work correctly
- Cycle counter increments
- Phases with 0 duration are skipped

**Test Requirements**:
- Box breathing: 4-4-4-4 timing
- 4-7-8: inhale->holdIn->exhale (no holdOut)
- Calming: inhale->exhale only

---

#### Task 3.2: Flower Animation (Apple Watch Style)
- **ID**: P3-002
- **Dependencies**: P3-001
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/FlowerAnimation.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/FlowerAnimation.css`

**Actions**:

```tsx
// frontend/src/components/BreathingGuide/FlowerAnimation.tsx
import { useBreathingStore } from '../../stores/breathingStore';
import './FlowerAnimation.css';

export default function FlowerAnimation() {
  const { pattern, phase, isActive } = useBreathingStore();

  // Calculate total cycle duration for animation
  const cycleDuration = pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut;

  // Determine animation state based on phase
  const isExpanding = phase === 'inhale';
  const isHolding = phase === 'holdIn' || phase === 'holdOut';
  const isContracting = phase === 'exhale';

  const petalCount = 6;
  const petals = Array.from({ length: petalCount });

  return (
    <div className="flower-container">
      <div
        className={`flower ${isActive ? 'active' : ''} ${phase}`}
        style={{
          '--inhale-duration': `${pattern.inhale}s`,
          '--hold-in-duration': `${pattern.holdIn}s`,
          '--exhale-duration': `${pattern.exhale}s`,
          '--hold-out-duration': `${pattern.holdOut}s`,
        } as React.CSSProperties}
      >
        {petals.map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              transform: `rotate(${(360 / petalCount) * i}deg)`,
            }}
          >
            <div className="petal-circle" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

```css
/* frontend/src/components/BreathingGuide/FlowerAnimation.css */
.flower-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.flower {
  position: relative;
  width: 150px;
  height: 150px;
}

.petal {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.petal-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  mix-blend-mode: screen;
  opacity: 0.6;
  transform: translateY(0) scale(0.5);
  transition: transform 0.3s ease;
}

/* Inhale - expand */
.flower.active.inhale .petal-circle {
  transform: translateY(-30px) scale(1);
  transition-duration: var(--inhale-duration);
  transition-timing-function: ease-in;
}

/* Hold in - stay expanded */
.flower.active.holdIn .petal-circle {
  transform: translateY(-30px) scale(1);
  transition-duration: 0.1s;
}

/* Exhale - contract */
.flower.active.exhale .petal-circle {
  transform: translateY(0) scale(0.5);
  transition-duration: var(--exhale-duration);
  transition-timing-function: ease-out;
}

/* Hold out - stay contracted */
.flower.active.holdOut .petal-circle {
  transform: translateY(0) scale(0.5);
  transition-duration: 0.1s;
}

/* Color variations for depth */
.petal:nth-child(odd) .petal-circle {
  background: #61bea2;
}

.petal:nth-child(even) .petal-circle {
  background: #529ca0;
}
```

**Verification**:
- Petals expand on inhale, contract on exhale
- Hold phases maintain position
- `mix-blend-mode: screen` creates overlapping glow effect
- Animation timing matches pattern

**Test Requirements**:
- Animation syncs with breathing phase
- CSS variables correctly set duration

---

#### Task 3.3: Circle Animation (Simple Alternative)
- **ID**: P3-003
- **Dependencies**: P3-001
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/CircleAnimation.tsx`

**Actions**:

```tsx
// frontend/src/components/BreathingGuide/CircleAnimation.tsx
import { motion } from 'framer-motion';
import { useBreathingStore } from '../../stores/breathingStore';

export default function CircleAnimation() {
  const { pattern, phase, phaseTime, isActive } = useBreathingStore();

  // Scale based on phase
  const getScale = () => {
    if (!isActive) return 0.5;
    switch (phase) {
      case 'inhale':
        return 0.5 + (1 - phaseTime / pattern.inhale) * 0.5;
      case 'holdIn':
        return 1;
      case 'exhale':
        return 1 - (1 - phaseTime / pattern.exhale) * 0.5;
      case 'holdOut':
        return 0.5;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <motion.div
        className="w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center"
        animate={{ scale: getScale() }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-primary/30"
          animate={{ scale: getScale() }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
```

**Verification**:
- Circle grows/shrinks with breathing
- Smooth transitions between phases
- Works as fallback for simpler devices

**Test Requirements**:
- Scale updates each second
- Animation is smooth

---

#### Task 3.4: Standalone Breathing Mode
- **ID**: P3-004
- **Dependencies**: P3-001, P3-002, P3-003
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BreathingGuide/BreathingGuide.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Breathe.tsx`

**Actions**:

```tsx
// frontend/src/components/BreathingGuide/BreathingGuide.tsx
import { useTranslation } from 'react-i18next';
import { useBreathingTimer } from '../../hooks/useBreathingTimer';
import { BREATHING_PATTERNS, getPhaseKey } from './patterns';
import FlowerAnimation from './FlowerAnimation';
import CircleAnimation from './CircleAnimation';

interface Props {
  variant?: 'flower' | 'circle';
  showControls?: boolean;
}

export default function BreathingGuide({ variant = 'flower', showControls = true }: Props) {
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

  return (
    <div className="flex flex-col items-center">
      {/* Animation */}
      <div className="w-full max-w-md aspect-square">
        {variant === 'flower' ? <FlowerAnimation /> : <CircleAnimation />}
      </div>

      {/* Phase indicator */}
      {isActive && (
        <div className="text-center mt-4">
          <p className="text-2xl font-light">{t(getPhaseKey(phase))}</p>
          <p className="text-4xl font-bold mt-2">{phaseTime}</p>
        </div>
      )}

      {/* Cycle counter */}
      {cycleCount > 0 && (
        <p className="text-sm text-text-muted mt-4">
          {cycleCount} {t('breathing.cycles')}
        </p>
      )}

      {/* Controls */}
      {showControls && (
        <div className="mt-8 space-y-4">
          {/* Pattern selector */}
          {!isActive && (
            <div className="flex flex-wrap justify-center gap-2">
              {BREATHING_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    pattern.id === p.id
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border'
                  }`}
                >
                  {t(p.nameKey)}
                </button>
              ))}
            </div>
          )}

          {/* Start/Stop */}
          <div className="flex justify-center">
            {!isActive ? (
              <button
                onClick={start}
                className="bg-primary text-white px-8 py-3 rounded-full text-lg"
              >
                {t('timer.start')}
              </button>
            ) : (
              <button
                onClick={stop}
                className="bg-surface border border-red-500 text-red-500 px-8 py-3 rounded-full"
              >
                {t('timer.stop')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

```tsx
// frontend/src/pages/Breathe.tsx
import BreathingGuide from '../components/BreathingGuide/BreathingGuide';
import { useTranslation } from 'react-i18next';

export default function Breathe() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="py-4">
        <a href="/" className="text-text-muted">&larr; {t('app.title')}</a>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <BreathingGuide variant="flower" showControls={true} />
      </main>
    </div>
  );
}
```

**Verification**:
- Standalone page at `/breathe`
- Pattern selector works
- Phase text updates in real-time
- Cycle counter increments

**Test Requirements**:
- Page renders
- All 4 patterns selectable
- Start/stop controls work

---

#### Task 3.5: Timer Integration
- **ID**: P3-005
- **Dependencies**: P3-001, P1-006
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx` (update)
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts` (update)

**Actions**:

Update `frontend/src/stores/timerStore.ts`:
```typescript
// Add to TimerState interface
breathingEnabled: boolean;
breathingPattern: string;
setBreathingEnabled: (enabled: boolean) => void;
setBreathingPattern: (pattern: string) => void;

// Add to store
breathingEnabled: false,
breathingPattern: 'box',
setBreathingEnabled: (enabled) => set({ breathingEnabled: enabled }),
setBreathingPattern: (pattern) => set({ breathingPattern: pattern }),
```

Update `frontend/src/pages/Meditate.tsx`:
```tsx
import { Suspense } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useBreathingStore } from '../stores/breathingStore';
import Timer from '../components/Timer/Timer';
import DurationPicker from '../components/Timer/DurationPicker';
import VisualSelector from '../components/Visuals/VisualSelector';
import { visualComponents } from '../components/Visuals';
import BreathingGuide from '../components/BreathingGuide/BreathingGuide';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const { start: startBreathing, stop: stopBreathing } = useBreathingStore();

  // Sync breathing with timer
  useEffect(() => {
    if (breathingEnabled) {
      if (status === 'running') {
        startBreathing();
      } else {
        stopBreathing();
      }
    }
  }, [status, breathingEnabled, startBreathing, stopBreathing]);

  const VisualComponent = visualComponents[selectedVisual as keyof typeof visualComponents];
  const isRunning = status === 'running' || status === 'paused';

  return (
    <div className="min-h-screen relative">
      {/* Visual background */}
      {isRunning && VisualComponent && (
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <VisualComponent isActive={status === 'running'} />
        </Suspense>
      )}

      {/* Breathing overlay */}
      {isRunning && breathingEnabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64">
            <BreathingGuide variant="circle" showControls={false} />
          </div>
        </div>
      )}

      {/* Timer UI */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Timer />
        <DurationPicker />
        <VisualSelector />

        {/* Breathing toggle */}
        {status === 'idle' && (
          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={breathingEnabled}
              onChange={(e) => useTimer.getState().setBreathingEnabled(e.target.checked)}
              className="w-5 h-5"
            />
            <span>{t('breathing.enableDuringMeditation')}</span>
          </label>
        )}
      </div>
    </div>
  );
}
```

Add to i18n files:
```json
// Add to ko.json
"breathing": {
  ...
  "enableDuringMeditation": "명상 중 호흡 가이드"
}

// Add to en.json
"breathing": {
  ...
  "enableDuringMeditation": "Breathing guide during meditation"
}
```

**Verification**:
- Breathing guide overlay appears when enabled
- Syncs with timer start/pause/stop
- Visual plays behind breathing guide

**Test Requirements**:
- Enabling breathing shows guide during meditation
- Pause/resume syncs both timer and breathing

---

## Testing Strategy

### Unit Tests
- **Stores**: Each Zustand store has isolated tests
- **Patterns**: Breathing pattern calculations
- **API**: Backend endpoint tests with pytest

### Integration Tests
- **Timer + Session**: Full flow from start to complete
- **Timer + Breathing**: Sync behavior
- **i18n**: Language switching

### Visual Tests (Manual)
- Each visual renders on:
  - Desktop Chrome
  - Desktop Safari
  - iOS Safari (critical)
  - Android Chrome
- Performance: 60fps target, check with DevTools

### E2E Tests (Future)
- Playwright for critical flows:
  - Start meditation -> complete
  - Breathing guide standalone
  - Settings persistence

---

## Summary

**Total Tasks**: 18 (7 Phase 1 + 11 Phase 2 + 5 Phase 3)

**Parallelism**:
- Phase 1: Mostly sequential (1.3-1.5 parallel with 1.2)
- Phase 2: All 10 visuals fully parallel after 1.5
- Phase 3: Sequential within phase, parallel with Phase 2

**Critical Path**: P1-001 -> P1-003 -> P1-005 -> P2-001..10 -> P2-011

**Estimated Timeline** (with 4 builders):
- Phase 1: 2-3 days
- Phase 2: 3-4 days (parallel)
- Phase 3: 2-3 days (parallel with Phase 2)
- Total: ~5-7 days
