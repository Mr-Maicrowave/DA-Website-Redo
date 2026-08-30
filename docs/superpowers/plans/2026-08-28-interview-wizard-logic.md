# Personalised Interview Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/book-interview`’s local two-step form with a persistent, stage-aware six-step consultation wizard that produces a typed structured payload and preserves the existing confirmation behaviour.

**Architecture:** Keep `BookInterview.tsx` as the existing visual shell and move the wizard domain into `src/features/interview-wizard/`. Pure TypeScript modules own configuration, model transitions, sanitisation, validation, labels, summaries, payloads, persistence, and submission; React components consume those interfaces without duplicating business rules.

**Tech Stack:** React 18, TypeScript, node:test, React Router, existing Tailwind/CSS, browser `sessionStorage`, existing Framer Motion only where already present.

**Spec:** `docs/superpowers/specs/2026-08-28-interview-wizard-logic-design.md`

## Global Constraints

- Keep the existing hero, navigation, footer, imagery, typography, colours, and page-level visual system.
- Do not add GSAP, Three.js, WebGL, analytics, form, state-machine, or backend dependencies.
- Preserve `/book-interview`, SEO, required parent contact concepts, and the existing confirmation component.
- The current repository has no API, database, email integration, or network submission to preserve; use the approved typed local submission adapter.
- Store canonical machine values internally and display configured human labels.
- Clear `sessionStorage` only after confirmed adapter success.
- Do not modify unrelated pages.

## File Map

- `src/features/interview-wizard/types.ts`: shared canonical types and adapter contracts.
- `src/features/interview-wizard/config.ts`: all option lists, stage-aware subject/goal configuration, progress, and consultation content.
- `src/features/interview-wizard/model.ts`: defaults, stage derivation, toggles, exclusivity, and downstream cleanup.
- `src/features/interview-wizard/validation.ts`: per-step validation and contact validators.
- `src/features/interview-wizard/labels.ts`: canonical label resolution.
- `src/features/interview-wizard/summary.ts`: human-readable summary.
- `src/features/interview-wizard/payload.ts`: structured and legacy-compatible submission payload.
- `src/features/interview-wizard/persistence.ts`: versioned session serialisation/restoration.
- `src/features/interview-wizard/submission.ts`: local submission adapter.
- `src/features/interview-wizard/InterviewWizard.tsx`: state, persistence, navigation, submit lifecycle, and step orchestration.
- `src/features/interview-wizard/fields.tsx`: reusable choice, text, select, and error primitives.
- `src/features/interview-wizard/steps/*.tsx`: six logical step components.
- `src/features/interview-wizard/ConsultationContent.tsx`: simple requested explanatory sections.
- `src/features/interview-wizard/interview-wizard.css`: minimal additions needed for new controls using the existing visual language.
- `src/pages/BookInterview.tsx`: remove old form domain/components and mount the wizard inside the existing shell.

---

### Task 1: Canonical Types and Configuration

**Files:**
- Create: `src/features/interview-wizard/types.ts`
- Create: `src/features/interview-wizard/config.ts`
- Create: `src/features/interview-wizard/config.test.ts`

**Interfaces:**
- Produces: `InterviewFormData`, `SchoolStage`, `ContactMethod`, `LearningFormat`, `ConfidenceLevel`, `InterviewSubmissionPayload`, `SubmissionStatus`, `Option`, `StageConfig`, `STEP_META`, `SUBJECTS_BY_STAGE`, `SUBJECT_AREAS_BY_STAGE`, `GOALS_BY_STAGE`, and the requested consultation-content arrays.

- [ ] **Step 1: Write failing configuration tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS_BY_STAGE, GOALS_BY_STAGE, STEP_META } from './config.ts';

test('defines exactly six wizard steps', () => {
  assert.deepEqual(STEP_META.map(item => item.step), [1, 2, 3, 4, 5, 6]);
});

