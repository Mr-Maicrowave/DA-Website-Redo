# High School “How We Teach” Card Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved five-card High School interaction with generated supporting imagery, GSAP Flip card reorganization, exact editorial copy, and responsive accessible behavior.

**Architecture:** Keep `MethodTransition` responsible for the pinned magnifying-glass handoff, then reveal a focused `MethodTeachingDeck` after the cards settle. Store method copy and asset metadata in one typed module, keep selection/navigation logic pure, and render all explanations through one shared detail component.

**Tech Stack:** React 18, TypeScript, GSAP 3.15 (`Flip`, `ScrollTrigger`), CSS, Node test runner, Vite, built-in ChatGPT image generation.

**Spec:** `docs/superpowers/specs/2026-08-26-high-school-how-we-teach-deck-design.md`

## Global Constraints

- Preserve the continuous High School scroll experience and upstream magnifying-glass handoff.
- Keep all five current premium card artworks; do not regenerate or replace them.
- Do not create a boxed section, modal, accordion, dashboard, or following-section transition.
- Keep all supplied method copy verbatim.
- Desktop expanded layout is 42% deck and 58% content.
- Hero card is 300–360px tall; inactive tabs are 56–72px tall.
- Flip duration is 0.55–0.75s with `power3.inOut`; never bounce, rotate, flip over, or giant-zoom cards.
- Mobile stacks hero, horizontal selector, and content with 44px minimum touch targets.
- Meet WCAG 2.1 AA contrast and provide reduced-motion behavior.
- Preserve unrelated dirty-worktree changes and stage only task-owned files.

## File Map

- Modify `methodTransitionData.ts`: typed copy, colors, artwork, and generated asset paths.
- Create `methodTeachingDeckState.ts` and test: pure selection/navigation behavior.
- Create `MethodTeachingDeck.tsx`: overview, expanded deck, Flip, keyboard behavior.
- Create `MethodDetail.tsx`: shared editorial renderer.
- Create `MethodTeachingDeck.css`: scoped responsive styling.
- Create `MethodTeachingDeck.test.mjs`: structural, copy, motion, and CSS contracts.
- Modify `MethodTransition.tsx`, CSS, and test: continuous handoff into the interaction.
- Create two images under `public/images/programs/high-school-method-transition/`.

---

### Task 1: Generate the supporting imagery

**Files:**
- Create: `public/images/programs/high-school-method-transition/how-we-teach-tutor-student-v1.png`
- Create: `public/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1.png`

**Interfaces:**
- Consumes: approved reference and design spec.
- Produces: two stable public asset URLs for the deck.

- [ ] **Step 1: Generate the tutor-and-student photograph**

Use the built-in image generator with:

```text
Use case: photorealistic-natural
Asset type: wide supporting image for a premium tutoring website
Primary request: a caring adult female tutor seated beside an Asian high-school student, both discussing the same workbook; show patient attention and collaborative learning
Scene/backdrop: genuine Australian tutoring-centre study space with restrained shelves and plants
Style/medium: candid natural editorial photography, realistic skin and hands, not staged corporate stock
Composition/framing: landscape, subjects grouped lower-left and centre, responsive crop room
Lighting/mood: warm window daylight, calm and reassuring
Color palette: warm neutrals, navy school clothing, subtle forest green
Constraints: age-appropriate student; shared attention on work; no logos, text, or watermark
Avoid: exaggerated smiles, lecture pose, handshake, artificial bokeh, oversaturated orange
```

- [ ] **Step 2: Inspect and persist the photograph**

Use `view_image`. Reject malformed hands, disconnected gazes, or corporate-stock posing. Copy the accepted built-in output into the exact project path above.

- [ ] **Step 3: Generate the transparent atmosphere**

```text
Use case: stylized-concept
Asset type: transparent decorative overlay for a premium education website
Primary request: restrained watercolor edge atmosphere with forest-green and muted-blue washes, delicate botanical leaves, antique-gold ink speckles and thin flowing accents
Style/medium: refined hand-painted watercolor and botanical ink, premium stationery quality
Composition/framing: transparent landscape canvas; detail at lower-left and outer edges; centre and upper-middle mostly empty
Constraints: genuinely transparent background; no text, cards, icons, borders, central subject, or watermark
Avoid: dense wreath, clip-art leaves, rectangular edge, neon color, glitter
```

