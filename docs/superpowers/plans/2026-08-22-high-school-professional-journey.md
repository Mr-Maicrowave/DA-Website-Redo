# High School Professional Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the premium editorial High School journey beneath the existing interactive Years 7–10 section, beginning with seven generated watercolor assets and ending with a responsive animated HSC bridge.

**Architecture:** Keep `HighSchoolCinematicScene` unchanged and replace the current lower-page sequence with a focused `HighSchoolProfessionalJourney` feature folder. Each major section owns its markup and GSAP lifecycle; shared content and types live in a data module, while shared visual tokens and responsive rules live in one feature stylesheet.

**Tech Stack:** React 18, TypeScript, GSAP 3 + ScrollTrigger, existing Lenis integration when present, Lucide React, CSS/SVG, Node test runner, built-in ChatGPT image generation.

**Spec:** `docs/superpowers/specs/2026-08-22-high-school-professional-journey-design.md`

## Global Constraints

- Preserve the navbar, hero, `HighSchoolCinematicScene`, student artwork, year bubbles, copy, and all interactions above the insertion point.
- Generate and inspect seven transparent PNG assets before changing page implementation code.
- Use existing photography for the teacher-support section; do not generate fictional DA staff.
- Do not add dependencies: GSAP and Lenis are already installed.
- Do not create a second Lenis instance or RAF loop.
- Use Lucide or code-native SVG for icons and paths; image generation is reserved for watercolor/ink raster textures.
- Respect `prefers-reduced-motion` with readable final states and no unnecessary pinning.
- Verify 1440px, 1280px, tablet, and mobile layouts.
- Do not fabricate credentials, class sizes, hours, guarantees, statistics, testimonials, or results.

---

## File Structure

- Create `public/images/programs/high-school-professional/` — final generated PNG assets.
- Create `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx` — feature composition only.
- Create `src/components/programs/high-school-professional/professionalJourneyData.ts` — typed curriculum, process, support, and progress arrays.
- Create `src/components/programs/high-school-professional/TransitionBridge.tsx` — orange-to-gold handoff.
- Create `src/components/programs/high-school-professional/CurriculumExplorer.tsx` — accessible interactive subject index.
- Create `src/components/programs/high-school-professional/TeachingProcess.tsx` — scroll-drawn five-stage process.
- Create `src/components/programs/high-school-professional/TeacherSupport.tsx` — real-photo editorial split.
- Create `src/components/programs/high-school-professional/ProgressJourney.tsx` — accumulating milestone path.
- Create `src/components/programs/high-school-professional/HSCBridge.tsx` — cream-to-navy pinned finale.
- Create `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css` — feature tokens, layout, focus, responsive, and reduced-motion rules.
- Create `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs` — source-level integration guard matching the project’s existing High School test style.
- Modify `src/pages/programs/HighSchool.tsx` — mount the new feature immediately after `HighSchoolCinematicScene` and remove only the superseded lower-page components from render.

---

### Task 1: Generate and Validate the Seven Raster Assets

**Files:**
- Create: `public/images/programs/high-school-professional/subject-english-watercolor.png`
- Create: `public/images/programs/high-school-professional/subject-mathematics-watercolor.png`
- Create: `public/images/programs/high-school-professional/subject-science-watercolor.png`
- Create: `public/images/programs/high-school-professional/subject-humanities-watercolor.png`
- Create: `public/images/programs/high-school-professional/subject-study-skills-watercolor.png`
- Create: `public/images/programs/high-school-professional/year10-orange-gold-transition.png`
- Create: `public/images/programs/high-school-professional/hsc-navy-ink-transition.png`

**Interfaces:**
- Consumes: supplied reference image as style/composition guidance only.
- Produces: seven transparent PNG paths consumed by `professionalJourneyData.ts`, `TransitionBridge.tsx`, and `HSCBridge.tsx`.

- [ ] **Step 1: Generate each subject accent with one built-in image-generation call**

Use this shared prompt structure, changing only subject name and pigment color per call:

