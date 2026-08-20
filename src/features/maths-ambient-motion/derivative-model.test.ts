import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleDerivativeModel } from './derivative-model.ts';

test('samples one function and its analytical derivative on the same x positions', () => {
  const samples = sampleDerivativeModel(9);

  assert.equal(samples.length, 9);
  assert.equal(samples[0].x, -1.6);
  assert.equal(samples.at(-1)?.x, 1.6);
  assert.ok(samples.every((sample, index) => index === 0 || sample.x > samples[index - 1].x));

  for (const sample of samples) {
    const expectedY = sample.x ** 3 - 3 * sample.x;
    const expectedDerivative = 3 * sample.x ** 2 - 3;
    assert.ok(Math.abs(sample.y - expectedY) < 1e-10);
    assert.ok(Math.abs(sample.derivative - expectedDerivative) < 1e-10);
  }
});

test('requires at least two samples to define a visible interval', () => {
  assert.throws(() => sampleDerivativeModel(1), /at least two/i);
});
