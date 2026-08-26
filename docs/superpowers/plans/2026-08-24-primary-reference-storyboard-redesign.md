# Primary Reference Storyboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every section below the existing Primary School hero into the approved illustrated editorial journey, with newly generated matching assets and preserved interactive aquarium behavior.

**Architecture:** Keep the existing hero boundary in `PrimarySchool.tsx`, but move the post-hero journey into focused components under `src/features/primary-storybook/`. Generate and validate the complete raster asset pack before any component work; then compose authentic DA photographs, HTML copy, Pixi aquarium layers, and GSAP choreography from typed data.

**Tech Stack:** React 18, TypeScript, Vite, GSAP + ScrollTrigger + MotionPathPlugin, PixiJS, CSS, Node test runner, built-in ChatGPT ImageGen.

**Spec:** `docs/superpowers/specs/2026-08-24-primary-reference-storyboard-redesign.md`

## Global Constraints

- Do not modify the navbar or current Primary School hero.
- Begin the redesign immediately after the hero and preserve `/programs/primary-school`.
- Finish, inspect, and save the complete generated asset pack before editing page implementation.
- Use the supplied storyboard as the primary reference for proportion, density, hierarchy, and composition.
- Use authentic DA photographs; never generate replacement classroom photography.
- Keep important copy as accessible HTML; generated assets contain no text or invented branding.
- Preserve all aquarium behavior and accessible fish controls.
- Respect `prefers-reduced-motion` and pause expensive off-screen animation.
- Mobile must retain the aquarium, program bag, real photographs, and curriculum without horizontal overflow.

---

### Task 1: Generate and validate the complete storyboard asset pack

**Files:**
- Create: `public/primary-reference/decor/foundations-crayon-set.png`
- Create: `public/primary-reference/decor/curriculum-house-set.png`
- Create: `public/primary-reference/decor/how-we-teach-path-set.png`
- Create: `public/primary-reference/decor/growth-crayon-set.png`
- Create: `public/primary-reference/decor/mastery-crayon-set.png`
- Create: `public/primary-reference/decor/program-helper-icons.png`
- Create: `public/primary-reference/decor/family-icons.png`
- Create: `public/primary-reference/aquarium/water-background.png`
- Create: `public/primary-reference/aquarium/distant-reef.png`
- Create: `public/primary-reference/aquarium/midground-reef.png`
- Create: `public/primary-reference/aquarium/foreground-reef.png`
- Create: `public/primary-reference/aquarium/bubbles.png`
- Create: `public/primary-reference/aquarium/fish/{clownfish,blue-tang,yellow-tang,pufferfish,seahorse,reef-fish,starfish}.png`
- Create: `public/primary-reference/programs/da-schoolbag.png`
- Create: `public/primary-reference/programs/small-group-notebook.png`
- Create: `public/primary-reference/programs/private-tuition-pencil-case.png`
- Create: `public/primary-reference/programs/creative-writing-book.png`
- Create: `public/primary-reference/journey/closing-landscape.png`
- Create: `src/features/primary-storybook/primaryAssetManifest.ts`
- Test: `src/features/primary-storybook/primaryAssets.test.ts`

**Interfaces:**
- Consumes: supplied storyboard image as the visual reference; official logo remains `/images/da-logo.png` and is not an ImageGen input.
- Produces: `primaryAssetManifest: Readonly<Record<string, string>>` and the complete project-local raster pack.

- [ ] **Step 1: Write the failing asset-manifest test**

```ts
test('reference storyboard asset pack is complete and project local', () => {
  const required = ['foundations', 'curriculumHouse', 'aquariumWater', 'schoolbag', 'smallGroup', 'privateTuition', 'creativeWriting', 'closingLandscape'];
  required.forEach((key) => assert.match(primaryAssetManifest[key], /^\/primary-reference\//));
  Object.values(primaryAssetManifest).forEach((url) => assert.equal(existsSync(join(publicDir, url)), true));
});
```

- [ ] **Step 2: Run the test and verify it fails because the manifest and generated files do not exist**

Run: `node --test --experimental-strip-types src/features/primary-storybook/primaryAssets.test.ts`

- [ ] **Step 3: Generate every distinct asset with the built-in ImageGen tool**

