import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('./WhyChooseDA.css', import.meta.url), 'utf8').catch(() => '');
const knowSection = await readFile(new URL('../components/why-da/WeKnowYouSection.tsx', import.meta.url), 'utf8').catch(() => '');
const personaliseSection = await readFile(new URL('../components/why-da/PersonaliseFilmSection.tsx', import.meta.url), 'utf8').catch(() => '');
const careSection = await readFile(new URL('../components/why-da/WeCareFilmSection.tsx', import.meta.url), 'utf8').catch(() => '');

test('matches the approved Why DA page structure', () => {
  assert.match(page, /data-testid="why-da-hero"/);
  assert.match(page, /NO TWO STUDENTS[\s\S]*LEARN THE SAME/);
  assert.match(page, /So why should they be taught the same way/);
  assert.match(knowSection, /data-testid="why-da-know-you"/);
  assert.match(page, /<PersonaliseFilmSection\s*\/>/);
  assert.match(personaliseSection, /data-testid="why-da-personalise"/);
  assert.match(personaliseSection, /MAIN PHOTO PENDING/);
  assert.doesNotMatch(page, /why-da-photo-strip|data-testid="why-da-proof-band"/);
});

test('the hero uses the real classroom photograph as a full-viewport cinematic composition', () => {
  assert.match(page, /<NavigationNew heroMode\s*\/>/);
  assert.match(page, /\/assets\/why-da\/hero-classroom\.jpg/);
  assert.match(page, /data-motion="hero-background-slice"/);
  assert.match(page, /why-da-hero__background-slice--top/);
  assert.match(page, /why-da-hero__background-slice--middle/);
  assert.match(page, /why-da-hero__background-slice--bottom/);
  assert.match(page, /NO TWO STUDENTS[\s\S]*LEARN THE SAME/);
  assert.match(page, /So why should they be taught the same way/);
  assert.match(page, /CONFIDENCE[\s\S]*PACE[\s\S]*ABILITY[\s\S]*GOALS/);
  assert.match(page, /BEFORE WE TEACH,[\s\S]*WE UNDERSTAND/);
  assert.match(styles, /\.why-da-hero\s*\{[^}]*height:\s*100svh/s);
  assert.match(styles, /object-fit:\s*cover/);
  assert.match(page, /data-testid="why-da-tutor-layer"/);
});

test('the cinematic hero keeps the tutor on one uninterrupted face-safe layer', () => {
  const tutorLayer = page.match(/<div className="why-da-hero__tutor"[\s\S]*?<\/div>/)?.[0] ?? '';
  const backgroundSlices = page.match(/<div className="why-da-hero__background-slices"[\s\S]*?<\/div>\s*<div className="why-da-hero__tutor"/)?.[0] ?? '';

  assert.match(tutorLayer, /data-testid="why-da-tutor-layer"/);
  assert.match(tutorLayer, /hero-classroom\.jpg/);
  assert.doesNotMatch(tutorLayer, /hero-slice/);
  assert.match(backgroundSlices, /why-da-hero__background-slice--top/);
  assert.match(backgroundSlices, /why-da-hero__background-slice--middle/);
  assert.match(backgroundSlices, /why-da-hero__background-slice--bottom/);
  assert.match(styles, /\.why-da-hero__tutor\s*\{[^}]*z-index:\s*2/s);
  assert.match(styles, /\.why-da-hero__background-slices\s*\{[^}]*--tutor-safe-left:/s);
  assert.doesNotMatch(styles, /\.why-da-hero__tutor[^}]*clip-path/s);
  assert.doesNotMatch(styles, /\.why-da-hero__background-slice[^}]*clip-path/s);
});

