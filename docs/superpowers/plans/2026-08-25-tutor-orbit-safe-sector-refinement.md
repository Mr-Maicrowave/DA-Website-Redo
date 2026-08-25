# Tutor Orbit Safe-Sector Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing Tutors hero into a collision-safe, premium living faculty system with authored spatial sectors, layered motion, cinematic selection, responsive simplification, and verified overlap-free layouts.

**Architecture:** Replace unrestricted portrait ellipses with deterministic safe-sector geometry shared by rendering and tests. Split the growing hero into a stage, animated profile, and mobile navigator while the hero retains selection ownership and real catalogue data. Use Framer Motion values for transform-only desktop animation, explicit selection phases for outer promotion, and static/roster-based responsive variants.

**Tech Stack:** React 18, TypeScript, Framer Motion 12, CSS, SVG, Node test runner, Puppeteer, Vite

**Spec:** `docs/superpowers/specs/2026-08-25-tutor-orbit-safe-sector-refinement-design.md`

## Global Constraints

- Preserve the existing navy, gold, and cream visual world, editorial copy, catalogue data, `/find-teacher` routes, and `Open full profile` CTA.
- Desktop represents exactly 1 centre tutor, 5 primary tutors, and 9 secondary tutors.
- Portrait motion uses authored safe sectors; no random positioning, runtime physics, or continuous collision solver.
- No interactive portrait may enter the centre, headline, or profile-card exclusion zones.
- Main selection lasts 900–1200ms with no bounce, spring overshoot, or elastic easing.
- Entrance lasts approximately 1.8 seconds and never blocks interaction.
- Continuous motion uses transform and opacity only; no layout reads occur per animation frame.
- No new production dependency, canvas, WebGL, GSAP, or scroll-triggered animation architecture.
- Tablet simplifies motion and moves the profile below the stage; mobile shows four supporting educators per roster page.
- `prefers-reduced-motion` disables continuous orbit drift, pointer parallax, float, breathing, and moving markers while preserving selection.
- Preserve real buttons, keyboard focus, accessible tutor names, and the live selected-profile region.
- Keep unrelated dirty working-tree changes untouched; stage and commit only files named by the active task.

---

## File map

- Create `src/features/tutor-orbit/tutor-orbit-geometry.ts`: safe-sector data, viewport bands, pose sampling, bounds, and exclusion-zone helpers.
- Create `src/features/tutor-orbit/tutor-orbit-geometry.test.ts`: full-cycle geometry and collision guarantees.
- Modify `src/features/tutor-orbit/tutor-orbit-config.ts`: cohorts, selection timeline, exact-slot swap, and mobile roster window.
- Modify `src/features/tutor-orbit/tutor-orbit-config.test.ts`: selection-phase and roster behavior.
- Create `src/features/tutor-orbit/TutorOrbitStage.tsx`: clocks, pointer response, entrance, safe-sector portraits, markers, and promotion layer.
- Create `src/features/tutor-orbit/TutorOrbitProfile.tsx`: stable profile layout and staggered content variants.
- Create `src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx`: four-person roster pages, buttons, swipe, and status.
- Modify `src/features/tutor-orbit/TutorOrbitHero.tsx`: top-level tutor state, phase orchestration, editorial composition, and child wiring.
- Modify `src/features/tutor-orbit/TutorOrbitHero.test.ts`: structural, motion, responsive, accessibility, and reduced-motion contracts.
- Modify `src/features/tutor-orbit/tutor-orbit.css`: safe topology, visual hierarchy, label disclosure, masks, motion states, and breakpoints.
- Create `scripts/qa-tutor-orbit.mjs`: rendered viewport checks, bounding-box collision assertions, interaction checks, and screenshots.
- Create `artifacts/tutor-orbit/.gitkeep`: retained output location for QA screenshots and optional motion capture.

---

### Task 1: Deterministic safe-sector geometry

**Files:**
- Create: `src/features/tutor-orbit/tutor-orbit-geometry.ts`
- Create: `src/features/tutor-orbit/tutor-orbit-geometry.test.ts`

**Interfaces:**
- Produces: `GeometryBand`, `OrbitPose`, `SafeSector`, `SAFE_SECTORS`, `geometryBandForWidth(width)`, `poseForSector(sector, progress)`, `boundsForPose(pose, diameter)`, `rectsOverlap(a, b, gap)`, and `PROTECTED_ZONES`.
- Consumes: existing `OrbitTier` from `tutor-orbit-config.ts`.

- [ ] **Step 1: Write the failing geometry tests**

Create `tutor-orbit-geometry.test.ts` with the following tests:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROTECTED_ZONES,
  SAFE_SECTORS,
  boundsForPose,
  geometryBandForWidth,
  poseForSector,
  rectsOverlap,
  type GeometryBand,
} from './tutor-orbit-geometry.ts';

