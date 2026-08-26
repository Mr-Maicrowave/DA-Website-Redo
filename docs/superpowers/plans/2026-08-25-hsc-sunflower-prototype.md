# HSC Sunflower Journey Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a development-only desktop prototype in which scrolling drives one continuous pinned camera journey through the generated sunflower field assets.

**Architecture:** A dedicated React page owns one GSAP ScrollTrigger master timeline and renders backgrounds, midground plants, foreground occluders, and atmosphere as separate depth layers. Static configuration describes twenty camera beats and ten concealed environment transitions; scoped CSS isolates the prototype from the production HSC page.

**Tech Stack:** React 18, TypeScript, GSAP 3.15, ScrollTrigger, CSS transforms, Node test runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-25-hsc-sunflower-prototype-design.md`

## Global Constraints

- Do not generate or replace images.
- Do not modify the production HSC page or its journey components.
- Route must be development-only at `/hsc-sunflower-prototype`.
- Use one pinned master ScrollTrigger timeline with approximately `800vh` of scroll and `scrub: 1.2`.
- Include no navigation, text, headings, DA content, buttons, or controls inside the prototype.
- Desktop only; reduced motion must degrade gracefully.
- No scroll snapping or hard background cuts.

---

### Task 1: Define the isolated route and scene model

**Files:**
- Create: `src/features/hsc-sunflower-prototype/sunflowerJourneyModel.ts`
- Create: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `SUNFLOWER_BACKGROUNDS: readonly string[]`, `SUNFLOWER_FOREGROUNDS: readonly ForegroundAsset[]`, `CAMERA_BEATS: readonly CameraBeat[]`.
- Produces: development-only route `/hsc-sunflower-prototype`.

- [ ] **Step 1: Write the failing route and model test**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../../App.tsx", import.meta.url), "utf8");
const model = readFileSync(new URL("./sunflowerJourneyModel.ts", import.meta.url), "utf8");

test("registers an isolated development-only prototype route", () => {
  assert.match(app, /path="\/hsc-sunflower-prototype"/);
  assert.match(app, /import\.meta\.env\.DEV/);
});

test("defines ten backgrounds, twelve foregrounds, and twenty camera beats", () => {
  assert.equal((model.match(/sunflower-bg-/g) ?? []).length, 10);
  assert.equal((model.match(/sunflower-fg-/g) ?? []).length, 12);
  assert.match(model, /Array\.from\(\{ length: 20 \}/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

Expected: FAIL because the model and route do not exist.

- [ ] **Step 3: Implement the typed scene model and lazy development route**

Create interfaces for camera transforms and foreground placement. Export the ten exact background URLs, all twelve exact foreground URLs, and twenty ordered camera beats following open → enclosed → open geometry. Add a lazy import in `App.tsx` and render it only when `import.meta.env.DEV`; otherwise redirect to `/`.

- [ ] **Step 4: Run the targeted test**

Run: `node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the isolated model and route**

```bash
git add src/App.tsx src/features/hsc-sunflower-prototype/sunflowerJourneyModel.ts src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts
git commit -m "feat: scaffold sunflower journey prototype"
```

### Task 2: Render the layered pinned stage

