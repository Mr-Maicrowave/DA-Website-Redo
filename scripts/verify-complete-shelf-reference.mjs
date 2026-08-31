import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:8080';
const routeBase = `${baseUrl.replace(/\/$/, '')}/dev/complete-shelf-reference`;
const expectedHash = '6c8794d5d4893be532bc2b166495897d0d637fd838d17c919d8800feb7c6f438';

for (const route of [routeBase, `${routeBase}/`]) {
  const response = await fetch(route);
  assert.equal(response.status, 200, `Expected ${route} to resolve`);
  assert.match(response.headers.get('content-type') ?? '', /^text\/html/);

  const source = Buffer.from(await response.arrayBuffer());
  const actualHash = createHash('sha256').update(source).digest('hex');
  assert.equal(actualHash, expectedHash, 'The served checkpoint must remain byte-identical to the pinned upstream index.html');
}

console.log(`Complete Shelf reference route passed: ${routeBase}`);
