import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./graph-lab-theme.css', import.meta.url), 'utf8');

test('dark selected example chips use an explicit high-contrast state', () => {
  assert.match(css, /\.graph-lab-example-chip\[aria-pressed='true'\]/);
  assert.match(css, /background(?:-color)?:\s*var\(--gl-violet\)/);
  assert.match(css, /color:\s*#07111e/);
});
