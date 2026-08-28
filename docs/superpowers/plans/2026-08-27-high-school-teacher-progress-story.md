# High School Teacher and Progress Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated tutoring photo and two legacy lower-page blocks with one responsive editorial teacher-and-progress story matching the approved reference.

**Architecture:** A new `TeacherProgressStory` component will own the combined semantic layout and consume typed principle and milestone collections from `professionalJourneyData.ts`. Two generated raster assets provide only the tutoring scene and watercolor atmosphere; all copy, icons, medallions, connectors, and accessibility semantics remain code-native. The preceding method deck loses only its duplicate photograph, while the existing HSC bridge remains untouched.

**Tech Stack:** React 18, TypeScript, CSS, GSAP/ScrollTrigger, Lucide React, Node test runner, Sharp, Vite

**Spec:** `docs/superpowers/specs/2026-08-27-high-school-teacher-progress-story-design.md`

## Global Constraints

- Preserve the preceding method-card interaction and the following `HSCBridge` section.
- Do not bake headings, body copy, icons, milestone labels, or the DA Tuition logo into generated images.
- Generated assets must contain no text, logos, watermarks, or malformed stationery.
- Desktop uses a two-column upper story and horizontal five-step journey; mobile stacks content in semantic reading order.
- Faces, hands, and study materials must not be cropped at common viewport sizes.
- The section must not create a full viewport of blank cream space.
- Reduced-motion users receive complete static content.
- Preserve unrelated dirty-worktree changes and stage only files owned by each task.

---

## File Map

- Create `public/images/programs/high-school-professional/teacher-progress-tutoring-scene-v1.png`: generated source tutoring scene.
- Create `public/images/programs/high-school-professional/teacher-progress-tutoring-scene-v1-768w.{avif,webp}` and `teacher-progress-tutoring-scene-v1-1536w.{avif,webp}`: responsive tutoring formats.
- Create `public/images/programs/high-school-professional/teacher-progress-watercolor-frame-v1.png`: generated transparent atmosphere source.
- Create `public/images/programs/high-school-professional/teacher-progress-watercolor-frame-v1-768w.{avif,webp}` and `teacher-progress-watercolor-frame-v1-1536w.{avif,webp}`: responsive atmosphere formats.
- Create `scripts/optimize-high-school-teacher-progress-assets.mjs`: deterministic Sharp conversion for the two approved assets.
- Modify `src/components/programs/high-school-professional/professionalJourneyData.ts`: exact four principles and five milestones.
- Modify `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx`: new combined component and composition order.
- Modify `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`: editorial desktop/tablet/mobile presentation.
- Modify `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`: structural, copy, responsive-asset, and legacy-removal coverage.
- Modify `src/components/programs/high-school-method-transition/MethodTeachingDeck.tsx`: remove the duplicate end-of-deck photograph.
- Modify `src/components/programs/high-school-method-transition/MethodTeachingDeck.css`: remove orphan photograph rules.
- Modify `src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs`: remove obsolete support-asset expectations and assert the method deck ends without the duplicate photograph.

---

### Task 1: Generate and optimize the two editorial assets

**Files:**
- Create: `public/images/programs/high-school-professional/teacher-progress-tutoring-scene-v1.png`
- Create: `public/images/programs/high-school-professional/teacher-progress-watercolor-frame-v1.png`
- Create: `scripts/optimize-high-school-teacher-progress-assets.mjs`
- Create: responsive AVIF/WebP variants listed in the file map

**Interfaces:**
- Consumes: the approved reference image as composition/style guidance only.
- Produces: two 1536px-wide PNG source assets and four responsive delivery variants per asset.

- [ ] **Step 1: Generate the tutoring scene with the built-in image generator**

Use this exact structured prompt and treat the user’s second screenshot as a style/composition reference, not an edit target:

