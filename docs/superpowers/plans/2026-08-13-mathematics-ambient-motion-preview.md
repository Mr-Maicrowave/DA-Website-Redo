# Mathematics Ambient Motion Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five preview-only dark mathematical motion stages to the real Mathematics page without changing its hero or normal URL.

**Architecture:** A pure helper determines whether the exact preview query flag is enabled. A reusable feature-local stage component owns layout and viewport activation, while five focused SVG scenes own their mathematical animation. Mathematics distributes the gated stages between related existing sections.

**Tech Stack:** React 18, TypeScript, Framer Motion, SVG, Tailwind CSS, Node test runner.

## Global Constraints

- The prototype renders only at `/subjects/mathematics?motionPreview=1`.
- `/subjects/mathematics` remains visually unchanged.
- No new runtime dependency, Manim process, video asset or global scroll listener.
- Reduced-motion visitors receive complete static diagrams.
- Motion must not intercept pointer input, create horizontal overflow or obscure essential content.

---

### Task 1: Preview flag contract

**Files:**
- Create: `src/features/maths-ambient-motion/preview-mode.ts`
- Create: `src/features/maths-ambient-motion/preview-mode.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `isMathsAmbientPreview(search: string): boolean`

- [ ] Write tests requiring only the exact `motionPreview=1` query value to enable the prototype.
- [ ] Run the focused Node test and confirm it fails because the module does not exist.
- [ ] Implement the URLSearchParams-based helper.
- [ ] Add the focused test to a `test:maths-motion` script and confirm it passes.

### Task 2: Reusable dark stages and five scenes

**Files:**
- Create: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Create: `src/features/maths-ambient-motion/maths-ambient-motion.css`

**Interfaces:**
- Produces: `NetworkMotionStage`, `DerivativeMotionStage`, `IntegralMotionStage`, `VectorMotionStage` and `SineMotionStage` React components.
- Consumes: Framer Motion's reduced-motion and in-view primitives.

- [ ] Add structural source tests requiring all five subjects, dark-stage styling, pointer safety, reduced-motion styling and viewport gating.
- [ ] Run the focused tests and confirm failure because the components do not exist.
- [ ] Implement the reusable two-column dark stage and its stacked mobile layout.
- [ ] Implement network, derivative, integral, vector and unit-circle-to-sine scenes.
- [ ] Pause repeating motion outside the viewport and render complete final states for reduced motion.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Distributed Mathematics integration

**Files:**
- Modify: `src/pages/subjects/Mathematics.tsx`

**Interfaces:**
- Mathematics consumes the preview helper and five motion-stage components.

- [ ] Add a source-level integration test requiring the unchanged hero, query gate and all five preview mounts.
- [ ] Run the focused test and confirm failure against the current source.
- [ ] Remove the rejected hero overlay and margin mount.
- [ ] Gate all five stages using `useLocation().search` and the pure helper.
- [ ] Distribute the stages after the hero, after basketball, before Fourier, after real-world applications and before HSC streams.
- [ ] Run focused tests and confirm they pass.

### Task 4: Verification and rendered QA

**Files:**
- Modify only the files above if rendered defects are found.

- [ ] Run `npm.cmd run test:maths-motion` and the existing Graph Lab tests.
- [ ] Run TypeScript and focused ESLint checks.
- [ ] Run the production build.
- [ ] Compare `/subjects/mathematics` with `/subjects/mathematics?motionPreview=1` at desktop, tablet and mobile sizes.
- [ ] Verify reduced-motion, no pointer interception, no horizontal overflow and no essential-content overlap.
