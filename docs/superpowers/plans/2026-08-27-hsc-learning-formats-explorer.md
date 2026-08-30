# HSC Learning Formats Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single interactive four-format HSC Learning Formats Explorer matching the approved editorial reference and backed by 54 separately generated ChatGPT Image Generator assets.

**Architecture:** A focused `HSCLearningFormatsExplorer` component owns active-format and flip state and renders one shared brochure panel from a typed `classFormats` data structure. Generated assets live in a dedicated public directory, while existing `HSCWhyYearsMatter` only mounts the explorer at the current Private Tuition panel position; the living background remains page-owned and never remounts.

**Tech Stack:** React 18, TypeScript, Framer Motion, CSS, Node test runner, Vite, ChatGPT built-in Image Generator.

**Spec:** `docs/superpowers/specs/2026-08-27-hsc-learning-formats-explorer-design.md`

## Global Constraints

- Preserve the existing hero, earlier HSC editorial scenes, and continuous living-watercolor video.
- Do not generate or replace the landscape background.
- Render one shared active panel from one four-item data structure; never stack four full sections.
- Generate every explorer icon separately; do not reuse Lucide or existing HSC icons.
- Store 54 final assets in `public/media/hsc/editorial/explorer/`.
- Keep meaningful copy as HTML; generated assets contain no readable text.
- Do not invent class-size numbers or other DA facts.
- Desktop target: 1440×900. Mobile target: 390×844. No horizontal overflow.
- Respect reduced motion and use controls with minimum 44px touch targets.
- Preserve the dirty worktree and commit only files belonging to each task.

---

## File Structure

- Create `src/components/hsc/HSCLearningFormatsExplorer.tsx` — interaction state, accessible controls, shared active-panel markup.
- Create `src/components/hsc/HSCLearningFormatsExplorer.css` — desktop brochure composition, flip, transitions, mobile layout.
- Create `src/components/hsc/hscLearningFormatsData.ts` — typed four-format content and asset paths.
- Create `src/components/hsc/HSCLearningFormatsExplorer.test.ts` — structural, interaction-model, accessibility, and asset-manifest regression tests.
- Modify `src/components/hsc/HSCWhyYearsMatter.tsx` — remove the dedicated Private Tuition implementation and mount the explorer once.
- Modify `src/components/hsc/HSCWhyYearsMatter.css` — remove styles belonging only to the replaced dedicated panel.
- Modify `src/components/hsc/HSCWhyYearsMatter.test.ts` — assert explorer integration and absence of legacy panel markup.
- Create `public/media/hsc/editorial/explorer/*.png` — 54 separately generated project assets.

---

### Task 1: Asset Manifest Contract

**Files:**
- Create: `src/components/hsc/hscLearningFormatsData.ts`
- Create: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Produces: `LearningFormat`, `LearningFormatAttribute`, `LearningFormatProcessStep`, `ParentQuestion`, `classFormats`.
- Produces: exact asset paths consumed by Tasks 2–6 and panel markup consumed by Task 7.

- [ ] **Step 1: Write the failing manifest test**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { classFormats } from './hscLearningFormatsData.ts';