const desktopBands: GeometryBand[] = ['wide', 'desktop'];

test('maps required widths to stable geometry bands', () => {
  assert.equal(geometryBandForWidth(1920), 'wide');
  assert.equal(geometryBandForWidth(1440), 'desktop');
  assert.equal(geometryBandForWidth(1366), 'desktop');
  assert.equal(geometryBandForWidth(1024), 'tablet');
  assert.equal(geometryBandForWidth(390), 'mobile');
});

test('defines five primary and nine secondary desktop sectors', () => {
  for (const band of desktopBands) {
    assert.equal(SAFE_SECTORS[band].inner.length, 5);
    assert.equal(SAFE_SECTORS[band].outer.length, 9);
  }
});

test('portrait envelopes stay clear of protected desktop zones', () => {
  for (const band of desktopBands) {
    const zones = PROTECTED_ZONES[band];
    for (const tier of ['inner', 'outer'] as const) {
      const diameter = tier === 'inner' ? zones.innerDiameter : zones.outerDiameter;
      for (const sector of SAFE_SECTORS[band][tier]) {
        for (let sample = 0; sample < 120; sample += 1) {
          const bounds = boundsForPose(poseForSector(sector, sample / 120), diameter);
          assert.equal(rectsOverlap(bounds, zones.centre, 28), false, `${band}:${sector.id}:centre`);
          assert.equal(rectsOverlap(bounds, zones.profile, 12), false, `${band}:${sector.id}:profile`);
          assert.equal(rectsOverlap(bounds, zones.headline, 12), false, `${band}:${sector.id}:headline`);
        }
      }
    }
  }
});

test('sector envelopes cannot collide at any independent phase', () => {
  for (const band of desktopBands) {
    const zones = PROTECTED_ZONES[band];
    const portraits = [
      ...SAFE_SECTORS[band].inner.map((sector) => ({ sector, diameter: zones.innerDiameter })),
      ...SAFE_SECTORS[band].outer.map((sector) => ({ sector, diameter: zones.outerDiameter })),
    ];
    for (let left = 0; left < portraits.length; left += 1) {
      for (let right = left + 1; right < portraits.length; right += 1) {
        for (let a = 0; a < 24; a += 1) {
          for (let b = 0; b < 24; b += 1) {
            const leftBounds = boundsForPose(poseForSector(portraits[left].sector, a / 24), portraits[left].diameter);
            const rightBounds = boundsForPose(poseForSector(portraits[right].sector, b / 24), portraits[right].diameter);
            assert.equal(rectsOverlap(leftBounds, rightBounds, 8), false, `${band}:${portraits[left].sector.id}:${portraits[right].sector.id}`);
          }
        }
      }
    }
  }
});
```

- [ ] **Step 2: Run the geometry tests and verify RED**

Run:

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/tutor-orbit-geometry.test.ts
```

Expected: FAIL because `tutor-orbit-geometry.ts` does not exist.

- [ ] **Step 3: Implement the geometry module**

Create the exported types and helpers:

```ts
import type { OrbitTier } from './tutor-orbit-config';

export type GeometryBand = 'wide' | 'desktop' | 'tablet' | 'mobile';

export interface OrbitPose { x: number; y: number; scale: number; opacity: number }
export interface Bounds { left: number; top: number; right: number; bottom: number }
export interface SafeSector {
  id: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  phase: number;
  scale: [number, number];
  opacity: [number, number];
  labelSide: 'top' | 'bottom' | 'left' | 'right';
}

export function geometryBandForWidth(width: number): GeometryBand {
  if (width >= 1600) return 'wide';
  if (width >= 1200) return 'desktop';
  if (width >= 721) return 'tablet';
  return 'mobile';
}

export function poseForSector(sector: SafeSector, progress: number): OrbitPose {
  const angle = (progress + sector.phase) * Math.PI * 2;
  const depth = (Math.sin(angle) + 1) / 2;
  return {
    x: sector.x + Math.cos(angle) * sector.driftX + Math.sin(angle * 2) * sector.driftX * 0.16,
    y: sector.y + Math.sin(angle) * sector.driftY + Math.cos(angle * 2) * sector.driftY * 0.12,
    scale: sector.scale[0] + (sector.scale[1] - sector.scale[0]) * depth,
    opacity: sector.opacity[0] + (sector.opacity[1] - sector.opacity[0]) * depth,
  };
}

export function boundsForPose(pose: OrbitPose, diameter: number): Bounds {
  const radius = diameter * pose.scale / 2;
  return { left: pose.x - radius, top: pose.y - radius, right: pose.x + radius, bottom: pose.y + radius };
}

export function rectsOverlap(a: Bounds, b: Bounds, gap = 0) {
  return !(a.right + gap <= b.left || a.left - gap >= b.right || a.bottom + gap <= b.top || a.top - gap >= b.bottom);
}
```

