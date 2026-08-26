# Mathematics syllabus scroll story — final fix report

Date: 2026-08-21

Branch: `codex/phil-work-snapshot`

Scope: final-review corrections only

## Outcome

Both Important review findings are addressed.

1. Mobile and reduced-motion variants no longer place six decorative plates before the story copy. They render one completed `explore` visual in normal flow, with the static final SVG state layered over it, followed by the heading and all six readable beat explanations.
2. All six raster plates were retouched so they no longer contain a baked hero point, dominant curve, trajectory, tangent, arrow or vector that competes with the live SVG. Cream paper grain, torn edges, translucent vellum, depth, lighting and plate-specific planes were retained.

The requested minor cleanup is also complete:

- Replaced the casted `ScrollTrigger.matchMedia(...)` call with the typed `gsap.matchMedia()` / `media.add(...)` lifecycle.
- Mount-order coverage now proves that both JSX mounts exist before comparing their indices.
- `getStoryBeat` now has explicit unknown-id error coverage.

## Implementation details

### Static mobile and reduced-motion flow

- Added `.maths-syllabus-story__visual` as the common plate/SVG composition wrapper.
- Desktop retains the full stacked six-plate composition and one pinned GSAP timeline.
- Mobile and reduced motion show only `[data-plate='explore']`.
- The SVG remains visible in these static variants, with final-state line/glow/vector opacity and final point transform applied by CSS.
- The representative visual precedes the heading and the six semantic `<article>` explanations in DOM/document flow.
- The `explore` plate is eager-loaded alongside the initial desktop plate so the static variant does not wait on lazy loading.

### Raster plate retouch

The built-in image editor was used in precise-object-edit mode after inspecting every original plate. The edit invariant was to remove every baked precise point and dominant path/trajectory/vector while preserving cream paper, vellum planes, material depth, lighting and composition. Each selected result was inspected again, resized non-destructively to a candidate WebP, verified, then used to replace only the six named checked-in plates.

| Asset | Dimensions | Bytes | Visual finding |
| --- | ---: | ---: | --- |
| `01-model.webp` | 1920×1080 | 85,926 | Hero point, axes and network path removed; paper field retained |
| `02-function.webp` | 1920×1080 | 69,826 | Function curve and point removed; paper folds retained |
| `03-tangent.webp` | 1920×1080 | 36,070 | Curve, tangent and point removed; deckled edge and drafting plane retained |
| `04-integral.webp` | 1920×1080 | 50,018 | Curve and points removed; softened gold material plane retained |
| `05-vectors.webp` | 1920×1080 | 26,198 | Origin, trajectory and arrows removed; folded architectural planes retained |
| `06-structure.webp` | 1920×1080 | 28,262 | Curves, points, mesh and arrows removed; right-side vellum architecture retained |

The project asset README now records the retouch invariant, corrected crop descriptions and current byte counts.

## Automated verification

| Check | Result | Evidence |
| --- | --- | --- |
| Story + HSC pathway source tests | PASS | 25/25 tests, 0 failures |
| New rendered browser regression | PASS | 2/2 tests: 390×844 mobile and emulated reduced motion |
| Typecheck | PASS | `npm.cmd run typecheck`, exit 0 |
| Touched-file ESLint | PASS | Feature TSX/tests/browser test, exit 0 |
| Repository-wide ESLint | BLOCKED OUTSIDE SCOPE | 7 pre-existing/unrelated errors in `src/pages/SuccessStories.tsx`, five `.worktrees` copies, and `skills/video-shotcraft/.../UiStripAwayOutro.tsx` |
| Standard build wrapper | BLOCKED OUTSIDE SCOPE | Encoding guard reports existing mojibake in `.worktrees/why-da-community/src/pages/WhyChooseDA.tsx` |
| Direct production Vite build | PASS | 2,545 modules transformed; build completed in 15.96s |
| Asset contract | PASS | Exactly six WebPs; all 1920×1080; largest 85,926 bytes |
| Whitespace check | PASS | `git diff --check`, exit 0 |

## Rendered QA

Target flow: `/subjects/mathematics` → enter the syllabus story → see one representative completed visual → read all six explanations → continue naturally into `HscMathsPathway`.

### Mobile — in-app Browser, 390×844

- Correct route and title loaded.
- Framework overlay absent and meaningful page DOM present.
- One visible plate only: `explore`.
- Live SVG overlay visible.
- Six of six beat articles visible and in approved order.
- Static positioning; no pin spacer or scroll trap.
- `scrollWidth` equalled `clientWidth`; no horizontal overflow.
- Story was scrolled through into the HSC pathway as the interaction proof.
- No warnings or errors in the in-app Browser console log.

### Reduced motion — Puppeteer fallback, 390×844

The in-app Browser supports viewport control but not media-feature emulation, so the repository's existing Vite/Puppeteer approach was used for the missing reduced-motion capability.

- `matchMedia('(prefers-reduced-motion: reduce)').matches` was true.
- One visible plate only: `explore`.
- Live SVG overlay visible in its completed static state.
- Six of six beat articles visible.
- Sticky scene computed to `position: static`.
- No `.pin-spacer` was created.
- No horizontal overflow.
- Screenshot inspected at `C:\Users\phill\.codex\visualizations\2026\08\20\01a01f5d-0a63-7d10-83c2-3652a286e6fd\maths-story-reduced-motion.png`.

## Remaining concerns

- Repository-wide lint and the standard build wrapper remain blocked by the unrelated files listed above. The touched-file lint, typecheck, focused tests and direct Vite production build are green.
- Puppeteer surfaces three known unrelated console categories during the reduced-motion run: the existing unsupported preload `as` warning, sandbox-denied external network resources, and Framer Motion's expected reduced-motion advisory. The regression test preserves these as known noise and still fails on any other warning/error or page exception.
- Vite retains the pre-existing large-chunk warning (`index` JavaScript over 500 kB); this fix does not alter bundle architecture.
- Unrelated untracked paths present before this pass (`docs/...plan`, `out/`, `skills/`, `src/examples/`, `src/lib/motion.tsx`) were not modified or staged.
