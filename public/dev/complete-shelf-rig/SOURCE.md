# Complete Shelf Codex rig provenance

Source baseline: `public/dev/complete-shelf-reference/index.html`, pinned to upstream Complete Shelf commit `b0b532411a9ba9f56ebcebdffe06747be0dcd84d` with SHA-256 `163B4A99D34E24CE8AB205F28F1D3F1F33DA216285BE2C5DB31422F13090B026`.

`complete-shelf-book-rig.js` lifts the source’s Codex book data, cover-atlas crop input, cover/paper/cloth texture generation, PBR material values, rounded board/page geometry, six pivoted leaf meshes, 18 horizontal by 8 vertical flexible-page segments, board/page dimensions, stack offsets, cover opening angles, and the page bow/twist update equations. It exposes only `createCompleteShelfBookRig(config)`, returning `{ root, controller, dispose }`.

The host is intentionally neutral and creates one renderer, scene, camera, floor, lights, and one persistent rig root. It obtains the Codex atlas crop from the immutable local reference and supplies it to the extracted factory. Its `vendor/` folder is a local copy of the project-installed Three.js `0.170.0` runtime plus the two source-compatible addon modules; only their `three` import specifiers were mechanically localized so this dev proof remains offline-capable. It does not add DA artwork, DA tutor data, shelf/room construction, product UI, audio, raycasting/gesture controls, React/R3F, or production-route integration.

The upstream repository had no standard `LICENSE` or `COPYING` file at the pinned commit. This derivative must not be shipped commercially without explicit author permission.
