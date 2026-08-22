import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationUrl = new URL('./NavigationNew.tsx', import.meta.url);

test('does not offer the retired All Subjects hub in the Subjects navigation', () => {
  const source = readFileSync(navigationUrl, 'utf8');

  assert.doesNotMatch(source, /title:\s*"All Subjects"/);
  assert.doesNotMatch(source, /href:\s*"\/subjects"/);
});
