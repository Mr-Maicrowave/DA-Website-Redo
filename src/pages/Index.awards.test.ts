import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Index.tsx', import.meta.url);

test('shows Fairfield award winner and finalist recognition in the homepage proof set', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /2025 Fairfield City Local Business Awards winner/);
  assert.match(source, /2026 Fairfield City Local Business Awards finalist/);
  assert.match(source, /2026-fairfield-finalist\.png/);
  assert.match(source, /2026 Finalist/);
});

test('gives the DA logo a larger visual footprint in the recognition header', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /\.ir-header-logo\{display:block;width:140px;height:140px/);
});

test('keeps the recognition hand-off compact and the two award badges visually balanced', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /min-height:clamp\(190px,25svh,260px\)/);
  assert.match(source, /\.ir-award-badge--winner \{ width:clamp\(128px,14vw,152px\); \}/);
  assert.match(source, /\.ir-award-badge--finalist \{ width:clamp\(120px,13vw,144px\); \}/);
});
