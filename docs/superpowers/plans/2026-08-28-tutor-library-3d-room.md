# Tutor Library 3D Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete data-driven, physically continuous Tutor Library for `/tutors`, including curved page turns and exact shelf return.

**Architecture:** A stable R3F room rotunda contains data-derived subject walls and one logical `TutorBook` per subject edition. A reducer accepts only legal state transitions while deterministic timelines drive camera and book transforms in `useFrame`; semantic DOM controls remain the accessible route to the same content and existing `FindTeacher` fallback.

**Tech Stack:** React, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, existing Framer Motion only for non-canvas DOM, Node test runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-28-tutor-library-3d-room-design.md`

## Global Constraints

- Use `teacherCatalogue.ts` as the sole tutor/profile/image source; editions reference IDs and never duplicate profile data.
- Generate all walls, angles, labels, editions, and camera targets from `SubjectWall[]`; no geometry assumes four walls.
- Keep the room stable and move the camera; no core fade/crossfade/flat-slide substitutions.
- Keep one selected `TutorBook` logical instance from shelf through preview, reading, close, and exact return.
- Complete Checkpoints A–F in this programme; page physics is mandatory before feature completion.
- Preserve `/find-teacher?tutor=<id>`, FindTeacher discovery/enquiry, Tutor Orbit source, global navigation, and unrelated routes.
- Keep immersive search subordinate; use FindTeacher for the full conventional search/filter interface.
- Use installed Three/R3F/Drei only; no new renderer dependency, copied Complete Shelf code/assets, invented tutor content, or autoplay sound.
- Use rendered browser checkpoints and keyboard/touch/reduced-motion evidence before each gate advances.

---

## File structure

- `src/features/tutor-library/tutor-library-data.ts`: data-driven subject wall and edition derivation.
- `src/features/tutor-library/tutor-library-state.ts`: reducer, legal events, and transition guards.
- `src/features/tutor-library/tutor-library-timeline.ts`: deterministic easing/sampling and exact pose interpolation.
- `src/features/tutor-library/tutor-library-geometry.ts`: shelf slot transforms, rotunda wall transforms, page-bend vertices.
- `src/features/tutor-library/TutorLibrary.tsx`: route-facing canvas shell and semantic controls.
- `src/features/tutor-library/TutorLibraryScene.tsx`: camera, room, lighting, selection lifecycle.
- `src/features/tutor-library/RoomRotunda.tsx`: connected wall/corner/floor/ceiling mesh assembly.
- `src/features/tutor-library/TutorBook.tsx`: one structural book mesh group plus cover, boards, hinge, block, sheets.
- `src/features/tutor-library/TutorBookReader.tsx`: open-book spread/page-control composition tied to book world pose.
- `src/features/tutor-library/TutorLibraryA11y.tsx`: live state, keyboard controls, conventional profile action.
- `src/features/tutor-library/tutor-library.css`: DOM overlay, responsive canvas host, reduced-motion styling.
- `src/pages/Tutors.tsx`: retain existing behavior until final gated replacement, then mount library as default hero.
- `src/pages/FindTeacher.tsx`: no feature rewrite; only validate its deep-link contract.
- `src/features/tutor-library/*.test.ts`: focused data, state, timeline, geometry, and source-contract tests.

## Task 1: Lock the current baseline and route boundary

**Files:**
- Modify: `src/pages/Tutors.tsx`
- Create: `src/features/tutor-library/tutor-library-route.test.ts`
- Read: `src/pages/FindTeacher.tsx`, `src/features/tutor-orbit/TutorOrbitHero.tsx`, `src/data/teacherCatalogue.ts`

**Interfaces:**
- Consumes: current `TutorOrbitHero`, `FindTeacher`, `?tutor=` deep link.
- Produces: an explicit library feature flag/route seam without deleting Orbit.

- [ ] **Step 1: Write a failing source-contract test**

```ts
test('keeps FindTeacher as a deep-linkable fallback while reserving the Tutors library seam', () => {
  assert.match(readFileSync(tutorsPath, 'utf8'), /TutorLibrary/);
  assert.match(readFileSync(findTeacherPath, 'utf8'), /searchParams\.get\('tutor'\)/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-route.test.ts`

Expected: FAIL because `TutorLibrary` does not exist.

- [ ] **Step 3: Add the guarded library import and preserve current Orbit/FindTeacher behavior**

```tsx
import { TutorLibrary } from '@/features/tutor-library/TutorLibrary';

// Render TutorLibrary only behind the local library gate until Checkpoint F.
```

- [ ] **Step 4: Re-run the focused test and typecheck**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-route.test.ts; npm.cmd run typecheck`

Expected: PASS and no TypeScript errors.

- [ ] **Step 5: Capture the pre-library `/tutors` desktop and mobile baseline, then commit**

Run: `git add src/pages/Tutors.tsx src/features/tutor-library/tutor-library-route.test.ts && git commit -m "chore: reserve tutor library route seam"`

## Task 2: Derive walls and book editions from canonical tutor data

**Files:**
- Create: `src/features/tutor-library/tutor-library-data.ts`
- Create: `src/features/tutor-library/tutor-library-data.test.ts`
- Read: `src/data/teacherCatalogue.ts`

**Interfaces:**
- Consumes: `CatalogueTutor`, `TUTORS`, existing `teachesEnglish`, `teachesMath`, `teachesScience`.
- Produces: `SUBJECT_WALLS`, `createTutorBookEditions(tutors)`, `getWallAngle(index, count)`.

- [ ] **Step 1: Write failing data tests**

```ts
test('derives a variable-count rotunda and one edition per tutor-wall match', () => {
  const editions = createTutorBookEditions(TUTORS);
  assert.equal(new Set(editions.map(e => e.wallId)).size, SUBJECT_WALLS.length);
  assert.ok(editions.filter(e => e.tutorId === 'T030').length >= 2);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-data.test.ts`

Expected: FAIL because module exports do not exist.

- [ ] **Step 3: Implement the derived configuration**

```ts
export const teachesScienceSocial = (tutor: CatalogueTutor) =>
  teachesScience(tutor) || /Business|Legal/i.test(tutor.subjects);

export const SUBJECT_WALLS: SubjectWall[] = [
  { id: 'primary', label: 'Primary', palette: 'primary', matches: tutor => tutor.hasPrimary },
  { id: 'mathematics', label: 'Mathematics', palette: 'mathematics', matches: teachesMath },
  { id: 'english', label: 'English', palette: 'english', matches: teachesEnglish },
  { id: 'science-social', label: 'Science & Social Science', palette: 'science-social', matches: teachesScienceSocial },
];
export const getWallAngle = (index: number, count: number) => (index / count) * Math.PI * 2;
```

- [ ] **Step 4: Re-run data tests**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-data.test.ts`

Expected: PASS; Business/Legal/Chemistry editions are on `science-social` and no tutor record is copied.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library/tutor-library-data.* && git commit -m "feat: derive tutor library walls and editions"`

## Task 3: Create deterministic room/book state and timelines

**Files:**
- Create: `src/features/tutor-library/tutor-library-state.ts`
- Create: `src/features/tutor-library/tutor-library-timeline.ts`
- Create: `src/features/tutor-library/tutor-library-state.test.ts`
- Create: `src/features/tutor-library/tutor-library-timeline.test.ts`

**Interfaces:**
- Consumes: edition IDs and stable shelf pose IDs.
- Produces: `LibraryState`, `libraryReducer`, `sampleTimeline`, `isInteractive`.

- [ ] **Step 1: Write failing state and endpoint tests**

```ts
assert.equal(libraryReducer(idle, { type: 'TURN', wallId: 'english' }).phase, 'ROOM_TURNING');
assert.equal(libraryReducer(turning, { type: 'OPEN' }), turning);
assert.deepEqual(sampleTimeline(0, from, to), from);
assert.deepEqual(sampleTimeline(1, from, to), to);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-state.test.ts src/features/tutor-library/tutor-library-timeline.test.ts`

Expected: FAIL because reducer/timeline do not exist.

- [ ] **Step 3: Implement legal phases and time-based sampling**

```ts
export type LibraryPhase = 'ROOM_IDLE' | 'ROOM_TURNING' | 'BOOK_HOVER_INTENT' | 'BOOK_EXTRACTING' | 'BOOK_PREVIEW' | 'BOOK_OPENING' | 'BOOK_READING' | 'PAGE_DRAGGING' | 'PAGE_TURNING' | 'BOOK_CLOSING' | 'BOOK_RETURNING';
export const sampleTimeline = (progress: number, from: Pose, to: Pose): Pose => interpolatePose(from, to, clamp01(progress));
```

- [ ] **Step 4: Re-run focused tests**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-state.test.ts src/features/tutor-library/tutor-library-timeline.test.ts`

Expected: PASS; illegal rapid events are no-ops and endpoints are exact.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library/tutor-library-state.* src/features/tutor-library/tutor-library-timeline.* && git commit -m "feat: add deterministic tutor library state"`

## Task 4: Build the connected data-driven room (Checkpoint A)

**Files:**
- Create: `src/features/tutor-library/RoomRotunda.tsx`
- Create: `src/features/tutor-library/TutorLibraryScene.tsx`
- Create: `src/features/tutor-library/TutorLibrary.tsx`
- Create: `src/features/tutor-library/tutor-library.css`
- Create: `src/features/tutor-library/room-rotunda.test.ts`

**Interfaces:**
- Consumes: `SUBJECT_WALLS`, `getWallAngle`.
- Produces: stable wall groups containing shelves/corners/floor/ceiling at each derived angle.

- [ ] **Step 1: Write a failing geometry/source test**

```ts
assert.match(source, /SUBJECT_WALLS\.map/);
assert.match(source, /getWallAngle/);
assert.match(source, /<Canvas/);
assert.doesNotMatch(source, /wall-0|wall-1|wall-2|wall-3/);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/room-rotunda.test.ts`

Expected: FAIL because room components do not exist.

- [ ] **Step 3: Implement stable room geometry**

```tsx
{SUBJECT_WALLS.map((wall, index) => (
  <SubjectWall key={wall.id} wall={wall} angle={getWallAngle(index, SUBJECT_WALLS.length)} />
))}
```

Use connected wall returns, corner trim, continuous floor/ceiling, shelf recesses, warm practical plus ambient lighting, and DPR `Math.min(devicePixelRatio, 1.5)`.

- [ ] **Step 4: Run test, typecheck, and capture Checkpoint A**

Run: `node --test --experimental-strip-types src/features/tutor-library/room-rotunda.test.ts; npm.cmd run typecheck`

Capture: desktop frontal Primary wall, visible adjacent walls, and mobile composition.

- [ ] **Step 5: Review Checkpoint A with the user, then commit only after approval**

Run: `git add src/features/tutor-library && git commit -m "feat: add tutor library room rotunda"`

## Task 5: Implement genuine camera rotation (Checkpoint B)

**Files:**
- Create: `src/features/tutor-library/RoomCameraController.tsx`
- Create: `src/features/tutor-library/tutor-library-geometry.ts`
- Create: `src/features/tutor-library/room-camera.test.ts`
- Modify: `src/features/tutor-library/TutorLibraryScene.tsx`

**Interfaces:**
- Consumes: `ROOM_TURNING`, wall angles, deterministic `sampleTimeline`.
- Produces: `cameraPoseForWall`, `cameraArcPose`, camera turn completion event.

- [ ] **Step 1: Write failing pose tests**

```ts
assert.notDeepEqual(cameraArcPose(0.5, from, to).position, from.position);
assert.deepEqual(cameraArcPose(0, from, to), from);
assert.deepEqual(cameraArcPose(1, from, to), to);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/room-camera.test.ts`

Expected: FAIL because camera helpers do not exist.

- [ ] **Step 3: Implement camera yaw plus small positional arc**

```ts
camera.position.lerpVectors(from.position, to.position, eased);
camera.position.addScaledVector(tangent, Math.sin(progress * Math.PI) * arcDistance);
camera.lookAt(targetAtAngle(interpolatedAngle));
```

Use a 900–1300ms acceleration/middle-speed/deceleration curve. Do not rotate the room group. Add velocity-dependent blur only after midpoint geometry is convincing and gate it by desktop performance; leave blur off if it harms frame time.

- [ ] **Step 4: Run test and capture Checkpoint B**

Run: `node --test --experimental-strip-types src/features/tutor-library/room-camera.test.ts; npm.cmd run typecheck`

Capture: frontal wall, 50% turn with both walls and corner visible, settled next wall. Test repeated left/right and hidden-tab resume.

- [ ] **Step 5: Review Checkpoint B with the user, then commit only after approval**

Run: `git add src/features/tutor-library && git commit -m "feat: add physical tutor library camera turns"`

## Task 6: Implement structural books and exact shelf poses

**Files:**
- Create: `src/features/tutor-library/TutorBook.tsx`
- Create: `src/features/tutor-library/TutorShelf.tsx`
- Create: `src/features/tutor-library/tutor-book-geometry.ts`
- Create: `src/features/tutor-library/tutor-book-geometry.test.ts`
- Modify: `src/features/tutor-library/RoomRotunda.tsx`

**Interfaces:**
- Consumes: `TutorBookEdition`, `CatalogueTutor`, shelf index/slot index.
- Produces: `getShelfPose(edition)`, `TutorBookHandle` with `setPose(pose)` and `getShelfPose()`.

- [ ] **Step 1: Write failing structure/return tests**

```ts
const pose = getShelfPose(edition);
assert.equal(pose.position.y, getShelfPose(edition).position.y);
assert.ok(createBookParts().frontBoard);
assert.ok(createBookParts().pageBlock);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-geometry.test.ts`

Expected: FAIL because book geometry exports do not exist.

- [ ] **Step 3: Implement one logical book group**

```tsx
<group ref={bookRef} matrixAutoUpdate={false}>
  <mesh name="back-board" />
  <group name="spine-and-hinges"><mesh name="spine" /></group>
  <group name="front-hinge"><mesh name="front-board" /></group>
  <group name="page-block"><PageStack /></group>
</group>
```

Use cloth roughness, gold rules, shallow board/page thickness, readable spine text, and shelf contact shadow. Store the original shelf matrix once per edition; never reconstruct it from incremental transforms.

- [ ] **Step 4: Re-run tests and inspect resting books**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-geometry.test.ts; npm.cmd run typecheck`

Capture: shelf close-up showing depth, readable spine, recess, and contact shadow.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library && git commit -m "feat: add structural tutor books"`

## Task 7: Add continuous hover, extraction, and cover preview (Checkpoint C)

**Files:**
- Create: `src/features/tutor-library/TutorBookCover.tsx`
- Create: `src/features/tutor-library/tutor-book-motion.test.ts`
- Modify: `TutorBook.tsx`, `TutorLibraryScene.tsx`, `tutor-library-state.ts`

**Interfaces:**
- Consumes: `TutorBookHandle`, original shelf pose, `BOOK_HOVER_INTENT`, `BOOK_EXTRACTING`.
- Produces: continuous shelf-to-preview poses and front-board cover artwork from canonical tutor fields.

- [ ] **Step 1: Write failing continuity tests**

```ts
assert.equal(extractionTimeline.from, shelfPose);
assert.equal(previewTimeline.from, extractionTimeline.to);
assert.match(coverSource, /getPhotoUrl\(tutor\)/);
assert.doesNotMatch(coverSource, /<article className=".*card/);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-motion.test.ts`

Expected: FAIL because extraction and cover module do not exist.

- [ ] **Step 3: Implement staged physical motion**

```ts
const intentPose = offsetPose(shelfPose, localForward, 0.015);
const extractionPose = offsetPose(intentPose, localForward, 0.18);
const previewPose = rotateTowardCamera(offsetPose(extractionPose, cameraForward, 0.9));
```

Keep adjacent books stable but allow a 1–2° local neighbour response. Render the tutor portrait/name/designation/tagline onto the physical front board; do not show an HTML substitute.

- [ ] **Step 4: Re-run test and capture Checkpoint C**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-motion.test.ts; npm.cmd run typecheck`

Capture: shelf rest, partial extraction, front-cover preview. Rapidly hover A then B and click during extraction.

- [ ] **Step 5: Review Checkpoint C with the user, then commit only after approval**

Run: `git add src/features/tutor-library && git commit -m "feat: animate tutor book extraction and preview"`

## Task 8: Validate segmented production page geometry early

**Files:**
- Create: `src/features/tutor-library/PageSheet.tsx`
- Create: `src/features/tutor-library/page-sheet-geometry.ts`
- Create: `src/features/tutor-library/page-sheet-geometry.test.ts`
- Modify: `TutorBook.tsx`

**Interfaces:**
- Consumes: page hinge pose and turn progress `0..1`.
- Produces: `buildPageGeometry(segments)`, `applyPageBend(geometry, progress, direction)`.

- [ ] **Step 1: Write failing mid-turn geometry tests**

```ts
const points = samplePageCurve(0.5, 'forward');
assert.notEqual(points.outerEdge.z, points.bindingEdge.z);
assert.equal(samplePageCurve(0, 'forward').outerEdge.rotation, 0);
assert.equal(samplePageCurve(1, 'forward').outerEdge.rotation, Math.PI);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/page-sheet-geometry.test.ts`

Expected: FAIL because curved sheet helpers do not exist.

- [ ] **Step 3: Implement segmented sheet deformation on the actual TutorBook**

```ts
const bend = Math.sin(progress * Math.PI) * bendAmount;
vertex.z = bend * Math.sin(u * Math.PI);
vertex.x = hingeX + width * u * Math.cos(progress * Math.PI);
```

Use binding-side constraint, greater outer-edge arc, front/back directions, moving directional shadow, and a deterministic final pose. Ensure the sheet clears boards and page stack at all sampled progress values.

- [ ] **Step 4: Run geometry tests and inspect the technical prototype**

Run: `node --test --experimental-strip-types src/features/tutor-library/page-sheet-geometry.test.ts; npm.cmd run typecheck`

Capture: 0%, 50%, and 100% turn; inspect no board/page intersections.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library && git commit -m "feat: add curved tutor book page geometry"`

## Task 9: Implement hinge opening and reading pose (Checkpoint D)

**Files:**
- Create: `src/features/tutor-library/TutorBookReader.tsx`
- Create: `src/features/tutor-library/tutor-book-reader.test.ts`
- Modify: `TutorBook.tsx`, `TutorLibraryScene.tsx`, `tutor-library-state.ts`

**Interfaces:**
- Consumes: preview pose and `PageSheet` container.
- Produces: `BOOK_OPENING` to `BOOK_READING` sequence, board hinge angle, reader camera pose.

- [ ] **Step 1: Write failing opening tests**

```ts
assert.equal(openTimeline.from, previewPose);
assert.equal(openTimeline.to.frontBoardAngle, Math.PI * 0.94);
assert.match(readerSource, /PageSheet/);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-reader.test.ts`

Expected: FAIL because reader/opening exports do not exist.

- [ ] **Step 3: Implement physical opening**

```ts
frontHinge.rotation.y = interpolate(openingProgress, 0, Math.PI * 0.94);
bookHandle.setPose(sampleTimeline(openingProgress, previewPose, readingPose));
```

Keep the origin wall/shelf/light visible; darken only ambient room response. The book size is tuned by viewport aspect ratio, not a fixed cream overlay percentage.

- [ ] **Step 4: Re-run test and capture Checkpoint D**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-book-reader.test.ts; npm.cmd run typecheck`

Capture: closed preview, half-open hinge, fully open book inside the room. Press Escape halfway through opening.

- [ ] **Step 5: Review Checkpoint D with the user, then commit only after approval**

Run: `git add src/features/tutor-library && git commit -m "feat: open tutor books into reader pose"`

## Task 10: Bind real profile content to physical spreads (Checkpoint E/F foundation)

**Files:**
- Create: `src/features/tutor-library/tutor-profile-spreads.ts`
- Create: `src/features/tutor-library/tutor-profile-spreads.test.ts`
- Modify: `TutorBookReader.tsx`, `TutorBookCover.tsx`

**Interfaces:**
- Consumes: `CatalogueTutor.profile`, name, designation, subjects, existing `profileContentFor` helpers.
- Produces: `createTutorSpreads(tutor): TutorSpread[]` with no empty/filler spread.

- [ ] **Step 1: Write failing content tests**

```ts
const spreads = createTutorSpreads(getTutor('T003')!);
assert.ok(spreads.length >= 1);
assert.ok(spreads.every(spread => spread.blocks.length > 0));
assert.equal(createTutorSpreads({ ...tutor, profile: undefined }).length, 1);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-profile-spreads.test.ts`

Expected: FAIL because spread derivation does not exist.

- [ ] **Step 3: Derive only populated spreads and attach them to pages**

```ts
const blocks = [profile?.whyDA && { label: 'Why at DA', body: profile.whyDA }, profile?.goals && { label: 'Teaching goals', body: profile.goals }, profile?.remembered && { label: 'What students remember', body: profile.remembered }].filter(Boolean);
```

Render page text as a high-resolution cover/page texture or synchronized DOM layer parented to page world pose. The text transform must update from the same page matrix that deforms the visible sheet.

- [ ] **Step 4: Re-run tests and inspect profile density**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-profile-spreads.test.ts; npm.cmd run typecheck`

Verify short profiles use one complete spread; rich profiles use multiple real spreads; no invented headings/content.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library && git commit -m "feat: render tutor profiles as physical spreads"`

## Task 11: Finish page interaction and exact closing/return (Checkpoints E and F)

**Files:**
- Modify: `PageSheet.tsx`, `TutorBookReader.tsx`, `TutorBook.tsx`, `TutorLibraryScene.tsx`, `tutor-library-state.ts`
- Create: `src/features/tutor-library/tutor-library-return.test.ts`

**Interfaces:**
- Consumes: `TutorBookHandle.getShelfPose()`, page curve helpers, `TutorSpread[]`.
- Produces: keyboard/pointer page turn, physical close, return completion with exact matrix restoration.

- [ ] **Step 1: Write failing return and repeated-cycle tests**

```ts
for (let i = 0; i < 10; i += 1) completeOpenCloseReturn(handle);
assert.ok(handle.matrixWorld.elements.every((value, index) => Math.abs(value - original[index]) < 1e-6));
assert.equal(reducer(reading, { type: 'ESCAPE' }).phase, 'BOOK_CLOSING');
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-return.test.ts`

Expected: FAIL because return completion is not implemented.

- [ ] **Step 3: Implement page controls, closing, and exact matrix return**

```ts
book.matrix.copy(originalShelfMatrix);
book.matrixWorldNeedsUpdate = true;
dispatch({ type: 'RETURN_COMPLETE', editionId });
```

Use pointer drag threshold plus Previous/Next controls; settle partial drags deterministically. Close front board, restore preview pose, rotate and travel to stored shelf pose, then copy the original matrix exactly. Block another book selection during `BOOK_CLOSING`/`BOOK_RETURNING` and announce state.

- [ ] **Step 4: Re-run tests and capture Checkpoints E/F**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-return.test.ts; npm.cmd run typecheck`

Capture: page rest, 50% curved turn, settled page; closing; return transit; exact shelf restore. Run ten complete cycles plus rapid hostile sequences from the approved specification.

- [ ] **Step 5: Review Checkpoints E/F with the user, then commit only after approval**

Run: `git add src/features/tutor-library && git commit -m "feat: complete tutor book reading and return"`

## Task 12: Add subordinate discovery, accessibility, responsive behavior, and performance controls

**Files:**
- Create: `src/features/tutor-library/TutorLibraryA11y.tsx`
- Create: `src/features/tutor-library/tutor-library-a11y.test.ts`
- Modify: `TutorLibrary.tsx`, `TutorLibraryScene.tsx`, `tutor-library.css`, `src/pages/Tutors.tsx`

**Interfaces:**
- Consumes: room state, selected edition, `FindTeacher` profile URL.
- Produces: keyboard/live controls, compact Find-a-tutor affordance, mobile/reduced-motion behavior.

- [ ] **Step 1: Write failing accessibility tests**

```ts
assert.match(source, /aria-live="polite"/);
assert.match(source, /onKeyDown/);
assert.match(source, /\/find-teacher\?tutor=/);
assert.match(css, /prefers-reduced-motion/);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-a11y.test.ts`

Expected: FAIL because semantic overlay does not exist.

- [ ] **Step 3: Implement non-dominant controls and fallbacks**

```tsx
<button aria-label="Find a tutor" onClick={() => navigate('/find-teacher')}>Find a tutor</button>
<a href={`/find-teacher?tutor=${tutor.id}`}>Full profile and enquiry</a>
```

Map ArrowLeft/ArrowRight to context-sensitive wall/page movement, Enter/Space to focused book, Escape to safe close, and status changes to a polite live region. Tablet first tap previews, second tap/Open reads; mobile supports compact room navigation and explicit page buttons. Reduced motion shortens spatial timelines and removes blur/idle drift/riffle.

- [ ] **Step 4: Run tests, build, and perform responsive matrix**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-a11y.test.ts; npm.cmd run typecheck; npm.cmd run build`

Test: 1920×1080, 1440×900, 1366×768, tablet, 390px mobile; pointer, keyboard, touch, reduced motion; `/find-teacher?tutor=T003`.

- [ ] **Step 5: Commit**

Run: `git add src/features/tutor-library src/pages/Tutors.tsx && git commit -m "feat: make tutor library accessible and responsive"`

## Task 13: Final performance/visual verification and safe route cutover

**Files:**
- Modify: `src/pages/Tutors.tsx`
- Modify: `src/features/tutor-library/TutorLibraryScene.tsx`
- Create: `docs/qa/2026-08-28-tutor-library-checkpoints.md`

**Interfaces:**
- Consumes: completed Checkpoints A–F.
- Produces: default `/tutors` library route and explicit Orbit-retention decision.

- [ ] **Step 1: Write a failing default-route contract**

```ts
const source = readFileSync(tutorsPath, 'utf8');
assert.match(source, /view === 'library'/);
assert.match(source, /<TutorLibrary/);
assert.doesNotMatch(source, /view === 'library'[\s\S]{0,180}<TutorOrbitHero/);
```

- [ ] **Step 2: Run and verify failure while the gate is active**

Run: `node --test --experimental-strip-types src/features/tutor-library/tutor-library-route.test.ts`

Expected: FAIL until Checkpoint F approval authorizes cutover.

- [ ] **Step 3: Make library the default `/tutors` hero without deleting Orbit source**

```tsx
{view === 'library' ? <TutorLibrary onOpenDirectory={() => setView('directory')} /> : <FindTeacher embedded onBackToHero={() => setView('library')} />}
```

Keep `TutorOrbitHero` source untouched and document it as a separate cleanup candidate only.

- [ ] **Step 4: Run final verification and save evidence**

Run: `node --test --experimental-strip-types src/features/tutor-library/*.test.ts; npm.cmd run typecheck; npm.cmd run build; git diff --check`

Capture all required A–F states, inspect browser console, record performance/DPR behavior, test hostile interaction sequences, and confirm no visual core transition uses opacity substitution.

- [ ] **Step 5: Review final evidence with the user and commit**

Run: `git add src/pages/Tutors.tsx src/features/tutor-library docs/qa/2026-08-28-tutor-library-checkpoints.md && git commit -m "feat: launch tutor library experience"`

## Plan self-review

- Spec coverage: Tasks 2/4/5 implement data-driven connected room and real camera; Tasks 6/7/9/11 preserve one book; Task 8 validates segmented curvature before reader completion; Tasks 10/11 deliver real-content spreads/pages/return; Task 12 preserves conventional fallback/accessibility; Task 13 gates default cutover and retains Orbit source.
- Placeholder scan: no TODO/TBD/defer language; all future stages are concrete tasks in this one programme.
- Type consistency: `SubjectWall`, `TutorBookEdition`, `LibraryPhase`, `TutorBookHandle`, `Pose`, `TutorSpread`, and `PageSheet` are introduced before consuming tasks.
