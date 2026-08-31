# HSC Excellence Vision Prototype — Design Specification

## Purpose

Create a standalone, reviewable vision for DA Tuition's HSC Excellence page. The prototype must persuade parents that DA has the expertise, systems, resources, and people to guide an individual student through Years 11 and 12.

The prototype will use the current HSC content and project assets as its factual source of truth. It must not replace or alter the production HSC page until the prototype has been reviewed and separately approved.

## Route and Scope

- Add a standalone route at `/hsc-excellence-vision`.
- Keep `/hsc-excellence` and `/programs/hsc` unchanged.
- Reuse the existing global navigation and footer where they do not disrupt the cinematic narrative.
- Build the prototype from focused HSC vision components rather than expanding the current `HSCExcellence.tsx` page.
- Reuse existing HSC components only when their visual and interaction structure serves this specification. Reuse their verified data and assets even when their presentation is rebuilt.

## Audience and Core Promise

The primary audience is a parent evaluating support for a Year 11 or Year 12 student. They should finish the page believing:

1. The right tutor makes all the difference.
2. Tuition must stay closely aligned with what is happening at school.
3. Different students need different forms and intensities of support.

The emotional progression is concern, recognition, understanding, evidence, reassurance, and action.

## Visual Direction

The page should feel like carefully reviewed schoolwork set within a calm landscape: warm ivory paper, deep DA navy, antique gold, muted sage, dusty blue, and restrained peach or lavender accents. The existing moving watercolor meadow establishes atmosphere at the opening and closing; the middle of the page earns trust through photography, papers, annotations, timelines, and visibly connected systems.

The design language is mature, calm, premium, credible, aspirational, and reassuring. It uses DA's established editorial serif and clean sans-serif system. Large statements, generous negative space, and decisive imagery replace generic card grids.

The page must avoid childish motifs, SaaS styling, decorative glass effects, excessive rounding, repeated feature-card grids, gradient text, repeated eyebrow labels, and animation without narrative meaning.

## Narrative and Section Design

### 1. Hero

Use the existing `living-landscape.mp4` and poster fallback. Preserve the approved copy:

- WHY THESE YEARS MATTER
- The final two years can feel big.
- But they don't have to navigate it alone.

Reveal the label, main statement, and italic reassurance in sequence. Keep movement restrained. A subtle scroll cue leads into the next statement: “Every HSC student starts somewhere different.”

### 2. Different Starting Points

Use a pinned desktop scene with four successive student states: Struggling, Maintaining, Improving, and Aiming Higher. Only one state is dominant at a time. Each state combines the student's short first-person concern with a concise set of needs.

The scene resolves into: “Wherever they're starting, the support shouldn't be the same.” On smaller screens and in reduced-motion mode, render the same states as a readable vertical sequence with no scroll-jacking.

### 3. The Right Tutor

Make this a principal visual statement. Use one large existing DA tutor/student photograph. Place six short concepts around or alongside it without turning them into cards: subject knowledge, student understanding, goals, what is next, teaching style, and personality.

The composition ends with: “We don't just match subjects. We match students.” Any claim about qualifications or achievement must be included only when directly verified by current project data.

### 4. School Alignment

Present two parallel tracks:

- School: Topic → Assessment → New topic → Assignment → Trials → HSC
- DA: Understand → Practise → Test → Correct → Feedback → Prepare

The tracks begin separated and converge during the scroll sequence to demonstrate responsiveness to the student's actual school program. Supporting content may reference the syllabus, current topics, upcoming assessments, recent results, weak areas, Trials, and HSC exams.

The interaction must communicate alignment even when animation is disabled.

### 5. The DA Method in Action

Demonstrate a learning loop with an existing HSC paper or project examination asset. Use the sequence Understand, Plan, Apply, Mark, Find the Lost Marks, Correct, and Retest.

Annotations can identify weak structure, missing evidence, unclear terminology, incorrect working, poor reasoning, or time-management issues. The example must not imply that a decorative mock paper is an official NESA question unless its provenance is verified.

Finish with the visible cycle: Learn → Apply → Test → Mark → Correct → Retest → Next.

### 6. What We Prepare For

Use a cinematic horizontal sequence on wide screens and a snap-assisted vertical or horizontal sequence on touch devices. Show one preparation focus at a time:

1. Syllabus mastery
2. Assessment preparation
3. Exam technique
4. Time management
5. Past-paper practice
6. Marking criteria
7. Testing
8. Corrections
9. Feedback
10. Trial preparation
11. Subject-specific resources

Use the existing strategy and editorial assets. Avoid eleven identical cards.

### 7. Learning Formats Explorer

Use the four verified formats already encoded in `hscLearningFormatsData.ts`: Private Tuition, Small Group Classes, HSC Preparation, and Trial Preparation. Do not add a separate advanced service unless current project content verifies it as a distinct offering.

The left-side format navigation, previous/next controls, and image are interactive. The active view includes a real image, description, suitability, key attributes, and process. Clicking the image reveals supplementary parent reassurance while leaving essential information visible on the front.

The explorer supports keyboard operation, accessible state labels, touch targets, and a non-flip fallback when reduced motion is preferred.

### 8. Tutor Matching

