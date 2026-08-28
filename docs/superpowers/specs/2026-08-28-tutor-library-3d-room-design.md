# Tutor Library 3D Room — Design Specification

## Decision

Replace the `/tutors` hero experience with a production React Three Fiber tutor-library scene. The existing isolated room preview remains visual direction only; its navy study, walnut shelving, cream pages, cloth-bound burgundy/navy/brown books, gold detailing, adjacent-wall framing, and warm practical light are retained.

The scene is an immersive team showcase. It does not introduce tutor availability, placement, booking, invented qualifications, or duplicate tutor content. The existing full profile and enquiry path remain reachable.

## Current system and disposition

- `src/pages/Tutors.tsx` currently toggles `TutorOrbitHero` and embedded `FindTeacher`.
- `src/pages/FindTeacher.tsx` already provides search, filters, pagination, accessible profiles, enquiry, and `?tutor=` deep-link opening. It remains the canonical conventional discovery/fallback surface.
- `src/data/teacherCatalogue.ts` remains the sole canonical tutor source, including images, subject strings, tags, profiles, and photo positioning.
- `src/features/tutor-orbit/*` is not deleted in this change. The library becomes the default `/tutors` experience; Orbit is retained until the replacement has passed visual, accessibility, and responsive acceptance checks.
- `.superpowers/brainstorm/*` is an isolated review artefact, not production code.

## Data model

Add one derived room configuration, not a second tutor database.

```ts
type SubjectWall = {
  id: string;
  label: string;
  palette: 'primary' | 'mathematics' | 'english' | 'science-social';
  matches: (tutor: CatalogueTutor) => boolean;
};

type TutorBookEdition = {
  tutorId: string;
  wallId: string;
  shelfIndex: number;
  slotIndex: number;
  materialVariant: number;
};
```

Walls are generated from `SubjectWall[]`; their count determines polygon angles, nearest neighbours, camera targets, indicators, and book editions. A multi-subject tutor creates multiple editions but every edition resolves to one `CatalogueTutor`. Initial walls are Primary, Mathematics, English, and Science & Social Science, with the latter covering Science, Chemistry, Business Studies, and Legal Studies. No geometry or camera rule hard-codes the number four.

## Production architecture

Use installed `three`, `@react-three/fiber`, and `@react-three/drei`; add no renderer dependency.

- `TutorLibraryScene`: canvas host, DPR cap, scene lifecycle, semantic DOM overlay, and reduced-motion fallback.
- `RoomRotunda`: data-driven wall transforms around a regular polygon, floor/ceiling, shelf recesses, practical light, ambient light, and low-cost contact shadows.
- `SubjectWall` / `TutorShelf`: derive editions and stable exact shelf transforms from the room config.
- `TutorBook`: one structural object: spine, front/back boards, hinges, endpapers, page block, page-sheet container, cover texture/material, and stable shelf pose.
- `RoomCameraController`: deterministic time-based camera rotation between wall angles; preserves the physical room corner and parallax throughout.
- `LibraryInteractionState`: a reducer/state machine owning legal transitions and cancellation/recovery.
- `TutorBookReader`: physical reading pose and later editorial page spreads, tied to the same book world transform.
- `TutorLibraryA11y`: semantic buttons/listbox-style controls, live status, keyboard routes, and a DOM profile route to `FindTeacher`.

React state changes only at interaction boundaries. `useFrame` updates camera/book transforms from sampled timelines without allocations or per-frame React renders.

## State machine

The design supports the final lifecycle now:

`ROOM_IDLE → ROOM_TURNING → BOOK_HOVER_INTENT → BOOK_EXTRACTING → BOOK_PREVIEW → BOOK_OPENING → BOOK_READING → PAGE_DRAGGING/PAGE_TURNING → BOOK_CLOSING → BOOK_RETURNING → ROOM_IDLE`

Initial production milestones fully implement room turn, hover/extraction, preview, opening/closing, and exact return. Page dragging/curved sheets are introduced after those visual gates pass, but the book already owns its page-sheet container. Transitions use named deterministic timelines with exact start/end poses. Reparenting, if needed, copies world matrix before and after movement so no object jumps.

## Camera and room turn quality gate

