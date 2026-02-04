# Plan v2 Review

## Verdict: REVISE

## Previous Issues Status

1. **[FIXED]** types.ts - Added Task P2-000 creating `/frontend/src/components/Visuals/types.ts` with `VisualProps` interface. All visual tasks now depend on P2-000.

2. **[FIXED]** i18n visuals.select - Added `"select": "시각 효과 선택"` to ko.json (line 668) and `"select": "Select Visual"` to en.json (line 736). Task 1.4 verification explicitly tests this key.

3. **[FIXED]** Aurora shaders - Complete WebGL shader implementation provided in `shaders.ts` (lines 1813-1941) including simplex noise, aurora bands, color gradients, and helper functions `createShader()` and `createProgram()`. Full Aurora.tsx implementation with WebGL initialization and animation loop (lines 1943-2085).

4. **[FIXED]** Bell sounds - Added Task P1-008 (lines 1500-1686) with complete implementation:
   - `useAudio.ts` hook with AudioContext for iOS Safari compatibility
   - `BellPlayer.tsx` component that triggers on timer status changes
   - Integration instructions for App.tsx
   - Placeholder sound file guidance

5. **[FIXED]** ThemeSwitcher collision - Changed loop variable from `t` to `themeItem` (line 973: `themes.map((themeItem) =>`). No longer conflicts with `const { t } = useTranslation()`.

6. **[FIXED]** /breathe route - Added to App.tsx (line 553: `<Route path="/breathe" element={<Breathe />} />`). Import statement present (line 543). Placeholder Breathe.tsx component defined (lines 577-586).

7. **[FIXED]** useTimer.getState - Changed to `useTimerStore.getState()` in Meditate.tsx. Task 3.5 now uses correct pattern (line 2223: `const setBreathingEnabled = useTimerStore((state) => state.setBreathingEnabled);`).

8. **[FIXED]** Timer exports - Added `frontend/src/components/Timer/index.ts` barrel export file (lines 1258-1263) exporting Timer, TimerControls, and DurationPicker.

## New Issues

### 1. [CRITICAL] Plan not self-contained - References v1 for content

**Current**: Lines 148, 158, 1795, 2181, 2186, 2193 say "Same as v1, no changes needed" without including the actual implementation code.

**Expected**: A standalone plan where builders do not need to reference plan-v1.md. The following tasks are incomplete:
- Tasks 2.2-2.3 (Particle Flow, Gradient Waves)
- Tasks 2.5-2.10 (Mandala, Cosmic Dust, Zen Garden, Liquid Metal, Sacred Geometry, Ocean Depth)
- Task 2.11 (Visual Selector) - only files listed, no implementation code
- Tasks 3.1-3.4 (Breathing Pattern Engine, Flower Animation, Circle Animation, Standalone Mode)

**Impact**: Builders cannot execute plan-v2 without plan-v1. This violates the self-contained requirement.

### 2. [CRITICAL] Missing breathingStore.ts file creation

**Current**: Meditate.tsx (line 2212) imports `import { useBreathingStore } from '../stores/breathingStore';` but this file is never created in plan-v2.

**Expected**: Include the `breathingStore.ts` creation task from plan-v1, or mark Task 3.1 dependency on store creation.

**Impact**: TypeScript compilation will fail. Import error at runtime.

### 3. [CRITICAL] Missing Visuals/index.ts content

**Current**: Task 2.11 (line 151) lists `Visuals/index.ts` as a file but provides no implementation. Meditate.tsx (line 2215) imports `{ visualComponents }` from this file.

**Expected**: Include the barrel export with `visualComponents` lazy-loading all 10 visuals, as shown in plan-v1 lines 2565-2581.

**Impact**: Import error. Visual selector and meditation page will not work.

### 4. [MAJOR] BellPlayer not integrated into App.tsx code block

**Current**: Task 1.8 shows integration instructions (lines 1662-1674) but the App.tsx code block in Task 1.3 (lines 538-558) does not include BellPlayer.

**Expected**: Either update the Task 1.3 App.tsx code to include BellPlayer, or create a separate task to update App.tsx after P1-008.

**Impact**: Bell sounds will not play without manual App.tsx modification not specified in the task.

### 5. [MAJOR] themes.css never imported

**Current**: `themes.css` is created in Task 1.5 (lines 810-897) but never imported into the application.

**Expected**: Add `import './styles/themes.css';` to `main.tsx` or `index.css`.

**Impact**: Theme CSS variables will not apply. All theme switching will fail silently.

### 6. [MINOR] Meditate.tsx imports from Timer barrel but DurationPicker is also imported

**Current**: Line 2213 imports `{ Timer, DurationPicker } from '../components/Timer';` which is correct.

**Not an issue**: This is actually correct usage of the barrel exports. Verified working.

## Regressions

None detected. All v1 features that worked are preserved.

## Simulation Results

### Simulation 1: Task 2.4 (Aurora Visual)

1. Read P2-000 dependency - types.ts exists with VisualProps - OK
2. Read P2-004 files - shaders.ts has complete GLSL code - OK
3. Aurora.tsx imports from './shaders' - imports are defined - OK
4. WebGL initialization code is complete with proper cleanup - OK
5. AuroraFallback.tsx has Canvas implementation - OK

**Result**: PASS - Aurora can be implemented without clarification.

### Simulation 2: Task P1-008 (Bell Sound System)

1. Read useAudio.ts - complete AudioContext implementation - OK
2. Read BellPlayer.tsx - imports from stores, listens to timer status - OK
3. Check App.tsx integration - Instructions exist but App.tsx code block not updated - BLOCKED
4. Sound files - placeholder instructions provided - OK (deferred)

**Result**: PARTIAL PASS - Implementation exists but integration into App.tsx requires builder to manually apply instructions from separate section.

### Simulation 3: Task 3.5 (Timer Integration)

1. Read Meditate.tsx - imports useBreathingStore - BLOCKED
2. Check for breathingStore.ts creation - Not found in v2 - BLOCKED
3. Check for visualComponents export - Not found in v2 - BLOCKED

**Result**: FAIL - Cannot execute without plan-v1 reference.

## Final Assessment

Plan v2 successfully addresses all 8 issues from reviewer-v1.md. However, the plan introduced a new structural problem: it is not self-contained. Multiple tasks reference "Same as v1" without including the actual implementation code.

To be implementable, plan v2 must either:
1. Include all code from plan-v1 for referenced tasks (make it fully standalone)
2. OR explicitly merge both documents and note they must be used together (not recommended)

**Required fixes before OKAY verdict**:

1. Include full implementation for Tasks 2.2-2.3, 2.5-2.10, 2.11, 3.1-3.4 (copy from v1)
2. Ensure `breathingStore.ts` creation is included (Task 3.1 from v1)
3. Ensure `Visuals/index.ts` with `visualComponents` export is included (Task 2.11 from v1)
4. Update Task 1.3 App.tsx to include BellPlayer component
5. Add themes.css import to main.tsx or index.css

**Estimated effort**: Copy relevant sections from plan-v1.md into plan-v2.md, update App.tsx code block, add CSS import instruction.
