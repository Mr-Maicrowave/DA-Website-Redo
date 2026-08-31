import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./HighSchool.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('./HighSchoolImmersive.css', import.meta.url), 'utf8');

test('uses one fixed continuous video behind all High School content', async () => {
  assert.equal((source.match(/<video/g) ?? []).length, 1);
  assert.match(source, /autoPlay muted loop playsInline preload="auto"/);
  assert.match(source, /high-school-landscape-loop\.mp4/);
  assert.match(styles, /\.hs-film \{[^}]*position:fixed;[^}]*z-index:0;/);
  assert.match(styles, /\.hs-film video \{[^}]*width:100%;[^}]*height:100%;[^}]*object-fit:cover;/);
  assert.match(styles, /\.hs-film__wash \{[^}]*rgba\(250,246,236,\.14\)/);
  assert.match(styles, /\.hs-immersive-content \{[^}]*position:relative;[^}]*z-index:2;/);
  await access(new URL('../../../public/videos/high-school-landscape-loop.mp4', import.meta.url));
});

test('keeps the global navigation and renders the spacious editorial hero', () => {
  assert.match(source, /<NavigationNew \/>/);
  assert.match(source, /Years 7–10/);
  assert.match(source, /Find your feet\.<br \/>Then find your direction\./);
  assert.match(source, /High school is where students begin discovering how they learn/);
  assert.match(source, /Explore the journey/);
  assert.match(styles, /\.hs-immersive-hero \{[^}]*min-height:100svh;/);
});

test('switches one interactive journey between Years 07 and 10', () => {
  for (const text of ['Find your feet.', 'Build your independence.', 'Discover your strengths.', 'Choose your direction.']) assert.match(source, new RegExp(text.replace('.', '\\.')));
  assert.match(source, /aria-label="High-school year progress"/);
  assert.match(source, /useScroll/);
  assert.match(source, /useMotionValueEvent/);
  assert.match(source, /Math\.floor\(latest \* years\.length\)/);
  assert.match(source, /src="\/images\/programs\/highschool-hero-student\.png"/);
  assert.doesNotMatch(source, /src=\{year\.image\}/);
  assert.match(source, /hs-year-journey__outcomes/);
  assert.match(source, /hs-year-journey__focus/);
  assert.match(source, /What students focus on in Year/);
  assert.match(styles, /\.hs-year-journey__title-rule/);
  assert.doesNotMatch(source, /HighSchoolCinematicScene|HighSchoolProfessionalJourney/);
  assert.match(styles, /\.hs-year-journey__frame \{[^}]*height:clamp\(680px,74vh,780px\);/);
  assert.match(styles, /\.hs-year-journey \{[^}]*height:400svh;/);
  assert.match(styles, /\.hs-year-journey__sticky \{[^}]*position:sticky;/);
  assert.match(styles, /@media \(max-width:800px\)[\s\S]*?\.hs-year-journey__frame \{[^}]*height:auto;/);
});

test('renders the three different starting points as ruled editorial states', () => {
  for (const label of ['Rebuild', 'Progress', 'Extend']) assert.match(source, new RegExp(label));
  assert.match(source, /Every student arrives<br \/>somewhere different\./);
  assert.match(styles, /\.hs-starting__states \{[^}]*grid-template-columns:repeat\(3,1fr\);[^}]*border-block:/);
  assert.match(source, /hs-starting__icon/);
  assert.match(source, /item\.outcomes\.map/);
  assert.match(styles, /\.hs-starting__outcomes/);
});

test('combines support categories and the DA method into interactive panels', () => {
  for (const label of ['Subjects', 'Assessments', 'Study habits', 'Independence', 'HSC preparation']) assert.match(source, new RegExp(label));
  assert.match(source, /role="tablist"/);
  assert.match(source, /methodItems\.map/);
  assert.match(source, /hs-method__emotion/);
  assert.match(source, /hs-method__what-we-do/);
  assert.match(source, /action\.annotation/);
  assert.match(styles, /\.hs-method__action-row/);
  assert.match(styles, /\.hs-method__layout \{[^}]*height:clamp\(680px,82svh,820px\);/);
  assert.match(styles, /@media \(max-width:800px\)[\s\S]*?\.hs-method__layout \{[^}]*height:auto;/);
  assert.match(source, /A proven approach\.<br \/>Personal to every student\./);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});