```text
Use case: photorealistic-natural
Asset type: wide editorial website photograph for a tutoring story
Primary request: A warm, candid high-school tutoring moment: an attentive female tutor seated beside a teenage male student as he writes in an open workbook, both collaborating naturally rather than posing.
Scene/backdrop: softly lit contemporary study room, understated books and plant shapes in the distance, edges dissolving into cream paper and pale sage watercolor.
Subject: one adult female tutor and one teenage male student, realistic hands, realistic study materials, supportive expressions.
Style/medium: premium natural editorial photography blended subtly with watercolor at the outer edges.
Composition/framing: 3:2 landscape; people and workbook concentrated in the left and center; preserve breathing room around all heads, hands, and the complete open workbook; softly feather every outer edge for layering on cream.
Lighting/mood: warm window light, calm, trusting, academically focused.
Color palette: cream, warm neutral skin tones, charcoal, forest green, muted sage, restrained antique gold sparks.
Constraints: no text, no logo, no watermark, no school crest, no cropped face, no cropped hands, no cropped workbook.
Avoid: extra fingers, duplicate stationery, glamour posing, harsh studio light, oversaturated color, fake brand marks.
```

Save the selected output into the project as `teacher-progress-tutoring-scene-v1.png`.

- [ ] **Step 2: Generate the transparent watercolor atmosphere with the built-in image generator**

```text
Use case: stylized-concept
Asset type: transparent editorial background overlay for a website section
Primary request: An airy watercolor frame inspired by an elegant cream-paper education editorial: muted sage and deep forest-green washes concentrated at the upper-left and lower-right outer edges, faint warm beige clouds elsewhere, delicate antique-gold contour curves, tiny restrained gold sparkles, and a wide clear center for readable content.
Style/medium: high-resolution hand-painted watercolor and fine metallic ink on a genuinely transparent background.
Composition/framing: 3:2 landscape; decoration stays within the outer 28 percent; center and upper-right remain mostly transparent; no hard rectangular edge.
Color palette: cream-adjacent transparency, sage, forest green, warm beige, antique gold.
Constraints: actual alpha transparency; no text, no icons, no logo, no watermark, no people.
Avoid: dense center, dark opaque blocks, neon green, repeated clip-art leaves, excessive sparkles.
```

Save the selected output as `teacher-progress-watercolor-frame-v1.png` and verify the PNG has an alpha channel.

- [ ] **Step 3: Inspect both outputs**

Use the local image viewer at original detail. Reject and regenerate only if the tutor asset crops a face/hand/workbook, contains malformed anatomy or branding, or if the atmosphere lacks transparency or obscures the content-safe center.

- [ ] **Step 4: Add the deterministic Sharp optimizer**

Create `scripts/optimize-high-school-teacher-progress-assets.mjs` with:

```js
import sharp from 'sharp';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = resolve(projectRoot, 'public/images/programs/high-school-professional');
const assets = [
  'teacher-progress-tutoring-scene-v1',
  'teacher-progress-watercolor-frame-v1',
];

for (const asset of assets) {
  const input = resolve(assetRoot, `${asset}.png`);
  for (const width of [768, 1536]) {
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 72, effort: 6 }).toFile(resolve(assetRoot, `${asset}-${width}w.avif`));
    await pipeline.clone().webp({ quality: 84, alphaQuality: 95 }).toFile(resolve(assetRoot, `${asset}-${width}w.webp`));
  }
}
```

- [ ] **Step 5: Generate and verify responsive outputs**

Run:

```bash
node scripts/optimize-high-school-teacher-progress-assets.mjs
node -e "import('sharp').then(async ({default: sharp}) => { for (const name of ['teacher-progress-tutoring-scene-v1.png','teacher-progress-watercolor-frame-v1.png']) { const m = await sharp('public/images/programs/high-school-professional/' + name).metadata(); console.log(name, m.width, m.height, m.hasAlpha); } })"
```

Expected: both sources report practical web dimensions; the atmosphere reports `hasAlpha true`; all eight optimized files exist.

- [ ] **Step 6: Commit only generated asset work**

```bash
git add public/images/programs/high-school-professional/teacher-progress-* scripts/optimize-high-school-teacher-progress-assets.mjs
git commit -m "feat: add teacher progress editorial assets"
```

---

### Task 2: Define the combined story contract with failing tests