Visually connect student inputs—subject, level, confidence, learning style, goals, school situation, and upcoming assessment—with tutor characteristics—subject expertise, HSC knowledge, teaching style, personality, strengths, and verified experience.

The two fields converge into “The right match.” Use existing tutor imagery where appropriate. Do not invent qualifications or biographies.

### 9. Progress Monitoring

Show an evidence trail:

Lesson → Work Completed → Test → Mistakes Identified → Corrections → Tutor Feedback → Parent Visibility → Next Lesson Adjusted

Use existing marked-paper, feedback-sheet, weekly-plan, progress-chart, report, and booklet assets. The section should make the tracking process tangible without presenting decorative documents as actual student records.

### 10. Results

Use only outcomes documented in the current review dataset or another verifiable project source. The current dataset includes examples such as 99.85 ATAR and 2nd in NSW English, 4th in NSW Mathematics, 40% to 91%, 5/20 to 18/20, 70s to 90s, Raw 96, C to A, +10 ranks, 97%, and full marks.

Each result must remain attached to its supporting named story and explanatory context. Any unverified aggregate result requested for the eventual production page must appear only in a clearly labelled internal placeholder state and must not read as a public claim.

### 11. Case Studies

Feature two to four deeper stories selected from records that contain enough verified journey information. Use the sequence Starting Point → What DA Did → What Changed → Outcome.

Ruby Nguyen and Selene Dixon currently contain the most complete structured journeys. Other stories may be included only when their existing records support all displayed details. Missing facts will not be inferred.

### 12. Testimonial Library

Use the existing 30+ named HSC stories. The main story is centred, adjacent stories are partially visible, and a thumbnail rail supports direct navigation. Include previous/next buttons, swipe, keyboard navigation, and filtering based on actual `year` and `subject` fields.

Filters must not imply categories the data cannot support. Quotations, marks, names, ATARs, and outcomes must be drawn from the existing verified dataset without embellishment.

### 13. Final CTA

Return to the moving watercolor landscape and remove most interface detail. Use:

- THEIR HSC WILL BE THEIR OWN JOURNEY.
- LET'S MAKE SURE THE SUPPORT IS RIGHT.

Use the approved supporting text and existing consultation action from the supplied brief/current project. A secondary phone action may be included only if the existing project contains a verified number.

## Motion and Interaction Principles

- Use pinning only where it communicates progression: student states, school alignment, the method demonstration, and selected cinematic sequences.
- Do not pin every section. Alternate immersive sequences with ordinary document flow to reduce fatigue.
- Use one coordinated entrance sequence in the hero and purposeful transitions elsewhere.
- Respect `prefers-reduced-motion`; remove scroll scrubbing, flips, and large transforms while preserving all content and hierarchy.
- Never trap the user's scroll, and do not require pixel-perfect scrolling to reveal essential information.
- All click targets must be keyboard accessible and at least 44 by 44 CSS pixels on touch layouts.
- Videos need pause/play controls and poster fallbacks.

## Responsive Strategy

Desktop uses the full cinematic composition with pinned scenes and large photographic layouts. Tablet preserves the narrative but reduces overlapping copy and turns some side-by-side scenes into staged vertical transitions. Mobile presents one clear idea at a time in normal document flow, retaining snap behavior only where it improves navigation.

Headlines must be tested for overflow at narrow mobile widths and intermediate tablet widths. Interactive content must remain usable with touch, keyboard, zoom, and increased text size.

## Data and Content Rules

- Current project content and assets are the source of truth.
- Do not invent DA statistics, tutor qualifications, service details, names, quotes, marks, outcomes, university destinations, or state ranks.
- Preserve the original meaning of quotations. Existing cleaned excerpts can be used when their verified source text remains in the project.
- Clearly distinguish internal placeholders from public content.
- No placeholder image or dead control may remain when the prototype is presented for review.

## Component Boundaries

The prototype page should compose focused components for the major narrative scenes. Static content and verified data should live in dedicated data modules so claims can be audited without reading animation code. Shared motion helpers may coordinate reduced-motion behavior and scroll progress, but each section should remain understandable and testable in isolation.

The production page and its components remain untouched during the prototype phase. Any later migration from prototype to production requires separate approval.

## Verification

Before presenting the prototype:

- Run focused component and route tests.
- Run the project test suite and production build.
- Check the standalone route in a real browser at desktop, tablet, and mobile viewport sizes.
- Verify keyboard navigation, focus visibility, video controls, swipe behavior, and reduced-motion presentation.
- Check for console errors, content overflow, clipped focus rings, broken images, and accidental horizontal page scrolling.
- Audit every displayed factual claim against its source file.
- Confirm the two production HSC routes still render their pre-existing page.

## Acceptance Criteria

- `/hsc-excellence-vision` presents all thirteen requested narrative sections as one coherent story.
- The three core messages are unmistakable without requiring interaction.
- Existing useful HSC copy, imagery, video, reviews, results, learning-format content, and paper resources are preserved and reorganised.
- No unverified fact is presented as a DA claim.
- The experience is cinematic on capable desktop devices and complete, readable, and accessible on mobile and reduced-motion configurations.
- The production HSC page remains unchanged.
- The page contains no generic repeated-card treatment, excessive rounded boxes, heavy glassmorphism, decorative gradient text, or gratuitous animation.
