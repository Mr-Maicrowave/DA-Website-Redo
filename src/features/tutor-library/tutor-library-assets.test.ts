import assert from 'node:assert/strict';
import test from 'node:test';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { createTutorBookEditions } from './tutor-library-data.ts';
import {
  createTutorLibraryAssetWarmup,
  getInitialTutorLibraryAssetUrls,
  TUTOR_LIBRARY_REVEAL_TIMEOUT_MS,
} from './tutor-library-assets.ts';

test('warms fonts and visible portraits once even when several books request readiness', async () => {
  const calls: string[] = [];
  let releaseFonts!: () => void;
  let releaseImages!: () => void;
  const fonts = new Promise<void>(resolve => { releaseFonts = resolve; });
  const images = new Promise<void>(resolve => { releaseImages = resolve; });
  const warm = createTutorLibraryAssetWarmup(['/teachers/amy.png', '/teachers/king.png'], {
    loadFonts: () => { calls.push('fonts'); return fonts; },
    loadImage: url => { calls.push(url); return images; },
    waitForTimeout: () => new Promise(() => undefined),
  });

  const first = warm();
  const second = warm();
  assert.equal(first, second, 'concurrent callers share one warmup promise');
  assert.deepEqual(calls, ['fonts', '/teachers/amy.png', '/teachers/king.png']);

  releaseFonts();
  releaseImages();
  assert.deepEqual(await first, { timedOut: false });
});

test('releases the loading surface after the bounded timeout while work continues', async () => {
  const warm = createTutorLibraryAssetWarmup(['/teachers/amy.png'], {
    loadFonts: () => new Promise(() => undefined),
    loadImage: () => new Promise(() => undefined),
    waitForTimeout: async () => undefined,
  });

  assert.deepEqual(await warm(), { timedOut: true });
});

test('keeps the default reveal ceiling short enough to avoid a stalled-feeling loader', () => {
  assert.equal(TUTOR_LIBRARY_REVEAL_TIMEOUT_MS, 2200);
});

test('preloads only unique portrait assets for the initial Primary shelf', () => {
  const urls = getInitialTutorLibraryAssetUrls(createTutorBookEditions(TUTORS), TUTORS);

  assert.ok(urls.length > 0);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every(url => url.startsWith('/teachers/') && url.endsWith('.png')));
  const primaryTutorIds = new Set(createTutorBookEditions(TUTORS).filter(edition => edition.wallId === 'primary').map(edition => edition.tutorId));
  assert.equal(urls.length, primaryTutorIds.size);
});
