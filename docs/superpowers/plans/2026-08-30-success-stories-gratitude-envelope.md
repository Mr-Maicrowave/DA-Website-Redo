# Success Stories Gratitude Envelope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the Success Stories gratitude section with a premium, layered envelope that opens on user activation and reveals DA’s thank-you letter surrounded by unused real review fragments.

**Architecture:** `GratitudeSection` remains the page-level component but is rebuilt around one `isOpen` state and strict envelope layers. Generated transparent raster assets provide tactile paper materials; semantic HTML provides all text, review fragments, controls, and accessibility. Framer Motion variants choreograph the seal, flap, letter, envelope, and notes, while CSS owns responsive geometry and z-index ordering.

**Tech Stack:** React 18, TypeScript, Framer Motion 12, CSS, built-in ChatGPT Image Generator, Node test runner, in-app Browser.

**Spec:** `docs/superpowers/specs/2026-08-30-success-stories-gratitude-envelope-design.md`

## Global Constraints

- Modify only the existing Success Stories `GratitudeSection` and its directly owned assets, data, tests, and styles.
- Keep the six review fragments as exact substrings from `src/data/reviews.json`; none may use an author in `src/data/googleReviews.ts`.
- Do not alter the Success Stories hero, story carousel, review marquee, parent flip cards, or 3D review field.
- Do not add dependencies or fonts; use the existing Cormorant/DA serif, body sans, and `Caveat` only for the closing line.
- The envelope must not open automatically; activation is click, Enter, or Space through a native button.
- Keep `aria-expanded`, state-specific accessible labels, an explicit close control, focus visibility, and reduced-motion behavior.
- Generated assets contain no text, logo, watermark, or review wording; all wording stays as live HTML.
- Preserve existing unrelated dirty-worktree changes and stage only task-owned files in each commit.

---

## File Structure

- Create `public/images/success-stories/gratitude-envelope-back-v1.png` — generated transparent envelope-back material.
- Create `public/images/success-stories/gratitude-envelope-flap-v1.png` — generated transparent top flap.
- Create `public/images/success-stories/gratitude-envelope-pocket-v1.png` — generated transparent front pocket.
- Create `public/images/success-stories/gratitude-letter-paper-v1.png` — generated transparent letter sheet.
- Create `public/images/success-stories/gratitude-heart-seal-v1.png` — generated transparent paper heart seal.
- Create `src/components/success-stories/gratitudeReviewNotes.ts` — exact unused review-note data and public type.
- Create `src/components/success-stories/GratitudeSection.test.mjs` — source/data/style regression tests.
- Modify `src/components/success-stories/GratitudeSection.tsx` — semantic interaction, layer markup, and Framer Motion choreography.
- Modify `src/components/success-stories/GratitudeSection.css` — reference composition, responsive geometry, layer ordering, and reduced motion.

---

### Task 1: Generate and Validate the Layered Paper Asset Set

**Files:**
- Create: `public/images/success-stories/gratitude-envelope-back-v1.png`
- Create: `public/images/success-stories/gratitude-envelope-flap-v1.png`
- Create: `public/images/success-stories/gratitude-envelope-pocket-v1.png`
- Create: `public/images/success-stories/gratitude-letter-paper-v1.png`
- Create: `public/images/success-stories/gratitude-heart-seal-v1.png`

**Interfaces:**
- Consumes: the attached envelope reference image as composition/material reference.
- Produces: five high-resolution transparent PNG paths used directly by `GratitudeSection.tsx`.

- [ ] **Step 1: Generate the envelope-back asset with the built-in Image Generator**

Use one built-in image-generation call with the reference image included and this prompt:

```text
Use case: product-mockup
Asset type: transparent responsive website layer
Input image: Image 1 is a material and composition reference only
Primary request: isolated back panel of a large premium cream paper envelope, straight-on front view
Style/medium: photorealistic editorial stationery, refined and understated
Composition/framing: centred rectangular back panel, symmetrical, generous transparent margin, no flap and no front pocket
Lighting/mood: soft diffuse studio light, quiet and heartfelt
Color palette: warm ivory, subtle beige, no bright colours
Materials/textures: fine cotton paper fibres, softly imperfect natural edge, restrained depth
Constraints: genuinely transparent background; isolated single layer; no text; no logo; no watermark; no seal; no shadow beyond a tight contact shadow
Avoid: cartoon styling, glossy paper, glassmorphism, dramatic wrinkles, objects, stationery props
```

