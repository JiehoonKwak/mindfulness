# Meditation App UI Overhaul Plan

## Summary
Complete UI overhaul: fix monochrome violations, replace 2 visuals, add zen quotes, fix button contrast, expand ambient sounds, remove redundant elements.

---

## Phase 1: Critical Monochrome Violations

### 1.1 Replace BreathSphere → "Zen Ensō"
**File:** `frontend/src/components/Visuals/BreathSphere/BreathSphere.tsx`

New concept: Minimalist ink-brush circle (ensō) that expands/contracts with breathing
- Pure white (#ffffff) with varying opacity (0.3-0.9)
- Brush-stroke texture via noise displacement
- Soft glow effect, subtle rotation during hold phases
- Three.js IcosphereGeometry with custom shader

### 1.2 Replace FloatingOrbs → "Mist Particles"
**File:** `frontend/src/components/Visuals/FloatingOrbs/FloatingOrbs.tsx`

New concept: Abstract smoke/mist particles drifting with breath
- Pure white particles with varying opacity (0.2-0.7)
- Rise on inhale, fall on exhale
- Organic drift patterns, soft blur for depth
- 12-20 particles using Three.js Points/BufferGeometry

### 1.3 Fix Aurora Colors
**File:** `frontend/src/components/Visuals/Aurora/shaders.ts`

```glsl
// Lines 69-71: Replace teal/blue/purple with grayscale
vec3 color1 = vec3(1.0, 1.0, 1.0);  // white
vec3 color2 = vec3(0.7, 0.7, 0.7);  // light gray
vec3 color3 = vec3(0.4, 0.4, 0.4);  // medium gray
```

### 1.4 Fix RippleWater Colors
**File:** `frontend/src/components/Visuals/RippleWater/RippleWater.tsx`

```glsl
// Line 33: Replace blue with white
vec3 color = vec3(1.0, 1.0, 1.0);
```

### 1.5 Fix AuraBreathing Colors
**File:** `frontend/src/components/BreathingGuide/AuraBreathing.tsx`

- Lines 65-66: Change `#2dd4bf`/`#3b82f6` → `#ffffff`/`#888888`
- Lines 166-177: Remove colored background divs or use monochrome

---

## Phase 2: Home Page - Zen Quotes

**File:** `frontend/src/pages/Home.tsx`

Replace empty `flex-1` spacer (line 59) with quote component:

```tsx
<section className="flex-1 flex items-center justify-center px-6">
  <motion.div key={quoteIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <p className="text-lg font-light italic text-[var(--color-text-muted)] text-center">
      "{quote.text}"
    </p>
    <p className="text-sm text-[var(--color-text-muted)] mt-2 opacity-60 text-center">
      — {quote.author}
    </p>
  </motion.div>
</section>
```

Daily rotation: `quoteIndex = dayOfYear % quotes.length`

---

## Phase 3: Meditate Page Fixes

**File:** `frontend/src/pages/Meditate.tsx`

### 3.1 Remove Upper Clock
- Show `Timer` (progress ring) ONLY when `isRunning`
- Show `ClockDial` (duration picker) ONLY when `status === "idle"`

### 3.2 Remove Breathing Toggle
- Delete lines 137-171 (breathing guide toggle button)

### 3.3 Auto-play Ambient Music
Add to `settingsStore.ts`:
```ts
defaultAmbient: string | null;
setDefaultAmbient: (id: string | null) => void;
```

In Meditate.tsx, when `status` changes to "running":
```ts
if (defaultAmbient) audio.addAmbient(defaultAmbient, soundUrl);
```

---

## Phase 4: Breathe Page Fixes

**File:** `frontend/src/pages/Breathe.tsx`

### 4.1 Fix Button Contrast
**File:** `frontend/src/components/BreathingGuide/BreathingGuide.tsx`

Pattern buttons (lines ~54-67):
```tsx
// Selected: white bg, black text
"bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
// Unselected: transparent, white border, white text
"bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
```

### 4.2 Increase Animation Size
**File:** `frontend/src/components/BreathingGuide/AuraBreathing.tsx`

Change SIZE constant: `320` → `400` (or use responsive sizing)

### 4.3 Fix Layout Overlap
Ensure controls have `mt-12` spacing below animation

---

## Phase 5: Settings Page - Music Section

**File:** `frontend/src/pages/Settings.tsx`

### 5.1 Add Setup Instructions
```tsx
<div className="p-4 rounded-xl bg-[var(--color-surface)]/40">
  <p className="text-sm text-[var(--color-text-muted)]">
    AI music generation requires GEMINI_API_KEY in backend .env file.
  </p>
</div>
```

### 5.2 Add Default Ambient Selector
New dropdown to select default ambient sound for meditation auto-play

---

## Phase 6: Expand Ambient Sounds

**File:** `frontend/src/components/SoundMixer/SoundMixer.tsx`

Add 7 new sounds to `AMBIENT_SOUNDS`:
| ID | Label | Category |
|----|-------|----------|
| tibetan_bowls | Tibetan Bowls | Meditation |
| wind_chimes | Wind Chimes | Meditation |
| white_noise | White Noise | Meditation |
| river | River Stream | Nature |
| campfire | Campfire | Nature |
| wind | Wind | Nature |
| birds | Birds | Nature |

**Audio files to download** (freesound.org CC0):
- Place in `frontend/public/sounds/ambient/`

---

## Phase 7: i18n Updates

**Files:** `frontend/src/i18n/en.json`, `ko.json`

Add:
```json
"quotes": {
  "list": [
    {"text": "The present moment is filled with joy...", "author": "Thich Nhat Hanh"},
    {"text": "In the midst of movement, keep stillness...", "author": "Deepak Chopra"},
    // 10-15 zen quotes with Korean translations
  ]
},
"sounds": {
  "tibetanBowls": "Tibetan Bowls",
  "windChimes": "Wind Chimes",
  // ... all new sound labels
}
```

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `components/Visuals/BreathSphere/BreathSphere.tsx` | Complete rewrite - Zen Ensō |
| `components/Visuals/FloatingOrbs/FloatingOrbs.tsx` | Complete rewrite - Mist Particles |
| `components/Visuals/Aurora/shaders.ts` | Fix colors → grayscale |
| `components/Visuals/RippleWater/RippleWater.tsx` | Fix colors → white |
| `components/BreathingGuide/AuraBreathing.tsx` | Fix colors, increase size |
| `components/BreathingGuide/BreathingGuide.tsx` | Fix button contrast |
| `components/SoundMixer/SoundMixer.tsx` | Add 7 sounds, categories |
| `pages/Home.tsx` | Add quote component |
| `pages/Meditate.tsx` | Remove clock, remove breathing toggle, add auto-play |
| `pages/Breathe.tsx` | Layout fixes |
| `pages/Settings.tsx` | Add music instructions, default ambient selector |
| `stores/settingsStore.ts` | Add defaultAmbient state |
| `i18n/en.json` | Add quotes, sound labels |
| `i18n/ko.json` | Add Korean translations |

---

## Verification

1. **Visual test:** Run app, check all 4 visuals are monochrome (no purple/blue/teal)
2. **Quote test:** Refresh Home page, verify quote displays
3. **Meditate test:** Confirm single clock in idle, timer in running
4. **Ambient test:** Set default ambient in Settings, start meditation, verify auto-play
5. **Breathe test:** Verify buttons visible in both themes
6. **Sound test:** Open mixer, verify all 10 sounds listed
7. **Theme test:** Toggle dark/light, verify all elements readable

---

## Commands
```bash
# Start dev server
./dev start

# Test frontend
cd frontend && bun run build && bun run lint
```