Use one call per distinct asset or cohesive transparent sprite sheet. Every prompt must identify the supplied storyboard as the style/composition reference and include: coloured-pencil/crayon texture, warm cream-compatible palette, soft handmade irregularity, no text, no watermark, no invented logo. Use transparent backgrounds for decoration sheets, fish, and program objects; use wide opaque compositions for aquarium layers and closing landscape.

The program objects must be generated separately so hover/focus/tap animations can move them independently. The aquarium must use separate depth layers so PixiJS retains parallax, displacement, and creature animation.

- [ ] **Step 4: Inspect every output at original detail**

Reject and regenerate any output with clipped subjects, illegible embedded marks, false transparency, mismatched medium, unwanted text, watermark, or incompatible perspective. Confirm the four program objects visually belong to one schoolbag composition.

- [ ] **Step 5: Copy accepted outputs into `public/primary-reference/` without overwriting the existing `public/primary/` assets**

Preserve alpha channels. Use descriptive final filenames listed above.

- [ ] **Step 6: Create the typed manifest with exact public URLs**

```ts
export const primaryAssetManifest = {
  foundations: '/primary-reference/decor/foundations-crayon-set.png',
  curriculumHouse: '/primary-reference/decor/curriculum-house-set.png',
  aquariumWater: '/primary-reference/aquarium/water-background.png',
  schoolbag: '/primary-reference/programs/da-schoolbag.png',
  smallGroup: '/primary-reference/programs/small-group-notebook.png',
  privateTuition: '/primary-reference/programs/private-tuition-pencil-case.png',
  creativeWriting: '/primary-reference/programs/creative-writing-book.png',
  closingLandscape: '/primary-reference/journey/closing-landscape.png',
} as const;
```

- [ ] **Step 7: Run the asset test and confirm it passes**

Run: `node --test --experimental-strip-types src/features/primary-storybook/primaryAssets.test.ts`

- [ ] **Step 8: Commit the complete asset pack before starting Task 2**

```bash
git add public/primary-reference src/features/primary-storybook/primaryAssetManifest.ts src/features/primary-storybook/primaryAssets.test.ts
git commit -m "assets: add primary reference storyboard pack"
```

### Task 2: Establish typed story data and the preserved hero boundary

**Files:**
- Create: `src/features/primary-storybook/referenceStoryData.ts`
- Create: `src/features/primary-storybook/PrimaryReferenceStory.tsx`
- Modify: `src/pages/programs/PrimarySchool.tsx`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: `primaryAssetManifest` from Task 1 and existing real-photo paths.
- Produces: `PrimaryReferenceStory`, `foundationOutcomes`, `curriculumBands`, `teachingSteps`, `programChoices`, `familyReasons`.

- [ ] **Step 1: Add failing source tests for the exact ten-section order and unchanged hero boundary**

```ts
const ordered = ['<FoundationSection', '<FoundationCurriculum', '<HowWeTeach', '<GrowthSection', '<GrowthCurriculum', '<MasterySection', '<MasteryCurriculum', '<ProgramBag', '<FamilyReasons', '<PrimaryJourneyOutro'];
ordered.reduce((cursor, marker) => {
  const next = source.indexOf(marker);
  assert.ok(next > cursor, `${marker} must follow the previous section`);
  return next;
}, -1);
assert.match(pageSource, /<JourneyHero[\s\S]*<PrimaryReferenceStory/);
```

- [ ] **Step 2: Run the test and verify the new story component requirement fails**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts`

- [ ] **Step 3: Add typed content records with the exact approved copy and authentic DA photo paths**

Use `as const satisfies` records so section components cannot silently omit outcomes or program choices.

- [ ] **Step 4: Add `PrimaryReferenceStory` with semantic section order and replace only the existing post-hero story invocation**

Do not edit hero props, navbar rendering, route registration, or consultation URL.

- [ ] **Step 5: Run the story source tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts && npm run typecheck`

- [ ] **Step 6: Commit the story architecture**

```bash
git add src/pages/programs/PrimarySchool.tsx src/features/primary-storybook
git commit -m "refactor: establish primary reference story"
```

### Task 3: Build Foundations, curriculum-aquarium, and How We Teach

