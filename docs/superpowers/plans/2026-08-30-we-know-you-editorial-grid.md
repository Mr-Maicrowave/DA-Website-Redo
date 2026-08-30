# WE KNOW YOU Editorial Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild only the Why DA `01 — WE KNOW YOU` chapter to closely match the supplied asymmetric editorial reference while preserving real DA photography and a one-viewport desktop student spread.

**Architecture:** A semantic React grid renders four linked stories and an accessible chapter rail from one data model. CSS owns the fixed asymmetric geometry and responsive stack; the existing GSAP hook owns one-time reveals, playhead travel, subtle parallax, and direct pointer transforms without per-frame React state.

**Tech Stack:** React, TypeScript, CSS Grid, GSAP/ScrollTrigger, Node test runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-30-we-know-you-editorial-grid-design.md`

## Global Constraints

- Modify only the WE KNOW YOU component, its scoped CSS/motion, and focused tests.
- Keep the hero and global navigation markup unchanged.
- Use the four existing real images in `public/images/why-da-reference/observations/`.
- Desktop heading plus four student stories must occupy `100svh - 56px`; parent content follows below.
- Keep image containers fixed on interaction; never animate width, height, top, or left.
- All content is visible without animation and under reduced motion.

---

### Task 1: Lock the editorial structure and copy

**Files:**
- Modify: `src/pages/WhyChooseDA.reference.test.mjs`
- Modify: `src/components/why-da/WeKnowYouSection.tsx`

**Interfaces:**
- Produces: `.why-da-editorial`, four `[data-story]` articles, and four `.why-da-rail__button` controls sharing `data-story-index`.

- [ ] Add failing assertions for the single editorial grid, exact supplied copy, four real image paths, accessible rail buttons, and corrected Chapter 02 copy.
- [ ] Run `node --test src/pages/WhyChooseDA.reference.test.mjs` and confirm failure on missing editorial hooks.
- [ ] Replace repeated row markup with the semantic grid, linked story state, rail controls, parent strip, and closing copy.
- [ ] Re-run the reference test and confirm it passes.

### Task 2: Build the static reference composition

**Files:**
- Modify: `src/pages/WhyChooseDA.reference.test.mjs`
- Modify: `src/pages/WhyChooseDA.css`

**Interfaces:**
- Consumes: Task 1 class names and active `data-active-story` state.
- Produces: fixed desktop grid areas `intro`, `story-1-copy`, `photo-1`, `photo-2`, `story-2-copy`, `story-3-copy`, `photo-3`, `photo-4`, and `story-4-copy`.

- [ ] Add failing CSS assertions for the one-viewport grid, three unequal bands, explicit per-photo object positions, zero-radius photography, and confidence foreground containment.
- [ ] Run the focused reference test and confirm the new assertions fail.
- [ ] Implement the cream twelve-column editorial grid, thin rules, narrow type columns, chapter rail, face/hand-safe image crops, parent strip, and transition footer.
- [ ] Add tablet two-column and mobile alternating stack rules without horizontal overflow.
- [ ] Re-run the reference test and confirm it passes.

### Task 3: Add linked interaction and cinematic motion

**Files:**
- Modify: `src/pages/WhyChooseDA.motion.test.mjs`
- Modify: `src/pages/useWhyDAMotion.ts`
- Modify: `src/pages/WhyChooseDA.css`

**Interfaces:**
- Consumes: `[data-story]`, `[data-story-index]`, `[data-motion="know-photo"]`, and `[data-motion="know-image"]`.
- Produces: synchronized active text/photo styling, rail playhead, masked reveal, small parallax, and pointer camera movement.

- [ ] Add failing assertions for one entrance timeline, four reveal directions, `quickTo` pointer movement, playhead activation, fixed track geometry, and reduced-motion cleanup.
- [ ] Run `node --test src/pages/WhyChooseDA.motion.test.mjs` and confirm failure.
- [ ] Implement the 1.2–1.6 second entrance, fixed-container push-ins, brightness focus, linked hover/focus/click behavior, connector motion, and rail playhead.
- [ ] Implement desktop fine-pointer camera movement clamped to ±4px/±3px and subtle per-photo parallax.
- [ ] Add reduced-motion CSS/JS behavior that immediately exposes all content and disables travel, parallax, masks, and push-ins.
- [ ] Re-run focused motion and reference tests and confirm they pass.

### Task 4: Verify production quality

**Files:**
- Test: `src/components/why-da/WeKnowYouSection.test.mjs`
- Test: `src/pages/WhyChooseDA.reference.test.mjs`
- Test: `src/pages/WhyChooseDA.motion.test.mjs`

- [ ] Run all three focused suites and `git diff --check`.
- [ ] Run `npm run build` and confirm exit code 0.
- [ ] Inspect 1440×900 desktop: navigation bottom at 56px, student spread bottom at 900px, all faces/hands visible, and parent strip beginning below.
- [ ] Inspect tablet and mobile for reading order, focus visibility, overflow, crop safety, and reduced motion.
- [ ] Compare the animation-disabled composition against the supplied reference and correct static layout before tuning motion.

