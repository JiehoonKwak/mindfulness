# Mindfulness App Redesign Plan

## Current State Analysis

| Area | Status | Issue |
|------|--------|-------|
| Settings/Theme | Stub only | ThemeSwitcher exists but not wired; hardcoded `text-white` breaks light mode |
| Custom Timer | Missing | Only 9 presets; no custom duration input |
| Breathing Animation | Childish | CSS-only petals; lacks production quality |
| Database | Working | CRUD complete; no analytics endpoints |
| Overall Design | Generic | Doesn't match zen/aura mock aesthetic |

## Design Reference: Mock Analysis

User prefers **Aura style** from `mock/`:
- Three.js WebGL sphere with shader-based glow
- Clean black background with dynamic orbs
- Minimal typography (tracking-widest, uppercase labels)
- Round controls, glass-morphism panels
- Zen minimalist aesthetic

---

## Implementation Plan

### Phase A: Zen Design System Foundation

**A1. Fix Theme Infrastructure**
- `frontend/src/App.tsx`: Replace `text-white` with `text-[var(--color-text)]`
- `frontend/src/index.css`: Remove hardcoded `--color-text: #ffffff` from `:root`
- Add zen-specific theme colors matching mock (zinc-900, teal-500 accents)

**A2. Settings Page Integration**
- `frontend/src/pages/Settings.tsx`: Wire ThemeSwitcher component
- Add theme grid with zen-style buttons (glass-morphism, minimal)
- Add language toggle (ko/en)
- Add bell sound toggle

Files: `Settings.tsx`, `ThemeSwitcher.tsx`, `settingsStore.ts`

---

### Phase B: Custom Timer with Clock Widget

**B1. Circular Clock Dial Component**
Create `frontend/src/components/Timer/ClockDial.tsx`:
```
┌─────────────────────────┐
│     Circular dial       │
│   60 tick marks (min)   │
│   Drag handle to set    │
│   Max: 60 minutes       │
│   Zen style: subtle     │
│   white/zinc ticks      │
└─────────────────────────┘
```

Implementation:
- SVG circle with 60 tick marks
- Touch/drag to set duration
- Display selected minutes in center
- Minimal zen aesthetic (thin strokes, no fill)

**B2. Integration with Meditate Page**
- Replace preset-only `DurationPicker` with ClockDial
- Keep preset buttons as quick-select options below dial
- Store custom duration in timerStore

Files: `ClockDial.tsx`, `DurationPicker.tsx`, `Meditate.tsx`, `timerStore.ts`

---

### Phase C: Production Breathing Animation (Three.js)

**C1. Aura Breathing Sphere**
Port `mock/components/AuraSphere.tsx` to replace childish CSS petals:

- Three.js WebGL sphere with shader material
- Teal-to-blue gradient colors
- Scale/intensity responds to breath phase
- Additive blending for glow effect
- iOS fallback: Canvas 2D gradient sphere

**C2. Replace FlowerAnimation**
- New `frontend/src/components/BreathingGuide/AuraBreathing.tsx`
- Use breathingStore phase/progress to drive shader uniforms
- Match mock aesthetic: `#2dd4bf` (teal) + `#3b82f6` (blue)
- Remove childish petal colors (#61bea2, #529ca0)

**C3. Background Effect**
Add subtle ambient orbs (from mock's `BackgroundEffect.tsx`):
- Teal orb top-left, blue orb bottom-right
- Blur 100px, opacity pulse with breath
- CSS only (no Three.js overhead)

Files: `AuraBreathing.tsx`, `BreathingGuide.tsx`, `Breathe.tsx`

---

### Phase D: Meditate Page Redesign (Aura Style)

**D1. Visual Selector Upgrade**
- Replace current buttons with mock's glass-morphism pills
- Style: `bg-zinc-900/40 backdrop-blur-xl border-zinc-800/50 rounded-2xl`
- Uppercase tracking-widest labels

**D2. Timer Display**
- Center large time display (mono, tabular-nums)
- Minimal start button (white circle, play icon)
- Session end overlay with zen transition

**D3. Zen Typography**
- Font: system sans-serif with wide letter-spacing
- Colors: white/90 for primary, zinc-500 for secondary
- No bold headings; light/medium weight only

Files: `Meditate.tsx`, `Timer.tsx`, `VisualSelector.tsx`

---

### Phase E: Visual Effects Enhancement

**E1. Replace/Enhance Aurora Visual**
Current Aurora uses basic canvas gradient.
Upgrade to Three.js shader matching mock's quality:
- Noise-based vertex displacement
- Smooth color interpolation
- Breath-responsive scale animation

**E2. Add Aura as Default Visual**
- Import AuraSphere from breathing component as meditation visual
- Make it the default selected visual
- Remove or demote less polished visuals

Files: `components/Visuals/Aurora.tsx`, `components/Visuals/index.ts`

---

## File Change Summary

| File | Action |
|------|--------|
| `App.tsx` | Fix hardcoded text-white |
| `index.css` | Remove :root color override |
| `themes.css` | Add zen theme refinements |
| `Settings.tsx` | Wire ThemeSwitcher, add controls |
| `ClockDial.tsx` | NEW: Circular timer dial |
| `DurationPicker.tsx` | Integrate ClockDial |
| `AuraBreathing.tsx` | NEW: Three.js breathing sphere |
| `FlowerAnimation.tsx` | Deprecate/remove |
| `Meditate.tsx` | Redesign with zen aesthetic |
| `VisualSelector.tsx` | Glass-morphism style |

---

## Verification

1. **Theme switching**: Toggle light/dark in Settings; verify text readable
2. **Custom timer**: Drag clock dial to 7 min; start meditation; verify countdown
3. **Breathing animation**: Run breathing guide; verify smooth Three.js sphere expansion
4. **Visual consistency**: Compare with mock screenshots; verify zen aesthetic throughout
5. **Mobile responsiveness**: Test on iOS Safari via Tailscale

---

## Dependencies

- `three` (already in mock's package.json)
- No new packages needed; reuse existing framer-motion, tailwind

## Notes

- No emojis per user request
- Avoid over-engineering; minimal changes for maximum visual impact
- Three.js skill loaded for shader reference

