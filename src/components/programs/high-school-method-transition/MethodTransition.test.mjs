import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./MethodTransition.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./MethodTransition.css', import.meta.url), 'utf8');

test('uses one ScrollTrigger timeline to present the real teaching deck', () => {
  assert.match(source, /MethodDeckPresentationElements/);
  assert.match(source, /onPresentationElements=\{registerDeckElements\}/);
  assert.match(source, /const master = gsap\.timeline/);
  assert.match(source, /scrollTrigger:/);
});

test('keeps the travelling proxy in the root transition overlay above the deck layer', () => {
  assert.match(source, /<div className="hsm-transition__interaction"><MethodTeachingDeck/);
  assert.match(source, /<img className="hsm-transition__proxy" ref=\{proxyRef\}/);
  assert.match(styles, /\.hsm-transition__interaction\s*\{[^}]*z-index:\s*1/s);
  assert.match(styles, /\.hsm-transition__proxy\s*\{[^}]*z-index:\s*3/s);
});

test('waits for the complete real deck registration before timeline setup', () => {
  assert.match(source, /function hasCompletePresentationElements/);
  assert.match(source, /elements\.deck\.isConnected/);
  assert.match(source, /elements\.diagnoseMagnifier\.isConnected/);
  assert.match(source, /Object\.values\(elements\.cards\)\.every\(\(card\) => card\?\.isConnected\)/);
  assert.match(source, /const completeElements = hasCompletePresentationElements\(elements\) \? elements : null/);
  assert.match(source, /!hasCompletePresentationElements\(deckElements\)/);
});

test('uses a stable registration callback and rebuilds only for a registration lifecycle change', () => {
  assert.match(source, /const registerDeckElements = useCallback/);
  assert.match(source, /\}, \[\]\);/);
  assert.match(source, /\}, \[deckElements\]\);/);
  assert.equal((source.match(/const master = gsap\.timeline/g) ?? []).length, 1);
});

test('cleans up the timeline and restores safe deck state on unmount or remount', () => {
  assert.match(source, /master\.scrollTrigger\?\.kill\(\); master\.kill\(\);/);
  assert.match(source, /deck\.dataset\.presentation = 'idle';/);
  assert.match(source, /mounted = false; media\.revert\(\); context\.revert\(\);/);
  assert.match(source, /setDeckElements\(completeElements\);/);
});

test('does not render a decorative method card or companion row', () => {
  assert.doesNotMatch(source, /hsm-transition__card|hsm-transition__companion-card/);
  assert.doesNotMatch(styles, /hsm-transition__card|hsm-transition__companion-card/);
});

test('keeps the real Diagnose card still during docking and assembles the final row afterwards', () => {
  assert.match(source, /ENTER_START/);
  assert.match(source, /DOCK_END/);
  assert.match(source, /\.to\(proxy, \{ x: \(\) => poses\.dock\.x/);
  assert.match(source, /\.to\(diagnose, \{ x: 0, y: 0, scale: 1/);
  assert.match(source, /\.to\(secondary, \{ x: 0, y: 0, autoAlpha: 1/);
});

test('measures the real Diagnose overlay only during setup and refresh', () => {
  assert.match(source, /diagnoseMagnifier\.getBoundingClientRect\(\)/);
  assert.match(source, /onRefreshInit: measure/);
  assert.doesNotMatch(source, /onUpdate[\s\S]*diagnoseMagnifier\.getBoundingClientRect/);
});

test('keeps the proxy hidden before its travel begins', () => {
  assert.match(styles, /\.hsm-transition__proxy\s*\{[^}]*visibility:\s*hidden[^}]*opacity:\s*0/s);
});
