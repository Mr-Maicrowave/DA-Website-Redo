# Tutor Library - interaction and performance fix brief

You are working in the DA Tuition marketing site (React 18 + Vite + TypeScript, React Three
Fiber 8 / three 0.170, drei 9). The feature to fix is the Tutors page: a 3D library rotunda
where each tutor is a book on a shelf.

- Route: `/tutors` -> `src/pages/Tutors.tsx`
- Feature directory: `src/features/tutor-library/` (all work happens here)
- Dev server: `npm run dev`, then open `http://localhost:8080/tutors`

There are five defects, listed below with their root causes already diagnosed. Fix them in the
order given. Read the "How it works today" and "Invariants" sections before writing any code -
several of the obvious fixes will break deliberate design decisions that have tests guarding them.

Line numbers are accurate as of this brief but may drift; search for the quoted code instead of
trusting the number.

---

## How it works today

**The room.** `RoomRotunda.tsx` builds a four-sided rotunda. Each of the four `SUBJECT_WALLS`
(Primary, Mathematics, English, Science & Social Science) gets a `WallShelves` group: a built-in
cabinet of three bays and four shelf levels, assembled from many small `RoundedBox` meshes
(`CabinetBox`, `CabinetMoulding`, `FramedPanel`, `ShelfFrontProfile`). `RoomShell` adds the floor
(58 individual board meshes), ceiling, corner pilasters and a ceiling fixture. Switching subject
turns the camera around the rotunda rather than swapping content.

**The state machine.** `tutor-library-state.ts` holds a reducer over a `LibraryPhase` union:

```
ROOM_IDLE -> ROOM_TURNING -> ROOM_IDLE
ROOM_IDLE -> BOOK_HOVER_INTENT -> BOOK_EXTRACTING -> BOOK_PREVIEW
          -> BOOK_TO_READING -> BOOK_OPENING -> BOOK_READING
          -> PAGE_TURNING / PAGE_SETTLED -> BOOK_CLOSING -> BOOK_RESETTING -> BOOK_RETURNING
```

Phase durations live in `createBookMotionTimingPolicy` (`tutor-book-motion.ts`):
`hoverIntentMs 90`, `extractionMs 720`, `toReadingMs 520`, `openingMs 900`, `returnMs 560`,
`roomTurnMs 1600`, with an all-zero reduced-motion variant.

`getBookInteractionEvents(state, input, editionId, rootUuid)` is the single entry point that turns
a pointer interaction into reducer events. It rejects any call with an empty `editionId` or
`rootUuid` (`tutor-library-state.ts:129`).

**Two-tier books.** Every shelf slot renders `RoomTutorBook` (in `TutorBook.tsx`), which shows a
cheap `DormantCompleteShelfProxy` - a single rounded box plus two spine texture planes - until a
"rig" is requested. The rig is `CompleteShelfTutorBookBridge`, the real openable book with page
geometry, page-turn physics and a full set of canvas textures. Rig acquisition is gated by
`shouldAcquireCompleteShelfRig` and `shouldStartCompleteShelfRigIntent` in
`complete-shelf-book-pool.ts`. `getCompleteShelfOuterMotionPose` already knows how to pose the
proxy for every phase, including a 4% nudge out of the shelf for `BOOK_HOVER_INTENT`.

**Motion.** `TutorLibrary.tsx` drives all animation with `requestAnimationFrame` loops that call
React `setState` every frame (`setTurnProgress` at line 163, `setBookMotionProgress` at line 184).
Progress is then passed down as props through `TutorLibraryScene` -> `RoomRotunda` -> `WallShelves`
-> `TutorShelf` -> `TutorBook`.

**Controls.** `TutorLibraryControls.tsx` renders an HTML overlay above the canvas: subject tab
buttons (`z-index: 3`), a `<select>` tutor picker, and a reader panel (`.tutor-library__reader`,
`z-index: 4`) holding "Open book", page navigation, close, and a link to the full profile.

**Lighting.** Recently reworked. `TutorLibraryScene.tsx` has low ambient/hemisphere plus a
`LibraryEnvironment` (RoomEnvironment via PMREMGenerator). `RoomRotunda.tsx` has a `CaseLighting`
group - three rect-area strips plus one shadow-casting directional key - mounted once and moved to
whichever wall is being viewed, at an angle from `getIlluminationAngle` in
`tutor-library-lighting.ts`.

