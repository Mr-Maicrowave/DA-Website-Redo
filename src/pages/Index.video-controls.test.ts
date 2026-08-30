import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./Index.tsx', import.meta.url);

test('keeps the full homepage video above following content during its scroll span', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /height: '190vh', position: 'relative', zIndex: 20/);
  assert.match(source, /position: 'sticky' as const, top: 0, height: '100vh'/);
  assert.match(source, /const cardScale = useTransform\(s, \[0, 0\.40, 0\.65, 1\.0\], \[0\.40, 0\.68, 0\.88, 1\.0\]\)/);
  assert.match(source, /const sOp\s*= useTransform\(s, \[0\.30, 0\.48, 0\.70, 0\.88\], \[0, 1, 1, 0\]\)/);
  assert.match(source, /z-index:1000!important/);
});

test('provides play pause and seek controls for the homepage video', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /aria-label=\{isPlaying \? 'Pause video' : 'Play video'\}/);
  assert.match(source, /aria-label="Video progress"/);
  assert.match(source, /type="range"/);
});

test('starts the homepage video with sound available by default and lets visitors mute it', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /const \[isMuted, setIsMuted\] = useState\(false\)/);
  assert.match(source, /video\.muted = false;[\s\S]*video\.play\(\)\.catch\(\(\) => \{[\s\S]*video\.muted = true;[\s\S]*setIsMuted\(true\);/);
  assert.match(source, /aria-label=\{isMuted \? 'Turn video sound on' : 'Mute video'\}/);
  assert.match(source, /<span>\{isMuted \? 'Sound on' : 'Mute'\}<\/span>/);
});

test('holds supporting portraits at full strength through the navy scene and withholds scrub controls until the video fills its frame', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /const sOp\s*= useTransform\(s, \[0\.30, 0\.48, 0\.70, 0\.88\], \[0, 1, 1, 0\]\)/);
  assert.match(source, /const \[isVideoFullyInFrame, setIsVideoFullyInFrame\] = useState\(false\)/);
  assert.match(source, /const next = progress >= 0\.98/);
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

test('removes the supporting corner portraits when the floating player is expanded', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /\{!isExpanded && SCARDS\.map\(card => \(/);
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
