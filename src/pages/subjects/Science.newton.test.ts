import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

  for (const asset of ['apple-red.png', 'apple-gold.png', 'apple-green.png']) {
    assert.equal(
      existsSync(fileURLToPath(new URL(`../../../public/images/newton-apples/${asset}`, import.meta.url))),
      true,
      `${asset} must ship with the orchard`,
    );
  }
});

test('caps the orchard at seven deterministic controls with a curated mobile subset', () => {
  const source = readFileSync(pageUrl, 'utf8');
  const appleIds = source.match(/id: '[a-z-]+', sourceX:/g) ?? [];
  const mobileApples = source.match(/mobileVisible: true/g) ?? [];

  assert.equal(appleIds.length, 7);
  assert.equal(mobileApples.length, 2);
  assert.match(source, /asset: 'red'/);
  assert.match(source, /asset: 'gold'/);
  assert.match(source, /asset: 'green'/);
  assert.match(source, /Drop apple \$\{index \+ 1\} and reveal a science fact/);
  assert.match(source, /disabled=\{Boolean\(fallingApple\)\}/);
});

test('shares an impact-timed fall and restores without reversing the apple', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const NEWTON_IMPACT_MS = 1420/);
  assert.match(source, /const NEWTON_RESET_MS = 4300/);
  assert.match(source, /@keyframes newtonAppleFall/);
  assert.match(source, /scaleX\(1\.08\) scaleY\(\.88\)/);
  assert.match(source, /animation: newtonAppleRestore/);
  assert.doesNotMatch(source, /leafFall/);
});

test('supports reduced motion, responsive visibility, and opt-in coordinate debugging', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /if \(reducedMotion\) \{\s*revealFact\(\);/);
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

test('stacks the orchard below the preserved content on mobile', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene \{[\s\S]*?position: relative;[\s\S]*?inset: auto;/);
  assert.match(source, /\.newton-tree-layer \{\s*right: -10%;\s*top: 0;\s*bottom: auto;/);
  assert.match(source, /\.newton-fact \{[\s\S]*?left: 16px;[\s\S]*?right: 16px;[\s\S]*?bottom: 16px;/);
  assert.match(source, /\.newton-apple\[hidden\] \{\s*display: none;/);
  assert.match(source, /\.newton-click-note \{[\s\S]*?left: 18px;[\s\S]*?top: 80px;/);
  assert.match(source, /\.newton-click-note svg \{[\s\S]*?transform: rotate\(-35deg\);/);
  assert.match(source, /\.newton-scene \{[\s\S]*?min-height: 460px;/);
  assert.match(source, /const fallY = isMobile \? Math\.min\(apple\.fallY, 650 - apple\.sourceY\) : apple\.fallY;/);
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
  assert.match(source, /@media \(max-width: 1024px\)[\s\S]*?\.newton-click-note \{[\s\S]*?left: clamp\(32px, 6vw, 64px\);[\s\S]*?top: 44%;/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-click-note \{[\s\S]*?left: 18px;[\s\S]*?top: 80px;/);
  assert.match(source, /<div className="newton-click-note" aria-hidden="true">/);
  assert.doesNotMatch(source, /\{!activeFact && \(\s*<div className="newton-click-note"/);
  assert.match(source, /className=\{`newton-scene\$\{activeFact \? ' has-active-fact' : ''\}`\}/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene\.has-active-fact \{[\s\S]*?min-height: 700px;/);
  assert.match(source, /@media \(max-width: 680px\)[\s\S]*?\.newton-scene\.has-active-fact \.newton-fact \{[\s\S]*?top: 230px;[\s\S]*?bottom: auto;/);
});
