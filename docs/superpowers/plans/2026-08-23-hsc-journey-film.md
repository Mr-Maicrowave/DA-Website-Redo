# HSC Journey Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one continuous scroll-controlled illustrated HSC film below the existing hero.

**Architecture:** A focused React component owns one pinned stage and creates one scoped GSAP master timeline. Scene groups are absolute depth layers; a persistent cap, persistent gold SVG path, physical wipes, copy tracks, and responsive/reduced-motion variants provide continuity.

**Tech Stack:** React 18, TypeScript, GSAP 3.15, ScrollTrigger, MotionPathPlugin, CSS masks/transforms.

**Spec:** `docs/superpowers/specs/2026-08-23-hsc-journey-film-design.md`

## Global Constraints

- One pinned viewport, one cap element, one master timeline, one ScrollTrigger.
- No full-screen crossfades, blank frames, duplicate caps, humans, particles, WebGL, or unrelated page changes.
- Preserve reverse scrolling, responsive layouts, reduced motion, and GSAP cleanup.

### Task 1: Structural contract

**Files:** Create `src/components/hsc-journey/HSCJourneyFilm.test.ts`.

- [ ] Assert one timeline, MotionPathPlugin, the complete asset map, reduced motion, and integration below the hero.
- [ ] Run the test and confirm it fails before implementation.

### Task 2: Journey component

**Files:** Create `src/components/hsc-journey/HSCJourneyFilm.tsx` and `src/components/hsc-journey/hsc-journey-film.css`.

- [ ] Build semantic mounted scene layers, one persistent cap, path SVG, paper/sky mask, and story-copy track.
- [ ] Preload critical assets and refresh ScrollTrigger after decode.
- [ ] Implement one labelled master timeline with camera/parallax/object transitions.
- [ ] Add tablet/mobile tuning, static reduced-motion flow, and cleanup.

### Task 3: Page integration

**Files:** Modify `src/pages/HSCExcellence.tsx`.

- [ ] Replace only `HSCVisionStory` with `HSCJourneyFilm`.
- [ ] Preserve hero, navigation, and detailed program content.

### Task 4: Verification

- [ ] Run component contract test and TypeScript.
- [ ] Run production build.
- [ ] Browser-test forward/reverse scroll, resize, desktop/tablet/mobile, reduced motion, and console output.

