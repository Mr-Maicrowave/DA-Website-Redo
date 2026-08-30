# Interview Wizard Logic Rebuild

Date: 2026-08-28

## Objective

Replace the current two-data-step `/book-interview` flow with a six-step personalised consultation journey while preserving the existing page shell and visual system. The new flow must collect structured parent, student, learning, and preference data without requiring a parent to know which DA Tuition product or class they need.

The existing page has no API, database, or email integration. Its current submission behaviour is local validation followed by the confirmation state. This rebuild will preserve that behaviour behind a typed submission adapter so a real backend can be added without changing the wizard.

## Scope

In scope:

- One typed central form model.
- Six logical steps plus the existing confirmation state.
- School-year-derived stage and stage-aware questions.
- Multiple subjects and multiple subject areas.
- Per-step validation.
- Dependent-field cleanup after school-year and conditional-answer changes.
- Versioned session persistence for answers and current step.
- Review sections with edit actions.
- Structured payload and human-readable summary generation.
- Submission status, duplicate prevention, failure preservation, and local success adapter.
- Structured consultation-process content rendered with minimal styling.
- Automated domain tests and browser coverage for Year 3, Year 8, and Year 12.

Out of scope:

- A visual redesign or new decorative assets.
- A real network endpoint, database, CRM, or email integration.
- A new analytics dependency.
- Multiple students in one submission. The new requested model describes one student; the current repeatable-student UI will be replaced by the single-student journey.

## Existing Behaviour and Compatibility

The route remains `/book-interview`. `NavigationNew`, `FooterNew`, SEO metadata, the existing hero, and the current confirmation component remain the page shell.

The current required contact concepts are preserved: parent title, first name, last name, email, mobile, preferred contact method, relationship, suburb, student name, school year, school name, subjects, and learning-format preference. The richer payload will also expose legacy-compatible flat keys derived from the central model:

- `title`
- `firstName`
- `lastName`
- `email`
- `mobile`
- `preferredContact`
- `relationship`
- `suburb`
- `studentFirstName`
- `yearLevel`
- `school`
- `subject`
- `tutoringFormat`

Where the new model supports multiple values, legacy singular keys will contain a readable joined value rather than silently dropping selections. No external consumer currently exists, but preserving these keys reduces future migration risk.

## Module Structure

Create `src/features/interview-wizard/` with these responsibilities:

- `types.ts`: canonical form, stage, submission, persistence, and option types.
- `config.ts`: all option sets, stage-specific subjects and areas, step metadata, and consultation content.
- `model.ts`: initial state, `getSchoolStage`, toggle helpers, exclusivity rules, and `sanitiseDataForYear`.
- `validation.ts`: email/mobile helpers and per-step validation.
- `labels.ts`: canonical-value-to-display-label lookup.
- `summary.ts`: human-readable consultation summary.
- `payload.ts`: structured payload plus legacy-compatible flat fields.
- `persistence.ts`: versioned serialisation, restoration, sanitisation, and clearing.
- `submission.ts`: typed adapter interface and local adapter.
- `InterviewWizard.tsx`: wizard orchestration and shared navigation.
- `steps/`: six step components and reusable field groups.
- `content/`: minimally styled consultation-process sections.

`BookInterview.tsx` remains the route-level shell and mounts `InterviewWizard` inside the existing form card.

## Central Model

`InterviewFormData` follows the requested model, with canonical slug arrays and optional narrative fields. `schoolYear` is `number | null`; `schoolStage` is always derived and is not independently editable.

The model contains `startedAt` at initialisation and `completedAt` only when building a successful submission. Restored data retains its original `startedAt`.

## Step Flow

### Step 1: Parent + Student Basics

Required: parent first name, parent last name, valid email, valid Australian mobile, student first name, and school year 1–12.

Optional: title, preferred contact method, relationship, school name, and suburb.

Changing school year calls `sanitiseDataForYear` before storing the new state.

### Step 2: Subjects

Subjects come from stage configuration. At least one is required. Each selected subject may expose optional stage-aware areas. Deselecting a subject removes its `subjectAreas` entry.

All subject lists include a clear recommendation path where relevant. Parents can select multiple subjects without restarting.

### Step 3: Current Situation

At least one current-situation option is required. Years 1–6 receive the schoolwork-difficulty question; Years 7–12 receive current-results and optional result notes. All stages receive recent-change, confidence, and observed-behaviour questions.

`none` is exclusive within observed behaviours. Selecting it clears other values; selecting another value removes `none`.

### Step 4: Concerns + Goals

Concerns are valid when at least one option or concern note is present. Goals are valid when at least one option or goal note is present.

Goals are configured by school stage. Primary excludes HSC and Band 6 goals; Years 7–10 exclude Band 6; Years 11–12 include HSC, Band 6, and advanced/high-achievement goals.

