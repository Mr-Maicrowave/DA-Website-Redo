# HSC Excellence Vision Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/hsc-excellence-vision` prototype that reorganises DA's verified HSC content into an accessible, cinematic thirteen-section parent journey without changing either production HSC route.

**Architecture:** Add one route-level composition under `src/features/hsc-vision-prototype/`, split into focused narrative scene components backed by a single audited content module. Framer Motion supplies progressive enhancement for scroll-linked scenes; semantic document flow and CSS media queries remain the source of truth for mobile and reduced-motion experiences.

**Tech Stack:** React 18, TypeScript, React Router 6, Framer Motion 12, CSS, Node's built-in test runner, Vite 5, Puppeteer 25.

**Spec:** `docs/superpowers/specs/2026-08-31-hsc-excellence-vision-design.md`

## Global Constraints

- Keep `/hsc-excellence` and `/programs/hsc` rendering the existing `HSCExcellence` component.
- Add only `/hsc-excellence-vision` for this prototype.
- Treat current project content and assets as the source of truth; do not invent statistics, qualifications, services, names, quotes, marks, outcomes, destinations, or rankings.
- Preserve the four verified learning formats from `src/components/hsc/hscLearningFormatsData.ts`.
- Preserve the 32 named stories from `src/components/hsc/hscStories.ts` and keep results attached to their supporting story.
- Do not ship placeholder images, dead controls, generic repeated-card grids, excessive rounded boxes, glassmorphism, gradient text, or gratuitous motion.
- Essential content must remain present without animation or interaction.
- Honour `prefers-reduced-motion`, keyboard navigation, visible focus, 44px touch targets, pause/play video control, and mobile normal-flow fallbacks.
- Do not modify or include the user's unrelated `src/pages/SuccessStories.css` or `src/pages/SuccessStories.viewportModal.test.mjs` changes in any commit.

## File Map

- `src/pages/HSCExcellenceVision.tsx` — route-level SEO, navigation, prototype composition, and footer.
- `src/features/hsc-vision-prototype/hscVisionData.ts` — audited copy, asset paths, result selections, and case-study selectors.
- `src/features/hsc-vision-prototype/HSCVisionPage.tsx` — ordered thirteen-section composition.
- `src/features/hsc-vision-prototype/HSCVisionHero.tsx` — living-landscape hero and accessible video control.
- `src/features/hsc-vision-prototype/HSCStartingPoints.tsx` — four-state pinned/linear audience scene.
- `src/features/hsc-vision-prototype/HSCTutorStory.tsx` — tutor relationship and matching scenes.
- `src/features/hsc-vision-prototype/HSCSchoolAlignment.tsx` — converging School/DA tracks.
- `src/features/hsc-vision-prototype/HSCMethodStory.tsx` — annotated paper and learning cycle.
- `src/features/hsc-vision-prototype/HSCPreparationStory.tsx` — eleven-focus cinematic sequence.
- `src/features/hsc-vision-prototype/HSCSupportExplorer.tsx` — accessible four-format explorer.
- `src/features/hsc-vision-prototype/HSCProgressEvidence.tsx` — monitoring evidence trail.
- `src/features/hsc-vision-prototype/HSCProofStories.tsx` — results, case studies, and testimonial carousel.
- `src/features/hsc-vision-prototype/HSCVisionFinale.tsx` — closing landscape CTA.
- `src/features/hsc-vision-prototype/hsc-vision.css` — page tokens, layouts, motion, focus, responsive, and reduced-motion rules.
- `src/features/hsc-vision-prototype/*.test.ts` — source/data contract tests using `node:test`.
- `src/features/hsc-vision-prototype/hsc-vision.browser.test.mjs` — Puppeteer interaction and viewport checks.
- `src/App.tsx` — standalone route registration only.

---

### Task 1: Complete the Visual-Direction Gates

**Files:**
- Read: `docs/superpowers/specs/2026-08-31-hsc-excellence-vision-design.md`
- Read: `.agents/skills/impeccable/reference/codex.md`
- Read: `.agents/skills/impeccable/reference/layout.md`
- Read: `.agents/skills/impeccable/reference/typeset.md`
- Read: `.agents/skills/impeccable/reference/animate.md`
- Read: `.agents/skills/impeccable/reference/colorize.md`
- Read: `.agents/skills/impeccable/reference/adapt.md`
- Read: `.agents/skills/impeccable/reference/interaction-design.md`
- Create after approval: `docs/superpowers/specs/2026-08-31-hsc-excellence-vision-visual-inventory.md`

