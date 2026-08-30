import assert from 'node:assert/strict';
import test from 'node:test';

import { signalInitialRoutePainted } from './initialLoader.ts';

test('initial route readiness is dispatched after two paint frames', () => {
  const scheduled: FrameRequestCallback[] = [];
  const events = new EventTarget();
  const originalWindow = globalThis.window;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  Object.defineProperty(globalThis, 'window', { configurable: true, value: events });
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      scheduled.push(callback);
      return scheduled.length;
    },
  });
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    configurable: true,
    value: () => {},
  });

  try {
    const received: string[] = [];
    events.addEventListener('da:initial-route-painted', () => received.push('ready'));

    signalInitialRoutePainted();
    assert.deepEqual(received, []);

    scheduled.shift()?.(0);
    assert.deepEqual(received, []);

    scheduled.shift()?.(16);
    assert.deepEqual(received, ['ready']);
  } finally {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: originalCancelAnimationFrame });
  }
});

test('cancelling the signal before the second frame prevents readiness', () => {
  const scheduled: FrameRequestCallback[] = [];
  const events = new EventTarget();
  const originalWindow = globalThis.window;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  Object.defineProperty(globalThis, 'window', { configurable: true, value: events });
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      scheduled.push(callback);
      return scheduled.length;
    },
  });
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    configurable: true,
    value: () => {},
  });

  try {
    let count = 0;
    events.addEventListener('da:initial-route-painted', () => count++);
    const cancel = signalInitialRoutePainted();
    scheduled.shift()?.(0);
    cancel();
    scheduled.shift()?.(16);
    assert.equal(count, 0);
  } finally {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: originalCancelAnimationFrame });
  }
});
