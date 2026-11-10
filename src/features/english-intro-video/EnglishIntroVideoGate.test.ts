import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./EnglishIntroVideoGate.tsx', import.meta.url);
const englishUrl = new URL('../../pages/subjects/English.tsx', import.meta.url);
const videoUrl = new URL('../../../public/english_intro_video.mp4', import.meta.url);

test('defines the full-screen English video gate', () => {
  assert.equal(existsSync(componentUrl), true, 'EnglishIntroVideoGate.tsx must define the English route gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.doesNotMatch(source, /shouldShowEnglishIntroOnThisAppLoad|markEnglishIntroPlayedThisAppLoad/);
  assert.match(source, /VideoArrivalGate/);
  assert.match(source, /videoSrc="\/english_intro_video\.mp4"/);
  assert.match(source, /posterSrc="\/images\/intro-posters\/english-intro\.jpg"/);
  assert.match(source, /subject="English"/);
});

test('renders on every English route entry', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /return <VideoArrivalGate/);
});

test('mounts the English intro gate on the English page', () => {
  const englishSource = readFileSync(englishUrl, 'utf8');

  assert.match(englishSource, /import \{ EnglishIntroVideoGate \}/);
  assert.match(englishSource, /<EnglishIntroVideoGate\s*\/>/);
});

test('ships the supplied English intro video as a public asset', () => {
  assert.equal(existsSync(videoUrl), true, 'public/english_intro_video.mp4 must be available to the English gate');
});

test('ships an immediate English poster for the video prelude', () => {
  const posterUrl = new URL('../../../public/images/intro-posters/english-intro.jpg', import.meta.url);
  assert.equal(existsSync(posterUrl), true, 'the video gate must have a real first-paint image');
});
