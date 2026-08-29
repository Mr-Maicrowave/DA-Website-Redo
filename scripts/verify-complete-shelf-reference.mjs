import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:8080';
const routeBase = `${baseUrl.replace(/\/$/, '')}/dev/complete-shelf-reference`;
const expectedHash = '163b4a99d34e24ce8ab205f28f1d3f1f33da216285be2c5db31422f13090b026';

for (const route of [routeBase, `${routeBase}/`]) {
  const response = await fetch(route);
  assert.equal(response.status, 200, `Expected ${route} to resolve`);
  assert.match(response.headers.get('content-type') ?? '', /^text\/html/);

  const source = Buffer.from(await response.arrayBuffer());
  const actualHash = createHash('sha256').update(source).digest('hex');
  assert.equal(actualHash, expectedHash, 'The served checkpoint must remain byte-identical to the pinned upstream index.html');
}

console.log(`Complete Shelf reference route passed: ${routeBase}`);
