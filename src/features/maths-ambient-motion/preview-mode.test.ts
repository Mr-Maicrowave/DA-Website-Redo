import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const moduleUrl = new URL('./preview-mode.ts', import.meta.url);

test('enables ambient Mathematics motion only for the exact preview value', async () => {
  assert.equal(existsSync(moduleUrl), true, 'preview-mode.ts must define the preview query contract');

  const { isMathsAmbientPreview } = await import('./preview-mode.ts');

  assert.equal(isMathsAmbientPreview('?motionPreview=1'), true);
  assert.equal(isMathsAmbientPreview('?topic=graphs&motionPreview=1'), true);
  assert.equal(isMathsAmbientPreview(''), false);
  assert.equal(isMathsAmbientPreview('?motionPreview=0'), false);
  assert.equal(isMathsAmbientPreview('?motionPreview=true'), false);
  assert.equal(isMathsAmbientPreview('?motionPreview=1&motionPreview=0'), false);
});
