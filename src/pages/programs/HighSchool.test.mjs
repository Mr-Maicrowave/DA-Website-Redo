import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./HighSchool.tsx', import.meta.url), 'utf8');

test('renders the supplied High School hero artwork with the approved editorial copy', () => {
  assert.match(source, /data-testid="highschool-editorial-hero"/);
  assert.match(source, /highschool-hero-student-hallway-v2\.png/);
  const hero = source.match(/function HighSchoolEditorialHero\(\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(hero, /HIGH SCHOOL · YEARS 7–10/);
  assert.match(hero, /FIND YOUR/);
  assert.match(hero, /WAY<\/em> FORWARD\./);
  assert.match(hero, /High school is where students begin to discover how they learn,/);
  assert.match(hero, /At DA, we help them build the/);
  assert.match(hero, /knowledge/);
  assert.match(hero, /confidence/);
  assert.match(hero, /independence/);
  assert.match(hero, /EXPLORE YEARS 7–10/);
  assert.match(source, /@media \(min-width: 768px\)[\s\S]*?hs-editorial-hero__line-mask:nth-child\(2\)[^}]*white-space: nowrap/);
  assert.doesNotMatch(source, /<SubjectHero[\s\S]*?backgroundImageSrc="\/highschool-girl\.png"/);
});

test('the hero uses restrained entrance and scroll choreography with reduced-motion support', () => {
  const hero = source.match(/function HighSchoolEditorialHero\(\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(hero, /useReducedMotion\(\)/);
  assert.match(hero, /useScroll\(/);
  assert.match(hero, /hs-editorial-hero__content/);
  assert.match(hero, /hs-editorial-hero__rule/);
  assert.match(hero, /hs-editorial-hero__scroll/);
  assert.doesNotMatch(hero, /card|panel|sparkle|doodle/i);
});

test('the fixed navigation overlays a complete edge-to-edge viewport hero', () => {
  assert.match(source, /<NavigationNew \/>[\s\S]*?<HighSchoolEditorialHero \/>/);
  assert.doesNotMatch(source, /className="hs-hero-viewport"/);
  assert.match(source, /\.hs-editorial-hero \{[^}]*min-height: 100svh;/);
  assert.match(source, /\.hs-editorial-hero__watercolor \{[^}]*width: 100%;[^}]*height: 100%;[^}]*object-fit: fill;/);
  assert.doesNotMatch(source, /min-height: calc\(100svh -/);
});

test('keeps the existing Years 7–10 journey section', () => {
  assert.match(source, /data-testid="highschool-year-journey"/);
  assert.match(source, /highschool-year-journey-diagonal\.png/);
});

test('renders the four progressive Years 7–10 milestones with concise copy', () => {
  assert.match(source, /data-testid="why-it-matters-progress"/);
  assert.match(source, /The Curriculum Gets Serious/);
  assert.match(source, /Habits Form Now or Not at All/);
  assert.match(source, /Selective &amp; Scholarship Pressure/);
  assert.match(source, /Confidence Decides Outcomes/);
  assert.match(source, /Year 7 introduces more complex ideas that build the foundations for future success\./);
  assert.match(source, /The habits developed in Years 7–8 shape how students handle pressure in Years 11–12\./);
  assert.match(source, /Year 9–10 decisions can shape opportunities\. We help students stay prepared and confident\./);
  assert.match(source, /When students believe in themselves, they&rsquo;re willing to take on bigger challenges\./);
});

test('uses the supplied watercolours in a long sticky scroll stage', () => {
  assert.match(source, /highschool-stakes-blue\.png/);
  assert.match(source, /highschool-stakes-green\.png/);
  assert.match(source, /highschool-stakes-purple\.png/);
  assert.match(source, /highschool-stakes-orange\.png/);
  assert.match(source, /lg:h-\[300vh\]/);
  assert.match(source, /lg:sticky/);
});

test('includes the paper-plane finale and reduced-motion support', () => {
  assert.match(source, /data-testid="stakes-paper-plane"/);
  assert.match(source, /data-testid="stakes-flight-trail"/);
  assert.match(source, /offsetPath/);
  assert.match(source, /useReducedMotion\(\)/);
});

test('keeps artwork inside a dedicated milestone visual column and uses the approved responsive layout', () => {
  assert.match(source, /hs-stakes-shell/);
  assert.match(source, /hs-stakes-list/);
  assert.match(source, /hs-stakes-row/);
  assert.match(source, /hs-stakes-visual/);
  assert.match(source, /hs-stakes-content/);
  assert.match(source, /max-w-\[1500px\]/);
  assert.match(source, /xl:grid-cols-\[40%_60%\]/);
  assert.match(source, /lg:grid-cols-\[36%_64%\]/);
});

test('gives every milestone an independently addressable wrapper', () => {
  assert.match(source, /id={`milestone-0\$\{i \+ 1\}`}/);
});
