# 🧘 Mindfulness Web App - Development Plan

## Overview

A lightweight, self-hosted meditation and mindfulness web application accessible via Tailscale from iOS devices and Mac. Designed to be beautiful, motivating, and feature-rich while remaining simple to deploy.

---

## Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | React + Vite | Fast builds, HMR, modern DX |
| Styling | Tailwind CSS | Utility-first, responsive design |
| Animations | Framer Motion | Smooth, performant animations |
| Charts | Recharts / D3.js | Heatmaps and statistics |
| Backend | Python (FastAPI) | Async, auto-generated API docs |
| Database | SQLite | Single file, powerful queries |
| Config | YAML | Human-readable configuration |
| i18n | react-i18next | Korean (primary) + English |

---

## Project Structure

```
mindfulness/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timer/           # Meditation timer
│   │   │   ├── Visuals/         # Beautiful animations
│   │   │   │   ├── BreathingCircle/
│   │   │   │   ├── ParticleFlow/
│   │   │   │   ├── GradientWaves/
│   │   │   │   ├── Aurora/
│   │   │   │   ├── Mandala/
│   │   │   │   ├── CosmicDust/
│   │   │   │   └── ZenGarden/
│   │   │   ├── Stats/           # Heatmap & charts
│   │   │   ├── Journal/         # Post-session notes
│   │   │   ├── Goals/           # Daily/weekly goals
│   │   │   └── Settings/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Main dashboard with goals
│   │   │   ├── Meditate.tsx     # Timer & visuals
│   │   │   ├── Stats.tsx        # Statistics & heatmap
│   │   │   ├── History.tsx      # Session history
│   │   │   └── Settings.tsx
│   │   ├── i18n/
│   │   │   ├── ko.json          # Korean (primary)
│   │   │   └── en.json          # English
│   │   ├── stores/              # Zustand state management
│   │   └── assets/
│   │       └── sounds/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── sessions.py
│   │   │   ├── stats.py
│   │   │   ├── goals.py
│   │   │   ├── tags.py
│   │   │   └── sounds.py
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── discord.py       # Discord notifications
│   │   │   ├── music_gen.py     # Gemini Lyria integration
│   │   │   └── scheduler.py     # Reminder scheduling
│   │   └── config.py
│   ├── requirements.txt
│   └── data/
│       └── mindfulness.db
│
├── config/
│   └── config.yaml
│
├── sounds/
│   ├── bells/                   # Start/end bells
│   │   ├── tibetan_bowl.mp3
│   │   ├── singing_bowl.mp3
│   │   ├── zen_gong.mp3
│   │   ├── soft_chime.mp3
│   │   └── bird_song.mp3
│   ├── ambient/                 # Background sounds
│   │   ├── rain_light.mp3
│   │   ├── rain_heavy.mp3
│   │   ├── ocean_waves.mp3
│   │   ├── forest.mp3
│   │   ├── campfire.mp3
│   │   ├── wind.mp3
│   │   ├── stream.mp3
│   │   ├── thunderstorm.mp3
│   │   ├── white_noise.mp3
│   │   ├── brown_noise.mp3
│   │   └── pink_noise.mp3
│   └── generated/               # AI-generated music
│
├── scripts/
│   ├── generate_music.py        # Gemini Lyria music generation
│   ├── download_sounds.py       # Download free sounds
│   └── backup_db.py
│
└── docker-compose.yaml          # Optional containerization
```

---

## Core Features

### 1. Meditation Timer ⏱️

**Preset Durations:**
- 3, 5, 10, 12, 15, 20, 30, 45, 60 minutes
- Custom duration input

**Bell Sounds (Start/End):**
| Sound | Description |
|-------|-------------|
| Tibetan Singing Bowl | Deep, resonant tone |
| Zen Gong | Traditional Japanese |
| Soft Chime | Gentle, minimal |
| Crystal Bowl | Clear, high-pitched |
| Bird Song | Natural awakening |
| Custom Upload | User's own sounds |

**Interval Bells:** Optional bells at intervals (e.g., every 5 minutes)

---

### 2. Beautiful Visuals 🎨

Apple Watch-inspired animations during meditation:

