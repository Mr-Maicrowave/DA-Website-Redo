import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pageCss = await readFile(new URL('../../pages/SuccessStories.css', import.meta.url), 'utf8');

test('keeps the complete desktop review ribbon within one viewport', () => {
  const desktopRule = pageCss.match(/@media \(min-width: 781px\) and \(min-height: 48rem\)[\s\S]*?@media \(max-width: 780px\)/)?.[0] ?? '';

  assert.match(desktopRule, /\.ss-praise-ribbon\s*\{[^}]*height:\s*100svh/s);
  assert.match(desktopRule, /\.ss-praise-ribbon\s*\{[^}]*max-height:\s*56rem/s);
  assert.match(desktopRule, /\.ss-praise-ribbon__card\s*\{[^}]*width:\s*25\.625rem[^}]*height:\s*13\.75rem/s);
  assert.match(desktopRule, /\.ss-praise-ribbon__rows\s*\{[^}]*gap:\s*0\.75rem/s);
});