- [ ] **Step 2: Generate the flap asset**

```text
Use case: product-mockup
Asset type: transparent responsive website layer
Input image: Image 1 is a material and composition reference only
Primary request: isolated triangular top flap for the same premium cream paper envelope
Style/medium: photorealistic editorial stationery matching the reference
Composition/framing: straight-on, perfectly centred, broad triangular flap with a horizontal top hinge edge, generous transparent margin
Lighting/mood: soft diffuse studio light
Color palette: warm ivory and soft beige
Materials/textures: fine cotton paper fibres, subtle fold definition
Constraints: genuinely transparent background; one isolated flap only; no text; no logo; no watermark; no seal; geometry suitable for CSS rotateX around top center
Avoid: envelope body, front pocket, cartoon styling, glossy material, heavy shadow
```

- [ ] **Step 3: Generate the front-pocket asset**

```text
Use case: product-mockup
Asset type: transparent responsive website layer
Input image: Image 1 is a material and composition reference only
Primary request: isolated front pocket of a premium cream paper envelope with elegant diagonal side folds meeting at the lower centre
Style/medium: photorealistic editorial stationery matching the reference
Composition/framing: straight-on, symmetrical wide pocket, transparent above and around the pocket
Lighting/mood: soft diffuse studio light
Color palette: warm ivory and soft beige
Materials/textures: fine cotton paper fibres with restrained fold shadows
Constraints: genuinely transparent background; one isolated front-pocket layer; no text; no logo; no watermark; no flap; no seal
Avoid: cartoon styling, glossy material, open letter, props, wide blurred shadow
```

- [ ] **Step 4: Generate the letter-paper asset**

```text
Use case: product-mockup
Asset type: transparent responsive website layer
Input image: Image 1 is a material and composition reference only
Primary request: isolated blank premium ivory letter sheet for a heartfelt family thank-you note
Style/medium: photorealistic editorial stationery
Composition/framing: straight-on portrait sheet, centred, approximately 4:5 aspect ratio, generous transparent margin
Lighting/mood: soft diffuse studio light, calm and warm
Color palette: warm ivory
Materials/textures: fine cotton paper fibres, softly imperfect deckled edge, nearly flat surface
Constraints: genuinely transparent background; blank sheet; no text; no lines; no logo; no watermark; tight subtle paper depth only
Avoid: torn damage, stains, curl, perspective angle, heavy shadow, props
```

- [ ] **Step 5: Generate the heart-seal asset**

```text
Use case: product-mockup
Asset type: transparent responsive website layer
Input image: Image 1 is a material and composition reference only
Primary request: isolated small antique-gold paper heart seal for a premium cream envelope
Style/medium: photorealistic handcrafted paper ornament, elegant rather than cute
Composition/framing: centred heart, straight-on, generous transparent margin
Lighting/mood: soft diffuse studio light
Color palette: muted antique gold and warm ochre
Materials/textures: pressed paper fibres, slight dimensional bevel, compact contact shadow
Constraints: genuinely transparent background; one heart only; no text; no logo; no watermark
Avoid: red or pink, wax stamp, cartoon heart, glitter, metallic shine, jewellery
```

- [ ] **Step 6: Inspect every generated output and persist selected files**

Use `view_image` on every output. Reject any image containing text, a non-transparent backdrop, mismatched lighting, or extra objects. Copy only selected outputs from their generated-image paths to the five exact project paths above; do not overwrite unrelated assets.

- [ ] **Step 7: Verify image dimensions and alpha channels**

Run:

```bash
node -e "const sharp=require('sharp'); const fs=require('fs'); const files=['gratitude-envelope-back-v1.png','gratitude-envelope-flap-v1.png','gratitude-envelope-pocket-v1.png','gratitude-letter-paper-v1.png','gratitude-heart-seal-v1.png']; Promise.all(files.map(async f=>{const p='public/images/success-stories/'+f; const m=await sharp(p).metadata(); if(!fs.existsSync(p)||m.format!=='png'||!m.hasAlpha||Math.max(m.width||0,m.height||0)<900) throw new Error(f+' must be a high-resolution transparent PNG'); console.log(f,m.width+'x'+m.height,'alpha='+m.hasAlpha)})).catch(e=>{console.error(e);process.exit(1)})"
```

