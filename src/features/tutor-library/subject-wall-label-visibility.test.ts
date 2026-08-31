import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('keeps subject wall labels in front of the cabinet while allowing open paper to occlude them', async () => {
  const source = await readFile(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');

  assert.match(source, /material-depthTest=\{true\}/);
  assert.match(source, /material-depthWrite=\{false\}/);
  assert.match(source, /renderOrder=\{\d+\}/);
});
