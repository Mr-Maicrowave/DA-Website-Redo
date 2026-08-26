import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FEATURED_TUTOR_ID,
  FACULTY_ROSTER_IDS,
  INNER_ORBIT_DURATION_SECONDS,
  INNER_ORBIT_TUTOR_IDS,
  OUTER_ORBIT_DURATION_SECONDS,
  OUTER_ORBIT_TUTOR_IDS,
  orbitPoint,
  nextRosterPage,
  FEATURED_TUTOR_IDS,
  TUTOR_ORBIT_LAYOUT,
  orbitMotionFor,
  orbitPositionFor,
  rosterWindow,
  selectionSequenceFor,
  swapFacultyTutor,
} from './tutor-orbit-config.ts';

test('defines a deterministic and unique 1 + 5 + 9 faculty hierarchy', () => {
  const visibleIds = [DEFAULT_FEATURED_TUTOR_ID, ...INNER_ORBIT_TUTOR_IDS, ...OUTER_ORBIT_TUTOR_IDS];

  assert.equal(DEFAULT_FEATURED_TUTOR_ID, 'T003');
  assert.equal(INNER_ORBIT_TUTOR_IDS.length, 5);
  assert.equal(OUTER_ORBIT_TUTOR_IDS.length, 9);
  assert.equal(visibleIds.length, 15);
  assert.equal(new Set(visibleIds).size, 15);
});

test('keeps one stable fifteen-person navigator roster including the active centre', () => {
  assert.deepEqual(FACULTY_ROSTER_IDS, [
    'T003',
    'T011', 'T005', 'T010', 'T012', 'T015',
    'T001', 'T002', 'T009', 'T004', 'T006', 'T007', 'T008', 'T013', 'T014',
  ]);
  assert.equal(new Set(FACULTY_ROSTER_IDS).size, 15);
});

test('uses calmer counter-moving timings for the two orbit tiers', () => {
  assert.ok(INNER_ORBIT_DURATION_SECONDS >= 45 && INNER_ORBIT_DURATION_SECONDS <= 60);
  assert.ok(OUTER_ORBIT_DURATION_SECONDS >= 70 && OUTER_ORBIT_DURATION_SECONDS <= 100);
  assert.ok(OUTER_ORBIT_DURATION_SECONDS > INNER_ORBIT_DURATION_SECONDS);
});

test('keeps inner and outer tutors on distinct gently asymmetric ellipses', () => {
  const inner = orbitPoint(0.75, 'inner');
  const outer = orbitPoint(0.75, 'outer');

  assert.ok(Math.abs(outer.x) > Math.abs(inner.x));
  assert.ok(Math.abs(outer.y) > Math.abs(inner.y));
  assert.notEqual(orbitPoint(0, 'inner').y, orbitPoint(Math.PI, 'inner').y);
});

test('moves the previous centre tutor into the selected inner slot', () => {
  const result = swapFacultyTutor(
    'T003',
    ['T011', 'T005', 'T010', 'T012', 'T015'],
    ['T001', 'T002'],
    'T010',
  );

  assert.deepEqual(result, {
    activeId: 'T010',
    innerIds: ['T011', 'T005', 'T003', 'T012', 'T015'],
    outerIds: ['T001', 'T002'],
    selectedTier: 'inner',
    selectedSlot: 2,
  });
});

test('moves the previous centre tutor into the selected outer slot', () => {
  const result = swapFacultyTutor(
    'T003',
    ['T011', 'T005'],
    ['T001', 'T002', 'T009'],
    'T002',
  );

  assert.deepEqual(result, {
    activeId: 'T002',
    innerIds: ['T011', 'T005'],
    outerIds: ['T001', 'T003', 'T009'],
    selectedTier: 'outer',
    selectedSlot: 1,
  });
});

test('promotes an outer tutor before exchanging it', () => {
  assert.deepEqual(selectionSequenceFor('outer', false), [
    { phase: 'promoting', at: 0 },
    { phase: 'exchanging', at: 240 },
    { phase: 'idle', at: 1080 },
  ]);
  assert.deepEqual(selectionSequenceFor('inner', false), [
    { phase: 'exchanging', at: 0 },
    { phase: 'idle', at: 960 },
  ]);
});

test('uses one short exchange for reduced motion', () => {
  assert.deepEqual(selectionSequenceFor('outer', true), [
    { phase: 'exchanging', at: 0 },
    { phase: 'idle', at: 160 },
  ]);
});

test('pages all fifteen tutors through four-person mobile windows', () => {
  const ids = Array.from({ length: 15 }, (_, index) => `T${index + 1}`);
  assert.deepEqual(rosterWindow(ids, 0, 4), ['T1', 'T2', 'T3', 'T4']);
  assert.deepEqual(rosterWindow(ids, 3, 4), ['T13', 'T14', 'T15', 'T1']);
  assert.equal(nextRosterPage(3, 1, 15, 4), 0);
  assert.equal(nextRosterPage(0, -1, 15, 4), 3);
});

test('keeps the legacy orbit exports available during hero migration', () => {
  assert.deepEqual(FEATURED_TUTOR_IDS, ['T010', 'T003', 'T011', 'T005', 'T012', 'T015']);
  assert.equal(TUTOR_ORBIT_LAYOUT, 'always-expanded');
  assert.equal(orbitPositionFor('T010'), 'north');
  assert.deepEqual(orbitMotionFor('T010'), {
    x: [0, 16, 0, -16, 0],
    y: [-11, 0, 11, 0, -11],
    duration: 18,
  });
});

test('handles empty mobile rosters', () => {
  assert.deepEqual(rosterWindow([], 0, 4), []);
  assert.equal(nextRosterPage(0, 1, 0, 4), 0);
});