Expected: five filenames, each at least 900px on its longest edge, each reporting `alpha=true`.

- [ ] **Step 8: Commit the selected asset set**

```bash
git add public/images/success-stories/gratitude-envelope-back-v1.png public/images/success-stories/gratitude-envelope-flap-v1.png public/images/success-stories/gratitude-envelope-pocket-v1.png public/images/success-stories/gratitude-letter-paper-v1.png public/images/success-stories/gratitude-heart-seal-v1.png
git commit -m "assets: add gratitude envelope paper layers"
```

---

### Task 2: Add Exact Unused Review-Note Data

**Files:**
- Create: `src/components/success-stories/gratitudeReviewNotes.ts`
- Create: `src/components/success-stories/GratitudeSection.test.mjs`

**Interfaces:**
- Consumes: `src/data/reviews.json` and `src/data/googleReviews.ts` as truth sources.
- Produces: `export type GratitudeReviewNote` and `export const gratitudeReviewNotes: readonly GratitudeReviewNote[]`.

- [ ] **Step 1: Write the failing review-data test**

Create `GratitudeSection.test.mjs` with:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const component = await readFile(new URL('./GratitudeSection.tsx', import.meta.url), 'utf8');
const css = await readFile(new URL('./GratitudeSection.css', import.meta.url), 'utf8');
const noteData = await readFile(new URL('./gratitudeReviewNotes.ts', import.meta.url), 'utf8');
const marqueeData = await readFile(new URL('../../data/googleReviews.ts', import.meta.url), 'utf8');
const source = JSON.parse(await readFile(new URL('../../data/reviews.json', import.meta.url), 'utf8'));

const expected = [
  ['Lisa Vu', 'I am now looking forward to a bright future'],
  ['Chau Ho', 'My English has improved significantly'],
  ['Florence Nguyen', 'it’s helped raise my grades tremendously !!'],
  ['Khushleen Kaur', 'I went from a 60% in math to a 97%.'],
  ['Harry Kha', 'They always had my back whenever I needed them'],
  ['Charlie Kien', 'They have made me believe in myself'],
];

