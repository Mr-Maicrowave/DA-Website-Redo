import assert from 'node:assert/strict';
import test from 'node:test';

import { TUTORS, type CatalogueTutor } from '../../data/teacherCatalogue.ts';
import {
  TUTOR_BOOK_PAGE_COUNT,
  TUTOR_BOOK_PAGINATED_LEAF_COUNT,
  TUTOR_BOOK_READING_STATE_COUNT,
  advanceTutorBookPageTurn,
  createTutorBookPages,
  createTutorBookSpreads,
  getPageTurnDirectionForKey,
  getPageTurnDirectionForSwipe,
  getTutorBookPageTarget,
} from './tutor-book-pages.ts';

const jenny = TUTORS.find(tutor => tutor.id === 'T003')!;

test('builds three complete Jenny spreads from the six canonical profile pages', () => {
  const pages = createTutorBookPages(jenny);
  const spreads = createTutorBookSpreads(jenny);

  assert.equal(pages.length, TUTOR_BOOK_PAGE_COUNT);
  assert.equal(TUTOR_BOOK_PAGE_COUNT, 6);
  assert.deepEqual(spreads.map(spread => spread.pages.map(page => page.id)), [
    ['identity', 'approach'],
    ['why-da', 'goals'],
    ['remembered', 'subjects'],
  ]);
  assert.ok(spreads.every(spread => spread.pages.every(page => page.sourceText.length > 0)));
});

test('uses Jenny canonical fields verbatim without invented profile prose', () => {
  const pages = createTutorBookPages(jenny);

  assert.deepEqual(pages.map(page => page.sourceText), [
    [
      'Mrs Jenny N.',
      'The Excellence Standard',
      "She doesn't teach to the test. She teaches to last.",
      'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced',
      'English specialist',
      '10+ years experience',
      'Primary school manager',
    ],
    [
      'Every child deserves to know what excellent work feels like.',
      'English specialist',
      '10+ years experience',
      'Primary school manager',
    ],
    [jenny.profile!.whyDA],
    [jenny.profile!.goals],
    [jenny.profile!.remembered],
    [
      'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced',
      'English specialist',
      '10+ years experience',
      'Primary school manager',
    ],
  ]);
});

test('falls back explicitly to motto and an empty tag list when conventional profile fields are absent', () => {
  const sparse: CatalogueTutor = {
    ...jenny,
    id: 'sparse',
    name: 'Tutor Name',
    designation: 'Tutor Designation',
    tagline: 'Tutor tagline.',
    motto: 'Patient, structured teaching.',
    subjects: 'English',
    profile: undefined,
  };

  assert.deepEqual(createTutorBookPages(sparse).map(page => page.sourceText), [
    ['Tutor Name', 'Tutor Designation', 'Tutor tagline.', 'English'],
    ['Patient, structured teaching.'],
    ['Patient, structured teaching.'],
    ['Patient, structured teaching.'],
    ['Patient, structured teaching.'],
    ['English'],
  ]);
});

test('maps keyboard and reliable horizontal swipe gestures to bounded page targets', () => {
  assert.equal(getPageTurnDirectionForKey('ArrowLeft'), -1);
  assert.equal(getPageTurnDirectionForKey('PageUp'), -1);
  assert.equal(getPageTurnDirectionForKey('ArrowRight'), 1);
  assert.equal(getPageTurnDirectionForKey('PageDown'), 1);
  assert.equal(getPageTurnDirectionForKey('Enter'), undefined);

  assert.equal(getPageTurnDirectionForSwipe(-64, 8), 1);
  assert.equal(getPageTurnDirectionForSwipe(64, 8), -1);
  assert.equal(getPageTurnDirectionForSwipe(40, 2), undefined);
  assert.equal(getPageTurnDirectionForSwipe(70, 80), undefined);

  assert.equal(getTutorBookPageTarget(0, -1), undefined);
  assert.equal(getTutorBookPageTarget(0, 1), 1);
  assert.equal(getTutorBookPageTarget(1, -1), 0);
  assert.equal(getTutorBookPageTarget(1, 1), undefined, 'the concise reader exposes two reachable states');
  assert.equal(TUTOR_BOOK_PAGINATED_LEAF_COUNT, 1);
  assert.equal(TUTOR_BOOK_READING_STATE_COUNT, 2);
});

test('gives the four visible tutor pages their reader-first editorial roles', () => {
  assert.deepEqual(createTutorBookPages(jenny).slice(0, 4).map(page => page.label), [
    'Meet the tutor',
    'How they teach',
    'Why trust them',
    'Who they are right for',
  ]);
});

test('advances real controller page progress over the existing timing window and clamps once complete', () => {
  assert.equal(advanceTutorBookPageTurn(0, .38, 760), .5);
  assert.equal(advanceTutorBookPageTurn(.8, .38, 760), 1);
  assert.equal(advanceTutorBookPageTurn(.2, 1, 0), 1);
  assert.equal(advanceTutorBookPageTurn(.2, Number.NaN, 760), .2);
});