- [ ] **Step 4: Inspect alpha and persist the atmosphere**

Use `view_image`, then run `file` on the saved PNG. Confirm an open centre and transparent background.

- [ ] **Step 5: Commit only these assets**

```bash
git add public/images/programs/high-school-method-transition/how-we-teach-tutor-student-v1.png public/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1.png
git commit -m "feat: add how we teach supporting artwork"
```

---

### Task 2: Define method content and pure deck behavior

**Files:**
- Modify: `src/components/programs/high-school-method-transition/methodTransitionData.ts`
- Create: `src/components/programs/high-school-method-transition/methodTeachingDeckState.ts`
- Create: `src/components/programs/high-school-method-transition/methodTeachingDeckState.test.ts`

**Interfaces:**
- Produces: `MethodAction`, expanded `MethodItem`, `getInactiveMethods(activeId)`, and `getAdjacentMethodId(activeId, direction)`.

- [ ] **Step 1: Write failing state tests**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getAdjacentMethodId, getInactiveMethods } from './methodTeachingDeckState.ts';

test('inactive methods preserve canonical order', () => {
  assert.deepEqual(getInactiveMethods('practise'), ['diagnose', 'explain', 'apply', 'review']);
});
test('navigation wraps', () => {
  assert.equal(getAdjacentMethodId('review', 1), 'diagnose');
  assert.equal(getAdjacentMethodId('diagnose', -1), 'review');
});
```

- [ ] **Step 2: Verify the test fails**

Run `node --test --experimental-strip-types src/components/programs/high-school-method-transition/methodTeachingDeckState.test.ts` and expect a missing-module failure.

- [ ] **Step 3: Implement pure helpers**

```ts
import { methodItems, type MethodId } from './methodTransitionData.ts';
export const getInactiveMethods = (activeId: MethodId) =>
  methodItems.map(({ id }) => id).filter((id) => id !== activeId);
