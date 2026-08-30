import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTutors, type TutorDirectoryFilter } from './tutorDirectoryModel.ts';

const tutors = [
  { id: '1', name: 'Ms Ada', designation: 'English educator', tagline: 'Build confidence', subjects: 'English', hasPrimary: false, primarySubject: 'english' },
  { id: '2', name: 'Mr Ben', designation: 'Mathematics educator', tagline: 'Clear methods', subjects: 'Mathematics', hasPrimary: true, primarySubject: 'math' },
  { id: '3', name: 'Dr Cy', designation: 'Science educator', tagline: 'Questions matter', subjects: 'Science', hasPrimary: false, primarySubject: 'science' },
] as const;

test('filters the catalogue by subject and matches a query across parent-visible tutor details', () => {
  const maths: TutorDirectoryFilter = 'maths';
  assert.deepEqual(filterTutors(tutors, maths, '').map((tutor) => tutor.id), ['2']);
  assert.deepEqual(filterTutors(tutors, 'all', 'confidence').map((tutor) => tutor.id), ['1']);
  assert.deepEqual(filterTutors(tutors, 'all', 'educator').map((tutor) => tutor.id), ['1', '2', '3']);
});