---

## Invariants - do not break these

1. **The scene's light count must stay constant.** Adding or removing a light forces three.js to
   recompile every material in the scene, which stalls the room turn. This is why `CaseLighting`
   is one travelling group rather than per-wall rigs toggled on and off. If you need to change
   which wall is lit, move the group; never mount/unmount lights.

2. **Hover must never construct the page rig.** This is a deliberate decision with an explicit
   test: `complete-shelf-book-pool.test.ts:286` asserts
   `shouldStartCompleteShelfRigIntent('hover', 'ROOM_IDLE', false) === false`, commented "hover
   must never construct the page rig". Sweeping the pointer across a shelf must not build eight
   books. Keep that invariant and that test.

3. **Keep the accessibility path intact.** The `<select>` tutor picker, the reader panel buttons,
   the Escape handler, the `aria-live` status region and the `sr-only` full text of every book page
   in `TutorLibraryControls.tsx` are the non-visual route through this feature. They must keep
   working. You may restyle or visually hide the `<select>`, but do not delete it.

4. **Keep the QA surface.** The `data-library-*` attributes on the root `<section>` in
   `TutorLibrary.tsx` and the debug query params (`?libraryQaState`, `?checkpoint=b`,
   `?libraryReviewView`, `?libraryTurnProgress`, `?libraryBookProgress`, `?tutor-book-studio=1`,
   `?libraryForceCanvasError=1`) are used by tests and by the screenshot harness. Do not remove them.

5. **Keep the reduced-motion policy.** `createBookMotionTimingPolicy(true)` must continue to
   collapse durations to zero or near-zero and set `pageRiffle: false`.

6. **Five failures in `tutor-library-acceptance.test.ts` are pre-existing** (screenshot-manifest
   assertions referencing functions that do not exist yet). They are unrelated to this work. Do not
   chase them, and do not let them mask a new failure - note the count before and after.

---

## Verifying

```
node --test --experimental-strip-types "src/features/tutor-library/*.test.ts"   # 117 pass / 5 known fail
node --test src/features/tutor-library/*.test.mjs
npm run typecheck
npm run lint
```

Then run `npm run dev` and exercise `/tutors` by hand. Watch the frame rate in DevTools
Performance and the draw call count in Spector.js or the three.js `renderer.info` panel.

---

## Issue 1 - the book returns to the shelf when you reach for "Open book"

**Symptom.** Click a book, it comes forward, then the moment you move the pointer toward the
reader panel to press "Open book", the book goes back to the shelf. Feels random; it is not.

**Cause.** `TutorLibrary.tsx:230`:

```jsx
<Canvas ... onPointerLeave={() => { cancelPendingIntent(); dispatch({ type: 'LEAVE' }); }}>
```

In the reducer, `LEAVE` from `BOOK_HOVER_INTENT`, `BOOK_EXTRACTING`, `BOOK_PREVIEW` or
`BOOK_TO_READING` all transition to `BOOK_RESETTING`. The reader panel is an absolutely positioned
HTML element at `z-index: 4` sitting on top of the canvas, and it contains buttons so it cannot be
`pointer-events: none`. Moving onto it fires `pointerleave` on the canvas container. The only UI
that can open a book is the one thing that cancels the book. The subject tabs at `z-index: 3` have
the same problem.

**Fix.** Stop equating "pointer left the canvas element" with "the user disengaged". Preferred:
delete the `onPointerLeave` handler from the `<Canvas>` entirely and make returning a book an
explicit action only - Escape (already wired), the "Close and return book" button (already wired),
and optionally a click on empty floor. If you would rather keep an implicit return, move the
handler to the root `.tutor-library` section element and ignore the event when
`event.relatedTarget` is still inside that section.

Note that `LEAVE` is also used by keyboard/QA paths, so keep the reducer's `LEAVE` cases; only
change what dispatches it.

**Done when.** You can click any book, move the pointer anywhere over the overlay UI, and press
"Open book" without the book returning. Escape and "Close and return book" still return it.

