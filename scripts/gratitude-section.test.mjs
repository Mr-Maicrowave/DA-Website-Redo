import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

const read = (path) => readFile(new URL(path, root), 'utf8');

test('Success Stories replaces the appreciation collage with the gratitude section', async () => {
  const [page, component, styles] = await Promise.all([
    read('src/pages/SuccessStories.tsx'),
    read('src/components/success-stories/GratitudeSection.tsx'),
    read('src/components/success-stories/GratitudeSection.css'),
  ]);

  assert.match(page, /<GratitudeSection reduceMotion=\{reduceMotion\} \/>/);
  assert.doesNotMatch(page, /These words mean more|appreciationNotes|ss-memory-note/);
  assert.match(component, /A NOTE FROM DA/);
  assert.match(component, /Thank you/);
  assert.match(component, /for trusting us\./);
  assert.match(component, /Every review/);
  assert.match(component, /Every message/);
  assert.match(component, /Every kind word/);
  assert.match(component, /Every child’s journey/);
  assert.match(component, /line\.includes\(highlight\)/);
  assert.match(component, /Thank you for allowing us to be part of your\s+<em>child’s journey\.<\/em>/);
  assert.match(component, /grateful-to-grow-with-you\.png/);
  assert.doesNotMatch(component, /<p>We’re grateful to grow with you\./);
  assert.match(component, /strokeDasharray/);
  assert.match(styles, /\.ss-gratitude/);
  assert.match(styles, /border-radius: 0 0 50% 50%/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
