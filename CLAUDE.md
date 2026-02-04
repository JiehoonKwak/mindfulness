# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meditation web app with custom timer, 10 animated visuals, breathing guides, and session tracking. React 19 + Vite frontend, FastAPI + SQLite backend. ~15% complete.

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
│  Breathe, Settings  │────────────▶│                  │
│                     │             │ SQLite:          │
│ Stores (Zustand):   │             │ mindfulness.db   │
│  timer, session,    │             └──────────────────┘
│  settings, breathing│
│                     │
│ Visuals: 10 types   │
│ (Aurora=WebGL,      │
│  others=CSS/Canvas) │
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

**Working:** Timer, 10 visuals, breathing guide, 8 themes, session CRUD, i18n (ko/en)

**Missing:** Sound files (sounds/ empty), Stats page, Post-session journal UI, Goals/Tags system, History page

**DB gap:** Only `session` table exists; PLAN.md specifies 9 tables

## Project Standards

- TypeScript strict mode, NO `any`
- Feature-first structure (group by domain)
- Files <500 lines, functions <50 lines
- TDD for backend (pytest)
- Tailwind v4 via Vite plugin (no config file)
