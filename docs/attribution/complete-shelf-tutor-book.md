# Complete Shelf-derived TutorBook prototype

The Tutor Library work references Meng To's published **Complete Shelf** source:

- https://github.com/MengTo/complete-shelf
- `README.md`, `PROMPT.md`, and `index.html` were inspected on 2026-08-29.
- The upstream repository did not contain a standard `LICENSE` or `COPYING` file at commit `b0b532411a9ba9f56ebcebdffe06747be0dcd84d`. Explicit author permission should be obtained before a Complete Shelf-derived engine is shipped commercially.

## Checkpoint 0 reference

`public/dev/complete-shelf-reference/index.html` is a byte-for-byte copy of the pinned upstream document. It intentionally retains the complete reference scene, artwork, titles, branding, embedded assets, audio, lighting, cameras, geometry, materials, and interactions so visual and behavioural parity can be evaluated before extraction. Its SHA-256 is `163B4A99D34E24CE8AB205F28F1D3F1F33DA216285BE2C5DB31422F13090B026`.

This isolated reference is not the DA Tutor Library, is not wired into `/tutors`, and must not be treated as production DA content.

## Checkpoint 1 extracted rig

`public/dev/complete-shelf-rig/complete-shelf-book-rig.js` extracts one imperative Codex physical-book factory from the same pinned source commit (`b0b532411a9ba9f56ebcebdffe06747be0dcd84d`). It retains the Codex metadata, the cover-atlas crop contract, material construction, board/page measurements, six articulated leaves, 18×8 flexible-page meshes, page-stack offsets, page bow/twist deformation, and opening/page-turn mechanics.

The neutral `/dev/complete-shelf-rig` host reads the embedded Codex atlas crop from the immutable reference document at runtime so it uses the approved pinned artwork without introducing DA art or data. It deliberately omits the source application’s shelf, room, other books, product branding, audio, interaction/raycast systems, UI, React/R3F, and Tutor Library integration. The upstream source still has no standard licence; do not ship this derivative commercially without explicit author permission.

## Preserved recovery prototype

The earlier custom React Three Fiber prototype remains preserved in commit `34d9faa`. It independently approximates the physical-book structure and uses DA tutor data and DA-generated cover content. It is retained only as a fallback/recovery implementation and is not the Checkpoint 0 parity source.
