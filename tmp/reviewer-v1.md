# Plan v1 Review

## Verdict: REVISE

## Strengths

1. **Comprehensive coverage**: The plan addresses all Phase 1-3 requirements including scaffolding, timer, API, i18n, themes, all 10 visuals, and breathing guide.

2. **Detailed implementation code**: Each task includes full implementation code with file paths, making it actionable for builders.

3. **Correct visual techniques**: All 10 visuals use appropriate techniques matching the context requirements:
   - Breathing Circle: CSS transform + scale (correct)
   - Particle Flow: Canvas/requestAnimationFrame (correct)
   - Gradient Waves: CSS animation + keyframes (correct)
   - Aurora: WebGL with Canvas fallback (correct, addresses iOS Safari risk)
   - Mandala: SVG animation (correct)
   - Cosmic Dust: Canvas particles (correct)
   - Zen Garden: SVG paths (correct)
   - Liquid Metal: Metaball Canvas (correct, includes mobile optimization)
   - Sacred Geometry: SVG morph (correct)
   - Ocean Depth: Canvas + glow (correct)

4. **Breathing guide dual-mode**: Plan includes both standalone mode (`/breathe` page) and timer-integrated mode with overlay.

5. **Risk mitigations addressed**:
   - WebGL/iOS Safari: Aurora has Canvas fallback with `isWebGLSupported()` detection
   - Metaball performance: Reduced ball count on mobile (5 vs 8)
   - Audio on iOS: Noted in risks table

6. **Well-structured dependencies**: Clear dependency graph showing parallelization opportunities.

7. **Team orchestration**: Good workstream division for parallel development.

## Issues (REVISE Required)

### 1. [CRITICAL] Missing i18n key: `visuals.select`

**What's wrong**: The `VisualSelector.tsx` component uses `t('visuals.select')` (line 2541) but this key is not defined in either `ko.json` or `en.json`.

**How to fix**: Add to i18n files:
```json
// ko.json
"visuals": {
  ...
  "select": "시각 효과 선택"
}

// en.json
"visuals": {
  ...
  "select": "Select Visual"
}
```

### 2. [CRITICAL] Missing `types.ts` file for Visuals

**What's wrong**: All visual components import from `'../types'` (e.g., `import { VisualProps } from '../types'`) but the plan only mentions this interface inline without specifying file creation in Step 8-17.

**How to fix**: Add explicit task to create `/Users/jiehoonk/DevHub/sideprojects/mindfulness/frontend/src/components/Visuals/types.ts`:
```typescript
export interface VisualProps {
  isActive: boolean;
  speed?: number;
  theme?: 'light' | 'dark';
}
```
This should be created before any visual component.

### 3. [MAJOR] Bell sounds not implemented but in Done Criteria

**What's wrong**: Context specifies "Bell sounds play at start/end" in Done Criteria, but the plan only creates directory structure (`sounds/bells/.gitkeep`) without implementation. The Session model has `bell_sound` field but no code plays audio.

**How to fix**: Either:
- Add minimal bell sound implementation (load and play audio at timer start/complete)
- OR explicitly mark this as deferred to Phase 4 with a note that Done Criteria will be partially unmet

### 4. [MAJOR] Aurora WebGL shader code incomplete

**What's wrong**: Task 2.4 Aurora implementation shows `// WebGL setup... // (Full implementation with shader compilation, buffers, etc.)` as placeholder comment. The `shaders.ts` file is listed but no content provided.

