import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import {
  TUTOR_LIBRARY_AUDIO_GAIN,
  TUTOR_LIBRARY_AUDIO_MUTED_KEY,
  TUTOR_LIBRARY_AUDIO_URL,
  TUTOR_LIBRARY_AUDIO_VOLUME_KEY,
  getTutorLibraryAudioPreferences,
  getTutorLibraryPlaybackVolume,
} from './tutor-library-audio.ts';

test('the intro and bookshelf room share one cached soundtrack and preference keys', () => {
  const intro = readFileSync(new URL('../../../public/dev/complete-shelf-reference/index.html', import.meta.url), 'utf8');
  const controls = readFileSync(new URL('./TutorLibraryAudioControls.tsx', import.meta.url), 'utf8');
  const asset = new URL(`../../../public${TUTOR_LIBRARY_AUDIO_URL}`, import.meta.url);

  assert.equal(existsSync(asset), true);
  assert.match(intro, new RegExp(`music: "${TUTOR_LIBRARY_AUDIO_URL}"`));
  assert.doesNotMatch(intro, /music:\s*"data:audio\/mpeg;base64/);
  assert.match(controls, /aria-label="Tutor library sound"/);
  assert.match(controls, /aria-label="Music volume"/);
  assert.equal(TUTOR_LIBRARY_AUDIO_VOLUME_KEY, 'complete-shelf-audio-volume');
  assert.equal(TUTOR_LIBRARY_AUDIO_MUTED_KEY, 'complete-shelf-audio-muted');
});

test('audio preferences are validated and playback uses the same restrained gain as the intro', () => {
  const storage = new Map([
    [TUTOR_LIBRARY_AUDIO_VOLUME_KEY, '0.8'],
    [TUTOR_LIBRARY_AUDIO_MUTED_KEY, 'true'],
  ]);
  const preferences = getTutorLibraryAudioPreferences({ getItem: key => storage.get(key) ?? null });

  assert.deepEqual(preferences, { volume: 0.8, muted: true });
  assert.equal(TUTOR_LIBRARY_AUDIO_GAIN, 0.24);
  assert.equal(getTutorLibraryPlaybackVolume(0.8, false), 0.192);
  assert.equal(getTutorLibraryPlaybackVolume(0.8, true), 0);
  assert.deepEqual(getTutorLibraryAudioPreferences({ getItem: () => 'not-a-number' }), { volume: 0.55, muted: false });
});
