import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./BusinessStudiesIntroVideoGate.tsx', import.meta.url);
const businessStudiesUrl = new URL('../../pages/subjects/BusinessStudies.tsx', import.meta.url);
const videoUrl = new URL('../../../public/business_intro_video.mp4', import.meta.url);

test('defines the full-screen Business Studies video gate', () => {
  assert.equal(existsSync(componentUrl), true, 'BusinessStudiesIntroVideoGate.tsx must define the Business Studies route gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /VideoArrivalGate/);
  assert.match(source, /videoSrc="\/business_intro_video\.mp4"/);
  assert.match(source, /posterSrc="\/images\/intro-posters\/business-intro\.jpg"/);
  assert.match(source, /subject="Business Studies"/);
});

test('mounts the Business Studies intro gate on the Business Studies page', () => {
  const businessStudiesSource = readFileSync(businessStudiesUrl, 'utf8');

  assert.match(businessStudiesSource, /import \{ BusinessStudiesIntroVideoGate \}/);
  assert.match(businessStudiesSource, /<BusinessStudiesIntroVideoGate\s*\/>/);
});

test('ships the supplied Business Studies intro video as a public asset', () => {
  assert.equal(existsSync(videoUrl), true, 'public/business_intro_video.mp4 must be available to the Business Studies gate');
});

test('ships an immediate Business Studies poster for the video prelude', () => {
  const posterUrl = new URL('../../../public/images/intro-posters/business-intro.jpg', import.meta.url);
  assert.equal(existsSync(posterUrl), true, 'the video gate must have a real first-paint image');
});