Camera targets are calculated from wall angle and a fixed natural field of view (start at 45°; tune only after browser inspection). A turn lasts about 1.0–1.2 seconds, accelerates into the middle, then controlledly settles. The previous wall, corner, and target wall are simultaneously rendered during the turn; near shelf edges, book depth, floor, ceiling, and the practical light produce visible parallax.

Directional motion blur is a restrained, performance-gated camera-turn-only effect. It follows angular velocity and returns to zero before settle. No opacity, crossfade, flat slide, or content substitution is a core part of turning.

## Book continuity and craft gate

A resting edition has readable embossed-style spine text, shallow board thickness, page-block edges, cloth/wood/gold material variation, shelf recess, and contact shadow. Hover first advances the same book slightly (100–180ms), then extraction continues from that transform. Neighbours lean/close the gap minimally and the selected slot becomes visibly dark.

The selected mesh moves from its own exact shelf matrix, clears the shelf, approaches the camera, and rotates from spine to front board over roughly 500–750ms. The cover artwork is generated from the tutor's existing portrait/name/designation/tagline and is a material on the physical front board—not an HTML card. The book remains inside the room at every state.

Opening moves the same closed book into its reading pose, rotates the front board around its hinge, and exposes endpapers/page block. The reader occupies roughly 75–85% of usable desktop view, leaving its origin shelving and room light recognisable behind it. Closing reverses the same timelines and restores the exact shelf matrix.

## Page system (later production phase, not optional)

Tutor content maps to several spreads only where source fields exist: cover; approach/strengths; why DA; goals/what students remember. No fields are invented. The active sheet uses segmented geometry with a bend/twist curve, moving shadow, and deterministic settle, following Complete Shelf's interaction principles without copying its code/assets. Buttons/keyboard provide page movement in addition to pointer/touch drag.

## Search, filters, routing, and mobile

The library has a persistent semantic search and subject selector. Search finds name, designation, tagline, subjects, and supplied profile tags; subject selection rotates through the scene's actual shortest wall path. Search results focus matching editions and announce count; it does not duplicate tutor records.

`/find-teacher?tutor=<id>` remains valid. Selecting a profile action from the open book navigates there. The existing `FindTeacher` remains the accessible conventional fallback, preserving pagination and enquiry.

Desktop uses hover + click. Tablet uses tap to preview then explicit Open. Mobile retains the rotunda concept with reduced camera distance, tap states, swipe/controls between walls, and explicit page controls—never an unrelated card grid. `prefers-reduced-motion` uses short deterministic spatial transitions, no blur/idle drift/riffle, and immediate readable profile controls.

## Accessibility and performance

Every book has an accessible name, visible focus, Enter/Space action, and a non-hover path. Arrow keys turn walls or pages by context; Escape closes/returns safely. A live region reports wall and selected tutor state. The canvas has semantic DOM controls and no profile information exists only in WebGL.

Cap DPR initially at 1.5–2 after measurement; share geometries/materials; cache cover textures; avoid per-frame allocations; use few lights; suspend idle work when hidden; and use motion blur only during turns on capable desktop hardware. Dispose scene resources on unmount.

## Implementation checkpoints

1. **A — Room:** production route and data-driven rotunda, canonical images/data, baseline screenshot.
2. **B — Camera:** resting and mid-turn captures prove corner/parallax/no fade. This gates later work.
3. **C — Extraction:** resting, partial extraction, and cover-preview captures prove one continuous book.
4. **D — Opening:** closed, half-open, and settled-reader captures prove hinge continuity.
5. **E — Page physics:** beginning, mid-turn, and settled-page captures prove curvature/shadow.
6. **F — Final profile:** full tutor spread inside visible room, search/filter, return, mobile, keyboard, reduced-motion, and performance checks.

## Verification

For each checkpoint: targeted unit tests for data/state/geometry helpers, typecheck, production build, and rendered desktop/tablet/mobile evidence. Test rapid turns, rapid hover/click, Escape during opening, another-book selection, resize, hidden-tab resume, keyboard, reduced motion, and console errors. Do not remove Tutor Orbit until the library meets the checkpoint gates and `/find-teacher` remains verified.

## Reference boundary

Study [Complete Shelf](https://github.com/mengto/complete-shelf) for separate boards/hinges/page segmentation, deterministic shelf-detail endpoints, interaction state, and verification discipline. Implement original DA visual treatment, code, cover art, and profile content; carry any applicable attribution only if code is actually reused.