**Files:**
- Create: `src/features/primary-storybook/FoundationSection.tsx`
- Create: `src/features/primary-storybook/FoundationCurriculum.tsx`
- Create: `src/features/primary-storybook/HowWeTeach.tsx`
- Modify: `src/features/primary-storybook/PrimaryAquarium.tsx`
- Modify: `src/features/primary-storybook/useAquariumEngine.ts`
- Modify: `src/features/primary-storybook/primaryStoryData.ts`
- Create: `src/features/primary-storybook/primary-reference.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: Task 1 assets and Task 2 typed data.
- Produces: the complete Years 1–2 and four-step teaching sequence; aquarium public API remains `PrimaryAquarium(): JSX.Element`.

- [ ] **Step 1: Add failing tests for foundation copy, four authentic photo steps, and all aquarium controls**

Assert the source contains the four required outcome labels, four `teachingSteps.map` photo moments, seven fish buttons, reduced-motion query, pointer movement, ripple pool, bubble pool, and discovery progress.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts src/features/primary-storybook/waterEffects.test.ts src/features/primary-storybook/aquariumPhysics.test.ts`

- [ ] **Step 3: Implement the asymmetric foundation scrapbook composition**

Use three semantic columns on desktop, irregular `clip-path`/paper edge for the authentic photo, and generated doodle sheets as `aria-hidden` decoration. Avoid outcome cards.

- [ ] **Step 4: Implement the 38/62 curriculum-aquarium composition**

Update aquarium texture URLs to Task 1 assets while retaining Pixi layers, continuous cursor wake, fish steering, click ripple/bubbles, fact state, discovery stars, and keyboard buttons.

- [ ] **Step 5: Implement the four-step teaching sequence with real DA photos**

Each figure contains a real photo, numbered heading, and caption. Connect them with one decorative path layer rather than four boxed cards.

- [ ] **Step 6: Add responsive CSS for desktop, tablet, and mobile**

At mobile width, stack foundations and teaching moments, retain full aquarium interaction, hide only secondary doodles, and ensure `scrollWidth === clientWidth`.

- [ ] **Step 7: Run focused tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts src/features/primary-storybook/waterEffects.test.ts src/features/primary-storybook/aquariumPhysics.test.ts && npm run typecheck`

- [ ] **Step 8: Commit Years 1–2 and How We Teach**

```bash
git add src/features/primary-storybook
git commit -m "feat: rebuild primary foundations journey"
```

### Task 4: Build Years 3–4 and Years 5–6 editorial sections

**Files:**
- Create: `src/features/primary-storybook/GrowthSection.tsx`
- Create: `src/features/primary-storybook/GrowthCurriculum.tsx`
- Create: `src/features/primary-storybook/MasterySection.tsx`
- Create: `src/features/primary-storybook/MasteryCurriculum.tsx`
- Modify: `src/features/primary-storybook/primary-reference.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: growth/mastery asset sheets and typed data.
- Produces: four responsive section components with authentic photo figures and curriculum lists.

- [ ] **Step 1: Add failing tests for all required Years 3–4 and Years 5–6 copy and photo paths**

- [ ] **Step 2: Run the story test and verify failure**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts`

- [ ] **Step 3: Implement the compact Years 3–4 composition**

Arrange heading/copy left, irregular group photograph center, and four unboxed outcomes plus curriculum right, using sage and blue crayon accents.

- [ ] **Step 4: Implement the slightly more mature Years 5–6 composition**

Use dusty blue, academic doodles, a larger authentic classroom photo, four outcomes, and the complete curriculum copy. Do not omit this stage on any breakpoint.

- [ ] **Step 5: Add responsive styling and reduced decorative density below 900px**

- [ ] **Step 6: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts && npm run typecheck`

- [ ] **Step 7: Commit the upper-primary stages**

```bash
git add src/features/primary-storybook
git commit -m "feat: add growth and mastery story sections"
```

### Task 5: Build the interactive DA program schoolbag

**Files:**
- Create: `src/features/primary-storybook/ProgramBag.tsx`
- Create: `src/features/primary-storybook/programSelection.ts`
- Create: `src/features/primary-storybook/programSelection.test.ts`
- Modify: `src/features/primary-storybook/primary-reference.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: `programChoices` and four separate program assets.
- Produces: `selectProgram(currentId, nextId): ProgramId` and an accessible `ProgramBag` radiogroup-like interaction.

- [ ] **Step 1: Write failing unit tests for stable selection and keyboard-visible program controls**

```ts
test('selecting a program makes exactly that object dominant', () => {
  assert.equal(selectProgram('small-group', 'private-tuition'), 'private-tuition');
});
```

Source tests require three native buttons, `aria-pressed`, official `/images/da-logo.png`, and no generated logo inside image paths.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test --experimental-strip-types src/features/primary-storybook/programSelection.test.ts src/features/primary-storybook/PrimaryStorybook.test.ts`

