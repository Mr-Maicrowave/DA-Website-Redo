import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../pages/WhyChooseDA.tsx', import.meta.url), 'utf8');
const component = await readFile(new URL('./WeSucceedSection.tsx', import.meta.url), 'utf8').catch(() => '');
const config = await readFile(new URL('./succeedVideo.ts', import.meta.url), 'utf8').catch(() => '');
const styles = await readFile(new URL('./WeSucceedSection.css', import.meta.url), 'utf8').catch(() => '');
const motion = await readFile(new URL('../../pages/useWhyDAMotion.ts', import.meta.url), 'utf8');

test('adds one isolated chapter 05 success section to the Why DA page', () => {
  assert.match(page, /<WeSucceedSection\s*\/>/);
  assert.match(component, /data-testid="why-da-succeed"/);
  assert.match(component, /05 \/[\s\S]*WE SUCCEED/);
});

test('uses the supplied final video and local poster with independently tunable crops', () => {
  assert.match(config, /src:\s*'\/videos\/why-da-succeed\.mp4'/);
  assert.match(config, /poster:\s*'\/videos\/why-da-succeed-poster\.jpg'/);
  assert.match(config, /objectPositionDesktop/);
  assert.match(config, /objectPositionTablet/);
  assert.match(config, /objectPositionMobile/);
  assert.match(component, /VIDEO PENDING/);
  assert.doesNotMatch(config, /https?:\/\/|stock|generated/i);
});

test('matches the reference-scale dark final-scene film composition', () => {
  assert.match(styles, /\.why-da-succeed\{[^}]*background:#061725/);
  assert.match(styles, /\.succeed-cinema\{[^}]*width:min\(91vw,1600px\)/);
  assert.match(styles, /\.succeed-screen\{[^}]*aspect-ratio:2\.18\/1/);
  assert.match(component, /DA TUITION[\s\S]*FINAL CHAPTER[\s\S]*05 \/ WE SUCCEED[\s\S]*A DA FILM[\s\S]*SUCCESS \/ 001/);
  assert.match(component, /DA FILM[\s\S]*FINAL CHAPTER[\s\S]*CLASS OF 2020/);
  assert.match(component, /STORIES OF GROWTH[\s\S]*REAL RESULTS/);
  assert.match(component, /succeed-film-rail--top/);
  assert.match(component, /succeed-film-rail--bottom/);
  assert.match(component, /succeed-quote__mark--open/);
  assert.match(component, /succeed-quote__mark--close/);
  assert.match(component, /succeed-film-edge--left/);
  assert.match(component, /succeed-film-edge--right/);
  assert.match(component, /succeed-screen__mask--top/);
  assert.match(component, /succeed-screen__mask--bottom/);
  assert.match(styles, /succeed-screen__mask--top\{[^}]*transform:translateY\(-101%\)/);
  assert.match(styles, /succeed-screen__mask--bottom\{[^}]*transform:translateY\(101%\)/);
  assert.doesNotMatch(styles, /sprocket|repeating-linear-gradient/i);
});

test('choreographs analog registration and provides reduced-motion and accessible playback', () => {
  assert.match(motion, /succeedFrameSlip/);
  assert.match(motion, /succeed-exposure/);
  assert.match(motion, /FRAME LOCKED|succeed-frame-locked/);
  assert.match(component, /controlsList/);
  assert.match(component, /track kind="captions"/);
  assert.match(component, /aria-label="Play We Succeed film"/);
  assert.match(component, /aria-label=\{muted \? 'Unmute We Succeed film' : 'Mute We Succeed film'\}/);
  assert.match(component, /video\.muted = !video\.muted/);
  assert.match(component, /Pause We Succeed film/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test('ends cleanly after the cinematic quote without outcome placeholders or a duplicated CTA', () => {
  assert.match(component, /AND THEN ONE DAY/);
  assert.match(component, /I didn’t think[\s\S]*I could get this far/);
  assert.doesNotMatch(component, /THE OUTCOME|Different students|Real progress/);
  assert.doesNotMatch(component, /VERIFIED RESULT PENDING/);
  assert.doesNotMatch(component, /Success looks different|That’s exactly the point/);
  assert.doesNotMatch(component, /BOOK A CONSULTATION/);
});
