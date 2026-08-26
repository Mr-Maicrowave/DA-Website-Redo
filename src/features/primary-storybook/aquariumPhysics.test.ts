import test from 'node:test';
import assert from 'node:assert/strict';
import { keepInBounds, markDiscovered, steerFromPointer, stepFish, type FishMotion } from './aquariumPhysics.ts';
import * as aquariumPhysics from './aquariumPhysics.ts';

const fish: FishMotion = { x: 200, y: 120, vx: 0.4, vy: 0.1, phase: 0, speed: 1 };

test('fish advances independently with a gentle vertical wander', () => {
  const next = stepFish(fish, 16);
  assert.ok(next.x > fish.x);
  assert.notEqual(next.y, fish.y);
});

test('nearby pointer steers fish away without exceeding maximum velocity', () => {
  const next = steerFromPointer(fish, { x: 220, y: 120 }, 170, 2.4);
  assert.ok(next.vx < fish.vx);
  assert.ok(Math.hypot(next.vx, next.vy) <= 2.4);
});

test('edge steering keeps fish within the aquarium', () => {
  const next = keepInBounds({ ...fish, x: 4, vx: -1 }, 800, 420, 28);
  assert.ok(next.vx > 0);
});

test('discoveries are unique and stable', () => {
  assert.deepEqual(markDiscovered(['clownfish'], 'clownfish'), ['clownfish']);
  assert.deepEqual(markDiscovered(['clownfish'], 'blue-tang'), ['clownfish', 'blue-tang']);
});

test('fish resize preserves proportional position and scales velocity with the viewport', () => {
  const resizeFishMotion = Reflect.get(aquariumPhysics, 'resizeFishMotion') as undefined | ((
    motion: FishMotion,
    previous: { width: number; height: number },
    next: { width: number; height: number },
  ) => FishMotion);

  assert.equal(typeof resizeFishMotion, 'function');
  if (!resizeFishMotion) return;

  const resized = resizeFishMotion(fish, { width: 800, height: 400 }, { width: 400, height: 800 });
  assert.equal(resized.x, 100);
  assert.equal(resized.y, 240);
  assert.equal(resized.vx, .2);
  assert.equal(resized.vy, .2);
  assert.equal(resized.phase, fish.phase);
  assert.equal(resized.speed, fish.speed);
});