Define explicit `SAFE_SECTORS` for each band. Use these desktop anchor centres before small test-driven optical corrections:

```ts
const wideInner = [[-230,-175],[0,-265],[185,-220],[185,220],[-225,190]];
const wideOuter = [[-330,-110],[-270,-255],[-100,-315],[80,-315],[205,-275],[205,285],[70,320],[-120,315],[-285,250]];
const desktopInner = [[-205,-155],[0,-235],[165,-200],[165,200],[-205,165]];
const desktopOuter = [[-290,-90],[-240,-225],[-85,-275],[65,-280],[170,-250],[170,255],[55,285],[-110,280],[-255,210]];
```

Map them into `SafeSector` records with inner drift no greater than `10×8`, outer drift no greater than `12×9`, deterministic phase offsets, inner scale `0.96–1.04`, outer scale `0.84–0.96`, inner opacity `0.88–1`, and outer opacity `0.48–0.72`. Define `PROTECTED_ZONES` in the same centre-relative coordinate system, including centre diameter, tutor diameters, profile wedge, and headline boundary. Adjust anchors only until all four tests pass; do not weaken the gaps in the assertions.

- [ ] **Step 4: Run the geometry tests and verify GREEN**

Run the geometry test command from Step 2.

Expected: 4 tests PASS with no warnings.

- [ ] **Step 5: Commit the geometry unit**

```powershell
git add -- src/features/tutor-orbit/tutor-orbit-geometry.ts src/features/tutor-orbit/tutor-orbit-geometry.test.ts
git commit -m "feat: add collision-safe tutor orbit geometry"
```

---

### Task 2: Selection phases and mobile roster state

**Files:**
- Modify: `src/features/tutor-orbit/tutor-orbit-config.ts`
- Modify: `src/features/tutor-orbit/tutor-orbit-config.test.ts`

**Interfaces:**
- Consumes: existing tutor cohort IDs and `swapFacultyTutor`.
- Produces: `SelectionPhase`, `selectionSequenceFor(tier, reduced)`, `rosterWindow(ids, page, pageSize)`, and `nextRosterPage(page, direction, total, pageSize)`.

- [ ] **Step 1: Add failing state-model tests**

Append tests that assert:

```ts
test('promotes an outer tutor before exchanging it', () => {
  assert.deepEqual(selectionSequenceFor('outer', false), [
    { phase: 'promoting', at: 0 },
    { phase: 'exchanging', at: 240 },
    { phase: 'idle', at: 1080 },
  ]);
  assert.deepEqual(selectionSequenceFor('inner', false), [
    { phase: 'exchanging', at: 0 },
    { phase: 'idle', at: 960 },
  ]);
});

test('uses one short exchange for reduced motion', () => {
  assert.deepEqual(selectionSequenceFor('outer', true), [
    { phase: 'exchanging', at: 0 },
    { phase: 'idle', at: 160 },
  ]);
});

test('pages all fifteen tutors through four-person mobile windows', () => {
  const ids = Array.from({ length: 15 }, (_, index) => `T${index + 1}`);
  assert.deepEqual(rosterWindow(ids, 0, 4), ['T1', 'T2', 'T3', 'T4']);
  assert.deepEqual(rosterWindow(ids, 3, 4), ['T13', 'T14', 'T15', 'T1']);
  assert.equal(nextRosterPage(3, 1, 15, 4), 0);
  assert.equal(nextRosterPage(0, -1, 15, 4), 3);
});
```

- [ ] **Step 2: Run config tests and verify RED**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/tutor-orbit-config.test.ts
```

Expected: FAIL because the three new exports are missing.

- [ ] **Step 3: Implement minimal pure state helpers**

Add exact discriminated types and deterministic helpers. `selectionSequenceFor` must return the timings asserted above. `rosterWindow` must wrap indices modulo the roster length and return an empty array for an empty roster. `nextRosterPage` must wrap across `Math.ceil(total / pageSize)` pages and return `0` when `total` is zero.

```ts
export type SelectionPhase = 'idle' | 'promoting' | 'exchanging';
export interface SelectionStep { phase: SelectionPhase; at: number }

export function selectionSequenceFor(tier: OrbitTier, reduced: boolean): SelectionStep[] {
  if (reduced) return [{ phase: 'exchanging', at: 0 }, { phase: 'idle', at: 160 }];
  if (tier === 'outer') return [
    { phase: 'promoting', at: 0 },
    { phase: 'exchanging', at: 240 },
    { phase: 'idle', at: 1080 },
  ];
  return [{ phase: 'exchanging', at: 0 }, { phase: 'idle', at: 960 }];
}

export function rosterWindow(ids: readonly string[], page: number, pageSize: number) {
  if (ids.length === 0) return [];
  const start = page * pageSize;
  return Array.from({ length: Math.min(pageSize, ids.length) }, (_, offset) => ids[(start + offset) % ids.length]);
}

