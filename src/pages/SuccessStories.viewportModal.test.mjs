import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const styles = readFileSync(new URL('./SuccessStories.css', import.meta.url), 'utf8');

test('uses a readable viewport-sized landscape card on desktop', () => {
  assert.match(styles, /\.ss-story-modal\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(styles, /\.ss-story-sheet\s*\{[^}]*width:\s*min\(1480px,/s);
  assert.match(styles, /\.ss-story-sheet\s*\{[^}]*height:\s*min\(calc\(100svh\s*-\s*2rem\),\s*940px\);/s);
  assert.match(styles, /\.ss-story-sheet\s*\{[^}]*border-radius:\s*26px;/s);
  assert.match(styles, /\.ss-story-sheet__page\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*2fr\)\s+minmax\(18rem,\s*0\.82fr\);/s);
});

test('keeps the desktop card unscaled and uses internal scrolling only on mobile', () => {
  assert.match(styles, /\.ss-story-sheet\s*\{[^}]*scale:\s*1;/s);
  assert.match(styles, /\.ss-story-sheet__page\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(styles, /@media \(max-width:\s*600px\)[\s\S]*\.ss-story-sheet__page\s*\{[^}]*overflow-y:\s*auto;/s);
});

test('stacks the story and achievement panel into one mobile column', () => {
  assert.match(
    styles,
    /@media \(max-width:\s*600px\)[\s\S]*\.ss-story-sheet__story-column\s*,\s*\.ss-story-sheet__achievement\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*auto;/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*600px\)[\s\S]*\.ss-story-sheet__achievement\s*\{[^}]*width:\s*100%;[^}]*height:\s*30rem;/s,
  );
});

test('matches the reference with a dedicated mountain achievement panel', () => {
  assert.match(styles, /\.ss-story-sheet__main\s*\{[^}]*display:\s*contents;/s);
  assert.match(styles, /\.ss-story-sheet__achievement\s*\{[^}]*grid-column:\s*2;/s);
  assert.match(styles, /\.ss-story-sheet__achievement\s*\{[^}]*border-radius:\s*24px;/s);
  assert.match(styles, /\.ss-story-sheet__future-note\s*\{[^}]*grid-column:\s*1;/s);
});
