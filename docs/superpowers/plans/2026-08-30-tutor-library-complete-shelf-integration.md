# Tutor Library Complete Shelf Integration Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Integrate the approved imperative Complete Shelf physical book engine into the existing data-driven Tutor Library room, using canonical DA tutor content, robust interaction states, and rendered evidence without regressing the approved rig.

**Architecture:** The Complete Shelf factory remains the sole owner of hardcover geometry, page pivots/deformation, materials, opening, page-turn settling, closing, and reset. DA code owns presentation canvases, room/root transforms, catalogue mapping, shelf/extraction/reading motion, UI, accessibility, fallbacks, and QA state selection. R3F hosts the ordinary Three.js hierarchy through the existing primitive/object bridge; the rig internals are not rewritten into JSX.

**Tech Stack:** React 18, TypeScript, Vite, React Three Fiber, Three.js, Vitest, CanvasTexture-based artwork, existing Browser QA tooling.

**Spec:** `C:\Users\phill\.codex\attachments\9ed06e55-2734-42b5-80bb-0ecef86c801c\pasted-text.txt`

## Global Constraints

- Preserve the approved Complete Shelf physical engine: same boards, spine, binding, page block, six-page pivots, deformation/twist equations, opening, settling, close/reset behavior, material response, and one persistent physical root.
- Keep the extracted factory as ordinary imperative Three.js. R3F may mount it through `primitive`/`object`; do not rewrite physical internals into JSX.
- DA owns only presentation content and transforms outside the rig: room, shelves, world/root motion, tutor data/artwork, camera, extraction/preview/reading/return, accessibility, and fallback.
- Opening occurs only after the whole closed book has cleared the furniture and reached its free reading pose. Never alter page physics to solve furniture collision.
- Use `src/data/teacherCatalogue.ts` as the canonical tutor source. Start with Jenny (`T003`, Mrs Jenny N.) and `/teachers/jenny.png`; do not use conflicting legacy `src/data/teachers.ts` data or invent copy.
- A tutor with multiple subjects may have multiple shelf editions, but every edition resolves to one canonical `tutorId` and one canonical record.
- Preserve the existing `RoomRotunda`, subject-wall data model, spatial corner camera turn, TutorBookEdition mapping, conventional `/find-teacher?tutor=<id>` route, and all approved reference/extracted/R3F development routes.
- Shelf return must be deterministic: close/reset physical state before transit, interpolate from the currently sampled transform, restore the exact stored shelf transform and neighbour state, retain the same logical/physical root identity, and exhibit no drift over ten cycles.
- Desktop, touch, keyboard, visible focus, live-region status, Escape recovery, reduced-motion readability, image/WebGL fallback, resize recovery, and hidden-tab recovery are required parts of the interaction—not post-hoc polish.
- Avoid React state updates on every frame. Use refs/Three objects for frame interpolation and publish semantic state only at meaningful transitions.
- Make local milestone commits only. Do not push, merge, publish, or remove the isolated/reference routes.
- Tests are written failing first for new state/motion behavior. Final claims require unit tests, typecheck, build, rendered browser QA, console inspection, hostile-sequence checks, and screenshot evidence.

### Task 1: Add the canonical DA presentation seam to the imperative rig

**Files:**
- Create: `src/features/tutor-library/complete-shelf-presentation.ts`
- Create: `src/features/tutor-library/complete-shelf-presentation.test.ts`
- Modify: `public/dev/complete-shelf-rig/complete-shelf-book-rig.js`
- Modify: `src/features/tutor-library/CompleteShelfR3FCheckpoint.tsx`
- Modify: `src/features/tutor-library/TutorBookStudio.tsx`
- Modify: `package.json`

**Requirements:**

1. Write failing tests for canonical Jenny field selection, portrait URL/fallback behavior, deterministic cover/spine/interior canvas output metadata, and rejection of physical-dimension/physics overrides.
2. Build a DA-owned presentation adapter that accepts `CatalogueTutor` and produces high-resolution cover, spine, back, endpaper, and interior-page canvases using only canonical fields.
3. Add a narrow public presentation seam to `createCompleteShelfBookRig` that applies supplied canvas/image sources and presentation colours to the factory's existing textures/materials without changing any geometry, pivots, deformation equations, controller timing, or root lifecycle.
4. Keep the default Complete Shelf presentation byte-for-behavior compatible when no DA presentation is supplied so the three approved comparison routes remain valid.
5. Make the R3F checkpoint and tutor-book studio capable of selecting the Jenny presentation through a deterministic query state, while preserving every existing diagnostic state.
6. Verify the Complete Shelf factory contract tests, presentation tests, R3F state tests, typecheck, and a production build.
7. Commit as a local Stage 3 milestone.

### Task 2: Build deterministic book lifecycle and root-motion contracts

**Files:**
- Modify: `src/features/tutor-library/tutor-library-state.ts`
- Modify: `src/features/tutor-library/tutor-library-state.test.ts`
- Modify: `src/features/tutor-library/tutor-book-motion.ts`
- Modify: `src/features/tutor-library/tutor-book-motion.test.ts`
- Create: `src/features/tutor-library/tutor-book-lifecycle.ts`
- Create: `src/features/tutor-library/tutor-book-lifecycle.test.ts`

