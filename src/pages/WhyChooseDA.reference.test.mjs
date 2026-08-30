import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('./WhyChooseDA.css', import.meta.url), 'utf8').catch(() => '');

test('matches the approved Why DA page structure', () => {
  assert.match(page, /data-testid="why-da-hero"/);
  assert.match(page, /EVERY[\s\S]*STUDENT IS[\s\S]*DIFFERENT/);
  assert.match(page, /Their tuition[\s\S]*should be too/);
  assert.match(page, /data-testid="why-da-know-you"/);
  assert.match(page, /data-testid="why-da-personalise"/);
  assert.match(page, /YOUR CHILD&apos;S[\s\S]*PERSONALISED[\s\S]*PATH/);
  assert.match(page, /data-testid="why-da-proof-band"/);
});

test('the hero fills exactly one viewport below the desktop navigation', () => {
  assert.match(styles, /\.why-da-hero\s*\{[^}]*min-height:\s*calc\(100svh\s*-\s*56px\)/s);
  assert.match(styles, /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.why-da-hero\s*\{[^}]*min-height:\s*calc\(100svh\s*-\s*56px\)/s);
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
