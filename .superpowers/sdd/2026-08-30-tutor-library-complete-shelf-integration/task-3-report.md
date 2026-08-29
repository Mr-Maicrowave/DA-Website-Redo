# Task 3 Report — Imperative Complete Shelf rig in TutorBookEdition

Date: 2026-08-30

Worktree: `C:\Projects\DA-Website-Redo\.worktrees\codex-tutor-library-3d`

Branch: `codex/tutor-library-3d`

## Outcome

- The room now mounts the approved imperative `createCompleteShelfBookRig` hierarchy for the active `TutorBookEdition` through `CompleteShelfTutorBookBridge`; the factory mechanics were not copied or rewritten.
- Hover first leases and mounts the factory rig. Selection is dispatched only from the post-mount callback with `rig.root.uuid`, replacing Task 2's temporary logical production identifier before hover intent or extraction can begin.
- One DA-owned outer group applies shelf, spine-out rotation, hover, extraction, preview, reading, neighbour, reset, and return transforms. The bridge sends only open/close/reset commands to the internal controller.
- Inactive editions use a closed Complete Shelf-proportioned proxy. Proxy and rig occupy the same outer transform, and the proxy remains visible until the real primitive has mounted.
- The pool is lazy and edition-keyed. It coalesces concurrent requests, retains the same root for the active lifecycle, suspends dormant controller updates, keeps three dormant rigs, deterministically evicts the oldest unleased rig, and never evicts a leased active root.
- Shelf rendering deterministically selects one edition per physical cabinet slot. Primary and Mathematics now render 24 non-overlapping slots instead of allowing rows 25+ to collapse visibly onto row three. Jenny (`T003:primary`) remains the first Primary edition, and an explicitly selected overflow edition replaces only its collided proxy slot.
- Controller opening is allowed only from `BOOK_OPENING` and open reading/page phases, after the outer root has completed its closed-book clearance and reading transit.
- The reference, extracted factory, R3F checkpoint, studio routes, and legacy JSX studio engine remain present.

## RED evidence

Pool/identity tests were written before implementation.

Initial missing-contract run:

```text
node --test --experimental-strip-types src/features/tutor-library/complete-shelf-book-pool.test.ts
Result: 5 failed, 0 passed.
Failures: pool acquisition unimplemented; visible selection empty; closed handoff unimplemented.
```

Outer-motion/controller-gate follow-up RED:

```text
node --test --experimental-strip-types src/features/tutor-library/complete-shelf-book-pool.test.ts
Result: 2 failed, 5 passed.
Failures: BOOK_OPENING remained disallowed; outer motion contract was unimplemented.
```

Pending-eviction regression RED:

```text
node --test --experimental-strip-types src/features/tutor-library/complete-shelf-book-pool.test.ts
Result: 1 failed, 7 passed.
Failure: a pending dormant rig was disposed twice after resolving post-eviction (expected 1, received 2).
```

## GREEN evidence

Focused pool/identity suite:

```text
node --test --experimental-strip-types src/features/tutor-library/complete-shelf-book-pool.test.ts
Result: 8 passed, 0 failed.
```

Focused integration/lifecycle suite:

```text
node --test --experimental-strip-types \
  src/features/tutor-library/complete-shelf-book-pool.test.ts \
  src/features/tutor-library/tutor-library-state.test.ts \
  src/features/tutor-library/tutor-book-lifecycle.test.ts \
  src/features/tutor-library/complete-shelf-r3f-state.test.ts
Result: 38 passed, 0 failed.
```

All Tutor Library and Complete Shelf verification:

```text
node --test --experimental-strip-types <all src/features/tutor-library/*.test.ts and *.test.mjs>
Result: 78 passed, 0 failed.

npm.cmd run test:complete-shelf-reference
Result: passed.

npm.cmd run test:complete-shelf-rig
Result: passed.

npm.cmd run typecheck
Result: exit 0.

npm.cmd run build
Result: exit 0; encoding passed for 1119 text files, 80 sitemap URLs generated, TypeScript passed, and Vite transformed 3980 modules.
```

The build emitted only the repository's existing large-chunk advisory. `public/sitemap.xml` was restored to `HEAD` after the build.

Touched-file lint and whitespace verification:

```text
npm.cmd exec -- eslint <all touched Task 3 source/test files>
Result: exit 0, no findings.

git diff --check
Result: exit 0.
```

## Files changed

