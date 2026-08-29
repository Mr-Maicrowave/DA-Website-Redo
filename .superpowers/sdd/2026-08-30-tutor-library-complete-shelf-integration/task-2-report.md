# Task 2 Report — Deterministic Tutor Library lifecycle and root motion

Date: 2026-08-30

Worktree: `C:\Projects\DA-Website-Redo\.worktrees\codex-tutor-library-3d`

Branch: `codex/tutor-library-3d`

## Outcome

Task 2 now provides deterministic, portable semantic and motion contracts for the later Tutor Library bridge/UI tasks. It does not mount or wire the Complete Shelf rig into the room.

Implemented:

- A semantic reducer spanning room idle/turning, hover intent, extraction, preview, safe reading transit, opening, reading, page dragging/turning/settled, closing, controller reset, shelf return, and restored idle.
- Strict transition-generation tokens on every asynchronous completion. Missing and stale completions are rejected.
- Deterministic hover A-to-B replacement, click-during-extraction intent retention, rapid wall retargeting, and hostile-operation no-ops.
- Escape recovery from every book transient/reading state, with opened/page states closing before reset and unopened states resetting before return.
- A pre-return gate requiring the same physical root plus completed close/reset, zero open/page progress, zero settled pages, and reset deformation.
- A Three/R3F-free lifecycle coordinator that captures shelf local/world matrix tuples, physical root UUID, shelf pose, neighbour poses, and the currently sampled pose by value.
- Interruption recovery for Escape, selection change, resize, and visibility resume. Every restart uses the sampled pose as its new origin.
- Exact return segments from the current sampled pose to the stored shelf pose; completion restores stored matrices and neighbour poses rather than recomposing them.
- A ten-cycle no-drift contract and `maxMatrixDelta` verification at a tolerance stricter than the required `1e-6` (the measured unit-test delta is exactly `0`).
- Motion timing policies for standard and reduced motion. Reduced motion makes spatial travel immediate/near-immediate, shortens necessary physical controller motion, disables page riffle, and preserves every semantic phase.
- Variable wall-turn geometry using the actual wall count. The production camera caller now supplies `SUBJECT_WALLS.length`, and tests cover 3, 4, 5, and 6 walls.
- Generation propagation in the existing timer/frame completion calls so the public room remains type-safe with the strict reducer contract. No new room UI behavior was wired.

## RED evidence

Tests were written before production changes and observed failing for the intended missing behavior.

Initial focused RED run:

```text
node --test --experimental-strip-types src/features/tutor-library/tutor-library-state.test.ts
Result: 1 passed, 10 failed
Representative failures: transitionGeneration absent; hover stayed on A; extraction/open/Escape/reset phases absent; rapid wall retarget stayed on English.

node --test --experimental-strip-types src/features/tutor-library/tutor-book-motion.test.ts
Result: failed because createBookMotionTimingPolicy/createBookReturnMotion did not exist.

node --test --experimental-strip-types src/features/tutor-library/tutor-library-timeline.test.ts
Result: 2 passed, 1 failed; the 3-wall endpoint exposed the hard-coded four-wall divisor.

node --test --experimental-strip-types src/features/tutor-library/tutor-book-lifecycle.test.ts
Result: failed because tutor-book-lifecycle.ts did not exist.
```

Strict-token follow-up RED run:

```text
node --test --experimental-strip-types src/features/tutor-library/tutor-library-state.test.ts
Result: 10 passed, 1 failed; a TURN_COMPLETE event without a generation incorrectly settled the room turn.
```

That final failing test drove removal of the compatibility escape hatch: completion generations are now required and exact.

## GREEN evidence

Focused lifecycle/motion/reducer/timeline suite:

```text
node --test --experimental-strip-types \
  src/features/tutor-library/tutor-library-state.test.ts \
  src/features/tutor-library/tutor-book-motion.test.ts \
  src/features/tutor-library/tutor-book-lifecycle.test.ts \
  src/features/tutor-library/tutor-library-timeline.test.ts

Result: 25 passed, 0 failed.
```

All Tutor Library tests:

```text
$tutorTests = @(rg --files src/features/tutor-library | Where-Object { $_ -match '\.test\.(ts|mjs)$' })
node --test --experimental-strip-types $tutorTests

Result: 16 files, 62 passed, 0 failed.
```

TypeScript:

```text
npm.cmd run typecheck
Result: exit 0.
```

Production build:

```text
npm.cmd run build
Result: exit 0; encoding check passed (1114 files), 80 sitemap URLs generated, TypeScript passed, 3977 modules transformed.
```

The build emitted the repository's existing large-chunk advisory only. `public/sitemap.xml` changed only because its generated date advanced and was restored after the build as required.

Touched-file lint:

```text
npm.cmd exec -- eslint <all touched Tutor Library source/test files>
Result: exit 0, no findings.
```

For transparency, the repository-wide `npm run lint` path still exits non-zero on unrelated existing files: missing `compat/compat` configuration in vendored Three.js, existing escape warnings/errors in `SuccessStories.tsx` and `Science.programs.test.ts`, plus the documented Fast Refresh/hook warning backlog. No touched Task 2 file was reported.

## Contract details for Tasks 3–4

### Reducer

- Read `state.transitionGeneration` when starting an asynchronous operation.
- Dispatch its completion with that exact `generation`.
- A resize or visibility resume increments the generation for transient phases, so the old callback cannot complete the restarted transition.
- `OPEN` during extraction sets `openRequested` without restarting extraction. Successful extraction then enters `BOOK_TO_READING`; only `READING_POSE_READY` may start `BOOK_OPENING`.
- `RESET_COMPLETE` is accepted only with a neutral controller snapshot; only then can `BOOK_RETURNING` begin.
- Selection and room turns are no-ops during incompatible book phases, including selection B while A returns.

### Root lifecycle coordinator

- Call `createBookLifecycleCoordinator` once from the captured shelf/root/neighbour state.
- Feed current outer-root transform samples to `interruptBookLifecycle` on Escape, resize, visibility resume, or a supported selection interruption.
- Call `beginShelfReturn` only after collecting the controller snapshot. A rejected result preserves the identical coordinator object.
- Drive the outer root from `sampleShelfReturn`; progress zero is the exact sampled interruption and progress one is the exact stored shelf pose.
- Call `completeShelfReturn` with the still-mounted physical root UUID. A replacement UUID throws, while a valid completion restores the stored matrices/poses exactly.

## Files changed

- `src/features/tutor-library/tutor-library-state.ts`
- `src/features/tutor-library/tutor-library-state.test.ts`
- `src/features/tutor-library/tutor-book-motion.ts`
- `src/features/tutor-library/tutor-book-motion.test.ts`
- `src/features/tutor-library/tutor-book-lifecycle.ts` (new)
- `src/features/tutor-library/tutor-book-lifecycle.test.ts` (new)
- `src/features/tutor-library/tutor-library-timeline.ts`
- `src/features/tutor-library/tutor-library-timeline.test.ts`
- `src/features/tutor-library/TutorLibraryScene.tsx` (passes actual wall count)
- `src/features/tutor-library/TutorLibrary.tsx` (passes strict completion generations only)

## Self-review

- No Three.js or React dependency entered the focused lifecycle units.
- No frame progress was added to reducer state; frame consumers can keep interpolation in refs/imperative objects.
- Motion inputs, matrix captures, shelf poses, and neighbour poses are copied at boundaries to prevent later mutation from changing the stored return target.
- Return is never built from the preview endpoint; it is built only from `sampledPose`.
- Root replacement, residual open/page state, unsettled pages, incomplete close/reset, malformed matrices, stale completions, missing generations, duplicate/incompatible events, and repeated cycles are all exercised.
- Existing Complete Shelf physical/controller internals were not modified.
- No merge or push was performed.

## Concerns / follow-up boundaries

- The lifecycle is infrastructure only. Tasks 3–4 must connect actual outer-root samples and real controller completion snapshots before exposing these new phases in the room UI.
- Full repository lint remains blocked by the unrelated pre-existing issues listed above; touched-file lint is clean.
- The build's existing bundle-size advisory remains unchanged and belongs to the later performance task.
