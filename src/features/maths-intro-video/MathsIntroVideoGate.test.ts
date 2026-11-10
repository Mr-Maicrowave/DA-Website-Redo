import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./MathsIntroVideoGate.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('locks the document until an immediate skip, completion, or playback failure', () => {
  assert.equal(existsSync(componentUrl), true, 'MathsIntroVideoGate.tsx must define the route-entry gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.doesNotMatch(source, /shouldShowMathsIntroOnThisAppLoad|markMathsIntroPlayedThisAppLoad/);
  assert.match(source, /VideoArrivalGate/);
  assert.match(source, /videoSrc="\/math_intro_video\.mp4"/);
  assert.match(source, /posterSrc="\/images\/intro-posters\/maths-intro\.jpg"/);
  assert.match(source, /subject="Mathematics"/);
});

test('renders on every Mathematics route entry', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /return <VideoArrivalGate/);
});

test('delegates the full-screen fade and loading experience to the shared gate', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /<VideoArrivalGate/);
});

test('mounts the intro gate only from the Mathematics page', () => {
  const mathematicsSource = readFileSync(mathematicsUrl, 'utf8');

  assert.match(mathematicsSource, /import \{ MathsIntroVideoGate \}/);
  assert.match(mathematicsSource, /<MathsIntroVideoGate\s*\/>/);
});

test('ships the supplied Mathematics intro video as a public asset', () => {
  const videoUrl = new URL('../../../public/math_intro_video.mp4', import.meta.url);

  assert.equal(existsSync(videoUrl), true, 'public/math_intro_video.mp4 must be available to the video gate');
});

test('ships an immediate Mathematics poster for the video prelude', () => {
  const posterUrl = new URL('../../../public/images/intro-posters/maths-intro.jpg', import.meta.url);
  assert.equal(existsSync(posterUrl), true, 'the video gate must have a real first-paint image');
});