- `src/features/tutor-library/CompleteShelfTutorBookBridge.tsx` (new)
- `src/features/tutor-library/complete-shelf-book-pool.ts` (new)
- `src/features/tutor-library/complete-shelf-book-pool.test.ts` (new)
- `src/features/tutor-library/TutorBook.tsx`
- `src/features/tutor-library/TutorShelf.tsx`
- `src/features/tutor-library/RoomRotunda.tsx`
- `src/features/tutor-library/TutorLibraryScene.tsx`
- `src/features/tutor-library/TutorLibrary.tsx`

## Self-review

- Production Tutor Library code no longer creates or dispatches `logical:tutor-book:*`; only the real factory UUID crosses the selection boundary.
- The factory root is a child of the outer motion group and is never repositioned through its internal `codex-motion`, cover pivots, or page pivots.
- The active bridge remains mounted from post-hover handoff through extraction/open/read/close/reset/return. It becomes a retained dormant pool entry only after restored idle.
- Pool eviction excludes leased entries, handles rejected creation, and disposes pending post-eviction rigs exactly once.
- All 76 catalogue editions remain logical/data entries. Only 24 unique physical slots per over-capacity wall render at once, and expensive rigs are created only on hover intent.
- Existing studio diagnostics continue through the preserved legacy JSX branch; the room path alone uses the imperative bridge.

## Concerns / next-task boundary

- Task 3 supplies controller commands and real root identity, but Task 4 still owns the complete room controls/accessibility wiring and semantic completion callbacks for open, page turn, close, reset, and return.
- No new screenshot/browser acceptance gate was requested for this milestone. The production build and route contracts pass; rendered responsive, touch, keyboard, reduced-motion, resize, and console evidence remains explicitly assigned to Tasks 6–7.
- The existing Vite large-chunk advisory is unchanged.

---

## Fix round 1 — sampled cancellation pose and bounded intent ownership

### Changes

- Replaced phase-only production pose selection with `CompleteShelfOuterMotionState`, which samples the last committed outer pose, holds it through `BOOK_CLOSING` and `BOOK_RESETTING`, and uses Task 2's `createBookReturnMotion`/`interpolateBookMotion` contract to return from that exact sample.
- Added production-path cancellation coverage for close, leave, and Escape from hover, preview, reading transit, and extraction progress `.17`, `.49`, and `.83`. Return progress zero is the interruption sample and progress one is the exact closed shelf transform.
- Moved rig intent ownership from per-book local state to one scene-wide `rigIntentEditionId`. A superseding hover causes the prior bridge to unmount and release immediately; inactive books reject pointer acquisition outside `ROOM_IDLE`; the selected edition remains the sole leased owner during non-idle phases.
- Added pool snapshots and a hostile 20-book sweep test. With three dormant entries configured, retained rigs never exceed four while one intent is leased, leased rigs never exceed one, and release immediately restores the dormant bound of three.
- Supplemented the synthetic handoff assertion with the actual production outer-motion initial state, proving it uses the same closed pose and constants as the proxy/rig handoff.

### RED evidence

```text
node --test --experimental-strip-types src/features/tutor-library/complete-shelf-book-pool.test.ts
Result: 8 passed, 4 failed.
Failures:
- hostile sweep snapshot exceeded the configured bound;
- reset teleported from reading `[0, .48, 4.96]` to preview `[.12, .08, 4.82]`;
- hover/extraction cancellation teleported to preview instead of holding its sample;
- no single global rig-intent owner was enforced.
```

### GREEN evidence

```text
node --test --experimental-strip-types \
  src/features/tutor-library/complete-shelf-book-pool.test.ts \
  src/features/tutor-library/tutor-book-lifecycle.test.ts \
  src/features/tutor-library/tutor-library-state.test.ts
Result: 38 passed, 0 failed.

node --test --experimental-strip-types <all Tutor Library .test.ts/.test.mjs files>
Result: 82 passed, 0 failed.

npm.cmd run test:complete-shelf-reference
Result: passed.

npm.cmd run test:complete-shelf-rig
Result: passed.

npm.cmd run typecheck
Result: exit 0.

npm.cmd exec -- eslint <all touched fix-round source/test files>
Result: exit 0, no findings.

npm.cmd run build
Result: exit 0; encoding passed for 1120 text files, 80 sitemap URLs generated, TypeScript passed, and Vite transformed 3980 modules.
```

The build emitted only the existing large-chunk advisory. `public/sitemap.xml` was restored to `HEAD` after verification.

### Self-review / concerns

- The outer-motion ref is updated only after a committed React render, so a discarded concurrent render cannot replace the sampled visible pose.
- Candidate ownership is global to the scene rather than one local flag per book; no non-idle pointer event can start an inactive bridge lease.
- No UI controls, accessibility surface, factory mechanics, or route behavior were expanded in this fix round.
- Rendered seam evidence remains assigned to the later browser-QA task as previously documented.