| Visual | Description | Technique |
|--------|-------------|-----------|
| **Breathing Circle** | Expands/contracts with breath rhythm (4-7-8, box breathing) | CSS transform + scale |
| **Particle Flow** | Soft particles drifting across screen | Canvas / Three.js |
| **Gradient Waves** | Flowing gradient colors | CSS animation |
| **Aurora** | Northern lights effect | WebGL shaders |
| **Mandala** | Slowly rotating geometric patterns | SVG animation |
| **Cosmic Dust** | Stars and nebula slowly moving | Canvas particles |
| **Zen Garden** | Minimalist sand ripples | SVG paths |
| **Liquid Metal** | Mercury-like fluid motion | Metaball algorithm |
| **Sacred Geometry** | Flower of life, Metatron's cube | SVG morph |
| **Ocean Depth** | Deep sea bioluminescence | Canvas + glow effects |

Each visual should:
- Be configurable (speed, colors)
- Support dark/light mode
- Be performant on mobile devices
- Have smooth transitions between states

---

### 3. Ambient Sounds 🎵

**Categories:**

| Category | Sounds |
|----------|--------|
| **Rain** | Light rain, Heavy rain, Rain on window, Thunderstorm |
| **Nature** | Forest, Ocean waves, River stream, Wind, Birds |
| **Fire** | Campfire, Fireplace crackling |
| **Urban** | Café ambience, Library, Train |
| **Noise** | White, Pink, Brown noise |
| **Music** | Lo-fi, Ambient drone, Binaural beats |

**Sound Mixer:**
- Layer multiple sounds simultaneously
- Individual volume controls
- Master volume
- Fade in/out transitions
- Save favorite combinations as presets

