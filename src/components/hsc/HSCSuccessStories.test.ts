import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCSuccessStories.tsx', import.meta.url), 'utf8');
const data = readFileSync(new URL('./hscStories.ts', import.meta.url), 'utf8');

test('renders the verified data-driven HSC stories carousel', () => {
  assert.match(source, /THE HSC, IN THEIR WORDS/);
  assert.match(source, /Real stories\./);
  assert.match(source, /Real results\./);
  assert.match(source, /BOOK A CONSULTATION/);
  assert.match(source, /aria-label="Previous story"/);
  assert.match(source, /aria-label="Next story"/);
  assert.match(source, /onPointerDown/);
  assert.match(source, /onKeyDown/);
});

test('contains 32 unique workbook-sourced HSC stories without generated portraits', () => {
  const ids = [...data.matchAll(/id: '(review-\d+)'/g)].map((match) => match[1]);
  assert.equal(ids.length, 32);
  assert.equal(new Set(ids).size, 32);
  assert.doesNotMatch(data, /image:/);
  assert.match(data, /review-316/);
  assert.match(data, /99\.85/);
});

test('uses the generated decorative asset without replacing the shared landscape', () => {
  assert.match(source, /paper-plane-flight\.png/);
  assert.doesNotMatch(source, /background-video|<video/);
});
