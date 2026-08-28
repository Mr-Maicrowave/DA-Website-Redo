# High School Teacher and Progress Story

## Goal

Replace the oversized standalone tutoring photograph and the separate “Your Teacher Beside You” and “Progress You Can See” blocks with one editorial section inspired by the supplied reference. The new section must feel like a continuous cream-paper and watercolor composition, remain readable and responsive, and lead directly into the existing HSC bridge.

## Scope

- Remove the existing standalone tutoring-photo presentation at the end of the teaching-method experience if it is a separate duplicate of this story.
- Replace `TeacherSupport` and `ProgressJourney` with one `TeacherProgressStory` component.
- Preserve the preceding method-card interaction and the following `HSCBridge` section.
- Do not bake headings, body copy, icons, or milestone labels into generated images.

## Visual Composition

### Upper story

- Left: a warm editorial photograph of a DA Tuition tutor working beside a high-school student at a desk. The subjects remain naturally proportioned and the image edges dissolve into cream watercolor.
- Right: the headline “Your teacher beside you.” followed by the contrasting italic line “Not teaching at you. Working with you.”
- Beneath the headline: four compact principles—Questions encouraged, Mistakes noticed, Feedback happens here, and Weaknesses addressed—using crisp line icons and short supporting copy.
- A handwritten-style reassurance sits below the principles as a small emotional accent rather than a primary heading.

### Lower journey

- A small eyebrow introduces “03 — The progress we build together.”
- The main copy reads “Progress you can see. Independence they can feel.”
- Five circular gold medallions form a connected path: Foundations, Study habits, Independence, Confidence, and Readiness.
- Each milestone includes one short explanatory line. Fine gold connectors and a subtle glow guide the eye from left to right.
- Closing copy reads “We don’t just prepare for the next test. We prepare for what comes next.”

### Atmosphere

- Cream paper base, muted sage and forest-green watercolor, restrained antique gold, and soft warm photographic light.
- Decorative watercolor remains concentrated around outer edges so text retains strong contrast.
- Gold sparkles and contour lines are sparse and non-interactive.

## Generated Assets

Use the built-in ChatGPT image generator for two project assets:

1. `teacher-progress-tutoring-scene-v1.png`: a wide, warm tutor-and-student study scene with generous soft edge space and no text, logos, watermarks, or malformed stationery.
2. `teacher-progress-watercolor-frame-v1.png`: a transparent watercolor atmosphere layer with sage/forest edges, cream center, fine gold contour accents, and no text or icons.

The DA Tuition logo will not be generated. If the tutor’s clothing includes branding, it must use an existing approved project mark or remain unbranded.

## Component Architecture

- `TeacherProgressStory` owns the semantic section structure and maps principle and milestone data.
- Principle and milestone data remain typed, local project data with Lucide icons so visual symbols are crisp and accessible.
- Generated images are decorative or editorial assets only. Decorative imagery uses empty alternative text; the tutor photograph uses concise descriptive alternative text.
- Existing reveal behavior may be reused, but the section must remain fully visible and understandable when reduced motion is enabled.

## Responsive Behavior

- Desktop: reference-like two-column upper story and a single horizontal five-step journey below it.
- Tablet: upper story remains two-column where space permits; the principles wrap into two columns and milestones retain a compact horizontal track.
- Mobile: photograph, copy, principles, heading, and milestones stack in reading order. The milestone connector becomes vertical or is removed when it would create clutter.
- Generated imagery uses `object-fit` and controlled aspect ratios; faces, hands, and the study materials must never be cropped at common viewport sizes.
- The section must not create a full viewport of blank cream space.

## Accessibility and Performance

- Body copy meets WCAG AA contrast against the cream background.
- All meaningful text stays in the DOM and follows a logical heading hierarchy.
- Decorative SVG/icon elements are hidden from assistive technology when their adjacent labels carry the meaning.
- Images are responsive, lazy-loaded where appropriate, and supplied at practical web dimensions.

## Verification

- Update focused component tests to assert the new combined section, the four principles, and all five milestones.
- Assert the old support/progress section markup and duplicated standalone photo are absent.
- Run focused tests, scoped lint/type checks, and the production build.
- Visually test desktop and mobile layouts, including reduced-motion behavior and image cropping.

## Non-goals

- No redesign of the teaching-method card interaction.
- No changes to the HSC bridge content or destination.
- No generated typography, brand logo, or rasterized UI icons.
- No broad refactor of unrelated High School sections.
