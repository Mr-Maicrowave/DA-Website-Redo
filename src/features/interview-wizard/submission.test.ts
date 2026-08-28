import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialInterviewData } from './model.ts';
import { buildInterviewPayload } from './payload.ts';
import { submitInterviewLocally } from './submission.ts';

test('local adapter resolves successfully without mutating its payload', async () => {
  const payload = buildInterviewPayload(createInitialInterviewData('start'), 'complete');
  const before = structuredClone(payload);
  assert.deepEqual(await submitInterviewLocally(payload), { ok: true });
  assert.deepEqual(payload, before);
});
