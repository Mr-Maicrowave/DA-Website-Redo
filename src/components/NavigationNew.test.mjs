import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./NavigationNew.tsx', import.meta.url), 'utf8');

test('places a Why DA desktop tab directly after Home', () => {
  assert.match(
    source,
    /<Link to="\/" className=\{navLinkClass\(isHomepage\)\}>Home<\/Link>\s*<Link\s+to="\/why-choose-da"[\s\S]*?>\s*Why DA\s*<\/Link>/,
  );
});
