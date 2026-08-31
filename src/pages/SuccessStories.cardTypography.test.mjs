import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const component = readFileSync(new URL('./SuccessStories.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./SuccessStories.css', import.meta.url), 'utf8');

test('keeps the card focused without a supporting paragraph', () => {
  assert.doesNotMatch(component, /cardBody/);
  assert.doesNotMatch(styles, /\.ss-story-panel__asset-body/);
});

test('matches the reference card hierarchy with a quote rule and ornamental divider', () => {
  assert.match(styles, /\.ss-story-panel__asset-copy blockquote[^}]*border-left:/s);
  assert.match(styles, /\.ss-story-panel__highlights::before/);
});

test('centres the heading cluster at the three-quarter point of the card', () => {
  assert.match(styles, /\.ss-story-panel__asset-copy header[^}]*justify-content: center;/s);
  assert.match(styles, /\.ss-story-panel__asset-copy header div[^}]*max-width: 72%;/s);
});
