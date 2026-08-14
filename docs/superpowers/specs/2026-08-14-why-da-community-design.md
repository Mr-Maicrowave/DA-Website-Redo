# The DA Difference: community-led redesign

## Goal

Refocus `/why-choose-da` into DA Tuition's identity-and-proof page. It should answer why a family should trust DA with their child, rather than help them choose a tuition format.

## Locked boundary

Keep the existing shared `SubjectHero` composition, image, headline, copy, proof pills, and Explore interaction unchanged. All redesign work starts beneath the hero.

## Primary message

DA is more than tutoring: it is a learning community where students are known, supported, challenged, and helped to grow beyond the syllabus. Academic progress is part of the outcome; confidence, habits, communication, responsibility, resilience, friendships, and ambition are part of it too.

## Page sequence

1. **Why families choose DA** — three concrete proof pillars: community that knows students, intentional small-group teaching, and growth beyond marks.
2. **Featured student story** — a responsive video-placeholder module, with a poster treatment, play affordance, student quote, and a source constant ready for an uploaded file. It must not use a fake video URL.
3. **Beyond the syllabus** — show the practical skills students develop through DA's learning environment.
4. **How DA teaches** — retain and tighten the teaching steps and lesson-flow evidence already on the page.
5. **Growth over time** — retain student progression, with outcomes that include both academic confidence and independence.
6. **More student voices** — retain proof/testimonials, plus one external-link destination reserved for the broader video collection.
7. **Consultation CTA** — maintain the existing low-pressure consultation action.

## Visual direction

The shared hero supplies the site-wide entry point. Below it, use editorial pacing, real classroom/community photography, dark navy proof sections, warm cream content sections, and restrained gold accents. The video is a central proof object, not a carousel or decision tool.

## Video placeholder contract

- `featuredVideoSrc` is initially empty.
- If no source is available, render a branded placeholder with accessible explanatory copy; do not render a broken media element.
- When a local uploaded video source is supplied, render a native HTML video with controls, caption area, and descriptive label.
- A separate configurable external destination is reserved for the remaining student videos.

## Non-goals

- Do not change `SubjectHero` or global navigation.
- Do not recreate Learning Formats' matching engine, tabs, comparison UI, or placement assessment.
- Do not publish or embed the complete video library on this page.

## Validation

- Typecheck and production build pass.
- The desktop and mobile hero visually match the current shared-hero version.
- No empty/broken video component is shown without an uploaded video.
- The page remains keyboard-accessible and responsive.