**Interfaces:**
- Consumes: approved design specification and existing DA visual system.
- Produces: one user-approved mock direction and a written inventory of palette, typography, composition, assets, and motion cues used by every implementation task.

- [ ] **Step 1: Ask the mandatory direction questions**

Follow `codex.md` Step A exactly. Record answers about visual emphasis and fidelity to the supplied Basepoint-inspired pacing.

- [ ] **Step 2: Present and confirm the palette**

Follow `codex.md` Step B. The proposal must start from DA navy, ivory, antique gold, sage, dusty blue, peach, and lavender and state accessible foreground pairings. Stop for confirmation.

- [ ] **Step 3: Generate visual directions**

Use the native image-generation workflow required by `codex.md` to produce the prescribed mock options. Include the hero-to-starting-points transition, tutor photograph composition, and school-alignment track in each direction so approval covers the page's signature grammar.

- [ ] **Step 4: Obtain mock approval**

Present the options and stop. Continue only when one is approved or the user explicitly delegates the choice.

- [ ] **Step 5: Write the fidelity inventory**

Create a concise Markdown record with these exact headings: `Palette`, `Typography`, `Grid`, `Hero`, `Signature Scenes`, `Asset Map`, `Motion`, `Mobile`, and `Reduced Motion`. Name the approved mock and every local asset required to reproduce it.

- [ ] **Step 6: Commit the approved inventory**

```bash
git add docs/superpowers/specs/2026-08-31-hsc-excellence-vision-visual-inventory.md
git commit -m "docs: lock HSC vision visual direction"
```

### Task 2: Add the Audited Content Model and Protected Route

**Files:**
- Create: `src/features/hsc-vision-prototype/hscVisionData.ts`
- Create: `src/features/hsc-vision-prototype/hscVisionData.test.ts`
- Create: `src/pages/HSCExcellenceVision.tsx`
- Create: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `HSCStory`/`hscStories` from `src/components/hsc/hscStories.ts` and `classFormats` from `src/components/hsc/hscLearningFormatsData.ts`.
- Produces: `startingPoints`, `tutorQualities`, `schoolTrack`, `daTrack`, `methodSteps`, `preparationFocuses`, `progressSteps`, `featuredResultIds`, and `caseStudyIds`; `HSCVisionPage(): JSX.Element`.

- [ ] **Step 1: Write the failing data and route tests**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { startingPoints, preparationFocuses, progressSteps, featuredStories, caseStudies } from './hscVisionData.ts';

test('defines the complete audited narrative data', () => {
  assert.equal(startingPoints.length, 4);
  assert.deepEqual(startingPoints.map(item => item.id), ['struggling', 'maintaining', 'improving', 'aiming-higher']);
  assert.equal(preparationFocuses.length, 11);
  assert.equal(progressSteps.length, 8);
  assert.ok(featuredStories.every(story => story.result));
  assert.ok(caseStudies.every(story => story.startingPoint && story.whatChanged && story.outcome));
});