test('uses six exact review fragments from reviewers absent from the marquee', () => {
  for (const [author, quote] of expected) {
    const sourceReview = source.reviews.find((review) => review.author === author);
    assert.ok(sourceReview?.text.includes(quote), `${author} quote must match source data`);
    assert.doesNotMatch(marqueeData, new RegExp(`author["']?:\\s*["']${author}["']`));
    assert.match(noteData, new RegExp(quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
```

- [ ] **Step 2: Run the test and confirm the missing-data failure**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs
```

Expected: FAIL because `gratitudeReviewNotes.ts` does not exist.

- [ ] **Step 3: Implement the static note data**

Create `gratitudeReviewNotes.ts`:

```ts
export type GratitudeReviewNote = {
  author: string;
  quote: string;
  initial: string;
  tone: 'gold' | 'sage' | 'rose' | 'blue' | 'lavender' | 'teal';
  position: 'upper-left' | 'middle-left' | 'lower-left' | 'upper-right' | 'middle-right' | 'lower-right';
  mobile: boolean;
};

export const gratitudeReviewNotes = [
  { author: 'Lisa Vu', quote: 'I am now looking forward to a bright future', initial: 'L', tone: 'gold', position: 'upper-left', mobile: true },
  { author: 'Chau Ho', quote: 'My English has improved significantly', initial: 'C', tone: 'sage', position: 'middle-left', mobile: true },
  { author: 'Florence Nguyen', quote: 'it’s helped raise my grades tremendously !!', initial: 'F', tone: 'rose', position: 'lower-left', mobile: false },
  { author: 'Khushleen Kaur', quote: 'I went from a 60% in math to a 97%.', initial: 'K', tone: 'blue', position: 'upper-right', mobile: true },
  { author: 'Harry Kha', quote: 'They always had my back whenever I needed them', initial: 'H', tone: 'lavender', position: 'middle-right', mobile: false },
  { author: 'Charlie Kien', quote: 'They have made me believe in myself', initial: 'C', tone: 'teal', position: 'lower-right', mobile: true },
] as const satisfies readonly GratitudeReviewNote[];
```

- [ ] **Step 4: Run the focused data test**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs
```

Expected: PASS for the exact-source and unused-author contract.

- [ ] **Step 5: Commit the verified note data**

```bash
git add src/components/success-stories/gratitudeReviewNotes.ts src/components/success-stories/GratitudeSection.test.mjs
git commit -m "test: lock gratitude review fragments"
```

---

### Task 3: Build the Accessible Envelope Interaction and Layer Contract

**Files:**
- Modify: `src/components/success-stories/GratitudeSection.test.mjs`
- Modify: `src/components/success-stories/GratitudeSection.tsx`

**Interfaces:**
- Consumes: `gratitudeReviewNotes` from Task 2 and the five asset paths from Task 1.
- Produces: one native overlay trigger with `aria-expanded`, reversible `isOpen` state, `.ss-gratitude__envelope-back`, `.ss-gratitude__letter`, `.ss-gratitude__flap`, `.ss-gratitude__pocket`, `.ss-gratitude__seal`, and `.ss-gratitude__close` markup. The trigger is a sibling of the semantic letter rather than an invalid button wrapper around an `<article>`.

- [ ] **Step 1: Extend the source contract test before changing the component**

Append:

```js
test('renders a reversible accessible layered envelope', () => {
  assert.match(component, /useState\(false\)/);
  assert.match(component, /type="button"/);
  assert.match(component, /aria-expanded=\{isOpen\}/);
  assert.match(component, /Open a thank-you note from DA Tuition/);
  assert.match(component, /Close the thank-you note from DA Tuition/);
  assert.match(component, /setIsOpen\(\(open\) => !open\)/);
  for (const className of ['envelope-back', 'letter', 'flap', 'pocket', 'seal', 'close']) {
    assert.match(component, new RegExp(`ss-gratitude__${className}`));
  }
});

test('keeps all letter wording as live text', () => {
  for (const text of [
    'These words mean',
    'more than you know.',
    "Thank you for trusting us with a small part of your child's journey.",
    'Every message, every review and every story of progress',
    "We're grateful to grow with you.",
  ]) assert.match(component, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
```

- [ ] **Step 2: Run the test and verify it fails on the old gratitude markup**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs
```

Expected: FAIL because the current component has no envelope state or layer classes.

- [ ] **Step 3: Replace the old gratitude markup with the semantic layer structure**

Implement `useState(false)`, import `gratitudeReviewNotes`, render six note `<li>` elements, and use this layer order inside the stage. The transparent native button overlays the envelope assembly so the semantic `<article>` is not nested inside a button:

```tsx
<div className="ss-gratitude__stage" data-open={isOpen}>
  <motion.span className="ss-gratitude__envelope-back" aria-hidden="true" />
  <motion.article className="ss-gratitude__letter" aria-labelledby="gratitude-heading">
    <p className="ss-gratitude__letter-label">A NOTE FROM DA</p>
    <h2 id="gratitude-heading"><span>These words mean</span><em>more than you know. ♡</em></h2>
    <p>Thank you for trusting us with a small part of your child's journey.</p>
    <p>Every message, every review and every story of progress reminds us that behind every lesson is a child finding a little more confidence, understanding and belief in themselves.</p>
    <p className="ss-gratitude__letter-signoff">We're grateful to grow with you. ♡</p>
  </motion.article>
  <motion.span className="ss-gratitude__flap" aria-hidden="true" />
  <motion.span className="ss-gratitude__pocket" aria-hidden="true" />
  <motion.span className="ss-gratitude__seal" aria-hidden="true" />
  <span className="ss-gratitude__address">To every family who has trusted us ♡</span>
  <span className="ss-gratitude__hint">Open our note →</span>
  <button
    type="button"
    className="ss-gratitude__trigger"
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close the thank-you note from DA Tuition' : 'Open a thank-you note from DA Tuition'}
    onClick={() => setIsOpen((open) => !open)}
  />
</div>
```

Render the explicit close control after the trigger and stop propagation so it closes without immediately toggling the parent trigger:

```tsx
<button type="button" className="ss-gratitude__close" aria-label="Close the thank-you note from DA Tuition" onClick={() => setIsOpen(false)}>↓</button>
```

- [ ] **Step 4: Add Framer Motion state variants**

Define module-level variants named `flapVariants`, `letterVariants`, `envelopeVariants`, `sealVariants`, and `noteVariants`. Use `custom={reduceMotion}` and `animate={isOpen ? 'open' : 'closed'}`. Keep the letter opaque in both states; use `y`, `scale`, and `rotate` rather than an opacity reveal. Use delays of approximately 0.15s for flap opening, 0.48s for letter movement, and `index * 0.08s` for notes. Reduced motion must return immediate geometry with a 0.18s opacity-only transition.

- [ ] **Step 5: Run the focused component contract tests**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 6: Commit the interaction markup**

```bash
git add src/components/success-stories/GratitudeSection.tsx src/components/success-stories/GratitudeSection.test.mjs
git commit -m "feat: add accessible gratitude envelope interaction"
```

---

### Task 4: Match the Reference Composition, Layering, and Responsive Motion

**Files:**
- Modify: `src/components/success-stories/GratitudeSection.test.mjs`
- Modify: `src/components/success-stories/GratitudeSection.css`

**Interfaces:**
- Consumes: exact class names and asset paths from Tasks 1 and 3.
- Produces: desktop and mobile geometry, strict z-index order, tactile hover/focus treatment, open composition, and reduced-motion fallback.

- [ ] **Step 1: Add failing CSS contract tests**

Append:

```js
test('uses the required envelope layer order and desktop sizes', () => {
  const expectedLayers = [
    ['envelope-back', '10'],
    ['letter', '20'],
    ['flap', '30'],
    ['pocket', '40'],
    ['seal', '50'],
  ];
  for (const [name, layer] of expectedLayers) {
    assert.match(css, new RegExp(`\\.ss-gratitude__${name}\\s*\\{[^}]*z-index:\\s*${layer}`, 's'));
  }
  assert.match(css, /\.ss-gratitude__stage\s*\{[^}]*perspective:\s*1000px/s);
  assert.match(css, /\.ss-gratitude__letter\s*\{[^}]*width:\s*clamp\(38\.75rem,\s*46vw,\s*43\.75rem\)/s);
  assert.match(css, /\.ss-gratitude__flap\s*\{[^}]*transform-origin:\s*top center/s);
});

test('preserves responsive and reduced-motion behavior', () => {
  assert.match(css, /@media \(max-width:\s*860px\)[\s\S]*?\.ss-gratitude__trigger\s*\{[^}]*width:\s*86vw/s);
  assert.match(css, /@media \(max-width:\s*860px\)[\s\S]*?\.ss-gratitude__letter\s*\{[^}]*width:\s*90vw/s);
  assert.match(css, /@media \(max-width:\s*860px\)[\s\S]*?\.ss-gratitude__note--desktop-only\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?transition-duration:\s*0\.01ms/s);
});
```

- [ ] **Step 2: Run the tests and confirm the CSS contract fails**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs
```

Expected: FAIL because the old gratitude CSS does not contain the envelope layers.

- [ ] **Step 3: Replace the old gratitude stylesheet**

Implement:

- `.ss-gratitude` as an isolated paper-toned stage with minimum desktop height sufficient for the 390px letter extraction.
- `.ss-gratitude__stage` at `perspective: 1000px`.
- `.ss-gratitude__trigger` at desktop width `min(58rem, 72vw)` and mobile width `86vw`.
- The strict z-index values asserted above.
- Layer backgrounds using the five generated asset URLs and `background-size: contain`.
- `.ss-gratitude__letter` width `clamp(38.75rem, 46vw, 43.75rem)` desktop and `90vw` mobile, with live copy padding that keeps every line inside the generated paper edges.
- Six positioned torn-paper note fragments, rotations between -3deg and +3deg, low closed-state opacity, and outward open-state variables.
- Hover/focus `translateY(-4px)`, compact shadow no more than 8px blur, visible gold focus ring, and one finite seal pulse.
- `.ss-gratitude__close` as a subtle 44px control available only in the open state.
- Mobile hiding for `.ss-gratitude__note--desktop-only`.
- Reduced-motion transitions with no continuous or 3D animation.

- [ ] **Step 4: Run focused and existing Success Stories tests**

Run:

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs src/components/success-stories/ReviewRibbonViewport.test.mjs src/components/success-stories/NoticeFlipCard.test.mjs src/components/success-stories/carouselNavigation.test.ts src/components/success-stories/noticeFlipInteraction.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Run static validation**

Run:

```bash
npm run typecheck
git diff --check
```

Expected: `git diff --check` exits 0. If `typecheck` still reports the known unrelated `primary-storybook` errors, confirm that none mention `GratitudeSection`, `gratitudeReviewNotes`, or their tests and record those unrelated failures in the handoff.

- [ ] **Step 6: Commit the reference-matched styling**

```bash
git add src/components/success-stories/GratitudeSection.css src/components/success-stories/GratitudeSection.test.mjs
git commit -m "style: match gratitude envelope reference"
```

---

### Task 5: Browser Interaction, Responsive, and Visual QA

**Files:**
- Modify only if QA exposes a scoped defect: `src/components/success-stories/GratitudeSection.tsx`
- Modify only if QA exposes a scoped defect: `src/components/success-stories/GratitudeSection.css`
- Modify only if a regression is discovered first: `src/components/success-stories/GratitudeSection.test.mjs`

**Interfaces:**
- Consumes: completed gratitude interaction from Tasks 1–4.
- Produces: verified mouse, keyboard, responsive, reduced-motion, console, and visual behavior.

- [ ] **Step 1: Start or reuse the Vite preview**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 8080
```

The flow under test is: `/success-stories` → scroll to the closed gratitude envelope → activate it by mouse and keyboard → letter emerges and notes settle → close control reverses the sequence.

- [ ] **Step 2: Validate the closed desktop state at 1440×900**

Using the in-app Browser, verify page title and URL, meaningful DOM content, no framework overlay, no relevant console warnings/errors, and capture a screenshot. Confirm the envelope is centred, the note fragments are secondary, no text is baked into assets, and the open hint is visible.

- [ ] **Step 3: Validate mouse opening and closing**

Click the envelope trigger. Confirm `aria-expanded` changes from `false` to `true`, the flap rotates, the letter travels physically upward without fading, the envelope moves down, all six notes spread outward, and the letter remains above the back but behind the front pocket. Click the close control and confirm `aria-expanded` returns to `false` only after the reverse sequence begins.

- [ ] **Step 4: Validate keyboard interaction**

Focus the envelope trigger. Press Enter, confirm open state and accessible label. Close, then press Space and confirm the same state change. Verify the focus ring is visible and the close control has at least a 44×44px hit area.

- [ ] **Step 5: Validate mobile at 390×844**

Set the browser viewport to 390×844, reload, and repeat open/close. Confirm envelope width is approximately 86vw, letter width is approximately 90vw, exactly four notes display, no horizontal overflow exists, and copy remains readable.

- [ ] **Step 6: Validate reduced motion**

Use browser emulation or a temporary read-only inspection to confirm the reduced-motion branch switches directly between the two compositions with a short opacity transition and no flap rotation or long letter travel.

- [ ] **Step 7: If QA finds a defect, reproduce it with a failing test before fixing**

Add the smallest assertion to `GratitudeSection.test.mjs`, run it and observe the intended failure, implement one scoped correction, rerun, then repeat the affected browser interaction. Do not bundle unrelated polishing.

- [ ] **Step 8: Run final verification**

```bash
node --test src/components/success-stories/GratitudeSection.test.mjs src/components/success-stories/ReviewRibbonViewport.test.mjs src/components/success-stories/NoticeFlipCard.test.mjs src/components/success-stories/carouselNavigation.test.ts src/components/success-stories/noticeFlipInteraction.test.ts
npm run typecheck
git diff --check
```

Expected: all focused tests and `git diff --check` pass. Report any unrelated pre-existing typecheck diagnostics verbatim and confirm whether any touch the gratitude files.

- [ ] **Step 9: Commit any QA-only correction**

If Task 5 changed files:

```bash
git add src/components/success-stories/GratitudeSection.tsx src/components/success-stories/GratitudeSection.css src/components/success-stories/GratitudeSection.test.mjs
git commit -m "fix: polish gratitude envelope interaction"
```

If no files changed, do not create an empty commit.
