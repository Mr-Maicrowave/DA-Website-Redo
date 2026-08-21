import test from 'node:test';
import assert from 'node:assert/strict';
import { resetProfileScroll } from './profileNavigation.ts';

test('returns the profile scroll container to the top without a smooth-scroll delay', () => {
  let received: ScrollToOptions | undefined;
  function scrollTo(options?: ScrollToOptions): void;
  function scrollTo(x: number, y: number): void;
  function scrollTo(optionsOrX?: ScrollToOptions | number, _y?: number) {
    if (typeof optionsOrX !== 'number') {
      received = optionsOrX;
    }
  }
  const container = { scrollTo };

  resetProfileScroll(container);

  assert.deepEqual(received, { top: 0, behavior: 'auto' });
});
