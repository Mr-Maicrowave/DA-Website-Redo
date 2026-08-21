# Mathematics tower scroll story

## Purpose

Replace the disconnected maths plates and unreliable AI-video ball sequence with one premium, readable Year 7-12 journey. The central visual should belong to Mathematics without competing with the syllabus and teaching copy beside it.

## Visual system

The story is a single bright cream gallery containing a vertically oriented frosted-glass and ivory apparatus. A small polished gold ball is the recurring mathematical point. It travels down one carefully defined navy-inlaid rail while the physical apparatus develops from simple to richer spatial structure.

The composition preserves generous quiet space to either side for live HTML copy. The visual contains no labels, equations, numbers, UI or generated branding.

### Four visual chapters

1. **Point and simple geometry (Years 7-8).** A clear point starts on a simple rail with circular and linear cues.
2. **Curve and relationship (Years 9-10).** The point follows a continuous curve; the apparatus develops a smooth functional path.
3. **Planes and modelling (senior years).** Transparent planes and refined parallel structures surround the shared rail. The copy, rather than the ball, distinguishes Standard and Advanced, so the visual never implies Standard is a prerequisite for Advanced.
4. **Space and extension.** The same apparatus gains restrained depth, nested paths and intersecting directions, suggesting Extension-level vectors and spatial reasoning without literal diagrams.

## Motion and compositing

Do not use a generative video model to animate the ball. It cannot guarantee a single object, reliable rail contact, occlusion, or an unbroken take.

Instead, use a generated raster tower master as the visual background, with authored browser motion:

- A real gold ball follows a precise invisible motion path at scroll-driven progress.
- The rendered scene is layered as rear tower, moving ball, then front glass/pillar masks. This permits intentional occlusion while preserving ball identity.
- The background crop moves gently downward through the continuous tall tower. It does not crossfade between independently generated stills.
- Copy stays readable for each content group, then changes only when the ball reaches the next visual chapter.

On the final rail, the ball rolls to the open edge, leaves the apparatus, and falls to the centre of a clear cream field. At the impact point, the supplied DA Tuition logo is revealed from the same point using the original logo asset, a radial mask, scale and restrained gold ripple. It is a branded formation, not a generated logo or a simple opacity fade.

## Content and accessibility

- All Year 7-12, Standard, Advanced and Extension explanations remain live semantic HTML.
- Equations, where used, are live text/math and support an actual teaching point; they are not baked into visual media.
- Mobile and reduced-motion show a completed static tower frame plus the complete content in normal document flow. They do not request the animation assets.

## Assets

Existing concept frames are retained as design references only under `public/images/veo-frames/tower-v2/`. The future implementation must generate or select a clean, ball-free master (and any required front mask assets) from the final approved tower design. The authoritative logo asset is `da-logo-full-exact.png`; it must never be recreated by an image or video model.

## Acceptance criteria

- The ball remains one visible physical object, following its rail exactly with no duplicates, clipping or generated artefacts.
- During intended occlusions, the ball disappears only behind the front tower layer and re-emerges at the correct matching position.
- There are no fades, cross-dissolves or visual jumps between tower stages.
- The apparatus visibly develops from point to curve to plane to space while remaining spare enough for the accompanying teaching content.
- The senior visual treatment does not imply a false Standard-to-Advanced-to-Extension pathway.
- The final logo resolves from the ball's landing point and uses the exact supplied DA Tuition asset.
- Desktop, mobile and reduced-motion rendered QA, automated feature tests, TypeScript and production build all pass.
