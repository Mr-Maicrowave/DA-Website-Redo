import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const carouselUrl = new URL('./SubjectReviewCarousel.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);
const scienceUrl = new URL('../../pages/subjects/Science.tsx', import.meta.url);
const englishPageUrl = new URL('../../../public/english-page/index.html', import.meta.url);

test('subject review carousel supplies distinct verified Maths and Science review sets', () => {
  assert.equal(existsSync(carouselUrl), true, 'SubjectReviewCarousel must provide the reusable review experience');

  const source = readFileSync(carouselUrl, 'utf8');
  assert.match(source, /mathsReviews/);
  assert.match(source, /scienceReviews/);
  assert.match(source, /Albert Tran/);
  assert.match(source, /Amanda Vu/);
  assert.match(source, /Huyen Nguyen/);
  assert.match(source, /Ashlee Nguyen/);
});

test('both subject pages mount the shared review carousel before their footer', () => {
  const mathematics = readFileSync(mathematicsUrl, 'utf8');
  const science = readFileSync(scienceUrl, 'utf8');

  assert.match(mathematics, /<SubjectReviewCarousel subject="maths"\s*\/>/);
  assert.match(science, /<SubjectReviewCarousel subject="science"\s*\/>/);
});

test('English review viewport is sized from the available screen height instead of fixed desktop pixels', () => {
  const english = readFileSync(englishPageUrl, 'utf8');

  assert.match(english, /height:clamp\(27rem,calc\(var\(--english-parent-viewport-height,100svh\) - 20rem\),37rem\)/);
  assert.doesNotMatch(english, /\.english-reviews__viewport\{\s*height:clamp\(650px,44vw,700px\)/);
});