test('limits primary subjects and excludes HSC-only goals', () => {
  assert.deepEqual(SUBJECTS_BY_STAGE.primary.map(item => item.value), ['english', 'mathematics', 'creative-writing']);
  assert.ok(!GOALS_BY_STAGE.primary.some(item => ['strong-hsc-preparation', 'band-6-goal'].includes(item.value)));
});

test('provides the required HSC subjects and goals', () => {
  for (const value of ['mathematics', 'english', 'biology', 'chemistry', 'physics', 'business-studies', 'legal-studies']) {
    assert.ok(SUBJECTS_BY_STAGE.hsc.some(item => item.value === value));
  }
  assert.ok(GOALS_BY_STAGE.hsc.some(item => item.value === 'band-6-goal'));
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/config.test.ts`

Expected: FAIL because `config.ts` does not exist.

- [ ] **Step 3: Implement exact canonical types**

Define the complete `InterviewFormData` from the approved spec, including all arrays initialised as arrays, `schoolYear: number | null`, optional narratives, tutoring state, and metadata timestamps. Define `Option<T extends string = string> = { value: T; label: string }` and the adapter/payload contracts used by later tasks.

- [ ] **Step 4: Implement configuration arrays**

Add every subject, subject area, current situation, result, difficulty, confidence, behaviour, concern, goal, challenge, tutoring issue, format, tutor preference, `STEP_META`, `CONSULTATION_STEPS`, `DURING_CONSULTATION`, and `AFTER_CONSULTATION` option from the specification. Export configuration by stage instead of embedding stage checks in JSX.

- [ ] **Step 5: Run configuration tests and typecheck**

Run: `node --test --experimental-strip-types src/features/interview-wizard/config.test.ts && npm run typecheck`

Expected: all tests PASS and TypeScript exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/features/interview-wizard/types.ts src/features/interview-wizard/config.ts src/features/interview-wizard/config.test.ts
git commit -m "feat: define interview wizard model and configuration"
```

### Task 2: Model Transitions and Dependent Cleanup

**Files:**
- Create: `src/features/interview-wizard/model.ts`
- Create: `src/features/interview-wizard/model.test.ts`

**Interfaces:**
- Consumes: `InterviewFormData`, `SchoolStage`, `SUBJECTS_BY_STAGE`, `SUBJECT_AREAS_BY_STAGE`, `GOALS_BY_STAGE`.
- Produces: `createInitialInterviewData(now?: string): InterviewFormData`, `getSchoolStage(year: number | null): SchoolStage | null`, `toggleArrayValue<T>(values: T[], value: T): T[]`, `toggleExclusiveValue(values: string[], value: string, exclusiveValues: string[]): string[]`, `toggleSubject(data, subject)`, `toggleSubjectArea(data, subject, area)`, `sanitiseDataForYear(data, year)`.

- [ ] **Step 1: Write failing stage and sanitisation tests**

```ts
test('derives stage at every boundary', () => {
  assert.equal(getSchoolStage(null), null);
  assert.equal(getSchoolStage(1), 'primary');
  assert.equal(getSchoolStage(6), 'primary');
  assert.equal(getSchoolStage(7), 'high-school');
  assert.equal(getSchoolStage(10), 'high-school');
  assert.equal(getSchoolStage(11), 'hsc');
  assert.equal(getSchoolStage(12), 'hsc');
  assert.equal(getSchoolStage(13), null);
});

test('changing Year 12 data to Year 3 removes invalid hidden values', () => {
  const source = { ...createInitialInterviewData('start'), schoolYear: 12, subjects: ['physics', 'english'], subjectAreas: { physics: ['past-papers'], english: ['band-6-preparation'] }, goals: ['band-6-goal', 'more-confidence'], currentResults: '80-89' };
  const result = sanitiseDataForYear(source, 3);
  assert.deepEqual(result.subjects, ['english']);
  assert.deepEqual(result.subjectAreas, { english: [] });
  assert.deepEqual(result.goals, ['more-confidence']);
  assert.equal(result.currentResults, undefined);
});
```

Also test subject deselection deletes its areas, high-school switches clear `schoolworkDifficulty`, exclusive values clear conflicts, and setting tutoring history to false clears its follow-ups.

- [ ] **Step 2: Run tests and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/model.test.ts`

Expected: FAIL because model exports do not exist.

- [ ] **Step 3: Implement pure model functions**

Use `Set` membership derived from config. Never mutate input arrays, records, or form objects. When retaining a subject across stages, filter its existing areas through the new stage’s allowed areas.

- [ ] **Step 4: Run model tests**

Run: `node --test --experimental-strip-types src/features/interview-wizard/model.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/interview-wizard/model.ts src/features/interview-wizard/model.test.ts
git commit -m "feat: add interview wizard transitions and cleanup"
```

### Task 3: Per-Step Validation

**Files:**
- Create: `src/features/interview-wizard/validation.ts`
- Create: `src/features/interview-wizard/validation.test.ts`

**Interfaces:**
- Consumes: `InterviewFormData`.
- Produces: `FormErrors`, `isValidEmail(value)`, `isValidAustralianMobile(value)`, and `validateStep(step, data)`.

- [ ] **Step 1: Write failing tests for required and optional behaviour**

```ts
test('step one requires contact and student basics only', () => {
  const errors = validateStep(1, createInitialInterviewData('start'));
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'mobile', 'parentFirstName', 'parentLastName', 'schoolYear', 'studentFirstName']);
});