export function nextRosterPage(page: number, direction: 1 | -1, total: number, pageSize: number) {
  const pages = Math.ceil(total / pageSize);
  return pages === 0 ? 0 : (page + direction + pages) % pages;
}
```

- [ ] **Step 4: Run all config and geometry tests**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/tutor-orbit-config.test.ts src/features/tutor-orbit/tutor-orbit-geometry.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the state model**

```powershell
git add -- src/features/tutor-orbit/tutor-orbit-config.ts src/features/tutor-orbit/tutor-orbit-config.test.ts
git commit -m "feat: model tutor promotion and mobile roster state"
```

---

### Task 3: Safe-sector stage and layered motion

**Files:**
- Create: `src/features/tutor-orbit/TutorOrbitStage.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.test.ts`

**Interfaces:**
- Consumes: `SAFE_SECTORS`, `geometryBandForWidth`, `poseForSector`, cohort tutors, `SelectionPhase`, and `OrbitTier`.
- Produces: `TutorOrbitStage({ active, innerTutors, outerTutors, phase, selectedId, originTier, reduced, onSelect })`.

- [ ] **Step 1: Replace source-contract tests with failing stage contracts**

Keep the existing copy/route tests and add assertions for:

```ts
assert.match(stage, /SAFE_SECTORS\[band\]/);
assert.match(stage, /poseForSector\(sector, progress\)/);
assert.match(stage, /useMotionValue/);
assert.match(stage, /useSpring/);
assert.match(stage, /onPointerMove/);
assert.match(stage, /Math\.abs\([^)]*\) \* 5/);
assert.match(stage, /tutor-orbit__promotion-portrait/);
assert.match(stage, /phase === 'promoting'/);
assert.match(stage, /tutor-orbit__marker/);
assert.match(stage, /layoutId=\{`tutor-\$\{tutor\.id\}`\}/);
assert.match(stage, /document\.hidden/);
assert.match(stage, /elapsedMs\.current \+= time - lastFrameAt\.current/);
assert.doesNotMatch(css, /tutor-orbit__outer-slot[\s\S]{0,300}opacity:\s*0\.58/);
```

Read `TutorOrbitStage.tsx` into a new `stage` string in the test fixture. The production change that makes these tests pass is extracting the stage and rendering safe-sector transforms, pointer response, promotion layer, and marker layers.

- [ ] **Step 2: Run hero tests and verify RED**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/TutorOrbitHero.test.ts
```

Expected: FAIL because `TutorOrbitStage.tsx` and its contracts do not exist.

- [ ] **Step 3: Implement the shared clocks and viewport band hook**

Move `useOrbitClock` into `TutorOrbitStage.tsx`. Preserve accumulated elapsed time and set `lastFrameAt.current = null` when paused or `document.hidden`. Add a match-media width hook returning `wide`, `desktop`, `tablet`, or `mobile` without reading layout per frame.

```ts
function useGeometryBand() {
  const [band, setBand] = useState<GeometryBand>(() => geometryBandForWidth(window.innerWidth));
  useEffect(() => {
    const update = () => setBand(geometryBandForWidth(window.innerWidth));
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  return band;
}

useAnimationFrame((time) => {
  if (!enabled || document.hidden) { lastFrameAt.current = null; return; }
  if (lastFrameAt.current === null) { lastFrameAt.current = time; return; }
  elapsedMs.current += time - lastFrameAt.current;
  lastFrameAt.current = time;
  clock.set(direction * elapsedMs.current / 1000 / durationSeconds * TAU);
});
```

- [ ] **Step 4: Render tutors from safe sectors**

For each tutor, create transforms from one shared tier clock:

```ts
const progress = useTransform(clock, (angle) => ((angle / TAU) % 1 + 1) % 1);
const x = useTransform(progress, (value) => poseForSector(sector, value).x);
const y = useTransform(progress, (value) => poseForSector(sector, value).y);
const scale = useTransform(progress, (value) => poseForSector(sector, value).scale);
const opacity = useTransform(progress, (value) => poseForSector(sector, value).opacity);
```

Use the existing shared tutor `layoutId`, real button semantics, hover/focus hold keys, and upright portrait content. Inner tutors retain permanent labels; outer tutors render one tooltip-style label visible only for `:hover` and `:focus-within`.

- [ ] **Step 5: Add bounded pointer parallax and portrait life**

Use one stage-level pointer handler. Normalize the pointer to `[-1, 1]`, spring it with restrained settings, and map it to maximum translations of 5px for the portrait field, 8px for the halo, and 3px for SVG geometry. Reset to zero on pointer leave. Derive each portrait's 2px breathing offset from its shared clock plus its sector phase; do not start per-portrait animation loops.

