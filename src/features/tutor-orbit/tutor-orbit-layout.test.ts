import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const globalCssUrl = new URL('../../index.css', import.meta.url);

test('does not cap every div and span to its containing block width', () => {
  const source = readFileSync(globalCssUrl, 'utf8');

  assert.doesNotMatch(
    source,
    /p,\s*\n\s*h1,[\s\S]*?span,\s*\n\s*div\s*\{[\s\S]*?max-width:\s*100%/,
  );
});