test('step four accepts either choices or narrative notes', () => {
  const data = { ...createInitialInterviewData('start'), parentConcernNotes: 'Marks dropped', goalNotes: 'Regain confidence' };
  assert.deepEqual(validateStep(4, data), {});
});

test('step five remains optional', () => {
  assert.deepEqual(validateStep(5, createInitialInterviewData('start')), {});
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/validation.test.ts`

- [ ] **Step 3: Implement validators and switch-based validation**

Normalise Australian mobile input by removing spaces, parentheses, and hyphens. Accept `04xxxxxxxx` and `+614xxxxxxxx`; reject other numbers. Validate only the requested current step.

- [ ] **Step 4: Run validation tests and typecheck**

Run: `node --test --experimental-strip-types src/features/interview-wizard/validation.test.ts && npm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/features/interview-wizard/validation.ts src/features/interview-wizard/validation.test.ts
git commit -m "feat: validate interview wizard by step"
```

### Task 4: Labels, Summary, and Submission Payload

**Files:**
- Create: `src/features/interview-wizard/labels.ts`
- Create: `src/features/interview-wizard/summary.ts`
- Create: `src/features/interview-wizard/payload.ts`
- Create: `src/features/interview-wizard/payload.test.ts`

**Interfaces:**
- Produces: `getOptionLabel(options, value)`, `getInterviewLabel(value)`, `buildInterviewSummary(data)`, and `buildInterviewPayload(data, completedAt)`.

- [ ] **Step 1: Write failing payload and summary tests**

Build a representative Year 8 fixture with Mathematics and English, multiple situations, mixed confidence, concerns, goals, challenges, `preferredFormats: ['not-sure']`, and two tutor preferences.

Assert that the summary contains display text such as `Student: Emma — Year 8`, `Subjects: Mathematics, English`, and `Not sure — please recommend what suits my child`, and does not contain `doing-okay-but-could-do-better`.

Assert that the payload contains:

```ts
assert.equal(payload.student.schoolStage, 'high-school');
assert.deepEqual(payload.learningProfile.subjects, ['mathematics', 'english']);
assert.equal(payload.firstName, data.parentFirstName);
assert.equal(payload.subject, 'Mathematics, English');
assert.equal(payload.metadata.completedAt, completedAt);
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/payload.test.ts`

- [ ] **Step 3: Implement central label registry and summary builder**

Construct the registry from exported configuration arrays. Unknown values fall back to the original value rather than crashing. Omit empty summary sections and use `•` bullets for selected values.

- [ ] **Step 4: Implement payload builder**

Call `sanitiseDataForYear` before payload creation. Produce the approved nested structure, `summary`, and all legacy flat keys listed in the spec. Join multiple legacy values using `, `.

- [ ] **Step 5: Run tests**

Run: `node --test --experimental-strip-types src/features/interview-wizard/payload.test.ts && npm run typecheck`

- [ ] **Step 6: Commit**

```bash
git add src/features/interview-wizard/labels.ts src/features/interview-wizard/summary.ts src/features/interview-wizard/payload.ts src/features/interview-wizard/payload.test.ts
git commit -m "feat: build readable interview submission payloads"
```

### Task 5: Versioned Session Persistence and Local Submission Adapter

**Files:**
- Create: `src/features/interview-wizard/persistence.ts`
- Create: `src/features/interview-wizard/submission.ts`
- Create: `src/features/interview-wizard/persistence.test.ts`
- Create: `src/features/interview-wizard/submission.test.ts`

**Interfaces:**
- Produces: `STORAGE_KEY`, `STORAGE_VERSION`, `serialiseInterviewSession`, `restoreInterviewSession`, `saveInterviewSession(storage, state)`, `clearInterviewSession(storage)`, `SubmitInterview`, and `submitInterviewLocally(payload)`.

- [ ] **Step 1: Write failing persistence tests**

Use an in-memory `Storage`-compatible test double. Test version 1 restoration, invalid JSON fallback, incompatible-version fallback, step clamping to 1–6, retained `startedAt`, and year sanitisation during restoration.

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/persistence.test.ts`

- [ ] **Step 3: Implement persistence functions**

Do not access `window` at module evaluation. Accept `Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>` as a parameter. Merge restored data over `createInitialInterviewData()` and explicitly validate all array/record fields before using them.

- [ ] **Step 4: Write and run a failing adapter test**

Assert that `submitInterviewLocally(payload)` resolves `{ ok: true }` and does not mutate the payload.

- [ ] **Step 5: Implement the local adapter**

Resolve on a microtask with no network call:

```ts
export const submitInterviewLocally: SubmitInterview = async () => ({ ok: true });
```

- [ ] **Step 6: Run persistence, adapter, and type tests**

Run: `node --test --experimental-strip-types src/features/interview-wizard/persistence.test.ts src/features/interview-wizard/submission.test.ts && npm run typecheck`

- [ ] **Step 7: Commit**

```bash
git add src/features/interview-wizard/persistence.ts src/features/interview-wizard/submission.ts src/features/interview-wizard/persistence.test.ts src/features/interview-wizard/submission.test.ts
git commit -m "feat: persist and submit interview wizard locally"
```

### Task 6: Reusable Controls and Six Step Components

**Files:**
- Create: `src/features/interview-wizard/fields.tsx`
- Create: `src/features/interview-wizard/steps/StepParentStudent.tsx`
- Create: `src/features/interview-wizard/steps/StepSubjects.tsx`
- Create: `src/features/interview-wizard/steps/StepCurrentSituation.tsx`
- Create: `src/features/interview-wizard/steps/StepConcernsGoals.tsx`
- Create: `src/features/interview-wizard/steps/StepLearningPreferences.tsx`
- Create: `src/features/interview-wizard/steps/StepReview.tsx`
- Create: `src/features/interview-wizard/steps/steps.test.ts`

**Interfaces:**
- Consumes: central data/config/model/validation/label types.
- Produces: six controlled components receiving `data`, `errors`, and typed update callbacks; `StepReview` also receives `onEdit(step)`.

- [ ] **Step 1: Write failing source-contract tests**

Use the repository’s node source-test pattern to assert that all six components exist, StepSubjects maps configuration rather than embedding subject labels, StepReview exposes edit actions for steps 1–5, and form labels use `htmlFor` or wrap their controls.

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/steps/steps.test.ts`

- [ ] **Step 3: Implement reusable controls**

Implement controlled `TextInput`, `TextArea`, `SelectInput`, `SingleChoice`, `MultiChoice`, and `FieldError`. Choice buttons use `type="button"` and `aria-pressed`; error IDs connect via `aria-describedby`.

- [ ] **Step 4: Implement Steps 1–3**

Step 1 calls a supplied `onYearChange(year)` callback. Step 2 reads stage-specific subject/area config and calls model transitions. Step 3 renders primary difficulty or secondary results exclusively and implements observed-behaviour exclusivity.

- [ ] **Step 5: Implement Steps 4–6**

Step 4 reads goals by stage. Step 5 hides tutoring follow-ups when false and reveals `learningChallengesOther` only when `other` is selected. Step 6 uses labels and maps every review section to its owning edit step.

- [ ] **Step 6: Run source-contract tests and typecheck**

Run: `node --test --experimental-strip-types src/features/interview-wizard/steps/steps.test.ts && npm run typecheck`

- [ ] **Step 7: Commit**

```bash
git add src/features/interview-wizard/fields.tsx src/features/interview-wizard/steps
git commit -m "feat: add six interview wizard steps"
```

### Task 7: Wizard Orchestration and Consultation Content

**Files:**
- Create: `src/features/interview-wizard/InterviewWizard.tsx`
- Create: `src/features/interview-wizard/ConsultationContent.tsx`
- Create: `src/features/interview-wizard/interview-wizard.css`
- Create: `src/features/interview-wizard/InterviewWizard.test.ts`

**Interfaces:**
- Consumes: all earlier domain modules and step components.
- Produces: `<InterviewWizard onSuccess={(data, payload) => void} submitInterview={submitInterviewLocally} />` and `<ConsultationContent />`.

- [ ] **Step 1: Write failing orchestration source tests**

Assert the source contains `TOTAL_STEPS = 6`, `submissionStatus`, storage restoration, a debounced persistence effect with cleanup, `validateStep(currentStep`, `buildInterviewPayload`, duplicate-submit guard, storage clearing only inside the success branch, and all six step mounts.

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/features/interview-wizard/InterviewWizard.test.ts`

- [ ] **Step 3: Implement wizard state and navigation**

Restore state in the `useState` initialiser when `window` exists. Debounce writes by 250 ms. `goNext` validates only the current step. `goBack` and review edits preserve data. On navigation, focus the new step heading.

- [ ] **Step 4: Implement submit lifecycle**

On submit, validate steps 1–4 in order, route to the first invalid step, build a completed payload, set `submitting`, await the injected adapter, then clear storage and call `onSuccess`. On rejection set `error`, retain data, and announce a retry message. Ignore submit clicks while already submitting.

- [ ] **Step 5: Render progress, reassurance, and consultation content**

Render simple text-first UI from `STEP_META` and the three requested consultation arrays. Include both exact reassurance headings and supporting statements from the spec. Add only minimal control layout/focus/error styles; do not alter the page hero or decorative system.

- [ ] **Step 6: Run tests and typecheck**

Run: `node --test --experimental-strip-types src/features/interview-wizard/InterviewWizard.test.ts && npm run typecheck`

- [ ] **Step 7: Commit**

```bash
git add src/features/interview-wizard/InterviewWizard.tsx src/features/interview-wizard/ConsultationContent.tsx src/features/interview-wizard/interview-wizard.css src/features/interview-wizard/InterviewWizard.test.ts
git commit -m "feat: orchestrate personalised interview wizard"
```

### Task 8: Integrate the Wizard into the Existing Page

**Files:**
- Modify: `src/pages/BookInterview.tsx`
- Modify: `src/pages/BookInterview.layout.test.ts`

**Interfaces:**
- Consumes: `InterviewWizard`, `ConsultationContent`, `InterviewFormData`, and `InterviewSubmissionPayload`.
- Produces: unchanged `/book-interview` route shell and existing confirmation component driven by adapter success.

- [ ] **Step 1: Update the existing layout test first**

Assert that `BookInterview.tsx` imports and mounts `InterviewWizard`, passes `submitInterviewLocally`, preserves `NavigationNew`, hero image paths, `FooterNew`, and `Step3` confirmation, and no longer declares `ParentForm`, `Student`, `validateStep1`, or `validateStep2`.

- [ ] **Step 2: Run and confirm RED**

Run: `node --test --experimental-strip-types src/pages/BookInterview.layout.test.ts`

- [ ] **Step 3: Replace old page-local form logic**

Remove the old field primitives, two data-step components, journey state, and validators from `BookInterview.tsx`. Keep the page shell and confirmation component. Track only the successful parent name/payload needed for confirmation and render `InterviewWizard` until success.

- [ ] **Step 4: Mount simple consultation content**

Render `ConsultationContent` without rearranging the hero, benefits, trust strip, or footer.

- [ ] **Step 5: Run page tests and typecheck**

Run: `node --test --experimental-strip-types src/pages/BookInterview.layout.test.ts && npm run typecheck`

- [ ] **Step 6: Commit**

```bash
git add src/pages/BookInterview.tsx src/pages/BookInterview.layout.test.ts
git commit -m "feat: integrate six-step interview journey"
```

### Task 9: Year 3, Year 8, and Year 12 Browser Verification

**Files:**
- Create: `src/features/interview-wizard/interview-wizard.browser.test.mjs`
- Modify only if defects are found: `src/features/interview-wizard/**`

**Interfaces:**
- Verifies the full integrated route and local submission adapter.

- [ ] **Step 1: Write the Year 3 browser scenario**

Start from cleared session storage, complete valid basics with Year 3, select English and Mathematics plus multiple areas, verify primary schoolwork difficulty and absence of percentage results, navigate backward, refresh, confirm restoration, switch to Year 8, and assert primary-only data is removed.

- [ ] **Step 2: Run Year 3 scenario and confirm any initial failure**

Run the repository-local dev server and execute the Puppeteer test against `/book-interview`. Record the exact failing assertion before fixing production code.

- [ ] **Step 3: Write the Year 8 scenario**

Select Mathematics and Science, multiple areas, a percentage result, multiple situations, confidence, concerns, goals, challenges, no prior tutoring, `not-sure` format, tutor preferences, review edits, refresh restoration, and successful submit. Capture the adapter payload through an injected test adapter or browser-visible test hook scoped to development/test mode.

- [ ] **Step 4: Write the Year 12 scenario**

Select Physics and Legal Studies, HSC areas, Band 6/HSC goals, tutoring follow-ups, multiple tutor preferences, then switch to Year 3 and assert Physics, Legal Studies, HSC areas/goals, and percentage results disappear before switching back to Year 12 and completing submission.

- [ ] **Step 5: Fix each discovered defect test-first**

For each domain defect, add or extend the corresponding pure unit test, run it to confirm RED, implement the smallest fix, then rerun both the unit and browser scenario.

- [ ] **Step 6: Run all three browser scenarios and check the console**

Expected: Year 3, Year 8, and Year 12 pass; no `pageerror`; no unexpected console errors; review edits and refresh persistence work; adapter receives sanitized payloads.

- [ ] **Step 7: Commit**

```bash
git add src/features/interview-wizard/interview-wizard.browser.test.mjs src/features/interview-wizard
git commit -m "test: verify interview wizard across school stages"
```

### Task 10: Final Verification and Handoff

**Files:**
- Modify only if verification identifies defects.

- [ ] **Step 1: Run all interview-wizard tests**

Run: `node --test --experimental-strip-types src/features/interview-wizard/*.test.ts src/features/interview-wizard/steps/*.test.ts src/pages/BookInterview.layout.test.ts`

Expected: zero failures.

- [ ] **Step 2: Run static verification**

Run: `npm run typecheck && npm run lint`

Expected: TypeScript exits 0. If lint reports only pre-existing repository backlog, record exact unrelated errors; fix every new interview-wizard error.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: encoding, sitemap, TypeScript, and Vite build complete successfully. Restore generated `public/sitemap.xml` date-only churn if it is unrelated to this task.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check` and inspect only the commits/files from this plan. Confirm no unrelated page changes, no API endpoint claims, and no visual-redesign work.

- [ ] **Step 5: Prepare handoff**

Report changed files, six-step structure, complete structured and legacy payload fields, preserved local confirmation behaviour, the missing real backend items, and explicit Year 3/8/12 results.