**Requirements:**

1. Write failing reducer/motion tests for all legal lifecycle transitions and illegal no-ops, transition-generation IDs, stale completion rejection, hover A-to-B, click during extraction, Escape from every transient/reading state, selected-B-while-A-returns, rapid wall turns, resize, visibility resume, repeated open/close, and ten full cycles.
2. Extend the semantic reducer through hover intent, extraction, preview, opening, reading, page dragging/turning/settled, closing, reset, returning, and restored idle states without frame-by-frame React updates.
3. Add a lifecycle coordinator contract that stores shelf local/world matrices, root UUID, neighbour poses, and sampled current transform; interruptions always continue from the sampled pose.
4. Require controller close/reset completion and zero cover/page/deformation residue before shelf return begins.
5. Restore stored transforms within `1e-6` and prove zero accumulated drift over ten cycles.
6. Make wall-turn math derive from the actual wall count and cover 3–6 wall configurations.
7. Add a reduced-motion timing policy that preserves immediate readable semantic states.
8. Run focused tests, all Tutor Library tests, typecheck, and build; commit locally.

### Task 3: Mount the imperative rig as the active TutorBookEdition

**Files:**
- Create: `src/features/tutor-library/CompleteShelfTutorBookBridge.tsx`
- Create: `src/features/tutor-library/complete-shelf-book-pool.ts`
- Create: `src/features/tutor-library/complete-shelf-book-pool.test.ts`
- Modify: `src/features/tutor-library/TutorBook.tsx`
- Modify: `src/features/tutor-library/TutorShelf.tsx`
- Modify: `src/features/tutor-library/RoomRotunda.tsx`
- Modify: `src/features/tutor-library/TutorLibraryScene.tsx`

**Requirements:**

1. Write failing pool/identity tests before implementation.
2. Replace the selected edition's approximate JSX physical book with the same imperative Complete Shelf hierarchy mounted through a minimal R3F primitive bridge.
3. Keep one logical edition per `TutorBookEdition`; inactive shelf editions may use a geometrically matching dormant/proxy representation only when the handoff is visually seamless and the canonical selected book uses the real rig before motion begins.
4. Lazily create and retain expensive page rigs by stable edition ID. Never recreate the active root during extract/open/read/close/return.
5. Apply DA shelf/extract/preview/reading transforms only to an outer motion root; do not mutate internal Complete Shelf pivots for room positioning.
6. Rotate the closed shelf book spine-out at the outer root, add hover intent, subtle neighbour response, and ensure the whole closed book clears the cabinet before controller opening is allowed.
7. Connect canonical Jenny presentation first, while keeping the bridge data-driven for all catalogue editions.
8. Verify identity, dormancy, exact transform handoff, existing Complete Shelf tests, Tutor Library tests, typecheck, and build; commit locally.

### Task 4: Wire room interaction, controls, accessibility, and fallback

**Files:**
- Modify: `src/features/tutor-library/TutorLibrary.tsx`
- Modify: `src/features/tutor-library/TutorLibraryScene.tsx`
- Modify: `src/features/tutor-library/RoomRotunda.tsx`
- Modify: `src/features/tutor-library/TutorShelf.tsx`
- Modify: `src/features/tutor-library/tutor-library.css`
- Modify: `src/pages/Tutors.tsx`
- Create: `src/features/tutor-library/tutor-library-interaction.test.ts`

**Requirements:**

1. Add failing interaction tests for pointer, touch, keyboard, Escape, focus return, selection switching, and disabled/conflicting actions during transitions.
2. Drive active wall, hover/extract/preview/open/read/page/close/return through the semantic reducer and lifecycle coordinator; do not add a second competing state machine.
3. Preserve the existing spatial corner camera turn and data-driven wall architecture. Queue or reject hostile rapid turns deterministically.
4. Provide semantic tutor-book controls with Enter/Space activation, visible focus, live status, page controls, Close/Return, and a real profile link to `/find-teacher?tutor=<id>`.
5. Ensure touch does not depend on hover and mobile controls remain reachable without horizontal overflow.
6. Implement reduced-motion transitions that retain clear intermediate meaning without long movement.
7. Add graceful Canvas/WebGL and portrait-load fallback leading to the conventional searchable tutor route.
8. Keep the interactive library behind the existing explicit preview/development entry unless the spec's existing route already authorizes replacement; do not silently remove the production TutorOrbit fallback.
9. Run focused tests, accessibility-relevant browser checks, all Tutor Library tests, typecheck, and build; commit locally.

### Task 5: Print canonical tutor profile pages onto the six-page rig

**Files:**
- Create: `src/features/tutor-library/tutor-book-pages.ts`
- Create: `src/features/tutor-library/tutor-book-pages.test.ts`
- Modify: `src/features/tutor-library/complete-shelf-presentation.ts`
- Modify: `public/dev/complete-shelf-rig/complete-shelf-book-rig.js`
- Modify: `src/features/tutor-library/CompleteShelfTutorBookBridge.tsx`
- Modify: `src/features/tutor-library/TutorLibrary.tsx`

