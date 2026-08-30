import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-encoding.mjs');

function runEncodingCheck(cwd) {
  return new Promise((resolve) => {
    execFile(process.execPath, [scriptPath], { cwd }, (error, stdout, stderr) => resolve({ error, stdout, stderr }));
  });
}

test('ignores nested linked worktrees while checking the active checkout', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'da-encoding-'));
  try {
    await mkdir(path.join(fixture, 'src'), { recursive: true });
    await mkdir(path.join(fixture, '.worktrees', 'legacy', 'src'), { recursive: true });
    await writeFile(path.join(fixture, 'src', 'site.ts'), 'export const site = "ready";\n');
    const mojibake = String.fromCodePoint(0x00e2, 0x20ac, 0x201d);
    await writeFile(path.join(fixture, '.worktrees', 'legacy', 'src', 'legacy.ts'), `const copy = "${mojibake}";\n`);

    const result = await runEncodingCheck(fixture);

    assert.equal(result.error, null, result.stderr);
    assert.match(result.stdout, /Encoding check passed/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
