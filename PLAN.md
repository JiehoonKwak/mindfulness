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

Multiple options for generating meditation background music:

#### Option 1: Meta MusicGen (Recommended - Free & Open Source)

**Best for self-hosted deployment:**
- Fully open source (MIT license for code, CC-BY-NC 4.0 for weights)
- Run locally on your server (no API costs)
- Python library: `audiocraft`
- Models: small (300M), medium (1.5B), large (3.3B)

```python
from audiocraft.models import MusicGen

model = MusicGen.get_pretrained('facebook/musicgen-medium')
model.set_generation_params(duration=60)  # 60 seconds

prompts = ['calm ambient meditation music, slow tempo, peaceful drone']
wav = model.generate(prompts)
```

**Pros:** Free, private, no API limits
**Cons:** Requires GPU (or slow on CPU), ~4GB VRAM for medium model

#### Option 2: Stable Audio Open (Free & Open Source)

- Open source by Stability AI
- Up to 47 seconds of audio per generation
- Trained on Freesound & Free Music Archive (CC licensed)
- Can be fine-tuned on custom audio

```python
from diffusers import StableAudioPipeline

pipe = StableAudioPipeline.from_pretrained("stabilityai/stable-audio-open-1.0")
audio = pipe("peaceful meditation ambient music").audios[0]
```

#### Option 3: Google Gemini Lyria RealTime (API)

- Real-time streaming music generation
- WebSocket-based continuous generation
- Good for live, adaptive music
- **Pricing:** Paid API (check current rates)

#### Option 4: Mubert API (Freemium)

- Cloud-based, no local GPU needed
- Developer API available
- Good for meditation/ambient genres
- **Free tier:** Limited generations

#### Option 5: Suno (via Third-Party APIs)

- High-quality full songs
- **Free tier:** 50 credits/day (non-commercial)
- Third-party API providers:
  - Apiframe: 300 free credits/month
  - AIMLAPI: Free trial available

#### Recommendation for This Project

**Primary:** Meta MusicGen (self-hosted, free)
**Fallback:** Pre-generated library of meditation tracks

| Provider | Cost | Quality | Local | Best For |
|----------|------|---------|-------|----------|
| MusicGen | Free | Good | Yes | Self-hosted |
| Stable Audio Open | Free | Good | Yes | Short samples |
| Gemini Lyria | Paid | Excellent | No | Real-time |
| Mubert | Freemium | Good | No | Quick cloud |
| Suno | Freemium | Excellent | No | Full tracks |

#### Music Generation Presets

```yaml
presets:
  - id: deep_relaxation
    prompt: "calm ambient meditation music, slow tempo, peaceful drone, no drums"
  - id: focus
    prompt: "minimal concentration music, subtle rhythms, lo-fi ambient"
  - id: sleep
    prompt: "very slow dreamy music, soft pads, fade out, sleep inducing"
  - id: morning
    prompt: "gentle awakening music, hopeful, gradually building, soft piano"
  - id: nature_blend
    prompt: "ambient music with nature sounds, birds, flowing water, peaceful"
  - id: tibetan
    prompt: "tibetan singing bowls, meditation bells, spiritual ambient"
```

---

### 5. Breathing Guide 🌬️

Apple Watch-inspired breathing exercises with beautiful animations.

#### Breathing Patterns

| Pattern | Inhale | Hold | Exhale | Hold | Best For |
|---------|--------|------|--------|------|----------|
| **4-7-8 Relaxing** | 4s | 7s | 8s | - | Sleep, anxiety relief |
| **Box Breathing** | 4s | 4s | 4s | 4s | Focus, stress relief |
| **Calming Breath** | 4s | - | 6s | - | Quick relaxation |
| **Energizing** | 6s | - | 2s | - | Morning wake-up |
| **Cyclic Sighing** | 2x inhale | - | long exhale | - | Mood improvement |
| **Custom** | User defined | User defined | User defined | User defined | Personalized |

#### Scientific Basis

- **4-7-8 technique**: Developed by Dr. Andrew Weil, based on pranayama yoga
- Activates parasympathetic nervous system ("rest and digest")
- Stanford study: 5 min/day cyclic sighing improved mood more than meditation alone
- Reduces heart rate and blood pressure

#### Apple Watch Style Animation

Flower-petal animation using CSS:

```css
/* Core technique from CSS-Tricks */
.circle {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  mix-blend-mode: screen;
  animation: breathe 8s cubic-bezier(.5, 0, .5, 1) infinite alternate;
}

.circle:nth-child(odd) { background: #61bea2; }  /* Green petals */
.circle:nth-child(even) { background: #529ca0; } /* Blue petals */

@keyframes breathe {
  0% { transform: scale(0.5) rotate(0deg); }
  100% { transform: scale(1) rotate(180deg); }
}
```

#### Breathing Guide Features

- **Visual cues**: Expanding/contracting animation synced with timing
- **Audio cues**: Optional soft tones for inhale/exhale transitions
- **Haptic feedback**: Vibration patterns (on supported devices)
- **Text prompts**: "Breathe in...", "Hold...", "Breathe out..."
- **Cycle counter**: Track completed breath cycles
- **Customizable speed**: Slower/faster pacing
- **Standalone mode**: Use breathing guide without full meditation timer

#### Implementation Approach

```
frontend/src/components/
├── BreathingGuide/
│   ├── BreathingGuide.tsx       # Main component
│   ├── FlowerAnimation.tsx      # Apple Watch style petals
│   ├── CircleAnimation.tsx      # Simple expanding circle
│   ├── WaveAnimation.tsx        # Wave-based visual
│   ├── patterns.ts              # Breathing pattern definitions
│   ├── useBreathingTimer.ts     # Hook for timing logic
│   └── BreathingGuide.css       # Animation styles
```

#### References