**Files:**
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`
- Modify: `src/components/programs/high-school-professional/professionalJourneyData.ts`

**Interfaces:**
- Produces: `supportPrinciples` with four `{ title, description, Icon }` entries and `milestones` with five `{ title, description, Icon }` entries.
- Consumes: Lucide icon components.

- [ ] **Step 1: Replace the legacy composition test with the combined-section contract**

Add assertions equivalent to:

```js
test('composes one teacher progress story between methods and the HSC bridge', () => {
  assert.match(feature, /export function TeacherProgressStory/);
  assert.match(feature, /<MethodTransition\s*\/>\s*<TeacherProgressStory\s*\/>\s*<HSCBridge\s*\/>/);
  assert.doesNotMatch(feature, /<TeacherSupport/);
  assert.doesNotMatch(feature, /<ProgressJourney/);
});

test('keeps the approved story and journey copy in semantic markup', () => {
  for (const copy of [
    'Your teacher beside you.',
    'Not teaching at you.',
    'Working with you.',
    'The progress we build together',
    'Progress you can see.',
    'Independence they can feel.',
    'We prepare for what comes next.',
  ]) assert.match(feature, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
```

Add data-file loading and assert the four exact principle titles and five exact milestone titles from the specification.

- [ ] **Step 2: Add responsive-asset and accessibility assertions**

Assert the component contains `<picture>`, AVIF and WebP sources, explicit image dimensions, descriptive photograph `alt`, a decorative atmosphere with `aria-hidden="true"`, and a semantic `<ol>` for milestones.

- [ ] **Step 3: Run the focused test and confirm failure**

Run:

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
```

Expected: FAIL because `TeacherProgressStory` and the new copy do not exist.

- [ ] **Step 4: Update typed content data**

Set the four principle titles/descriptions to:

```ts
export const supportPrinciples = [
  { title: 'Questions encouraged', description: 'There’s always room to ask.', Icon: CircleHelp },
  { title: 'Mistakes noticed', description: 'Before they become gaps.', Icon: Eye },
  { title: 'Feedback happens here', description: 'Specific. Immediate. Personal.', Icon: MessageSquareText },
  { title: 'Weaknesses addressed', description: 'So confidence can grow.', Icon: Sprout },
] as const;
```

Set the five milestone titles/descriptions to:

```ts
export const milestones = [
  { title: 'Foundations', description: 'Strong understanding of the basics.', Icon: Sprout },
  { title: 'Study habits', description: 'Better routines. Better focus.', Icon: LibraryBig },
  { title: 'Independence', description: 'Thinking for themselves.', Icon: Flag },
  { title: 'Confidence', description: 'They know they can do it.', Icon: Star },
  { title: 'Readiness', description: 'Ready for assessments, ready for what’s next.', Icon: Trophy },
] as const;
```

- [ ] **Step 5: Re-run the focused test**

Expected: it still fails only on the not-yet-created component contract, while data assertions pass.

- [ ] **Step 6: Commit the test and content contract**

```bash
git add src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs src/components/programs/high-school-professional/professionalJourneyData.ts
git commit -m "test: define teacher progress story contract"
```

---

### Task 3: Implement the semantic `TeacherProgressStory` component

**Files:**
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx`
- Test: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

**Interfaces:**
- Consumes: `supportPrinciples`, `milestones`, and the six responsive tutoring/atmosphere asset URLs.
- Produces: exported `TeacherProgressStory(): JSX.Element` rendered once between `MethodTransition` and `HSCBridge`.

- [ ] **Step 1: Replace legacy icon imports and asset constants**

Remove `Check` and `Users`. Add constants for PNG, AVIF, and WebP variants for both generated assets under `/images/programs/high-school-professional/`.

- [ ] **Step 2: Replace `TeacherSupport` and `ProgressJourney` with one component**

Implement this semantic skeleton:

```tsx
export function TeacherProgressStory() {
  return (
    <section className="hsp-story" ref={useSectionReveal()} aria-labelledby="hsp-story-title">
      <picture className="hsp-story__atmosphere" aria-hidden="true">{/* responsive decorative sources */}</picture>
      <div className="hsp-story__upper">
        <figure className="hsp-story__photo" data-reveal>{/* responsive tutoring picture */}</figure>
        <div className="hsp-story__support" data-reveal>
          <h2 id="hsp-story-title">Your teacher<br />beside you.</h2>
          <p className="hsp-story__support-accent"><em>Not teaching at you.</em><br />Working with you.</p>
          <div className="hsp-story__principles">{/* four articles */}</div>
          <p className="hsp-story__note">Someone who knows<br />how you learn. ♡</p>
        </div>
      </div>
      <div className="hsp-story__journey" data-reveal>
        <header>{/* eyebrow and split serif headline */}</header>
        <ol>{/* five milestones with icon medallions and labels */}</ol>
        <p className="hsp-story__closing">We don’t just prepare for the next test.<br /><em>We prepare for what comes next.</em></p>
      </div>
    </section>
  );
}
```

Each principle article renders its icon with `aria-hidden="true"`; each milestone icon is decorative because its adjacent heading supplies the name.

- [ ] **Step 3: Update the exported composition**

Set the default component to:

```tsx
export default function HighSchoolProfessionalJourney() {
  return <div className="hs-professional"><MethodTransition /><TeacherProgressStory /><HSCBridge /></div>;
}
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
```

Expected: PASS for component structure, copy, data, image formats, and accessibility assertions.

- [ ] **Step 5: Commit semantic implementation**

```bash
git add src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx
git commit -m "feat: combine teacher support and progress story"
```

---

### Task 4: Remove the duplicate method-deck photograph

**Files:**
- Modify: `src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs`
- Modify: `src/components/programs/high-school-method-transition/MethodTeachingDeck.tsx`
- Modify: `src/components/programs/high-school-method-transition/MethodTeachingDeck.css`

**Interfaces:**
- Preserves: `MethodTeachingDeck({ ready }: { ready: boolean })` and every card-selection behavior.
- Removes: `TUTOR_PHOTOGRAPH*` constants and `.hsm-deck__photograph` markup/styles only.

- [ ] **Step 1: Write the duplicate-removal test**

Add:

```js
test('ends the method deck without duplicating the following tutoring story', () => {
  assert.doesNotMatch(deckSource, /TUTOR_PHOTOGRAPH/);
  assert.doesNotMatch(deckSource, /hsm-deck__photograph/);
  assert.doesNotMatch(deckStyles, /\.hsm-deck__photograph/);
});
```

Remove `how-we-teach-tutor-student-v1` from `SUPPORT_BASES`, keeping the botanical atmosphere optimization coverage.

- [ ] **Step 2: Run the deck test and confirm failure**

Run:

```bash
node --test src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs
```

Expected: FAIL because the photograph constants, figure, and CSS still exist.

- [ ] **Step 3: Remove only the duplicate photograph implementation**

Delete the five `TUTOR_PHOTOGRAPH*` constants, the `<figure className="hsm-deck__photograph">` block, and all `.hsm-deck__photograph` CSS rules. Do not change the botanical atmosphere, card interaction, Flip choreography, detail panel, or method data.

- [ ] **Step 4: Re-run deck tests**

Expected: all deck tests pass, including runtime selection and reduced-motion tests.

- [ ] **Step 5: Commit the bounded cleanup**

```bash
git add src/components/programs/high-school-method-transition/MethodTeachingDeck.tsx src/components/programs/high-school-method-transition/MethodTeachingDeck.css src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs
git commit -m "fix: remove duplicate tutoring photograph"
```

---

### Task 5: Style the reference-like editorial composition

**Files:**
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Test: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

**Interfaces:**
- Consumes: the `hsp-story__*` class contract from Task 3.
- Produces: desktop, tablet, mobile, reduced-motion, and print-safe visual states.

- [ ] **Step 1: Add CSS contract assertions before styling**

Load the stylesheet in the focused test and assert:

```js
assert.match(styles, /\.hsp-story__upper\s*\{[\s\S]*grid-template-columns:/);
assert.match(styles, /\.hsp-story__principles\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,/);
assert.match(styles, /\.hsp-story__journey ol\s*\{[\s\S]*grid-template-columns:\s*repeat\(5,/);
assert.match(styles, /@media\(max-width:700px\)[\s\S]*\.hsp-story__upper[\s\S]*grid-template-columns:\s*1fr/);
assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
```

- [ ] **Step 2: Run the test and confirm failure**

Expected: FAIL because the new CSS selectors do not exist.

- [ ] **Step 3: Replace legacy support/progress rules with story foundations**

Implement `.hsp-story` as a centered `width:min(96vw,1480px)` cream-paper section with `isolation:isolate`, controlled padding, and no large fixed `min-height`. Position `.hsp-story__atmosphere` absolutely behind content with `object-fit:cover`, full bounds, and restrained opacity.

- [ ] **Step 4: Implement the upper editorial layout**

Use a `minmax(0,1.08fr) minmax(360px,.92fr)` grid. Give the photograph a stable landscape aspect ratio and `object-fit:contain` or a safe `cover` crop with centered faces/hands. Style the right headline in Libre Baskerville, the accent in gold/forest italic serif, and the four principles as equal compact columns with thin green line icons.

- [ ] **Step 5: Implement the connected milestone journey**

Use a five-column list with a pseudo-element gold connector behind it. Each milestone gets a cream/gold circular medallion, 44–52px Lucide icon, concise heading, and short copy. Place the closing statement below the track with the second sentence in gold italic serif.

- [ ] **Step 6: Implement tablet, mobile, and reduced-motion states**

At 1000px, wrap principles to two columns and reduce decorative density. At 700px, stack the upper grid, show the complete photograph, stack milestones as a vertical path, and remove any absolute offsets that create blank space. Under `prefers-reduced-motion: reduce`, force `[data-reveal]` opacity/transform to final static values.

- [ ] **Step 7: Run focused tests and scoped lint**

Run:

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
npx eslint src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx src/components/programs/high-school-professional/professionalJourneyData.ts
```

Expected: PASS with no lint errors.

- [ ] **Step 8: Commit presentation work**

```bash
git add src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
git commit -m "style: match teacher progress editorial reference"
```

---

### Task 6: Visual QA, accessibility, and production verification

**Files:**
- Modify only if QA reveals a scoped defect in the files listed above.

**Interfaces:**
- Consumes: completed combined section and responsive assets.
- Produces: verified desktop/mobile/reduced-motion behavior with no regressions to the method deck or HSC bridge.

- [ ] **Step 1: Run all focused feature tests**

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
node --test src/components/programs/high-school-method-transition/MethodTeachingDeck.test.mjs
node --test --experimental-strip-types src/components/programs/high-school-method-transition/methodTeachingDeckState.test.ts
```

Expected: all tests pass.

- [ ] **Step 2: Run scoped static checks**

```bash
npx eslint src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx src/components/programs/high-school-professional/professionalJourneyData.ts src/components/programs/high-school-method-transition/MethodTeachingDeck.tsx
npx tsc --noEmit -p tsconfig.app.json
git diff --check
```

Expected: no errors attributable to these files and no whitespace errors.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 4: Inspect desktop rendering**

Start the existing Vite app and inspect `/programs/high-school` at 1440×900. Verify the method deck flows directly into the combined story, the complete tutor scene is visible without a blank viewport, the four principles remain readable, all five milestones share one connected path, and the HSC bridge follows without duplicated legacy blocks.

- [ ] **Step 5: Inspect mobile and reduced-motion rendering**

Inspect at 390×844 with and without `prefers-reduced-motion: reduce`. Verify no horizontal overflow, no cropped faces/hands/workbook, a logical stacked reading order, complete static content, and no transform-created blank space.

- [ ] **Step 6: Check contrast and semantics**

Confirm body copy reaches WCAG AA against cream, heading order contains one section `h2` followed by principle/milestone `h3` elements, decorative artwork is hidden from assistive technology, and the photograph has descriptive alternative text.

- [ ] **Step 7: Commit any QA-only corrections**

Stage only the affected High School feature files:

```bash
git add src/components/programs/high-school-professional src/components/programs/high-school-method-transition public/images/programs/high-school-professional scripts/optimize-high-school-teacher-progress-assets.mjs
git commit -m "fix: polish teacher progress responsive layout"
```

Skip this commit if QA required no changes.
