import assert from 'node:assert/strict';
import test from 'node:test';
import { getJourneyScrollBehavior, normaliseJourneySections } from './pageJourneyUtils.ts';

test('normaliseJourneySections preserves meaningful destinations and their explicit presentation', () => {
  const sections = normaliseJourneySections([
    { id: 'arrival', label: 'Introduction', theme: 'light' },
    { id: 'story', label: 'Learning journey', description: 'Years 1 to 6', theme: 'dark', longScroll: true },
  ]);

  assert.deepEqual(sections, [
    { id: 'arrival', label: 'Introduction', description: undefined, theme: 'light', longScroll: false },
    { id: 'story', label: 'Learning journey', description: 'Years 1 to 6', theme: 'dark', longScroll: true },
  ]);
});

test('long jumps and reduced motion bypass animated scrolling', () => {
  assert.equal(getJourneyScrollBehavior({ reducedMotion: false, longScroll: true, distance: 1600 }), 'auto');
  assert.equal(getJourneyScrollBehavior({ reducedMotion: false, longScroll: false, distance: 1600 }), 'smooth');
  assert.equal(getJourneyScrollBehavior({ reducedMotion: true, longScroll: false, distance: 80 }), 'auto');
});
