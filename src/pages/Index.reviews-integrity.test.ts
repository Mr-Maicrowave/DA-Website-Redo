import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { supplementalHomepageReviews } from '../data/homepage-reviews.ts';

const indexUrl = new URL('./Index.tsx', import.meta.url);
const source = readFileSync(indexUrl, 'utf8');

test('homepage contains no placeholder review records', () => {
  assert.doesNotMatch(source, /id: 'pr-/);
  assert.doesNotMatch(source, /PLACEHOLDER REVIEWS/);
});

test('homepage leads with its strongest verified transformations', () => {
  const reviewSource = source.slice(
    source.indexOf('const CAROUSEL_REVIEWS'),
    source.indexOf('const REVIEW_TAGS'),
  );

  assert.ok(reviewSource.indexOf("author: 'Diana Nguyen'") < reviewSource.indexOf("author: 'Emily Nguyen'"));
  assert.ok(reviewSource.indexOf("author: 'Emily Nguyen'") < reviewSource.indexOf("author: 'Bryant Lam'"));
  assert.match(source, /'vr-e1', 'cr-1', 'vr-e2', 'vr-e3'/);
});

test('homepage subject filters retain a meaningful depth of verified reviews', () => {
  const reviewSource = source.slice(
    source.indexOf('const CAROUSEL_REVIEWS'),
    source.indexOf('const REVIEW_TAGS'),
  );
  const englishTagged = reviewSource.match(/(?:newTags|"newTags"): \[[^\]]*["']English["'][^\]]*\]/g) ?? [];
  const mathsTagged = reviewSource.match(/(?:newTags|"newTags"): \[[^\]]*["']Mathematics["'][^\]]*\]/g) ?? [];

  assert.ok(englishTagged.length >= 8, `expected curated English reviews to remain, found ${englishTagged.length}`);
  assert.ok(mathsTagged.length >= 8, `expected curated Mathematics reviews to remain, found ${mathsTagged.length}`);

  for (const subject of ['English', 'Mathematics', 'Science']) {
    const reviews = supplementalHomepageReviews.filter((review) => review.subject === subject);
    assert.ok(reviews.length >= 30, `expected at least 30 ${subject} reviews, found ${reviews.length}`);
  }
  assert.match(source, /'Mathematics', 'Science'/);
});

test('review cards present the achievement as the dominant proof moment', () => {
  assert.match(source, /The result/i);
  assert.match(source, /fontSize: 'clamp\(1\.65rem,2\.4vw,2\.35rem\)'/);
});
