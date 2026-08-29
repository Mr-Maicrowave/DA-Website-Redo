import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const embeddedPageUrl = new URL('../../../public/english-page/index.html', import.meta.url);

test('English reviews keep the active card inside a laptop-height viewport', () => {
  const html = readFileSync(embeddedPageUrl, 'utf8');

  assert.match(html, /--english-parent-viewport-height/);
  assert.match(html, /height:clamp\(27rem,calc\(var\(--english-parent-viewport-height,100svh\) - 20rem\),37rem\)/);
  assert.match(html, /window\.parent\.innerHeight/);
});