---

## Issue 2 - hovering a book does nothing

**Symptom.** Nothing at all happens on hover. No nudge, no highlight, no state change.

**Cause.** `TutorBook.tsx:151`, inside `RoomTutorBook` - the component actually used on the shelf:

```jsx
onPointerEnter={(event) => {
  event.stopPropagation();
}}
```

The handler stops propagation and returns. `onHover` is threaded from `TutorLibrary` all the way
down through `TutorLibraryScene`, `RoomRotunda`, `TutorShelf` and into `TutorBook`, typed at every
level, and then never called. The only caller is `LegacyTutorBook` (`TutorBook.tsx:47`), used only
in studio mode, and it passes `''` as the `rootUuid`, which `getBookInteractionEvents` rejects at
line 129. So the whole `BOOK_HOVER_INTENT` phase, the 90ms dwell and the neighbour lean-in are
unreachable from a real pointer.

**Fix.** Give hover a real, cheap response without violating invariant 2.

Recommended approach - keep hover local and visual:

- Add local `hovered` state to `RoomTutorBook`, set on `onPointerEnter` and cleared on
  `onPointerOut`. Do not dispatch reducer events and do not request a rig.
- Feed that into the proxy pose. `getCompleteShelfOuterMotionPose` already produces the hover pose
  (`sampleCompleteShelfPrototypePose(plan, .04)` for `BOOK_HOVER_INTENT`); reuse the same sample for
  a local hover so the shelf book eases out about 4%, with a small lift and tilt.
- Only respond to hover while `phase === 'ROOM_IDLE'` and nothing is selected, so hovering during
  an extraction or a room turn does nothing.
- Set `document.body.style.cursor = 'pointer'` (or an R3F equivalent) while hovered so the book
  reads as clickable.
- Pass the hovered edition up so `TutorShelf` can apply the existing `neighbourResponse` lean to the
  two adjacent books - that code path exists and currently only fires for the selected book.
- Ease the nudge with a short spring or a 120-180ms tween rather than snapping.

Then delete the now-dead `onHover` prop from the `RoomTutorBook` path, or wire it properly - do not
leave a typed prop threaded through five components that nothing calls.

If instead you want the reducer to own hover, you must give the proxy a stable identity to use as
`rootUuid` and add a rebind step when the real rig later mounts with a different uuid. That is more
invasive and touches `tutor-library-state.test.ts` (447 lines of reducer tests). Prefer the local
approach unless there is a reason not to.

**Done when.** Hovering a spine eases it out of the shelf and leans its neighbours, the cursor
changes, nothing is built, and moving away eases it back. `complete-shelf-book-pool.test.ts` still
passes unchanged.

---

## Issue 3 - clicking a book takes seconds to do anything

**Symptom.** First click on any book: a long freeze, then the book slowly comes forward, and it is
still not open - you have to act again to open it.

**Cause, part one - a synchronous texture build on the click path.** On first click
`rootUuid.current` is undefined, so `RoomTutorBook` sets a rig intent, mounts
`CompleteShelfTutorBookBridge`, and only calls `onActivate` from the bridge's `onReady`. Building
the rig runs `createCompleteShelfPresentation` (`complete-shelf-presentation.ts`), whose
`CANVAS_METADATA` is:

| surface        | size        | count |
| -------------- | ----------- | ----- |
| cover + foil   | 1536 x 2304 | 2     |
| back + foil    | 1536 x 2304 | 2     |
| spine + foil   | 512 x 2304  | 2     |
| endpaper       | 1024 x 1536 | 1     |
| interiors      | 1536 x 2048 | 6     |

That is roughly 37 million pixels rasterised in Canvas2D and uploaded to the GPU, synchronously,
on the main thread, before the click can even become a reducer event. Roughly 150 MB of texture
before mipmaps.

**Cause, part two - a click only reaches preview.** Even once the rig is ready, the dispatched
event is `HOVER` (not `OPEN`, because the book is not yet the current selection), so the chain is
`BOOK_HOVER_INTENT` (90ms) -> `BOOK_EXTRACTING` (720ms) -> `BOOK_PREVIEW`. Roughly a second of
animation to arrive at "in front of you but shut", requiring a second action to open.