- [ ] **Step 3: Implement helper copy and decision list as HTML**

- [ ] **Step 4: Compose the separate bag and program objects**

The bag remains stationary. Hover/focus/tap translates only the selected object about `-14px`, increases its local shadow, and lowers sibling emphasis. Overlay the official crest separately on the bag.

- [ ] **Step 5: Implement mobile tap layout and visible keyboard focus**

Keep the bag first, then place the three program controls in an overlapping but non-clipped vertical composition with targets at least 44px.

- [ ] **Step 6: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/programSelection.test.ts src/features/primary-storybook/PrimaryStorybook.test.ts && npm run typecheck`

- [ ] **Step 7: Commit the program-bag interaction**

```bash
git add src/features/primary-storybook
git commit -m "feat: add interactive primary program bag"
```

### Task 6: Add family strip, final landscape, and coordinated motion

**Files:**
- Create: `src/features/primary-storybook/FamilyReasons.tsx`
- Modify: `src/features/primary-storybook/PrimaryJourneyOutro.tsx`
- Create: `src/features/primary-storybook/usePrimaryReferenceMotion.ts`
- Modify: `src/features/primary-storybook/PrimaryReferenceStory.tsx`
- Modify: `src/features/primary-storybook/primary-reference.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: family icon strip, closing landscape, section markers, and GSAP plugins already used by the project.
- Produces: `usePrimaryReferenceMotion(rootRef: RefObject<HTMLElement>): void` with complete GSAP context cleanup.

- [ ] **Step 1: Add failing tests for family reasons, final CTA copy/links, GSAP cleanup, and reduced motion**

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts`

- [ ] **Step 3: Implement the thin unboxed four-column family strip**

- [ ] **Step 4: Rebuild the final CTA over the generated landscape**

Use HTML heading, subtext, primary consultation link, and secondary “See How It Works” link. Keep the ending calm and visually connected to the hero landscape.

- [ ] **Step 5: Implement scoped GSAP choreography**

Use `gsap.context` and `matchMedia`. Sequence scrapbook placement, path drawing, and program-object entrance. Do not gate default content visibility on JavaScript. On reduced motion, apply final states immediately. Revert the GSAP context on cleanup.

- [ ] **Step 6: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts && npm run typecheck`

- [ ] **Step 7: Commit the connected journey motion**

```bash
git add src/features/primary-storybook
git commit -m "feat: complete primary reference journey"
```

### Task 7: Perform production and visual verification

**Files:**
- Modify only if verification reveals an in-scope defect.

**Interfaces:**
- Consumes: completed page and approved storyboard.
- Produces: verified desktop/tablet/mobile experience with documented build blockers if unrelated repository work prevents a full build.

- [ ] **Step 1: Run all targeted tests and typecheck**

Run: `node --test --experimental-strip-types src/features/primary-storybook/*.test.ts && npm run typecheck`

- [ ] **Step 2: Run the production build**

Run: `npm run build`

If the build fails in an unrelated dirty-worktree file, preserve that work and report the exact external blocker rather than changing it.

- [ ] **Step 3: Start the Vite server and inspect the actual route**

Run: `npm run dev -- --host 127.0.0.1`

- [ ] **Step 4: Browser-test desktop, tablet, and 390×844 mobile**

Verify hero/navbar unchanged, all sections present, no overflow, aquarium movement/click/facts, program hover/click/keyboard behavior, authentic images loaded, and no console errors.

- [ ] **Step 5: Compare side-by-side with the supplied storyboard**

Adjust only measurable discrepancies in section height, column ratio, heading scale, photo prominence, cream consistency, crayon density, bag dominance, and closing-landscape pacing.

- [ ] **Step 6: Re-run the full verification commands after the final adjustment**

- [ ] **Step 7: Commit final QA corrections**

```bash
git add src/features/primary-storybook src/pages/programs/PrimarySchool.tsx
git commit -m "fix: polish primary reference composition"
```

