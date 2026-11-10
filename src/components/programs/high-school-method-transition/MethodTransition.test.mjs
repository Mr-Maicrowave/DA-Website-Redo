import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./MethodTransition.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./MethodTransition.css', import.meta.url), 'utf8');
const deckSource = readFileSync(new URL('./MethodTeachingDeck.tsx', import.meta.url), 'utf8');
const deckStyles = readFileSync(new URL('./MethodTeachingDeck.css', import.meta.url), 'utf8');

test('uses one reversible pinned master timeline', () => {
  assert.equal((source.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(source, /scrub:\s*true/);
  assert.match(source, /invalidateOnRefresh:\s*true/);
  assert.match(source, /onRefreshInit:\s*measure/);
  assert.match(source, /--method-transition-scroll/);
});

test('presents the real deck and removes all decorative method cards', () => {
  assert.match(source, /presentationRef\.current/);
  assert.match(source, /<MethodTeachingDeck ready=\{deckReady\} presentationRef=\{presentationRef\}/);
  assert.doesNotMatch(source, /hsm-transition__card(?:-|"|')/);
  assert.doesNotMatch(source, /methodItems/);
  assert.doesNotMatch(styles, /\.hsm-transition__card(?:\s|\{|,)/);
  assert.doesNotMatch(styles, /\.hsm-transition__companion-card/);
  assert.doesNotMatch(styles, /\.hsm-transition__card-row/);
});

test('measures one stable centred transform for the real Diagnose button', () => {
  assert.match(source, /const finalRect = diagnose\.getBoundingClientRect\(\)/);
  assert.match(source, /introTransform = \{/);
  assert.match(source, /const overlayRect = diagnoseMagnifier\.getBoundingClientRect\(\)/);
  assert.doesNotMatch(source, /yPercent:\s*115/);
  assert.doesNotMatch(source, /joinedCard|joinedGlass/);
});

test('keeps Diagnose stationary while the proxy docks, then assembles the real row', () => {
  assert.match(source, /\.to\(proxy, \{[\s\S]*poses\.dock/);
  assert.match(source, /\.to\(diagnoseMagnifier, \{ opacity: 1/);
  assert.match(source, /\.to\(diagnose, \{[\s\S]*x: 0,[\s\S]*y: 0,[\s\S]*scale: 1/);
  assert.match(source, /\.to\(siblings, \{[\s\S]*opacity: 1/);
  assert.match(source, /clearProps: 'transform,opacity,zIndex'/);
});

test('keeps deck interaction inert until the handoff completes', () => {
  assert.match(source, /progress >= METHOD_TRANSITION_TIMING\.companionsEnd/);
  assert.match(source, /setDeckReady\(nextInteractive\)/);
  assert.match(deckSource, /toggleAttribute\('inert', !ready\)/);
  assert.match(deckSource, /MethodTeachingDeckPresentation/);
  assert.match(deckSource, /data-method-transition-diagnose-overlay/);
});

test('uses the real Diagnose overlay as the proxy destination', () => {
  assert.match(deckStyles, /\.hsm-deck__diagnose-magnifier\s*\{/);
  assert.match(deckStyles, /top:\s*43%/);
  assert.match(deckStyles, /width:\s*72%/);
  assert.match(source, /poses\.dock = poseForRect\(overlayRect\)/);
});

test('preserves the source handoff and reduced-motion fallback', () => {
  assert.match(source, /data-method-transition-magnifier/);
  assert.match(source, /measureUntransformedSource/);
  assert.match(source, /finale\.style\.transform = 'none'/);
  assert.match(source, /reconcileSourceHandoffPose/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hsm-transition__center-bloom[\s\S]*display:\s*none/);
});