**Fix.**

*Get the texture work off the click path:*

- Halve the raster sizes. Cover and back at 768 x 1152, spine at 256 x 1152, interiors at
  1024 x 1365. At the on-screen size of an open book these are visually indistinguishable and cut
  the pixel count by about 75%.
- Build lazily. Generate cover, spine, back and the first interior spread up front; generate the
  remaining interiors on demand as pages are turned, or during idle after the book is open.
  `createTutorBookPages` already gives you the page list to key this off.
- Yield between canvases. Even without a worker, awaiting a `requestAnimationFrame` between each
  canvas turns one long block into several short ones, so the extraction animation can start and
  run while the rest builds.
- Better if practical: move the raster work to an `OffscreenCanvas` in a worker and transfer
  `ImageBitmap`s back. `createImageBitmap` + `texture.image = bitmap` avoids the main-thread cost
  entirely. Guard with a feature check and fall back to the yielding path.
- Cache per tutor, like `TutorBookCover.tsx` already does with its module-level `COVER_TEXTURES` /
  `FOIL_TEXTURES` maps, so reopening a book is instant.

*Make the click responsive immediately:*

- Start the extraction animation on the dormant proxy the instant the click lands, rather than
  waiting for `onReady`. The proxy already has correct poses for every phase via
  `getCompleteShelfOuterMotionPose`, so it can play `BOOK_EXTRACTING` on its own; swap the rig in
  when it is ready. If the rig lands mid-animation the handover should be invisible because both
  use the same pose plan.
- Add a visible acknowledgement within about 100ms of the click regardless - the book lifting, or
  a brief spine highlight. Never leave the pointer with no feedback.

*Cut a step out of the journey:*

- A click on a shelf book should mean "open this book". Route it so that a click on an unselected
  book goes to `BOOK_TO_READING` rather than parking in `BOOK_PREVIEW` - either by setting
  `openRequested: true` on the initial transition (the reducer already honours that flag in
  `BOOK_EXTRACTING`), or by dispatching `OPEN` immediately after the selecting `HOVER`.
- Keep `BOOK_PREVIEW` reachable as a phase - the QA harness and the reader panel's "Open book"
  button depend on it - but it should no longer be where a plain click stops.
- Trim `extractionMs` from 720 to about 450 and `toReadingMs` from 520 to about 380. The current
  values were tuned when the click was already slow for other reasons.

**Done when.** A cold click on a book shows motion within ~100ms, never blocks the main thread for
more than ~50ms in one go (check the Performance panel for long tasks), and lands open in about a
second rather than landing shut in about two.

---

## Issue 4 - the whole experience is laggy

**Symptom.** Low, uneven frame rate everywhere, including when nothing is happening.

**Causes and fixes, in order of payoff:**

**a) Every animation frame re-renders the entire React tree.** `TutorLibrary.tsx:163` and `:184`
call `setTurnProgress` and `setBookMotionProgress` from inside `requestAnimationFrame`. Progress is
React state passed down as props, so every frame reconciles `TutorLibraryScene` -> `RoomRotunda` ->
four `WallShelves` -> every panel, moulding, shelf profile, floorboard and book. `CameraFrame`'s
`useLayoutEffect` also re-runs each frame because `turnProgress` is in its dependency array.

Fix: move continuous motion into `useFrame` inside the Canvas, mutating refs and object transforms
directly. Keep a mutable progress object (a `useRef` holding `{ turn: 0, book: 0 }`) rather than
state; have a driver component inside the Canvas advance it and apply transforms to the camera and
to each book's group. React state should change only when the *phase* changes - which is roughly
once or twice per second, not sixty times. Phase-completion events (`TURN_COMPLETE`, `EXTRACT`,
`PREVIEW_READY`, `READING_POSE_READY`, `RETURN_COMPLETE`) should be dispatched from the driver when
progress reaches 1, preserving the existing `transitionGeneration` guard so a stale frame cannot
complete a superseded transition.

This is the single largest win. Do it first.

**b) Nothing culls the three walls you cannot see.** `RoomRotunda` maps all four `SUBJECT_WALLS`
unconditionally, so three complete cabinets and about 24 books you are facing away from are built,
lit, shadowed and reconciled every frame.

