# Standalone Mathematics Scroll Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, portable React/GSAP/R3F native-scroll prototype that resolves into a validated 2024 NSW Stage 6 topic network.

**Architecture:** `maths-scroll.html` is a Vite multi-page dev entry that mounts only `MathsScrollSceneDemo`; it is never imported by `src/main.tsx` or `App.tsx`. A mutable scene model receives GSAP `ScrollTrigger` values, an R3F canvas reads and renders it without scroll-driven React state, and an afterglow receives the exact same validated network data and computed layout.

**Tech Stack:** React 18.3, TypeScript 5.5, GSAP 3.15 + ScrollTrigger, Three 0.170, React Three Fiber 8.17, CSS, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-20-standalone-maths-scroll-scene-design.md`

## Global Constraints

- Do not modify `App.tsx`, `main.tsx`, routes, shared/global CSS, analytics, site components, or existing files.
- Create only `maths-scroll.html` and `src/prototypes/maths-scroll/*`.
- Do not add dependencies, assets, post-processing, real-time shadows, or hand-authored illustration.
- Use only `#f7f3eb`, `#0b1f3a`, and `#b68a30`, plus alpha variants required for legibility.
- Use a normal-document-flow track: desktop `1100vh`, mobile `800vh`; sticky viewport; no scroll interception.
- No React state mutation on scroll frames; GSAP mutates numeric scene state and Canvas invalidates only when needed.
- Every final network datum must carry a 2024 NESA source note; no inferred membership or unsupported edge.

---

### Task 1: Isolated entry, validated syllabus data, and data invariants

**Files:**
- Create: `maths-scroll.html`
- Create: `src/prototypes/maths-scroll/MathsScrollSceneDemo.tsx`
- Create: `src/prototypes/maths-scroll/maths-syllabus-data.ts`
- Create: `src/prototypes/maths-scroll/maths-syllabus-data.test.ts`

**Interfaces:**
- Produces `COURSES`, `NETWORK_NODES`, `NETWORK_EDGES`, and `NETWORK_LAYOUT`.
- `NetworkNode` has `id`, `label`, `courses`, `motif`, `sourceUrl`, `sourceNote`, `position`.
- `NetworkEdge` has `from`, `to`, `kind`, `sourceUrl`, `sourceNote`, `seedProgress`.

- [ ] Write the failing node-test asserting unique IDs, valid course IDs, non-empty NESA source URLs/notes, finite positions, and that every edge references an existing node.
- [ ] Write the failing relationship-test asserting the curated graph contains Functions→Trigonometry, Functions→Calculus, Calculus→Further Calculus, Vectors→Mechanics, Combinatorics→Probability, and Probability→Statistics.
- [ ] Create the mapped data using only the official 2024 NESA course overview/content references: Standard (Algebra, Networks, Statistics), Advanced (Functions, Trigonometric functions, Calculus, Statistical analysis), Extension 1 (Vectors, Combinatorics, Further calculus, Statistical analysis), Extension 2 (Vectors, Complex numbers, Further integration, Mechanics).
- [ ] Create the standalone HTML entry with a dedicated root and viewport metadata, then mount the demo with `createRoot`.
- [ ] Run `node --test --experimental-strip-types src/prototypes/maths-scroll/maths-syllabus-data.test.ts`; expect all validation assertions to pass.

### Task 2: Pure geometry and mutable scene-state model

**Files:**
- Create: `src/prototypes/maths-scroll/maths-scene-state.ts`
- Create: `src/prototypes/maths-scroll/maths-scene-geometry.ts`
- Create: `src/prototypes/maths-scroll/maths-scene-geometry.test.ts`

**Interfaces:**
- `createSceneState(): SceneState` returns all scalar progress fields at zero.
- `setSceneProgress(state, progress)` maps progress to named ranges without creating arrays/objects per tick.
- `createMathsGeometry()` returns cached sampled curves, area vertices, vector directions, orbit points, mechanics path, and faint structural edges.

- [ ] Write failing tests for fixed curve sample counts, finite coordinate values, quadratic values at sampled x coordinates, and finite mechanics/orbit data.
- [ ] Implement deterministic sample generation once: quadratic `0.16x² - 0.7x + 0.25`, linear, exponential, sine, tangent, bounded area, vector endpoints, complex orbit, projectile trace, and combinatorics branches.
- [ ] Map all timeline bands through interpolation helpers so the ranges 0.00–0.07 through 0.91–1.00 exactly match the design spec.
- [ ] Run the focused geometry and syllabus tests together; expect pass.

### Task 3: Scroll controller and minimal React shell

**Files:**
- Create: `src/prototypes/maths-scroll/useMathsScrollTimeline.ts`
- Create: `src/prototypes/maths-scroll/MathsScrollScene.tsx`
- Create: `src/prototypes/maths-scroll/maths-scroll-scene.css`

**Interfaces:**
- `useMathsScrollTimeline(trackRef, sceneState, invalidate, enabled)` creates and cleans up the sole ScrollTrigger.
- `MathsScrollScene` renders the track, sticky visual region, temporary DOM captions, reduced-motion summary, Canvas, and afterglow.

- [ ] Write an initial source-level test asserting one `ScrollTrigger.create` call and cleanup through `gsap.context().revert()`.
- [ ] Implement the normal `1100vh` desktop / `800vh` mobile track and sticky canvas shell, without global selectors.
- [ ] Implement captions that only change after stage midpoints and are absent during pullback/network ranges.
- [ ] Use `matchMedia('(prefers-reduced-motion: reduce)')` to bypass ScrollTrigger, pinning, and scrubbing while exposing DOM relationship/course summaries.
- [ ] Run focused tests and TypeScript; expect no errors attributable to the prototype.

### Task 4: R3F scene graph and spatial choreography

**Files:**
- Create: `src/prototypes/maths-scroll/MathsSceneCanvas.tsx`
- Modify: `src/prototypes/maths-scroll/maths-scroll-scene.css`

**Interfaces:**
- Canvas takes `sceneState`, cached geometry, `networkData`, and `onInvalidate`.
- It applies scene progress to object group opacity/scale/position and camera position/FOV inside `useFrame`, without setting React state.

- [ ] Render the initial flat folio with coordinate rules, two anchored points, and quadratic field.
- [ ] Keep function-family planes concurrent, seed incomplete relationship strokes from 0.15, and let trigonometry/calculus become spatially adjacent rather than mesh morphs.
- [ ] Introduce z separation/perspective gradually between 0.47–0.57; retain distant earlier planes in later stages.
- [ ] Render a complex orbit and projectile trace as related spatial constructions.
- [ ] Choreograph the 0.72–0.80 pullback as the largest camera-scale change; reveal the richer field without adding dense decoration.
- [ ] Draw the topic network from `NETWORK_NODES`, `NETWORK_EDGES`, and `NETWORK_LAYOUT`, with topic relationships before secondary course halos/line treatments.
- [ ] Cap DPR (`1.5` mobile, `2` desktop), use demand frameloop, no shadows/post-processing, and stop invalidation while out of view.

### Task 5: Static afterglow and responsive refinement

**Files:**
- Create: `src/prototypes/maths-scroll/MathsScrollSceneAfterglow.tsx`
- Modify: `src/prototypes/maths-scroll/MathsScrollScene.tsx`
- Modify: `src/prototypes/maths-scroll/maths-scroll-scene.css`

**Interfaces:**
- `MathsScrollSceneAfterglow` receives the exact `NETWORK_NODES`, `NETWORK_EDGES`, and `NETWORK_LAYOUT` imports used by the canvas; it must not derive a second layout.

- [ ] Render the post-pin static section as the same network composition in a quieter SVG/DOM presentation, plus accessible relationship list and small course key.
- [ ] Confirm the afterglow has no independent hard-coded positions or relationship data.
- [ ] Add mobile media rules that hide only non-essential labels and distant geometry while keeping pullback and final network meaning intact.
- [ ] Run focused tests, typecheck, and `git diff --check`.

### Task 6: Isolated rendered QA and refinement

**Files:**
- Modify only prototype files as needed from findings.

- [ ] Start Vite with the approved dev command and load `/maths-scroll.html`.
- [ ] Capture desktop and mobile screenshots at first frame, function branches, calculus, depth opening, rotation, mechanics, pullback, network, and afterglow.
- [ ] Exercise slow, fast, reverse, and repeated-direction scrolling; check that the timeline is bidirectional and no scroll trapping occurs.
- [ ] Inspect console for React, WebGL, GSAP and ScrollTrigger errors/warnings.
- [ ] Use browser performance tooling around space opening, pullback and full network; reduce distant geometry, samples, network decoration, then DPR in that order if needed.
- [ ] Verify reduced motion and source assertions that neither `App.tsx` nor `main.tsx` was changed.
- [ ] Run `npm.cmd run typecheck`, focused node tests, `npm.cmd run lint -- --quiet`, and direct `node_modules\\.bin\\vite.cmd build` if unrelated repository conditions allow.

## Self-Review

**Spec coverage:** Tasks 1–2 cover validation/data/geometry; Task 3 covers native scrub/reduced motion; Task 4 covers all ten scene stages and performance contract; Task 5 covers post-pin continuity/mobile; Task 6 covers rendered QA. No production file is in scope.

**Placeholder scan:** no implementation placeholder is permitted; every visual component, data source, test, and QA surface is assigned.

**Type consistency:** the shared data module is the only source for node IDs, course membership, edge links, source notes, and layout, consumed by both canvas and afterglow.
