# Task 5 report: subject-led planetary composition

## Changed files

- `src/features/tutor-directory/tutorOrbitLayout.ts`
  - Defines the four labelled home systems.
  - Assigns every discovery record to one deterministic group.
  - Publishes fixed authored stage coordinates and portrait sizes for all 43 catalogue records.
- `src/features/tutor-directory/tutorOrbitLayout.test.ts`
  - Covers labels, full/unique catalogue assignment, Foundations classification, protected-centre clearance, stage bounds, and portrait separation.
- `src/features/tutor-directory/TutorDirectory.tsx`
  - Replaces the anonymous scatter calculation with named group sections and the stable slot data.
  - Preserves the existing filter, selection, profile-dialog, query-string, and mobile-list flows.
- `src/features/tutor-directory/TutorDirectory.test.ts`
  - Adds component/CSS contracts for the four visible group labels and the drift/pause/reduced-motion behavior.
- `src/features/tutor-directory/tutor-directory.css`
  - Adds four distinct elliptical rings/labels and tiny CSS-only per-group drift with per-slot timing.
  - Pauses local drift on hover, keyboard focus, and selection; removes it under reduced motion.
- `.superpowers/sdd/2026-08-22-unified-tutor-directory/task-5-report.md`
  - Records Task 5 implementation and verification evidence.

## TDD evidence

### RED

Command:

```text
node --test --experimental-strip-types src/features/tutor-directory/*.test.ts
```

Initial result: exit 1; 20 tests, 13 passed, 7 failed. The five layout contracts failed because `tutorOrbitLayout.ts` did not exist. The component contracts also failed because the four-system module/labels and portrait-drift wrapper/keyframes were absent. No production Task 5 code had been written before this run.

### GREEN

Same command after the smallest production implementation: exit 0; 20 tests, 20 passed, 0 failed.

## Verification

- Focused Node test suite: 20/20 passed.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd exec -- eslint` on the four changed TypeScript/TSX test and production files: exit 0.
- `git diff --check`: exit 0; Git reported only the repository's line-ending conversion warnings.

## Rendered desktop and responsive QA

- Actual route: `/find-teacher` redirects to `/tutors`; `/find-teacher?tutor=T010` redirects to `/tutors?tutor=T010` and opened Mr Danny Q.'s full-profile dialog.
- At a 1440×1000 viewport, the rendered stage measured 1344×768. All four labels were visible, all 43 portraits rendered, no portrait bounding boxes overlapped, and no portrait intersected the focus card.
- At the lower desktop edge tested (browser inner width 1062px), the stage measured about 988.3×768 and still showed zero portrait overlaps and zero focus-card collisions.
- At 1060px, the desktop stage was hidden and the existing mobile list displayed all 43 educator articles.
- Applying the Science filter produced 4 focused and 39 dimmed portraits, disabled none, and moved zero authored portrait buttons relative to the stage.
- Selecting a portrait changed the centre panel and reported `animation-play-state: paused` on that portrait's local drift wrapper.
- Browser console warnings/errors during QA: none.

## Self-review

- Catalogue coverage is exact and duplicate-free; each record has one scalar `groupId`, never multiple homes.
- `hasPrimary` and broad `primarySubject: 'both'` records are classified as Foundations before specialist fallbacks.
- Slot geometry is independent of filtering and selection state.
- The 32–68% x / 30–70% y protected rectangle is tested against the full portrait bounds, not just portrait centre points.
- Pairwise separation is tested against both portrait radii plus an 8px gutter on the authored 1440×768 coordinate system.
- Ambient movement is isolated to a child transform and does not animate the authored button positions. There is no physics, dragging, `requestAnimationFrame`, or full-orbit animation.
- Existing deep-link, full-profile, focus-return, filter, selection, and mobile-list code paths were left in place.

## Concerns

- Foundations contains 27 of the 43 current educators, so its two lower rows are intentionally denser than the specialist systems even though they remain non-overlapping at the tested desktop widths.
- Authored slot capacity matches the current catalogue counts. Adding educators to a group without authoring another safe slot throws a clear error instead of silently causing overlap; future catalogue growth therefore requires a deliberate layout update.