```ts
const pointerX = useMotionValue(0);
const pointerY = useMotionValue(0);
const fieldX = useSpring(useTransform(pointerX, [-1, 1], [-5, 5]), { stiffness: 55, damping: 22 });
const fieldY = useSpring(useTransform(pointerY, [-1, 1], [-5, 5]), { stiffness: 55, damping: 22 });
const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
  pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
};
```

- [ ] **Step 6: Add the promotion and marker layers**

When `phase === 'promoting'`, render one non-interactive promotion portrait above the outer tier and animate it through the authored promotion waypoint using keyframed `x`, `y`, `scale`, and `opacity` over 240ms. Keep three decorative marker nodes on SVG paths, mask them behind the profile exclusion wedge, and disable their travel for reduced motion.

```tsx
{phase === 'promoting' && selectedTutor ? (
  <motion.div
    className="tutor-orbit__promotion-portrait"
    aria-hidden="true"
    initial={{ x: origin.x, y: origin.y, scale: 0.9, opacity: 0.7 }}
    animate={{ x: [origin.x, waypoint.x], y: [origin.y, waypoint.y], scale: [0.9, 1.08], opacity: 1 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
  >
    <img src={getPhotoUrl(selectedTutor)} alt="" style={getPhotoStyle(selectedTutor)} />
  </motion.div>
) : null}
```

- [ ] **Step 7: Add the non-blocking entrance sequence**

Use Framer variants with these approximate times: atmosphere 0–300ms, editorial 120–620ms, centre 300–760ms, inner tutors 500–1100ms, outer tutors 720–1450ms, profile handoff signal 1050–1800ms. Set `pointer-events` normally from first paint; variants affect only opacity and transform.

- [ ] **Step 8: Run focused tests and typecheck**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/TutorOrbitHero.test.ts src/features/tutor-orbit/tutor-orbit-config.test.ts src/features/tutor-orbit/tutor-orbit-geometry.test.ts
npm.cmd run typecheck
```

Expected: focused tests and typecheck PASS.

- [ ] **Step 9: Commit the stage**

```powershell
git add -- src/features/tutor-orbit/TutorOrbitStage.tsx src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitHero.test.ts
git commit -m "feat: render living tutors in safe orbit sectors"
```

---

### Task 4: Cinematic selection and staggered profile

**Files:**
- Create: `src/features/tutor-orbit/TutorOrbitProfile.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.test.ts`

**Interfaces:**
- Consumes: `selectionSequenceFor`, `swapFacultyTutor`, active tutor data, and the stage props from Task 3.
- Produces: `TutorOrbitProfile({ tutor, reduced, changing })` and explicit hero state `{ phase, selectedId, originTier }`.

- [ ] **Step 1: Add failing choreography tests**

Add source contracts that assert the hero uses `selectionSequenceFor`, tracks all three selection phases, clears every scheduled timer on unmount, and ignores repeated selection while phase is not idle. Add profile contracts for named variants `shellVariants`, `contentVariants`, and `itemVariants`, an item stagger between `0.045` and `0.075`, shell movement no greater than 6px, and DOM order tier → name → designation → details → teaching style → strengths → CTA.

- [ ] **Step 2: Run the hero test and verify RED**

Run the focused hero test command.

Expected: FAIL because `TutorOrbitProfile.tsx` and the explicit phase choreography do not exist.

- [ ] **Step 3: Implement cancellable selection orchestration**

In the hero, resolve the selected tutor's tier, get its sequence, and schedule state changes from that sequence. Apply `swapFacultyTutor` at the `exchanging` boundary, not at the beginning of an outer promotion. Store timer IDs in one ref array, clear it before a new sequence and on unmount, and return early unless phase is `idle`. Reduced motion bypasses promotion and completes in 160ms.

```ts
const timers = useRef<number[]>([]);
const clearSelectionTimers = useCallback(() => {
  timers.current.forEach((timer) => window.clearTimeout(timer));
  timers.current = [];
}, []);

const selectTutor = (selectedId: string) => {
  if (selection.phase !== 'idle') return;
  const originTier = innerIds.includes(selectedId) ? 'inner' : 'outer';
  const result = swapFacultyTutor(activeId, innerIds, outerIds, selectedId);
  for (const step of selectionSequenceFor(originTier, reduced)) {
    timers.current.push(window.setTimeout(() => {
      setSelection({ phase: step.phase, selectedId, originTier });
      if (step.phase === 'exchanging') {
        setActiveId(result.activeId);
        setInnerIds(result.innerIds);
        setOuterIds(result.outerIds);
      }
    }, step.at));
  }
};
```

- [ ] **Step 4: Extract and animate the profile**

Move profile rendering into `TutorOrbitProfile.tsx`. Use `AnimatePresence mode="wait"`, a 4–6px shell lift, and child variants with a 0.06-second stagger. Reserve profile grid rows for details, teaching style, strengths, and CTA so variable tutor copy does not shift the button. Keep `aria-live="polite"` on the panel and preserve the existing route.

```ts
const shellVariants = { idle: { y: 0 }, changing: { y: -6 } };
const contentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
};
```

- [ ] **Step 5: Connect stage rebalancing states**

During `promoting`, dim non-selected outer tutors and nudge primary tutors by no more than 4px inside their sector. During `exchanging`, soften both tiers and offset SVG path groups by no more than 3px. Restore normal values only when phase returns to `idle` so the accumulated clocks resume cleanly.

- [ ] **Step 6: Verify behavior tests and typecheck**

Run all focused tests and `npm.cmd run typecheck`.

Expected: PASS with no TypeScript diagnostics.

- [ ] **Step 7: Commit the selection/profile unit**

```powershell
git add -- src/features/tutor-orbit/TutorOrbitProfile.tsx src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitHero.test.ts
git commit -m "feat: choreograph tutor promotion and profile reveal"
```

---

### Task 5: Tablet topology and mobile faculty navigator

**Files:**
- Create: `src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.tsx`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.test.ts`
- Modify: `src/features/tutor-orbit/tutor-orbit.css`

