# Mindfulness App - Full Implementation Plan

**Current:** ~15% complete | **Target:** Full Phase 4-12 implementation

## Summary

6 sprints to complete remaining phases. P0/P1 items first.

```
Sprint 1: Audio (P0)     ─► Sprint 6: Sound Mixer (P2)
Sprint 2: Stats (P0)
Sprint 3: Journal (P1)   ─► Sprint 5: Tags in Journal
Sprint 4: Goals (P1)
Sprint 5: History (P1)
```

---

## Sprint 1: Audio Foundation (P0)

### 1.1 Download Sounds Script
**Create:** `scripts/download_sounds.py`
- Download CC0/CC-BY bells: tibetan_bowl, singing_bowl, zen_gong, soft_chime
- Download ambient: rain_light, ocean_waves, forest
- Save to `/sounds/bells/`, `/sounds/ambient/`

### 1.2 Bell Selector
**Modify:** `frontend/src/pages/Settings.tsx`
- Add bell sound dropdown

**Modify:** `frontend/src/stores/settingsStore.ts`
- Add `bellSound: string`, `setBellSound()`

**Modify:** `frontend/src/components/BellPlayer.tsx`
- Read bell from settingsStore

### 1.3 Sounds API
**Create:** `backend/app/routes/sounds.py`
```
GET /api/sounds/bells
GET /api/sounds/ambient
```

**Modify:** `backend/app/main.py` - include router

---

## Sprint 2: Statistics & Heatmap (P0)

### 2.1 Stats API
**Create:** `backend/app/routes/stats.py`
```
GET /api/stats/summary   # {totalSessions, totalMinutes, currentStreak, longestStreak}
GET /api/stats/heatmap   # [{date, minutes, sessions}...]
GET /api/stats/streak    # {current, longest}
```

### 2.2 Stats API Client
**Create:** `frontend/src/api/stats.ts`

### 2.3-2.4 Stats Components
**Create:** `frontend/src/components/Stats/Heatmap.tsx` - GitHub-style year grid
**Create:** `frontend/src/components/Stats/SummaryCards.tsx` - 4 stat cards

### 2.5 Stats Page
**Create:** `frontend/src/pages/Stats.tsx`
**Modify:** `frontend/src/App.tsx` - add `/stats` route
**Modify:** `frontend/src/pages/Home.tsx` - add nav link

---

## Sprint 3: Post-Session Journal (P1)

### 3.1 Journal Components
**Create:** `frontend/src/components/Journal/MoodSelector.tsx` - emoji row
**Create:** `frontend/src/components/Journal/NotesInput.tsx` - textarea

### 3.2 Post-Session Modal
**Create:** `frontend/src/components/Journal/PostSessionModal.tsx`
- Appears when timer completes
- Mood selector + notes + Skip/Save

### 3.3 Meditate Integration
**Modify:** `frontend/src/pages/Meditate.tsx` - show modal on complete
**Modify:** `frontend/src/stores/sessionStore.ts` - add `updateJournal()`

---

## Sprint 4: Goals & Streaks (P1)

### 4.1 Database Schema
**Create:** `backend/app/models/goal.py`
```python
class Goal(SQLModel, table=True):
    id, type, target_value, start_date, end_date, is_active
```

**Create:** `backend/app/models/streak.py`

**Modify:** `backend/app/database.py` - import models

### 4.2 Goals API
**Create:** `backend/app/routes/goals.py`
```
GET /api/goals
POST /api/goals
PATCH /api/goals/{id}
DELETE /api/goals/{id}
GET /api/goals/progress
```

### 4.3 Goals Frontend API
**Create:** `frontend/src/api/goals.ts`

### 4.4 Goal Components
**Create:** `frontend/src/components/Goals/GoalRing.tsx` - circular progress
**Create:** `frontend/src/components/Goals/StreakDisplay.tsx` - fire emoji streak

### 4.5 Home Dashboard
**Modify:** `frontend/src/pages/Home.tsx`
- Fetch goals progress
- Display GoalRing, StreakDisplay

---

## Sprint 5: History & Tags (P1)

### 5.1 Tags Schema
**Create:** `backend/app/models/tag.py`
```python
class Tag(SQLModel, table=True): id, name_ko, name_en, color, is_default
class SessionTag(SQLModel, table=True): session_id, tag_id
```

### 5.2 Tags API
**Create:** `backend/app/routes/tags.py`
```
GET /api/tags
POST /api/tags
DELETE /api/tags/{id}
POST /api/sessions/{id}/tags
```

### 5.3 History API Extension
**Modify:** `backend/app/routes/sessions.py`
- Add filters: `tag_id`, `from_date`, `to_date`

### 5.4 History Page
**Create:** `frontend/src/pages/History.tsx`
- List past sessions with filters
**Modify:** `frontend/src/App.tsx` - add `/history` route

### 5.5 Tag Selector
**Modify:** `frontend/src/components/Journal/PostSessionModal.tsx`
- Add tag multi-select

---

## Sprint 6: Sound Mixer (P2)

### 6.1 Audio Layers Hook
**Create:** `frontend/src/hooks/useAudioLayers.ts`
- Web Audio API graph: bell + ambient + master gain
- `playBell()`, `addAmbient()`, `setVolume()`, `fadeOutAll()`

### 6.2 Sound Mixer UI
**Create:** `frontend/src/components/SoundMixer/SoundMixer.tsx`
- List ambient sounds with toggle + volume slider
- Master volume

### 6.3 Meditate Integration
**Modify:** `frontend/src/pages/Meditate.tsx`
- Add SoundMixer panel
- Start/fade ambient with timer

### 6.4 Sound Presets (Optional)
**Create:** `backend/app/models/sound_preset.py`
**Create:** API endpoints for presets

---

## Key Patterns to Follow

| Component | Reference File |
|-----------|---------------|
| Backend route | `backend/app/routes/sessions.py` |
| Frontend API | `frontend/src/api/sessions.ts` |
| Zustand store | `frontend/src/stores/sessionStore.ts` |
| SQLModel | `backend/app/models/session.py` |
| Page component | `frontend/src/pages/Meditate.tsx` |

---

## Verification

After each sprint:
1. `./dev start` - both servers running
2. `curl localhost:8000/api/<endpoint>` - API responds
3. Navigate UI - features visible
4. `sqlite3 backend/data/mindfulness.db` - tables created

Full test:
1. Start meditation -> complete -> journal modal appears
2. Save mood/notes -> check database
3. View /stats -> heatmap shows session
4. View /history -> session listed with tags

---

## Out of Scope (P3)

- Phase 7: Data Export (JSON/CSV/iCal/Markdown)
- Phase 9: Discord Integration
- Phase 10: AI Music Generation
- Phase 12: PWA, Docker

