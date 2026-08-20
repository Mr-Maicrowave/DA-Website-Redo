# Graph Lab Guided Learning and Fourier Coexistence Design

## Product role

DA Graph Lab has two modes. **Guided Learning** is the primary differentiator: it teaches students to predict, test and explain function transformations. **Free Graph** remains a quick, unrestricted graphing workspace. A first-time visitor chooses a mode; returning visitors resume their last mode. Switching modes never destroys the student's free-graph equations or viewport.

The primary audience is Years 11–12 Mathematics Advanced, with language accessible to a strong Year 10 student. Progress is stored locally and can later move behind an account without changing the journey model.

## First guided journey

The first 12–15 minute journey is **Function transformations**:

1. Recognise the quadratic parent function.
2. Investigate vertical translation.
3. Investigate vertical dilation and reflection.
4. Investigate horizontal translation.
5. Combine quadratic transformations.
6. Transfer the same rules to an absolute-value graph.
7. Complete a sine capstone connecting transformation language to amplitude, period, phase shift and midline.

Each challenge follows `predict -> manipulate -> explain -> feedback`. Controls unlock progressively. An incorrect prediction receives a targeted hint, one retry, and then a worked explanation. Selected checkpoints use a structured explanation builder with syllabus-aligned terms rather than free-text or AI marking. The journey ends with a mastery summary using `secure`, `developing` and `revisit`, not a percentage.

## Fourier coexistence

Fourier remains the visual spectacle on `/subjects/mathematics`. It defaults to the DA shield and is explicitly labelled **Optional enrichment — beyond the NSW syllabus**. It does not affect required Graph Lab progress. The sine capstone links to the Fourier section as an optional next step, explaining that assessable sine-wave ideas lead into a non-assessable Fourier construction.

The shield trace should use a curated continuous shield outline rather than extracting the full transparent logo silhouette. This produces a stable, recognisable target at small sizes and avoids the current laurel/text boundary overwhelming the Fourier coefficients.

## Persistence and accessibility

- Store a versioned JSON record in `localStorage` containing last mode, step, results and completion state.
- Fail safely when storage is unavailable or malformed.
- Preserve free expressions and viewport in memory while visiting Guided Learning.
- All answers and controls remain keyboard accessible and feedback uses live regions.
- Reduced motion keeps a static Fourier target and removes tracing animation.

## Out of scope for this slice

- Accounts, cross-device progress or tutor dashboards.
- AI-assessed written answers.
- A full activity-authoring system.
- Additional guided courses beyond the sine preview.
- Replacing Desmos feature breadth.

