import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const faqUrl = new URL('./FAQ.tsx', import.meta.url);

test('uses the existing FAQ photograph in a subject-style full-viewport hero', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /faq-hero-tutor-student-brow-touchup\.png/);
  assert.match(source, /min-h-screen/);
  assert.match(source, /subject-hero-style overlay/);
});

test('uses the subject-hero heading rhythm without moving FAQ search below the fold', () => {
  const source = readFileSync(faqUrl, 'utf8');

  assert.match(source, /Start with what’s/);
  assert.match(source, /on your mind\./);
  assert.match(source, /text-\[#c9a227\]/);
  assert.match(source, /Explore answers/);
  assert.match(source, /id="faq-answers"/);
});