test('the We Know You chapter shows all four observations in one editorial composition', () => {
  assert.match(page, /<WeKnowYouSection\s*\/>/);
  assert.match(knowSection, /A student is more[\s\S]*than the mark on[\s\S]*their paper/);
  assert.match(knowSection, /WHERE ARE THEY NOW\?[\s\S]*DO THEY HAVE THE[\s\S]*CONFIDENCE TO TRY\?[\s\S]*WHAT COMES NATURALLY[\s\S]*WHAT ARE THEY[\s\S]*WORKING TOWARDS\?/);
  assert.match(knowSection, /starting-point\.png[\s\S]*confidence\.png[\s\S]*strengths-challenges\.png[\s\S]*goals\.png/);
  assert.match(knowSection, /why-da-editorial/);
  assert.match(knowSection, /data-story-index/);
  assert.match(knowSection, /why-da-rail__button/);
  assert.match(knowSection, /He shuts down when he&apos;s stuck/);
  assert.match(knowSection, /AT HOME\?[\s\S]*Parent perspective matters[\s\S]*WE LISTEN FIRST/);
  assert.match(knowSection, /Now that we know,[\s\S]*we build it around them/);
  assert.match(knowSection, /href="#why-da-personalise"/);
  assert.doesNotMatch(knowSection, /carousel|data-gallery-category|scrollIntoView/i);
  assert.match(styles, /\.why-da-editorial/);
  assert.match(styles, /grid-template-areas:/);
  assert.match(styles, /\.why-da-story--confidence[\s\S]*object-position:/);
  assert.match(styles, /\.why-da-story--confidence[\s\S]*object-fit:\s*contain/);
});

test('gives the desktop editorial chapter a natural reference-scale rhythm', () => {
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-know\s*\{[^}]*scroll-margin-top:\s*56px/s);
  assert.match(styles, /--space-3xl:\s*120px/);
  assert.match(styles, /--know-body:\s*clamp\(1rem,\.12vw \+ \.97rem,1\.0625rem\)/);
  assert.match(styles, /\.why-da-story__copy h3\s*\{[^}]*font-size:var\(--know-question\)/s);
  assert.match(styles, /\.why-da-parent__copy h3\s*\{[^}]*font-size:clamp\(2\.4rem,3vw,3\.25rem\)/s);
  assert.match(styles, /\.why-da-editorial,[\s\S]*?\.why-da-know__closing\s*\{[^}]*width:\s*calc\(100%\s*-\s*128px\)[^}]*max-width:\s*1440px/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-editorial\s*\{[^}]*height:\s*auto[^}]*grid-template-rows:\s*minmax\(620px,700px\)\s+minmax\(420px,500px\)\s+minmax\(460px,560px\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1600px\)[\s\S]*?\.why-da-editorial[^}]*max-width:\s*1520px/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observation--confidence \.why-da-observation__photo\s*\{[^}]*background-image:[^}]*confidence\.png/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observation--confidence img\s*\{[^}]*object-fit:\s*contain/s);
});

test('removes the legacy teaching and connected blocks while preserving care', () => {
  assert.match(page, /<PersonaliseFilmSection\s*\/>/);
  assert.match(page, /components\/why-da\/PersonaliseFilmSection/);
  assert.doesNotMatch(page, /data-testid="why-da-teach"|why-da-teach__practice|why-da-lesson-board/);
  assert.match(page, /<WeCareFilmSection\s*\/>/);
  assert.match(careSection, /data-testid="why-da-care"/);
  assert.match(careSection, /Sometimes, they don’t[\s\S]*They need someone to notice/);
  assert.doesNotMatch(page, /data-testid="why-da-connected"|LESSON REPORT|PROGRESS OVER TIME|PARENT COMMUNICATION/);
  assert.match(styles, /\.why-da-care/);
});

test('completes the seven-part story with growth, achievement, and a consultation close', () => {
  assert.match(page, /data-testid="why-da-grow"/);
  assert.match(page, /WE GROW/);
  assert.match(page, /YEAR 2[\s\S]*YEAR 4[\s\S]*YEAR 7[\s\S]*YEAR 9[\s\S]*YEAR 12/);
  assert.match(page, /Confidence[\s\S]*Curiosity[\s\S]*Study habits[\s\S]*Independence[\s\S]*Resilience[\s\S]*Tutor connection/);
  assert.match(page, /data-testid="why-da-achieve"/);
  assert.match(page, /CATCH UP SUCCESS[\s\S]*IMPROVEMENT[\s\S]*HIGH ACHIEVEMENT[\s\S]*EXTENSION/);
  assert.match(page, /data-testid="why-da-closing-cta"/);
  assert.match(page, /BOOK A CONSULTATION[\s\S]*EXPLORE LEARNING OPTIONS/);
});