export function getAdjacentMethodId(activeId: MethodId, direction: -1 | 1): MethodId {
  const ids = methodItems.map(({ id }) => id);
  return ids[(ids.indexOf(activeId) + direction + ids.length) % ids.length];
}
```

- [ ] **Step 4: Expand the data model**

```ts
export type MethodAction = { title: string; body: string; annotation: string };
export type MethodItem = {
  id: MethodId;
  number: '01' | '02' | '03' | '04' | '05';
  label: string;
  emotionalSubheading: string;
  introduction: readonly [string, string];
  actions: readonly [MethodAction, MethodAction, MethodAction, MethodAction];
  closingLines: readonly string[];
  accent: string;
  atmosphere: string;
  bloom: string;
  card: string;
  Icon: typeof Search;
};
```

Populate every field with the exact approved copy. Give Diagnose the explicit forest-card path rather than a CSS-only exception.

- [ ] **Step 5: Verify and commit**

Run the state test and `npx tsc --noEmit -p tsconfig.app.json`; expect PASS. Commit only these three files with `feat: define how we teach method content`.

---

### Task 3: Build semantic overview and editorial detail components

**Files:**
- Create: `src/components/programs/high-school-method-transition/MethodDetail.tsx`
- Create: `src/components/programs/high-school-method-transition/MethodTeachingDeck.tsx`
- Create: `src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs`

**Interfaces:**
- Consumes: `MethodItem`, `MethodId`, `methodItems`, and state helpers.
- Produces: `<MethodTeachingDeck ready={boolean} />` and `<MethodDetail method={MethodItem} />`.

- [ ] **Step 1: Write failing source-contract tests**

Read the two TSX files and CSS with `readFileSync`; assert the sources contain `Every student needs`, the handwritten process line, `aria-pressed`, `onKeyDown`, `WHAT WE DO`, `aria-live="polite"`, and the 42/58 grid rule.

- [ ] **Step 2: Verify failure**

Run `node --test src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs`; expect missing files.

- [ ] **Step 3: Implement the shared detail renderer**

```tsx
export function MethodDetail({ method }: { method: MethodItem }) {
  return <article className="hsm-deck__detail" aria-live="polite" aria-atomic="true">
    <div className="hsm-deck__method-index"><span>{method.number}</span><i /></div>
    <h3 data-method-copy>{method.label}</h3>
    <p className="hsm-deck__emotional" data-method-copy>{method.emotionalSubheading}</p>
    <div data-method-copy>{method.introduction.map((p) => <p key={p}>{p}</p>)}</div>
    <h4>WHAT WE DO</h4>
    <ol>{method.actions.map((action, index) => <li key={action.title} data-method-action>
      <span>{index + 1}</span><div><strong>{action.title}</strong><p>{action.body}</p></div>
      <em data-method-annotation>{action.annotation}</em>
    </li>)}</ol>
    <div className="hsm-deck__closing">{method.closingLines.map((line) => <p key={line}>{line}</p>)}</div>
  </article>;
}
```

- [ ] **Step 4: Implement the stable card collection**

Own `activeId: MethodId = 'diagnose'` and `expanded = false`. Render the heading, all five semantic card buttons, detail only when expanded, process annotation, tutor photograph, and decorative atmosphere. Keep all five buttons mounted; switch CSS classes/grid areas rather than duplicating cards.

- [ ] **Step 5: Add keyboard behavior**

Enter/Space selects and expands. Left/Right navigates all arrangements; desktop stack also accepts Up/Down. Preserve visible focus on the newly selected card.

- [ ] **Step 6: Verify and commit**

Run the feature test and typecheck; expect PASS. Commit these files with `feat: build how we teach card deck`.

---

### Task 4: Add Flip choreography and rapid-click safety

**Files:**
- Modify: `MethodTeachingDeck.tsx`
- Modify: `MethodTeachingDeck.test.mjs`

**Interfaces:**
- Produces: deterministic `selectMethod(nextId: MethodId)` behavior.

- [ ] **Step 1: Add failing contracts**

Assert `gsap/Flip`, `Flip.getState`, `Flip.from`, `power3.inOut`, `gsap.killTweensOf`, and the reduced-motion query are present; assert no `rotation:` choreography exists.

- [ ] **Step 2: Implement Flip**

Register `Flip`, capture all card elements, kill existing tweens, synchronously set active/expanded state with `flushSync`, then run:

```ts
Flip.from(state, { duration: 0.68, ease: 'power3.inOut', absolute: true, nested: true, prune: true });
```

Use an incrementing selection token ref so a stale content timeline cannot finish after a newer click.

- [ ] **Step 3: Animate content**

Reveal copy with `autoAlpha`, `y: 14`, 0.45s; actions with 0.1s stagger; annotations with `x: 8`, 0.15s delay after actions. Skip Flip and set final visibility immediately for reduced motion.

- [ ] **Step 4: Verify and commit**

Run feature tests and typecheck; expect PASS. Commit with `feat: animate how we teach deck transitions`.

---

### Task 5: Implement the responsive visual system

**Files:**
- Create: `MethodTeachingDeck.css`
- Modify: `MethodTeachingDeck.tsx`
- Modify: `MethodTeachingDeck.test.mjs`

**Interfaces:**
- Consumes: deck DOM and method-level CSS custom properties.
- Produces: overview, 42/58 expanded layout, premium deck, mobile selector, and subtle atmosphere.

- [ ] **Step 1: Add failing CSS contracts**

Assert `--hsm-active-wash`, 300–360px hero sizing, 56–72px tab sizing, a `max-width: 767px` layout, `overflow-x: auto`, 44px minimum controls, and reduced-motion rules.

- [ ] **Step 2: Style the overview**

Use an unboxed ivory canvas, centered care-led heading, existing serif/sans brand fonts, forest italic accent, restrained gold details, and a five-column card row without descriptions.

- [ ] **Step 3: Style expanded desktop**

```css
.hsm-deck[data-expanded='true'] .hsm-deck__composition {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  gap: clamp(40px, 6vw, 96px);
}
```

Use `height: clamp(300px, 34vw, 360px)` for the hero and `height: clamp(56px, 5vw, 72px)` for tabs. Use one defined small shadow, not border-plus-wide-shadow decoration.

- [ ] **Step 4: Style editorial content and atmosphere**

Keep body lines within 65–75 characters. Use the active wash at extremely low opacity, the transparent generated asset at edges, annotations in the wide-screen margin, and the photograph blended into the lower-left without a box.

- [ ] **Step 5: Style tablet/mobile and reduced motion**

At 767px, use one column and a horizontal overflow selector; place content below it and annotations inline. Remove transitions for reduced motion. Hide no essential copy.

- [ ] **Step 6: Verify and commit**

Run feature tests and `npm run build`; expect PASS except the existing Vite chunk-size warning. Commit with `style: polish how we teach editorial deck`.

---

### Task 6: Integrate with the pinned handoff

**Files:**
- Modify: `MethodTransition.tsx`
- Modify: `MethodTransition.css`
- Modify: `MethodTransition.test.mjs`

**Interfaces:**
- Consumes: `<MethodTeachingDeck ready={boolean} />` and existing timing constants.
- Produces: continuous handoff into a normal-flow interactive section.

- [ ] **Step 1: Replace obsolete decorative-only assertions**

Remove tests forbidding buttons, headings, and `methodItems.map`. Add contracts for `<MethodTeachingDeck`, `setDeckReady`, `companionsEnd`, and `.hsm-transition__interaction`. Retain geometry, early zoom, card rise, join, larger magnifier, and reduced-motion tests.

- [ ] **Step 2: Verify failure**

Run `node --test src/components/programs/high-school-method-transition/MethodTransition.test.mjs`; expect missing integration.

- [ ] **Step 3: Mount the deck after the sticky stage**

Add `deckReady` state. Set it when timeline progress reaches `METHOD_TRANSITION_TIMING.companionsEnd`, clear it when reversing below that threshold, and render:

```tsx
<div className="hsm-transition__interaction"><MethodTeachingDeck ready={deckReady} /></div>
```

after the sticky stage.

- [ ] **Step 4: Preserve runway and resume normal flow**

Keep the existing 230vh transition. Add the interaction’s intrinsic height after the stage without another pin or dead scroll distance.

- [ ] **Step 5: Verify and commit**

Run all focused method-transition tests and typecheck. Commit the three integration files with `feat: connect teaching deck to scroll handoff`.

---

### Task 7: Browser QA and final verification

**Files:**
- Modify only if QA requires: feature TSX, CSS, data, or focused tests.

**Interfaces:**
- Produces: verified desktop, tablet, mobile, keyboard, reduced-motion, and rapid-click behavior.

- [ ] **Step 1: Test scroll continuity**

Start Vite and inspect `/programs/high-school` at 1440×1000 and 1920×1080. Confirm the glass lands in Diagnose, all cards settle without a jump, and the heading follows immediately.

- [ ] **Step 2: Test all selections**

Activate every method, then alternate rapidly 8–10 times. Confirm the last choice wins, cards stay aligned, copy matches, and no opacity/transform state is stranded.

- [ ] **Step 3: Test keyboard and responsive behavior**

Verify Enter, Space, arrows, focus visibility, and live-region behavior. Test 1024×768, 768×1024, 390×844, and 360×800 for overflow, 44px targets, horizontal selector, and annotation collisions.

- [ ] **Step 4: Test reduced motion**

Emulate reduced motion and confirm an immediate/crossfade layout switch with all content available.

- [ ] **Step 5: Run final automated verification**

```bash
node --test --experimental-strip-types src/components/programs/high-school-method-transition/*.test.ts src/components/programs/high-school-method-transition/*.test.mjs
npm run build
git diff --check
```

Expected: focused tests and production build pass; no whitespace errors.

- [ ] **Step 6: Commit only QA fixes**

Stage only feature-owned files and commit with `fix: polish how we teach interaction`. If QA changes nothing, skip the commit.
