# Context: Mindfulness Web App - Phase 1-3

Created: 2026-02-04

## User Intent

Implement Phase 1-3 of the mindfulness meditation web app as defined in PLAN.md:

- Phase 1: Foundation (scaffolding, timer, API, i18n, themes)
- Phase 2: All 10 meditation visuals (parallel development)
- Phase 3: Breathing guide with Apple Watch-style animations

## Interview Summary

- **Scope**:

  - IN: Phase 1 (Foundation), Phase 2 (All 10 visuals), Phase 3 (Breathing Guide)
  - OUT: Phases 4-12 (sounds, journal, stats, export, goals, discord, AI music, polish)

- **Constraints**:

  - Deployment: Mac mini/MacBook local (no Docker initially)
  - Access via Tailscale IP
  - Korean primary language, English secondary
  - Must work on iOS Safari (PWA ready structure)

- **Technical Decisions**:

  - ORM: SQLModel (Pydantic + SQLAlchemy hybrid)
  - State: Zustand
  - Breathing: Both standalone + timer-integrated modes

- **Done Criteria**:
  - Timer works with configurable durations
  - All 10 visuals selectable and performant on mobile
  - Breathing patterns (4-7-8, box, calming, energizing) with animations
  - Light/dark themes with 8 color schemes
  - i18n working for ko/en
  - Basic session CRUD API functional
  - Bell sounds play at start/end

## Research Findings

### Frontend Stack

- **Vite + React**: `bun create vite mindfulness-frontend --template react-ts`
- **Tailwind CSS**: Utility-first, responsive
- **Framer Motion**: `motion/react` package for animations
  - `useAnimate` + `useInView` for scroll-triggered
  - `layoutScroll` for scrollable containers
  - Keyframe arrays with `times` for precise timing
- **Zustand**: Minimal state management

### Backend Stack

- **FastAPI + SQLModel**: Single file DB, Pydantic validation built-in
- **Pattern**: SessionDep = Annotated[Session, Depends(get_session)]
- **CORS**: Required for Tailscale cross-origin access
- **Lifespan**: Use `@app.on_event("startup")` for DB init

### Visual Techniques (from PLAN.md)

| Visual           | Technique                      |
| ---------------- | ------------------------------ |
| Breathing Circle | CSS transform + scale          |
| Particle Flow    | Canvas / requestAnimationFrame |
| Gradient Waves   | CSS animation + keyframes      |
| Aurora           | WebGL shaders (GLSL)           |
| Mandala          | SVG animation                  |
| Cosmic Dust      | Canvas particles               |
| Zen Garden       | SVG paths                      |
| Liquid Metal     | Metaball algorithm (Canvas)    |
| Sacred Geometry  | SVG morph                      |
| Ocean Depth      | Canvas + glow effects          |

### Breathing Guide

- Apple Watch flower-petal animation: CSS `mix-blend-mode: screen`, multiple circles
- Patterns stored in config, customizable timing
- Audio cues optional (soft tones)

### Project Structure (from PLAN.md)

```
mindfulness/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timer/
│   │   │   ├── Visuals/  (10 subdirs)
│   │   │   └── BreathingGuide/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── stores/       # Zustand
│   │   ├── i18n/
│   │   └── assets/sounds/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── models/
│   │   └── config.py
│   ├── requirements.txt
│   └── data/
├── config/config.yaml
└── sounds/bells/
```

## Open Questions

1. **Bell sounds source**: Need to acquire/download free bell sounds (tibetan bowl, singing bowl, etc.) - deferred to Phase 4 but structure needed
2. **WebGL shader complexity**: Aurora visual requires GLSL - may need Three.js or raw WebGL
3. **Metaball algorithm**: Liquid Metal visual is computationally heavy - may need optimization or Web Worker
4. **PWA manifest**: Structure now, implement fully in Phase 12

## Technical Risks

1. **WebGL on iOS Safari**: May have performance issues - need fallback
2. **10 visuals parallel**: Large scope - prioritize Core 3 first, then expand
3. **Zustand + i18n interaction**: Ensure language switching triggers re-renders properly