```text
Use case: stylized-concept
Asset type: transparent website watercolor accent
Primary request: Create a restrained [SUBJECT] watercolor pigment bloom matching a premium Australian education prospectus.
Input images: Image 1 is a style and composition reference only; do not reproduce its text, logo, people, or layout.
Scene/backdrop: genuinely transparent background with broad empty space.
Style/medium: delicate hand-painted watercolor on subtle paper grain, irregular pigment edges, refined editorial finish.
Color palette: [BLUE/GREEN/PURPLE/ORANGE/WARM GOLD], low-to-moderate saturation.
Composition/framing: wide horizontal accent, pigment concentrated along the lower third and corners, quiet center for readable text overlays.
Constraints: no text, no letters, no numbers, no logo, no people, no icons, no watermark, preserve transparency.
Avoid: opaque cream rectangle, heavy splashes, neon saturation, symmetrical clip-art shape.
```

- [ ] **Step 2: Generate the Year 10 transition texture**

```text
Use case: stylized-concept
Asset type: transparent scroll-transition texture for a website
Primary request: An expressive orange watercolor trail that gradually narrows and resolves into a refined antique-gold ink stroke.
Input images: Image 1 is a style and mood reference only.
Style/medium: delicate watercolor becoming precise editorial ink, subtle paper fibers, premium restrained finish.
Composition/framing: tall vertical-to-diagonal flow with generous transparent negative space; expressive pigment at the top, narrow gold trail at the bottom.
Color palette: muted Year 10 orange, warm antique gold.
Constraints: genuinely transparent background, no text, no logos, no symbols, no people, no watermark.
Avoid: flames, thick ribbon, metallic 3D effect, opaque background, particle explosion.
```

- [ ] **Step 3: Generate the HSC navy transition texture**

```text
Use case: stylized-concept
Asset type: transparent cinematic website transition texture
Primary request: Quiet pale-navy watercolor ink deepening into rich DA-style deep navy, with restrained antique-gold flecks and large transparent negative space.
Input images: Image 1 is a style and mood reference only.
Style/medium: sophisticated watercolor and ink wash, soft paper grain, premium editorial prospectus.
Composition/framing: wide landscape veil entering from one edge and lower corners, open center for large typography.
Color palette: desaturated pale navy, deep navy, tiny warm-gold accents.
Constraints: genuinely transparent background, no gradient rectangle, no text, no logos, no people, no icons, no watermark.
Avoid: galaxy, starscape, glitter explosion, neon blue, opaque background.
```

- [ ] **Step 4: Inspect every output**

Confirm transparency, color consistency, negative space, no unwanted text/logo/people, and material continuity across all seven outputs. Regenerate only the failed asset with one targeted prompt adjustment.

- [ ] **Step 5: Save final selections in the project**

Copy the selected built-in outputs from their generated-image locations into the exact seven paths above. Do not overwrite unrelated existing assets.

- [ ] **Step 6: Record dimensions and alpha validation**

Run:

```bash
file public/images/programs/high-school-professional/*.png
```

Expected: seven PNG files with alpha-capable color mode and no zero-byte files.

- [ ] **Step 7: Commit the asset milestone**

```bash
git add public/images/programs/high-school-professional
git commit -m "feat: add high school professional journey artwork"
```

---

### Task 2: Add Typed Content Data and the Feature Shell

**Files:**
- Create: `src/components/programs/high-school-professional/professionalJourneyData.ts`
- Create: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx`
- Create: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Create: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`
- Modify: `src/pages/programs/HighSchool.tsx`

**Interfaces:**
- Produces: `CurriculumSubject`, `TeachingStage`, `SupportPrinciple`, `ProgressMilestone`, and default exported `HighSchoolProfessionalJourney`.
- Consumes: the seven asset paths from Task 1.

- [ ] **Step 1: Write the failing integration guard**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../../pages/programs/HighSchool.tsx', import.meta.url), 'utf8');
const feature = await readFile(new URL('./HighSchoolProfessionalJourney.tsx', import.meta.url), 'utf8');

test('mounts the professional journey immediately after the existing cinematic journey', () => {
  assert.match(page, /<HighSchoolCinematicScene\s*\/>\s*<HighSchoolProfessionalJourney\s*\/>/);
});

test('composes the five approved professional sections', () => {
  for (const name of ['TransitionBridge', 'CurriculumExplorer', 'TeachingProcess', 'TeacherSupport', 'ProgressJourney', 'HSCBridge']) {
    assert.match(feature, new RegExp(`<${name}`));
  }
});
```

- [ ] **Step 2: Run the guard and confirm RED**

Run: `node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

Expected: FAIL because the feature files and mount do not exist.

- [ ] **Step 3: Add exact typed data**

Define the copy from the approved specification and pasted brief in arrays. Use this interface shape:

