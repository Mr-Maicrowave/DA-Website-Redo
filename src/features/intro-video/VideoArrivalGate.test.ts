import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./VideoArrivalGate.tsx', import.meta.url);

test('keeps a branded poster visible until the opening video can play', () => {
  assert.equal(existsSync(componentUrl), true, 'VideoArrivalGate.tsx must provide the shared loading experience');

  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const \[isVideoReady, setIsVideoReady\] = useState\(false\)/);
  assert.match(source, /<img[\s\S]*src=\{posterSrc\}/);
  assert.match(source, /poster=\{posterSrc\}/);
  assert.match(source, /onCanPlay=\{\(\) => setIsVideoReady\(true\)\}/);
  assert.match(source, /isVideoReady \? 'opacity-100' : 'opacity-0'/);
  assert.match(source, /Preparing your \{subject\} introduction/);
});

test('clears the loading copy once playback is ready', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const \[isVideoReady, setIsVideoReady\] = useState\(false\)/);
  assert.match(source, /isVideoReady \|\| hasVideoError \? 'opacity-0' : 'opacity-100'/);
  assert.match(source, /onCanPlay=\{\(\) => setIsVideoReady\(true\)\}/);
});

test('removes the loading washes once the video is ready', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /bg-\[#071629\]\/70 transition-opacity duration-700 \$\{isVideoReady \? 'opacity-0' : 'opacity-100'\}/);
  assert.match(source, /bg-\[linear-gradient\([^\n]+transition-opacity duration-700 \$\{isVideoReady \? 'opacity-0' : 'opacity-100'\}/);
});

test('keeps the poster available with an explicit continue action when playback fails', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const \[hasVideoError, setHasVideoError\] = useState\(false\)/);
  assert.match(source, /onError=\{\(\) => setHasVideoError\(true\)\}/);
  assert.match(source, /Video preview unavailable/);
  assert.match(source, /Continue to \{subject\}/);
  assert.doesNotMatch(source, /onError=\{dismiss\}/);
});

test('provides a direct escape hatch while the video is still loading', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, />\s*Skip introduction\s*</);
  assert.match(source, /if \(event\.key === 'Escape'\) dismiss\(\);/);
});
