# Complete Shelf Rig Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract one source-faithful Codex hardcover into a standalone imperative Three.js rig and prove it on `/dev/complete-shelf-rig`.

**Architecture:** A browser ES module owns the physical book factory and controller; a small static HTML host owns the renderer, neutral studio, camera, lights, state controls, and render loop. The immutable Checkpoint 0 file remains the source of truth and is not imported at runtime or edited.

**Tech Stack:** Imperative Three.js 0.165.0 ES modules, static HTML/CSS/JavaScript served by Vite, Node route-integrity checks, in-app browser visual QA.

**Spec:** `docs/superpowers/specs/2026-08-29-complete-shelf-rig-extraction-design.md`

## Global Constraints

- Do not edit `public/dev/complete-shelf-reference/index.html`; its SHA-256 must remain `163B4A99D34E24CE8AB205F28F1D3F1F33DA216285BE2C5DB31422F13090B026`.
- Extract exactly one Codex book and keep one persistent `THREE.Group` across every state.
- Keep the engine imperative Three.js; do not use React, JSX, R3F, DA data, DA artwork, DA shelves, or Tutor Library production components.
- Copy source geometry, texture, material, cover/page pivot, page deformation, and page-turn constants without visual reinterpretation.
- Do not include shelf navigation, carousel, audio, book selector, continuous shelf scene, reference room, or editorial detail panel.
- Stop after Checkpoint 1 visual evidence and do not begin Checkpoint 2.

---

### Task 1: Extract and prove one Complete Shelf Codex rig

**Files:**
- Create: `public/dev/complete-shelf-rig/complete-shelf-book-rig.js`
- Create: `public/dev/complete-shelf-rig/index.html`
- Create: `public/dev/complete-shelf-rig/SOURCE.md`
- Create: `scripts/verify-complete-shelf-rig.mjs`
- Modify: `vite.config.ts`
- Modify: `package.json`
- Modify: `docs/attribution/complete-shelf-tutor-book.md`
- Test: `scripts/verify-complete-shelf-rig.mjs`

**Interfaces:**
- Consumes: the approved source at `public/dev/complete-shelf-reference/index.html` and its pinned Codex book data/artwork.
- Produces: `createCompleteShelfBookRig(config)` returning `{ root, controller, dispose }`; controller methods `open`, `close`, `setOpenProgress`, `setPageTurnProgress`, `settlePage`, `reset`, `update`, and `getSnapshot`; isolated route `/dev/complete-shelf-rig`.

- [ ] **Step 1: Write the failing route/contract gate**

  Create `scripts/verify-complete-shelf-rig.mjs` so it fetches both `/dev/complete-shelf-rig` route forms and fails unless the response is HTML, identifies the extracted Codex rig, and loads the dedicated book-rig module. It must also hash `public/dev/complete-shelf-reference/index.html` and fail if the approved reference changed. Add `test:complete-shelf-rig` to `package.json`.

- [ ] **Step 2: Run the gate and verify RED**

  Run `npm.cmd run test:complete-shelf-rig -- http://127.0.0.1:8080` with the existing local server. Expected: FAIL because `/dev/complete-shelf-rig` does not exist or resolves to the SPA fallback.

- [ ] **Step 3: Extract the physical Codex book factory**

  Build `complete-shelf-book-rig.js` by lifting the Codex data, cover-atlas/crop inputs, geometry builders, texture generators, material construction, `createBookRig`, `updateFlexiblePage`, and `updatePaginatedBook` mechanics from the approved source. Remove only application dependencies. Preserve source constants including six page pivots, 18 horizontal by 8 vertical flexible-page segments, cover/page angles, bow/twist equations, material values, board/page dimensions, and page stack offsets. Export `createCompleteShelfBookRig(config)` with the exact interface above.

- [ ] **Step 4: Implement one neutral isolated host**

  Create `index.html` with one renderer, one scene, one perspective camera, restrained neutral floor/background, source-compatible tone mapping/environment and comparable key/fill lighting. Instantiate one rig once, keep its root identity, drive `controller.update(delta)` from the render loop, and provide accessible controls plus a `?state=` query option for all ten required states. State changes must drive the existing controller; they must not swap meshes or instantiate another book.

- [ ] **Step 5: Wire the isolated route and document provenance**

  Extend the existing Vite internal-route middleware without changing the approved reference mapping. Add `/dev/complete-shelf-rig` and its trailing-slash form. Document exact source commit, copied responsibilities, deliberately omitted application systems, and the missing-licence warning in `SOURCE.md` and the shared attribution note.

- [ ] **Step 6: Run GREEN checks**

  Run:

  ```text
  npm.cmd run test:complete-shelf-rig -- http://127.0.0.1:8080
  npm.cmd run test:complete-shelf-reference -- http://127.0.0.1:8080
  npm.cmd run typecheck
  npm.cmd run check:encoding
  git diff --check
  npm.cmd exec vite build
  ```

  Expected: all exit 0; the only acceptable build message is the existing chunk-size warning.

- [ ] **Step 7: Render and compare every required state**

  In the in-app browser, verify page identity, nonblank WebGL, no framework overlay, zero relevant console warnings/errors, and one persistent rig identity across closed front, closed three-quarter, half open, fully open, 25/50/75% page turn, settled page, closed again, and reset. Capture reference and rig evidence at desktop plus the rig at 390×844. Maintain a mismatch ledger; any substantial physical-book mismatch blocks completion.

- [ ] **Step 8: Commit the checkpoint**

  Commit only after the route, controller contract, source hash, production build, and rendered comparison pass. Use commit message `feat: extract Complete Shelf Codex book rig`.
