import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('generated sitemap publishes the canonical tutors route and omits the legacy redirect', async () => {
  const generator = new URL('./generate-sitemap.mjs', import.meta.url);
  const result = spawnSync(process.execPath, [fileURLToPath(generator)], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/datuition\.com\.au\/tutors<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/datuition\.com\.au\/find-teacher<\/loc>/);
});
