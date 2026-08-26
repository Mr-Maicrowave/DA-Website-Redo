# High School Professional Journey — Design Specification

## Scope

Redesign and build the remainder of the High School page immediately after the existing interactive student / Years 7–10 experience. Preserve the navbar, hero, cinematic journey, student artwork, year bubbles, content, and interactions above the insertion point.

The new half moves visually from exploration to structure, support, progress, and HSC readiness. It should feel like a premium Australian education prospectus: warm cream, DA navy, restrained antique gold, editorial serif headings, clean sans-serif body copy, thin rules, generous whitespace, real photography, and subtle watercolor accents.

## Asset-First Workflow

Generate and approve all new raster artwork before implementing the sections. Use the supplied reference image only as composition, mood, and finish guidance—not as an edit target.

Create seven project-bound transparent PNG assets with no text, logos, people, icons, watermarks, or opaque backgrounds:

1. English watercolor accent — restrained blue pigment.
2. Mathematics watercolor accent — restrained green pigment.
3. Science watercolor accent — restrained purple pigment.
4. Humanities watercolor accent — restrained orange pigment.
5. Study Skills watercolor accent — restrained warm-gold pigment.
6. Transition bridge texture — expressive orange watercolor narrowing into a refined antique-gold ink trail.
7. HSC bridge texture — desaturated pale-navy watercolor deepening into DA navy, with quiet cream negative space and restrained gold flecks.

All seven assets must share one material language: delicate watercolor blooms, soft paper grain, irregular pigment edges, low-to-moderate saturation, broad negative space, and sufficient transparency for text overlays. Store final selections under `public/images/programs/high-school-professional/` with descriptive filenames.

Use existing Lucide icons or small code-native SVG line icons for subjects, teaching stages, progress milestones, arrows, and stars. Use CSS/SVG for animated gold rules and paths. Reuse an existing real DA tutor/student photograph for the teacher-support section rather than generating fictional staff imagery.

## Page Structure

Create `HighSchoolProfessionalJourney` after `HighSchoolCinematicScene`, replacing the current lower-page section sequence without altering the cinematic component.

Suggested ownership:

- `TransitionBridge`
- `CurriculumExplorer`
- `TeachingProcess`
- `TeacherSupport`
- `ProgressJourney`
- `HighSchoolProof` when verified content is available
- `HSCBridge`

Keep curriculum, process, support, and progress copy in typed data arrays. Keep GSAP setup and cleanup close to each owning component.

## Transition Bridge

Continue the orange Year 10 language below the existing journey. Crossfade the generated orange trail with a precise SVG gold rule so expressive pigment gradually becomes a calm editorial line. Increase cream whitespace and reduce saturation and motion as the new half begins. Avoid a hard cut or generic section fade.

## 01 — What We Teach

Use the supplied heading and curriculum content. Present five subjects as one horizontal editorial index on desktop, not five cards. The active subject has a gliding gold indicator. Beneath it, one shared content stage displays curriculum focus on the left, skills developed on the right, and the matching generated watercolor accent behind or beside the content.

Use semantic tabs/buttons with keyboard support, visible focus, and selected state. Animate changes with GSAP: outgoing content fades and rises slightly; incoming content fades and settles. On mobile, make the subject index horizontally scrollable.

## 02 — How We Teach

Create one connected five-stage journey: Diagnose, Explain, Practise, Apply, Review. Use a thin gold SVG/CSS path with elegant outline icons and concise descriptions. ScrollTrigger draws the line and activates stages progressively. On mobile, convert it to a vertical process and remove desktop pinning.

## 03 — Your Teacher Beside You

Use an editorial split layout with a real existing DA tutor/student photograph and the supplied support copy. Display four principles without card containers. Reveal the photograph with a calm clip-path animation and lightly stagger the copy. Do not invent credentials, class sizes, results, hours, or guarantees.

## 04 — Progress You Can See

Create a spacious horizontal milestone sequence on desktop and a vertical sequence on mobile. A gold path accumulates across Stronger Foundations, Better Study Habits, Greater Independence, Assessment Confidence, and Senior-School Readiness. Activated milestones remain visible; progress never repeatedly disappears.

## Proof Strip

Include only if the repository contains concise, clearly attributable High School testimonials or verified results. Reuse exact factual content. If suitable content is not found, omit the strip rather than fabricate proof.

## 05 — HSC Bridge

Create a 140–180vh desktop sequence with a briefly pinned visual stage. Begin on cream with “Year 10 isn’t the finish line.” Continue the gold journey line across the section, introduce the generated navy ink texture, and settle into full DA navy. Reveal “It’s where the next journey begins.” and an `Explore HSC →` CTA linking to the existing HSC route. On tablet reduce travel; on mobile use a static stacked transition without pinning.

## Motion and Scrolling

Use the existing GSAP installation and ScrollTrigger. Use existing Lenis only if the page already has a single smooth-scroll owner; do not create a second smooth-scroll loop. Prefer transforms, opacity, and SVG stroke animation. Use `gsap.context()` cleanup and refresh after images load.

Motion timing:

- Micro interactions: 250–400ms.
- UI changes: 350–550ms.
- Major reveals: 700–1000ms.
- Easing: `power2.out`, `power3.out`, `power3.inOut`.
- Scroll smoothing: scrub approximately 0.6–1.2 only where it improves continuity.

Respect `prefers-reduced-motion`: show final readable states, disable unnecessary scrubbing and pinning, and preserve all click interactions.

## Responsive and Accessibility Requirements

Verify 1440px, 1280px, tablet, and mobile layouts. Prevent section overlap, heading collisions, pinned-release errors, awkward gaps, and horizontal overflow. Preserve readable copy during animations. Reserve image dimensions and lazy-load below-fold photography.

All interactive subjects must be keyboard accessible, expose selected state, and have visible focus. Do not hide essential information behind hover.

## Validation

Before completion:

- Confirm the existing upper page remains visually and functionally unchanged.
- Confirm the orange-to-gold transition feels continuous.
- Exercise every subject tab by pointer and keyboard.
- Verify process and progress paths activate in order.
- Verify HSC pinning releases before the following content.
- Verify reduced-motion behavior.
- Check browser console health and responsive screenshots.
- Run focused tests, type checking, and the production build when feasible.