**Sources for Free Sounds:**
- [Freesound.org](https://freesound.org/) - CC licensed sounds
- [Mixkit](https://mixkit.co/free-sound-effects/nature/) - Royalty-free
- [Pixabay](https://pixabay.com/sound-effects/) - No attribution required
- [Ambient-Mixer](https://www.ambient-mixer.com/) - CC Sampling Plus

---

### 4. AI Music Generation 🤖

Using **Google Gemini Lyria RealTime API**:

- Generate custom meditation music on demand
- Text prompts like "calm ambient music for deep meditation"
- Real-time streaming audio generation
- Save generated tracks to library
- Mood/style presets:
  - Deep relaxation
  - Focus & concentration
  - Sleep preparation
  - Morning energy
  - Stress relief

---

### 5. Tags System 🏷️

**Multi-select tags for sessions:**

| Category | Example Tags |
|----------|-------------|
| **Time of Day** | Morning, Afternoon, Evening, Night |
| **Purpose** | Stress relief, Focus, Sleep, Energy, Gratitude |
| **Type** | Breath-focused, Body scan, Open awareness, Loving-kindness |
| **Location** | Home, Office, Outdoors, Commute |
| **Custom** | User-defined tags |

Features:
- Create custom tags with colors
- Filter history/stats by tags
- Tag suggestions based on time of day
- Tag-based insights ("You meditate most when tagged 'Stress relief'")

---

### 6. Goals & Motivation 🎯

**Goal Types:**

| Goal | Example |
|------|---------|
| **Daily Duration** | Meditate for 10 minutes today |
| **Weekly Sessions** | Complete 5 sessions this week |
| **Streak** | Maintain 7-day streak |
| **Monthly Total** | 300 minutes this month |

**Home Dashboard Display:**
- Current streak (prominent)
- Today's progress ring
- Weekly goal progress
- Motivational quote (optional)
- Quick-start button

**Gamification (Tasteful):**
- Milestone badges (7-day, 30-day, 100-day streaks)
- Monthly summaries
- Personal bests
- No leaderboards (keep it personal)

---

### 7. Post-Session Journal 📝

After each meditation:

| Field | Type | Required |
|-------|------|----------|
| Mood Before | Emoji selector (😰😐😊😌🧘) | Optional |
| Mood After | Emoji selector | Optional |
| Energy Level | 1-5 scale | Optional |
| Notes | Free text (500 char max) | Optional |
| Tags | Multi-select | Optional |

Auto-recorded:
- Date & time
- Duration
- Visual used
- Sounds used
- Completed vs. abandoned

---

### 8. Statistics & Visualization 📊

**Heatmap (GitHub-style):**
- Full year view
- Color intensity = minutes meditated
- Click day for details
- Streak highlighting

**Charts:**
- Weekly/Monthly bar charts
- Time of day distribution (radar chart)
- Tag frequency (pie chart)
- Mood trends over time
- Session length trends

**Summary Stats:**
- Total sessions (all time)
- Total minutes
- Current streak
- Longest streak
- Average session length
- Most used tags
- Favorite time of day
- Completion rate

---

### 9. Discord Integration 🔔

**Webhook Notifications:**

| Event | Message Example |
|-------|-----------------|
| Session Complete | "🧘 Completed 15-min meditation! Streak: 7 days" |
| Streak Milestone | "🔥 Amazing! 30-day meditation streak achieved!" |
| Weekly Summary | "📊 This week: 5 sessions, 75 minutes total" |
| Goal Achieved | "🎯 Weekly goal completed: 5/5 sessions!" |
| Reminder | "💭 Time for your daily mindfulness practice" |

**Reminder System:**
- Configurable reminder times
- Multiple reminders per day
- Skip weekends option
- Gentle, encouraging messages

---

### 10. Settings & Configuration ⚙️

**config.yaml:**

```yaml
# ===========================================
# Mindfulness App Configuration
# ===========================================

# Server
server:
  host: "0.0.0.0"
  port: 8000
  debug: false
  cors_origins:
    - "http://localhost:5173"
    - "http://100.x.x.x:5173"  # Tailscale IP

# Database
database:
  path: "./backend/data/mindfulness.db"
  backup:
    enabled: true
    interval_hours: 24
    keep_last: 7

# Localization
i18n:
  default_language: "ko"  # Korean
  available: ["ko", "en"]

# Timer
timer:
  presets: [3, 5, 10, 12, 15, 20, 30, 45, 60]
  default_duration: 10
  default_bell: "singing_bowl"
  default_visual: "breathing_circle"
  interval_bell:
    enabled: false
    interval_minutes: 5

# Visuals
visuals:
  available:
    - id: breathing_circle
      name_ko: "호흡 원"
      name_en: "Breathing Circle"
    - id: particle_flow
      name_ko: "파티클 흐름"
      name_en: "Particle Flow"
    - id: gradient_waves
      name_ko: "그라데이션 물결"
      name_en: "Gradient Waves"
    - id: aurora
      name_ko: "오로라"
      name_en: "Aurora"
    - id: mandala
      name_ko: "만다라"
      name_en: "Mandala"
    - id: cosmic_dust
      name_ko: "우주 먼지"
      name_en: "Cosmic Dust"
    - id: zen_garden
      name_ko: "선 정원"
      name_en: "Zen Garden"
  default_speed: 1.0
  dark_mode: true

# Sounds
sounds:
  bells_dir: "./sounds/bells"
  ambient_dir: "./sounds/ambient"
  generated_dir: "./sounds/generated"
  default_ambient_volume: 0.5

# Goals
goals:
  daily_default_minutes: 10
  weekly_default_sessions: 5
  show_streaks: true
  show_badges: true

# Discord
discord:
  enabled: true
  webhook_url: "${DISCORD_WEBHOOK_URL}"  # From environment
  language: "ko"  # Message language
  notifications:
    session_complete: true
    streak_milestones: [7, 14, 30, 60, 100, 365]
    weekly_summary: true
    weekly_summary_day: "sunday"
    daily_reminder:
      enabled: true
      times: ["09:00", "21:00"]
      timezone: "Asia/Seoul"

# AI Music Generation
music_generation:
  enabled: true
  provider: "gemini"
  api_key: "${GEMINI_API_KEY}"  # From environment
  output_dir: "./sounds/generated"
  max_duration_seconds: 600
  presets:
    - id: deep_relaxation
      prompt: "calm ambient meditation music, slow tempo, peaceful"
    - id: focus
      prompt: "concentration music, minimal, subtle rhythms"
    - id: sleep
      prompt: "sleep music, very slow, dreamy, fade out"
    - id: morning
      prompt: "gentle awakening music, hopeful, gradually building"

# Tags (defaults, users can add more)
tags:
  defaults:
    - id: morning
      name_ko: "아침"
      name_en: "Morning"
      color: "#FFB347"
    - id: evening
      name_ko: "저녁"
      name_en: "Evening"
      color: "#7B68EE"
    - id: stress
      name_ko: "스트레스 해소"
      name_en: "Stress Relief"
      color: "#98D8C8"
    - id: focus
      name_ko: "집중"
      name_en: "Focus"
      color: "#87CEEB"
    - id: sleep
      name_ko: "수면"
      name_en: "Sleep"
      color: "#DDA0DD"
    - id: gratitude
      name_ko: "감사"
      name_en: "Gratitude"
      color: "#F0E68C"

# PWA
pwa:
  enabled: true
  name: "Mindfulness"
  short_name: "Mindful"
  theme_color: "#1a1a2e"
  background_color: "#16213e"
```

---

## Database Schema

```sql
-- Sessions table
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    planned_duration_seconds INTEGER NOT NULL,
    actual_duration_seconds INTEGER,
    completed BOOLEAN DEFAULT FALSE,

    -- Settings used
    visual_type TEXT,
    bell_sound TEXT,
    ambient_sounds TEXT,  -- JSON array
    ambient_volumes TEXT, -- JSON object

    -- Journal
    mood_before TEXT,
    mood_after TEXT,
    energy_level INTEGER,
    note TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Session tags (many-to-many)
CREATE TABLE session_tags (
    session_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (session_id, tag_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Tags
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    color TEXT DEFAULT '#808080',
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Goals
CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,  -- 'daily_minutes', 'weekly_sessions', 'monthly_minutes'
    target_value INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily stats cache
CREATE TABLE daily_stats (
    date DATE PRIMARY KEY,
    total_sessions INTEGER DEFAULT 0,
    total_seconds INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0
);

-- Streaks
CREATE TABLE streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date DATE NOT NULL,
    end_date DATE,
    length INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT FALSE
);

-- User settings (key-value store)
CREATE TABLE user_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sound presets (saved ambient combinations)
CREATE TABLE sound_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sounds TEXT NOT NULL,  -- JSON
    volumes TEXT NOT NULL, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Generated music
CREATE TABLE generated_music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    prompt TEXT NOT NULL,
    duration_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_completed ON sessions(completed);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
```

---

## API Endpoints

```
# Sessions
POST   /api/sessions                    # Start new session
PATCH  /api/sessions/{id}               # Update session (complete, add notes)
GET    /api/sessions                    # List sessions (with filters, pagination)
GET    /api/sessions/{id}               # Get session details
DELETE /api/sessions/{id}               # Delete session

# Statistics
GET    /api/stats/summary               # Overall statistics
GET    /api/stats/heatmap?year=2026     # Heatmap data for year
GET    /api/stats/chart?period=weekly   # Chart data
GET    /api/stats/streak                # Current and longest streak
GET    /api/stats/insights              # AI-generated insights

# Goals
GET    /api/goals                       # List active goals
POST   /api/goals                       # Create goal
PATCH  /api/goals/{id}                  # Update goal
DELETE /api/goals/{id}                  # Delete goal
GET    /api/goals/progress              # Current progress on all goals

# Tags
GET    /api/tags                        # List all tags
POST   /api/tags                        # Create custom tag
PATCH  /api/tags/{id}                   # Update tag
DELETE /api/tags/{id}                   # Delete custom tag

# Sounds
GET    /api/sounds/bells                # List bell sounds
GET    /api/sounds/ambient              # List ambient sounds
GET    /api/sounds/presets              # List saved presets
POST   /api/sounds/presets              # Save new preset
DELETE /api/sounds/presets/{id}         # Delete preset

# Music Generation
POST   /api/music/generate              # Generate new music
GET    /api/music/generated             # List generated tracks
DELETE /api/music/generated/{id}        # Delete generated track

# Settings
GET    /api/settings                    # Get user settings
PUT    /api/settings                    # Update settings

# Discord
POST   /api/discord/test                # Send test notification
GET    /api/discord/status              # Check webhook status

# Health
GET    /api/health                      # Server health check
```

---

## Development Phases

### Phase 1: Foundation ✅
- [ ] Project scaffolding (React + Vite + Tailwind)
- [ ] FastAPI backend setup
- [ ] SQLite database initialization
- [ ] YAML config loading
- [ ] Basic timer functionality
- [ ] Start/end bell sounds
- [ ] Session CRUD API
- [ ] Basic responsive UI
- [ ] i18n setup (Korean + English)

### Phase 2: Visuals 🎨
- [ ] Breathing Circle animation
- [ ] Particle Flow effect
- [ ] Gradient Waves
- [ ] Aurora effect
- [ ] Mandala rotation
- [ ] Cosmic Dust
- [ ] Zen Garden
- [ ] Visual selector UI
- [ ] Dark/Light mode support

### Phase 3: Sounds 🎵
- [ ] Download/collect free ambient sounds
- [ ] Audio player with Web Audio API
- [ ] Sound mixer (multi-layer)
- [ ] Volume controls
- [ ] Fade in/out transitions
- [ ] Sound preset saving
- [ ] Interval bell feature

### Phase 4: Journal & Tags 📝
- [ ] Post-session journal UI
- [ ] Mood emoji selector
- [ ] Energy level slider
- [ ] Notes input
- [ ] Tag system implementation
- [ ] Multi-select tag UI
- [ ] Custom tag creation
- [ ] Tag filtering in history

### Phase 5: Statistics 📊
- [ ] GitHub-style heatmap component
- [ ] Weekly/Monthly charts
- [ ] Streak calculation logic
- [ ] Summary statistics cards
- [ ] Time of day analysis
- [ ] Tag frequency chart
- [ ] Mood trend visualization
- [ ] Export data feature

### Phase 6: Goals & Gamification 🎯
- [ ] Goal creation UI
- [ ] Daily/Weekly/Monthly goals
- [ ] Progress tracking
- [ ] Home dashboard redesign
- [ ] Goal progress rings
- [ ] Streak display
- [ ] Milestone badges
- [ ] Achievement notifications

### Phase 7: Discord Integration 🔔
- [ ] Webhook configuration
- [ ] Session complete notifications
- [ ] Streak milestone alerts
- [ ] Weekly summary generation
- [ ] Reminder scheduler
- [ ] Notification preferences UI

### Phase 8: AI Music Generation 🤖
- [ ] Gemini Lyria API integration
- [ ] Music generation UI
- [ ] Prompt presets
- [ ] Generated music library
- [ ] Music player integration

### Phase 9: Polish & Deploy ✨
- [ ] PWA configuration
- [ ] iOS home screen optimization
- [ ] Performance optimization
- [ ] Loading states & skeletons
- [ ] Error handling
- [ ] Backup script
- [ ] Deployment documentation
- [ ] Docker setup (optional)

---

## Design Principles

Based on research from top meditation apps:

1. **Calm & Muted Colors**
   - Dark mode primary: Deep blues, purples
   - Light mode: Soft pastels, warm whites
   - Avoid harsh contrasts

2. **Soft Shapes & Smooth Lines**
   - Rounded corners everywhere
   - Smooth animations (ease-in-out)
   - No sharp edges

3. **Minimal Cognitive Load**
   - One primary action per screen
   - Clear, simple navigation
   - Reduce choices when meditating

4. **Tasteful Gamification**
   - Focus on personal progress, not competition
   - Streaks as motivation, not pressure
   - Celebrate milestones gently

5. **Reliability First**
   - Timer must be rock-solid
   - Sounds must play reliably
   - No interruptions during meditation

---

## Reference Resources

**Design Inspiration:**
- [Headspace](https://www.headspace.com/) - Gamification & UX
- [Calm](https://www.calm.com/) - Personalization & sounds
- [Insight Timer](https://insighttimer.com/) - Community & stats

**Open Source References:**
- [meditation-timer (GitHub)](https://github.com/benji6/meditation-timer) - PWA timer
- [Bodhi Timer](https://github.com/yuttadhammo/BodhiTimer) - Bell sounds

**Free Sound Sources:**
- [Freesound.org](https://freesound.org/)
- [Mixkit](https://mixkit.co/)
- [Pixabay Sounds](https://pixabay.com/sound-effects/)
- [Ambient-Mixer](https://www.ambient-mixer.com/)

**Technical:**
- [Framer Motion](https://www.framer.com/motion/) - React animations
- [Gemini Lyria](https://ai.google.dev/gemini-api/docs/music-generation) - Music generation
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

**CSS Animation Examples:**
- [Breathing CSS Animation](https://codepen.io/machi/pen/YymGzP)
- [Calm Breathe Bubble](https://codepen.io/stiliyana/pen/dqoOBr)
- [Focused Breathing Tutorial](https://dev.to/scrabill/focused-breathing-a-css-animation-to-help-with-meditation-and-focused-breathing-exercises-dob)

---

## Questions for Discussion ❓

1. **Visual Priority:** Which 3-4 visuals should we implement first?
2. **Sound Priority:** Which ambient sounds are most important to you?
3. **Breathing Patterns:** Should we include guided breathing patterns (4-7-8, box breathing)?
4. **Data Export:** CSV, JSON, or both?
5. **Backup Location:** Local only, or option to sync somewhere?

---

## Next Steps

1. ✅ Finalize this plan
2. ⬜ Set up project structure
3. ⬜ Initialize React + FastAPI
4. ⬜ Begin Phase 1 implementation

---

*Last updated: 2026-02-04*
