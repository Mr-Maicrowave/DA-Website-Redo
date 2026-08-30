import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const faqUrl = new URL('./FAQ.tsx', import.meta.url);

test('mounts the full FAQ experience', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /You ask\./);
  assert.match(source, /filterDeskFAQs/);
  assert.match(source, /min-h-screen/);
  assert.match(source, /NavigationNew/);
});

test('keeps FAQ structured data tied to the rendered question set', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /faqPageSchema/);
  assert.match(source, /faqs\.map/);
  assert.match(source, /question: x\.question/);
  assert.match(source, /answer: x\.answer/);
  assert.match(source, /canonicalUrl="\/faq"/);
});
