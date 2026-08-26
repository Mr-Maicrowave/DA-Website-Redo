import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const deckSource = readFileSync(
  new URL('./MethodTeachingDeck.tsx', import.meta.url),
  'utf8',
);
const detailSource = readFileSync(
  new URL('./MethodDetail.tsx', import.meta.url),
  'utf8',
);
const transitionStyles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const featureSource = `${deckSource}\n${detailSource}\n${transitionStyles}`;

test('renders the approved care-led overview and process annotation', () => {
  assert.match(deckSource, /Every student needs/);
  assert.match(deckSource, /Five steps\. One continuous learning process\./);
});

test('keeps the card deck semantic and keyboard operable', () => {
  assert.match(deckSource, /methodItems\.map/);
  assert.match(deckSource, /<button/);
  assert.match(deckSource, /aria-pressed/);
  assert.match(deckSource, /onKeyDown/);
});

test('provides one live editorial detail renderer', () => {
  assert.match(detailSource, /WHAT WE DO/);
  assert.match(detailSource, /aria-live="polite"/);
});

test('declares the expanded 42\/58 composition contract', () => {
  assert.match(featureSource, /42(?:fr|%)?\s*[/,: ]\s*58(?:fr|%)?|42\/58/);
});
