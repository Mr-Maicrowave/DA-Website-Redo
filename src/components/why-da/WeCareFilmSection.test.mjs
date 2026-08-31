import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../pages/WhyChooseDA.tsx', import.meta.url), 'utf8');
const component = await readFile(new URL('./WeCareFilmSection.tsx', import.meta.url), 'utf8').catch(() => '');
const data = await readFile(new URL('./careMoments.ts', import.meta.url), 'utf8').catch(() => '');
const styles = await readFile(new URL('./WeCareFilmSection.css', import.meta.url), 'utf8').catch(() => '');

test('replaces only the legacy care chapter with the reusable film section', () => {
  assert.match(page, /<WeCareFilmSection\s*\/>/);
  assert.doesNotMatch(page, /why-da-care__image|why-da-care__values|why-da-care__promise/);
  assert.match(component, /data-testid="why-da-care"/);
});

test('keeps every care photograph path-only and independently crop-tunable', () => {
  assert.equal((data.match(/image:\s*null/g) ?? []).length, 0);
  for (const id of ['listen', 'notice', 'reassure', 'encourage', 'celebrate']) {
    assert.match(data, new RegExp(`image:\\s*'\\/assets\\/why-da\\/care-${id}\\.png'`));
  }
  assert.match(data, /image:\s*'\/assets\/why-da\/care-final-tutor-student\.png'/);
  assert.match(data, /Tutor supporting a student during a DA Tuition lesson/);
  assert.match(data, /LISTEN[\s\S]*NOTICE[\s\S]*REASSURE[\s\S]*ENCOURAGE[\s\S]*CELEBRATE/);
  assert.match(data, /objectPositionDesktop[\s\S]*objectPositionTablet[\s\S]*objectPositionMobile/);
  assert.doesNotMatch(data, /https?:\/\/|unsplash|stock|generated/i);
  assert.match(component, /PHOTO PENDING/);
  assert.match(component, /FINAL PHOTO PENDING/);
});

test('runs a seamless duplicated film with physical slowdown and accessible reduced motion', () => {
  assert.match(component, /careMoments\.map/g);
  assert.match(component, /playbackRate/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(styles, /translate3d/);
  assert.match(styles, /will-change:\s*transform/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /overflow-x:\s*auto/);
});

test('uses the approved editorial copy and chapter handoff', () => {
  assert.match(component, /Sometimes, they don’t[\s\S]*need another explanation/);
  assert.match(component, /They need someone to notice/);
  assert.match(component, /What they learn matters/);
  assert.match(component, /How they[\s\S]*feel while[\s\S]*learning[\s\S]*matters too/);
  assert.match(component, /04 \/[\s\S]*WE TRANSFORM/);
  assert.doesNotMatch(component, /WE STAY CONNECTED/);
});

test('shows the complete final care photograph without cropping or push-in', () => {
  assert.match(styles, /\.care-photo--final\s*\{[^}]*aspect-ratio:\s*1\.41\/1/);
  assert.match(styles, /\.care-photo--final img\s*\{[^}]*object-fit:\s*contain[^}]*animation:\s*none/);
});
