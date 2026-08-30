import assert from 'node:assert/strict';
import test from 'node:test';

import { TUTORS, type CatalogueTutor } from '../../data/teacherCatalogue.ts';
import { profileContentFor } from '../../pages/profileContent.ts';
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

test('builds two complete Jenny reader spreads from the first four canonical profile pages', () => {
  const pages = createTutorBookPages(jenny);
  const spreads = createTutorBookSpreads(jenny);

  assert.equal(pages.length, TUTOR_BOOK_PAGE_COUNT);
  assert.equal(TUTOR_BOOK_PAGE_COUNT, 6);
  assert.deepEqual(spreads.map(spread => spread.pages.map(page => page.id)), [
    ['identity', 'approach'],
    ['why-da', 'goals'],
  ]);
  assert.ok(spreads.every(spread => spread.pages.every(page => page.sourceText.length > 0)));
});

test('uses only Jenny canonical fields and verbatim sentence excerpts', () => {
  const pages = createTutorBookPages(jenny);
  const canonicalFields = [jenny.name, jenny.designation, jenny.tagline, jenny.motto, jenny.subjects, jenny.profile!.whyDA, jenny.profile!.goals, jenny.profile!.remembered, ...profileContentFor(jenny).strengths];

  assert.ok(pages.flatMap(page => page.sourceText).every(text => canonicalFields.some(field => field.includes(text) || text.includes(field))));
  assert.equal(pages[0].sourceText.length, 7);
  assert.equal(pages[2].sourceText[0], 'I started as a part-time tutor at DA Tuition while I was studying my double degree of business and law at university.');
  assert.equal(pages[3].sourceText[0], "My legal background gave me a deep appreciation of the power of words, while my Master's in Teaching equipped me with strategies to make English clear, structured and accessible.");
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
    ['Patient, structured teaching.', 'English'],
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

test('keeps the four visible pages readable by reserving detailed strengths for teaching and trust', () => {
  const [identity, approach, whyTrust, fit] = createTutorBookPages(jenny);

  assert.deepEqual(identity.sourceText, [jenny.name, jenny.designation, jenny.tagline, jenny.subjects, ...profileContentFor(jenny).strengths.slice(0, 3)]);
  assert.ok(approach.sourceText.length > 1, 'teaching principles remain available on How They Teach');
  assert.ok(whyTrust.sourceText[0]!.split(/\s+/).length < 90, 'Why Trust Them begins with a readable canonical excerpt');
  assert.ok(fit.sourceText[0]!.split(/\s+/).length < 90, 'Who They Are Right For begins with a readable canonical excerpt');
});

test('exposes exactly the two reader spreads in the agreed editorial order', () => {
  const spreads = createTutorBookSpreads(jenny);

  assert.deepEqual(spreads.map(spread => spread.pages.map(page => page.id)), [
    ['identity', 'approach'],
    ['why-da', 'goals'],
  ]);
});

test('advances real controller page progress over the existing timing window and clamps once complete', () => {
  assert.equal(advanceTutorBookPageTurn(0, .38, 760), .5);
  assert.equal(advanceTutorBookPageTurn(.8, .38, 760), 1);
  assert.equal(advanceTutorBookPageTurn(.2, 1, 0), 1);
  assert.equal(advanceTutorBookPageTurn(.2, Number.NaN, 760), .2);
});
