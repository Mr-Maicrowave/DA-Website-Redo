import test from 'node:test';
import assert from 'node:assert/strict';
import { resetProfileScroll } from './profileNavigation.ts';

test('returns the profile scroll container to the top without a smooth-scroll delay', () => {
  let received: ScrollToOptions | undefined;
  const container = { scrollTo: (options: ScrollToOptions) => { received = options; } };

  resetProfileScroll(container);

  assert.deepEqual(received, { top: 0, behavior: 'auto' });
});
