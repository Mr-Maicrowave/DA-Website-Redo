import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('keeps expanded tutor search on the floor controls instead of moving it over shelf books', async () => {
  const css = await readFile(new URL('./tutor-library.css', import.meta.url), 'utf8');
  const desktopRule = css.match(/\.tutor-library--spotlight-active \.tutor-library__controls\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.doesNotMatch(desktopRule, /10\.4rem|top:/);
  assert.match(desktopRule, /inset:\s*auto/);
});
