import assert from 'node:assert/strict';
import test from 'node:test';
import { searchSite } from './siteSearch.ts';

test('ranks global FAQ and subject results through the shared matcher', () => {
  assert.equal(searchSite('fee')[0]?.title, 'How much does tutoring cost?');
  assert.equal(searchSite('maths').some((result) => result.title === 'Mathematics'), true);
  assert.equal(searchSite('tutor').some((result) => result.title === 'Meet our teachers'), true);
  assert.equal(searchSite('interveiw')[0]?.title, 'Book a consultation');
});

test('links a FAQ result to its exact deep-link target', () => {
  const result = searchSite('how much does tutoring cost')[0];
  assert.equal(result?.href, '/faq#faq-how-much-does-tutoring-cost');
  assert.equal(result?.kind, 'FAQ');
});
