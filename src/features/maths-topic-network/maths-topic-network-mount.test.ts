// src/features/maths-topic-network/maths-topic-network-mount.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('Mathematics page imports and mounts MathsTopicNetwork', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ MathsTopicNetwork \} from ['"]@\/features\/maths-topic-network\/MathsTopicNetwork['"]/);
  assert.match(source, /<MathsTopicNetwork\s*\/>/);
});