test('registers the vision route without replacing production routes', () => {
  const app = readFileSync(new URL('../../App.tsx', import.meta.url), 'utf8');
  assert.match(app, /path="\/hsc-excellence-vision"/);
  assert.match(app, /path="\/hsc-excellence" element=\{<PageTransition><HSCExcellence/);
  assert.match(app, /path="\/programs\/hsc" element=\{<PageTransition><HSCExcellence/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/hscVisionData.test.ts`

Expected: FAIL because `hscVisionData.ts` and the route do not exist.

- [ ] **Step 3: Implement the typed data module and route shell**

Define immutable arrays with explicit `StartingPoint`, `NarrativeStep`, and `PreparationFocus` interfaces. Select featured stories by stable IDs (`review-316`, `review-034`, `review-336`, `review-039`, `review-122`, `review-153`, `review-004`, `review-333`, `review-129`) and case studies only from `review-316` and `review-336`, failing fast during development if a selected ID is missing. Add `HSCExcellenceVision` with `SEO`, `NavigationNew`, `HSCVisionPage`, and `FooterNew`; register only `/hsc-excellence-vision` in `App.tsx`.

- [ ] **Step 4: Run focused tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/hscVisionData.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/HSCExcellenceVision.tsx src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hscVisionData.ts src/features/hsc-vision-prototype/hscVisionData.test.ts
git commit -m "feat: add protected HSC vision route"
```

### Task 3: Build the Living-Landscape Hero and Starting-Points Scene

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCVisionHero.tsx`
- Create: `src/features/hsc-vision-prototype/HSCStartingPoints.tsx`
- Create: `src/features/hsc-vision-prototype/HSCVisionHero.test.ts`
- Create: `src/features/hsc-vision-prototype/hsc-vision.css`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`

**Interfaces:**
- Consumes: `startingPoints` and `/media/hsc/living-landscape.{mp4,poster.jpg}`.
- Produces: `HSCVisionHero(): JSX.Element` and `HSCStartingPoints(): JSX.Element`.

- [ ] **Step 1: Write the failing source contract test**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const hero = readFileSync(new URL('./HSCVisionHero.tsx', import.meta.url), 'utf8');
const points = readFileSync(new URL('./HSCStartingPoints.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./hsc-vision.css', import.meta.url), 'utf8');

test('ships the approved hero with controllable landscape video', () => {
  assert.match(hero, /The final two years/);
  assert.match(hero, /navigate it alone/);
  assert.match(hero, /living-landscape\.mp4/);
  assert.match(hero, /aria-label=\{playing \? 'Pause landscape motion' : 'Play landscape motion'\}/);
});

test('renders all student states and reduced-motion fallbacks', () => {
  assert.match(points, /startingPoints\.map/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.hscv-starting__sticky/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCVisionHero.test.ts`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the two scenes**

Build a full-viewport hero with an explicit play/pause button controlling a `useRef<HTMLVideoElement>`. Use `useReducedMotion` to suppress autoplay and motion transforms. Build the desktop starting-points scene with `useScroll`/`useTransform`, one sticky viewport, and four semantic `<article>` elements; CSS keeps all articles in normal flow below 900px and under reduced motion.

- [ ] **Step 4: Verify focused behavior**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCVisionHero.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCVisionHero.tsx src/features/hsc-vision-prototype/HSCStartingPoints.tsx src/features/hsc-vision-prototype/HSCVisionHero.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css
git commit -m "feat: build HSC vision opening scenes"
```

### Task 4: Build Tutor Story, School Alignment, and Tutor Matching

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCTutorStory.tsx`
- Create: `src/features/hsc-vision-prototype/HSCSchoolAlignment.tsx`
- Create: `src/features/hsc-vision-prototype/HSCRelationshipScenes.test.ts`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: `tutorQualities`, `studentMatchInputs`, `tutorMatchInputs`, `schoolTrack`, `daTrack`.
- Produces: `HSCTutorStory(): JSX.Element`, `HSCTutorMatching(): JSX.Element`, and `HSCSchoolAlignment(): JSX.Element`.

- [ ] **Step 1: Write the failing source contract test**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('keeps tutor and school alignment messages explicit', () => {
  const tutor = readFileSync(new URL('./HSCTutorStory.tsx', import.meta.url), 'utf8');
  const school = readFileSync(new URL('./HSCSchoolAlignment.tsx', import.meta.url), 'utf8');
  assert.match(tutor, /THE RIGHT TUTOR/);
  assert.match(tutor, /WE MATCH STUDENTS/);
  assert.match(tutor, /studentMatchInputs/);
  assert.match(tutor, /tutorMatchInputs/);
  assert.match(school, /TUITION SHOULDN.T EXIST/);
  assert.match(school, /schoolTrack/);
  assert.match(school, /daTrack/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCRelationshipScenes.test.ts`

Expected: FAIL because the scene files do not exist.

- [ ] **Step 3: Implement editorial compositions**

Use `/media/hsc/method/da-method-tutor-session.png` as the dominant tutor image and `/media/hsc/method/tutor-matching-group.png` for the matching scene. Render qualities as positioned editorial captions at wide widths and as a ruled reading sequence on mobile. Render school and DA tracks as ordered lists; animate only their spatial convergence, leaving every label permanently visible. Render tutor matching as two semantic lists converging on “The right match.”

- [ ] **Step 4: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCRelationshipScenes.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCTutorStory.tsx src/features/hsc-vision-prototype/HSCSchoolAlignment.tsx src/features/hsc-vision-prototype/HSCRelationshipScenes.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css
git commit -m "feat: add HSC relationship and alignment scenes"
```

### Task 5: Build the Method Demonstration and Preparation Sequence

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCMethodStory.tsx`
- Create: `src/features/hsc-vision-prototype/HSCPreparationStory.tsx`
- Create: `src/features/hsc-vision-prototype/HSCMethodStory.test.ts`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: `methodSteps`, `methodCycle`, `preparationFocuses`, existing editorial/strategy PNG assets.
- Produces: `HSCMethodStory(): JSX.Element` and `HSCPreparationStory(): JSX.Element`.

- [ ] **Step 1: Write the failing content/asset test**

```ts
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { methodSteps, preparationFocuses } from './hscVisionData.ts';

test('defines a complete learning loop with existing assets', () => {
  assert.deepEqual(methodSteps.map(step => step.title), ['Understand', 'Plan', 'Apply', 'Mark', 'Find the lost marks', 'Correct', 'Retest']);
  assert.equal(preparationFocuses.length, 11);
  for (const focus of preparationFocuses) {
    assert.equal(existsSync(fileURLToPath(new URL(`../../../public${focus.asset}`, import.meta.url))), true, focus.asset);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCMethodStory.test.ts`

Expected: FAIL until every method step and existing asset path is defined.

- [ ] **Step 3: Implement the method scene**

Layer semantic annotation text beside `/media/hsc/editorial/assessment-paper.webp` and `/media/hsc/editorial/feedback-papers.webp`. Use progress-driven emphasis, not content removal. Render the final seven-step cycle as an ordered list with visible arrows and an accessible label.

- [ ] **Step 4: Implement the preparation scene**

Use one preparation focus per viewport-sized panel on desktop. Track scroll progress to translate the panel rail; below 900px use horizontal overflow with CSS scroll snap and below 620px use a vertical sequence. Pair every focus with its existing `/media/hsc/strategy/*.png` asset.

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCMethodStory.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCMethodStory.tsx src/features/hsc-vision-prototype/HSCPreparationStory.tsx src/features/hsc-vision-prototype/HSCMethodStory.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css src/features/hsc-vision-prototype/hscVisionData.ts
git commit -m "feat: demonstrate the DA HSC learning method"
```

### Task 6: Build the Accessible Learning-Formats Explorer

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCSupportExplorer.tsx`
- Create: `src/features/hsc-vision-prototype/HSCSupportExplorer.test.ts`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: `classFormats: ClassFormat[]` from `src/components/hsc/hscLearningFormatsData.ts`.
- Produces: `HSCSupportExplorer(): JSX.Element`, active index state, reassurance state, and keyboard navigation.

- [ ] **Step 1: Write the failing interaction contract test**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCSupportExplorer.tsx', import.meta.url), 'utf8');

test('uses four verified formats with accessible controls', () => {
  assert.match(source, /classFormats/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /aria-selected/);
  assert.match(source, /aria-label="Previous learning format"/);
  assert.match(source, /aria-label="Next learning format"/);
  assert.match(source, /onKeyDown/);
  assert.match(source, /Show parent questions|Hide parent questions/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCSupportExplorer.test.ts`

Expected: FAIL because the explorer does not exist.

- [ ] **Step 3: Implement navigation and content**

Use a tablist for the four formats, roving focus with ArrowLeft/ArrowRight/Home/End, and previous/next buttons. Render title, image, attributes, `bestFor`, and process for the active format. Make the image a button that toggles a separately labelled reassurance panel containing `parentQuestions`; do not hide the essential format content.

- [ ] **Step 4: Implement responsive and reduced-motion behavior**

Use a two-column layout at 960px and wider. Stack navigation above content below that width. Disable 3D transforms under reduced motion and swap the reassurance panel with an ordinary disclosure transition.

- [ ] **Step 5: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCSupportExplorer.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCSupportExplorer.tsx src/features/hsc-vision-prototype/HSCSupportExplorer.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css
git commit -m "feat: add HSC support format explorer"
```

### Task 7: Build Progress Evidence, Results, Case Studies, and Testimonials

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCProgressEvidence.tsx`
- Create: `src/features/hsc-vision-prototype/HSCProofStories.tsx`
- Create: `src/features/hsc-vision-prototype/HSCProofStories.test.ts`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: `progressSteps`, `featuredStories`, `caseStudies`, and all `hscStories`.
- Produces: `HSCProgressEvidence(): JSX.Element`, `HSCResults(): JSX.Element`, `HSCCaseStudies(): JSX.Element`, and `HSCTestimonialLibrary(): JSX.Element`.

- [ ] **Step 1: Write the failing proof contract test**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { caseStudies, featuredStories } from './hscVisionData.ts';

test('keeps proof attached to verified stories', () => {
  assert.ok(featuredStories.length >= 6);
  assert.ok(featuredStories.every(story => story.name && story.quote && story.result));
  assert.deepEqual(caseStudies.map(story => story.id), ['review-316', 'review-336']);
});

test('testimonial library supports filters, arrows, keys, and swipe', () => {
  const source = readFileSync(new URL('./HSCProofStories.tsx', import.meta.url), 'utf8');
  assert.match(source, /aria-label="Previous story"/);
  assert.match(source, /aria-label="Next story"/);
  assert.match(source, /onKeyDown/);
  assert.match(source, /onPointerDown/);
  assert.match(source, /subject/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCProofStories.test.ts`

Expected: FAIL because the proof component does not exist.

- [ ] **Step 3: Implement progress evidence**

Render the eight-step process as one continuous path with existing `/public/hsc-journey/04-support` and `/public/hsc-journey/05-improvement` assets. Keep labels visible and use motion only to advance a gold progress line.

- [ ] **Step 4: Implement verified results and case studies**

Render `featuredStories` as spacious result statements that include the student's name and contextual outcome. Render the two complete case studies with explicit Starting Point, What DA Did, What Changed, and Outcome labels using only stored fields and quote text.

- [ ] **Step 5: Implement the 32-story library**

Adapt the interaction logic from `HSCSuccessStories.tsx`: centred story, partially visible neighbours, thumbnail rail, previous/next buttons, pointer swipe, and Left/Right keyboard navigation. Build filters dynamically from actual `year` and comma-separated `subject` values; an `All` filter always remains available.

- [ ] **Step 6: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCProofStories.test.ts && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCProgressEvidence.tsx src/features/hsc-vision-prototype/HSCProofStories.tsx src/features/hsc-vision-prototype/HSCProofStories.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css
git commit -m "feat: add verified HSC progress and proof story"
```

### Task 8: Build the Finale and Complete Page Composition

**Files:**
- Create: `src/features/hsc-vision-prototype/HSCVisionFinale.tsx`
- Create: `src/features/hsc-vision-prototype/HSCVisionPage.test.ts`
- Modify: `src/features/hsc-vision-prototype/HSCVisionPage.tsx`
- Modify: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: all scene components and `/book-interview`.
- Produces: the complete ordered `HSCVisionPage` and final CTA.

- [ ] **Step 1: Write the failing composition test**

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('./HSCVisionPage.tsx', import.meta.url), 'utf8');
const finale = readFileSync(new URL('./HSCVisionFinale.tsx', import.meta.url), 'utf8');

test('composes all thirteen scenes in narrative order', () => {
  const names = ['HSCVisionHero', 'HSCStartingPoints', 'HSCTutorStory', 'HSCSchoolAlignment', 'HSCMethodStory', 'HSCPreparationStory', 'HSCSupportExplorer', 'HSCTutorMatching', 'HSCProgressEvidence', 'HSCResults', 'HSCCaseStudies', 'HSCTestimonialLibrary', 'HSCVisionFinale'];
  let cursor = -1;
  for (const name of names) {
    const next = page.indexOf(`<${name}`, cursor + 1);
    assert.ok(next > cursor, `${name} is missing or out of order`);
    cursor = next;
  }
});

test('finishes with the approved journey CTA', () => {
  assert.match(finale, /THEIR HSC WILL BE/);
  assert.match(finale, /LET.S MAKE SURE/);
  assert.match(finale, /to="\/book-interview"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/HSCVisionPage.test.ts`

Expected: FAIL until the finale and complete order exist.

- [ ] **Step 3: Implement finale and final composition**

Reuse the landscape video with independent accessible play/pause state, render the approved closing statements, and link the primary CTA to `/book-interview`. Compose all thirteen scenes once in the exact order from the test and ensure the page has one `<main>` landmark.

- [ ] **Step 4: Run all feature tests and typecheck**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/*.test.ts && npm run typecheck`

Expected: all tests pass and TypeScript exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/features/hsc-vision-prototype/HSCVisionFinale.tsx src/features/hsc-vision-prototype/HSCVisionPage.test.ts src/features/hsc-vision-prototype/HSCVisionPage.tsx src/features/hsc-vision-prototype/hsc-vision.css
git commit -m "feat: complete HSC excellence vision narrative"
```

### Task 9: Browser QA, Accessibility Hardening, and Production Verification

**Files:**
- Create: `src/features/hsc-vision-prototype/hsc-vision.browser.test.mjs`
- Modify as defects require: `src/features/hsc-vision-prototype/*.tsx`
- Modify as defects require: `src/features/hsc-vision-prototype/hsc-vision.css`

**Interfaces:**
- Consumes: running Vite application at `http://127.0.0.1:8080/hsc-excellence-vision`.
- Produces: repeatable browser checks for route integrity, controls, viewport overflow, and production-route protection.

- [ ] **Step 1: Write the failing browser test**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';

for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`vision route fits ${viewport.width}px`, async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto('http://127.0.0.1:8080/hsc-excellence-vision', { waitUntil: 'networkidle0' });
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
    assert.equal(await page.locator('text/LET’S MAKE SURE').count() > 0, true);
    await browser.close();
  });
}
```

- [ ] **Step 2: Start Vite and verify the test fails before final hardening**

Run in terminal 1: `npm run dev -- --host 127.0.0.1 --port 8080`

Run in terminal 2: `node --test src/features/hsc-vision-prototype/hsc-vision.browser.test.mjs`

Expected: at least one viewport or interaction assertion exposes a remaining defect.

- [ ] **Step 3: Expand interaction coverage**

Add assertions that the hero video button changes its accessible label, learning-format ArrowRight changes the selected tab, the reassurance button toggles `aria-expanded`, testimonial ArrowRight changes the featured story, all controls are reachable by repeated Tab presses, and `/hsc-excellence` plus `/programs/hsc` still contain the existing hero heading.

- [ ] **Step 4: Inspect and fix the rendered page**

Use the in-app browser at 1440×900, 1024×768, 768×1024, 390×844, and 320×568. Check every section boundary, sticky release point, heading wrap, image crop, focus ring, touch target, video control, carousel edge, and footer transition. Emulate reduced motion and confirm every scene is readable in normal flow. Fix each observed defect in the owning component or CSS rule.

- [ ] **Step 5: Run complete verification**

Run: `node --test --experimental-strip-types src/features/hsc-vision-prototype/*.test.ts`

Run: `node --test src/features/hsc-vision-prototype/hsc-vision.browser.test.mjs`

Run: `npm run typecheck`

Run: `npm run build`

Expected: every command exits 0; browser console has no errors; the build creates the Vite production bundle.

- [ ] **Step 6: Audit factual claims**

Search the rendered data and component files for every number, percentage, rank, ATAR, qualification, and service name. Match each result to its `hscStories.ts` record and each service to `hscLearningFormatsData.ts`. Remove any assertion that lacks a project source.

- [ ] **Step 7: Commit the verified prototype**

```bash
git add src/features/hsc-vision-prototype/hsc-vision.browser.test.mjs src/features/hsc-vision-prototype src/pages/HSCExcellenceVision.tsx src/App.tsx
git commit -m "test: verify HSC vision prototype experience"
```

