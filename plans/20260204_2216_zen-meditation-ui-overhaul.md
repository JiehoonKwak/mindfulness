# Mindfulness App Major Overhaul Plan

## Problem Summary

App is functionally ~85% complete but UI is "AI slop" - generic, inconsistent, unfocused. User wants minimal zen aesthetic suitable for focus/meditation.

### Issues Identified

| Category | Issue | Severity |
|----------|-------|----------|
| Theme | 8 generic themes (Ocean teal+pink cliché) | High |
| Typography | System fonts only, no elegance | High |
| Home | Shows "목표 없음", wants heatmap | High |
| Visuals | 9/10 have no breathing sync, chaotic | High |
| Stats/History | Separate pages, emoji icons | Medium |
| Settings | Too many useless options | Medium |
| Discord | Methods exist but never triggered | Medium |
| Reminders | No periodic scheduler | Medium |
| Music | Placeholder only, no generation | Low |

---

## Phase 1: Core UI Foundation (Sprint 1)

### 1.1 Strip Themes to 2

**File:** `frontend/src/styles/themes.css`

```css
[data-theme="zen-dark"] {
  --color-bg: #000000;           /* Pure AMOLED black (user choice) */
  --color-surface: #0a0a0a;
  --color-primary: #ffffff;
  --color-accent: #6366f1;       /* Indigo accent */
  --color-text: #ffffff;
  --color-text-muted: #6b7280;
  --color-border: #1f1f1f;
}

[data-theme="zen-light"] {
  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-primary: #111827;
  --color-accent: #6366f1;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
}
```

**Files to modify:**
- `frontend/src/styles/themes.css` - Replace 8 themes with 2
- `frontend/src/stores/settingsStore.ts` - Update ThemeId type
- `frontend/src/components/ThemeSwitcher.tsx` - Simple toggle

### 1.2 Typography System

**File:** `frontend/src/index.css`

- Keep system fonts (user choice) - no extra font loading
- Optimize stack: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Define scale: display (4rem light), title (1.5rem medium), body (1rem), caption (0.875rem muted)

### 1.3 SVG Icon System

**New file:** `frontend/src/components/Icons/index.tsx`

Replace all emoji usage (🔥💭🧘⏱🏆) with clean SVG icons.

---

## Phase 2: Page Redesigns (Sprint 2)

### 2.1 Home Page

**File:** `frontend/src/pages/Home.tsx`

**Changes:**
- Hero: Heatmap (compact) with streak/weekly stats below
- Remove "목표 없음" - show heatmap regardless
- Large CTA buttons: "Start Meditation", "Breathing Guide"
- Minimal bottom nav

### 2.2 Merge Stats + History → Insights

**Files:**
- Create `frontend/src/pages/Insights.tsx`
- Delete `frontend/src/pages/History.tsx`
- Update `frontend/src/App.tsx` routes

**Structure:**
```
Insights Page
├── Tab: Overview (summary cards + heatmap + goal progress)
└── Tab: History (session list with filters)
```

### 2.3 Meditate Page

**File:** `frontend/src/pages/Meditate.tsx`

- Cleaner timer UI (larger display, less clutter)
- Visual selector with **hover preview**
- Better sound mixer positioning

### 2.4 Settings Simplification

**File:** `frontend/src/pages/Settings.tsx`

- Theme: Simple dark/light toggle
- Goals: Add goal configuration
- Music: Add music library/generation section
- Discord: Add reminder schedule settings
- Remove emoji usage

---

## Phase 3: Visual Effects Overhaul (Sprint 3)

### 3.1 Keep

- `Aurora/` - WebGL shader, excellent

### 3.2 Delete (8 visuals)

- `BreathingCircle/` - Generic
- `ParticleFlow/` - Chaotic
- `GradientWaves/` - CSS only
- `Mandala/` - Fixed rotation
- `CosmicDust/` - Busy
- `LiquidMetal/` - Chaotic
- `SacredGeometry/` - No breathing sync
- `OceanDepth/` - Generic
- `ZenGarden/` - Too subtle

### 3.3 Create New (Three.js + Breathing Sync)

**Pattern from `AuraBreathing.tsx`:**
```typescript
const { phase, phaseTime, pattern } = useBreathingStore();
// Calculate 0-1 progress, map to shader uniforms
// Lerp for smooth transitions
```

