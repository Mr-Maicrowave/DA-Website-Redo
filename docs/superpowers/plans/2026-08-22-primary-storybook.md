# Primary Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved storyboard-driven Primary School journey below the existing hero.

**Architecture:** Keep the route component thin and compose focused sections from `src/features/primary-storybook`. Use GSAP for connected scroll choreography and a lazily loaded PixiJS canvas for the aquarium, with DOM-based accessible controls and CSS/reduced-motion fallbacks.

**Tech Stack:** React 18, TypeScript, GSAP/ScrollTrigger/MotionPathPlugin, PixiJS, Framer Motion, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-22-primary-storybook-design.md`

## Global Constraints

- Preserve the current Primary hero, visual identity, real DA photos, and core written content.
- Follow the supplied storyboard sequence and do not skip Years 1–2 curriculum.
- Keep essential content visible without animation and support keyboard and reduced-motion users.
- Use generated raster assets from `public/primary/` and code-native SVG for draw animations.

---

### Task 1: Story Structure and Content Model

**Files:**
- Create: `src/features/primary-storybook/primaryStoryData.ts`
- Create: `src/features/primary-storybook/PrimaryStorybook.test.ts`
- Modify: `src/pages/programs/PrimarySchool.tsx`

**Interfaces:**
- Produces: typed stage, curriculum, outcome, and aquarium fact records used by every section.

- [ ] Write a source-level test asserting the required ordered sections, exact stage headings, Years 1–2 curriculum, generated asset references, and final CTA.
- [ ] Run `node --test --experimental-strip-types src/features/primary-storybook/PrimaryStorybook.test.ts` and confirm it fails because the new story shell does not exist.
- [ ] Add the typed content model and compose the new section order from the route shell without altering the existing hero or SEO.
- [ ] Re-run the test and confirm it passes.

### Task 2: Shared SVG Journey Layer

**Files:**
- Create: `src/features/primary-storybook/PrimaryJourneyLayer.tsx`
- Create: `src/features/primary-storybook/usePrimaryJourney.ts`
- Create: `src/features/primary-storybook/primary-storybook.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Produces: `PrimaryJourneyLayer`, draw-path classes, and `usePrimaryJourney(rootRef)`.

- [ ] Extend the failing test to require one global plane, one route path, GSAP plugin registration, and reduced-motion branching.
- [ ] Confirm the new assertions fail.
- [ ] Implement the fixed overlay, SVG route, plane, cross-section ScrollTrigger timeline, and reduced-motion fallback.
- [ ] Confirm the focused test passes.

### Task 3: Years 1–2 Story and Curriculum

**Files:**
- Create: `src/features/primary-storybook/Years12Story.tsx`
- Modify: `src/features/primary-storybook/primary-storybook.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: typed content and shared draw classes.
- Produces: `Years12Story` with `years-1-2`, benefits, and curriculum anchors.

- [ ] Add failing assertions for the four benefits, three curriculum items, real DA photo, and path-linked markup.
- [ ] Implement the scrapbook photo placement, connected benefit rail, house/curriculum illustration, and SVG draw targets.
- [ ] Verify the focused test passes.

### Task 4: Aquarium Physics and Discovery Model

**Files:**
- Create: `src/features/primary-storybook/aquariumPhysics.ts`
- Create: `src/features/primary-storybook/aquariumPhysics.test.ts`

**Interfaces:**
- Produces: `stepFish`, `steerFromPointer`, `keepInBounds`, and `markDiscovered` pure functions.

- [ ] Write failing tests for independent movement, limited avoidance velocity, edge steering, and idempotent discovery.
- [ ] Run the test and verify the expected missing-module failure.
- [ ] Implement the minimal typed physics helpers.
- [ ] Re-run and confirm all physics tests pass.

### Task 5: Interactive Aquarium

**Files:**
- Create: `src/features/primary-storybook/PrimaryAquarium.tsx`
- Create: `src/features/primary-storybook/useAquariumEngine.ts`
- Create: `src/features/primary-storybook/AquariumFactCard.tsx`
- Modify: `src/features/primary-storybook/primary-storybook.css`
- Modify: `package.json`, `package-lock.json`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: generated layers/sprites and physics helpers.
- Produces: accessible aquarium canvas, aligned creature buttons, fact card, and discovery progress.

- [ ] Add failing assertions for the aquarium canvas, seven labelled creature buttons, instruction copy, progress, and lazy Pixi import.
- [ ] Install `pixi.js` and dynamically initialize the canvas near the viewport.
- [ ] Implement layered scene composition, independent fish movement, pointer avoidance, tap/click facts, pooled bubbles/splashes, and cleanup.
- [ ] Confirm source and physics tests pass.

### Task 6: Years 3–4 and Years 5–6 Journey

**Files:**
- Create: `src/features/primary-storybook/Years34Story.tsx`
- Create: `src/features/primary-storybook/Years56Story.tsx`
- Modify: `src/features/primary-storybook/primary-storybook.css`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Produces: stage intros, connected skill/outcome paths, curricula, and stable anchor IDs.

- [ ] Add failing assertions for all required stage headings, four skills/outcomes per stage, curricula, and DA photos.
- [ ] Implement Years 3–4 circular growth path and curriculum timeline.
- [ ] Implement Years 5–6 masked photo reveal, learning rail, and curriculum timeline.
- [ ] Confirm the focused test passes.

### Task 7: Journey Outro, CTA, and Responsive Hardening

**Files:**
- Create: `src/features/primary-storybook/PrimaryJourneyOutro.tsx`
- Modify: `src/features/primary-storybook/primary-storybook.css`
- Modify: `src/features/primary-storybook/usePrimaryJourney.ts`
- Test: `src/features/primary-storybook/PrimaryStorybook.test.ts`

**Interfaces:**
- Consumes: generated closing landscape and global journey layer.
- Produces: landscape closure, final CTA, desktop/tablet/mobile layouts, and reduced-motion behavior.

- [ ] Add failing assertions for the closing landscape, final copy/button, responsive selectors, and reduced-motion stylesheet.
- [ ] Implement the pull-back landscape composition, calm CTA, floating stage navigation, mobile aquarium fallback, and responsive motion limits.
- [ ] Confirm the focused test passes.

### Task 8: Verification and Visual QA

**Files:**
- Modify only files required by discovered defects.

- [ ] Run the Primary story and aquarium tests.
- [ ] Run `npm run typecheck` and fix new errors without broad unrelated cleanup.
- [ ] Run `npm run build` and confirm production bundling succeeds.
- [ ] Start the development server and visually inspect desktop, tablet, and mobile layouts plus keyboard and reduced-motion behavior.
- [ ] Correct any storyboard, overflow, contrast, focus, or runtime issues and repeat the relevant checks.
