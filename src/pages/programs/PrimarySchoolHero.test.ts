import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pageUrl = new URL('./PrimarySchool.tsx', import.meta.url);
const heroVideoUrl = new URL('../../../public/primary-reference/hero/primary-school-hero.mp4', import.meta.url);
const heroPosterUrl = new URL('../../../public/primary-reference/hero/primary-school-hero-poster.jpg', import.meta.url);

test('Primary School opens with the supplied full-viewport video and an accessible static fallback', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.equal(existsSync(fileURLToPath(heroVideoUrl)), true, 'the supplied hero video must be stored in the project');
  assert.equal(existsSync(fileURLToPath(heroPosterUrl)), true, 'the hero must have a static poster fallback');
  assert.match(source, /<video[^>]*className="ps-hero__video"[^>]*autoPlay[^>]*muted[^>]*loop[^>]*playsInline/);
  assert.match(source, /poster="\/primary-reference\/hero\/primary-school-hero-poster\.jpg"/);
  assert.match(source, /<source src="\/primary-reference\/hero\/primary-school-hero\.mp4" type="video\/mp4"/);
  assert.match(source, /Where little steps become big ones\.|Where little steps<br \/>become big ones\./);
  assert.match(source, /Building confidence, curiosity and strong foundations from Years 1–6\./);
  assert.match(source, /Explore their journey/);
  assert.match(source, /href="#primary-page-content"/);
  assert.match(source, /ps-hero__clouds/);
  assert.match(source, /ps-hero__sunlight/);
  assert.match(source, /ps-hero__wind--foreground/);
  assert.match(source, /ps-hero__wind--door/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /cancelAnimationFrame/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /min-height:100svh/);
  assert.match(source, /\.ps-hero__video\{[^}]*width:100%;height:100%;object-fit:cover/);
  assert.match(source, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.ps-hero__video\{display:none\}/);
  assert.match(source, /\.ps-hero__content\{[^}]*left:50%/);
  assert.match(source, /\.ps-hero__content\{[^}]*text-align:center/);
  assert.match(source, /\.ps-hero__content\{[^}]*transform:translateX\(-50%\)/);
  assert.match(source, /@media\(max-width:600px\)[\s\S]*\.ps-hero__content\{[^}]*left:50%;[^}]*transform:translateX\(-50%\)/);
  assert.doesNotMatch(source, /PrimaryWorldTransition|PrimaryLandscapeJourney/);
  assert.doesNotMatch(source, /petal|particle/i);
});
