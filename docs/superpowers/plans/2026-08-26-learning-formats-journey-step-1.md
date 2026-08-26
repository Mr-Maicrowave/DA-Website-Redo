# Learning Formats Journey Step 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/learning-formats` opening as a pinned horizontal illustrated journey that walks a student into a static Academic Level arrival scene and stops there.

**Architecture:** A feature-local React component tree separates the master GSAP controller, world layers, character renderer, and reusable scene boundary. Supplied transparent asset sheets are preserved and cropped into optimized individual WebP files; the walking-frame renderer is isolated behind `WalkingCharacter` so a later Lottie/Rive replacement does not affect camera movement.

**Tech Stack:** React 18, TypeScript, Vite, GSAP 3.15, ScrollTrigger, CSS, Sharp, Node test runner, Puppeteer.

**Spec:** `docs/superpowers/specs/2026-08-26-learning-formats-journey-step-1-design.md`

## Global Constraints

- Implement only the opening journey and the non-functional Scene 01 Academic Level arrival.
- Use one GSAP master timeline controlled by one pinned ScrollTrigger for full-motion layouts.
- Preserve idle and walking as separate character states; do not fake walking with translation alone.
- Keep `JourneyWorld`, `WalkingCharacter`, `JourneyLayer`, and `JourneyScene` as distinct component boundaries.
- Animate transforms and opacity; do not write React state on scroll frames.
- Render a readable, non-pinned document flow for `prefers-reduced-motion: reduce`.
- Do not modify unrelated dirty files in the repository.

---

## File Map

- `scripts/extract-learning-journey-assets.mjs` — deterministic Sharp extraction from the four supplied transparent source sheets.
- `public/learning-journey/source/*.png` — preserved original supplied sheets.
- `public/learning-journey/{character,path,flora,objects,trees,distance}/*.webp` — individually positioned optimized assets.
- `src/features/learning-journey/journeyAssets.ts` — typed asset manifest and walking-frame order.
- `src/features/learning-journey/journeyModel.ts` — pure phase, camera, and world-progress calculations.
- `src/features/learning-journey/JourneyLayer.tsx` — typed layer wrapper.
- `src/features/learning-journey/WalkingCharacter.tsx` — idle/walk rendering boundary.
- `src/features/learning-journey/JourneyScene.tsx` — reusable positioned scene wrapper.
- `src/features/learning-journey/JourneyWorld.tsx` — independently grouped scenery composition.
- `src/features/learning-journey/AcademicLevelArrival.tsx` — static Scene 01 composition.
- `src/features/learning-journey/LearningJourney.tsx` — GSAP master timeline and feature composition.
- `src/features/learning-journey/learning-journey.css` — layout, art direction, responsive, and reduced-motion styles.
- `src/features/learning-journey/learningJourney.test.ts` — pure-model and source-contract tests.
- `src/features/learning-journey/learning-journey.browser.test.mjs` — Puppeteer interaction and reduced-motion verification.
- `src/pages/LearningFormats.tsx` — route-level SEO/navigation/footer wrapper around the new feature.

---

### Task 1: Prepare and validate the supplied illustration assets

**Files:**
- Create: `scripts/extract-learning-journey-assets.mjs`
- Create: `public/learning-journey/source/character-and-world.png`
- Create: `public/learning-journey/source/objects-and-paths.png`
- Create: `public/learning-journey/source/trees-and-shrubs.png`
- Create: `public/learning-journey/source/distant-landscape.png`
- Create: `public/learning-journey/**/*.webp`
- Create: `src/features/learning-journey/journeyAssets.ts`
- Create: `src/features/learning-journey/learningJourney.test.ts`

**Interfaces:**
- Produces: `journeyAssets: JourneyAssetManifest` and `walkingFrames: readonly string[]`.
- Produces: transparent WebP files addressed by root-relative `/learning-journey/...` URLs.

- [ ] **Step 1: Preserve the exact supplied sheets**

Copy the four user-provided PNGs into the named `public/learning-journey/source/` files without altering the originals. Confirm their dimensions and alpha channels with `sips`.

- [ ] **Step 2: Write a failing asset-contract test**

Add a Node test that imports `journeyAssets.ts`, asserts at least one asset exists in every required group, asserts `walkingFrames.length >= 6`, and checks every manifest URL resolves under `public/`.

```ts
test('journey manifest exposes replaceable character states and independent layers', () => {
  assert.ok(journeyAssets.character.idle);
  assert.ok(walkingFrames.length >= 6);
  for (const key of ['path', 'flora', 'objects', 'trees', 'distance'] as const) {
    assert.ok(journeyAssets[key].length > 0, `${key} must not be flattened away`);
  }
});
```

- [ ] **Step 3: Run the test and verify failure**

Run: `node --test --experimental-strip-types src/features/learning-journey/learningJourney.test.ts`

