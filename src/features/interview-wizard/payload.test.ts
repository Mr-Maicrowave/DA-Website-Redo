import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialInterviewData } from './model.ts';
import { buildInterviewPayload } from './payload.ts';
import { buildInterviewSummary } from './summary.ts';

const yearEightData = {
  ...createInitialInterviewData('2026-08-28T00:00:00.000Z'),
  parentTitle: 'Ms',
  parentFirstName: 'Sarah',
  parentLastName: 'Nguyen',
  email: 'sarah@example.com',
  mobile: '0412 345 678',
  preferredContactMethod: 'phone' as const,
  relationshipToStudent: 'mother',
  studentFirstName: 'Emma',
  schoolYear: 8,
  schoolName: 'Example High School',
  suburb: 'Canley Heights',
  subjects: ['mathematics', 'english'],
  subjectAreas: {
    mathematics: ['assessment-preparation'],
    english: ['essay-writing', 'comprehension'],
  },
  currentSituations: ['doing-okay-but-could-do-better', 'rushes-and-makes-mistakes'],
  currentResults: '60-69',
  confidence: 'mixed' as const,
  parentConcerns: ['capable-of-more', 'needs-better-study-habits'],
  goals: ['higher-school-marks', 'more-confidence', 'greater-independence'],
  learningChallenges: ['rushes', 'difficulty-applying-knowledge-in-tests'],
  preferredFormats: ['not-sure'] as const,
  tutorPreferences: ['calm-and-structured', 'strong-at-organisation'],
  parentConcernNotes: 'Emma understands the work at home but loses marks in exams.',
};

test('builds a human-readable summary without machine slugs', () => {
  const summary = buildInterviewSummary(yearEightData);
  assert.match(summary, /Student: Emma — Year 8/);
  assert.match(summary, /Subjects: Mathematics, English/);
  assert.match(summary, /Not sure — please recommend what suits my child/);
  assert.doesNotMatch(summary, /doing-okay-but-could-do-better/);
});

test('builds structured and legacy-compatible payload fields', () => {
  const completedAt = '2026-08-28T01:00:00.000Z';
  const payload = buildInterviewPayload(yearEightData, completedAt);
  assert.equal(payload.student.schoolStage, 'high-school');
  assert.deepEqual(payload.learningProfile.subjects, ['mathematics', 'english']);
  assert.equal(payload.firstName, yearEightData.parentFirstName);
  assert.equal(payload.subject, 'Mathematics, English');
  assert.equal(payload.tutoringFormat, 'Not sure — please recommend what suits my child');
  assert.equal(payload.metadata.completedAt, completedAt);
});

test('sanitises stale fields before building a payload', () => {
  const payload = buildInterviewPayload({
    ...yearEightData,
    schoolYear: 3,
    subjects: ['physics', 'english'],
    subjectAreas: { physics: ['past-papers'], english: ['comprehension'] },
    goals: ['band-6-goal', 'more-confidence'],
    currentResults: '90-plus',
  }, 'complete');
  assert.deepEqual(payload.learningProfile.subjects, ['english']);
  assert.equal(payload.learningProfile.currentResults, undefined);
  assert.deepEqual(payload.parentPerspective.goals, ['more-confidence']);
});
