import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./LegalStudiesIntroVideoGate.tsx', import.meta.url);
const legalStudiesUrl = new URL('../../pages/subjects/LegalStudies.tsx', import.meta.url);
const videoUrl = new URL('../../../public/legal_intro_video.mp4', import.meta.url);

test('defines the full-screen Legal Studies video gate', () => {
  assert.equal(existsSync(componentUrl), true, 'LegalStudiesIntroVideoGate.tsx must define the Legal Studies route gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /src="\/legal_intro_video\.mp4"/);
  assert.match(source, /object-cover/);
  assert.match(source, /transition-opacity duration-500/);
  assert.match(source, /setTimeout\(\(\) => setIsOpen\(false\), 500\)/);
  assert.match(source, />\s*Skip intro\s*</);
});

test('mounts the Legal Studies intro gate on the Legal Studies page', () => {
  const legalStudiesSource = readFileSync(legalStudiesUrl, 'utf8');

  assert.match(legalStudiesSource, /import \{ LegalStudiesIntroVideoGate \}/);
  assert.match(legalStudiesSource, /<LegalStudiesIntroVideoGate\s*\/>/);
});

test('ships the supplied Legal Studies intro video as a public asset', () => {
  assert.equal(existsSync(videoUrl), true, 'public/legal_intro_video.mp4 must be available to the Legal Studies gate');
});