**Requirements:**

1. Write failing tests proving each spread uses canonical `motto`, `tagline`, profile tags, `whyDA`, `goals`, `remembered`, name, designation, and subjects with explicit fallbacks and no invented prose.
2. Render high-resolution printed CanvasTextures for the existing six physical page meshes, keeping the physical page count and deformation system unchanged.
3. Keep copy legible at desktop/tablet/mobile reading poses and within print-safe margins; use the registered DA brand reference and premium restraint.
4. Connect Previous/Next buttons, touch gestures where reliable, keyboard arrows/PageUp/PageDown, and reducer/controller page states. Prevent overlapping turns and make Escape close/reset safely.
5. Ensure settled pages remain settled until the next explicit action and close/reset restores all six pages before return.
6. Verify page-content tests, controller state tests, rendered reading states, typecheck, and build; commit locally.

### Task 6: Responsive, performance, and visual polish pass

**Files:**
- Modify: `src/features/tutor-library/tutor-library.css`
- Modify: `src/features/tutor-library/TutorLibrary.tsx`
- Modify: `src/features/tutor-library/TutorLibraryScene.tsx`
- Modify: `src/features/tutor-library/RoomRotunda.tsx`
- Modify: `src/features/tutor-library/CompleteShelfTutorBookBridge.tsx`
- Modify: `src/features/tutor-library/tutor-library-debug.ts`

**Requirements:**

1. Tune camera/read pose/control layout for 1920, 1440, 1366, 1024 tablet, and 390x844 mobile without changing the approved physical book geometry.
2. Keep typography, warmth, restraint, and hierarchy aligned with the registered DA brand; do not redesign the neutral studio or approved room architecture.
3. Bound DPR, reuse textures/materials where safe, suspend dormant rig updates, avoid unnecessary allocations, and confirm semantic React state does not update each frame.
4. Add stable debug attributes/query selectors for phase, transition ID, edition, wall, root UUID, matrix delta, reset state, review view, and deterministic QA progress without leaking into normal presentation.
5. Run the Impeccable detector/audit on touched UI files and fix only in-scope Tutor Library findings.
6. Perform rendered desktop/tablet/mobile, touch, keyboard, visible-focus, reduced-motion, resize, and console QA; commit locally.

### Task 7: Build and capture the final acceptance evidence

**Status:** acceptance harness implemented; final evidence must be regenerated after the user-directed interaction simplification below.

**Ruling (2026-08-30):** User feedback supersedes the always-visible tutor-name strip and hover-preview acceptance behavior. Subject tabs remain visible, tutor names move into one progressive-disclosure picker, and the full Complete Shelf rig is acquired only after explicit click/tap/select activation. Hover is intentionally lightweight. Existing pre-ruling captures are not final evidence.

**Files:**
- Create: `scripts/capture-tutor-library-acceptance.mjs`
- Create: `src/features/tutor-library/tutor-library-acceptance.test.ts`
- Modify: `package.json`
- Modify: `docs/superpowers/plans/2026-08-30-tutor-library-complete-shelf-integration.md`

**Requirements:**

1. Add deterministic acceptance assertions and scripts for unit tests, typecheck, production build, browser lifecycle QA, console health, exact return, root persistence, page reset, accessibility, responsiveness, and hostile sequences.
2. Capture one manifest-bound set of 24 screenshots: room idle at 1920/1440/1366; tablet tap preview; 390x844 reading; turn start/50%/settled; shelf rest; extract 50%; cover preview; open 50%; reading open; page 25/50/75/settled; close 50%; return 50%; exact shelf restored; keyboard focus reading; reduced-motion readable; Escape mid-opening restored; rapid-switch/resize/visibility-resume stable.
3. Store screenshots, manifest, console log, lifecycle trace, and matrix snapshots in the designated evidence folder outside the repository and include the exact commit hash and localhost URLs.
4. Directly compare the preserved standalone extracted-rig and R3F routes for closed three-quarter, half open, fully open, page turn 50%, page settled, and closed/reset to prove the bridge remains non-regressive.
5. Exercise at least ten full select/open/page/close/return cycles and the hostile sequences from Task 2 in the rendered application.
6. Run the complete validation suite from a clean worktree, inspect all 24 screenshots, fix any in-scope defect through the review process, and make the final local milestone commit.
7. Record final evidence paths, URLs, remaining defects, performance notes, architecture summary, and the licensing reminder. Do not push or merge.

Task 7 keeps the 24-file integrated screenshot inventory as a versioned contract, adds deterministic query-selected QA states that still use the production room/motion-root/imperative-controller path, exercises ten live lifecycle cycles plus hostile sequences, captures matched proxy/primitive seam frames, and compares the six approved standalone/R3F states directly. `manifest.json` is the authority for the exact source commit, URL, viewport, phase, physical root UUID, matrix delta, reset residue, controller progress, and console status of every frame.
