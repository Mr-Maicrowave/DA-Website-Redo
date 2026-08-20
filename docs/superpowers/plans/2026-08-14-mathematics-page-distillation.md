# Mathematics Page Distillation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the council-approved Mathematics landing-page hierarchy on `/subjects/mathematics` with one Fourier interaction, a Graph Lab destination, static teaching proof and passive ambient mathematics.

**Architecture:** Keep the current legacy implementations in `Mathematics.tsx` for a reversible visual-review pass, but remove their JSX mounts from the live composition. Add a focused `MathsTeachingProof` component and extend the shared ambient shell with a passive mode that renders decorative SVG without modal interaction.

**Tech Stack:** React 18, TypeScript, Framer Motion, SVG, KaTeX, Tailwind CSS, CSS, Node test runner.

## Global Constraints

- The target is `/subjects/mathematics` without a preview query.
- Render exactly one substantial on-page interaction: `FourierDrawing`.
- Graph Lab remains a CTA to `/maths-graph-lab`, not an embedded calculator.
- Legacy interactive code stays in source until visual approval.
- Passive ambient moments are non-focusable, non-clickable and hidden on smaller screens.
- Do not modify unrelated dirty files.

---

### Task 1: Lock the live composition contract

**Files:**
- Modify: `src/features/maths-ambient-motion/ambient-motion-source.test.ts`

**Interfaces:**
- Consumes: `Mathematics.tsx` source and the ambient component source.
- Produces: regression coverage for normal-route mounts, one Fourier render, the teaching-proof mount and passive ambient behavior.

- [ ] **Step 1: Write failing tests** that require no `motionPreview` gate, require three `passive` ambient mounts, require one `FourierDrawing` mount, reject rendered basketball and Fourier-decomposition mounts, and require `MathsTeachingProof`.

```ts
assert.doesNotMatch(mathsSource, /isMathsAmbientPreview/);
assert.equal((mathsSource.match(/<FourierDrawing\s*\/>/g) ?? []).length, 1);
assert.doesNotMatch(liveComposition, /<BasketballCalculusJourney\s*\/>|<FourierDecomposition\s*\/>/);
assert.match(mathsSource, /<MathsTeachingProof\s*\/>/);
assert.equal((mathsSource.match(/AmbientMoment passive/g) ?? []).length, 3);
```
- [ ] **Step 2: Run `npm.cmd run test:maths-motion`** and confirm failures identify the old preview-gated composition.

### Task 2: Add passive ambient behavior

**Files:**
- Modify: `src/features/maths-ambient-motion/MathsAmbientMotion.tsx`
- Modify: `src/features/maths-ambient-motion/maths-ambient-motion.css`

**Interfaces:**
- Adds: `passive?: boolean` to the three exported ambient moment components.
- Produces: decorative `aria-hidden` scenes that do not open focused lessons or intercept pointer input.

- [ ] **Step 1: Implement the smallest passive branch** in `AmbientMathsMoment` while preserving the existing preview interaction behavior for source review.

```tsx
if (passive) {
  return (
    <div className={`maths-ambient-anchor maths-ambient-anchor--${side}`} aria-hidden="true">
      <div className="maths-ambient-moment is-passive">
        <span className="maths-ambient-moment__scene">{children(active, false)}</span>
      </div>
    </div>
  );
}
```
- [ ] **Step 2: Add passive CSS** that disables pointer events and focus affordances while retaining subdued animation and reduced-motion behavior.
- [ ] **Step 3: Run `npm.cmd run test:maths-motion`** and keep the composition test red until the page mounts are changed.

### Task 3: Build static teaching proof and distil page composition

**Files:**
- Create: `src/features/maths-teaching-proof/MathsTeachingProof.tsx`
- Modify: `src/pages/subjects/Mathematics.tsx`

**Interfaces:**
- Produces: `<MathsTeachingProof />` with anchor `math-teaching-proof` and `<MathsGraphLabInvitation />` linking to `/maths-graph-lab`.
- Consumes: `NetworkAmbientMoment`, `DerivativeAmbientMoment`, `VectorAmbientMoment` with `passive`.

- [ ] **Step 1: Build the static proof** with Predict → Explore → Explain → Apply and one annotated equation-solving misconception.

```tsx
export const MathsTeachingProof = () => (
  <section id="math-teaching-proof" aria-labelledby="math-teaching-proof-heading">
    <h2 id="math-teaching-proof-heading">We teach the decision behind every step.</h2>
    <ol aria-label="DA Tuition teaching sequence">
      {['Predict', 'Explore', 'Explain', 'Apply'].map((step) => <li key={step}>{step}</li>)}
    </ol>
  </section>
);
```

- [ ] **Step 1a: Build the Graph Lab invitation** as a static graph preview plus one route link, not an embedded calculator.

```tsx
export const MathsGraphLabInvitation = () => (
  <section aria-labelledby="maths-graph-lab-invitation-heading">
    <h2 id="maths-graph-lab-invitation-heading">Move the graph. Explain what changed.</h2>
    <Link to="/maths-graph-lab">Open the Graph Lab</Link>
  </section>
);
```
- [ ] **Step 2: Remove the `motionPreview` query dependency** and render passive ambient scenes on the normal route.
- [ ] **Step 3: Stop rendering** basketball, `FourierDecomposition`, interactive teaching and interactive mistake sections while retaining their source definitions.
- [ ] **Step 4: Mount `MathsTeachingProof`** where the teaching/mistake sections previously appeared and update anchor navigation.

```tsx
<MathsTeachingProof />
```
- [ ] **Step 5: Run `npm.cmd run test:maths-motion`** and confirm the live composition contract passes.

### Task 4: Regression and rendered verification

**Files:**
- Modify only files required by failing checks.

**Interfaces:**
- Produces: verified desktop/mobile live route with no preview dependency or runtime errors.

- [ ] **Step 1: Run** `npm.cmd run test:maths-motion`, `npm.cmd run test:graph-lab`, `npm.cmd run typecheck` and `npm.cmd run lint -- --quiet`.
- [ ] **Step 2: Render-check** `/subjects/mathematics` at desktop and mobile widths, including Fourier interaction, Graph Lab navigation visibility, static proof readability, passive ambient behavior and horizontal overflow.
- [ ] **Step 3: Run** `npm.cmd run build` and `git diff --check`.
- [ ] **Step 4: Report** the rendered result and keep legacy source code until user approval.
