import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentPath = new URL('./GratitudeSection.tsx', import.meta.url);
const stylesPath = new URL('./GratitudeSection.css', import.meta.url);
const notesPath = new URL('./gratitudeReviewNotes.ts', import.meta.url);
const reviewsPath = new URL('../../data/reviews.json', import.meta.url);
const marqueePath = new URL('../../data/googleReviews.ts', import.meta.url);

test('uses source-verified review fragments that do not repeat marquee reviewers', async () => {
  const [notes, reviews, marquee] = await Promise.all([
    readFile(notesPath, 'utf8'), readFile(reviewsPath, 'utf8'), readFile(marqueePath, 'utf8'),
  ]);

  const expected = [
    ['Lisa Vu', 'I am now looking forward to a bright future'],
    ['Chau Ho', 'My English has improved significantly'],
    ['Florence Nguyen', 'it’s helped raise my grades tremendously !!'],
    ['Khushleen Kaur', 'I went from a 60% in math to a 97%.'],
    ['Harry Kha', 'They always had my back whenever I needed them'],
    ['Charlie Kien', 'They have made me believe in myself'],
  ];

  for (const [author, quote] of expected) {
    assert.match(reviews, new RegExp(author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.ok(reviews.includes(quote), `source review contains ${quote}`);
    assert.ok(notes.includes(author) && notes.includes(quote));
    assert.ok(!marquee.includes(author), `${author} is unused by the marquee`);
  }
});

test('renders an accessible layered envelope with the approved letter copy', async () => {
  const component = await readFile(componentPath, 'utf8');
  for (const contract of [
    'useState', 'aria-expanded', 'ss-gratitude__envelope-back', 'ss-gratitude__letter',
    'ss-gratitude__flap', 'ss-gratitude__pocket', 'ss-gratitude__seal',
    'These words mean', 'more than you know. ♡', "We're grateful to grow with you. ♡",
  ]) assert.ok(component.includes(contract), `component includes ${contract}`);
});

test('defines responsive layering and reduced-motion contracts', async () => {
  const styles = await readFile(stylesPath, 'utf8');
  for (const contract of ['perspective:1000px', 'rotateX(180deg)', '@media (max-width:860px)', '@media (prefers-reduced-motion:reduce)']) {
    assert.ok(styles.includes(contract), `styles include ${contract}`);
  }
});