test('defines four complete learning formats and 54 unique generated assets', () => {
  assert.equal(classFormats.length, 4);
  const assets = classFormats.flatMap(format => [
    format.image,
    ...format.attributes.map(item => item.icon),
    ...format.process.map(item => item.icon),
    ...format.parentQuestions.map(item => item.icon),
  ]);
  const shared = [
    '/media/hsc/editorial/explorer/explorer-panel-paper.png',
    '/media/hsc/editorial/explorer/explorer-reassurance-paper.png',
    '/media/hsc/editorial/explorer/explorer-instruction-accent.png',
  ];
  assert.equal(assets.length + shared.length, 54);
  assert.equal(new Set([...assets, ...shared]).size, 54);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts`

Expected: FAIL because `hscLearningFormatsData.ts` does not exist.

- [ ] **Step 3: Create the types and complete data structure**

```ts
export interface LearningFormatAttribute {
  title: string;
  description: string;
  icon: string;
}

export interface LearningFormatProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface ParentQuestion {
  question: string;
  answer: string;
  icon: string;
}

export interface LearningFormat {
  id: 'private' | 'group' | 'hsc' | 'trial';
  number: '01' | '02' | '03' | '04';
  title: string;
  shortTitle: string;
  navDescription: string;
  tagline: string;
  image: string;
  imageAlt: string;
  attributes: [LearningFormatAttribute, LearningFormatAttribute, LearningFormatAttribute];
  bestFor: [string, string, string, string, string];
  process: LearningFormatProcessStep[];
  parentQuestions: [ParentQuestion, ParentQuestion, ParentQuestion, ParentQuestion];
}

export const classFormats: LearningFormat[] = [privateFormat, groupFormat, hscFormat, trialFormat];
```

Define `privateFormat`, `groupFormat`, `hscFormat`, and `trialFormat` immediately above the exported array. Populate every field with the corresponding approved copy in the design specification and use these exact image roots:

```ts
const root = '/media/hsc/editorial/explorer';
```

Use the approved brief verbatim for all four objects. For Small Group class size, use: “We keep groups focused so tutors can still teach, question and respond to students directly.”

- [ ] **Step 4: Run the manifest test and confirm GREEN**

Run: `node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the contract**

```bash
git add src/components/hsc/hscLearningFormatsData.ts src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "test: define HSC explorer content contract"
```

---

### Task 2: Generate Four Format Photographs

**Files:**
- Create: `public/media/hsc/editorial/explorer/explorer-private-photo.png`
- Create: `public/media/hsc/editorial/explorer/explorer-small-group-photo.png`
- Create: `public/media/hsc/editorial/explorer/explorer-hsc-prep-photo.png`
- Create: `public/media/hsc/editorial/explorer/explorer-trial-prep-photo.png`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `classFormats[].image` from Task 1.
- Produces: four independently generated editorial photographs.

- [ ] **Step 1: Add a failing existence and format test**

```ts
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

test('ships every explorer photograph as a PNG', () => {
  for (const format of classFormats) {
    const path = fileURLToPath(new URL(`../../../public${format.image}`, import.meta.url));
    assert.equal(existsSync(path), true, path);
    assert.deepEqual([...readFileSync(path).subarray(1, 4)], [80, 78, 71]);
  }
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts`

Expected: FAIL listing missing photo paths.

- [ ] **Step 3: Generate each photograph in a separate built-in Image Generator call**

Shared prompt contract:

```text
Use case: photorealistic-natural
Asset type: HSC Learning Formats Explorer front photograph
Style: premium candid education editorial photography; natural faces, hands and paper; warm daylight; navy, cream and timber palette
Composition: landscape 4:3 with safe central crop and organic dry-brush boundary
Constraints: no text, logos, watermark or checkerboard; no surrounding webpage; output PNG
```

Per-file subjects:

```text
explorer-private-photo.png: one Asian teenage student and one Asian female tutor working closely on an open workbook.
explorer-small-group-photo.png: one tutor guiding three HSC students around a shared table in discussion.
explorer-hsc-prep-photo.png: tutor reviewing an HSC written response with one student, annotated pages visible but unreadable.
explorer-trial-prep-photo.png: student completing timed exam practice while a tutor reviews Trial-style work nearby.
```

Inspect each output. Reject malformed hands, readable invented text, logos, or simulated transparency that would remain visible. Copy selected outputs from `$CODEX_HOME/generated_images/...` into the exact project paths.

- [ ] **Step 4: Run the asset test and confirm GREEN**

Run: `node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the photographs**

```bash
git add public/media/hsc/editorial/explorer/explorer-*-photo.png src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "assets: add HSC explorer photographs"
```

---

### Task 3: Generate Twelve Attribute Icons

**Files:**
- Create: `public/media/hsc/editorial/explorer/explorer-*-attribute-*.png` (12 files)
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `classFormats[].attributes[].icon`.
- Produces: three unique icons per format.

- [ ] **Step 1: Extend the failing asset test**

```ts
test('ships all twelve unique attribute icons', () => {
  const paths = classFormats.flatMap(format => format.attributes.map(item => item.icon));
  assert.equal(paths.length, 12);
  assert.equal(new Set(paths).size, 12);
  paths.forEach(assertPublicPngExists);
});
```

Define `assertPublicPngExists(path: string)` once in the test using the Task 2 PNG signature check.

- [ ] **Step 2: Run and confirm RED**

Run the focused explorer test. Expected: FAIL with missing attribute files.

- [ ] **Step 3: Generate twelve icons using twelve separate built-in calls**

Shared prompt:

```text
Use case: stylized-concept
Asset type: one HSC Explorer attribute icon
Style: refined antique-gold watercolor line art, consistent 1.5px visual stroke, centered on a soft irregular ivory watercolor wash
Composition: square, generous padding
Constraints: exactly one concept; no words, letters, numbers, logo, watermark or checkerboard
```

Generate the exact concepts represented by the 12 attribute titles in `classFormats`. Save each to its manifest path.

- [ ] **Step 4: Inspect as a contact sheet and run GREEN test**

Use an image contact-sheet command only for inspection; do not merge final files. Verify consistent scale, gold hue, padding and stroke character. Then run the explorer test.

- [ ] **Step 5: Commit attribute assets**

```bash
git add public/media/hsc/editorial/explorer/explorer-*-attribute-*.png src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "assets: add HSC explorer attribute icons"
```

---

### Task 4: Generate Nineteen Process Icons

**Files:**
- Create: `public/media/hsc/editorial/explorer/explorer-*-process-*.png` (19 files)
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `classFormats[].process[].icon`.
- Produces: unique process artwork for every step.

- [ ] **Step 1: Add the failing uniqueness/existence test**

```ts
test('ships all nineteen unique process icons', () => {
  const paths = classFormats.flatMap(format => format.process.map(item => item.icon));
  assert.equal(paths.length, 19);
  assert.equal(new Set(paths).size, 19);
  paths.forEach(assertPublicPngExists);
});
```

- [ ] **Step 2: Run and confirm RED**

Run the explorer test. Expected: FAIL for missing process assets.

- [ ] **Step 3: Generate 19 icons in 19 separate calls**

Use the Task 3 visual-system prompt, replacing `attribute icon` with `process-step icon`. Generate the exact concept named by each process title. Distinguish repeated concepts between formats through composition while preserving the common style.

- [ ] **Step 4: Inspect the 19-file contact sheet and run GREEN test**

Confirm all files remain separate. Verify concept legibility at 48–64 CSS pixels.

- [ ] **Step 5: Commit process assets**

```bash
git add public/media/hsc/editorial/explorer/explorer-*-process-*.png src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "assets: add HSC explorer process icons"
```

---

### Task 5: Generate Sixteen Parent-Question Icons

**Files:**
- Create: `public/media/hsc/editorial/explorer/explorer-*-faq-*.png` (16 files)
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `classFormats[].parentQuestions[].icon`.
- Produces: one unique reassurance icon per question.

- [ ] **Step 1: Add the failing FAQ asset test**

```ts
test('ships sixteen unique parent-question icons', () => {
  const paths = classFormats.flatMap(format => format.parentQuestions.map(item => item.icon));
  assert.equal(paths.length, 16);
  assert.equal(new Set(paths).size, 16);
  paths.forEach(assertPublicPngExists);
});
```

- [ ] **Step 2: Run and confirm RED**

Run the explorer test. Expected: FAIL for missing FAQ assets.

- [ ] **Step 3: Generate 16 icons in 16 separate calls**

Use the same visual-system prompt. Translate each question into one literal, calm symbol without text. Examples: sprout/foundation, rising rocket, tutor-student connection, progress chart. Save each independently to the manifest path.

- [ ] **Step 4: Inspect and run GREEN test**

Confirm the symbols remain distinct but visually coherent at 40–52 CSS pixels.

- [ ] **Step 5: Commit FAQ assets**

```bash
git add public/media/hsc/editorial/explorer/explorer-*-faq-*.png src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "assets: add HSC explorer FAQ icons"
```

---

### Task 6: Generate Three Paper/Instruction Assets

**Files:**
- Create: `public/media/hsc/editorial/explorer/explorer-panel-paper.png`
- Create: `public/media/hsc/editorial/explorer/explorer-reassurance-paper.png`
- Create: `public/media/hsc/editorial/explorer/explorer-instruction-accent.png`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Produces: blank paper surfaces and accent used by the selector/panel.

- [ ] **Step 1: Add the failing shared-asset test**

```ts
test('ships the three generated explorer surface assets', () => {
  [
    '/media/hsc/editorial/explorer/explorer-panel-paper.png',
    '/media/hsc/editorial/explorer/explorer-reassurance-paper.png',
    '/media/hsc/editorial/explorer/explorer-instruction-accent.png',
  ].forEach(assertPublicPngExists);
});
```

- [ ] **Step 2: Run and confirm RED**

Run the explorer test. Expected: FAIL for three missing assets.

- [ ] **Step 3: Generate each asset separately**

```text
Panel paper: warm ivory handmade paper, extremely subtle fibre texture, blank, straight-on, no shadow or text.
Reassurance paper: warm cream deckled paper with restrained edge variation, blank, straight-on, no text.
Instruction accent: one antique-gold watercolor lightbulb with a small curved hand-drawn arrow, no words.
```

Save each independently. Do not generate the landscape.

- [ ] **Step 4: Run GREEN test and verify total count**

Run the explorer test. Expected: all asset tests pass and total unique manifest count equals 54.

- [ ] **Step 5: Commit shared assets**

```bash
git add public/media/hsc/editorial/explorer/explorer-panel-paper.png public/media/hsc/editorial/explorer/explorer-reassurance-paper.png public/media/hsc/editorial/explorer/explorer-instruction-accent.png src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "assets: add HSC explorer paper surfaces"
```

---

### Task 7: Build the Shared Explorer Interaction Model

**Files:**
- Create: `src/components/hsc/HSCLearningFormatsExplorer.tsx`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `classFormats` and `LearningFormat` from Task 1.
- Produces: default export `HSCLearningFormatsExplorer`.

- [ ] **Step 1: Write failing structural and state-transition tests**

Because the existing suite uses source-level Node tests, assert the implementation contract directly:

```ts
const componentSource = readFileSync(new URL('./HSCLearningFormatsExplorer.tsx', import.meta.url), 'utf8');

test('uses one active index and one flip state', () => {
  assert.match(componentSource, /useState\(0\)/);
  assert.match(componentSource, /useState\(false\)/);
  assert.match(componentSource, /setIsFlipped\(false\)/);
  assert.match(componentSource, /classFormats\[activeIndex\]/);
});

test('wraps previous and next navigation', () => {
  assert.match(componentSource, /\(activeIndex - 1 \+ classFormats\.length\) % classFormats\.length/);
  assert.match(componentSource, /\(activeIndex \+ 1\) % classFormats\.length/);
});
```

- [ ] **Step 2: Run and confirm RED**

Run the explorer test. Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement state and navigation helpers**

```tsx
const [activeIndex, setActiveIndex] = useState(0);
const [isFlipped, setIsFlipped] = useState(false);
const activeFormat = classFormats[activeIndex];

const selectFormat = (index: number) => {
  setIsFlipped(false);
  setDirection(index > activeIndex ? 1 : -1);
  setActiveIndex(index);
};

const previous = () => selectFormat((activeIndex - 1 + classFormats.length) % classFormats.length);
const next = () => selectFormat((activeIndex + 1) % classFormats.length);
```

Add an explorer-root `onKeyDown` that handles ArrowLeft/ArrowRight only when the event originates within the root. Do not attach a window-level listener.

- [ ] **Step 4: Render real selector and navigation buttons**

Use `aria-current={index === activeIndex ? 'true' : undefined}` for selectors. Previous/next labels derive from wrapped indices. Use `aria-label` values that include target format names.

- [ ] **Step 5: Run GREEN tests and ESLint**

```bash
node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts
npx eslint src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/hscLearningFormatsData.ts
```

- [ ] **Step 6: Commit the interaction model**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "feat: add HSC learning format navigation"
```

---

### Task 8: Implement the Reusable Front Panel

**Files:**
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.tsx`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: active `LearningFormat`.
- Produces: one reusable header/photo/attributes/Best For/process panel.

- [ ] **Step 1: Add failing shared-tree tests**

```ts
test('renders one shared brochure tree from activeFormat', () => {
  assert.equal((componentSource.match(/className="hsc-explorer-panel"/g) ?? []).length, 1);
  assert.match(componentSource, /activeFormat\.attributes\.map/);
  assert.match(componentSource, /activeFormat\.bestFor\.map/);
  assert.match(componentSource, /activeFormat\.process\.map/);
});
```

- [ ] **Step 2: Run and confirm RED**

- [ ] **Step 3: Implement shared front markup**

Render number/title/tagline, photo flip button, three attributes, Best For, process steps and bottom navigation from `activeFormat`. Every generated icon uses an empty decorative alt; textual title adjacent to it provides meaning. The photo uses its format-specific alt.

- [ ] **Step 4: Run GREEN tests and ESLint**

- [ ] **Step 5: Commit the front panel**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "feat: render HSC explorer brochure panel"
```

---

### Task 9: Implement the Photo-to-FAQ Flip

**Files:**
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.tsx`
- Create: `src/components/hsc/HSCLearningFormatsExplorer.css`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Consumes: `activeFormat.parentQuestions`, `isFlipped`.
- Produces: accessible two-sided flip card.

- [ ] **Step 1: Add failing accessibility/flip tests**

```ts
test('provides accessible front and back flip controls', () => {
  assert.match(componentSource, /Show parent questions for/);
  assert.match(componentSource, /Return to .* photo/);
  assert.match(componentSource, /activeFormat\.parentQuestions\.map/);
  assert.match(componentSource, /aria-pressed=\{isFlipped\}/);
});
```

- [ ] **Step 2: Run and confirm RED**

- [ ] **Step 3: Add two-sided markup**

```tsx
<div className={`hsc-explorer-flip${isFlipped ? ' is-flipped' : ''}`}>
  <button className="hsc-explorer-face hsc-explorer-face--front" aria-pressed={isFlipped} aria-label={`Show parent questions for ${activeFormat.title}`} onClick={() => setIsFlipped(true)}>
    <img src={activeFormat.image} alt={activeFormat.imageAlt} />
    <span>Questions<br />parents ask ↗</span>
  </button>
  <section className="hsc-explorer-face hsc-explorer-face--back" aria-hidden={!isFlipped}>
    <h3>A LITTLE MORE REASSURANCE</h3>
    <p>The things parents often ask us.</p>
    {activeFormat.parentQuestions.map(item => (
      <article key={item.question}>
        <img src={item.icon} alt="" />
        <div><h4>{item.question}</h4><p>{item.answer}</p></div>
      </article>
    ))}
    <button type="button" onClick={() => setIsFlipped(false)} aria-label={`Return to ${activeFormat.title} photo`}>← Back to {activeFormat.title}</button>
  </section>
</div>
```

- [ ] **Step 4: Add 3D and reduced-motion CSS**

```css
.hsc-explorer-flip { position: relative; transform-style: preserve-3d; transition: transform 680ms cubic-bezier(.45,0,.2,1); }
.hsc-explorer-flip.is-flipped { transform: rotateY(180deg); }
.hsc-explorer-face { backface-visibility: hidden; }
.hsc-explorer-face--back { position: absolute; inset: 0; transform: rotateY(180deg); }
@media (prefers-reduced-motion: reduce) { .hsc-explorer-flip { transition: opacity 120ms linear; transform: none !important; } }
```

- [ ] **Step 5: Run tests and ESLint**

- [ ] **Step 6: Commit the flip interaction**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.css src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "feat: add explorer parent reassurance flip"
```

---

### Task 10: Match the Desktop Editorial Reference

**Files:**
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.css`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Produces: desktop 30/70 editorial composition and active/inactive states.

- [ ] **Step 1: Add source-level layout safeguards**

```ts
const cssSource = readFileSync(new URL('./HSCLearningFormatsExplorer.css', import.meta.url), 'utf8');
test('keeps the explorer translucent over the living landscape', () => {
  assert.match(cssSource, /grid-template-columns:\s*minmax\([^;]+\)\s+minmax\(/);
  assert.doesNotMatch(cssSource, /background[^;]*hsc.*landscape|<video/);
});
```

- [ ] **Step 2: Implement desktop CSS**

Match the reference: max-width 1500px, left selector around 30%, warm paper panel, restrained 12–16px radius, subtle shadow, large serif title, antique-gold linework, 44px buttons, vertical progress line and edge pointer. Use the generated paper asset as a low-contrast panel background.

- [ ] **Step 3: Add restrained Framer Motion sequence**

Use `AnimatePresence mode="wait"` keyed by `activeFormat.id`. Apply direction-aware 20px photo translation, opacity transitions, and staggered content timing totalling 700–850ms. Keep content visible at initial render.

- [ ] **Step 4: Run automated checks**

```bash
node --test --experimental-strip-types src/components/hsc/HSCLearningFormatsExplorer.test.ts
npx eslint src/components/hsc/HSCLearningFormatsExplorer.tsx
git diff --check
```

- [ ] **Step 5: Desktop browser QA**

At 1440×900 verify selector proportions, active marker, paper texture, front/back height equality, all assets loaded, no clipping and no console errors. Exercise all four selectors, both arrows, wrapping and every FAQ flip.

- [ ] **Step 6: Commit desktop styling**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.css src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "style: match HSC explorer editorial reference"
```

---

### Task 11: Responsive and Reduced-Motion Adaptation

**Files:**
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.css`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.tsx`
- Modify: `src/components/hsc/HSCLearningFormatsExplorer.test.ts`

**Interfaces:**
- Produces: mobile horizontal selector, vertical active panel, minimum touch targets and overflow safety.

- [ ] **Step 1: Add failing mobile-contract assertions**

```ts
test('defines the mobile horizontal selector and reduced-motion fallback', () => {
  assert.match(cssSource, /@media \(max-width:\s*820px\)/);
  assert.match(cssSource, /overflow-x:\s*auto/);
  assert.match(cssSource, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(cssSource, /min-height:\s*44px/);
});
```

- [ ] **Step 2: Run and confirm RED**

- [ ] **Step 3: Implement mobile CSS**

At 820px and below: horizontal selector, single-column panel, header → tagline → flip → attributes → Best For → process → navigation. Use `min-width: 0`, `max-width: 100%`, and local selector scrolling to prevent document overflow.

- [ ] **Step 4: Implement reduced motion**

Disable direction translations and 3D rotation; use a short opacity swap. Preserve both sides’ keyboard access and visibility semantics.

- [ ] **Step 5: Run automated checks**

- [ ] **Step 6: Mobile browser QA**

At 390×844: activate all formats, flip each photo, use arrows, inspect horizontal selector, verify 44px targets, confirm `document.documentElement.scrollWidth <= innerWidth`, and check console errors.

- [ ] **Step 7: Commit responsive behavior**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.css src/components/hsc/HSCLearningFormatsExplorer.test.ts
git commit -m "style: adapt HSC explorer for mobile"
```

---

### Task 12: Integrate Explorer and Remove the Legacy Panel

**Files:**
- Modify: `src/components/hsc/HSCWhyYearsMatter.tsx`
- Modify: `src/components/hsc/HSCWhyYearsMatter.css`
- Modify: `src/components/hsc/HSCWhyYearsMatter.test.ts`
- Test: `src/pages/HSCExcellence.landscape.test.ts`

**Interfaces:**
- Consumes: default `HSCLearningFormatsExplorer` from Task 7.
- Produces: one mounted explorer beneath the support journey.

- [ ] **Step 1: Write the failing integration test**

```ts
test('mounts the shared explorer and removes the dedicated private panel', () => {
  assert.match(source, /<HSCLearningFormatsExplorer/);
  assert.equal((source.match(/<HSCLearningFormatsExplorer/g) ?? []).length, 1);
  assert.doesNotMatch(source, /hsc-private-layout|private-tuition-best-for-paper|private-tuition-personalised-note/);
});
```

- [ ] **Step 2: Run and confirm RED**

Run both HSC component and landscape tests.

- [ ] **Step 3: Replace legacy markup with the explorer**

```tsx
import HSCLearningFormatsExplorer from './HSCLearningFormatsExplorer';

// At the current dedicated Private Tuition location:
<HSCLearningFormatsExplorer />
```

Delete only `.hsc-private*` CSS. Preserve all earlier editorial and support-journey CSS.

- [ ] **Step 4: Run GREEN tests and lint**

```bash
node --test --experimental-strip-types src/components/hsc/HSCWhyYearsMatter.test.ts src/components/hsc/HSCLearningFormatsExplorer.test.ts src/pages/HSCExcellence.landscape.test.ts
npx eslint src/components/hsc/HSCWhyYearsMatter.tsx src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/hscLearningFormatsData.ts
git diff --check
```

- [ ] **Step 5: Verify background continuity**

Confirm the landscape test still finds one shared below-hero video and that changing format/flipping the card does not alter video element identity or playback time.

- [ ] **Step 6: Commit integration**

```bash
git add src/components/hsc/HSCWhyYearsMatter.tsx src/components/hsc/HSCWhyYearsMatter.css src/components/hsc/HSCWhyYearsMatter.test.ts src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.css src/components/hsc/HSCLearningFormatsExplorer.test.ts src/components/hsc/hscLearningFormatsData.ts
git commit -m "feat: integrate HSC learning formats explorer"
```

---

### Task 13: Final End-to-End Verification

**Files:**
- Modify only files necessary for defects discovered during verification.

**Interfaces:**
- Produces: verified final explorer and evidence for handoff.

- [ ] **Step 1: Run the full focused verification**

```bash
node --test --experimental-strip-types src/components/hsc/HSCWhyYearsMatter.test.ts src/components/hsc/HSCLearningFormatsExplorer.test.ts src/pages/HSCExcellence.landscape.test.ts
npx eslint src/components/hsc/HSCWhyYearsMatter.tsx src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/hscLearningFormatsData.ts
git diff --check
```

Expected: zero failures and zero lint errors.

- [ ] **Step 2: Desktop interaction matrix**

At 1440×900 verify:

```text
Selectors: 01, 02, 03, 04
Previous wrap: 01 → 04
Next wrap: 04 → 01
Flip fronts/backs: all four
Change format while flipped: resets to front
Keyboard: left/right only while focus is inside explorer
Assets: 54 successful responses
Console: zero errors
Overflow: document scrollWidth <= innerWidth
```

- [ ] **Step 3: Mobile interaction matrix**

Repeat at 390×844 with the horizontal selector and tap interactions. Confirm no clipped text, images, or arrows.

- [ ] **Step 4: Reduced-motion matrix**

Emulate `prefers-reduced-motion: reduce`. Verify no large translations or 3D rotation, and that all front/back content remains reachable.

- [ ] **Step 5: Compare against the approved reference**

Check composition, navy/gold balance, paper texture, photo prominence, left active state, FAQ hierarchy, whitespace, and brochure—not dashboard—character. Correct only explorer-specific discrepancies.

- [ ] **Step 6: Run verification again after any correction**

Re-run Step 1 and the affected visual matrix. Do not claim completion from a pre-fix run.

- [ ] **Step 7: Commit final corrections**

```bash
git add src/components/hsc/HSCLearningFormatsExplorer.tsx src/components/hsc/HSCLearningFormatsExplorer.css src/components/hsc/HSCLearningFormatsExplorer.test.ts src/components/hsc/hscLearningFormatsData.ts src/components/hsc/HSCWhyYearsMatter.tsx src/components/hsc/HSCWhyYearsMatter.css src/components/hsc/HSCWhyYearsMatter.test.ts public/media/hsc/editorial/explorer
git commit -m "fix: finish HSC explorer visual QA"
```
