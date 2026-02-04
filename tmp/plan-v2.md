# Mindfulness Web App - Implementation Plan v2

## Changes from v1

### CRITICAL Fixes

1. **Added missing `types.ts` file for Visuals** (Issue #2)
   - Created new Task P2-000: Create Visuals Types File
   - File: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/types.ts`
   - All visual tasks (P2-001 through P2-010) now depend on P2-000

2. **Added missing i18n key `visuals.select`** (Issue #1)
   - Added to `ko.json`: `"select": "시각 효과 선택"`
   - Added to `en.json`: `"select": "Select Visual"`
   - Updated in Task 1.4

3. **Provided FULL Aurora WebGL shader code** (Issue #4)
   - Complete `shaders.ts` with vertex and fragment shaders
   - Full WebGL initialization code in `Aurora.tsx`
   - Updated in Task 2.4

### MAJOR Fixes

4. **Implemented bell sound playback** (Issue #3)
   - Added new Task P1-008: Bell Sound System
   - Created `useAudio.ts` hook with AudioContext
   - Created `BellPlayer.tsx` component
   - Integrated with timer start/complete events
   - Added placeholder bell sounds structure

### MINOR Fixes

5. **Fixed ThemeSwitcher variable collision** (Issue #5)
   - Changed loop variable from `t` to `themeItem` in `ThemeSwitcher.tsx`
   - Updated in Task 1.5

6. **Registered `/breathe` route in App.tsx** (Issue #6)
   - Added import and Route for Breathe page
   - Updated in Task 1.3

7. **Fixed `useTimer.getState()` to `useTimerStore.getState()`** (Issue #7)
   - Corrected store reference in Meditate.tsx
   - Updated in Task 3.5

8. **Added Timer component barrel exports** (Issue #8)
   - Created `/frontend/src/components/Timer/index.ts`
   - Updated in Task 1.6

---

## Goal

Implement Phase 1-3 of the mindfulness meditation web app: Foundation (scaffolding, timer, API, i18n, themes), all 10 meditation visuals with parallel development, and breathing guide with Apple Watch-style animations.

## Requirements

1. **Phase 1 - Foundation**: Project scaffolding, timer, session CRUD API, i18n (ko/en), light/dark + 8 color themes, bell sounds
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
- **Changes**: React Router setup, Tailwind config with CSS variables, placeholder pages, **includes /breathe route**
- **Test Requirements**: Routes `/`, `/meditate`, `/settings`, `/breathe` render correct pages
- **Verification**: Tailwind classes apply, CSS variables work

### Step 4: i18n Setup for Korean + English (P1-004)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/index.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/ko.json`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/i18n/en.json`
- **Changes**: react-i18next configuration, Korean and English translation files **including `visuals.select` key**
- **Test Requirements**: `t('app.title')` returns correct text for each language; `t('visuals.select')` returns translated text
- **Verification**: Language switch persists to localStorage, Korean displays correctly

### Step 5: Theme System with 8 Color Themes (P1-005)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/styles/themes.css`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/settingsStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/ThemeSwitcher.tsx`
- **Changes**: CSS variables for 8 themes, Zustand settings store, theme switcher UI **with fixed variable naming**
- **Test Requirements**: `setTheme('sakura')` applies light mode; theme persists across reloads
- **Verification**: Smooth transitions between themes, light themes show correct text colors

### Step 6: Timer Component (P1-006)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/Timer.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/TimerControls.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/DurationPicker.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/index.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useTimer.ts`
- **Changes**: Zustand timer store, timer display with progress ring, controls, duration presets, **barrel exports**
- **Test Requirements**: Timer decrements by 1 each second; pause stops countdown; stop resets
- **Verification**: Progress ring animates smoothly, all controls work

### Step 7: Session API Integration (P1-007)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/backend/app/routes/sessions.py`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/sessionStore.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/api/sessions.ts`
- **Changes**: Session CRUD endpoints, frontend API client, session store
- **Test Requirements**: POST creates session; PATCH updates; GET lists sessions
- **Verification**: Full session lifecycle works from frontend to database

### Step 8: Bell Sound System (P1-008) - NEW
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useAudio.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BellPlayer.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/assets/sounds/bells/`
- **Changes**: AudioContext-based audio playback, bell player component integrated with timer
- **Test Requirements**: Bell plays on timer start; bell plays on timer complete; audio can be enabled/disabled
- **Verification**: Audio plays on iOS Safari after user gesture, volume control works

### Step 9: Visuals Types File (P2-000) - NEW
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/types.ts`
- **Changes**: VisualProps interface definition used by all visual components
- **Test Requirements**: TypeScript compiles without errors when importing VisualProps
- **Verification**: All visual components can import from '../types'

### Step 10: Breathing Circle Visual (P2-001)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/BreathingCircle/BreathingCircle.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/BreathingCircle/index.ts`
- **Changes**: CSS transform + scale animation with Framer Motion, 3 concentric circles
- **Test Requirements**: Animation triggers when isActive=true; speed prop affects rate
- **Verification**: Circle expands/contracts smoothly

### Step 11: Particle Flow Visual (P2-002)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/ParticleFlow/ParticleFlow.tsx`
- **Changes**: Canvas + requestAnimationFrame, 100 drifting particles
- **Test Requirements**: Canvas renders; no memory leaks on unmount
- **Verification**: Particles drift smoothly, wrap around edges

### Step 12: Gradient Waves Visual (P2-003)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/GradientWaves/GradientWaves.css`
- **Changes**: CSS keyframe animations, 3 rotating gradient layers
- **Test Requirements**: CSS animation applies; stops when isActive=false
- **Verification**: Waves rotate smoothly, no jank on mobile

### Step 13: Aurora Visual with WebGL and Full Shader Code (P2-004)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/Aurora.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/shaders.ts`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/AuroraFallback.tsx`
- **Changes**: **Complete WebGL shader implementation**, Canvas fallback for iOS Safari
- **Test Requirements**: `isWebGLSupported()` correctly detects support; fallback renders
- **Verification**: Works on desktop Chrome/Safari; fallback activates on iOS Safari if needed

### Step 14-19: Remaining Visuals (P2-005 through P2-010)
- Mandala, Cosmic Dust, Zen Garden, Liquid Metal, Sacred Geometry, Ocean Depth
- (Same as v1, no changes needed)

### Step 20: Visual Selector Component (P2-011)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/VisualSelector.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/index.ts`
- **Changes**: Grid of visual options, lazy loading for all 10 visuals
- **Test Requirements**: Clicking visual updates store; lazy loaded components render; `t('visuals.select')` displays correctly
- **Verification**: All 10 visuals selectable, selected visual highlighted

### Step 21-24: Breathing Guide (P3-001 through P3-004)
- Pattern Engine, Flower Animation, Circle Animation, Standalone Mode
- (Same as v1, no changes needed)

### Step 25: Timer Integration for Breathing (P3-005)
- **Files**: `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx`, `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts`
- **Changes**: Breathing toggle in timer settings, breathing overlay during meditation, **fixed useTimerStore.getState() reference**
- **Test Requirements**: Enabling breathing shows guide during meditation; pause/resume syncs
- **Verification**: Visual plays behind breathing guide, both sync with timer

---

## Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `frontend/package.json` | Create | Dependencies: react, zustand, framer-motion, react-i18next, tailwindcss |
| `frontend/src/main.tsx` | Create | App entry with i18n provider |
| `frontend/src/App.tsx` | Create | Router setup with /breathe route, theme provider |
| `frontend/src/stores/timerStore.ts` | Create | Zustand store for timer state |
| `frontend/src/stores/settingsStore.ts` | Create | Theme, language, preferences |
| `frontend/src/stores/sessionStore.ts` | Create | Current session state |
| `frontend/src/i18n/ko.json` | Create | Korean translations including visuals.select |
| `frontend/src/i18n/en.json` | Create | English translations including visuals.select |
| `frontend/src/i18n/index.ts` | Create | i18next configuration |
| `frontend/src/styles/themes.css` | Create | CSS variables for 8 themes |
| `frontend/src/components/Timer/*` | Create | Timer component suite with index.ts barrel |
| `frontend/src/components/Visuals/types.ts` | Create | VisualProps interface |
| `frontend/src/components/Visuals/*` | Create | 10 visual components |
| `frontend/src/components/BreathingGuide/*` | Create | Breathing guide suite |
| `frontend/src/components/ThemeSwitcher.tsx` | Create | Theme switcher with fixed variable naming |
| `frontend/src/components/BellPlayer.tsx` | Create | Bell sound player component |
| `frontend/src/hooks/useAudio.ts` | Create | AudioContext hook for bell sounds |
| `frontend/src/pages/Home.tsx` | Create | Dashboard page |
| `frontend/src/pages/Meditate.tsx` | Create | Meditation session page |
| `frontend/src/pages/Settings.tsx` | Create | Settings page |
| `frontend/src/pages/Breathe.tsx` | Create | Standalone breathing page |
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
    ├── 1.3 Frontend Setup (depends on 1.1) - NOW INCLUDES /breathe ROUTE
    │     ├── 1.4 i18n Setup (depends on 1.3) - NOW INCLUDES visuals.select
    │     └── 1.5 Theme System (depends on 1.3) - FIXED variable collision
    └── 1.6 Timer Component (depends on 1.3, 1.2) - NOW INCLUDES barrel exports
        ├── 1.7 Session API Integration (depends on 1.6, 1.2)
        └── 1.8 Bell Sound System (depends on 1.6) - NEW

Phase 2 Visuals (Parallel after 1.5):
  2.0 Visuals Types File (depends on 1.3) - NEW, MUST COMPLETE FIRST
  All 10 visuals depend on 2.0 and can be developed in parallel
  2.11 Visual Selector depends on at least 3 visuals complete

Phase 3 Breathing (After 1.6):
  3.1 Pattern Engine (depends on 1.6)
    ├── 3.2 Flower Animation (depends on 3.1)
    ├── 3.3 Circle Animation (depends on 3.1)
    └── 3.4 Standalone Mode (depends on 3.1)
  3.5 Timer Integration (depends on 3.1, 1.6) - FIXED useTimerStore reference
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebGL on iOS Safari | Aurora visual may fail | Implement Canvas fallback, detect WebGL support |
| Metaball performance | Liquid Metal heavy on mobile | Use Web Worker, reduce particle count on mobile |
| Zustand + i18n re-renders | UI flicker on language change | Use shallow selectors, memoize components |
| Audio on iOS | Requires user gesture | Show "tap to enable audio" overlay on first load, use AudioContext unlock |
| 10 visuals scope creep | Delays delivery | Prioritize Core 3 first, then expand |
| Missing types.ts | All visual imports fail | Created P2-000 as prerequisite |

---

## Team Orchestration

### Team Lead Instructions

1. **Kick off Phase 1** sequentially - scaffolding must complete before other work
2. **CRITICAL**: Ensure P2-000 (types.ts) completes before any visual work starts
3. **After 1.5 and 2.0 complete** (Theme System + Types), assign all 10 visuals to Builder agents in parallel
4. **After 1.6 completes** (Timer), start Phase 3 Breathing Guide AND P1-008 (Bell Sounds)
5. **Validator** runs after each component completes
6. **Final integration** test after all phases complete

### Parallel Workstreams

```
Workstream A (Foundation):
  Builder-A: 1.1 -> 1.2 -> 1.6 -> 1.7 -> 1.8 (Bell Sounds)

Workstream B (Frontend Core):
  Builder-B: 1.3 -> 1.4 -> 1.5 -> 2.0 (Types) -> 2.11 (Selector)

Workstream C (Visuals - after 1.5 AND 2.0):
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
| Builder-A | Backend + Timer + Audio | FastAPI, SQLModel, Python, Web Audio API |
| Builder-B | Frontend Core + Types | React, Zustand, i18n, CSS, TypeScript |
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
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Breathe.tsx` (placeholder)

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

Create `frontend/src/App.tsx` (UPDATED - includes /breathe route):
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Meditate from './pages/Meditate';
import Settings from './pages/Settings';
import Breathe from './pages/Breathe';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/breathe" element={<Breathe />} />
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

Create placeholder `Breathe.tsx`:
```tsx
// frontend/src/pages/Breathe.tsx
export default function Breathe() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Breathing Guide</h1>
      <p className="text-text-muted mt-4">Coming soon...</p>
    </div>
  );
}
```

**Verification**:
- Routes work: `/`, `/meditate`, `/settings`, `/breathe`
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

Create `frontend/src/i18n/ko.json` (UPDATED - includes visuals.select):
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
    "enableDuringMeditation": "명상 중 호흡 가이드",
    "patterns": {
      "478": "4-7-8 릴렉싱",
      "box": "박스 브리딩",
      "calming": "카밍 브레스",
      "energizing": "에너자이징"
    }
  },
  "visuals": {
    "select": "시각 효과 선택",
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
    "lightMode": "라이트 모드",
    "bellSound": "종소리",
    "enableBell": "시작/종료 시 종소리"
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

Create `frontend/src/i18n/en.json` (UPDATED - includes visuals.select):
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
    "enableDuringMeditation": "Breathing guide during meditation",
    "patterns": {
      "478": "4-7-8 Relaxing",
      "box": "Box Breathing",
      "calming": "Calming Breath",
      "energizing": "Energizing"
    }
  },
  "visuals": {
    "select": "Select Visual",
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
    "lightMode": "Light Mode",
    "bellSound": "Bell Sound",
    "enableBell": "Bell at start/end"
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
- `t('visuals.select')` returns correct translation

**Test Requirements**:
- `t('app.title')` returns "마음챙김" when lang=ko
- `t('app.title')` returns "Mindfulness" when lang=en
- `t('visuals.select')` returns "시각 효과 선택" when lang=ko
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
  bellEnabled: boolean;
  setTheme: (theme: ThemeId) => void;
  setLanguage: (language: Language) => void;
  setBellEnabled: (enabled: boolean) => void;
}

