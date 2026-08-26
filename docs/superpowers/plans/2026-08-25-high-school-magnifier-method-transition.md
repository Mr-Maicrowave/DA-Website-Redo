# High School Magnifier-to-Methods Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current post-hero book/subject section with a reversible pinned sequence in which the existing Year 8 magnifier becomes the first control in a five-method icon selector.

**Architecture:** Keep the existing cinematic hero intact and expose only stable measurement hooks on its Year 8 icon. A new `MethodTransition` owns a fixed visual proxy, one GSAP/ScrollTrigger timeline, generated watercolor layers, and an accessible icon-row state model; it measures source, centre, and destination rectangles on refresh so the proxy can perform pixel-aligned handoffs without animating layout properties.

**Tech Stack:** React 18, TypeScript, GSAP, ScrollTrigger, `lucide-react`, CSS, Node test runner, built-in ChatGPT ImageGen.

**Spec:** `docs/superpowers/specs/2026-08-25-high-school-magnifier-method-transition-design.md`

## Global Constraints

- Do not redesign the existing High School cinematic hero, student, typography, year content, watercolor art, bubbles, or layout.
- The moving object must reuse `/high-school-journey/finale/year-08-magnifying-glass-ai.png`.
- Replace `TransitionBridge` and `CurriculumExplorer`; preserve the later `TeachingProcess`, `TeacherSupport`, `ProgressJourney`, and `HSCBridge` sections.
- Use one 300vh pinned, reversible timeline with `scrub: 0.8` and `invalidateOnRefresh: true`.
- Animate only transforms and opacity during scrolling.
- Final state contains five symbol-only buttons with no visible labels, cards, headings, or descriptions.
- Reduced motion uses a short crossfade and skips the large zoom.
- Do not add another smooth-scroll library.
- Preserve unrelated working-tree changes.

---

### Task 1: Generate and Save the Watercolor Animation Assets

**Files:**
- Create: `public/images/programs/high-school-method-transition/method-bloom-center-green-v1.png`
- Create: `public/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png`
- Create: `public/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png`
- Create: `public/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png`
- Create: `public/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png`
- Create: `public/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png`

**Interfaces:**
- Consumes: the reference screenshot and DA watercolor palette in the approved spec.
- Produces: six transparent PNG paths consumed by `methodTransitionData.ts` and `MethodTransition.tsx`.

- [ ] **Step 1: Generate the centre bloom with built-in ImageGen**

Use one built-in ImageGen call with this prompt:

```text
Use case: stylized-concept
Asset type: transparent website animation layer
Primary request: a broad, extremely subtle pale sage-green watercolor pigment bloom for the visual centre of a premium tutoring website scroll animation
Style/medium: realistic watercolor pigment with soft irregular feathered edges and restrained paper granulation
Composition/framing: isolated circular-oval bloom centred on a square transparent canvas, ample transparent margin, no hard edge
Color palette: pale sage green with a few extremely faint antique-gold specks
Constraints: genuinely transparent background; no text; no icon; no object; no border; no frame; no shadow; no watermark
Avoid: neon, glow, portal, dense particles, opaque cream background, sharp geometry
```

- [ ] **Step 2: Generate the five selector blooms with separate built-in ImageGen calls**

Use the same prompt structure and change only the primary color/shape line for each output:

```text
Diagnose: restrained teal and green-blue, irregular round bloom.
Explain: soft leaf-green, irregular round bloom.
Practise: muted lavender and pale violet, irregular round bloom.
Apply: warm peach and restrained orange, irregular round bloom.
Review: muted DA gold and soft yellow-ochre, irregular round bloom.
```

For every call repeat: transparent canvas, subtle pigment, no icon, no text, no border, no watermark.

- [ ] **Step 3: Inspect and persist the selected outputs**

Use `view_image` on each generated output. Reject outputs with opaque backgrounds, embedded symbols, strong edges, or saturated color. Copy selected files from `$CODEX_HOME/generated_images/...` into the exact workspace paths above without overwriting unrelated assets.

- [ ] **Step 4: Verify image properties**

Run:

```bash
file public/images/programs/high-school-method-transition/*.png
```

Expected: six PNG files. Inspect alpha-channel presence with the project’s available image tooling and confirm each asset has transparent pixels.

- [ ] **Step 5: Commit the generated assets**

