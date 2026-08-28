import assert from 'node:assert/strict';
import test from 'node:test';
import { filterFaqItems, paginateFaqItems } from './faq-content.ts';

const questions = [
  { category: 'fees', question: 'How much does tutoring cost?', schemaAnswer: 'Fees depend on the program.', keywords: ['price', 'cost'] },
  { category: 'classes', question: 'How big are the classes?', schemaAnswer: 'Groups are intentionally small.', keywords: ['class size'] },
];

test('filters FAQ items by a parent phrasing and ignores the current category', () => {
  assert.deepEqual(
    filterFaqItems(questions, 'all', 'price').map(({ question }) => question),
    ['How much does tutoring cost?'],
  );
});

test('filters FAQ items by category without requiring a search query', () => {
  assert.deepEqual(
    filterFaqItems(questions, 'classes', '').map(({ question }) => question),
    ['How big are the classes?'],
  );
});

test('paginates the currently filtered FAQ library without rendering later questions', () => {
  const page = paginateFaqItems(Array.from({ length: 23 }, (_, index) => index + 1), 2, 10);

  assert.deepEqual(page.items, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.equal(page.currentPage, 2);
  assert.equal(page.pageCount, 3);
  assert.equal(page.start, 11);
  assert.equal(page.end, 20);
});

test('clamps an out-of-range FAQ page to the final available page', () => {
  const page = paginateFaqItems(Array.from({ length: 12 }, (_, index) => index + 1), 9, 10);

  assert.deepEqual(page.items, [11, 12]);
  assert.equal(page.currentPage, 2);
  assert.equal(page.start, 11);
  assert.equal(page.end, 12);
});
