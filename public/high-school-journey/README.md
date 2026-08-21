# High School Journey assets

This directory is reserved for independently animatable assets used by the
High School 2.5D watercolour journey. Existing project assets remain in their
original locations and are referenced by the TypeScript manifest rather than
duplicated here.

## Structure

- `background/` — distant landscape and atmospheric layers
- `foreground/` — close camera-pass paint and desk layers
- `watercolour/` — colour-world washes, pigment and droplets
- `objects/` — reusable transparent educational decorations
- `plane/` — paper-plane artwork and motion-path SVG
- `textures/` — paper grain and watercolour edge masks

Raster artwork added later should be transparent PNG or WebP where alpha is
required, should contain no text, and should be exported close to its maximum
rendered size (normally 1600–2200 px wide for full-width desktop layers).

