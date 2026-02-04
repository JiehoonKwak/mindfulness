# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meditation web app with custom timer, 10 animated visuals, breathing guides, sound mixer, stats, goals, and session tracking. React 19 + Vite frontend, FastAPI + SQLite backend. ~85% complete (P0-P2 done).

## Commands

```bash
# Full stack (fe:5173 + be:8000)
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
│  Stats, History     │             │ /api/stats/*     │
│                     │             │ /api/goals/*     │
│ Stores (Zustand):   │             │ /api/tags/*      │
│  timer, session,    │             │ /api/export/*    │
│  settings, breathing│             │ /api/discord/*   │
│                     │             │ /api/music/*     │
│ Components:         │             │                  │
│  Visuals(10), Timer │             │ SQLite:          │
│  SoundMixer, Goals  │             │ mindfulness.db   │
│  Journal, Stats     │             └──────────────────┘
└─────────────────────┘
```

**Key directories:**
- `frontend/src/pages/` - Route components
- `frontend/src/components/Visuals/` - 10 meditation animations
- `frontend/src/stores/` - Zustand state (timer, session, settings, breathing)
- `frontend/src/api/` - Backend fetch wrappers
- `backend/app/routes/` - FastAPI endpoints
- `backend/app/models/` - SQLModel schemas
- `config/config.yaml` - Server, CORS, DB, meditation presets

## Tech Stack

**Frontend:** React 19, Vite 7, Tailwind v4, Zustand 5, Framer Motion 12, Three.js, react-i18next
**Backend:** FastAPI, SQLModel, SQLite, uv (Python)
**Tools:** bun (JS), uv (Python), ESLint flat config

## Current State & Gaps

**Working:** Timer, 10 visuals, breathing guide, 8 themes, session CRUD, i18n (ko/en), bell selector, sound mixer, stats page with heatmap, goals/streaks, history page with filters, post-session journal modal, data export (JSON/CSV/iCal/MD), Discord notifications

**Sounds:** Bell sounds (4 types) and ambient sounds (rain, ocean, forest) downloaded to /sounds/

**DB Tables:** session, goal, tag, session_tag, generated_music

**P3 (optional):** AI music generation requires SUNO_API_KEY environment variable

## Project Standards

- TypeScript strict mode, NO `any`
- Feature-first structure (group by domain)
- Files <500 lines, functions <50 lines
- TDD for backend (pytest)
- Tailwind v4 via Vite plugin (no config file)
