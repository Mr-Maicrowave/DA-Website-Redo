import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mathsReviews, scienceReviews } from '../../data/subject-reviews.ts';
import { getReviewPosition, getReviewPreview } from './subjectReviewCarouselUtils.ts';

const carouselUrl = new URL('./SubjectReviewCarousel.tsx', import.meta.url);
const carouselCssUrl = new URL('./subject-review-carousel.css', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);
const scienceUrl = new URL('../../pages/subjects/Science.tsx', import.meta.url);
const englishPageUrl = new URL('../../../public/english-page/index.html', import.meta.url);

test('subject review carousel supplies distinct verified Maths and Science review sets', () => {
  assert.equal(existsSync(carouselUrl), true, 'SubjectReviewCarousel must provide the reusable review experience');

  const source = readFileSync(carouselUrl, 'utf8');
  assert.match(source, /mathsReviews/);
  assert.match(source, /scienceReviews/);
  assert.ok(mathsReviews.length >= 30, `expected at least 30 Maths reviews, found ${mathsReviews.length}`);
  assert.ok(scienceReviews.length >= 30, `expected at least 30 Science reviews, found ${scienceReviews.length}`);
  assert.equal(new Set(mathsReviews.map((review) => review.quote)).size, mathsReviews.length);
  assert.equal(new Set(scienceReviews.map((review) => review.quote)).size, scienceReviews.length);
});

test('subject review carousels lead with the strongest quantified outcomes', () => {
  assert.deepEqual(mathsReviews.slice(0, 4).map((review) => review.author), [
    'Selene Dixon',
    'Kayla Dos Santos',
    'Anthony Nguyen',
    'Albert Tran',
  ]);
  assert.deepEqual(scienceReviews.slice(0, 4).map((review) => review.author), [
    'Selene Dixon',
    'Kayla Dos Santos',
    'Selena Cao',
    'Nhi Le',
  ]);
});

test('both subject pages mount the shared review carousel before their footer', () => {
  const mathematics = readFileSync(mathematicsUrl, 'utf8');
  const science = readFileSync(scienceUrl, 'utf8');

  assert.match(mathematics, /<SubjectReviewCarousel subject="maths"\s*\/>/);
  assert.match(science, /<SubjectReviewCarousel subject="science"\s*\/>/);
});

test('subject reviews mirror the English three-card stage without pagination pips', () => {
  const source = readFileSync(carouselUrl, 'utf8');

  assert.match(source, /reviews\.map\(\(review, index\)/);
  assert.match(source, /getReviewPosition\(index, activeIndex, reviews\.length\)/);
  assert.match(source, /data-review-position=\{position\}/);
  assert.match(source, /aria-label="Previous student review"/);
  assert.match(source, /aria-label="Next student review"/);
  assert.doesNotMatch(source, /aria-label="Select a student review"/);
  assert.doesNotMatch(source, /Show review from/);
});

test('review positions move through the same animated rail states as English', () => {
  assert.equal(getReviewPosition(2, 2, 8), 'active');
  assert.equal(getReviewPosition(1, 2, 8), 'previous');
  assert.equal(getReviewPosition(3, 2, 8), 'next');
  assert.equal(getReviewPosition(0, 2, 8), 'off-left');
  assert.equal(getReviewPosition(5, 2, 8), 'off-right');
  assert.equal(getReviewPosition(7, 0, 8), 'previous');
});

test('review previews end at a sentence or whole word instead of a clipped line', () => {
  assert.equal(
    getReviewPreview('Marks improved quickly. Confidence followed soon after. This final sentence is too long to keep.', 58),
    'Marks improved quickly. Confidence followed soon after.',
  );
  assert.equal(
    getReviewPreview('An unusually long opening thought without punctuation that continues well beyond the available card space', 55),
    'An unusually long opening thought without punctuation…',
  );
  assert.equal(getReviewPreview('Short review.', 52), 'Short review.');
});

test('full review opens in the dedicated English-style reading panel', () => {
  const source = readFileSync(carouselUrl, 'utf8');
  const styles = readFileSync(carouselCssUrl, 'utf8');

  assert.match(source, /subject-review-card__expanded/);
  assert.match(source, /Full \{subjectLabel\} review/);
  assert.match(source, /aria-label="Back to review preview"/);
  assert.match(source, /className=\{`subject-reviews__stage\$\{isReading \? ' is-reading' : ''\}`\}/);
  assert.match(styles, /\.subject-review-card\.is-reading\s*\{[^}]*background:\s*#fff/);
  assert.match(styles, /\.subject-review-card__expanded blockquote\s*\{[^}]*color:\s*#111827/);
  assert.match(styles, /\.subject-reviews__stage\.is-reading\s*\{/);
});

test('English review viewport is sized from the available screen height instead of fixed desktop pixels', () => {
  const english = readFileSync(englishPageUrl, 'utf8');

  assert.match(english, /height:clamp\(27rem,calc\(var\(--english-parent-viewport-height,100svh\) - 20rem\),37rem\)/);
  assert.doesNotMatch(english, /\.english-reviews__viewport\{\s*height:clamp\(650px,44vw,700px\)/);
});
