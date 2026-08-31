import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('builds Newton orchard from one clean background and reusable transparent apples', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /apple-tree-background-clean\.png/);
  assert.match(source, /\/images\/newton-apples\/apple-red\.png/);
  assert.match(source, /\/images\/newton-apples\/apple-gold\.png/);
  assert.match(source, /\/images\/newton-apples\/apple-green\.png/);
  assert.doesNotMatch(source, /newton-apple-cover/);
  assert.doesNotMatch(source, /newton-apple__sprite/);
  assert.doesNotMatch(source, /background-image: url\('\/images\/apple-tree-background\.png'\)/);
});

test('reserves the low-hanging apple for the scroll story rather than duplicating it as a click control', () => {
  const source = readFileSync(pageUrl, 'utf8');
  const appleIds = source.match(/id: '[a-z-]+', (?:branch: \[\d+, \d+\], )?sourceX:/g) ?? [];
  const mobileApples = source.match(/mobileVisible: true/g) ?? [];

  assert.equal(appleIds.length, 6);
  assert.equal(mobileApples.length, 1);
  assert.match(source, /asset: 'red'/);
  assert.match(source, /asset: 'gold'/);
  assert.match(source, /asset: 'green'/);
  assert.match(source, /Drop apple \$\{index \+ 1\} and reveal a science fact/);
  assert.match(source, /disabled=\{Boolean\(fallingApple\)\}/);
});

test('shares an impact-timed fall and leaves caught apples on the mapped ground', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const NEWTON_IMPACT_MS = 1420/);
  assert.match(source, /caughtAppleIds/);
  assert.match(source, /setCaughtAppleIds/);
  assert.match(source, /newton-grounded-apple/);
  assert.match(source, /@keyframes newtonAppleFall/);
  assert.match(source, /scaleX\(1\.08\) scaleY\(\.88\)/);
  assert.doesNotMatch(source, /NEWTON_RESET_MS/);
  assert.doesNotMatch(source, /animation: newtonAppleRestore/);
  assert.doesNotMatch(source, /leafFall/);
});

test('styles the side note as a numbered observation card', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /Observation <span>01<\/span>/);
  assert.match(source, /newton-law-card__divider/);
  assert.match(source, /newton-law-card__corner/);
  assert.match(source, /font-family: Georgia, 'Times New Roman', serif/);
});

test('supports reduced motion, responsive visibility, and opt-in coordinate debugging', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /if \(reducedMotion\) \{\s*catchApple\(appleId\);/);
  assert.match(source, /new URLSearchParams\(window\.location\.search\)\.get\('newtonDebug'\) === '1'/);
  assert.match(source, /className="newton-debug"/);
  assert.match(source, /mobileVisible/);
  assert.match(source, /aria-live="polite"/);
});

test('removes clipped apples from the keyboard and accessibility trees', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /new ResizeObserver\(updateAppleVisibility\)/);
  assert.match(source, /tabIndex=\{isInteractive \? 0 : -1\}/);
  assert.match(source, /aria-hidden=\{!isInteractive\}/);
});

