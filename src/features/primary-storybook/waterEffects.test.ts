import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceRipple,
  createRipple,
  createWakeRipple,
  easeOutCubic,
  smoothPointer,
  smoothSpeed,
  type WaterPointer,
} from './waterEffects.ts';

test('water pointer follows the cursor with inertia instead of snapping', () => {
  const current: WaterPointer = { x: 0, y: 0, targetX: 100, targetY: 50, speed: 0, targetSpeed: 20 };
  const next = smoothPointer(current, 0.22);
  assert.ok(next.x > 0 && next.x < 100);
  assert.ok(next.y > 0 && next.y < 50);
});

test('pointer speed is smoothed and clamped before driving distortion', () => {
  assert.ok(Math.abs(smoothSpeed(0, 1000, 0.15, 48) - 7.2) < Number.EPSILON * 8);
  assert.ok(Math.abs(smoothSpeed(40, 1000, 0.15, 48) - 41.2) < Number.EPSILON * 32);
});

test('click ripple expands and fades over its finite lifetime', () => {
  const ripple = createRipple(120, 80, 0);
  const middle = advanceRipple(ripple, ripple.maxAge / 2);
  assert.ok(middle.radius > ripple.radius);
  assert.ok(middle.alpha < ripple.alpha);
  assert.equal(advanceRipple(ripple, ripple.maxAge).active, false);
});

test('cursor wake is shorter and softer than the click ripple', () => {
  const click = createRipple(120, 80);
  const wake = createWakeRipple(120, 80);
  assert.ok(wake.maxAge < click.maxAge);
  assert.ok(wake.alpha < click.alpha);
  assert.equal(wake.kind, 'wake');
});

test('ripple easing starts at zero and ends at one', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
});