### Step 5: Learning + Tutor Preferences

Collect learning challenges, optional “other” detail, tutoring history and conditional follow-ups, preferred formats, tutor preferences, matching notes, and additional notes.

`nothing-specific`, `not-sure`, and `no-preference` values use configuration-defined exclusivity. `preferredFormats: ["not-sure"]` excludes other formats. Changing tutoring history to false clears previous-tutoring follow-ups.

This step is intentionally optional.

### Step 6: Review + Submit

Show parent, student, subjects, current situation, confidence, concerns, goals, learning considerations, previous tutoring, formats, tutor preferences, and additional notes using display labels.

Each review section maps to an edit step. Returning to an earlier step preserves all state. Submit revalidates steps 1–4 to protect against stale restored data.

## Navigation and Progress

`TOTAL_STEPS` is 6. `currentStep` is constrained to 1–6.

- `goNext` validates only the current step and advances on success.
- `goBack` never mutates answers.
- `goToStep` supports review edit actions.
- Step completion may emit an optional internal analytics callback, but no analytics dependency or global event is introduced.

The progress UI uses `STEP_META` and remains intentionally simple.

## Sanitisation Rules

`sanitiseDataForYear(data, year)` will:

- Remove subjects unavailable to the new stage.
- Remove areas for removed subjects.
- Remove areas unavailable for retained subjects in the new stage.
- Remove goals unavailable to the new stage.
- Clear `currentResults` and `currentResultsNotes` when switching to primary.
- Clear `schoolworkDifficulty` when switching to Years 7–12.

Other dependent cleanup:

- Deselecting a subject deletes its areas.
- Setting previous tutoring to false clears worked-well text and issue selections.
- Removing `other` clears the corresponding other-details field.
- Exclusive options clear incompatible selections.

Sanitisation runs during user updates, storage restoration, and payload construction so invisible stale values cannot be submitted.

## Persistence

Use `sessionStorage` key `da-interview-form` with shape:

```ts
{
  version: 1,
  currentStep: number,
  data: InterviewFormData
}
```

Restoration validates the version and minimum object shape, merges safe values onto fresh defaults, clamps the step, and sanitises by school year. Invalid JSON or incompatible versions are ignored without breaking the page.

Writes are debounced. Storage is retained on validation or submission failure and removed only after confirmed success.

## Submission

The adapter contract is:

```ts
type SubmitInterview = (
  payload: InterviewSubmissionPayload
) => Promise<{ ok: true; submissionId?: string }>;
```

The local adapter resolves asynchronously and performs no network request. The wizard still follows the full `idle → submitting → success|error` lifecycle. While submitting, the button is disabled and repeated calls are ignored.

The payload contains:

- Structured `parent`, `student`, `learningProfile`, `parentPerspective`, `previousTutoring`, `preferences`, `additionalNotes`, and `metadata` objects.
- Derived `schoolStage`.
- Human-readable `summary` using configured labels.
- Legacy-compatible flat fields.

Successful resolution sets `completedAt`, clears session storage, and renders the existing confirmation behaviour. Rejection shows a clear error and keeps all answers.

## Consultation Content

Render the requested `CONSULTATION_STEPS`, `DURING_CONSULTATION`, and `AFTER_CONSULTATION` arrays below or adjacent to the wizard using semantic headings and basic existing styles.

Before submission, show:

> You don’t need to know which class to choose. That’s what the conversation is for.

Also show the “You don’t need to arrive with the answer” reassurance and its three supporting statements.

## Accessibility

- Every input has a programmatic label.
- Multi-select controls expose pressed/checked state.
- Errors are associated with fields and announced through an error summary or live region.
- Focus moves to the step heading or error summary after navigation.
- Submit status and failures use an appropriate live region.
- Buttons remain keyboard operable and disabled states are semantic.

## Testing

Domain tests cover:

- School-stage derivation boundaries.
- Stage-specific subject and goal configuration.
- Multi-subject and area toggling.
- Subject-area deletion on deselection.
- Year-change sanitisation in both directions.
- Exclusive-option behaviour.
- Conditional tutoring cleanup.
- Per-step validation.
- Persistence versioning, restoration, and sanitisation.
- Display-label lookup.
- Human-readable summaries.
- Structured and legacy-compatible payloads.
- Submission state and duplicate prevention where practical.

Browser tests cover Year 3, Year 8, and Year 12. Each path selects multiple subjects and areas, moves forward and backward, changes year, verifies cleanup, refreshes and verifies restoration, reaches review, edits a section, submits, and confirms the payload passed to the local adapter.

## Backend Follow-up

The later backend task must replace the local adapter with a real implementation and define authentication, endpoint URL, request limits, privacy/retention policy, email/CRM routing, server-side validation, spam protection, and operational error handling. The adapter boundary and payload tests will make that replacement isolated.
