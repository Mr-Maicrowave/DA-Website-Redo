# Mathematics Ambient Side Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace five preview-only full-width motion stages with three transparent, alternating, side-mounted mathematical moments that expand in place on deliberate interaction.

**Architecture:** A shared `AmbientMathsMoment` component owns interaction and accessibility, while three focused scene components own SVG mathematics. `Mathematics.tsx` keeps only three preview-gated mounting points; CSS positions them in section gutters at wide desktop widths and hides them everywhere else.

**Tech Stack:** React 18, TypeScript, Framer Motion, SVG, KaTeX, CSS, Node test runner.

## Global Constraints

- The normal `/subjects/mathematics` page remains unchanged.
- Basketball and mistake-finding sections are not removed or edited in this iteration.
- Only network, differentiation and vector projection remain.
- Diagrams use transparent beige-page integration, not dark panels or cards.
- Side moments render only at `min-width: 1680px` and never move inline.
- Reduced-motion users receive a static construction and instant state change.

---

### Task 1: Mathematical model and source contract

**Files:**
- Create: `src/features/maths-ambient-motion/derivative-model.ts`
- Create: `src/features/maths-ambient-motion/derivative-model.test.ts`
- Modify: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

**Interfaces:**
- Produces: `sampleDerivativeModel(sampleCount: number): Array<{ x: number; y: number; derivative: number }>`
- Produces: source constraints requiring exactly `NetworkAmbientMoment`, `DerivativeAmbientMoment`, `VectorAmbientMoment`.

- [ ] **Step 1: Write failing tests** asserting the sample array has matching `y` and analytical derivative values, monotonic `x`, and that source contains three moments with no full-width stage exports.
- [ ] **Step 2: Run `npm.cmd run test:maths-motion`** and verify failures name the missing model and obsolete stage structure.
- [ ] **Step 3: Implement `sampleDerivativeModel`** using `f(x) = 0.34x^3 - 1.7x` and `f'(x) = 1.02x^2 - 1.7`, returning evenly spaced samples from `-2.2` to `2.2`.
- [ ] **Step 4: Run `npm.cmd run test:maths-motion`** and verify model tests pass while structural tests remain red.

### Task 2: Shared ambient interaction shell

**Files:**
- Rewrite: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Rewrite: `src/features/maths-ambient-motion/maths-ambient-motion.css`

**Interfaces:**
- Produces: `AmbientMathsMoment` with props `{ side, label, equation, explanation, children }`.
- Produces: delayed hover/focus enhancement, click expansion, Escape/outside close and focus restoration.

- [ ] **Step 1: Add structural tests** for a semantic button, `aria-expanded`, Escape/outside-click handling, focus veil and ordinary-desktop visibility.
- [ ] **Step 2: Run the motion test suite** and confirm it fails against the old full-width stage.
- [ ] **Step 3: Implement the shell** with a 220 ms hover timer, fixed viewport focus layer, accessible equation/derivation and outside-click/Escape behaviour.
- [ ] **Step 4: Add CSS** for transparent default state, 1.06 hover scale, alternating side positioning, luminous gold gradients/glows and hiding below 1180 px.
- [ ] **Step 5: Run the motion tests and typecheck**.

### Task 3: Three mathematically correct scenes

**Files:**
- Modify: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Test: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

**Interfaces:**
- Consumes: `sampleDerivativeModel` and `AmbientMathsMoment`.
- Produces: `NetworkAmbientMoment`, `DerivativeAmbientMoment`, `VectorAmbientMoment`.

- [ ] **Step 1: Add failing source tests** for frontier ordering/final path, a shared derivative progress variable/clip, and perpendicular/projection geometry.
- [ ] **Step 2: Implement network** with subdued base edges, timed frontier rings and a final luminous route.
- [ ] **Step 3: Implement differentiation** by rendering sampled original and derivative polylines, moving the tangent through the same samples, and clipping the derivative path using the same progress value.
- [ ] **Step 4: Implement vector projection** with separated vectors, perpendicular drop, right-angle marker and illuminated projected length.
- [ ] **Step 5: Run motion tests and typecheck**.

### Task 4: Page placement and regression verification

**Files:**
- Modify: `src/pages/subjects/Mathematics.tsx`
- Test: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

**Interfaces:**
- Consumes: the three exported ambient moments.
- Produces: right/left/right preview-gated mounts after hero, before anchor navigation and before HSC pathways.

- [ ] **Step 1: Add failing integration assertions** for exactly three imports/mounts and the absence of sine/integral motion mounts.
- [ ] **Step 2: Replace the five mounts** without modifying the surrounding basketball, Fourier, curiosity, mistake or HSC content.
- [ ] **Step 3: Run `npm.cmd run test:maths-motion` and `npm.cmd run test:graph-lab`**.
- [ ] **Step 4: Run `npm.cmd run typecheck`, `npm.cmd run lint -- --quiet`, `npm.cmd run build` and `git diff --check`**.
- [ ] **Step 5: Render-check** preview and normal URLs at 1920, 1680, 1440 and 390 px, verifying interaction, hiding and overflow requirements.

### Task 5: Approved visibility and teaching refinement

- [ ] Add regression expectations for the ink-and-champagne palette, outside-click-only dismissal, high-opacity focus veil and mathematical derivation copy.
- [ ] Remove cobalt and the explicit close button; raise the focus veil above site controls.
- [ ] Replace prose-only explanations with concise KaTeX-linked derivation steps for networks, differentiation and projection.
- [ ] Re-run rendered interaction QA at 1280 px and the complete focused verification suite.

### Task 6: Approved syllabus-language correction

**Files:**
- Modify: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Modify: `src/features/maths-ambient-motion/derivative-model.ts`
- Modify: `src/features/maths-ambient-motion/derivative-model.test.ts`
- Modify: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

- [ ] Add failing regression assertions that reject network-relaxation notation, require weighted-edge arithmetic, require the integer-coefficient cubic and gradient function, require visible vector `a` and `b` labels, and require the 2027 transition note.
- [ ] Run `npm.cmd run test:maths-motion` and confirm the new assertions fail for the current content.
- [ ] Refactor the network edge data to carry visible weights and replace the algorithm explanation with shortest-path weight addition.
- [ ] Change the shared derivative model to `f(x)=x^3-3x`, `f'(x)=3x^2-3`, and rescale the scene to keep both curves legible.
- [ ] Add visible `a` and `b` labels and the note `New Extension 1 syllabus - first HSC 2027` to the vector lesson.
- [ ] Run the focused motion suite, Graph Lab suite, typecheck, quiet lint, production build and rendered browser interaction check.

### Task 7: Approved focus scale and ambient invitation refinement

**Files:**
- Modify: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Modify: `src/features/maths-ambient-motion/maths-ambient-motion.css`
- Modify: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

- [ ] Add failing source assertions for a `72rem` responsive focused surface, contained long equations, muted compact saturation, brighter hover treatment and the absence of the HSC transition note.
- [ ] Run `npm.cmd run test:maths-motion` and confirm the assertions fail against the current compact palette and `54rem` surface.
- [ ] Remove the optional transition-note API and vector note, enlarge and rebalance the focused grid, and add responsive equation sizing.
- [ ] Introduce compact-only muted ink and saturation while preserving luminous animated gold and full-contrast expanded content.
- [ ] Run motion and Graph Lab tests, typecheck, quiet lint, production build and rendered QA at the active Mathematics preview URL.
