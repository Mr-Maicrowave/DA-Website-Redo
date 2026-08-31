# Testimonial Transformation System Design

## Objective

Replace the existing article-like testimonial detail pages with one reusable, data-driven transformation-story system for every current and future testimonial. The system must preserve every original testimonial paragraph verbatim while making the starting point, DA intervention, turning point, measurable results, personal change, and final outcome easy to scan.

## Scope

- All records in `src/data/testimonials.ts`, including principal, parent, long student, and shorter review formats.
- The `/testimonials/:slug` route, its previous/next navigation, responsive layouts, motion, and supporting generated imagery.
- A shared library of text-free transparent raster assets generated with ChatGPT Image Generator.
- Existing listing pages and the Success Stories page remain intact except for links into the redesigned detail route.

## Content Integrity

- `bodyParagraphs` remain the canonical full testimonial and render verbatim, in original order, without deletion, rewriting, shortening, or summarisation.
- Existing `pullQuotes`, `calloutBoxes`, `bottomQuote`, and authors remain canonical.
- New structured metadata may only restate facts explicitly present in those canonical fields.
- Optional information is omitted when unsupported. No result, rank, mark, subject, confidence shift, tutor, method, or outcome is inferred beyond the record.
- All meaningful words, numbers, labels, quotes, and names render as live semantic HTML. Generated images contain no text.

## Data Model

Extend `Testimonial` with an optional `storyPresentation` object:

- `accentPalette`: deterministic navy/gold-compatible accent tokens.
- `heroTags`: authentic transformation labels.
- `phases`: paragraph-index ranges with a phase label and optional impact key.
- `definingQuote`: reference to an existing quote.
- `impactMoments`: label, authentic concise statement, category, accent, and source paragraph/callout index.
- `achievements`: verified display value, context, category, and source index.
- `assetKeys`: generated asset categories relevant to this story.
- `closingQuote`: reference to an existing closing quote.

Records without presentation metadata receive a conservative adapter derived only from existing labels and callout boxes. The adapter never parses prose to invent structured claims. The renderer gracefully omits unsupported tags, achievements, and phases.

## Generated Asset Library

Use built-in ChatGPT Image Generator to create approximately twenty cohesive transparent, text-free content assets:

- trophy, medal, gold star, rising chart
- wings, heart, sunrise, guiding hands
- illuminated journey path, mountain milestone, paper plane, milestone marker
- books, lightbulb, mathematics motif, English/quill motif, science motif
- sprout, flowers, gemstone, sparkle cluster

Art direction: bright glossy editorial illustration, optimistic and premium, controlled sky blue/royal blue/pink/coral/mint/turquoise/lavender/violet/orange/gold accents, soft dimensional materials, ivory-friendly feathered edges, no logos, words, numerals, watermarks, or baked-in backgrounds. Assets are reused through deterministic data keys and lazy-loaded.

## Page Architecture

### Introduction

A compact, maximum-height introduction replaces the generated hero. It contains the testimonial type, editorial title, subtitle, author, record progress, and two or three authentic transformation tags. DA navy and gold remain constant; the record palette supplies controlled accents.

### Transformation Story

Desktop uses a 60/40 composition:

- Left: all original paragraphs grouped into open-background phases, interrupted only by existing pull quotes and verified achievement moments.
- Right: a sticky `The Impact DA Made` rail that renders only applicable impact moments.
- A thin journey line and milestone nodes connect phases without turning normal prose into cards.

If the rail exceeds the available viewport height, it becomes a contained, keyboard-scrollable region with visible focus treatment.

### Mobile

The page becomes one column. Impact moments interleave after their source phases rather than collecting below the entire story. Achievement moments and pull quotes remain prominent, while all body text stays readable and in order.

### Ending and Navigation

The strongest existing closing idea and author end the story. Previous/next controls use the current array index and `testimonials.length`, wrap at both ends, transition content and accent colours, and restore scroll to the testimonial top.

## Components

- `TestimonialStoryView`: page orchestrator and presentation adapter.
- `TestimonialIntro`: title, metadata, tags, and progress.
- `StoryPhase`: original paragraphs plus milestone linkage.
- `PullQuoteMoment`: existing quote with a restrained pastel wash and generated supporting asset.
- `AchievementMoment`: verified live result typography plus generated celebratory asset.
- `ImpactRail` and `ImpactItem`: adaptive desktop summary and mobile interleaving.
- `StoryJourneyLine`: lightweight CSS/SVG progress indicator.
- `TestimonialNavigation`: data-driven adjacent records and count.
- `TestimonialAsset`: central lazy-loaded asset registry.

## Interaction and Motion

- IntersectionObserver marks the current story phase and gently activates its corresponding impact item.
- Paragraph groups reveal with opacity and an 18px vertical offset.
- Pull quotes reveal laterally; achievement visuals settle from 0.94 scale.
- Major result cards receive one light sweep after first entry. Decorative sparkles twinkle once.
- No continuous particle systems or scroll-state React rerenders.
- `prefers-reduced-motion` disables transforms, counting, shine, line drawing, and decorative twinkles while preserving content visibility.

## Accessibility

- Semantic article, section, blockquote, aside, and navigation landmarks.
- Generated assets are decorative (`alt=""`) unless they communicate information not already present in adjacent HTML.
- WCAG AA contrast for text; no small text placed on unstable gradients.
- Sticky rail scrolling is keyboard accessible and retains visible focus.
- Heading hierarchy and source order remain meaningful without CSS.

## Performance

- Transparent assets are compressed and dimensioned; noncritical assets lazy-load.
- Motion uses transforms and opacity.
- One IntersectionObserver manages phase activation.
- Deterministic presentation data avoids rerender-time randomisation.
- No DOM-heavy particle effects.

## Verification

- Static/data tests assert every original paragraph renders once and in order.
- Tests cover optional-module omission, deterministic palettes/assets, data-driven wraparound navigation, source-count display, and mobile impact interleaving.
- TypeScript and existing focused tests must pass.
- Visual QA covers at least one long student reflection, one parent letter, one shorter student review, and the principal message at desktop, tablet, and mobile widths.

## Non-Goals

- Generated student portraits or unique hero artwork for every record.
- Editing or modernising testimonial wording.
- Fabricating structured outcomes from generic praise.
- Redesigning the testimonial listing page or unrelated Success Stories sections.