```ts
export interface CurriculumSubject {
  id: 'english' | 'mathematics' | 'science' | 'humanities' | 'study-skills';
  label: string;
  curriculum: string[];
  skills: string[];
  accentSrc: string;
}

export interface JourneyItem {
  id: string;
  title: string;
  description: string;
}
```

- [ ] **Step 4: Compose the feature shell**

```tsx
export default function HighSchoolProfessionalJourney() {
  return (
    <div className="hs-professional">
      <TransitionBridge />
      <CurriculumExplorer />
      <TeachingProcess />
      <TeacherSupport />
      <ProgressJourney />
      <HSCBridge />
    </div>
  );
}
```

- [ ] **Step 5: Mount after the existing cinematic scene**

Import `HighSchoolProfessionalJourney` and replace only `<TeacherBeside />`, `<Curriculum />`, `<HowWeTeach />`, and `<PerfectIf />` in the page render. Leave their existing source definitions untouched initially to minimize risky deletion while the new feature is validated.

- [ ] **Step 6: Run the guard and type check**

Run:

```bash
node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
npm run typecheck
```

Expected: integration guard PASS and TypeScript exit 0.

- [ ] **Step 7: Commit the shell**

```bash
git add src/pages/programs/HighSchool.tsx src/components/programs/high-school-professional
git commit -m "feat: scaffold high school professional journey"
```

---

### Task 3: Build the Transition Bridge and Curriculum Explorer

**Files:**
- Create: `src/components/programs/high-school-professional/TransitionBridge.tsx`
- Create: `src/components/programs/high-school-professional/CurriculumExplorer.tsx`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

**Interfaces:**
- `CurriculumExplorer` consumes `curriculumSubjects` and exposes a semantic tablist.
- `TransitionBridge` consumes `/images/programs/high-school-professional/year10-orange-gold-transition.png`.

- [ ] **Step 1: Add failing accessibility and asset guards**

Assert the source includes `role="tablist"`, `role="tab"`, `aria-selected`, keyboard arrow handling, all five subject IDs, and the Year 10 transition asset path.

- [ ] **Step 2: Run the focused guard and confirm RED**

Run: `node --test src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

- [ ] **Step 3: Implement `TransitionBridge`**

Render the transition PNG behind an SVG rule. Use `useLayoutEffect`, `gsap.context()`, and ScrollTrigger to reduce PNG opacity while drawing the gold stroke. Skip scrubbing and show the final gold rule when reduced motion is active.

- [ ] **Step 4: Implement `CurriculumExplorer` state and keyboard behavior**

Use `useState(0)`, refs for tabs and indicator, ArrowLeft/ArrowRight/Home/End behavior, and `aria-controls`. Animate the indicator with GSAP `duration: 0.5`, `ease: 'power3.inOut'`; transition content with the approved 8–10px movement and 350–550ms timing.

- [ ] **Step 5: Style the editorial desktop and mobile layouts**

Desktop: one horizontal index and two-column content stage. Mobile: horizontally scrollable selector and stacked content columns. Watercolor accents remain decorative with `alt=""` and `aria-hidden="true"`.

- [ ] **Step 6: Run focused tests and type check**

Run the focused Node test and `npm run typecheck`; expect both to pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/programs/high-school-professional
git commit -m "feat: add curriculum explorer and transition bridge"
```

---

### Task 4: Build Teaching Process and Teacher Support

**Files:**
- Create: `src/components/programs/high-school-professional/TeachingProcess.tsx`
- Create: `src/components/programs/high-school-professional/TeacherSupport.tsx`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

**Interfaces:**
- `TeachingProcess` consumes `teachingStages` and renders one progress path plus five nodes.
- `TeacherSupport` consumes `supportPrinciples` and one verified existing image path selected from `public/images/programs/`.

- [ ] **Step 1: Add failing structural guards**

Assert all five teaching stage names, an SVG path ref, ScrollTrigger cleanup, the four support titles, `loading="lazy"`, explicit image dimensions/aspect ratio, and the chosen existing photo path.

- [ ] **Step 2: Run focused guard and confirm RED**

- [ ] **Step 3: Implement the teaching path**

Use one `<svg aria-hidden="true">` path and five semantic stage articles. In `useLayoutEffect`, compute path length, set `strokeDasharray` and `strokeDashoffset`, then animate with ScrollTrigger `{ start: 'top 70%', end: 'bottom 55%', scrub: 0.8 }`. Activate nodes cumulatively. Use a vertical SVG/path layout below the tablet breakpoint.