Fix: set `visible={false}` on the groups for walls that are neither the active nor the pending
wall. Prefer toggling `visible` over unmounting - unmounting would destroy and recreate geometry
and cached textures on every turn. `visible={false}` skips both the main render and the shadow
pass. Keep both the from-wall and the to-wall visible for the duration of a turn.

**c) Several hundred unbatched draw calls.** Every `CabinetBox` is its own mesh and therefore its
own draw call: about 60 meshes per wall for the cabinet, 95 for the room shell (58 of them floor
boards), plus 3 per dormant book. Roughly 400+ meshes, drawn again for the shadow pass.

Fix, in increasing order of effort:
- Turn the 58 floor boards into a single `InstancedMesh`, or merge them into one geometry with
  per-vertex colour for the five tone variants.
- Merge the static cabinet geometry per wall with `BufferGeometryUtils.mergeGeometries`, grouped by
  material. The cabinet never animates, so nothing is lost. `createCabinetBlueprint` already gives
  you all the positions declaratively; build the merged geometry in a `useMemo` keyed on wall width.
- Share geometry between the dormant book proxies - they differ only in transform and texture.

**d) Texture pressure.** `TutorBookCover.tsx` builds two canvas textures per dormant book
(384 x 1536 for the spine pair) with `anisotropy = 16` and full mipmaps. With 32 books that is 64
textures at first paint.

Fix: drop `anisotropy` from 16 to 4 for the spine textures (they are viewed close to head-on and
never at a grazing angle), and from 8 to 4 in `configureMaterialTexture`. Consider generating the
spine texture at 256 x 1024. Consider building spine textures only for the wall being viewed, on a
`requestIdleCallback`, since the other walls' spines are not visible.

**e) Lighting cost from the recent relight.** `CaseLighting` in `RoomRotunda.tsx` uses three
rect-area lights, which are expensive per fragment (they evaluate an LTC approximation), plus a
directional shadow at `shadow-mapSize={[2048, 2048]}`.

Fix: measure first. If the fragment cost is significant, reduce to two strips, or drop the shadow
map to 1024 and rely on `shadow-normalBias` tuning. Do not remove lights conditionally at runtime -
see invariant 1. Any change here should be a constant, not a toggle.

**Done when.** A steady 60fps sitting idle on a wall, no long tasks in the Performance panel while
idle, draw calls per frame reduced by at least half, and React DevTools shows no component
re-rendering during an idle frame.

---

## Issue 5 - the dropdown undercuts the whole metaphor

**Symptom.** The primary affordance on an immersive 3D library is a native `<select>` reading
"Select a book from the shelf". It tells the visitor the room is decoration.

**Fix.** Keep the `<select>` in the DOM for keyboard and screen reader users (see invariant 3), but
make it visually hidden - the usual `sr-only` pattern, still focusable, revealed on `:focus-visible`
so a keyboard user can see where they are. With Issue 2 fixed, sighted users get hover feedback and
click directly on the books.

The subject tabs may stay as buttons for now, but restyle them so they read as part of the room
rather than as web UI - a compass or room plan showing which of the four walls you are facing.
Retain `aria-pressed` and the disabled-during-turn behaviour.

**Done when.** No visible dropdown at rest, tab order still reaches the picker, and a keyboard-only
user can still select and open any tutor's book.

---

## Order of work

1. Issue 1 - one handler, removes the most damaging symptom.
2. Issue 2 - hover feedback, small and self-contained.
3. Issue 4a - move per-frame motion out of React state. Largest performance win.
4. Issue 4b - cull the unseen walls.
5. Issue 3 - texture build and the click-to-open journey.
6. Issue 4c/4d - geometry merging and texture settings.
7. Issue 5 - hide the dropdown.

Commit each numbered item separately so any regression can be bisected.

## Out of scope

Do not change the room's architecture, the cabinet proportions, the book geometry, the four-wall
subject split, or the recently reworked lighting design (colours, positions, the travelling
`CaseLighting` group). Do not add a post-processing pipeline - that is a separate piece of work.
Do not add dependencies without saying why.
