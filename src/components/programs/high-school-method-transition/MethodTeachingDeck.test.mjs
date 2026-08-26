import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const deckSource = readFileSync(
  new URL('./MethodTeachingDeck.tsx', import.meta.url),
  'utf8',
);
const detailSource = readFileSync(
  new URL('./MethodDetail.tsx', import.meta.url),
  'utf8',
);
const transitionStyles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const featureSource = `${deckSource}\n${detailSource}\n${transitionStyles}`;

test('renders the approved care-led overview and process annotation', () => {
  assert.match(deckSource, /Every student needs/);
  assert.match(deckSource, /Five steps\. One continuous learning process\./);
});

test('keeps the card deck semantic and keyboard operable', () => {
  assert.match(deckSource, /methodItems\.map/);
  assert.match(deckSource, /<button/);
  assert.match(deckSource, /aria-pressed/);
  assert.match(deckSource, /onKeyDown/);
});

test('provides one live editorial detail renderer', () => {
  assert.match(detailSource, /WHAT WE DO/);
  assert.match(detailSource, /aria-live="polite"/);
});

test('declares the expanded 42\/58 composition contract', () => {
  assert.match(featureSource, /42(?:fr|%)?\s*[/,: ]\s*58(?:fr|%)?|42\/58/);
});

test('moves the card deck with the approved Flip choreography', () => {
  assert.match(deckSource, /from ['"]gsap\/Flip['"]/);
  assert.match(deckSource, /gsap\.registerPlugin\(Flip\)/);
  assert.match(deckSource, /Flip\.getState\(/);
  assert.match(deckSource, /flushSync\(/);
  assert.match(deckSource, /gsap\.killTweensOf\(/);
  assert.match(
    deckSource,
    /Flip\.from\([\s\S]*duration:\s*0\.68[\s\S]*ease:\s*['"]power3\.inOut['"][\s\S]*absolute:\s*true[\s\S]*nested:\s*true[\s\S]*prune:\s*true/,
  );
});

test('makes the newest method selection win content animation completion', () => {
  assert.match(deckSource, /selectionTokenRef/);
  assert.match(deckSource, /\+\+selectionTokenRef\.current/);
  assert.match(deckSource, /selectionTokenRef\.current\s*!==\s*selectionToken/);
  assert.match(deckSource, /data-method-copy/);
  assert.match(deckSource, /data-method-action/);
  assert.match(deckSource, /data-method-annotation/);
});

test('uses a static reduced-motion fallback and no rotational choreography', () => {
  assert.match(deckSource, /prefers-reduced-motion:\s*reduce/);
  assert.match(deckSource, /gsap\.set\(/);
  assert.doesNotMatch(deckSource, /rotation\s*:/);
});

test('exits the complete current detail before committing the next method', () => {
  assert.match(
    deckSource,
    /const outgoingDetail[\s\S]*querySelector<HTMLElement>\(\s*['"]#hsm-method-detail['"]\s*,?\s*\)/,
  );
  assert.match(
    deckSource,
    /\.to\(\s*outgoingDetail,\s*\{[\s\S]*autoAlpha:\s*0[\s\S]*y:\s*1[0-6][\s\S]*\}\s*\)[\s\S]*\.call\(\(\)\s*=>\s*\{[\s\S]*selectionTokenRef\.current\s*!==\s*selectionToken[\s\S]*commitSelection\(\)/,
  );
  assert.match(
    deckSource,
    /const commitSelection[\s\S]*flushSync\([\s\S]*\.fromTo\(\s*detail,\s*\{\s*autoAlpha:\s*0,\s*y:\s*14\s*\}/,
  );
});

test('owns and disposes both Flip and content animations', () => {
  assert.match(deckSource, /flipAnimationRef/);
  assert.match(deckSource, /flipAnimationRef\.current\s*=\s*Flip\.from\(/);
  assert.match(deckSource, /contentTimelineRef\.current\s*=\s*(?:exitTimeline|timeline)/);
  const flipDisposals = deckSource.match(
    /killOwnedAnimation\(flipAnimationRef\)/g,
  ) ?? [];
  const contentDisposals = deckSource.match(
    /killOwnedAnimation\(contentTimelineRef\)/g,
  ) ?? [];
  assert.ok(flipDisposals.length >= 3, 'dispose Flip on change, reselection, and unmount');
  assert.ok(contentDisposals.length >= 3, 'dispose content motion on change, reselection, and unmount');
  assert.match(
    deckSource,
    /function killOwnedAnimation[\s\S]*animation\.revert\(\)[\s\S]*animation\.kill\(\)/,
  );
  assert.match(deckSource, /addEventListener\(['"]change['"]/);
  assert.match(deckSource, /removeEventListener\(['"]change['"]/);
});

test('guards stale commits and reveals while reduced motion stays fully visible', () => {
  const staleGuards = deckSource.match(
    /selectionTokenRef\.current\s*!==\s*selectionToken/g,
  ) ?? [];
  assert.ok(staleGuards.length >= 2, 'guard both the deferred commit and reveal');
  assert.match(
    deckSource,
    /if \(reducedMotion\)[\s\S]*setDetailFinal\(detail\)[\s\S]*return/,
  );
  assert.match(
    deckSource,
    /if \(reducedMotion \|\| !outgoingDetail\)\s*\{\s*commitSelection\(\);\s*return/,
  );
  assert.match(
    deckSource,
    /function setDetailFinal[\s\S]*gsap\.set\(detail,[\s\S]*autoAlpha:\s*1[\s\S]*gsap\.set\(detail\.querySelectorAll/,
  );
});
