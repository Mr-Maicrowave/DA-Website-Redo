# Task 6 report: responsive, performance, reduced-motion, and diagnostic polish

## Status

Implemented and locally committed in the isolated `codex/tutor-library-3d` worktree. Task 6 remains separate from Task 7. The approved Complete Shelf physical rig, `RoomRotunda` architecture, canonical tutor content, semantic lifecycle, and preview gate were preserved.

## Responsive outcome

- Added deterministic presentation-only camera profiles for the required 1920, 1440, 1366, 1024, and 390 widths. Room-idle architecture retains its original target; book phases use a closer target and bounded FOV without altering physical book geometry.
- The mobile reading camera compensates for the real rig's asymmetric spine opening, so the complete spread is centred rather than clipped off the left edge.
- The library now fits below the site navigation. The 390x844 reading layout keeps the open book in the upper canvas, removes only the inactive shelf-book grid, retains the wall selector, uses a compact two-column reader, preserves the profile link, and keeps every action at 44 CSS pixels or larger.
- Tablet and laptop reading views keep the physical book left of the semantic reader rather than underneath it. No tested viewport introduced horizontal page overflow.

## Performance outcome

- Canvas DPR is bounded by viewport profile: 1.5 desktop/laptop, 1.4 tablet, and 1.25 mobile.
- Removed the redundant unconditional `useFrame` camera write. Camera projection now updates only when semantic/presentation inputs or viewport size change.
- Preserved the three-rig dormant pool bound and the existing inactive-bridge early return, so dormant controllers do not update.
- Hoisted static room corners, floor-board data, wall-edition groupings, and wall width. Cabinet materials are cached and shared by physical material signature; the walnut texture remains shared.
- Memoized page-turn timing and avoided constructing a phase command string on every active controller frame outside page turns.
- The existing reducer test continues to prove legal lifecycles advance without frame-level semantic state. Presentation progress remains separate from reducer state.

## Stable QA diagnostics

The production root now exposes stable, presentation-inert selectors/attributes:

- `[data-tutor-library-qa="root"]`
- `data-library-phase`
- `data-library-transition-id` and `data-library-generation`
- `data-library-edition` and `data-library-wall`
- `data-library-root-uuid` (the mounted factory root UUID, not a logical substitute)
- `data-library-matrix-delta`
- `data-library-reset-state`
- `data-library-review-view`, `data-library-review-progress`, and `data-library-qa-progress`

Browser evidence reached `BOOK_READING` with a real UUID and `data-library-matrix-delta="0.000000"`. The idle proxy and mounted primitive were reviewed before/after interaction with no visible transform jump; this closes the deferred Task 3 proxy-to-primitive seam inspection at the available sampled boundary.

## Impeccable scoped audit

Touched Tutor Library files were scanned before and after with the local Impeccable detector; both scoped runs returned `[]`.

Audit health: 18/20 (Excellent): accessibility 4, performance 3, responsive 4, theming 3, anti-patterns 4.

In-scope findings fixed:

- P1 mobile reader/shelf-control occlusion.
- P1 selected-book desktop activation accidentally blocked by presentation-only pointer suppression during the first polish iteration (caught in Browser QA and corrected).
- P2 focus-scroll caused by a full-viewport scene below the site navigation.
- P2 redundant per-frame camera projection writes and repeated room material/array allocations.
- P2 mobile open-book crop caused by the rig's asymmetric spine origin.
- P3 wide border-plus-shadow combinations on Tutor Library panels.

The detector surfaced three pre-existing findings only when the fixture imported global `src/index.css` (`side-tab`, `gradient-text`, and `gray-on-color`). They are unrelated site CSS and were kept out of Task 6 scope as required.

## Verification evidence

Completed:

- Focused viewport/QA/matrix tests: 5/5 pass.
- Aggregate TypeScript Tutor Library/Complete Shelf tests: 106/106 pass.
- Production-styled semantic DOM test: pass after the final CSS change. It covers native click/Enter/Space, horizontal swipe, Arrow/Page keys, Escape, focus return, disabled controls, fallback, 390px reflow, 44px actions, hidden inactive mobile shelf controls, and no horizontal overflow.
- TypeScript typecheck: exit 0 after the React/Three changes (before the final CSS/test-fixture-only adjustments).
- Focused ESLint: 0 errors; one existing fixture-only Fast Refresh warning.
- `git diff --check`: exit 0 before the final report-only handoff.
- Browser page identity, meaningful DOM, no framework overlay, real interaction flow, resize continuity, diagnostics, and console inspection completed.
- Browser console had no application errors. Existing React Router future-flag notices and the approved public rig's duplicate-Three warning remain.
- `public/sitemap.xml` was unchanged; no restoration was required.

Explicitly uncompleted after the instruction to stop adding checks:

- A fresh final production build was not run in Task 6.
- The aggregate `npm run test:tutor-library` command's TypeScript portion passed 106/106, but that combined invocation exited 1 on an interim mobile-height assertion. The corrected DOM constituent was rerun separately and passed; the combined wrapper was not rerun after the stop instruction.
- The in-app Browser exposes viewport control but not media emulation. The existing reduced-motion lifecycle unit test passed and the production CSS/JS reduced-motion contracts remain in place, but an attempted second full-route headless media-emulation pass timed out before the Tutor Library root mounted. No reduced-motion screenshot is claimed.
- Browser production interaction used real pointer and keyboard flows; touch/swipe behavior was verified in the production-styled DOM gate, not on a physical touch device.
- A separate Task 7 acceptance/capture pass was not started.

## Rendered evidence

- `.superpowers/sdd/2026-08-30-tutor-library-complete-shelf-integration/task-6-evidence/desktop-1920-idle.png`
- `.superpowers/sdd/2026-08-30-tutor-library-complete-shelf-integration/task-6-evidence/desktop-1440-reading.png`
- `.superpowers/sdd/2026-08-30-tutor-library-complete-shelf-integration/task-6-evidence/laptop-1366-reading.png`
- `.superpowers/sdd/2026-08-30-tutor-library-complete-shelf-integration/task-6-evidence/tablet-1024-reading-resize.png`
- `.superpowers/sdd/2026-08-30-tutor-library-complete-shelf-integration/task-6-evidence/mobile-390-reading.png`

These local evidence images are intentionally ignored by git; the report and implementation are committed, while Task 7 retains ownership of final acceptance captures.

## Concerns / remaining boundary

- The public Complete Shelf factory imports its vendored Three.js build, so Browser logs retain the existing `Multiple instances of Three.js` warning. Replacing the factory's runtime dependency would alter the approved rig boundary and is outside this polish task.
- Existing global site CSS findings and React Router future-flag notices remain outside Tutor Library scope.
- Final build and reduced-motion capture belong in the next explicitly authorized acceptance pass.
