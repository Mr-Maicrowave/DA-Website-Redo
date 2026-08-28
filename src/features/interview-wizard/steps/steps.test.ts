import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const stepNames = [
  'StepParentStudent',
  'StepSubjects',
  'StepCurrentSituation',
  'StepConcernsGoals',
  'StepLearningPreferences',
  'StepReview',
];

test('provides all six controlled wizard step components', () => {
  for (const name of stepNames) {
    assert.ok(existsSync(new URL(`./${name}.tsx`, import.meta.url)), `${name} must exist`);
  }
});

test('subject step is configuration-driven and supports multiple areas', () => {
  const source = readFileSync(new URL('./StepSubjects.tsx', import.meta.url), 'utf8');
  assert.match(source, /SUBJECTS_BY_STAGE/);
  assert.match(source, /SUBJECT_AREAS_BY_STAGE/);
  assert.match(source, /toggleSubject/);
  assert.match(source, /toggleSubjectArea/);
  assert.doesNotMatch(source, />Mathematics</);
});

test('review exposes edit actions for each data collection step', () => {
  const source = readFileSync(new URL('./StepReview.tsx', import.meta.url), 'utf8');
  for (const step of [1, 2, 3, 4, 5]) assert.match(source, new RegExp(`step: ${step}`));
  assert.match(source, /onEdit\(section\.step\)/);
});

test('reusable fields expose programmatic labels and pressed state', () => {
  const source = readFileSync(new URL('../fields.tsx', import.meta.url), 'utf8');
  assert.match(source, /htmlFor=/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /aria-describedby=/);
});
