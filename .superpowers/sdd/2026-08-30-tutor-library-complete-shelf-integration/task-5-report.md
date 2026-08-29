# Task 5 report: canonical tutor profile pages on the six-page rig

## Status

Implemented in the isolated `codex/tutor-library-3d` worktree. Jenny's existing Complete Shelf rig now receives six high-resolution DA presentation canvases built only from `teacherCatalogue.ts` and the conventional `profileContentFor` fallbacks. Previous/Next, horizontal swipe, ArrowLeft/ArrowRight, PageUp/PageDown, real controller progress, reverse settling, and Escape reset are wired through the existing reducer lifecycle.

## RED evidence

1. The first page-content run failed with `ERR_MODULE_NOT_FOUND` for `tutor-book-pages.ts`, proving no canonical six-page model existed.
2. Presentation tests initially failed because the seam still created eight generic 1024x1536 canvases and did not print all canonical Jenny fields within the required safe area.
3. The real factory-controller regression initially settled a backward turn from one page to two and failed to map all six presentation canvases to the six existing leaves.
4. The focused DOM interaction regression initially lacked directional page controls, bounded Previous/Next state, keyboard pagination, and a reliable swipe path.

## Current GREEN evidence

- Page model and presentation tests: 14/14 pass, including realistic Georgia measurement and full canonical `whyDA` preservation.
- Real Complete Shelf controller and presentation seam tests: 3/3 pass.
- Complete Shelf studio tests: 2/2 pass.
- Complete Shelf R3F tests: 5/5 pass.
- Aggregate Tutor Library/Complete Shelf TypeScript tests: 102/102 pass.
- Production semantic DOM controls: pass, including directional buttons, Arrow/Page keys, horizontal swipe, and the final `Page 5 of 5` boundary.
- Focused ESLint over modified TypeScript/TSX: 0 errors; one existing fixture-only Fast Refresh warning.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd run build`: exit 0; encoding check passed, 3,982 modules transformed, and the generated 80-URL sitemap was restored afterward.
- `git diff --check`: exit 0.

## Canonical page and presentation contract

- Six pages form three deterministic pairs: Profile / Approach and strengths, Why DA / Teaching goals, What students remember / Subjects and strengths.
- Printed source text is limited to canonical name, designation, tagline, motto, subjects, profile tags, `whyDA`, `goals`, and `remembered`. Missing profile prose falls back explicitly through `profileContentFor`; missing tags become an empty list.
- Interior canvases are 1536x2048. Text and rules stay inside the tested 9% horizontal and 6–94% vertical print-safe area.
- DA navy, gold, ivory, restrained serif/sans hierarchy, folios, and small section labels are presentation-only inputs. The conventional profile link remains `/find-teacher?tutor=T003`.

## Controller and lifecycle evidence

- The factory still constructs exactly six page pivots with 18x8 flexible-page segments. Pivot construction, bend/twist equations, and the existing page-turn timing policy are unchanged.
- Each existing leaf receives one of the six presentation canvases only when a DA presentation is supplied; the no-presentation material fallback remains intact.
- Forward and reverse turns are bounded at zero and four while all six existing leaves retain printed textures. A settled leaf remains stable across repeated controller updates until another explicit action.
- Page progress advances over the existing 760ms standard / 120ms reduced-motion policy; reducer availability, boundary checks, and the physical-settle proof prevent overlapping turns.
- Close and Escape clear settled-page UI state, then the existing close/reset/return lifecycle restores all six pivots and zero deformation before `ROOM_IDLE`.

## Initial rendered reading smoke

- The actual `/tutors?library-preview=1` scene reached `BOOK_READING` with Jenny at the default desktop viewport, 1024x768, and 390x844.
- Before fix round 1 corrected the status denominator, desktop Next reached real `PAGE_SETTLED`; Escape then removed the reader and returned the shelf to `ROOM_IDLE`. The current five-state boundary is covered by the production DOM smoke and real-controller tests above.
- Tablet and mobile checks retained enabled bounded pagination and the exact conventional profile route. Mobile Escape also returned to `ROOM_IDLE`.
- Screenshots confirmed the real book uses the generated printed textures, not an HTML or SVG page substitute.

## Concerns / limits

- At 390x844 the existing Task 4 reader-control panel covers much of the 3D book, so although the canonical page textures and controls work, the smallest-width composition still needs the planned Task 6 responsive polish before final screenshot acceptance. This task did not alter reading-pose geometry or redesign the controls.
- Headless Chrome cannot create its profile inside the managed filesystem sandbox. The DOM suite passed unchanged when run with the required browser-process permission; this was an environment boundary, not an application failure.
- Browser logs retain the pre-existing React Router future-flag notices and fixture `act(...)` warnings. No application page error occurred.
- The production build retains the repository's existing large-chunk warning.

## Commit

Local Task 5 commit in `codex/tutor-library-3d`; see the adjacent git history entry for the hash.

## Fix round 1

### RED evidence

1. With realistic font-size-aware Georgia metrics, the canonical `whyDA` presentation test failed its print-safe baseline assertion; the earlier fixed line height pushed text below the approved bottom bound.
2. The default navigation regression returned target 5 from settled target 4, proving the UI had conflated six printed canvases with six legal turns.
3. The real controller snapshot had no physical-settle proof, accepted another command while the first leaf was converging, and still allowed six settled turns instead of the approved four.
4. `getControllerCompletionEvent` emitted `PAGE_TURN_COMPLETE` from command progress 1 even when the target pivot had not settled.
5. The browser DOM boundary test left Next enabled at the final reachable reading state and reported six states instead of five.

### GREEN evidence

- Page/presentation tests: 14/14 pass, including full canonical `whyDA` reconstruction, realistic measured line widths, 32px minimum font floor, and every baseline at or above the bottom print-safe boundary.
- Real factory controller tests: 2/2 pass. The snapshot reports six physical pivots, four paginated leaves, rejects a fifth turn, rejects overlap before convergence, and proves `pageSettled` only after pivot, position, curve, twist, and velocities enter the deterministic epsilon.
- Interaction/completion tests: 12/12 pass; command progress and `settlePage` alone cannot complete `PAGE_TURNING`.
- Aggregate Tutor Library/Complete Shelf TypeScript tests: 102/102 pass, followed by the green production semantic DOM test.
- Complete Shelf studio tests: 2/2 pass. Complete Shelf R3F tests: 5/5 pass.
- Focused ESLint: 0 errors; the existing fixture-only Fast Refresh warning remains.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd run build`: exit 0; encoding passed, 3,982 modules transformed, and the generated sitemap was restored.

### Corrections

- Long canonical prose now uses real `measureText` wrapping and deterministic font fitting. It reduces one pixel at a time only as needed, never below 32px, and throws rather than silently truncating if content cannot fit.
- All six existing leaf materials retain their canonical CanvasTextures. `PAGINATED_LEAF_COUNT` is restored to four, so the two approved static leaves remain static and the user sees five reachable reading states.
- Previous/Next, keyboard, swipe, status, and boundary logic now share the four-turn controller contract. Next disables at `Page 5 of 5`.
- `settlePage` commits the target but does not complete the reducer phase. The factory snapshot exposes `pageSettled` only after the unchanged page geometry/deformation converges within `0.001`; the bridge withholds the next reducer state and settled-page UI update until that proof.

### Concerns

- No new physics, pivots, deformation equations, segments, or timing values were introduced. The convergence predicate duplicates the existing target equations read-only; future intentional physics changes must update that observer alongside the source equations.
- Existing React Router notices, fixture `act(...)` warnings, and the production large-chunk warning remain unchanged.
