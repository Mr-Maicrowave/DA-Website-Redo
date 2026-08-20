import test from 'node:test';
import assert from 'node:assert/strict';
import { createShieldTrace } from './fourier-shield.ts';

test('creates a dense centred shield outline with matching endpoints', () => {
  const points = createShieldTrace(360);
  assert.equal(points.length, 360);
  assert.ok(Math.min(...points.map((point) => point.x)) < -70);
  assert.ok(Math.max(...points.map((point) => point.x)) > 70);
  assert.ok(Math.min(...points.map((point) => point.y)) < -100);
  assert.ok(Math.max(...points.map((point) => point.y)) > 100);
  assert.ok(Math.hypot(points[0].x - points.at(-1)!.x, points[0].y - points.at(-1)!.y) < 5);
});