const LIGHT_THEMES: ThemeId[] = ['sakura', 'sand', 'zen'];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'ocean',
      language: 'ko',
      bellEnabled: true,
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', !LIGHT_THEMES.includes(theme));
        set({ theme });
      },
      setLanguage: (language) => {
        localStorage.setItem('language', language);
        set({ language });
      },
      setBellEnabled: (enabled) => set({ bellEnabled: enabled }),
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

Create `frontend/src/components/ThemeSwitcher.tsx` (FIXED - variable collision):
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
      {themes.map((themeItem) => (
        <button
          key={themeItem.id}
          onClick={() => setTheme(themeItem.id)}
          className={`p-3 rounded-lg border-2 ${
            theme === themeItem.id ? 'border-primary' : 'border-transparent'
          }`}
          data-theme={themeItem.id}
        >
          <div className="w-8 h-8 rounded-full bg-primary mx-auto" />
          <span className="text-xs mt-1 block">{t(`themes.${themeItem.id}`)}</span>
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
- No variable collision in ThemeSwitcher

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
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Timer/index.ts`
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
  breathingEnabled: boolean;
  breathingPattern: string;
  setDuration: (minutes: number) => void;
  setSelectedVisual: (visual: string) => void;
  setBreathingEnabled: (enabled: boolean) => void;
  setBreathingPattern: (pattern: string) => void;
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
  breathingEnabled: false,
  breathingPattern: 'box',

  setDuration: (minutes) => set({
    duration: minutes * 60,
    remaining: minutes * 60
  }),

  setSelectedVisual: (visual) => set({ selectedVisual: visual }),

  setBreathingEnabled: (enabled) => set({ breathingEnabled: enabled }),

  setBreathingPattern: (pattern) => set({ breathingPattern: pattern }),

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

Create `frontend/src/components/Timer/index.ts` (NEW - barrel exports):
```typescript
export { default as Timer } from './Timer';
export { default as TimerControls } from './TimerControls';
export { default as DurationPicker } from './DurationPicker';
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

#### Task 1.8: Bell Sound System (NEW)
- **ID**: P1-008
- **Dependencies**: P1-006
- **Assigned**: Builder-A
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/hooks/useAudio.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/BellPlayer.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/assets/sounds/start-bell.mp3`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/assets/sounds/end-bell.mp3`

**Actions**:

Create `frontend/src/hooks/useAudio.ts`:
```typescript
import { useRef, useCallback, useEffect } from 'react';

export interface UseAudioOptions {
  volume?: number;
  onEnded?: () => void;
}

export function useAudio(src: string, options: UseAudioOptions = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isLoadedRef = useRef(false);

  // Initialize AudioContext on first user interaction (iOS requirement)
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = options.volume ?? 1;
    }
    return audioContextRef.current;
  }, [options.volume]);

  // Load audio buffer
  const loadAudio = useCallback(async () => {
    if (isLoadedRef.current || !src) return;

    try {
      const ctx = initAudioContext();
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      audioBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
      isLoadedRef.current = true;
    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  }, [src, initAudioContext]);

  // Play the audio
  const play = useCallback(async () => {
    const ctx = initAudioContext();

    // Resume context if suspended (iOS requirement)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Load if not already loaded
    if (!audioBufferRef.current) {
      await loadAudio();
    }

    if (!audioBufferRef.current || !gainNodeRef.current) return;

    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(gainNodeRef.current);

    if (options.onEnded) {
      source.onended = options.onEnded;
    }

    source.start(0);
  }, [initAudioContext, loadAudio, options.onEnded]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Preload audio on mount
  useEffect(() => {
    // Preload on first user interaction
    const handleInteraction = () => {
      loadAudio();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [loadAudio]);

  return { play, setVolume, loadAudio };
}
```

Create `frontend/src/components/BellPlayer.tsx`:
```tsx
import { useEffect, useRef } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAudio } from '../hooks/useAudio';

// Import bell sounds (place these files in assets/sounds/)
import startBellUrl from '../assets/sounds/start-bell.mp3';
import endBellUrl from '../assets/sounds/end-bell.mp3';

export default function BellPlayer() {
  const status = useTimerStore((state) => state.status);
  const bellEnabled = useSettingsStore((state) => state.bellEnabled);
  const prevStatusRef = useRef(status);

  const startBell = useAudio(startBellUrl, { volume: 0.7 });
  const endBell = useAudio(endBellUrl, { volume: 0.8 });

  useEffect(() => {
    if (!bellEnabled) return;

    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    // Play start bell when transitioning from idle to running
    if (prevStatus === 'idle' && status === 'running') {
      startBell.play();
    }

    // Play end bell when transitioning to complete
    if (prevStatus === 'running' && status === 'complete') {
      endBell.play();
    }
  }, [status, bellEnabled, startBell, endBell]);

  // This component doesn't render anything
  return null;
}
```

**Note**: For the bell sound files, create placeholder files or download free meditation bell sounds from:
- freesound.org (search "singing bowl" or "meditation bell")
- Place MP3 files at `frontend/src/assets/sounds/start-bell.mp3` and `end-bell.mp3`

Alternative: Create silent placeholder files for development, replace with real sounds later:
```bash
# Create placeholder directory
mkdir -p frontend/src/assets/sounds
# Add a README for sound sources
echo "Place start-bell.mp3 and end-bell.mp3 here. Download from freesound.org (search 'singing bowl')" > frontend/src/assets/sounds/README.md
```

**Integration**: Add BellPlayer to App.tsx:
```tsx
// In App.tsx, add:
import BellPlayer from './components/BellPlayer';

// Inside the Router:
<BrowserRouter>
  <BellPlayer />
  <div className="min-h-screen bg-background text-white">
    {/* routes */}
  </div>
</BrowserRouter>
```

**Verification**:
- Bell plays when meditation starts (idle -> running)
- Bell plays when meditation completes (running -> complete)
- Bell respects bellEnabled setting
- Audio works on iOS Safari after user gesture

**Test Requirements**:
- AudioContext initializes on user interaction
- Bell sounds trigger on correct status transitions
- Volume control works

---

### Phase 2: Visuals (Parallel Development)

#### Task 2.0: Visuals Types File (NEW - PREREQUISITE)
- **ID**: P2-000
- **Dependencies**: P1-003
- **Assigned**: Builder-B
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/types.ts`

**Actions**:

Create `frontend/src/components/Visuals/types.ts`:
```typescript
export interface VisualProps {
  isActive: boolean;
  speed?: number; // 0.5 - 2.0, default 1.0
  theme?: 'light' | 'dark';
}
```

**Verification**:
- TypeScript compiles without errors
- All visual components can import `VisualProps` from `'../types'`

**Test Requirements**:
- Import statement works: `import { VisualProps } from '../types'`

---

#### Task 2.1: Breathing Circle Visual
- **ID**: P2-001
- **Dependencies**: P1-005, P2-000
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

```typescript
// frontend/src/components/Visuals/BreathingCircle/index.ts
export { default } from './BreathingCircle';
```

**Verification**:
- Circle expands/contracts smoothly
- Speed prop affects animation rate
- Stops when isActive=false

**Test Requirements**:
- Renders without errors
- Animation triggers when isActive=true

---

#### Task 2.2-2.3: Particle Flow and Gradient Waves
(Same as v1, no changes needed - see original plan)

---

#### Task 2.4: Aurora Visual with COMPLETE WebGL Shader Code
- **ID**: P2-004
- **Dependencies**: P1-005, P2-000
- **Assigned**: Builder-C1
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/Aurora.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/shaders.ts`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/AuroraFallback.tsx`
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/Aurora/index.ts`

**Technique**: WebGL shaders with Canvas fallback for iOS Safari

**Actions**:

Create `frontend/src/components/Visuals/Aurora/shaders.ts` (COMPLETE IMPLEMENTATION):
```typescript
export const vertexShader = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;

  // Simplex noise function for smooth randomness
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Create multiple aurora bands
    float aurora = 0.0;

    // Band 1 - main green aurora
    float band1 = snoise(vec2(uv.x * 3.0 + u_time * 0.1, uv.y * 0.5 + u_time * 0.05));
    band1 = smoothstep(0.3, 0.7, uv.y + band1 * 0.2);
    band1 *= smoothstep(0.9, 0.5, uv.y + band1 * 0.1);
    aurora += band1 * 0.6;

    // Band 2 - secondary wave
    float band2 = snoise(vec2(uv.x * 5.0 - u_time * 0.08, uv.y * 0.8 + u_time * 0.03));
    band2 = smoothstep(0.4, 0.6, uv.y + band2 * 0.15);
    band2 *= smoothstep(0.85, 0.55, uv.y + band2 * 0.1);
    aurora += band2 * 0.4;

    // Band 3 - subtle accent
    float band3 = snoise(vec2(uv.x * 7.0 + u_time * 0.12, uv.y * 1.0 - u_time * 0.04));
    band3 = smoothstep(0.45, 0.55, uv.y + band3 * 0.1);
    band3 *= smoothstep(0.8, 0.6, uv.y + band3 * 0.08);
    aurora += band3 * 0.3;

    // Color gradient - green to cyan to purple
    vec3 color1 = vec3(0.0, 0.8, 0.4);  // Green
    vec3 color2 = vec3(0.0, 0.6, 0.8);  // Cyan
    vec3 color3 = vec3(0.5, 0.0, 0.8);  // Purple

    float colorMix = snoise(vec2(uv.x * 2.0 + u_time * 0.05, u_time * 0.02)) * 0.5 + 0.5;
    vec3 auroraColor = mix(mix(color1, color2, colorMix), color3, colorMix * colorMix);

    // Apply aurora intensity
    vec3 finalColor = auroraColor * aurora;

    // Add subtle stars in background
    float stars = snoise(uv * 100.0) * 0.5 + 0.5;
    stars = pow(stars, 20.0) * 0.3;
    finalColor += vec3(stars) * (1.0 - aurora * 2.0);

    // Dark sky gradient background
    vec3 skyTop = vec3(0.0, 0.02, 0.1);
    vec3 skyBottom = vec3(0.0, 0.0, 0.05);
    vec3 sky = mix(skyBottom, skyTop, uv.y);

    finalColor = max(finalColor, sky);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}
```

Create `frontend/src/components/Visuals/Aurora/Aurora.tsx` (COMPLETE IMPLEMENTATION):
```tsx
import { useRef, useEffect, useState } from 'react';
import { VisualProps } from '../types';
import AuroraFallback from './AuroraFallback';
import { vertexShader, fragmentShader, createShader, createProgram } from './shaders';

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
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    timeLocation: WebGLUniformLocation | null;
    resolutionLocation: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setUseWebGL(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      setUseWebGL(false);
      return;
    }

    // Create shaders
    const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

    if (!vShader || !fShader) {
      setUseWebGL(false);
      return;
    }

    const program = createProgram(gl, vShader, fShader);
    if (!program) {
      setUseWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Create vertex buffer for fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    // Set up position attribute
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    glRef.current = { gl, program, timeLocation, resolutionLocation };

    return () => {
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!glRef.current || !isActive) return;

    const { gl, timeLocation, resolutionLocation } = glRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startTime = Date.now();
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      const time = (Date.now() - startTime) / 1000 * speed;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

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

Create `frontend/src/components/Visuals/Aurora/AuroraFallback.tsx`:
```tsx
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

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    let time = 0;
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      // Dark sky background
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#001020');
      skyGradient.addColorStop(1, '#000510');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Create aurora bands with gradients
      for (let i = 0; i < 5; i++) {
        const yBase = height * 0.3 + Math.sin(time * 0.5 + i * 0.5) * 30;
        const yEnd = height * 0.7 + Math.cos(time * 0.3 + i * 0.7) * 40;

        const gradient = ctx.createLinearGradient(0, yBase, 0, yEnd);

        // Color varies by band
        const hue = 120 + Math.sin(time * 0.2 + i) * 40; // Green to cyan
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, `hsla(${hue}, 80%, 50%, ${0.1 + i * 0.03})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${0.15 + i * 0.02})`);
        gradient.addColorStop(0.7, `hsla(${hue + 20}, 70%, 50%, ${0.1 + i * 0.02})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      time += 0.02 * speed;
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

Create `frontend/src/components/Visuals/Aurora/index.ts`:
```typescript
export { default } from './Aurora';
```

**Verification**:
- WebGL version works on desktop Chrome/Safari
- Fallback activates on iOS Safari if WebGL fails
- Smooth animation in both modes
- Aurora bands wave and change color

**Test Requirements**:
- `isWebGLSupported()` correctly detects support
- Fallback renders without WebGL
- Shader compiles without errors

---

#### Tasks 2.5-2.10: Remaining Visuals
(Same as v1, no changes needed - Mandala, Cosmic Dust, Zen Garden, Liquid Metal, Sacred Geometry, Ocean Depth)

---

#### Task 2.11: Visual Selector Component
(Same as v1, uses `t('visuals.select')` which is now defined in i18n)

---

### Phase 3: Breathing Guide

#### Tasks 3.1-3.4: Breathing Pattern Engine, Flower Animation, Circle Animation, Standalone Mode
(Same as v1, no changes needed)

---

#### Task 3.5: Timer Integration (FIXED)
- **ID**: P3-005
- **Dependencies**: P3-001, P1-006
- **Assigned**: Builder-D
- **Files**:
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/pages/Meditate.tsx` (update)
  - `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/stores/timerStore.ts` (update)

**Actions**:

Update `frontend/src/pages/Meditate.tsx` (FIXED - useTimerStore reference):
```tsx
import { Suspense } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useTimerStore } from '../stores/timerStore';
import { useBreathingStore } from '../stores/breathingStore';
import { Timer, DurationPicker } from '../components/Timer';
import VisualSelector from '../components/Visuals/VisualSelector';
import { visualComponents } from '../components/Visuals';
import BreathingGuide from '../components/BreathingGuide/BreathingGuide';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Meditate() {
  const { t } = useTranslation();
  const { status, selectedVisual, breathingEnabled } = useTimer();
  const setBreathingEnabled = useTimerStore((state) => state.setBreathingEnabled);
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
              onChange={(e) => setBreathingEnabled(e.target.checked)}
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

**Verification**:
- Breathing guide overlay appears when enabled
- Syncs with timer start/pause/stop
- Visual plays behind breathing guide
- No TypeScript errors with store reference

**Test Requirements**:
- Enabling breathing shows guide during meditation
- Pause/resume syncs both timer and breathing

---

## Testing Strategy

### Unit Tests
- **Stores**: Each Zustand store has isolated tests
- **Patterns**: Breathing pattern calculations
- **API**: Backend endpoint tests with pytest
- **Types**: Visual components type-check correctly

### Integration Tests
- **Timer + Session**: Full flow from start to complete
- **Timer + Breathing**: Sync behavior
- **Timer + Bell**: Bell plays at correct times
- **i18n**: Language switching, including visuals.select

### Visual Tests (Manual)
- Each visual renders on:
  - Desktop Chrome
  - Desktop Safari
  - iOS Safari (critical)
  - Android Chrome
- Performance: 60fps target, check with DevTools
- Aurora: Test WebGL and fallback modes

### E2E Tests (Future)
- Playwright for critical flows:
  - Start meditation -> complete
  - Breathing guide standalone
  - Settings persistence

---

## Summary

**Total Tasks**: 20 (8 Phase 1 + 12 Phase 2 + 5 Phase 3)

**Changes from v1**:
- Added P1-008 (Bell Sound System)
- Added P2-000 (Visuals Types File)
- Fixed i18n keys
- Fixed ThemeSwitcher variable collision
- Fixed useTimerStore reference
- Added Timer barrel exports
- Added /breathe route to App.tsx
- Complete Aurora WebGL shader implementation

**Parallelism**:
- Phase 1: Mostly sequential (1.3-1.5 parallel with 1.2, 1.8 parallel with 1.7)
- Phase 2: 2.0 must complete first, then all 10 visuals fully parallel after 1.5
- Phase 3: Sequential within phase, parallel with Phase 2

**Critical Path**: P1-001 -> P1-003 -> P2-000 -> P2-001..10 -> P2-011

**Estimated Timeline** (with 4 builders):
- Phase 1: 2-3 days
- Phase 2: 3-4 days (parallel)
- Phase 3: 2-3 days (parallel with Phase 2)
- Total: ~5-7 days