**Files:**
- Create: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.tsx`
- Create: `src/features/hsc-sunflower-prototype/sunflower-journey-prototype.css`
- Modify: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

**Interfaces:**
- Consumes: `SUNFLOWER_BACKGROUNDS`, `SUNFLOWER_FOREGROUNDS`, and `CAMERA_BEATS` from the model.
- Produces: `.sunflowerJourney > .sunflowerStage` with background, midground, foreground, atmosphere, and empty story layers.

- [ ] **Step 1: Extend the failing structural test**

```ts
const component = readFileSync(new URL("./SunflowerJourneyPrototype.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("./sunflower-journey-prototype.css", import.meta.url), "utf8");

test("renders the required layered stage with no copy or controls", () => {
  for (const name of ["backgroundLayer", "midgroundLayer", "foregroundLayer", "atmosphereLayer", "storyLayer"]) {
    assert.match(component, new RegExp(name));
  }
  assert.doesNotMatch(component, /<h[1-6]|<button|<nav/);
  assert.match(css, /height:\s*800vh/);
  assert.match(css, /height:\s*100svh/);
  assert.match(css, /overflow:\s*hidden/);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

Expected: FAIL because the component and stylesheet do not exist.

- [ ] **Step 3: Implement preload-gated layer rendering**

Render all backgrounds as absolutely stacked `<img>` elements, distribute reusable plant instances between midground and foreground layers using stable data attributes, add atmosphere overlays, and keep story layer empty and non-interactive. Preload every image with `decode()` fallback and expose `aria-busy` on the root until complete.

- [ ] **Step 4: Implement scoped stage styling**

Set the journey to `800vh`, stage to `100vw × 100svh`, each layer to absolute inset positioning, background images to full-bleed cover, and foreground transform origins to bottom center. Give the root an opaque sunflower-derived base color so no blank frame can appear while loading.

- [ ] **Step 5: Run the targeted test and TypeScript check**

Run:

```bash
node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit the layered stage**

```bash
git add src/features/hsc-sunflower-prototype
git commit -m "feat: render layered sunflower stage"
```

### Task 3: Build the continuous camera and occlusion timeline

**Files:**
- Modify: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.tsx`
- Modify: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

**Interfaces:**
- Consumes: DOM layer and asset data attributes.
- Produces: one reversible GSAP timeline with one ScrollTrigger, `scrub: 1.2`, pinned stage, twenty labels, and concealed environment changes.

- [ ] **Step 1: Add failing motion-contract tests**

```ts
test("uses one master timeline for twenty camera beats", () => {
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.equal((component.match(/scrollTrigger:\s*\{/g) ?? []).length, 1);
  assert.match(component, /scrub:\s*1\.2/);
  assert.match(component, /pin:/);
  assert.match(component, /camera-20/);
});

test("changes environments beneath varied foreground occlusion", () => {
  assert.match(component, /close-right/);
  assert.match(component, /close-left/);
  assert.match(component, /bottom-leaves/);
  assert.match(component, /cluster-five/);
  assert.doesNotMatch(component, /scrollSnap|snap:/);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

Expected: FAIL because the master timeline is absent.

- [ ] **Step 3: Initialize the stage and camera state**

Inside `useLayoutEffect`, wait for asset readiness, create one `gsap.context`, query typed layer elements, hide all but the first background, set transform origins, and define initial positions for midground and foreground instances.

- [ ] **Step 4: Construct twenty camera beats**

Add labels `camera-01` through `camera-20` to one timeline. Animate background scale and x/y percentages slowly, midground movement at an approximately 1.8× visual rate, and foreground movement at an approximately 3× visual rate. Use nonuniform values from the model so the camera lowers and encloses through beats 1–12, then rises and opens through beats 13–20.

- [ ] **Step 5: Conceal all environment changes**

At each background change, animate one of the approved occluders across or into the viewport before changing opacity of the adjacent plates. Alternate right flower, bottom foliage, left flower, dense cluster, and atmosphere-assisted concealment. Keep incoming and outgoing camera transforms active during every overlap.

- [ ] **Step 6: Add cleanup**

Return cleanup that reverts GSAP context, matchMedia handlers, and ScrollTrigger state on unmount.

- [ ] **Step 7: Run the targeted test and TypeScript check**

Run:

```bash
node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit the camera timeline**

```bash
git add src/features/hsc-sunflower-prototype
git commit -m "feat: animate continuous sunflower camera journey"
```

### Task 4: Add breeze, lighting, reduced motion, and visual QA

**Files:**
- Modify: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.tsx`
- Modify: `src/features/hsc-sunflower-prototype/sunflower-journey-prototype.css`
- Modify: `src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

**Interfaces:**
- Produces: independent restrained breeze loops, subtle atmospheric progression, and a reduced-motion fallback.

- [ ] **Step 1: Add failing atmosphere and accessibility tests**

```ts
test("adds independent breeze, lighting progression, and reduced motion", () => {
  assert.match(component, /repeat:\s*-1/);
  assert.match(component, /yoyo:\s*true/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /data-atmosphere/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts`

Expected: FAIL because final motion and accessibility behavior are incomplete.

- [ ] **Step 3: Add restrained independent breeze**

Create separate repeating GSAP tweens for selected plants with randomized deterministic durations and phase offsets, bottom-centered origins, `sine.inOut`, yoyo, and rotations below one degree for stems. Keep foliage-only amplitude slightly higher. Kill these tweens in cleanup.

- [ ] **Step 4: Add subtle lighting progression**

Animate atmosphere overlay opacity and CSS custom properties from warm/airy to cooler/darker through beat 12, then back to bright golden softness by beat 20. Keep overlay opacity low enough that source artwork remains natural.

- [ ] **Step 5: Add reduced-motion behavior**

Use `gsap.matchMedia` to omit breeze and minimize scale/translation under reduced motion while retaining gentle background opacity progression. Add CSS rules that disable nonessential animation and transitions.

- [ ] **Step 6: Run automated verification**

Run:

```bash
node --test --experimental-strip-types src/features/hsc-sunflower-prototype/SunflowerJourneyPrototype.test.ts
npm run typecheck
npm run build:dev
```

Expected: all commands exit 0.

- [ ] **Step 7: Perform desktop browser QA**

Start the Vite development server and inspect `/hsc-sunflower-prototype` at a desktop viewport. Capture the opening, deepest enclosure, breakthrough, and final horizon. Confirm the viewport never blanks, no environment change reads as a hard cut, occluders vary, the ending is visibly more open than the middle, and no site navigation or text appears.

- [ ] **Step 8: Commit the verified prototype**

```bash
git add src/App.tsx src/features/hsc-sunflower-prototype
git commit -m "feat: finish sunflower journey prototype"
```
