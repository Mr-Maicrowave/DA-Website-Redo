import assert from 'node:assert/strict';
import test from 'node:test';
import type { CatalogueTutor } from '../../data/teacherCatalogue';
import {
  matchesDiscoveryFilters,
  toDiscoveryRecord,
} from './tutorDiscovery.ts';

const tutorFixture = (subjects: string, hasPrimary = false): CatalogueTutor => ({
  id: 'fixture',
  tier: 'mid',
  primarySubject: 'english',
  name: 'Test Tutor',
  designation: 'The Test Specialist',
  tagline: 'A patient tutor',
  motto: 'Keep learning',
  photo: 'test',
  posY: '50%',
  subjects,
  hasPrimary,
});

test('normalises English Advanced and Mathematics Yr 7-10 subjects and year levels', () => {
  const record = toDiscoveryRecord(
    tutorFixture('English Advanced / Mathematics (Yr 7–10)'),
  );

  assert.deepEqual(record.subjects, ['english', 'maths']);
  assert.deepEqual(record.yearLevels, ['years-7-10', 'years-11-12']);
});

test('normalises primary tutors to the primary subject and primary year level', () => {
  const record = toDiscoveryRecord(
    tutorFixture('Primary (English & Mathematics) / English (Yr 7–10)', true),
  );

  assert.deepEqual(record.subjects, ['english', 'maths', 'primary']);
  assert.deepEqual(record.yearLevels, ['years-3-6', 'years-7-10']);
});

test('matches an English Advanced tutor at Years 11-12 but not Years 7-10', () => {
  const record = toDiscoveryRecord(tutorFixture('English Advanced'));

  assert.equal(
    matchesDiscoveryFilters(record, { subjects: new Set(['english']), yearLevels: new Set(['years-11-12']) }),
    true,
  );
  assert.equal(
    matchesDiscoveryFilters(record, { subjects: new Set(['english']), yearLevels: new Set(['years-7-10']) }),
    false,
  );
});

test('requires every active filter group while allowing OR within a group', () => {
  const record = toDiscoveryRecord(
    tutorFixture('English (Yr 7–10) / Mathematics Advanced'),
  );

  assert.equal(matchesDiscoveryFilters(record, { query: 'patient', subjects: new Set(), yearLevels: new Set() }), true);
  assert.equal(matchesDiscoveryFilters(record, { subjects: new Set(['science', 'maths']), yearLevels: new Set() }), true);
  assert.equal(matchesDiscoveryFilters(record, { subjects: new Set(['english']), yearLevels: new Set(['years-11-12']) }), true);
  assert.equal(matchesDiscoveryFilters(record, { query: 'missing', subjects: new Set(['maths']), yearLevels: new Set() }), false);
});