**Interfaces:**
- Consumes: `rosterWindow`, `nextRosterPage`, all fifteen current tutor IDs, and `onSelect(id)`.
- Produces: `TutorOrbitMobileNavigator({ tutors, activeId, reduced, onSelect })`.

- [ ] **Step 1: Add failing responsive and navigator tests**

Add source assertions for four visible mobile supporters, labelled previous/next buttons, `Educators ${start}–${end} of ${total}`, pointer swipe threshold of 48px, and reduced-motion transition duration. Add CSS assertions that the profile stacks below the stage at `max-width: 1199px`, tablet shows at most six outer slots, mobile hides the desktop orbit tiers, and the old `display: contents` profile rule is absent.

- [ ] **Step 2: Run hero tests and verify RED**

Expected: FAIL because the navigator and new breakpoint topology are missing.

- [ ] **Step 3: Implement the mobile navigator**

Render four tutor buttons from `rosterWindow`. Provide visible previous/next buttons with `aria-label="Previous educators"` and `aria-label="Next educators"`, a polite roster status, and pointer-down/up swipe detection that changes pages only when horizontal travel exceeds 48px and dominates vertical travel. Selecting a tutor calls the shared hero selection path. All fifteen tutors must become reachable by repeated next navigation.

```tsx
const visibleIds = rosterWindow(tutors.map((tutor) => tutor.id), page, 4);
const pointerStart = useRef<{ x: number; y: number } | null>(null);
const finishSwipe = (event: React.PointerEvent) => {
  if (!pointerStart.current) return;
  const dx = event.clientX - pointerStart.current.x;
  const dy = event.clientY - pointerStart.current.y;
  if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy)) {
    setPage((current) => nextRosterPage(current, dx < 0 ? 1 : -1, tutors.length, 4));
  }
  pointerStart.current = null;
};
```

- [ ] **Step 4: Replace the responsive topology**

At 721–1199px, stack the profile below the editorial/stage row, render five primary and six secondary sectors, reduce parallax, and retain only restrained marker motion. At 720px and below, hide desktop inner/outer sector layers and render the centre plus mobile navigator. Remove `display: contents`; animate a real profile wrapper at every size.

```css
@media (max-width: 1199px) {
  .tutor-orbit { grid-template-columns: minmax(250px, .72fr) minmax(0, 1.28fr); }
  .tutor-orbit__profile { grid-column: 1 / -1; margin-inline: auto; }
  .tutor-orbit__outer-slot:nth-child(n + 7) { display: none; }
}

@media (max-width: 720px) {
  .tutor-orbit__inner-orbit,
  .tutor-orbit__outer-orbit { display: none; }
  .tutor-orbit__mobile-navigator { display: grid; }
}
```

- [ ] **Step 5: Implement reduced-motion behavior**

Disable clocks, pointer mapping, centre float, portrait breathing, marker motion, and entrance staggering under reduced motion. Keep 120–160ms opacity/scale selection and navigator changes. Verify every portrait and navigator control remains keyboard reachable.

```css
@media (prefers-reduced-motion: reduce) {
  .tutor-orbit__featured-float,
  .tutor-orbit__marker,
  .tutor-orbit__portrait-life { animation: none !important; }
  .tutor-orbit__stage { transform: none !important; }
}
```

