import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialInterviewData,
  getSchoolStage,
  sanitiseDataForYear,
  setTutoringHistory,
  toggleExclusiveValue,
  toggleSubject,
  toggleSubjectArea,
} from './model.ts';

test('derives stage at every boundary', () => {
  assert.equal(getSchoolStage(null), null);
  assert.equal(getSchoolStage(1), 'primary');
  assert.equal(getSchoolStage(6), 'primary');
  assert.equal(getSchoolStage(7), 'high-school');
  assert.equal(getSchoolStage(10), 'high-school');
  assert.equal(getSchoolStage(11), 'hsc');
  assert.equal(getSchoolStage(12), 'hsc');
  assert.equal(getSchoolStage(0), null);
  assert.equal(getSchoolStage(13), null);
});

test('changing Year 12 data to Year 3 removes invalid hidden values', () => {
  const source = {
    ...createInitialInterviewData('start'),
    schoolYear: 12,
    subjects: ['physics', 'english'],
    subjectAreas: {
      physics: ['past-papers'],
      english: ['band-6-preparation'],
    },
    goals: ['band-6-goal', 'more-confidence'],
    currentResults: '80-89',
    currentResultsNotes: 'Latest mark',
  };
  const result = sanitiseDataForYear(source, 3);
  assert.deepEqual(result.subjects, ['english']);
  assert.deepEqual(result.subjectAreas, { english: [] });
  assert.deepEqual(result.goals, ['more-confidence']);
  assert.equal(result.currentResults, undefined);
  assert.equal(result.currentResultsNotes, undefined);
  assert.equal(result.schoolYear, 3);
});

test('changing primary data to high school clears primary difficulty', () => {
  const source = { ...createInitialInterviewData('start'), schoolYear: 3, schoolworkDifficulty: 'often-difficult' };
  assert.equal(sanitiseDataForYear(source, 8).schoolworkDifficulty, undefined);
});

test('deselecting a subject deletes its subject areas', () => {
  let data = { ...createInitialInterviewData('start'), schoolYear: 8 };
  data = toggleSubject(data, 'english');
  data = toggleSubjectArea(data, 'english', 'essay-writing');
  assert.deepEqual(data.subjectAreas.english, ['essay-writing']);
  data = toggleSubject(data, 'english');
  assert.deepEqual(data.subjects, []);
  assert.equal(data.subjectAreas.english, undefined);
});

test('exclusive selections clear incompatible values in either direction', () => {
  assert.deepEqual(toggleExclusiveValue(['rushes'], 'nothing-specific', ['nothing-specific', 'not-sure']), ['nothing-specific']);
  assert.deepEqual(toggleExclusiveValue(['nothing-specific'], 'rushes', ['nothing-specific', 'not-sure']), ['rushes']);
});

test('declining previous tutoring clears its hidden follow-ups', () => {
  const data = {
    ...createInitialInterviewData('start'),
    hasHadTutoringBefore: true,
    previousTutoringWorked: 'Patient tutor',
    previousTutoringIssues: ['class-too-big'],
  };
  const result = setTutoringHistory(data, false);
  assert.equal(result.hasHadTutoringBefore, false);
  assert.equal(result.previousTutoringWorked, undefined);
  assert.deepEqual(result.previousTutoringIssues, []);
});