```bash
git add public/images/programs/high-school-method-transition
git commit -m "assets: add watercolor method transition blooms"
```

---

### Task 2: Add Stable Year 8 Measurement Hooks

**Files:**
- Modify: `src/components/programs/high-school-finale/FinaleScene.tsx`
- Modify: `src/components/programs/high-school-finale/FinaleScene.layout.test.ts`

**Interfaces:**
- Consumes: existing Year 8 `.hs-finale__year-icon` and year button.
- Produces: `[data-method-transition-source="year-8"]` on the Year 8 button and `[data-method-transition-magnifier]` on its icon.

- [ ] **Step 1: Write the failing source-hook test**

Add assertions:

```ts
test('exposes stable Year 8 transition measurement hooks', () => {
  assert.match(source, /data-method-transition-source=\{year\.year===8\?"year-8":undefined\}/);
  assert.match(source, /data-method-transition-magnifier=\{year\.year===8\?true:undefined\}/);
});
```

- [ ] **Step 2: Run the test and verify RED**

```bash
node --test src/components/programs/high-school-finale/FinaleScene.layout.test.ts
```

Expected: FAIL because the stable data attributes are absent.

- [ ] **Step 3: Add the attributes without changing layout**

On the mapped year button add:

```tsx
data-method-transition-source={year.year === 8 ? "year-8" : undefined}
```

On the mapped year icon add:

```tsx
data-method-transition-magnifier={year.year === 8 ? true : undefined}
```

Do not change classes, source paths, styling, or interaction behavior.

- [ ] **Step 4: Run the test and verify GREEN**

```bash
node --test src/components/programs/high-school-finale/FinaleScene.layout.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the stable hooks**

```bash
git add src/components/programs/high-school-finale/FinaleScene.tsx src/components/programs/high-school-finale/FinaleScene.layout.test.ts
git commit -m "feat: expose Year 8 magnifier transition hooks"
```

---

### Task 3: Define the Method Selector Model and Keyboard Contract

**Files:**
- Create: `src/components/programs/high-school-method-transition/methodTransitionData.ts`
- Create: `src/components/programs/high-school-method-transition/methodTransitionKeyboard.ts`
- Create: `src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts`

**Interfaces:**
- Consumes: generated asset paths from Task 1 and `lucide-react` icons.
- Produces: `MethodId`, `MethodItem`, `methodItems`, and `getNextMethodIndex(key, index, count): number | null`.

- [ ] **Step 1: Write the failing keyboard tests**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getNextMethodIndex } from './methodTransitionKeyboard';

test('wraps horizontal method navigation and supports Home and End', () => {
  assert.equal(getNextMethodIndex('ArrowRight', 4, 5), 0);
  assert.equal(getNextMethodIndex('ArrowLeft', 0, 5), 4);
  assert.equal(getNextMethodIndex('Home', 3, 5), 0);
  assert.equal(getNextMethodIndex('End', 1, 5), 4);
  assert.equal(getNextMethodIndex('Enter', 1, 5), null);
});
```

- [ ] **Step 2: Run the test and verify RED**