- [ ] **Step 6: Run focused tests, typecheck, and scoped lint**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/*.test.ts
npm.cmd run typecheck
npx.cmd eslint src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitStage.tsx src/features/tutor-orbit/TutorOrbitProfile.tsx src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx src/features/tutor-orbit/tutor-orbit-config.ts src/features/tutor-orbit/tutor-orbit-geometry.ts
```

Expected: all commands PASS.

- [ ] **Step 7: Commit responsive behavior**

```powershell
git add -- src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitHero.test.ts src/features/tutor-orbit/tutor-orbit.css
git commit -m "feat: adapt tutor orbit for tablet and mobile"
```

---

### Task 6: Premium visual hierarchy and motion states

**Files:**
- Modify: `src/features/tutor-orbit/tutor-orbit.css`
- Modify: `src/features/tutor-orbit/TutorOrbitHero.test.ts`

**Interfaces:**
- Consumes: class names and data states created in Tasks 3–5.
- Produces: final visual treatment for safe sectors, labels, depth, selection, entrance, and responsive modes.

- [ ] **Step 1: Add failing visual contract tests**

Assert the CSS contains outer label disclosure only on hover/focus, explicit promotion/exchanging states, profile exclusion masking, centre/inner/outer size tokens, bounded centre float, and reduced-motion overrides for every continuous motion class. Assert no `transition: all`, heavy blur above 8px on portraits, or permanent outer-name opacity rule exists.

- [ ] **Step 2: Run hero tests and verify RED**

Expected: FAIL on the missing final visual contracts.

- [ ] **Step 3: Establish semantic geometry and spacing tokens**

Define section-scoped custom properties for centre, primary, and secondary portrait sizes; safe-stage width/height; card exclusion inset; and tight/standard/generous gaps. Replace one-off values in the modified orbit block where a semantic token controls the same relationship.

```css
.tutor-orbit {
  --orbit-centre-size: clamp(300px, 23vw, 360px);
  --orbit-primary-size: clamp(68px, 5vw, 82px);
  --orbit-secondary-size: clamp(40px, 3vw, 50px);
  --orbit-gap-tight: 8px;
  --orbit-gap-standard: 16px;
  --orbit-gap-generous: 32px;
  --orbit-card-exclusion: 92px;
}
```

- [ ] **Step 4: Implement controlled depth and label hierarchy**

Give the centre the strongest edge light and halo, primary portraits a readable gold rim and permanent names, and secondary portraits a quieter rim with lower opacity. Secondary labels start hidden and reveal as one short tooltip on hover/focus. Use z-index and opacity to imply depth without making educators look disabled.

```css
.tutor-orbit__outer-slot .tutor-orbit__satellite-name {
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
}
.tutor-orbit__outer-slot:hover .tutor-orbit__satellite-name,
.tutor-orbit__outer-slot:focus-within .tutor-orbit__satellite-name {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 5: Implement refined state styling**

Add subtle whole-field glow response, 2–4px centre float, selected portrait emphasis, non-selected softening, promotion corridor highlight, profile shell lift, and masked marker passage. Keep all portrait imagery sharp; any portrait blur is capped at 1px and used only at the farthest depth state.

```css
.tutor-orbit__stage.is-promoting .tutor-orbit__satellite:not(.is-selected) { filter: brightness(.88); }
.tutor-orbit__promotion-portrait { z-index: 8; filter: drop-shadow(0 0 18px rgba(214,160,68,.42)); }
@keyframes tutor-orbit-centre-float {
  from { transform: translateY(-2px); }
  to { transform: translateY(3px); }
}
```

- [ ] **Step 6: Verify tests and run Impeccable detector**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/*.test.ts
node .agents/skills/impeccable/scripts/detect.mjs --json --scope layout src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitStage.tsx src/features/tutor-orbit/TutorOrbitProfile.tsx src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx src/features/tutor-orbit/tutor-orbit.css
```

Expected: tests PASS and detector returns no unexplained findings.

- [ ] **Step 7: Commit visual refinement**

```powershell
git add -- src/features/tutor-orbit/tutor-orbit.css src/features/tutor-orbit/TutorOrbitHero.test.ts
git commit -m "style: refine tutor orbit hierarchy and depth"
```

---

### Task 7: Rendered collision QA and deliverables

**Files:**
- Create: `scripts/qa-tutor-orbit.mjs`
- Create: `artifacts/tutor-orbit/.gitkeep`
- Modify if defects are found: files owned by Tasks 1–6

**Interfaces:**
- Consumes: running `/tutors` route and production DOM class names.
- Produces: non-zero exit on prohibited overlap, screenshots in `artifacts/tutor-orbit/`, and a JSON summary.

- [ ] **Step 1: Write the failing QA harness against the current page**

Create a Puppeteer script with viewports `1920×1080`, `1440×900`, `1366×768`, `1024×768`, and `390×844`. For each viewport, collect visible portrait, label, centre, profile, headline, and viewport bounds. Fail when two visible portrait bounds intersect, when a visible label intersects another visible label, when a portrait intersects centre/profile/headline bounds, or when `document.documentElement.scrollWidth > window.innerWidth`.

Use this result shape:

```js
{
  viewport: '1440x900',
  visiblePortraits: 15,
  collisions: [],
  horizontalOverflow: false,
  consoleErrors: [],
  screenshot: 'artifacts/tutor-orbit/tutors-1440x900.png'
}
```

Accept a URL through `TUTOR_ORBIT_QA_URL` and default to `http://127.0.0.1:8080/tutors`.

```js
const viewports = [[1920,1080],[1440,900],[1366,768],[1024,768],[390,844]];
const intersects = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
for (const [width, height] of viewports) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(() => {
    const rect = (node) => node.getBoundingClientRect().toJSON();
    return {
      portraits: [...document.querySelectorAll('[data-orbit-portrait]')].filter((node) => getComputedStyle(node).display !== 'none').map(rect),
      labels: [...document.querySelectorAll('[data-orbit-label]')].filter((node) => getComputedStyle(node).opacity !== '0').map(rect),
      centre: rect(document.querySelector('.tutor-orbit__featured-frame')),
      profile: rect(document.querySelector('.tutor-orbit__profile')),
      headline: rect(document.querySelector('.tutor-orbit__editorial h1')),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  const collisions = [];
  for (let left = 0; left < result.portraits.length; left += 1) {
    for (let right = left + 1; right < result.portraits.length; right += 1) {
      if (intersects(result.portraits[left], result.portraits[right])) collisions.push(`portrait:${left}:${right}`);
    }
    if (intersects(result.portraits[left], result.centre)) collisions.push(`centre:${left}`);
    if (width >= 1200 && intersects(result.portraits[left], result.profile)) collisions.push(`profile:${left}`);
    if (width >= 1200 && intersects(result.portraits[left], result.headline)) collisions.push(`headline:${left}`);
  }
  if (collisions.length > 0 || result.horizontalOverflow) process.exitCode = 1;
}
```

- [ ] **Step 2: Run the harness before final corrections**

Start Vite on a free local port and run:

```powershell
$env:TUTOR_ORBIT_QA_URL='http://127.0.0.1:8082/tutors'
node scripts/qa-tutor-orbit.mjs
```

Expected: FAIL if any rendered collision or overflow remains; the JSON identifies exact elements.

- [ ] **Step 3: Perform one batched visual correction pass**

Inspect all five screenshots together. Correct authored sector points, exclusion-zone dimensions, profile width, label sides, stage scale, or breakpoint topology in one batch. Do not hide desktop tutors to make a geometry failure disappear, and do not fix geometry using extra glow, shadow, or blur.

- [ ] **Step 4: Verify interaction choreography in the harness**

Extend the script to sample an inner portrait transform, confirm movement, hover it, confirm the transform remains exact, select one outer tutor, confirm `promoting` precedes `exchanging`, and verify the selected tutor becomes centre while the previous centre occupies the same outer slot. Repeat selection under reduced motion and by keyboard.

- [ ] **Step 5: Run the confirmation pass and capture deliverables**

Run the harness once more. Expected: every viewport reports `collisions: []`, `horizontalOverflow: false`, and no application JavaScript errors. Retain desktop screenshots for 1920, 1440, and 1366; retain tablet 1024 and mobile 390 screenshots.

If a local recording facility can capture without adding a production dependency, record entrance → hover pause → outer promotion → profile reveal to `artifacts/tutor-orbit/tutor-orbit-motion.gif` or `.webm`. Otherwise, record `motionCapture: "unavailable"` in the JSON summary.

- [ ] **Step 6: Run final verification**

```powershell
node --test --experimental-strip-types src/features/tutor-orbit/*.test.ts
npm.cmd run typecheck
npx.cmd eslint src/features/tutor-orbit/TutorOrbitHero.tsx src/features/tutor-orbit/TutorOrbitStage.tsx src/features/tutor-orbit/TutorOrbitProfile.tsx src/features/tutor-orbit/TutorOrbitMobileNavigator.tsx src/features/tutor-orbit/tutor-orbit-config.ts src/features/tutor-orbit/tutor-orbit-geometry.ts
npx.cmd vite build
```

Run `npm.cmd run build` separately. If it stops at the known encoding gate in `.worktrees/why-da-community`, report that exact independent repository blocker while retaining the successful direct Vite production build as implementation evidence.

- [ ] **Step 7: Commit the QA harness and final corrections**

```powershell
git add -- scripts/qa-tutor-orbit.mjs artifacts/tutor-orbit src/features/tutor-orbit
git commit -m "test: verify tutor orbit spacing and motion"
```

---

## Completion evidence

The handoff must include:

- a concise explanation of the safe-sector geometry and protected profile wedge;
- a concise explanation of shared clocks, local portrait life, pointer response, markers, entrance, and selection phases;
- how all fifteen desktop educators remain represented without equal visual weight;
- desktop and mobile screenshots, with all five tested viewport sizes listed;
- the motion recording or an explicit capture-unavailable note;
- focused tests, typecheck, scoped lint, direct production bundle, and standard wrapper-build results;
- any responsive or performance tradeoffs;
- exact commit state without staging or committing unrelated dirty work.
