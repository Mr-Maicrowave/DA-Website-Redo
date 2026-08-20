# Graph Lab Teaching Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the graph, selected equation and sliders visible together while improving viewport precision, asymptote visibility and circle presentation.

**Architecture:** Preserve the safe typed parser and two-branch circle sampling. Add presentation metadata to group internal branches as one logical expression, centralise viewport display rounding, and rearrange existing React components with responsive CSS only.

**Tech Stack:** React, TypeScript, Tailwind CSS, SVG, KaTeX, Node test runner, Vite.

## Global Constraints

- Preserve unrelated dirty-worktree changes.
- Do not introduce `eval`, `new Function`, or a new graphing dependency.
- Desktop three-column layout begins at 1180px; smaller widths remain stacked.
- Viewport controls display at most two decimal places.

---

### Task 1: Viewport precision

**Files:**
- Modify: `src/features/graph-lab/viewport.ts`
- Modify: `src/features/graph-lab/GraphCanvas.tsx`
- Modify: `src/pages/MathsGraphLab.tsx`
- Test: `src/features/graph-lab/graph-lab.test.ts`

- [ ] Add a failing test asserting `formatViewportBound(-6.7478266) === '-6.75'`, whole numbers omit decimals, and panned bounds round to two places.
- [ ] Run `npm.cmd run test:graph-lab` and confirm the new test fails because the formatter does not exist.
- [ ] Implement the shared formatter and use two-decimal panning values.
- [ ] Run the targeted tests and confirm they pass.

### Task 2: Logical circle presentation and stronger asymptotes

**Files:**
- Modify: `src/features/graph-lab/types.ts`
- Modify: `src/features/graph-lab/equation-presets.ts`
- Modify: `src/features/graph-lab/GraphCanvas.tsx`
- Modify: `src/pages/MathsGraphLab.tsx`
- Test: `src/features/graph-lab/graph-lab.test.ts`

- [ ] Add failing tests for one visible circle expression backed by two sampled branches.
- [ ] Confirm the tests fail under the existing two-row presentation.
- [ ] Add branch-group presentation metadata, filter internal branches from editor/legend output, and make hide/remove operate on the group.
- [ ] Add asymptote underlay, stronger foreground stroke, and direct SVG labels.
- [ ] Run targeted tests and confirm they pass.

### Task 3: Responsive teaching-studio layout

**Files:**
- Modify: `src/pages/MathsGraphLab.tsx`
- Modify: `src/features/graph-lab/ParameterInspector.tsx`

- [ ] Move the parameter inspector into a dedicated right-side panel.
- [ ] Define the 1180px three-column layout and retain the stacked smaller layout.
- [ ] Keep viewport controls below the centre graph and use compact slider density in the right panel.
- [ ] Run TypeScript and focused ESLint checks.

### Task 4: Full verification

**Files:**
- Verify only; no committed test artifacts.

- [ ] Run `npm.cmd run test:graph-lab`, TypeScript, focused ESLint, and `npm.cmd run build`.
- [ ] Test `/maths-graph-lab` in the in-app browser at desktop and 390x844.
- [ ] Verify drag rounding, circle grouping, asymptote visibility, column placement, no overflow, and no relevant console errors.