Expected: FAIL because the asset manifest and extracted files do not exist.

- [ ] **Step 4: Implement deterministic Sharp extraction**

Use explicit source file, bounding box, output size, and destination entries. Apply `.extract(...)`, `.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })`, `.resize({ width, withoutEnlargement: true })`, and `.webp({ quality: 88, alphaQuality: 95 })`. Extract the standing student, at least six sequential walking poses, multiple path segments, signpost, grass/flower/rock groups, educational objects, tree groups, and distant landscape.

The script must reject missing sources, invalid boxes, and empty alpha results, create only feature-owned directories, and print each output path and dimensions.

- [ ] **Step 5: Create the typed manifest and run extraction**

Define:

```ts
export interface JourneyAssetManifest {
  character: { idle: string; walking: readonly string[] };
  path: readonly string[];
  flora: readonly string[];
  objects: readonly string[];
  trees: readonly string[];
  distance: readonly string[];
}
```

Run: `node scripts/extract-learning-journey-assets.mjs`

Expected: all named transparent WebPs are generated successfully.

- [ ] **Step 6: Run the asset test and inspect contact sheets**

Run the Node test again and use a generated contact sheet or direct image inspection to confirm no neighboring sprites, clipping, or excess transparent padding remain.

- [ ] **Step 7: Commit the asset pipeline**

```bash
git add scripts/extract-learning-journey-assets.mjs public/learning-journey src/features/learning-journey/journeyAssets.ts src/features/learning-journey/learningJourney.test.ts
git commit -m "feat: prepare learning journey artwork"
```

---

### Task 2: Establish the pure journey model and component boundaries

**Files:**
- Create: `src/features/learning-journey/journeyModel.ts`
- Create: `src/features/learning-journey/JourneyLayer.tsx`
- Create: `src/features/learning-journey/WalkingCharacter.tsx`
- Create: `src/features/learning-journey/JourneyScene.tsx`
- Modify: `src/features/learning-journey/learningJourney.test.ts`

**Interfaces:**
- Produces: `getJourneyPhase(progress: number): JourneyPhase`.
- Produces: `getCharacterScreenProgress(progress: number): number` and `getWorldTravelProgress(progress: number): number`.
- Produces: `JourneyLayer`, `WalkingCharacter`, and `JourneyScene` React components.

- [ ] **Step 1: Write failing model tests for the timing contract**

Test phase boundaries at 0, .10, .20, .65, .85, and 1; test progress clamping outside 0–1; test that character screen movement reaches 1 at .20 and remains 1; test that world movement is 0 through .20 and reaches 1 at arrival.

```ts
assert.equal(getJourneyPhase(0.05), 'opening');
assert.equal(getJourneyPhase(0.15), 'departure');
assert.equal(getJourneyPhase(0.5), 'travel');
assert.equal(getJourneyPhase(0.75), 'approach');
assert.equal(getJourneyPhase(0.92), 'arrival');
assert.equal(getCharacterScreenProgress(0.7), 1);
assert.equal(getWorldTravelProgress(0.2), 0);
assert.equal(getWorldTravelProgress(1), 1);
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test --experimental-strip-types src/features/learning-journey/learningJourney.test.ts`

Expected: FAIL because `journeyModel.ts` does not exist.

- [ ] **Step 3: Implement the pure timing model**

Create exported constants for the five ranges, a `clamp01` helper, and piecewise normalized progress functions. Keep GSAP and DOM code out of this module.

- [ ] **Step 4: Add structural source tests**

Assert the three component files exist, `WalkingCharacter` renders separate idle and walking layers, `JourneyLayer` accepts a depth/data attribute, and `JourneyScene` accepts an `id`, `className`, and children.

- [ ] **Step 5: Implement the component primitives**

`WalkingCharacter` receives `idleSrc`, `walkingFrames`, and forwarded refs for the outer body and walk frames. All animation frames are `aria-hidden`; one stable semantic image provides the character description. `JourneyLayer` and `JourneyScene` remain layout-only components with typed props and no feature state.

- [ ] **Step 6: Run tests and typecheck**

Run:

