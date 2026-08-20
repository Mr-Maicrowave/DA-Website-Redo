import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./ScienceIntroVideoGate.tsx', import.meta.url);
const scienceUrl = new URL('../../pages/subjects/Science.tsx', import.meta.url);
const videoUrl = new URL('../../../public/science_intro_video.mp4', import.meta.url);

test('defines the full-screen Science video gate', () => {
  assert.equal(existsSync(componentUrl), true, 'ScienceIntroVideoGate.tsx must define the Science route gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /src="\/science_intro_video\.mp4"/);
  assert.match(source, /object-cover/);
  assert.match(source, /transition-opacity duration-500/);
  assert.match(source, /setTimeout\(\(\) => setIsOpen\(false\), 500\)/);
  assert.match(source, />\s*Skip intro\s*</);
});

test('mounts the Science intro gate on the Science page', () => {
  const scienceSource = readFileSync(scienceUrl, 'utf8');

  assert.match(scienceSource, /import \{ ScienceIntroVideoGate \}/);
  assert.match(scienceSource, /<ScienceIntroVideoGate\s*\/>/);
});

test('ships the supplied Science intro video as a public asset', () => {
  assert.equal(existsSync(videoUrl), true, 'public/science_intro_video.mp4 must be available to the Science gate');
});