**How to fix**: Provide complete WebGL shader code in `shaders.ts`:
```typescript
// frontend/src/components/Visuals/Aurora/shaders.ts
export const vertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aurora = sin(uv.x * 10.0 + u_time) * 0.5 + 0.5;
    aurora *= smoothstep(0.3, 0.7, uv.y);
    vec3 color = mix(vec3(0.0, 0.5, 0.3), vec3(0.2, 0.8, 0.5), aurora);
    gl_FragColor = vec4(color * aurora, 1.0);
  }
`;
```
And complete the WebGL initialization code in Aurora.tsx.

### 5. [MINOR] ThemeSwitcher has translation key collision

**What's wrong**: In `ThemeSwitcher.tsx`, the variable `t` is destructured from `useTranslation()` but also used as loop variable in `themes.map((t) => ...)`. This will cause a bug.

**How to fix**: Rename the loop variable:
```tsx
{themes.map((themeItem) => (
  <button
    key={themeItem.id}
    onClick={() => setTheme(themeItem.id)}
    ...
    <span className="text-xs mt-1 block">{themeItem.id}</span>
  </button>
))}
```

### 6. [MINOR] `/breathe` route not added to App.tsx

**What's wrong**: Task 3.4 creates `Breathe.tsx` page but does not update `App.tsx` to add the route.

**How to fix**: Add to the Routes in `App.tsx`:
```tsx
import Breathe from './pages/Breathe';
// ...
<Route path="/breathe" element={<Breathe />} />
```

### 7. [MINOR] useTimer hook reference error in Meditate.tsx

**What's wrong**: Line `useTimer.getState().setBreathingEnabled(...)` is incorrect. `useTimer` is a hook, not the store itself.

**How to fix**: Either:
```tsx
const { setBreathingEnabled } = useTimerStore();
// then use:
onChange={(e) => setBreathingEnabled(e.target.checked)}
```
Or import the store directly:
```tsx
import { useTimerStore } from '../stores/timerStore';
onChange={(e) => useTimerStore.getState().setBreathingEnabled(e.target.checked)}
```

### 8. [MINOR] Missing index.ts exports for Timer components

**What's wrong**: Timer components (`Timer.tsx`, `TimerControls.tsx`, `DurationPicker.tsx`) have no barrel export file, unlike Visuals which has `index.ts`.

**How to fix**: Add `/frontend/src/components/Timer/index.ts`:
```typescript
export { default as Timer } from './Timer';
export { default as TimerControls } from './TimerControls';
export { default as DurationPicker } from './DurationPicker';
```

## Missing Requirements

1. **`visuals.select` i18n key** - Component will fail to render translated text
2. **Visuals `types.ts` file creation** - All visual imports will fail
3. **Bell sounds playback** - Context Done Criteria specifies this must work
4. **Aurora shader implementation** - WebGL code is placeholder only
5. **`/breathe` route registration** - Page will be inaccessible

## Simulation Results

### Simulation 1: Task 2.1 (Breathing Circle Visual)

Tracing execution as a builder with no context:

1. Read files listed: `BreathingCircle.tsx`, `index.ts`
2. First line: `import { VisualProps } from '../types'`
3. **BLOCKED**: No `types.ts` file specified in this task or prior tasks
4. Builder would have to guess or create the type themselves

Gap identified: `types.ts` must be created as a prerequisite for all visual tasks.

### Simulation 2: Task 3.4 (Standalone Breathing Mode)

1. Create `BreathingGuide.tsx` - OK, dependencies P3-001/002/003 provide context
2. Create `Breathe.tsx` with route `<a href="/">` - OK
3. **BLOCKED**: No instruction to add route to `App.tsx`
4. User navigates to `/breathe` - 404 error

Gap identified: Route registration step missing.

### Simulation 3: Task 2.11 (Visual Selector)

1. Create `VisualSelector.tsx` - code uses `t('visuals.select')`
2. Check `ko.json` from Task 1.4 - key does not exist
3. **BLOCKED**: Missing translation will show raw key text

Gap identified: i18n key not defined.

## Quality Evaluation

### Checklist
- [x] Requirements addressed - All Phase 1-3 features covered
- [ ] Steps specific - Most are specific but some have placeholder code (Aurora)
- [x] Dependencies ordered - Clear dependency graph with correct ordering
- [ ] Verification defined - Each step has verification but some are incomplete

## Recommendations

1. **Priority fix**: Add `types.ts` creation as a new task (P2-000) before any visual tasks.

2. **Priority fix**: Complete Aurora shader implementation or explicitly note it requires research during implementation.

3. **Consider**: Add a "Smoke Test" task at the end of Phase 3 that verifies all routes work, all visuals render, and the breathing guide functions in both modes.

4. **Consider**: Add explicit CSS import for `themes.css` in `index.css` or `main.tsx` - currently the file is created but never imported.

5. **Consider**: The Visual Selector uses emoji previews which may render differently across platforms. Consider using CSS-based preview thumbnails instead.

## Summary

The plan is comprehensive and well-structured but has several missing pieces that would cause implementation to fail:
- Missing `types.ts` file would block all visual component development
- Missing i18n keys would cause UI bugs
- Incomplete Aurora WebGL code would require significant builder research
- Missing route registration would make `/breathe` page inaccessible

These are all fixable issues. Once addressed, the plan should be executable without further clarification.
