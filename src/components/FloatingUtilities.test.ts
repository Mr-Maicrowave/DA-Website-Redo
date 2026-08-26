import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appUrl = new URL('../App.tsx', import.meta.url);
const scrollToTopUrl = new URL('./ScrollToTop.tsx', import.meta.url);
const stickyBookUrl = new URL('./StickyBookButton.tsx', import.meta.url);

test('mounts only one scroll-to-top control', () => {
  const source = readFileSync(appUrl, 'utf8');

  assert.equal(source.match(/<ScrollToTop \/>/g)?.length, 1);
});

test('floating utilities do not obscure content on phone or compact-laptop screens', () => {
  const scrollSource = readFileSync(scrollToTopUrl, 'utf8');
  const stickySource = readFileSync(stickyBookUrl, 'utf8');

  assert.match(scrollSource, /site-scroll-to-top hidden[^"]*min-\[1800px\]:block/);
  assert.match(stickySource, /site-sticky-book-button hidden[^"]*min-\[1800px\]:flex/);
});
