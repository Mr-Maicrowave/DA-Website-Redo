import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('places the photographed FAQ hero before the designed FAQ library', async () => {
  const source = await readFile(new URL('./FAQ.tsx', import.meta.url), 'utf8');
  const heroIndex = source.indexOf('faq-hero-tutor-student-brow-touchup.png');
  const libraryIndex = source.indexOf('id="faq-browser"');

  assert.ok(heroIndex >= 0, 'the photographed hero should be present');
  assert.ok(libraryIndex >= 0, 'the designed FAQ library should be present');
  assert.ok(heroIndex < libraryIndex, 'the hero should appear before the designed FAQ library');
});
