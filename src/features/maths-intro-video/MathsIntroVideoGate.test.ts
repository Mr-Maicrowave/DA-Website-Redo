import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./MathsIntroVideoGate.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('locks the document until an immediate skip, completion, or playback failure', () => {
  assert.equal(existsSync(componentUrl), true, 'MathsIntroVideoGate.tsx must define the route-entry gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const \[isOpen, setIsOpen\] = useState\(true\)/);
  assert.match(source, /createPortal/);
  assert.match(source, /z-\[10000\]/);
  assert.match(source, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(source, /\n\s*muted\n/);
  assert.match(source, /onEnded=\{dismiss\}/);
  assert.match(source, /onError=\{dismiss\}/);
  assert.match(source, />\s*Skip intro\s*</);
});

test('fills the viewport and fades away instead of disappearing abruptly', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /object-cover/);
  assert.match(source, /const \[isClosing, setIsClosing\] = useState\(false\)/);
  assert.match(source, /transition-opacity duration-500/);
  assert.match(source, /setTimeout\(\(\) => setIsOpen\(false\), 500\)/);
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