- [CSS-Tricks: Apple Watch Breathe Animation](https://css-tricks.com/recreating-apple-watch-breathe-app-animation/)
- [CodePen: Breathe App Demo](https://codepen.io/geoffgraham/pen/zKMEPE)
- [Cleveland Clinic: 4-7-8 Breathing](https://health.clevelandclinic.org/4-7-8-breathing)

---

### 6. Tags System 🏷️

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

### 10. Theme System 🎨

Support for Light/Dark modes with multiple color themes, easily switchable via UI button.

#### Mode Support

| Mode | Description |
|------|-------------|
| **Dark** | Default, easy on eyes during meditation |
| **Light** | Bright mode for daytime use |
| **Auto** | Follow system preference |

#### Color Themes

| Theme | Primary | Accent | Mood |
|-------|---------|--------|------|
| **Ocean** | Deep blue (#1a1a2e) | Teal (#4ecdc4) | Calm, deep |
| **Forest** | Dark green (#1a2e1a) | Leaf (#7cb342) | Natural, grounding |
| **Sunset** | Deep purple (#2d1b4e) | Orange (#ff6b35) | Warm, peaceful |
| **Midnight** | Pure black (#0a0a0a) | Silver (#c0c0c0) | Minimal, OLED-friendly |
| **Sakura** | Soft pink (#fff5f5) | Cherry (#ff69b4) | Gentle, spring |
| **Sand** | Warm beige (#f5f0e6) | Terracotta (#c67c4e) | Earthy, warm |
| **Aurora** | Dark navy (#0f0f23) | Multi-gradient | Magical, dynamic |
| **Zen** | Off-white (#fafaf9) | Black (#1a1a1a) | Minimalist, clean |

#### Theme Implementation

```typescript
// Theme structure
interface Theme {
  id: string;
  name: { ko: string; en: string };
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
  visual: {
    particleColor: string;
    glowColor: string;
  };
}
```

#### Theme Switcher UI

- **Quick toggle**: Button in header for dark/light mode
- **Theme picker**: Dropdown or grid selector for color themes
- **Preview**: Show theme preview before applying
- **Per-visual themes**: Some visuals may have custom palettes
- **Smooth transitions**: CSS transitions when switching themes

#### CSS Variables Approach

```css
:root {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-primary: #4ecdc4;
  --color-accent: #ff6b9d;
  --color-text: #ffffff;
  --color-text-muted: #a0a0a0;
}

[data-theme="forest"] {
  --color-bg: #1a2e1a;
  --color-primary: #7cb342;
  /* ... */
}
```

---

### 11. Data Export 📤

Export meditation data in multiple formats for backup, analysis, or migration.

#### Supported Formats

| Format | Use Case | Includes |
|--------|----------|----------|
| **JSON** | Full backup, API integration | All data, nested structure |
| **CSV** | Spreadsheet analysis | Sessions, flat structure |
| **iCal** | Calendar import | Session dates/times |
| **Markdown** | Human-readable journal | Sessions with notes |

#### Export Options

- **Date range**: All time, this year, this month, custom range
- **Data selection**: Sessions, stats, settings, tags (checkboxes)
- **Include notes**: Option to include/exclude personal notes
- **Anonymize**: Remove timestamps for sharing

#### JSON Export Structure

```json
{
  "exportDate": "2026-02-04T12:00:00Z",
  "version": "1.0",
  "sessions": [
    {
      "id": 1,
      "startedAt": "2026-02-04T08:00:00Z",
      "duration": 600,
      "completed": true,
      "visual": "aurora",
      "sounds": ["rain_light"],
      "mood": { "before": "😰", "after": "😌" },
      "note": "Good morning session",
      "tags": ["morning", "stress"]
    }
  ],
  "stats": {
    "totalSessions": 150,
    "totalMinutes": 2500,
    "longestStreak": 30
  },
  "tags": [...],
  "settings": {...}
}
```

#### CSV Export Columns

```csv
date,time,duration_min,completed,visual,sounds,mood_before,mood_after,tags,note
2026-02-04,08:00,10,true,aurora,rain_light,😰,😌,"morning,stress","Good session"
```

#### API Endpoints

```
GET /api/export/json?from=2026-01-01&to=2026-02-04
GET /api/export/csv?from=2026-01-01&to=2026-02-04
GET /api/export/ical
GET /api/export/markdown
```

---

### 12. Settings & Configuration ⚙️

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

# Theme System
theme:
  default_mode: "dark"  # dark, light, auto
  default_theme: "ocean"
  available:
    - id: ocean
      name_ko: "오션"
      name_en: "Ocean"
      mode: dark
    - id: forest
      name_ko: "포레스트"
      name_en: "Forest"
      mode: dark
    - id: sunset
      name_ko: "선셋"
      name_en: "Sunset"
      mode: dark
    - id: midnight
      name_ko: "미드나잇"
      name_en: "Midnight"
      mode: dark
    - id: sakura
      name_ko: "사쿠라"
      name_en: "Sakura"
      mode: light
    - id: sand
      name_ko: "샌드"
      name_en: "Sand"
      mode: light
    - id: aurora_theme
      name_ko: "오로라"
      name_en: "Aurora"
      mode: dark
    - id: zen
      name_ko: "젠"
      name_en: "Zen"
      mode: light

# Breathing Patterns
breathing:
  default_pattern: "box"
  patterns:
    - id: "4-7-8"
      name_ko: "4-7-8 릴렉싱"
      name_en: "4-7-8 Relaxing"
      inhale: 4
      hold_in: 7
      exhale: 8
      hold_out: 0
    - id: box
      name_ko: "박스 브리딩"
      name_en: "Box Breathing"
      inhale: 4
      hold_in: 4
      exhale: 4
      hold_out: 4
    - id: calming
      name_ko: "카밍 브레스"
      name_en: "Calming Breath"
      inhale: 4
      hold_in: 0
      exhale: 6
      hold_out: 0
    - id: energizing
      name_ko: "에너자이징"
      name_en: "Energizing"
      inhale: 6
      hold_in: 0
      exhale: 2
      hold_out: 0
  enable_audio_cues: true
  enable_haptic: true

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
    - id: liquid_metal
      name_ko: "리퀴드 메탈"
      name_en: "Liquid Metal"
    - id: sacred_geometry
      name_ko: "신성 기하학"
      name_en: "Sacred Geometry"
    - id: ocean_depth
      name_ko: "심해"
      name_en: "Ocean Depth"
  default_speed: 1.0

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
  primary_provider: "musicgen"  # musicgen, stable_audio, gemini, mubert

  # MusicGen (local, free)
  musicgen:
    model: "facebook/musicgen-medium"  # small, medium, large
    device: "cuda"  # cuda, cpu
    default_duration: 60

  # Stable Audio Open (local, free)
  stable_audio:
    model: "stabilityai/stable-audio-open-1.0"
    max_duration: 47

  # Gemini Lyria (cloud API)
  gemini:
    api_key: "${GEMINI_API_KEY}"

  # Mubert (cloud API)
  mubert:
    api_key: "${MUBERT_API_KEY}"

  output_dir: "./sounds/generated"
  max_duration_seconds: 300

  presets:
    - id: deep_relaxation
      prompt: "calm ambient meditation music, slow tempo, peaceful drone, no drums"
    - id: focus
      prompt: "minimal concentration music, subtle rhythms, lo-fi ambient"
    - id: sleep
      prompt: "very slow dreamy music, soft pads, fade out, sleep inducing"
    - id: morning
      prompt: "gentle awakening music, hopeful, gradually building, soft piano"
    - id: nature_blend
      prompt: "ambient music with nature sounds, birds, flowing water, peaceful"
    - id: tibetan
      prompt: "tibetan singing bowls, meditation bells, spiritual ambient"

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

# Data Export
export:
  formats: ["json", "csv", "ical", "markdown"]
  include_notes: true
  default_range: "all"  # all, year, month, custom

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
GET    /api/music/status/{job_id}       # Check generation status

# Breathing
GET    /api/breathing/patterns          # List breathing patterns
POST   /api/breathing/patterns          # Create custom pattern
PATCH  /api/breathing/patterns/{id}     # Update custom pattern
DELETE /api/breathing/patterns/{id}     # Delete custom pattern

# Themes
GET    /api/themes                      # List available themes
GET    /api/themes/current              # Get current theme
PUT    /api/themes/current              # Set current theme

# Export
GET    /api/export/json                 # Export as JSON
GET    /api/export/csv                  # Export as CSV
GET    /api/export/ical                 # Export as iCal
GET    /api/export/markdown             # Export as Markdown

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

### Phase 1: Foundation 🏗️
- [ ] Project scaffolding (React + Vite + Tailwind)
- [ ] FastAPI backend setup
- [ ] SQLite database initialization
- [ ] YAML config loading
- [ ] Basic timer functionality
- [ ] Start/end bell sounds
- [ ] Session CRUD API
- [ ] Basic responsive UI
- [ ] i18n setup (Korean + English)
- [ ] Theme system (Light/Dark mode)

### Phase 2: Visuals 🎨 (Parallel Development)

All 10 visuals developed in parallel (each is independent):

| Visual | Developer | Technique | Priority |
|--------|-----------|-----------|----------|
| Breathing Circle | - | CSS transform + scale | Core |
| Particle Flow | - | Canvas / Three.js | Core |
| Gradient Waves | - | CSS animation | Core |
| Aurora | - | WebGL shaders | Medium |
| Mandala | - | SVG animation | Medium |
| Cosmic Dust | - | Canvas particles | Medium |
| Zen Garden | - | SVG paths | Medium |
| Liquid Metal | - | Metaball algorithm | Advanced |
| Sacred Geometry | - | SVG morph | Advanced |
| Ocean Depth | - | Canvas + glow | Advanced |

**Parallel tasks:**
- [ ] Visual 1: Breathing Circle (Apple Watch style)
- [ ] Visual 2: Particle Flow
- [ ] Visual 3: Gradient Waves
- [ ] Visual 4: Aurora
- [ ] Visual 5: Mandala
- [ ] Visual 6: Cosmic Dust
- [ ] Visual 7: Zen Garden
- [ ] Visual 8: Liquid Metal
- [ ] Visual 9: Sacred Geometry
- [ ] Visual 10: Ocean Depth
- [ ] Visual selector UI
- [ ] Theme integration for each visual

### Phase 3: Breathing Guide 🌬️
- [ ] Breathing pattern definitions
- [ ] Apple Watch flower animation
- [ ] Simple circle animation
- [ ] Pattern timing engine
- [ ] Audio cues (inhale/exhale tones)
- [ ] Text prompts overlay
- [ ] Cycle counter
- [ ] Custom pattern creator
- [ ] Standalone breathing mode

### Phase 4: Sounds 🎵
- [ ] Download/collect free ambient sounds
- [ ] Audio player with Web Audio API
- [ ] Sound mixer (multi-layer)
- [ ] Volume controls
- [ ] Fade in/out transitions
- [ ] Sound preset saving
- [ ] Interval bell feature

### Phase 5: Journal & Tags 📝
- [ ] Post-session journal UI
- [ ] Mood emoji selector
- [ ] Energy level slider
- [ ] Notes input
- [ ] Tag system implementation
- [ ] Multi-select tag UI
- [ ] Custom tag creation (with colors)
- [ ] Tag filtering in history

### Phase 6: Statistics 📊
- [ ] GitHub-style heatmap component
- [ ] Weekly/Monthly charts
- [ ] Streak calculation logic
- [ ] Summary statistics cards
- [ ] Time of day analysis
- [ ] Tag frequency chart
- [ ] Mood trend visualization

### Phase 7: Data Export 📤
- [ ] JSON export (full backup)
- [ ] CSV export (sessions)
- [ ] iCal export (calendar)
- [ ] Markdown export (journal)
- [ ] Date range selector
- [ ] Export settings UI

### Phase 8: Goals & Gamification 🎯
- [ ] Goal creation UI
- [ ] Daily/Weekly/Monthly goals
- [ ] Progress tracking
- [ ] Home dashboard redesign
- [ ] Goal progress rings
- [ ] Streak display (prominent)
- [ ] Milestone badges
- [ ] Achievement notifications

### Phase 9: Discord Integration 🔔
- [ ] Webhook configuration
- [ ] Session complete notifications
- [ ] Streak milestone alerts
- [ ] Weekly summary generation
- [ ] Reminder scheduler
- [ ] Notification preferences UI

### Phase 10: AI Music Generation 🤖
- [ ] MusicGen local setup (primary)
- [ ] Stable Audio Open integration (alternative)
- [ ] Music generation UI
- [ ] Prompt presets
- [ ] Generated music library
- [ ] Music player integration
- [ ] Optional: Gemini Lyria API fallback

### Phase 11: Theme System 🎨
- [ ] 8 color themes implementation
- [ ] Theme switcher button in header
- [ ] Theme picker dropdown
- [ ] CSS variables for all themes
- [ ] Theme persistence
- [ ] Per-visual theme adjustments
- [ ] Smooth theme transitions

### Phase 12: Polish & Deploy ✨
- [ ] PWA configuration
- [ ] iOS home screen optimization
- [ ] Performance optimization
- [ ] Loading states & skeletons
- [ ] Error handling
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
- [AudioCraft (GitHub)](https://github.com/facebookresearch/audiocraft) - MusicGen

**Free Sound Sources:**
- [Freesound.org](https://freesound.org/) - CC licensed sounds
- [Mixkit](https://mixkit.co/) - Royalty-free sounds
- [Pixabay Sounds](https://pixabay.com/sound-effects/) - No attribution required
- [Ambient-Mixer](https://www.ambient-mixer.com/) - Mixable soundscapes

**AI Music Generation:**
- [Meta MusicGen](https://huggingface.co/facebook/musicgen-large) - Open source, local
- [Stable Audio Open](https://huggingface.co/stabilityai/stable-audio-open-1.0) - Open source
- [Gemini Lyria](https://ai.google.dev/gemini-api/docs/music-generation) - Cloud API
- [Mubert API](https://mubert.com/) - Cloud API with free tier
- [Suno](https://suno.com/) - High quality, freemium

**Breathing Science:**
- [Cleveland Clinic: 4-7-8 Breathing](https://health.clevelandclinic.org/4-7-8-breathing)
- [Stanford Study on Breathing](https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/)
- [Medical News Today: 4-7-8](https://www.medicalnewstoday.com/articles/324417)

**Technical:**
- [Framer Motion](https://www.framer.com/motion/) - React animations
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**CSS Animation Examples:**
- [CSS-Tricks: Apple Watch Breathe](https://css-tricks.com/recreating-apple-watch-breathe-app-animation/)
- [CodePen: Breathe App Demo](https://codepen.io/geoffgraham/pen/zKMEPE)
- [Simplified with CSS Variables](https://css-tricks.com/simplifying-apple-watch-breathe-app-animation-css-variables/)
- [Breathing Animation Tutorial](https://dev.to/scrabill/focused-breathing-a-css-animation-to-help-with-meditation-and-focused-breathing-exercises-dob)

---

## Decisions Made ✅

1. **Visuals:** All 10 visuals will be developed in parallel
2. **Sounds:** Focus on ambient sounds (rain, nature, etc.)
3. **Breathing Patterns:** Yes - 4-7-8, box breathing, calming, energizing
4. **Data Export:** All formats - JSON, CSV, iCal, Markdown
5. **Backup:** User-managed (not in app scope)
6. **Themes:** Light + Dark modes with 8 color themes
7. **AI Music:** MusicGen (local, free) as primary option

---

## Next Steps

1. ✅ Finalize this plan
2. ⬜ Set up project structure
3. ⬜ Initialize React + FastAPI
4. ⬜ Begin Phase 1 implementation

---

*Last updated: 2026-02-04*
