import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./Index.tsx', import.meta.url);

test('keeps the full homepage video above following content during its scroll span', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /height: '155vh', position: 'relative', zIndex: 20/);
  assert.match(source, /position: 'sticky' as const, top: 0, height: '100vh'/);
  assert.match(source, /const cardScale = useTransform\(s, \[0, 0\.28, 0\.55, 0\.82\], \[0\.58, 0\.76, 0\.92, 1\.0\]\)/);
  assert.match(source, /z-index:1000!important/);
});

test('provides play pause and seek controls for the homepage video', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /aria-label=\{isPlaying \? 'Pause video' : 'Play video'\}/);
  assert.match(source, /aria-label="Video progress"/);
  assert.match(source, /type="range"/);
});

test('keeps the homepage video unmuted and paused if audible autoplay is blocked', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /const \[isPlaying, setIsPlaying\] = useState\(false\)/);
  assert.match(source, /const \[isMuted, setIsMuted\] = useState\(false\)/);
  assert.doesNotMatch(source, /<video[^>]+autoPlay/);
  assert.match(source, /if \(e\.isIntersecting && !hasEnteredSectionRef\.current\)/);
  assert.match(source, /hasEnteredSectionRef\.current = true;[\s\S]*video\.muted = false;[\s\S]*video\.play\(\)\.catch\(\(\) => setIsPlaying\(false\)\)/);
  assert.doesNotMatch(source, /video\.muted = true/);
  assert.doesNotMatch(source, /setIsMuted\(true\)/);
  assert.match(source, /aria-label=\{isMuted \? 'Turn video sound on' : 'Mute video'\}/);
  assert.match(source, /<span>\{isMuted \? 'Sound on' : 'Mute'\}<\/span>/);
});

test('uses a direct video entrance with no supporting portrait sequence', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.doesNotMatch(source, /SCARDS/);
  assert.doesNotMatch(source, /da-scard/);
  assert.doesNotMatch(source, /threegirls\.jpg|highfive\.jpg|theboys\.jpg|environment-young-student\.png/);
  assert.match(source, /const \[isVideoFullyInFrame, setIsVideoFullyInFrame\] = useState\(false\)/);
  assert.match(source, /const next = progress >= 0\.82/);
  assert.match(source, /isVisible=\{isSimple \|\| isFloating \|\| isExpanded \|\| isVideoFullyInFrame\}/);
});

test('expands the floating player directly, allows it to move, and keeps later calls to action moving forward', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /const \[isExpanded, setIsExpanded\] = useState\(false\)/);
  assert.match(source, /setIsExpanded\(true\)/);
  assert.doesNotMatch(source, /outerRef\.current\?\.scrollIntoView/);
  assert.match(source, /is-expanded/);
  assert.match(source, /onPointerDown=\{handleFloatingPointerDown\}/);
  assert.match(source, /href="#closing-cta"/);
  assert.match(source, /id="closing-cta"/);
  assert.doesNotMatch(source, /Cream → Navy gradient transition/);
});

test('keeps the floating player visually unframed while preserving its soft separation shadow', () => {
  const source = readFileSync(indexUrl, 'utf8');
  const floatingRule = source.match(/\.da-video-wrapper\.is-floating\{[^\n]+/);

  assert.ok(floatingRule, 'the floating player must have a dedicated visual rule');
  assert.match(floatingRule[0], /border:0!important;/);
  assert.match(floatingRule[0], /box-shadow:0 14px 32px rgba\(2,12,27,\.22\)!important/);
  assert.doesNotMatch(floatingRule[0], /border:1px solid/);
});

test('presents school reach without allowing the achievement path to cross mobile copy', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /target: 125,[\s\S]*label: 'Schools'/);
  assert.match(source, /caption: 'STUDENTS FROM 125\+ SCHOOLS'/);
  assert.match(source, /target: 125,[\s\S]*x: 75, y: 7/);
  assert.match(source, /scale\(1 -1\)/);
  assert.match(source, /\.ach-stage::before \{\s*display: none;/);
  assert.match(source, /\.ach-brand-ghost \{[\s\S]*?right: 24px;\s*top: 18px;/);
});
