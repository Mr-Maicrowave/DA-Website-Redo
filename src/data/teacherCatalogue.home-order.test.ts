import test from 'node:test';
import assert from 'node:assert/strict';
import { HOME_TUTOR_IDS, TUTORS } from './teacherCatalogue.ts';

test('homepage carousel exposes every educator in the agreed seniority order', () => {
  assert.equal(HOME_TUTOR_IDS.length, TUTORS.length);
  assert.equal(new Set(HOME_TUTOR_IDS).size, TUTORS.length);
  assert.deepEqual(HOME_TUTOR_IDS.slice(0, 19), [
    'T011', 'T003', 'T010', 'T005', 'T015', 'T012', 'T007', 'T008', 'T006',
    'T020', 'T021', 'T004', 'T022', 'T019', 'T001', 'T016', 'T028', 'T033', 'T034',
  ]);
});
