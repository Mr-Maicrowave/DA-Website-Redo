import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../pages/WhyChooseDA.tsx', import.meta.url), 'utf8');
const component = await readFile(new URL('./WeTransformSection.tsx', import.meta.url), 'utf8').catch(() => '');
const data = await readFile(new URL('./transformStories.ts', import.meta.url), 'utf8').catch(() => '');
const styles = await readFile(new URL('./WeTransformSection.css', import.meta.url), 'utf8').catch(() => '');

test('inserts We Transform between We Care and We Succeed', () => {
  assert.match(page, /<WeCareFilmSection\s*\/>[\s\S]*<WeTransformSection\s*\/>[\s\S]*<WeSucceedSection\s*\/>/);
});

test('defines five path-only media-ready stories', () => {
  assert.equal((data.match(/videoSrc:\s*'\/videos\/why-da-transform\//g) ?? []).length, 5);
  assert.match(data, /ben-elite\.mp4[\s\S]*dee-elite\.mp4[\s\S]*hsc-transformation\.mp4[\s\S]*isabella-elite\.mp4[\s\S]*jivanta-elite\.mp4/);
  assert.equal((data.match(/poster:\s*'\/videos\/why-da-transform\//g) ?? []).length, 5);
  assert.match(data, /confidence[\s\S]*foundations[\s\S]*independence[\s\S]*progress[\s\S]*ambition/);
  assert.match(data, /objectPositionDesktop[\s\S]*objectPositionTablet[\s\S]*objectPositionMobile/);
  assert.doesNotMatch(data, /https?:\/\/|unsplash|stock|generated/i);
});

test('renders the approved five-panel composition with story 03 active by default', () => {
  assert.match(component, /data-testid="why-da-transform"/);
  assert.match(component, /04 \/[\s\S]*WE TRANSFORM/);
  assert.match(component, /Change looks different[\s\S]*everyone/);
  assert.match(component, /Five stories\. Five different journeys\./);
  assert.match(component, /useState\(2\)/);
  assert.match(component, /VIDEO \{story\.number\} PENDING/);
  assert.match(styles, /grid-template-columns/);
  assert.match(styles, /--transform-tracks/);
});

test('supports pointer, buttons, keyboard, progress, and responsive scroll snap', () => {
  assert.match(component, /onPointerEnter/);
  assert.match(component, /activatePrevious/);
  assert.match(component, /activateNext/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /ArrowRight/);
  assert.match(component, /transform-progress__indicator/);
  assert.match(styles, /scroll-snap-type:\s*x mandatory/);
  assert.match(styles, /scroll-snap-align:\s*center/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test('provides a placeholder-safe accessible inline viewer contract', () => {
  assert.match(component, /role="dialog"/);
  assert.match(component, /aria-modal="true"/);
  assert.match(component, /if \(!story\.videoSrc\) return/);
  assert.match(component, /Escape/);
  assert.match(component, /Pause story video/);
  assert.match(component, /Mute story video/);
  assert.match(component, /track kind="captions"/);
});

test('lets active story controls receive clicks instead of the panel selector overlay', () => {
  assert.match(styles, /\.transform-panel\.is-active \.transform-panel__select\s*\{[^}]*pointer-events:\s*none/);
});