**New visuals:**

| Visual | Description | Technique |
|--------|-------------|-----------|
| BreathSphere | Glowing orb expands/contracts | Three.js sphere + shader |
| FloatingOrbs | 3-5 orbs pulse with breath | Three.js + instancedMesh |
| RippleWater | Water ripples on exhale | Three.js plane + displacement |

### 3.4 Visual Preview on Hover

**File:** `frontend/src/components/Visuals/VisualSelector.tsx`

- On hover: Show 80x80px animated preview above button
- Use lazy loading for preview components

---

## Phase 4: Backend Completion (Sprint 4)

### 4.1 Discord Notification Triggers

**File:** `backend/app/routes/sessions.py`

```python
# In update_session() after session.completed = True:
if session_update.completed:
    await discord_service.notify_session_complete(session)
    streak = calculate_streak(db)
    if streak in [7, 14, 30, 60, 100]:
        await discord_service.notify_streak_milestone(streak)
```

### 4.2 APScheduler for Periodic Reminders

**New files:**
- `backend/app/services/scheduler.py`
- `backend/app/models/reminder.py`
- `backend/app/routes/reminders.py`

**Jobs:**
- Daily reminder (configurable time) if no session today
- Weekly summary (Sunday evening)

**Update:** `backend/app/main.py` lifespan to init scheduler

### 4.3 Music Generation (Gemini API)

**File:** `backend/app/services/music_gen.py`

- Integrate Gemini API for music generation
- Save to `backend/sounds/music/generated/`
- Update status in DB

**New UI:** `frontend/src/components/MusicSelector/MusicSelector.tsx`

---

## Phase 5: Verification (Sprint 5)

### Browser Automation Tests

**Option A:** Use `agent-browser` skill for visual verification
**Option B:** Playwright test suite

**Test cases:**
1. Theme toggle (zen-dark ↔ zen-light)
2. Home shows heatmap, no "목표 없음"
3. Visual preview on hover
4. Session completion → DB persistence
5. Discord notification trigger

---

## Critical Files

| File | Purpose |
|------|---------|
| `frontend/src/styles/themes.css` | Theme definitions (strip to 2) |
| `frontend/src/pages/Home.tsx` | Landing redesign |
| `frontend/src/pages/Meditate.tsx` | Timer UI + visual selector |
| `frontend/src/components/BreathingGuide/AuraBreathing.tsx` | Pattern for new visuals |
| `frontend/src/components/Visuals/` | Delete 8, create 3 |
| `backend/app/routes/sessions.py` | Add Discord triggers |
| `backend/app/services/scheduler.py` | NEW: Reminder scheduler |

---

## Implementation Order

```
Sprint 1 (Foundation)     Sprint 2 (Pages)        Sprint 3 (Visuals)
├─ Theme system          ├─ Home redesign        ├─ Delete 8 old visuals
├─ Typography            ├─ Insights page        ├─ Create BreathSphere
├─ Icon system           ├─ Meditate cleanup     ├─ Create FloatingOrbs
└─ Spacing               └─ Settings             └─ Visual preview
                                    │
                         Sprint 4 (Backend)       Sprint 5 (Verify)
                         ├─ Discord triggers      ├─ Browser tests
                         ├─ APScheduler           └─ Visual validation
                         └─ Gemini music
```

---

## User Choices

- **Theme:** Pure AMOLED black (#000000)
- **Font:** System fonts (no extra loading)
- **Visuals:** 3 new (BreathSphere, FloatingOrbs, RippleWater)
- **Music:** Implement Gemini API integration

---

## Verification Checklist

- [ ] Only 2 themes available (zen-dark, zen-light)
- [ ] zen-dark uses pure #000000 background
- [ ] System fonts with optimized stack
- [ ] Home shows heatmap, not "목표 없음"
- [ ] Stats+History merged into Insights page
- [ ] Visual selector shows preview on hover
- [ ] Only Aurora + 3 new breathing-synced visuals remain (4 total)
- [ ] Session completion triggers Discord notification
- [ ] Periodic reminder scheduler works
- [ ] Gemini music generation functional with GEMINI_API_KEY