- [ ] **Step 4: Implement calm teacher support**

Use a split figure/content layout. Animate image clip-path left-to-right over 0.9s, scale 1.03 to 1, heading opacity/y 12px, and principle stagger 0.12s. Reduced motion displays final state immediately.

- [ ] **Step 5: Run focused tests and type check**

- [ ] **Step 6: Commit**

```bash
git add src/components/programs/high-school-professional
git commit -m "feat: add teaching process and teacher support"
```

---

### Task 5: Build Progress Journey, Verified Proof Decision, and HSC Bridge

**Files:**
- Create: `src/components/programs/high-school-professional/ProgressJourney.tsx`
- Create: `src/components/programs/high-school-professional/HSCBridge.tsx`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.tsx`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Modify: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`

**Interfaces:**
- `ProgressJourney` consumes `progressMilestones` and exposes cumulative `.is-active` states.
- `HSCBridge` links to `/hsc-excellence` and consumes `hsc-navy-ink-transition.png`.

- [ ] **Step 1: Search for verified High School proof**

Use repository search for clearly attributed High School testimonials or results. If exact attribution is unavailable, document omission in a code comment beside the composition point and do not render `HighSchoolProof`.

- [ ] **Step 2: Add failing progress and HSC guards**

Assert the five milestone names, cumulative activation source, HSC asset path, both approved statements, `/hsc-excellence`, reduced-motion branch, and GSAP cleanup.

- [ ] **Step 3: Implement `ProgressJourney`**

Render a horizontal gold path on desktop and vertical path on mobile. ScrollTrigger maps progress to `Math.ceil(progress * milestones.length)` and only adds active states; earlier milestones remain active.

- [ ] **Step 4: Implement `HSCBridge`**

Use a desktop wrapper of `min-height: clamp(140vh, 160vh, 180vh)` with a sticky visual stage. Animate four phases in one GSAP timeline: first statement, gold line, navy texture/background settlement, second statement and CTA. Disable pinning and show a readable stacked final state on mobile and reduced motion.

- [ ] **Step 5: Run focused tests and type check**

- [ ] **Step 6: Commit**

```bash
git add src/components/programs/high-school-professional
git commit -m "feat: add progress journey and HSC bridge"
```

---

### Task 6: Full Responsive, Motion, and Regression Verification

**Files:**
- Modify as needed: `src/components/programs/high-school-professional/*.tsx`
- Modify as needed: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.css`
- Test: `src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs`
- Test: `src/pages/programs/HighSchool.test.mjs`

**Interfaces:**
- Consumes the complete feature.
- Produces a verified High School page with no upper-page regression.

- [ ] **Step 1: Run automated checks**

```bash
node --test src/pages/programs/HighSchool.test.mjs src/components/programs/high-school-professional/HighSchoolProfessionalJourney.test.mjs
npm run typecheck
git diff --check
```

Expected: all focused tests pass, TypeScript exits 0, and no whitespace errors.

- [ ] **Step 2: Start the local page and inspect the complete journey**

Use the in-app Browser at `/programs/high-school`. Confirm the hero and Years 7–10 interaction remain unchanged, then exercise all five curriculum tabs with pointer and keyboard.

- [ ] **Step 3: Verify desktop layouts**

At 1440px and 1280px, capture the transition, curriculum, process, teacher, progress, and HSC states. Confirm no overlap, horizontal overflow, blank gaps, heading collision, or early/late pin release.

- [ ] **Step 4: Verify tablet and mobile layouts**

Confirm the subject selector scrolls horizontally, teaching/progress paths become vertical, HSC pinning is removed, all copy remains readable, and touch targets remain at least 44px.

- [ ] **Step 5: Verify reduced motion and console health**

Confirm all final states appear without scrub/pinning and all click interactions work. Treat new errors as blockers; record unrelated existing warnings separately.

- [ ] **Step 6: Run the production build**

Run: `npm run build`

Expected: exit 0. If the repository-wide build remains stalled in a pre-existing site-wide step, report the exact last completed step and retain focused passing evidence.

- [ ] **Step 7: Final review and commit**

Review the diff to ensure no navbar, hero, or cinematic journey code changed unintentionally.

```bash
git add src/pages/programs/HighSchool.tsx src/components/programs/high-school-professional public/images/programs/high-school-professional
git commit -m "feat: complete high school professional journey"
```
