# 마음챙김 (Mindfulness)

매일의 명상 습관을 위한 웹 앱

## Features

- **Timer**: Configurable meditation timer (3-60 min) with progress ring
- **10 Visuals**: BreathingCircle, ParticleFlow, GradientWaves, Aurora (WebGL), Mandala, CosmicDust, ZenGarden, LiquidMetal, SacredGeometry, OceanDepth
- **Breathing Guide**: Apple Watch-style flower animation, 4 patterns (4-7-8, Box, Calming, Energizing)
- **Themes**: 8 color themes (5 dark, 3 light)
- **i18n**: Korean (primary), English
- **Session Tracking**: SQLite-backed meditation history

## Architecture

```
mindfulness/
├── frontend/          # Vite + React + Tailwind v4
│   └── src/
│       ├── components/
│       │   ├── Timer/
│       │   ├── Visuals/     # 10 meditation visuals
│       │   └── BreathingGuide/
│       ├── stores/          # Zustand (timer, settings, session, breathing)
│       ├── hooks/
│       ├── pages/
│       └── i18n/
├── backend/           # FastAPI + SQLModel
│   └── app/
│       ├── routes/
│       └── models/
└── config/config.yaml
```

## Setup

### Frontend

```bash
cd frontend
bun install
bun run dev          # localhost:5173
```

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Bell Sounds

Place MP3 files in `frontend/public/sounds/`:
- `start-bell.mp3`
- `end-bell.mp3`

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite, React 19, Tailwind v4, Zustand, Framer Motion |
| Backend | FastAPI, SQLModel, SQLite |
| Package Managers | bun (frontend), uv (backend) |

## API

```
GET  /api/health              # Health check
POST /api/sessions/           # Create session
GET  /api/sessions/           # List sessions
GET  /api/sessions/{id}       # Get session
PATCH /api/sessions/{id}      # Update session
DELETE /api/sessions/{id}     # Delete session
```

## Development

```bash
# Frontend build
cd frontend && bun run build

# Backend tests
cd backend && uv run pytest

# Type check
cd frontend && bun run tsc --noEmit
```