```bash
node --test src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the keyboard helper**

```ts
export function getNextMethodIndex(key: string, index: number, count: number) {
  if (key === 'ArrowRight') return (index + 1) % count;
  if (key === 'ArrowLeft') return (index - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}
```

- [ ] **Step 4: Define the selector data**

```ts
import { ClipboardCheck, MessageCircle, Pencil, Search, Send } from 'lucide-react';

export type MethodId = 'diagnose' | 'explain' | 'practise' | 'apply' | 'review';
export type MethodItem = { id: MethodId; label: string; accent: string; bloom: string; Icon: typeof Search };

export const methodItems: MethodItem[] = [
  { id: 'diagnose', label: 'Diagnose', accent: '#1f766d', bloom: '/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png', Icon: Search },
  { id: 'explain', label: 'Explain', accent: '#4e843d', bloom: '/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png', Icon: MessageCircle },
  { id: 'practise', label: 'Practise', accent: '#7652a8', bloom: '/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png', Icon: Pencil },
  { id: 'apply', label: 'Apply', accent: '#cf6f35', bloom: '/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png', Icon: Send },
  { id: 'review', label: 'Review', accent: '#ad7414', bloom: '/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png', Icon: ClipboardCheck },
];
```

- [ ] **Step 5: Run the test and verify GREEN**

```bash
node --test src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the selector model**

```bash
git add src/components/programs/high-school-method-transition/methodTransitionData.ts src/components/programs/high-school-method-transition/methodTransitionKeyboard.ts src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts
git commit -m "feat: define high school method selector model"
```

---

### Task 4: Build the Reversible Magnifier Transition

**Files:**
- Create: `src/components/programs/high-school-method-transition/MethodTransition.tsx`
- Create: `src/components/programs/high-school-method-transition/MethodTransition.css`
- Create: `src/components/programs/high-school-method-transition/MethodTransition.test.mjs`

**Interfaces:**
- Consumes: `methodItems`, `getNextMethodIndex`, the Year 8 data hooks, centre bloom path, and existing magnifier path.
- Produces: `<MethodTransition />`, a symbol-only accessible selector, and one scoped GSAP master timeline.

- [ ] **Step 1: Write the failing structural test**

Read the component source and assert:

```js
test('uses one reversible pinned master timeline', () => {
  assert.equal((source.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(source, /scrub:\s*0\.8/);
  assert.match(source, /invalidateOnRefresh:\s*true/);
  assert.match(source, /--method-transition-scroll/);
});

test('renders five accessible symbol buttons and a reduced-motion branch', () => {
  assert.match(source, /methodItems\.map/);
  assert.match(source, /aria-label=\{method\.label\}/);
  assert.match(source, /role="toolbar"/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /<h[1-6]/);
});

test('measures source and destination for a proxy handoff', () => {
  assert.match(source, /data-method-transition-magnifier/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /proxyRef/);
  assert.match(source, /diagnoseRef/);
});
```

- [ ] **Step 2: Run the test and verify RED**

```bash
node --test src/components/programs/high-school-method-transition/MethodTransition.test.mjs
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement semantic markup and roving focus**

Create a section/sticky stage containing:

```tsx
<section className="hsm-transition" ref={sectionRef}>
  <div className="hsm-transition__stage" ref={stageRef}>
    <img className="hsm-transition__center-bloom" ref={centerBloomRef} src="/images/programs/high-school-method-transition/method-bloom-center-green-v1.png" alt="" />
    <img className="hsm-transition__proxy" ref={proxyRef} src="/high-school-journey/finale/year-08-magnifying-glass-ai.png" alt="" />
    <div className="hsm-transition__methods" role="toolbar" aria-label="DA Tuition teaching methods">
      {methodItems.map((method, index) => (
        <button key={method.id} aria-label={method.label} aria-pressed={active === index} tabIndex={active === index ? 0 : -1} />
      ))}
    </div>
  </div>
</section>
```

Each button renders its bloom image and icon, stores a ref, updates `active` on click, and calls `getNextMethodIndex` on keydown.

- [ ] **Step 4: Implement measurement and the master timeline**

Inside one `useLayoutEffect`, use `gsap.matchMedia()` for desktop/tablet/mobile/reduce. Query the Year 8 source icon, decode required images, then compute transform deltas from source rectangle to centre rectangle and final Diagnose icon rectangle. Build exactly one `gsap.timeline` with the approved phase positions, `scrollTrigger.trigger = section`, `start: 'top top'`, `end: 'bottom bottom'`, `scrub: 0.8`, and `invalidateOnRefresh: true`.

Use timeline callbacks/sets only at aligned handoff positions to toggle original, proxy, and final Diagnose visibility. Animate the remaining four buttons with the approved stagger near progress `.84`. Scope all DOM work in `gsap.context()` and restore the source icon’s inline visibility during cleanup.

- [ ] **Step 5: Implement reduced motion**

When `reduce` matches, do not create the zoom path. Set the proxy hidden, keep the source intact until the transition enters, and crossfade the completed method row. Ensure all buttons are visible and interactive at the final state.

- [ ] **Step 6: Add responsive and performance CSS**

Set outer height from `--method-transition-scroll: 300vh`, sticky stage `height: 100vh`, proxy `position: fixed`, and method row width `min(90vw, 1050px)`. Use generated blooms as actual `<img>` layers. Keep icons 45–60px on desktop, smaller on mobile, preserve a one-row horizontally scrollable selector below 640px, and add focus-visible styling plus reduced-motion CSS.

- [ ] **Step 7: Run tests and verify GREEN**

```bash
node --test src/components/programs/high-school-method-transition/MethodTransition.test.mjs src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the transition component**

```bash
git add src/components/programs/high-school-method-transition
git commit -m "feat: build reversible magnifier method transition"
```

---

### Task 5: Replace the Current Book/Subject Section

**Files:**
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`
- Modify: `src/components/programs/high-school-professional/professionalJourneyData.ts`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`

**Interfaces:**
- Consumes: `<MethodTransition />` from Task 4.
- Produces: post-hero order `MethodTransition → TeachingProcess → TeacherSupport → ProgressJourney → HSCBridge`.

- [ ] **Step 1: Update the integration test first**

Replace curriculum assertions with:

```js
test('replaces the book curriculum section with the magnifier method transition', () => {
  assert.match(feature, /<MethodTransition\s*\/>/);
  assert.doesNotMatch(feature, /<TransitionBridge\s*\/>/);
  assert.doesNotMatch(feature, /<CurriculumExplorer\s*\/>/);
  assert.doesNotMatch(feature, /curriculum-heading-open-book-v1/);
  assert.match(feature, /<MethodTransition\s*\/>\s*<TeachingProcess/);
});
```

Remove tests that require `subjects`, subject tabs, or the book artwork.

- [ ] **Step 2: Run the integration test and verify RED**

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
```

Expected: FAIL because the old sections are still mounted.

- [ ] **Step 3: Replace the old sections**

Import `MethodTransition`, remove `TransitionBridge` and `CurriculumExplorer`, and render:

```tsx
return <div className="hs-professional">
  <MethodTransition />
  <TeachingProcess />
  <TeacherSupport />
  <ProgressJourney />
  <HSCBridge />
</div>;
```

Remove now-unused `KeyboardEvent`, `useState`, subject imports, and curriculum-specific CSS/data. Preserve later-section data and styles.

- [ ] **Step 4: Run integration and component tests**

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs src/components/programs/high-school-method-transition/MethodTransition.test.mjs src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the replacement**

```bash
git add src/components/programs/high-school-professional src/components/programs/high-school-method-transition
git commit -m "feat: replace curriculum section with method transition"
```

---

### Task 6: Verify Motion, Responsiveness, and Build Integrity

**Files:**
- Modify if required by verified defects only: `src/components/programs/high-school-method-transition/MethodTransition.tsx`
- Modify if required by verified defects only: `src/components/programs/high-school-method-transition/MethodTransition.css`
- Test: all files changed in Tasks 2–5.

**Interfaces:**
- Consumes: completed transition and replacement integration.
- Produces: verified production-ready behavior at desktop, mobile, reverse scroll, keyboard, and reduced-motion settings.

- [ ] **Step 1: Run automated verification**

```bash
node --test src/components/programs/high-school-finale/FinaleScene.layout.test.ts src/components/programs/high-school-method-transition/MethodTransition.test.mjs src/components/programs/high-school-method-transition/methodTransitionKeyboard.test.ts src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
npm run typecheck
npm run build
git diff --check
```

Expected: all tests pass, TypeScript exits 0, production build exits 0, and no whitespace errors.

- [ ] **Step 2: Verify desktop motion in the local browser**

At `/programs/high-school`, verify:

- One visible magnifier throughout both handoffs.
- Proxy starts exactly over the Year 8 icon.
- Hero recession is subtle and does not flash white.
- Centre magnifier remains sharp and within 180–240px.
- Final Diagnose alignment has no jump.
- Other buttons appear in Explain → Practise → Apply → Review order.
- Reverse scrolling reproduces the complete sequence backwards.
- No visible heading, label, card, book, or subject panel remains in the replacement section.
- No console errors or horizontal page overflow.

- [ ] **Step 3: Verify responsive and accessibility behavior**

At representative 390×844 and tablet widths verify the compact one-row selector, smaller magnifier maximum, no clipping, visible focus, arrow/Home/End focus movement, and all five `aria-label` values. Emulate reduced motion and confirm the crossfade replaces the zoom.

- [ ] **Step 4: Fix only defects discovered by verification**

For each defect, add or tighten the relevant test first, observe RED, apply the smallest production change, and rerun the focused verification before continuing.

- [ ] **Step 5: Commit verified fixes**

```bash
git add src/components/programs/high-school-finale src/components/programs/high-school-method-transition src/components/programs/high-school-professional
git commit -m "fix: polish magnifier transition handoffs"
```
