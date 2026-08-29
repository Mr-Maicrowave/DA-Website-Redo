# Task 4 report: Tutor Library interaction, controls, accessibility, and fallbacks

## Status

Implemented in the isolated `codex/tutor-library-3d` worktree. The `/tutors?library-preview=1` library now exposes semantic DOM book controls outside the Canvas while the existing Tutor Orbit remains the default `/tutors` experience.

## RED evidence

1. `tutor-library-interaction.test.ts` initially failed at module load because `getBookInteractionEvents` and the shared interaction policy did not exist.
2. The controller-completion test then failed because `getControllerCompletionEvent` did not exist.
3. Rendered Escape/focus QA exposed a regression: focus returned to Jenny's invoking control, but its `focus` handler reopened the just-returned book. A focused regression test failed because `shouldPreviewBookOnFocus` did not exist.
4. Desktop/mobile screenshots exposed the fixed site navigation clipping the library heading before the final CSS offset correction.

## GREEN evidence

- Focused interaction tests: 9/9 pass.
- Existing semantic reducer tests: 17/17 pass.
- All Tutor Library TypeScript tests: 90/90 pass.
- Complete Shelf presentation seam: 1/1 pass.
- Complete Shelf reference route verifier: pass.
- Complete Shelf rig route verifier: pass.
- Focused ESLint over all modified TypeScript/TSX files: exit 0.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd run build`: exit 0 (80-URL sitemap generated during the build, then restored).
- Final direct Vite production build after the visual offset correction: exit 0.

## Interaction and lifecycle wiring

- Pointer preview, touch/click activation, and native button keyboard activation all produce events for the existing `libraryReducer`; no second state machine was added.
- The room scene still owns one active Complete Shelf rig intent. Semantic controls request that intent and wait for the physical root UUID before reducer selection/open events are dispatched.
- Controller snapshots emit generation-bound `OPEN_COMPLETE`, `PAGE_TURN_COMPLETE`, `CLOSE_COMPLETE`, and root-bound `RESET_COMPLETE` events.
- Timed outer transitions emit generation-bound extraction, reading-pose, room-turn, and return completions.
- Wall turns are locked while a turn is active; browser QA confirmed a conflicting English action was disabled while turning to Mathematics, then Mathematics settled active.
- Escape closes reading/page states or resets preview/transit states. Browser QA reached `BOOK_READING`, `PAGE_SETTLED`, and then `ROOM_IDLE` after Escape.
- Focus returns to the invoking book control after the book reaches `ROOM_IDLE`, without retriggering preview.

## Accessibility and fallback evidence

- DOM snapshot confirmed labeled wall navigation, a labeled tutor-book control group, native buttons, pressed/disabled states, reader controls, a polite atomic live status, and a real `/find-teacher?tutor=T003` profile link.
- The reader uses the canonical portrait URL and replaces failed portraits with an initial fallback.
- Canvas errors and Complete Shelf rig-load errors are logged and surface a visible alert with a conventional searchable tutor-profile link.
- The default `/tutors` route rendered Tutor Orbit and did not render the library control group; `/find-teacher?tutor=T003` rendered Jenny's conventional profile dialog.
- At 390x844, page overflow was 0px, the book-control container overflow was 0px horizontally, minimum book-control height was 46.4px, and controls remained vertically scrollable/reachable.
- Final mobile screenshot placed the full heading below the fixed navigation (`top: 79px`) with 0px horizontal page overflow.
- Reduced-motion uses the existing tested timing policy, preserves semantic phases/live status, disables long movement, and suppresses nonessential CSS transition duration.

## Concerns / limits

- Browser QA did not intentionally disable WebGL or break a portrait request, so the forced failure presentations were not visually induced; normal Canvas and portrait loading completed with no application errors. The error boundary, rig-error propagation, portrait `onError`, fallback alert, and conventional links were typechecked and reviewed.
- The in-app browser did not expose reduced-motion emulation. Reduced-motion phase preservation is covered by the existing timing-policy test and the Task 4 interaction/status tests, but not by a forced reduced-motion screenshot in this run.
- The browser logs the pre-existing React Router future-flag warnings and a Complete Shelf warning about multiple Three.js instances. No application errors were recorded.
- The production build retains the repository's existing large-chunk warning.
- The deferred Task 3 production proxy/primitive visual handoff remains a rendered-QA item and was not rewritten here.

## Commit

Local Task 4 commit in `codex/tutor-library-3d`; see the adjacent git history entry for the hash.

## Fix round 1

### RED evidence

- The eviction/revisit regression test initially failed to load because no mounted-root ownership registry existed; the same test exercises four tutor rigs with a three-dormant-rig limit and rejects the evicted UUID.
- Delayed-ready cancellation tests initially failed to load because pending intents had no cancellable generation/token tracker.
- A headless-browser DOM verifier was attempted for real click, Enter/Space, Escape/focus return, disabled controls, and forced Canvas failure. Chrome required elevated launch permission; once launched, the scripted semantic book click remained at `ROOM_IDLE` rather than reaching `BOOK_READING`. Per the stop instruction, this was recorded and the experimental verifier was not committed.

### GREEN evidence

- Focused pool/interaction regression tests: 24/24 pass.
- All Tutor Library/Complete Shelf tests: 94/94 pass.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd run build`: exit 0; encoding check passed, 3,980 modules transformed, and the generated sitemap was restored afterward.

### Corrections

- Mounted root identities now follow live bridge leases: ready/acquire refreshes the edition's UUID, release/error clears only the matching mounted UUID, and a token-keyed bridge remount prevents old intent callbacks from owning a new request.
- Pending rig intent is generation-tokened. Leave, blur, Escape, and superseding selection invalidate older readiness callbacks, so late readiness cannot dispatch reducer events.
- Canvas failure disables every wall/book button and marks the interaction surface inert and `aria-disabled`; only the conventional tutor fallback remains actionable.
- Subject wall controls now meet the 44px minimum touch target.

### Remaining concern

- The requested real React DOM interaction automation is not green: the isolated headless-browser attempt did not advance the semantic click beyond `ROOM_IDLE`. Helper/reducer/pool coverage is green, but this browser-level activation path requires follow-up before claiming the Important DOM-test finding fully closed.
