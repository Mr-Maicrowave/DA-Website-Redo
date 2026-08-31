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

test('English keeps the integrated teaching media and iframe-safe preview controls', () => {
  const html = readFileSync(embeddedPageUrl, 'utf8');

  assert.match(html, /year-9-10-analysis-confidence\.png/);
  assert.match(html, /year-11-12-hsc-tutor-laptop\.png/);
  assert.match(html, /maryam-rubric-demo\.mp4/);
  assert.match(html, /window\.parent\.postMessage\(\{ type: "da-english-preview", open: locked \}/);
  assert.match(html, /previewCloseButton\.addEventListener\("pointerdown", handlePreviewCloseButton\)/);
});
