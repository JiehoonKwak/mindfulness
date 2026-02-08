# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meditation web app with custom timer, 4 animated visuals, breathing guides, sound mixer, stats, goals, and session tracking. React 19 + Vite frontend, FastAPI + SQLite backend. ~90% complete.

## Commands

```bash
# Full stack (fe:14300 + be:14301)
./dev start

# Frontend only
cd frontend && bun run dev

# Backend only
cd backend && uv run uvicorn app.main:app --reload

# Frontend build/lint
bun run build      # TypeScript check + Vite build
bun run lint       # ESLint

# Backend tests
cd backend && uv run pytest -v
```

## Architecture

```
Frontend (React 19 + Vite)          Backend (FastAPI)
┌─────────────────────┐             ┌──────────────────┐
│ Pages:              │             │ /api/health      │
│  Home, Meditate,    │   fetch     │ /api/sessions/*  │
│  Breathe, Settings, │────────────▶│ /api/sounds/*    │
│  Insights           │             │ /api/stats/*     │
│                     │             │ /api/goals/*     │
│ Stores (Zustand):   │             │ /api/tags/*      │
│  timer, session,    │             │ /api/export/*    │
│  settings, breathing│             │ /api/discord/*   │
│                     │             │ /api/music/*     │
│ Components:         │             │ /api/reminders/* │
│  Visuals(4), Timer  │             │                  │
│  SoundMixer, Goals  │             │ SQLite:          │
│  Journal, Stats     │             │ mindfulness.db   │
└─────────────────────┘             └──────────────────┘
```

**Key directories:**
- `frontend/src/pages/` - Route components (Home, Meditate, Breathe, Settings, Insights)
- `frontend/src/components/Visuals/` - 4 meditation visuals (Aurora, Constellation, Sacred Geometry, Ripple Water)
- `frontend/src/components/BreathingVisuals/` - 3 breathing visuals (Waves, Lotus, Orb)
- `frontend/src/stores/` - Zustand state (timer, session, settings, breathing)
- `frontend/src/api/` - Backend fetch wrappers
- `backend/app/routes/` - FastAPI endpoints
- `backend/app/models/` - SQLModel schemas
- `config/config.yaml` - Server, CORS, DB, meditation presets

## Tech Stack

**Frontend:** React 19, Vite 7, Tailwind v4, Zustand 5, Three.js, react-i18next
**Backend:** FastAPI, SQLModel, SQLite, APScheduler, uv (Python)
**Tools:** bun (JS), uv (Python), ESLint flat config

## Current State & Gaps

**Working:** Timer, 4 visuals (breath-synced), breathing guide, 2 themes (zen-dark/zen-light), session CRUD, i18n (ko/en), bell selector, sound mixer, stats/history merged into Insights page, goals/streaks, post-session journal modal, data export (JSON/CSV/iCal/MD), Discord notifications, daily reminders scheduler

**Sounds:** Bell sounds (4 types) and ambient sounds (10 types: rain, ocean, forest, tibetan bowls, wind chimes, white noise, river, campfire, wind, birds) in /sounds/

**DB Tables:** session, goal, tag, session_tag, generated_music

**P3 (optional):** AI music generation requires GEMINI_API_KEY environment variable

## Design Preferences

**CRITICAL - User hates AI slop:**
- NO purple/indigo accent colors
- Pure monochrome only: black (#000000) and white (#ffffff)
- Clean, minimal UI - no unnecessary visual flourish
- System fonts only (no custom font loading)
- Buttons: white bg + black text (dark mode), black bg + white text (light mode)

## Project Standards

- TypeScript strict mode, NO `any`
- Feature-first structure (group by domain)
- Files <500 lines, functions <50 lines
- TDD for backend (pytest)
- Tailwind v4 via Vite plugin (no config file)
