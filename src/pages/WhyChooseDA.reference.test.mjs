import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('./WhyChooseDA.css', import.meta.url), 'utf8').catch(() => '');
const knowSection = await readFile(new URL('../components/why-da/WeKnowYouSection.tsx', import.meta.url), 'utf8').catch(() => '');

test('matches the approved Why DA page structure', () => {
  assert.match(page, /data-testid="why-da-hero"/);
  assert.match(page, /NO TWO STUDENTS[\s\S]*LEARN THE SAME/);
  assert.match(page, /So why should they be taught the same way/);
  assert.match(knowSection, /data-testid="why-da-know-you"/);
  assert.match(page, /data-testid="why-da-personalise"/);
  assert.match(page, /YOUR CHILD&apos;S[\s\S]*PERSONALISED[\s\S]*PATH/);
  assert.match(page, /data-testid="why-da-proof-band"/);
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
  assert.match(knowSection, /A STUDENT IS MORE[\s\S]*THAN THE MARK ON[\s\S]*THEIR PAPER/);
  assert.match(knowSection, /WHERE ARE THEY NOW\?[\s\S]*DO THEY HAVE THE[\s\S]*CONFIDENCE TO TRY\?[\s\S]*WHAT COMES NATURALLY[\s\S]*WHAT ARE THEY[\s\S]*WORKING TOWARDS\?/);
  assert.match(knowSection, /starting-point\.png[\s\S]*confidence\.png[\s\S]*strengths-challenges\.png[\s\S]*goals\.png/);
  assert.match(knowSection, /Illustrative parent concern/);
  assert.match(knowSection, /AT HOME\?[\s\S]*Your perspective matters[\s\S]*WE LISTEN FIRST/);
  assert.match(knowSection, /href="#why-da-personalise"/);
  assert.doesNotMatch(knowSection, /carousel|data-gallery-category|aria-current|scrollIntoView/i);
  assert.match(styles, /\.why-da-observation__journey/);
  assert.match(styles, /\.why-da-observation\s*\{[^}]*(?<!min-)height:\s*clamp\(/s);
  assert.match(styles, /\.why-da-observation--confidence[\s\S]*object-position:/);
  assert.match(styles, /\.why-da-observation--starting-point \.why-da-observation__photo,\.why-da-observation--confidence \.why-da-observation__photo\s*\{\s*aspect-ratio:\s*16\s*\/\s*9;/);
  assert.doesNotMatch(styles, /\.why-da-observation--starting-point img,\.why-da-observation--confidence img\s*\{[^}]*object-fit:\s*contain/s);
});

test('fits the desktop heading and four observation rows within one viewport', () => {
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-know\s*\{[^}]*scroll-margin-top:\s*56px/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-know__intro\s*\{[^}]*height:\s*calc\(28svh\s*-\s*16px\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observations\s*\{[^}]*height:\s*calc\(72svh\s*-\s*40px\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observation\s*\{[^}]*height:\s*calc\(18svh\s*-\s*10px\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observation--confidence \.why-da-observation__photo\s*\{[^}]*background-image:[^}]*confidence\.png/s);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.why-da-observation--confidence img\s*\{[^}]*object-fit:\s*contain/s);
});

test('continues the Why DA story with teaching, care, and parent connection', () => {
  assert.match(page, /data-testid="why-da-teach"/);
  assert.match(page, /WE TEACH/);
  assert.match(page, /UNDERSTAND[\s\S]*SEE IT[\s\S]*TRY IT[\s\S]*TEST IT[\s\S]*CORRECT IT[\s\S]*MASTER IT/);
  assert.match(page, /data-testid="why-da-care"/);
  assert.match(page, /FEEL KNOWN[\s\S]*FEEL SAFE[\s\S]*FEEL SUPPORTED[\s\S]*FEEL CHALLENGED[\s\S]*FEEL PROUD/);
  assert.match(page, /data-testid="why-da-connected"/);
  assert.match(page, /LESSON REPORT[\s\S]*PROGRESS OVER TIME[\s\S]*PARENT COMMUNICATION/);
  assert.match(styles, /\.why-da-teach/);
  assert.match(styles, /\.why-da-care/);
  assert.match(styles, /\.why-da-connected/);
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
