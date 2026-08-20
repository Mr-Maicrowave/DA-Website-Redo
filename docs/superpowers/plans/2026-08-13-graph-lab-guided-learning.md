# Graph Lab Guided Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent Guided Learning mode that teaches function transformations while preserving the existing Free Graph, then connect the sine capstone to a clearly optional Fourier spectacle with a reliable DA-shield trace.

**Architecture:** Pure journey definitions and evaluation/persistence helpers live under `src/features/graph-lab/` and are tested with Node's TypeScript test runner. React panels consume that model while `MathsGraphLab.tsx` retains ownership of equations, viewport and parameter state. Fourier uses a curated continuous shield path and an explicit enrichment link.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, KaTeX, SVG, Node test runner, localStorage.

## Global Constraints

- Guided Learning is the primary product distinction; Free Graph remains usable at any time.
- First visit asks the user to choose a mode; returning visits resume the last mode.
- Switching modes preserves free-graph equations and viewport.
- Journey duration target is 12–15 minutes across seven challenges.
- Wrong predictions receive a hint, one retry and then a worked explanation.
- Progress is stored locally in a versioned, failure-safe format.
- Fourier is labelled optional enrichment beyond the NSW syllabus and does not affect mastery.
- Do not add `eval`, `new Function`, AI marking, accounts or new dependencies.

---

### Task 1: Journey model, evaluation and persistence

**Files:**
- Create: `src/features/graph-lab/guided-transformations.ts`
- Create: `src/features/graph-lab/guided-transformations.test.ts`

**Interfaces:**
- Produces `TRANSFORMATION_JOURNEY`, `evaluatePrediction`, `evaluateExplanation`, `summariseMastery`, `readGuidedState` and `writeGuidedState`.

- [ ] Write failing tests for the seven-step order, one-retry feedback state, structured explanation evaluation, mastery labels and malformed-storage fallback.
- [ ] Run `npm.cmd run test:graph-lab` and confirm the missing module/API failures.
- [ ] Implement the minimal typed journey model and helpers.
- [ ] Re-run `npm.cmd run test:graph-lab` and confirm all tests pass.

### Task 2: Guided journey interface

**Files:**
- Create: `src/features/graph-lab/GuidedJourneyPanel.tsx`
- Create: `src/features/graph-lab/GuidedParameterControls.tsx`
- Modify: `src/pages/MathsGraphLab.tsx`

**Interfaces:**
- Consumes the Task 1 journey model and the existing `ParameterKey`, `GraphExpression` and `Viewport` types.
- Produces mode selection, mode switching, challenge answering, progressive parameter controls and mastery summary.

- [ ] Add first-visit mode selection and versioned last-mode restoration.
- [ ] Preserve a Free Graph workspace snapshot while Guided Learning configures its own graph state.
- [ ] Add the seven-step lesson panel with prediction, hint/retry, structured explanation and worked feedback.
- [ ] Filter the right-hand parameter controls to the current challenge and unlock them only after prediction.
- [ ] Add a mastery summary and restart control.
- [ ] Verify keyboard labels, live feedback and mobile stacking.

### Task 3: Fourier enrichment bridge and DA shield

**Files:**
- Modify: `src/pages/subjects/Mathematics.tsx`
- Modify: `src/features/graph-lab/GuidedJourneyPanel.tsx`

**Interfaces:**
- The capstone links to `/subjects/mathematics#fourier-drawing`.
- Fourier section exposes `id="fourier-drawing"` and defaults to `da-logo`.

- [ ] Replace runtime DA-logo silhouette extraction with a curated continuous shield outline.
- [ ] Default Fourier to the DA shield and retain heart/Fourier alternatives.
- [ ] Add explicit optional-enrichment copy beside the Fourier experience.
- [ ] Add a capstone link explaining the assessable sine concepts and non-assessable Fourier extension.
- [ ] Confirm reduced-motion output remains static and meaningful.

### Task 4: Verification

**Files:**
- Verify all changed Graph Lab and Mathematics files.

- [ ] Run `npm.cmd run test:graph-lab`.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run focused ESLint on all changed React/TypeScript files.
- [ ] Run `npm.cmd run build`.
- [ ] Browser-test first visit, Guided/Free switching, incorrect retry, completion summary, desktop, 390px mobile, Fourier anchor and console health.

