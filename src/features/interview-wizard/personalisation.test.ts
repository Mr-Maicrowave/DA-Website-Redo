import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('uses one consistent student-name fallback throughout the journey', () => {
  const wizard = read('./InterviewWizard.tsx');
  assert.match(wizard, /getStudentName/);
  assert.match(wizard, /First, let’s meet your family/);
  assert.match(wizard, /Here’s what we’ve understood about/);
  assert.match(wizard, /You can change anything/);
});

test('personalises later questions without changing the six-step architecture', () => {
  const sources = [
    './InterviewWizard.tsx',
    './steps/StepSubjects.tsx',
    './steps/StepCurrentSituation.tsx',
    './steps/StepConcernsGoals.tsx',
    './steps/StepLearningPreferences.tsx',
  ].map(read).join('\n');

  assert.match(sources, /studentName/);
  assert.match(sources, /What is \$\{studentName\} working on/);
  assert.match(sources, /How confident does \{studentName\} feel right now/);
  assert.match(sources, /What kind of tutor tends to bring out the best in \{studentName\}/);
});

test('groups family details and uses visible school-year choices', () => {
  const source = read('./steps/StepParentStudent.tsx');
  assert.match(source, /ABOUT YOU/);
  assert.match(source, /ABOUT YOUR CHILD/);
  assert.match(source, /SingleChoice/);
  assert.doesNotMatch(source, /SelectInput id="school-year"/);
});

test('organises review into the requested human-readable groups', () => {
  const source = read('./steps/StepReview.tsx');
  for (const title of ['YOUR DETAILS', 'SUBJECTS AND AREAS', 'Right now', 'Your priority', 'Goals', 'Learning considerations', 'PREVIOUS TUTORING', 'Format preference', 'Tutor preferences', 'ADDITIONAL NOTES']) {
    assert.match(source, new RegExp(title));
  }
});