```bash
node --test --experimental-strip-types src/features/learning-journey/learningJourney.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit the engine primitives**

```bash
git add src/features/learning-journey
git commit -m "feat: add learning journey primitives"
```

---

### Task 3: Compose the opening world and Academic Level arrival

**Files:**
- Create: `src/features/learning-journey/JourneyWorld.tsx`
- Create: `src/features/learning-journey/AcademicLevelArrival.tsx`
- Create: `src/features/learning-journey/learning-journey.css`
- Modify: `src/features/learning-journey/learningJourney.test.ts`

**Interfaces:**
- Consumes: `journeyAssets`, `JourneyLayer`, and `JourneyScene`.
- Produces: stable selectors/data attributes for `distance`, `middle`, `path`, `detail`, `foreground`, `signpost`, and `academic-arrival` animation targets.

- [ ] **Step 1: Write failing composition and copy tests**

Assert `JourneyWorld.tsx` contains every independently animatable layer and that `AcademicLevelArrival.tsx` contains the exact required question and three labels without `<button>` or selection handlers.

- [ ] **Step 2: Run the test and verify failure**

Run the focused Node test. Expected: FAIL because the world and arrival files do not exist.

- [ ] **Step 3: Implement `JourneyWorld`**

Compose a wide coordinate plane from individually positioned `<img>` elements. Keep distant landscape, middle trees, path, small detail objects, and foreground plants in separate `JourneyLayer` wrappers. Mark decorative images with empty alt text and `aria-hidden="true"`. Place the academy/distant hills toward the final third, a signpost around the approach band, and Scene 01 near the end of the path.

- [ ] **Step 4: Implement `AcademicLevelArrival`**

Use an `<article>` with a semantic heading and a simple list of destinations. Use `01 — ACADEMIC LEVEL` as a true sequential scene label, not a repeated decorative eyebrow. Ensure the destinations are static `<li>` elements.

- [ ] **Step 5: Implement the visual system and responsive static layout**

Define feature tokens for ivory, navy, antique gold, sage, dusty blue, peach, and lavender. Use existing DA font stacks. Establish a full-viewport scene, generous negative space, a ground line, fluid type, 45–70px character scale, independently positioned art, and a compact smaller-screen layout. Avoid card-grid styling for arrival destinations.

Add a complete `@media (prefers-reduced-motion: reduce)` branch that changes the journey into normal flow, exposes both opening and arrival, disables transforms/transitions, and avoids sticky/pinned assumptions.

- [ ] **Step 6: Run tests, typecheck, and inspect the static scene**

Run the focused test and `npm run typecheck`. Temporarily mount the world only if needed for inspection, then use the browser at 1440×900 and 768×1024 to confirm composition, image sharpness, and no document overflow.

- [ ] **Step 7: Commit the world composition**

```bash
git add src/features/learning-journey
git commit -m "feat: compose learning journey world"
```

---

### Task 4: Build the single GSAP master timeline

**Files:**
- Create: `src/features/learning-journey/LearningJourney.tsx`
- Modify: `src/features/learning-journey/learning-journey.css`
- Modify: `src/features/learning-journey/learningJourney.test.ts`

**Interfaces:**
- Consumes: all feature components and stable `data-journey-*` targets.
- Produces: default `LearningJourney` page-level component.

- [ ] **Step 1: Write failing animation-contract tests**

Assert `LearningJourney.tsx` registers ScrollTrigger, creates exactly one master `gsap.timeline({ scrollTrigger: ... })`, pins the viewport, uses `gsap.matchMedia`, contains phase labels matching the model, animates the outer character separately from walk frames, and reverts both GSAP context and match-media lifecycle.

- [ ] **Step 2: Run the test and verify failure**

Run the focused Node test. Expected: FAIL because `LearningJourney.tsx` does not exist.

- [ ] **Step 3: Implement the opening and feature shell**

Render the exact opening copy, an in-page `Begin the journey →` link, the subtle scroll instruction, world, character, and arrival. Keep opening and arrival text in the DOM throughout and use visibility/opacity only for the full-motion presentation.

- [ ] **Step 4: Implement one pinned master timeline**

Within `useLayoutEffect`, create `gsap.matchMedia()` and a scoped `gsap.context()`. For `(prefers-reduced-motion: no-preference)`, create one scrubbed timeline with `trigger`, `pin`, `anticipatePin`, `invalidateOnRefresh`, and an end distance based on viewport height clamped to the equivalent of roughly 300–400vh.

Use timeline labels at 0, .10, .20, .65, .85, and 1. Animate:

- opening copy away between .10 and .20;
- character outer x from its left start to `28vw` by .20;
- all world layers from .20 onward using closely spaced distance multipliers;
- walk frames with stepped visibility only from .10 to .88;
- grass, signpost, and distant clarity during their specified intervals;
- arrival copy from hidden to visible after .85;
- idle/walk layer swap at opening and arrival.

Use refs and scoped selectors rather than React state in timeline callbacks.

- [ ] **Step 5: Implement CTA behavior and image refresh**

The CTA should call `scrollIntoView` on the journey movement anchor using smooth behavior unless reduced motion is requested. Refresh ScrollTrigger after primary images decode, guarded so unmount cannot schedule stale work.

- [ ] **Step 6: Verify cleanup and automated checks**

Run the focused tests and typecheck. Inspect the implementation to confirm the cleanup calls `context.revert()` and `media.revert()` and no `onUpdate` invokes a React setter.

- [ ] **Step 7: Commit the master timeline**

```bash
git add src/features/learning-journey
git commit -m "feat: animate learning journey camera"
```

---

### Task 5: Integrate the journey on `/learning-formats`

**Files:**
- Modify: `src/pages/LearningFormats.tsx`
- Modify: `src/features/learning-journey/learningJourney.test.ts`

**Interfaces:**
- Consumes: default `LearningJourney`.
- Produces: `/learning-formats` with existing SEO, `NavigationNew`, journey, and `FooterNew` only.

- [ ] **Step 1: Write a failing page-integration test**

Assert the page imports and renders `LearningJourney`, keeps SEO/navigation/footer, and no longer renders `MatchingEngine`, `CaseStudiesSlider`, `ComparisonTable`, or `PlacementAssessment`.

- [ ] **Step 2: Run the test and verify failure**

Run the focused Node test. Expected: FAIL because the old page body is still mounted.

- [ ] **Step 3: Replace the route body without broad refactoring**

Reduce `LearningFormats.tsx` to the route wrapper and remove now-unused page-local code/imports. Preserve the existing canonical URL and update the description only if needed to accurately describe the journey. Do not touch global route definitions or unrelated page components.

- [ ] **Step 4: Prevent floating UI from obscuring the prototype**

If browser inspection shows the global sticky booking control overlapping the pinned scene, set a scoped body data attribute while the journey is mounted and add the smallest existing global visibility rule necessary; clean the attribute on unmount.

- [ ] **Step 5: Run tests and build**

Run:

```bash
node --test --experimental-strip-types src/features/learning-journey/learningJourney.test.ts
npm run typecheck
npm run build
```

Expected: PASS. Existing unrelated lint backlog is not part of this feature unless new errors originate in feature files.

- [ ] **Step 6: Commit page integration**

```bash
git add src/pages/LearningFormats.tsx src/features/learning-journey src/index.css
git commit -m "feat: launch learning formats journey prototype"
```

---

### Task 6: Browser-test and tune the interaction

**Files:**
- Create: `src/features/learning-journey/learning-journey.browser.test.mjs`
- Modify as findings require: `src/features/learning-journey/LearningJourney.tsx`
- Modify as findings require: `src/features/learning-journey/learning-journey.css`

**Interfaces:**
- Consumes: the completed `/learning-formats` feature.
- Produces: repeatable proof of the camera-follow, arrival, reduced-motion, and responsive contracts.

- [ ] **Step 1: Write the browser test before final tuning**

Start Vite on a dedicated port. In Puppeteer, load `/learning-formats` at 1440×900, capture character/world positions at progress checkpoints, and assert:

- student is idle and left of 28vw at opening;
- student reaches within a small tolerance of 28vw near 20%;
- student x remains stable while the path x changes substantially between 35% and 70%;
- walk layer is visible during travel;
- idle layer and Academic Level content are visible at arrival;
- `document.documentElement.scrollWidth <= innerWidth + 1`.

- [ ] **Step 2: Verify the test catches unfinished tuning**

Run the browser test. Expected: at least one position/timing assertion may fail before calibration; preserve the captured measurements.

- [ ] **Step 3: Tune scroll distance, travel, and easing**

Adjust only timeline constants and feature CSS until travel feels deliberate but Scene 01 is reached within approximately 3–4 viewport scroll lengths. Keep the student follow position near 28vw and parallax ratios restrained.

- [ ] **Step 4: Test reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload, and assert no pin spacer is created, opening and arrival text are visible in normal flow, the idle character is visible, and the page remains keyboard-scrollable.

- [ ] **Step 5: Test smaller viewports and visual quality**

Repeat at 1024×768 and 390×844. Capture opening, travel, and arrival screenshots. Inspect asset clipping, text overflow, character scale, destination readability, nav overlap, ground continuity, and excessive scene density. Fix feature-owned CSS only.

- [ ] **Step 6: Run final verification**

Run:

```bash
node --test --experimental-strip-types src/features/learning-journey/learningJourney.test.ts
node --test src/features/learning-journey/learning-journey.browser.test.mjs
npm run typecheck
npm run build
git diff --check
```

Expected: all commands pass and browser console contains no React, GSAP, asset, or runtime errors.

- [ ] **Step 7: Commit verified tuning**

```bash
git add src/features/learning-journey src/pages/LearningFormats.tsx src/index.css
git commit -m "test: verify learning journey arrival"
```

---

## Self-Review Result

- Spec coverage: every required opening, camera, walking, world-layer, parallax, Scene 01, reduced-motion, lifecycle, and performance requirement maps to Tasks 1–6.
- Scope boundary: no functional answer controls, later scenes, recommendation logic, or unrelated page redesign appears in the plan.
- Type consistency: the asset manifest, pure timing functions, component names, and animation selectors are defined before use.
- Placeholder scan: the plan contains no deferred product decisions or incomplete implementation steps.
