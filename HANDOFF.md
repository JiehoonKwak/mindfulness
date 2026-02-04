---
created: 2026-02-04
branch: main
---

# Handoff

## Summary

Meditation web app. ~15% of PLAN.md implemented. Core timer/visuals work, but sounds, stats, journal, goals are missing.

---

## What IS Working

### Frontend
- **Timer**: Custom ClockDial (1-60 min drag), preset buttons, progress ring
- **10 Visuals**: Aurora (WebGL), ParticleFlow, GradientWaves, Mandala, CosmicDust, ZenGarden, LiquidMetal, SacredGeometry, OceanDepth, BreathingCircle
- **Breathing Guide**: 4 patterns (4-7-8, Box, Calming, Energizing), Three.js AuraBreathing sphere
- **Themes**: 8 themes (5 dark, 3 light), CSS variables, persisted
- **i18n**: Korean (default) + English
- **Pages**: Home, Meditate, Breathe, Settings

### Backend
- **FastAPI** server with CORS
- **SQLite** database at `backend/data/mindfulness.db`
- **Session API**: POST/GET/PATCH/DELETE `/api/sessions/`

### Integration
- timerStore calls sessionStore on start/stop/complete
- Sessions logged to database (needs verification)

---

## What is MISSING

### P0: Critical (App Broken Without)

**No Sound Files**
```
sounds/bells/    <- EMPTY (need: tibetan_bowl.mp3, singing_bowl.mp3, zen_gong.mp3)
sounds/ambient/  <- EMPTY (need: rain.mp3, ocean.mp3, forest.mp3)
sounds/music/    <- DOESN'T EXIST
```
- BellPlayer.tsx exists but has no audio files to play
- No download script exists

**No Stats Page**
```
frontend/src/pages/Stats.tsx        <- MISSING
frontend/src/components/Stats/      <- MISSING
backend/app/routes/stats.py         <- MISSING
```
- No heatmap (GitHub-style calendar)
- No charts (weekly/monthly)
- No streak display

### P1: Important (Core Value Missing)

**No Post-Session Journal**
- No mood selector (before/after)
- No notes input
- No energy level slider
- Session model has fields, but no UI

**No Goals System**
```
backend/app/routes/goals.py         <- MISSING
frontend/src/components/Goals/      <- MISSING
Database table: goals               <- MISSING
```
- No daily/weekly goals
- No progress rings on Home
- No streak tracking

**No Tags System**
```
backend/app/routes/tags.py          <- MISSING
Database tables: tags, session_tags <- MISSING
```

**No History Page**
```
frontend/src/pages/History.tsx      <- MISSING
```
- No session list view
- No filtering by date/tag

### P2: Medium Priority

**Sound Mixer Not Implemented**
- PLAN specifies Web Audio API layered playback
- Volume controls for bell/music/ambient
- Fade in/out transitions
- Sound presets saving

**Interval Bells**
- Bell at N-minute intervals during meditation

**Data Export**
```
backend/app/routes/export.py        <- MISSING
```
- No JSON/CSV/iCal/Markdown export

### P3: Nice to Have

**Discord Integration**
```
backend/app/services/discord.py     <- MISSING
```
- No webhook notifications
- No daily reminders

**AI Music Generation**
```
scripts/generate_music.py           <- MISSING
backend/app/services/music_gen.py   <- MISSING
```
- No MusicGen/Suno integration

**PWA**
- No service worker
- No manifest configured

**Docker**
```
docker-compose.yaml                 <- MISSING
```

---

## Database Gap

**Current schema (1 table):**
```sql
session (id, started_at, ended_at, planned_duration_seconds,
         actual_duration_seconds, completed, visual_type,
         bell_sound, mood_before, mood_after, note)
```

**PLAN.md specifies 9 tables:**
```sql
sessions        -- EXISTS
session_tags    -- MISSING
tags            -- MISSING
goals           -- MISSING
daily_stats     -- MISSING (cache for heatmap)
streaks         -- MISSING
user_settings   -- MISSING
sound_presets   -- MISSING
generated_music -- MISSING
```

---

## Backend API Gap

**Implemented:**
```
/api/health
/api/sessions/  (CRUD)
```

**PLAN.md specifies but MISSING:**
```
/api/stats/summary
/api/stats/heatmap
/api/stats/streak
/api/goals/
/api/tags/
/api/sounds/bells
/api/sounds/ambient
/api/sounds/presets
/api/export/json
/api/export/csv
/api/music/generate
/api/discord/test
```

---

## File Structure Reference

```
mindfulness/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx        # Basic, no goals dashboard
│       │   ├── Meditate.tsx    # Working
│       │   ├── Breathe.tsx     # Working
│       │   ├── Settings.tsx    # Theme/language/bell toggle
│       │   ├── Stats.tsx       # MISSING
│       │   └── History.tsx     # MISSING
│       ├── components/
│       │   ├── Timer/          # Working (ClockDial, DurationPicker)
│       │   ├── Visuals/        # Working (10 visuals)
│       │   ├── BreathingGuide/ # Working (AuraBreathing)
│       │   ├── Stats/          # MISSING
│       │   ├── Journal/        # MISSING
│       │   └── Goals/          # MISSING
│       └── stores/
│           ├── timerStore.ts   # Working
│           ├── sessionStore.ts # Working (API calls)
│           ├── settingsStore.ts# Working
│           └── breathingStore.ts# Working
├── backend/
│   └── app/
│       ├── routes/
│       │   ├── sessions.py     # Working
│       │   ├── stats.py        # MISSING
│       │   ├── goals.py        # MISSING
│       │   └── tags.py         # MISSING
│       └── services/
│           ├── discord.py      # MISSING
│           └── music_gen.py    # MISSING
├── sounds/
│   ├── bells/                  # EMPTY
│   ├── ambient/                # EMPTY
│   └── music/                  # MISSING
├── scripts/                    # MISSING entirely
├── config/config.yaml          # Basic config exists
└── PLAN.md                     # Full spec (1500 lines)
```

---

## Commands

```bash
# Start dev servers
./dev start        # frontend:5173 + backend:8000

# Frontend only
cd frontend && bun dev

# Backend only
cd backend && uv run uvicorn app.main:app --reload

# Check database
sqlite3 backend/data/mindfulness.db "SELECT * FROM session;"

# Build
cd frontend && bun run build
```

---

## Priority Order for Next Session

1. **Download bell sounds** - App is silent
2. **Add Stats.tsx with heatmap** - Core retention feature
3. **Add post-session journal UI** - Mood + notes
4. **Add goals + streak tracking** - Motivation
5. **Add History.tsx** - View past sessions
6. **Download ambient sounds** - Rain, ocean, forest
7. **Implement sound mixer** - Layer sounds with volume control

---

## Reference

- Full spec: `PLAN.md` (1500 lines, 12 phases)
- Mock designs: `mock/` directory (Aura-style reference)
- Sound sources: freesound.org, pixabay.com/music (CC0)