test('keeps the scroll-story tree plane at its original mobile origin', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene \{[\s\S]*?position: relative;[\s\S]*?inset: auto;/);
  assert.match(source, /\.newton-tree-layer \{\s*right: -10%;\s*top: 0;\s*bottom: auto;/);
  assert.doesNotMatch(source, /--tree-vertical-offset/);
  assert.match(source, /\.newton-fact \{[\s\S]*?left: 16px;[\s\S]*?right: 16px;[\s\S]*?bottom: 16px;/);
  assert.match(source, /\.newton-apple\[hidden\] \{\s*display: none;/);
  assert.match(source, /\.newton-click-note \{[\s\S]*?left: 32%;[\s\S]*?top: 38%;/);
  assert.match(source, /\.newton-click-note svg \{[\s\S]*?transform: rotate\(-35deg\);/);
  assert.match(source, /\.newton-scene \{[\s\S]*?min-height: 460px;/);
  assert.match(source, /const fallY = isMobile \? Math\.min\(NEWTON_GROUND_CONTACT_Y\[apple\.id\] - apple\.sourceY, 650 - apple\.sourceY\) : NEWTON_GROUND_CONTACT_Y\[apple\.id\] - apple\.sourceY;/);
});

test('uses motion rather than a circular hover outline to reveal apple interactivity', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const \[hasInteracted, setHasInteracted\] = useState\(false\)/);
  assert.match(source, /setHasInteracted\(true\)/);
  assert.match(source, /is-discovery-cue/);
  assert.match(source, /@keyframes newtonAppleDiscoveryCue/);
  assert.doesNotMatch(source, /\.newton-apple::before/);
  assert.doesNotMatch(source, /\.newton-apple:hover:not\(:disabled\)::before/);
  assert.match(source, /\.newton-apple:focus-visible\s*\{[\s\S]*?outline: 3px solid/);
});

test('renders the fact as a responsive archival parchment folio', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /className="newton-fact__catalogue"/);
  assert.match(source, /factCatalogueNumber\(activeFact\)/);
  assert.match(source, /SCIENCE_FACTS\.findIndex\(\(candidate\) => candidate\.title === fact\.title\)/);
  assert.doesNotMatch(source, /SCIENCE_FACTS\.indexOf\(fact\)/);
  assert.match(source, /formatFactTitle\(activeFact\.title\)/);
  assert.match(source, /\.newton-fact\s*\{[\s\S]*?clip-path: polygon/);
  assert.match(source, /\.newton-fact::before/);
  assert.match(source, /\.newton-fact__title\s*\{[\s\S]*?font-family: Georgia/);
  assert.doesNotMatch(source, /className="newton-fact__icon"/);
  assert.doesNotMatch(source, /backdrop-filter: blur\(20px\)/);
});

test('keeps the click instruction visible in the empty sky left of the tree', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /\.newton-click-note \{[\s\S]*?left: clamp\(390px, 32vw, 490px\);[\s\S]*?top: 38%;/);
  assert.match(source, /@media \(max-width: 1024px\)[\s\S]*?\.newton-click-note \{[\s\S]*?left: clamp\(390px, 32vw, 490px\);[\s\S]*?top: 40%;/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-click-note \{[\s\S]*?left: 32%;[\s\S]*?top: 38%;/);
  assert.match(source, /className="newton-click-note" aria-hidden="true">/);
  assert.doesNotMatch(source, /\{!activeFact && \(\s*<div className="newton-click-note"/);
  assert.match(source, /className=\{`newton-scene\$\{activeFact \? ' has-active-fact' : ''\}`\}/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene\.has-active-fact \{[\s\S]*?min-height: 700px;/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene\.has-active-fact \.newton-fact \{[\s\S]*?top: 230px;[\s\S]*?bottom: auto;/);
});

test('fades the orchard instruction before the microscope aperture takes over', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /<motion\.div\s+style=\{reducedMotion \? undefined : \{ opacity: storyContentOpacity \}\}\s+className="newton-click-note"/);
});

test('appends a DOM-measured orchard camera after a continuously visible Newton fall', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const NEWTON_FALL_PROGRESS_END = 16 \/ 25/);
  assert.match(source, /const NEWTON_SCROLL_APPLE_FALL_DISTANCE = NEWTON_GROUND_CONTACT_Y\[NEWTON_SCROLL_APPLE\.id\] - NEWTON_SCROLL_APPLE\.sourceY/);
  assert.match(source, /`calc\(\$\{NEWTON_SCROLL_APPLE_FALL_DISTANCE \/ NEWTON_ARTWORK_WIDTH\} \* var\(--tree-width\)\)`/);
  assert.match(source, /const fallProgress = useTransform\(storyProgress, \[0, NEWTON_FALL_PROGRESS_END\], \[0, 1\]\)/);
  assert.match(source, /const NEWTON_SCROLL_APPLE_FALL_STEP = \(fraction: number\) =>/);
  assert.match(source, /const storyAppleY = useTransform\(fallProgress, \[0, \.22, \.38, \.54, \.68, \.8, \.9, 1\], \['0px', NEWTON_SCROLL_APPLE_FALL_STEP\(\.06\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.18\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.34\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.54\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.72\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.88\), NEWTON_SCROLL_APPLE_GROUND_Y\]\)/);
  assert.match(source, /const orchardCameraRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(source, /scrollAppleRef\.current\?\.getBoundingClientRect\(\)/);
  assert.match(source, /const orchardCameraLayer = orchardCameraRef\.current;[\s\S]*?orchardCameraLayer\.getBoundingClientRect\(\)/);
  assert.match(source, /minimumCoverScale = Math\.max/);
  assert.match(source, /cameraScale: minimumCoverScale \* 1\.03/);
  assert.match(source, /className="newton-camera-translate"/);
  assert.match(source, /className="newton-camera-scale"/);
  assert.match(source, /className="newton-handoff-lens"/);
  assert.doesNotMatch(source, /finalCameraCorrection/);
  assert.doesNotMatch(source, /lensEntryX/);
  assert.doesNotMatch(source, /lensEntryY/);
  assert.doesNotMatch(source, /lensFrameRef/);
  assert.match(source, /This apple falls as you scroll/);
  assert.match(source, /className="newton-grounded-apple"/);
  assert.doesNotMatch(source, /newton-catch-basket/);
  assert.doesNotMatch(source, /newton-story-basket/);
});

test('keeps the scroll apple non-interactive while Programs continues from the established lens', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /id: 'upper-centre-right',[\s\S]*?scrollOnly: true/);
  assert.match(source, /id: 'upper-centre-right',[\s\S]*?asset: 'green'/);
  assert.match(source, /const NEWTON_SCROLL_APPLE = NEWTON_APPLES\.find\(\(apple\) => apple\.scrollOnly\)!/);
  assert.match(source, /const lensEntryScale = 1;/);
  assert.match(source, /const lensEntryOpacity = 1;/);
  assert.match(source, /const lensBackdropOpacity = 1;/);
  assert.match(source, /const lensMediaOpacity = 1;/);
  assert.match(source, /science-eyepiece science-lens-reveal absolute left-1\/2 top-\[27%\][^\"]*xl:top-1\/2/);
  assert.doesNotMatch(source, /lg:-mt-\[100svh\]/);
  assert.doesNotMatch(source, /document\.querySelector<HTMLElement>\('\.science-story-apple'\)/);
  assert.doesNotMatch(source, /science-story-landing-target/);
  assert.match(source, /NEWTON_APPLES\.filter\(\(apple\) => !apple\.scrollOnly && apple\.id !== 'mid-low-red'\)/);
  assert.match(source, /const fallX = 0;/);
  assert.match(source, /\['0px', NEWTON_SCROLL_APPLE_FALL_STEP\(\.06\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.18\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.34\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.54\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.72\), NEWTON_SCROLL_APPLE_FALL_STEP\(\.88\), NEWTON_SCROLL_APPLE_GROUND_Y\]/);
  assert.doesNotMatch(source, /storyPushScale/);
  assert.match(source, /fallRotation: -40/);
  assert.match(source, /fallRotation: -48/);
  assert.match(source, /sourceX: 1060/);
});

test('continues the established orchard lens directly into the scale investigation', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /id="science-pathways"[^>]*className="relative z-10 -mt-\[100svh\]/);
  assert.match(source, /const handoffLensScale = useTransform\(storyProgress, \[\.88, \.96, 1\], \[\.16, 1, 1\]\)/);
  assert.match(source, /const appleScale = useTransform\(scrollYProgress, \[0, \.12, \.18\], \[1, 1\.12, 2\.35\]\)/);
  assert.match(source, /const macroOpacity = useTransform\(scrollYProgress, \[\.1, \.145, \.15, \.485, \.50, \.52\], \[0, 0, 1, 1, 0, 0\]\)/);
  assert.doesNotMatch(source, /const appleScale = useTransform\(scrollYProgress, \[0, \.25, \.31\], \[1, 1, 2\.35\]\)/);
});
