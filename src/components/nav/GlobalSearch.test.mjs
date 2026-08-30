import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('./GlobalSearch.css', import.meta.url), 'utf8');
const source = await readFile(new URL('./GlobalSearch.tsx', import.meta.url), 'utf8');

test('suppresses the browser-native search cancel control in favour of the DA close button', () => {
  assert.match(css, /::-webkit-search-cancel-button[\s\S]*?appearance:\s*none/);
});

test('renders a no-result state for a non-empty unmatched query', () => {
  assert.match(source, /No clear match for/);
});
