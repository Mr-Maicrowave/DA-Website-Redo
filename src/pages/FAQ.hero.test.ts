import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const faqUrl = new URL('./FAQ.tsx', import.meta.url);

test('mounts the current FAQ answer desk', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /FAQAnswerDesk/);
  assert.match(source, /min-h-screen/);
  assert.match(source, /NavigationNew/);
});

test('keeps FAQ structured data tied to the rendered question set', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /allFaqQuestions/);
  assert.match(source, /faqPageSchema/);
  assert.match(source, /canonicalUrl="\/faq"/);
});
