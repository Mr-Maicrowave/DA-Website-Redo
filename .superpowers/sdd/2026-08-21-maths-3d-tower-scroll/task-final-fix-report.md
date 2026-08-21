# Final Fix Report — Mathematics 3D Tower Scroll Story

Date: 2026-08-21
Branch: `codex/maths-tower-scroll-story`

## Outcome

All four final-review Important findings are addressed:

1. The ball reaches curve progress `1` at story progress `0.92`, holds on the landing, then the tower fades from `0.94` to `0.985`. The exact DA logo starts only at `0.985`. The old 40 ms CSS opacity lag was removed so the Canvas and content follow that non-overlapping clock exactly.
2. The R3F Canvas uses `frameloop="demand"`; imperative camera changes call `invalidate()`, and `ContactShadows` remains capped to exactly one rendered frame.
3. `MathsTowerScene` is loaded through `React.lazy` inside the eligible branch with a poster `Suspense` fallback. The synchronously imported scene-data module no longer imports Three or constructs a `CatmullRomCurve3`.
4. Low-performance devices use the existing poster/cards fallback when Data Saver is enabled, device memory is at most 4 GB, or hardware concurrency is at most 4. All hints are optional and safely type-checked before use.

## Regression Coverage

The new tests were observed failing before implementation for:

- missing ball landing/dwell timing;
- synchronous Three imports in shared scene data;
- missing demand-loop/invalidation configuration;
- missing lazy/Suspense boundary;
- missing CPU, memory and Data Saver fallback handling;
- the lingering CSS opacity transition at the tower/logo boundary.

The focused suite now covers timing boundaries, exact-logo ordering, lazy loading, Three-free shared data, demand rendering, one-frame contact shadows, malformed/absent performance hints, and all prior fallback/content contracts.

## Fresh Verification

- Focused Node suite: PASS — 27 tests, 0 failures.
- TypeScript: PASS — `npm.cmd run typecheck`.
- Touched-file ESLint: PASS — `npm.cmd exec -- eslint ...` across the seven touched TS/TSX/test files.
- Production build: PASS — `npm.cmd exec -- vite build`, 3,148 modules transformed.
- Bundle split: PASS — Three/R3F is isolated in `MathsTowerScene-9ay5SsBA.js` (1,081.20 kB raw, 327.64 kB gzip) instead of the main bundle.
- Diff hygiene: PASS — `git diff --check` returned no errors.

## Rendered Browser QA

Flow: `/subjects/mathematics` → skip intro when present → scroll through the tower → verify completed logo state; repeat at the mobile fallback breakpoint.

- Browser: Codex in-app browser.
- Desktop: 1440 × 900. Eligible story rendered one Canvas; the tower advanced through chapter copy; completed state reported tower/scene opacity `0`, exact-logo progress/opacity `1`, exact asset `/images/maths-tower-story/da-logo-full-exact.png`, and transition duration `0s`.
- Mobile: 390 × 844. Story reported `data-fallback="true"`, zero Canvas elements, one visible poster, six visible semantic articles, and no horizontal overflow.
- Console: no relevant warnings or errors in either desktop or mobile checks.

## Scope and Remaining Concerns

- Vite still emits the repository's chunk-size warning. The heavy 3D chunk is now isolated and conditional, but its own gzip size is 327.64 kB.
- Worktree-local Vite development logs report pre-existing KaTeX font allow-list messages because dependencies resolve from the parent checkout; production build includes the fonts successfully, and browser console QA remained clean.
- The pre-existing untracked implementation plan at `docs/superpowers/plans/2026-08-21-maths-3d-tower-scroll.md` was not modified or included.
- `npm.cmd run build` regenerated sitemap dates during an earlier verification pass; `public/sitemap.xml` was restored to its exact original blob and is excluded from this fix.
