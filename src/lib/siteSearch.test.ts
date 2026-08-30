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

test('returns no results for a non-empty query that normalizes to no meaningful terms', () => {
  assert.deepEqual(searchSite('[[[['), []);
  assert.deepEqual(searchSite('zzzzzzzzq'), []);
});

test('indexes Principal’s Reflection across apostrophe and possessive variants', () => {
  for (const query of ["Principal's", 'Principal’s', 'Principals', 'princip']) {
    assert.equal(searchSite(query)[0]?.href, '/principal-reflections', query);
  }
});

test('keeps pricing concepts and typo-corrected destinations precise', () => {
  assert.equal(searchSite('money')[0]?.href, '/faq#faq-how-much-does-tutoring-cost');
  assert.equal(searchSite('interveiw')[0]?.href, '/book-interview');
  assert.equal(searchSite('mathmatics')[0]?.href, '/subjects/mathematics');
  assert.equal(searchSite('fee').some((result) => result.title.toLowerCase().includes('feeling')), false);
});

test('indexes direct public program and utility destinations', () => {
  assert.equal(searchSite('early years')[0]?.href, '/programs/early-years');
  assert.equal(searchSite('year 3 4')[0]?.href, '/programs/year-3-4');
  assert.equal(searchSite('contact')[0]?.href, '/contact');
});
