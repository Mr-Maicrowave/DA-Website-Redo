import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./InterviewWizard.tsx', import.meta.url), 'utf8');

test('orchestrates six persisted steps with per-step validation', () => {
  assert.match(source, /TOTAL_STEPS = 6/);
  assert.match(source, /restoreInterviewSession/);
  assert.match(source, /saveInterviewSession/);
  assert.match(source, /setTimeout\([\s\S]*250/);
  assert.match(source, /validateStep\(currentStep, data\)/);
  for (const name of ['StepParentStudent', 'StepSubjects', 'StepCurrentSituation', 'StepConcernsGoals', 'StepLearningPreferences', 'StepReview']) {
    assert.match(source, new RegExp(`<${name}`));
  }
});

test('guards duplicate submission and clears persistence only after success', () => {
  assert.match(source, /submissionStatus === 'submitting'/);
  assert.match(source, /buildInterviewPayload/);
  const successBranch = source.slice(source.indexOf('const result = await submitInterview'));
  assert.match(successBranch, /clearInterviewSession/);
  assert.match(successBranch, /onSuccess/);
  assert.match(source, /setSubmissionStatus\('error'\)/);
});

test('includes the required reassurance before submission', () => {
  assert.match(source, /You don’t need to know which class to choose/);
  assert.match(source, /You don’t need to arrive with the answer/);
});
