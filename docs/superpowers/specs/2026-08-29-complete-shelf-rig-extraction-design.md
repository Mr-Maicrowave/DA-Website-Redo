# Complete Shelf Rig Extraction Design

## Status

Approved by the user on 2026-08-29 as Checkpoint 1. Checkpoint 0 at `/dev/complete-shelf-reference` is the immutable parity baseline.

## Goal

Extract one Codex hardcover from the approved Complete Shelf application into a standalone imperative Three.js rig without changing the physical construction, materials, opening mechanics, page geometry, deformation constants, page-turn path, settling, closing, or reset behaviour.

## Boundary

The extracted rig owns one persistent book object: boards, spine, hinges, endpapers, cloth turn-ins, page block, page edges, headbands, bookmark, foil surfaces, cover pivot, six page pivots, segmented page geometry, deformation, opening, page turning, closing, reset, and disposal.

The isolated host owns only renderer, neutral scene, camera, lighting, responsive layout, accessible state controls, animation timing, and screenshot-friendly state selection.

Do not include shelf navigation, carousel state, audio, book selection, the continuous shelf, the reference room, editorial detail UI, DA data, DA artwork, R3F, or Tutor Library integration.

## Source fidelity

- Source: `public/dev/complete-shelf-reference/index.html`
- Pinned upstream commit: `b0b532411a9ba9f56ebcebdffe06747be0dcd84d`
- Approved source SHA-256: `163B4A99D34E24CE8AB205F28F1D3F1F33DA216285BE2C5DB31422F13090B026`
- Use the Codex record, artwork crop, proportions, geometry builders, texture generators, material parameters, cover/page pivots, flexible-page segments, and deformation constants directly from the approved source.
- Keep the approved reference file byte-identical.
- Source code may be reorganised only enough to isolate the rig and remove unrelated application dependencies.

## Imperative API

`createCompleteShelfBookRig(config)` returns one persistent Three.js root and controller. The minimal public contract is:

```js
{
  root,
  controller: {
    open(),
    close(),
    setOpenProgress(progress),
    setPageTurnProgress(progress),
    settlePage(),
    reset(),
    update(delta),
    getSnapshot()
  },
  dispose()
}
```

The implementation may add a narrowly required method, but must not create substitute closed/open/page models. `root` remains the same object for every state.

## Isolated route

`/dev/complete-shelf-rig` renders one Codex rig in a neutral studio. It provides deterministic controls for:

1. Closed front
2. Closed three-quarter
3. Half open
4. Fully open
5. Page turn 25%
6. Page turn 50%
7. Page turn 75%
8. Page settled
9. Closed again
10. Reset

Controls may reposition the camera for front versus three-quarter evidence, but camera changes are host concerns and cannot alter the book root or internals.

## Acceptance

- The reference route hash remains unchanged.
- Every required state uses the same `root` identity.
- Reset returns cover angle, page-turn progress, page stack, and page deformation to the source closed state.
- Side-by-side browser evidence shows the same proportions, board/spine construction, cloth, foil, page block, binding, opening angle, page curvature, turn path, and settling.
- Desktop and a narrow viewport render without clipping or console errors.
- Checkpoint 1 stops before R3F, DA artwork, shelf orientation, DA shelf, or Tutor Library integration.

## Commercial source note

The upstream repository did not contain a standard licence file at the pinned commit. This local parity/extraction prototype does not resolve commercial reuse permission.
