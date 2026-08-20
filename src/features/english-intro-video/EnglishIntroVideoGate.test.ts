import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./EnglishIntroVideoGate.tsx', import.meta.url);
const stateUrl = new URL('./english-intro-visit-state.ts', import.meta.url);
const englishUrl = new URL('../../pages/subjects/English.tsx', import.meta.url);
const videoUrl = new URL('../../../public/english_intro_video.mp4', import.meta.url);

test('defines the full-screen English video gate', () => {
  assert.equal(existsSync(componentUrl), true, 'EnglishIntroVideoGate.tsx must define the English route gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /shouldShowEnglishIntroOnThisAppLoad/);
  assert.match(source, /src="\/english_intro_video\.mp4"/);
  assert.match(source, /object-cover/);
  assert.match(source, /transition-opacity duration-500/);
  assert.match(source, /setTimeout\(\(\) => setIsOpen\(false\), 500\)/);
  assert.match(source, />\s*Skip intro\s*</);
});

test('shows once per app load, then stays dismissed across client-side route returns', async () => {
  assert.equal(existsSync(stateUrl), true, 'english-intro-visit-state.ts must own app-load scoped replay state');

  const visitState = await import(`${stateUrl.href}?case=${Date.now()}`);

  assert.equal(visitState.shouldShowEnglishIntroOnThisAppLoad(), true);
  visitState.markEnglishIntroPlayedThisAppLoad();
  assert.equal(visitState.shouldShowEnglishIntroOnThisAppLoad(), false);
});

test('mounts the English intro gate on the English page', () => {
  const englishSource = readFileSync(englishUrl, 'utf8');

  assert.match(englishSource, /import \{ EnglishIntroVideoGate \}/);
  assert.match(englishSource, /<EnglishIntroVideoGate\s*\/>/);
});

test('ships the supplied English intro video as a public asset', () => {
  assert.equal(existsSync(videoUrl), true, 'public/english_intro_video.mp4 must be available to the English gate');
});
