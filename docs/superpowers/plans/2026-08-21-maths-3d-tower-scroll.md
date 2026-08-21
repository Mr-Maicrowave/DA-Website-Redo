# Mathematics 3D Tower Scroll Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the raster tower scroll with a deterministic, performant 3D tower whose ball travels an exact rail and resolves into the real DA Tuition logo.

**Architecture:** One scene-data module supplies the helix control points, camera positions and chapter progress. `MathsTowerScene` derives both TubeGeometry and ball position from that one source; `MathsSyllabusScrollStory` owns scroll progress, accessible cards and the final DOM logo overlay.

**Tech Stack:** React 18, TypeScript, @react-three/fiber, @react-three/drei, Three.js, GSAP ScrollTrigger, Framer Motion, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-21-maths-3d-tower-scroll-design.md`

## Global Constraints

- Use one `CatmullRomCurve3`-compatible rail dataset for visible rail and ball position.
- Render one substantial metallic gold ball; no generated video or timeline-based disappearance.
- Standard remains separate; Extension 1 and 2 are Advanced companions in live semantic copy.
- Use `/images/maths-tower-story/da-logo-full-exact.png` unmodified.
- Mobile, reduced-motion and WebGL failure retain poster plus normal-flow cards.
- Keep Canvas procedural, cap DPR at 1.5, and make no network model/video request.

---

### Task 1: Define the shared 3D scene contract

**Files:**
- Create: `src/features/maths-syllabus-scroll-story/maths-tower-scene-data.ts`
- Create: `src/features/maths-syllabus-scroll-story/maths-tower-scene-data.test.ts`

**Interfaces:**
- Produces: `TOWER_CHAPTERS`, `TOWER_RAIL_POINTS`, `getRailPoint(progress)`, `getCameraPose(progress)`, `getEndingProgress(progress)`.
- Consumed by: `MathsTowerScene.tsx` and `MathsSyllabusScrollStory.tsx`.

- [ ] **Step 1: Write the failing data tests**

```ts
test('rail and chapters are ordered and end at landing', () => {
  assert.equal(TOWER_RAIL_POINTS[0].progress, 0);
  assert.equal(TOWER_RAIL_POINTS.at(-1)?.kind, 'landing');
  assert.ok(TOWER_RAIL_POINTS.every((point, index) => index === 0 || point.progress > TOWER_RAIL_POINTS[index - 1].progress));
});
test('ending fully clears tower and reveals logo', () => {
  assert.deepEqual(getEndingProgress(1), { towerOpacity: 0, logoProgress: 1 });
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test --experimental-strip-types src/features/maths-syllabus-scroll-story/maths-tower-scene-data.test.ts`

Expected: FAIL because the contract does not yet exist.

- [ ] **Step 3: Implement the contract**

```ts
export interface TowerRailPoint {
  progress: number;
  position: readonly [number, number, number];
  kind: 'rail' | 'landing';
}
export const TOWER_RAIL_POINTS: readonly TowerRailPoint[] = [
  { progress: 0, position: [0.5, 5.8, 0], kind: 'rail' },
  { progress: 0.90, position: [-0.2, -4.7, 0.1], kind: 'rail' },
  { progress: 0.965, position: [0, -5.9, 0], kind: 'landing' },
];
```

Implement bounded interpolation only; `getEndingProgress` reaches zero tower opacity at `0.985` and full logo at `1`.

- [ ] **Step 4: Verify and commit**

Run the data test again; expected PASS.

```bash
git add src/features/maths-syllabus-scroll-story/maths-tower-scene-data.ts src/features/maths-syllabus-scroll-story/maths-tower-scene-data.test.ts
git commit -m "feat: define 3d maths tower scene data"
```

### Task 2: Render a procedural tower, rail and ball

**Files:**
- Create: `src/features/maths-syllabus-scroll-story/MathsTowerScene.tsx`
- Create: `src/features/maths-syllabus-scroll-story/maths-tower-scene.test.ts`

**Interfaces:**
- Consumes: the Task 1 data functions.
- Produces: `MathsTowerScene({ progress, onContextFailure })`.
- Consumed by: `MathsSyllabusScrollStory.tsx`.

- [ ] **Step 1: Write failing scene-source tests**

```ts
test('one curve drives rail and ball', () => {
  assert.match(source, /new CatmullRomCurve3/);
  assert.match(source, /TubeGeometry\(curve/);
  assert.match(source, /curve\.getPointAt\(progress\)/);
  assert.equal((source.match(/maths-tower-ball/g) ?? []).length, 1);
});
test('scene caps DPR and handles context loss', () => {
  assert.match(source, /dpr=\{\[1, 1\.5\]\}/);
  assert.match(source, /webglcontextlost/);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test --experimental-strip-types src/features/maths-syllabus-scroll-story/maths-tower-scene.test.ts`

Expected: FAIL because the scene does not exist.

- [ ] **Step 3: Implement `MathsTowerScene`**

```tsx
const curve = useMemo(
  () => new CatmullRomCurve3(TOWER_RAIL_POINTS.map(({ position }) => new Vector3(...position))),
  [],
);
const point = curve.getPointAt(progress);
<Canvas dpr={[1, 1.5]}>
  <Tube args={[curve, 220, 0.11, 14, false]} />
  <mesh className="maths-tower-ball" position={point}>
    <sphereGeometry args={[0.28, 40, 40]} />
    <meshPhysicalMaterial color="#d3a42d" metalness={0.92} roughness={0.16} />
  </mesh>
</Canvas>
```

Add transparent ivory tower geometry, navy/gold rail detail, directional/area lights, soft contact shadow and interpolated camera pose. Use depth-tested geometry for all occlusion; never hide the ball by progress.

- [ ] **Step 4: Verify and commit**

Run the scene test; expected PASS.

```bash
git add src/features/maths-syllabus-scroll-story/MathsTowerScene.tsx src/features/maths-syllabus-scroll-story/maths-tower-scene.test.ts
git commit -m "feat: render deterministic 3d maths tower"
```

### Task 3: Orchestrate scroll, semantic cards, fallbacks and logo ending

**Files:**
- Modify: `src/features/maths-syllabus-scroll-story/MathsSyllabusScrollStory.tsx`
- Modify: `src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.css`
- Modify: `src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts`

**Interfaces:**
- Consumes: `MathsTowerScene`, `TOWER_CHAPTERS`, `getEndingProgress`.
- Produces: desktop pinned 3D sequence and static accessible fallback.

- [ ] **Step 1: Write failing integration tests**

```ts
test('story mounts 3d scene once and removes raster masks', () => {
  assert.match(source, /<MathsTowerScene progress=\{progress\}/);
  assert.doesNotMatch(source, /maths-tower-story__rear|maths-tower-story__front-mask/);
});
test('ending uses exact logo after tower fade', () => {
  assert.match(source, /da-logo-full-exact\.png/);
  assert.match(source, /towerOpacity/);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test --experimental-strip-types src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts`

Expected: FAIL because raster layers still exist.

- [ ] **Step 3: Implement progress and WebGL fallback**

```tsx
const [progress, setProgress] = useState(0);
const [webglFailed, setWebglFailed] = useState(false);
const shouldRenderScene = !prefersReducedMotion && !webglFailed;
{shouldRenderScene
  ? <MathsTowerScene progress={progress} onContextFailure={() => setWebglFailed(true)} />
  : <div className="maths-tower-story__poster" aria-hidden="true" />}
<img className="maths-tower-story__logo" src="/images/maths-tower-story/da-logo-full-exact.png" alt="DA Tuition" />
```

Have ScrollTrigger update `progress`; set one settled semantic card from `TOWER_CHAPTERS`. At the ending, fade Canvas and tower to cream, bloom from the physical landing point and expand the exact logo.

- [ ] **Step 4: Implement scene/fallback CSS**

```css
.maths-tower-story__canvas { position:absolute; inset:0; opacity:var(--tower-opacity); }
.maths-tower-story__logo { opacity:var(--logo-opacity); clip-path:circle(var(--logo-mask) at 50% 50%); transform:translate(-50%,-50%) scale(var(--logo-scale)); }
@media (max-width:767px), (prefers-reduced-motion:reduce) { .maths-tower-story__canvas { display:none; } }
```

Retain the poster and every semantic `article` in normal flow in each fallback.

- [ ] **Step 5: Verify and commit**

Run: `node --test --experimental-strip-types src/features/maths-syllabus-scroll-story/maths-tower-scene-data.test.ts src/features/maths-syllabus-scroll-story/maths-tower-scene.test.ts src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`

Expected: PASS.

```bash
git add src/features/maths-syllabus-scroll-story/MathsSyllabusScrollStory.tsx src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.css src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts
git commit -m "feat: integrate 3d maths tower scroll story"
```

### Task 4: Verify motion, performance and fallbacks

**Files:**
- Modify: `src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts`

**Interfaces:**
- Consumes: complete 3D scene.
- Produces: regression coverage and rendered QA evidence.

- [ ] **Step 1: Add final regression test**

```ts
test('scene has one rail, one ball, no video and exact logo ending', () => {
  assert.match(scene, /TubeGeometry\(curve/);
  assert.equal((scene.match(/maths-tower-ball/g) ?? []).length, 1);
  assert.doesNotMatch(story, /<video|currentTime/);
  assert.match(story, /da-logo-full-exact\.png/);
});
```

- [ ] **Step 2: Verify focused suite**

Run: `node --test --experimental-strip-types src/features/maths-syllabus-scroll-story/*.test.ts src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`

Expected: PASS.

- [ ] **Step 3: Verify compilation, lint, build and browser QA**

```bash
npm.cmd run typecheck
npx eslint src/features/maths-syllabus-scroll-story/MathsTowerScene.tsx src/features/maths-syllabus-scroll-story/maths-tower-scene-data.ts src/features/maths-syllabus-scroll-story/MathsSyllabusScrollStory.tsx
C:\Projects\DA-Website-Redo\node_modules\.bin\vite.cmd build
git diff --check
```

Browser QA at `/subjects/mathematics`: desktop start/middle/end rail contact and tower-cleared logo end; 390px mobile poster/cards; reduced-motion poster/cards; no relevant console errors.

- [ ] **Step 4: Commit regression coverage**

```bash
git add src/features/maths-syllabus-scroll-story/maths-syllabus-scroll-story.test.ts
git commit -m "test: cover 3d maths tower fallbacks"
```

