# Graph Lab Light and Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished light/dark theme system scoped entirely to Graph Lab, with light as the first-visit default and a persistent manual choice.

**Architecture:** A small pure persistence module owns theme state semantics. The route root exposes the selected theme through a data attribute; a scoped CSS token layer styles the workspace, while `GraphCanvas` receives the theme for SVG-specific colours. Existing mathematical and guided state stays untouched.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, scoped CSS custom properties, SVG, Node test runner.

## Global Constraints

- Scope all theming to `/maths-graph-lab`.
- First-time default is light.
- Do not theme shared navigation, footer, Mathematics, Fourier, or other routes.
- Theme switching must preserve all calculator and lesson state.
- Maintain WCAG AA contrast and visible focus states.

---

### Task 1: Theme state and persistence

**Files:**
- Create: `src/features/graph-lab/graph-lab-theme.ts`
- Create: `src/features/graph-lab/graph-lab-theme.test.ts`
- Modify: `src/pages/MathsGraphLab.tsx`

**Interfaces:**
- Produces: `GraphLabTheme`, `GRAPH_LAB_THEME_STORAGE_KEY`, `readGraphLabTheme(storage)`, and `writeGraphLabTheme(storage, theme)`.

- [ ] Write tests proving missing/malformed storage returns `light`, valid `dark` is restored, and writes use the scoped key.
- [ ] Run the test and confirm it fails because the module does not exist.
- [ ] Implement the pure theme module.
- [ ] Add route-owned theme state and a labelled Light/Dark control without coupling it to graph state.
- [ ] Run Graph Lab tests and typecheck.

### Task 2: Semantic visual system

**Files:**
- Create: `src/features/graph-lab/graph-lab-theme.css`
- Modify: `src/pages/MathsGraphLab.tsx`
- Modify: `src/features/graph-lab/GuidedJourneyPanel.tsx`
- Modify: `src/features/graph-lab/ParameterInspector.tsx`
- Modify: `src/features/graph-lab/ExpressionEditor.tsx`

**Interfaces:**
- Consumes: `data-graph-lab-theme="light|dark"` from the route root.
- Produces: scoped semantic colour, surface, border, focus, feedback, and control treatments.

- [ ] Add semantic classes to Graph Lab surfaces and controls.
- [ ] Define a layered light palette and an immersive ink/gold/violet dark palette.
- [ ] Keep shared navigation and footer outside theme selectors.
- [ ] Verify every interactive state in both themes in the browser.

### Task 3: Theme-aware graph rendering

**Files:**
- Modify: `src/features/graph-lab/GraphCanvas.tsx`
- Modify: `src/pages/MathsGraphLab.tsx`

**Interfaces:**
- Consumes: `theme: GraphLabTheme`.
- Produces: theme-aware plot, grid, axes, labels, asymptotes, legend, and restrained dark atmosphere.

- [ ] Pass the theme into `GraphCanvas` without changing expression data.
- [ ] Use CSS variables for SVG structural colours and a deterministic dark plot palette.
- [ ] Keep multiple graphs distinguishable and asymptotes visible.
- [ ] Verify panning, zooming, legends, and LaTeX remain functional in both themes.

### Task 4: Verification

**Files:**
- Verify all files above.

- [ ] Run `npm.cmd run test:graph-lab`.
- [ ] Run focused ESLint on changed Graph Lab files.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run `npm.cmd run build`.
- [ ] Browser-test first visit, persistence, state preservation, Guided Learning, Free Graph, and both visual themes.
