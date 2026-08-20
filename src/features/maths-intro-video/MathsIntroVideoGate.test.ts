import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./MathsIntroVideoGate.tsx', import.meta.url);
const stateUrl = new URL('./maths-intro-visit-state.ts', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('locks the document until an immediate skip, completion, or playback failure', () => {
  assert.equal(existsSync(componentUrl), true, 'MathsIntroVideoGate.tsx must define the route-entry gate');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /shouldShowMathsIntroOnThisAppLoad/);
  assert.match(source, /useState\(shouldShowMathsIntroOnThisAppLoad\)/);
  assert.match(source, /createPortal/);
  assert.match(source, /z-\[10000\]/);
  assert.match(source, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(source, /\n\s*muted\n/);
  assert.match(source, /onEnded=\{dismiss\}/);
  assert.match(source, /onError=\{dismiss\}/);
  assert.match(source, />\s*Skip intro\s*</);
  assert.match(source, /if \(event\.key === 'Escape'\) dismiss\(\);/);
});

test('shows once per app load, then stays dismissed across client-side route returns', async () => {
  assert.equal(existsSync(stateUrl), true, 'maths-intro-visit-state.ts must own app-load scoped replay state');

  const visitState = await import(`${stateUrl.href}?case=${Date.now()}`);

  assert.equal(visitState.shouldShowMathsIntroOnThisAppLoad(), true);
  visitState.markMathsIntroPlayedThisAppLoad();
  assert.equal(visitState.shouldShowMathsIntroOnThisAppLoad(), false);
});

test('persists dismissal beyond the in-memory flag and skips for reduced-motion, without crashing outside a browser', async () => {
  // This file has no window/sessionStorage/matchMedia — asserting the module still
  // loads and behaves is the regression guard for the Node-test environment.
  const visitState = await import(`${stateUrl.href}?case=${Date.now()}`);
  assert.equal(typeof visitState.shouldShowMathsIntroOnThisAppLoad(), 'boolean');

  const source = readFileSync(stateUrl, 'utf8');
  assert.match(source, /sessionStorage/, 'must persist beyond a single in-memory flag so a hard refresh does not replay the video');
  assert.match(source, /prefers-reduced-motion/, 'must not autoplay for users who have asked for reduced motion');
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
