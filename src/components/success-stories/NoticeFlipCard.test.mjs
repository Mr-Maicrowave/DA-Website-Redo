import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('./NoticeFlipCard.css', import.meta.url), 'utf8');
const pageCss = await readFile(new URL('../../pages/SuccessStories.css', import.meta.url), 'utf8');
const successStoriesPage = await readFile(new URL('../../pages/SuccessStories.tsx', import.meta.url), 'utf8');
const component = await readFile(new URL('./NoticeFlipCard.tsx', import.meta.url), 'utf8');

test('normalizes the visible artwork bounds for every notice card face', () => {
  for (const card of [1, 2, 3]) {
    assert.match(css, new RegExp(`\\.notice-card--${card}\\s*\\{[^}]*--notice-front-scale-x:`, 's'));
    assert.match(css, new RegExp(`\\.notice-card--${card}\\s*\\{[^}]*--notice-back-scale-x:`, 's'));
  }
  assert.match(
    css,
    /\.notice-card__face--front img\s*\{[^}]*transform:\s*scaleX\(var\(--notice-front-scale-x\)\)\s*scaleY\(var\(--notice-front-scale-y\)\)/s,
  );
  assert.match(
    css,
    /\.notice-card__face--back img\s*\{[^}]*transform:\s*scaleX\(var\(--notice-back-scale-x\)\)\s*scaleY\(var\(--notice-back-scale-y\)\)/s,
  );
});

test('keeps each card the same visible size before and after flipping', () => {
  const visibleBounds = [
    { front: [696, 1261], back: [840, 1478] },
    { front: [795, 1365], back: [904, 1485] },
    { front: [832, 1468], back: [938, 1473] },
  ];

  visibleBounds.forEach(({ front, back }, index) => {
    const rule = css.match(new RegExp(`\\.notice-card--${index + 1}\\s*\\{([^}]*)\\}`, 's'))?.[1] ?? '';
    const value = (name) => Number(rule.match(new RegExp(`--${name}:\\s*([\\d.]+)`))?.[1]);
    const frontSize = [front[0] * value('notice-front-scale-x'), front[1] * value('notice-front-scale-y')];
    const backSize = [back[0] * value('notice-back-scale-x'), back[1] * value('notice-back-scale-y')];

    assert.ok(Math.abs(frontSize[0] - backSize[0]) < 1, `card ${index + 1} width changes after flipping`);
    assert.ok(Math.abs(frontSize[1] - backSize[1]) < 1, `card ${index + 1} height changes after flipping`);
  });
});

test('versions every notice-card back image as a matched asset set', () => {
  const noticeAssetUrls = [...successStoriesPage.matchAll(/['"](\/images\/success-stories\/notice-[^'"]+-back\.png\?v=[^'"]+)['"]/g)]
    .map((match) => match[1]);

  assert.equal(noticeAssetUrls.length, 3);
  assert.equal(new Set(noticeAssetUrls.map((url) => url.split('?v=')[1])).size, 1);
});

test('uses the corrected uniquely named front artwork files', () => {
  for (const asset of [
    'notice-enjoys-learning-front-corrected.png',
    'notice-better-motivation-front-corrected.png',
    'notice-growing-responsibility-front-corrected.png',
  ]) assert.match(successStoriesPage, new RegExp(`/images/success-stories/${asset}`));

  assert.match(css, /\.notice-card__face--front\s*\{[^}]*visibility:\s*visible/s);
  assert.match(css, /\.notice-card__face--back\s*\{[^}]*visibility:\s*hidden/s);
  assert.match(css, /\.notice-card__flip--is-flipped \.notice-card__face--front\s*\{[^}]*visibility:\s*hidden/s);
  assert.match(css, /\.notice-card__flip--is-flipped \.notice-card__face--back\s*\{[^}]*visibility:\s*visible/s);
});

test('renders editable front-face copy for all three notice cards', () => {
  for (const text of [
    'WHAT PARENTS NOTICE · 01',
    'Enjoys',
    'learning',
    'JOY IN DISCOVERY',
    'WHAT PARENTS NOTICE · 02',
    'Better',
    'motivation',
    'DRIVEN TO IMPROVE',
    'WHAT PARENTS NOTICE · 03',
    'Growing',
    'responsibility',
    'CONFIDENCE IN ACTION',
  ]) assert.match(successStoriesPage, new RegExp(text.replace('·', '\\·')));

  assert.match(component, /className="notice-card__front-copy"/);
  assert.match(component, /className="notice-card__front-heading"/);
  assert.match(component, /className="notice-card__front-title"/);
  assert.match(component, /className="notice-card__front-divider"/);
  assert.match(component, /className="notice-card__front-subtitle"/);
  assert.match(css, /\.notice-card__front-copy\s*\{/);
});

test('keeps the complete front title group inside the visible card bottom', () => {
  assert.match(css, /\.notice-card__front-lower\s*\{[^}]*bottom:\s*8\.5%/s);
});

test('renders the complete editable editorial treatment on every back face', () => {
  for (const text of [
    'learning fun.',
    'consistent excellent academic results.',
    'confidence, responsibility, and genuine pride in himself.',
    'PARENT GOOGLE REVIEW',
    'PARENT OF NICHOLAS AND KRISTINA',
    'DA PARENT',
  ]) assert.match(successStoriesPage, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  assert.match(component, /className="notice-card__back-copy"/);
  assert.match(component, /className="notice-card__back-heading"/);
  assert.match(component, /className="notice-card__back-number"/);
  assert.match(component, /className="notice-card__back-heading-divider"/);
  assert.match(component, /frontSubtitle/);
  assert.match(component, /className="notice-card__back-quote-mark"/);
  assert.match(component, /className="notice-card__back-quote"/);
  assert.match(component, /className="notice-card__back-accent"/);
  assert.match(component, /className="notice-card__back-attribution"/);
  assert.doesNotMatch(css, /-webkit-line-clamp/);
  assert.match(css, /\.notice-card__back-copy\s*\{[^}]*transform:\s*translateZ\(2px\)/s);
});

test('adds an editorial hover instruction without changing the card row structure', () => {
  assert.match(successStoriesPage, /className="ss-parent-growth__instruction"/);
  assert.match(successStoriesPage, /Hover over the cards to see what parents feel about us/);
  assert.match(successStoriesPage, /Tap the cards to see what parents feel about us/);
  assert.match(pageCss, /\.ss-parent-growth__instruction\s*\{[^}]*position:\s*absolute/s);
  assert.match(pageCss, /\.ss-parent-growth__instruction-icon/);
  assert.match(pageCss, /\.ss-parent-growth__instruction-divider/);
});

test('uses the enlarged reference-scale card composition responsively', () => {
  assert.match(css, /\.notice-card\s*\{[^}]*width:\s*min\(100%,\s*28rem\)/s);
  assert.match(successStoriesPage, /className="ss-container ss-parent-growth__layout"/);
  assert.match(pageCss, /\.ss-parent-growth__layout\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*100rem\)/s);
  assert.match(pageCss, /\.ss-parent-growth__notes \.notice-card\s*\{[^}]*width:\s*min\(88vw,\s*24rem\)/s);
});

test('keeps every back-text element inside the visible rounded card edges', () => {
  assert.match(css, /\.notice-card__back-quote-mark\s*\{[^}]*top:\s*16\.5%[^}]*left:\s*14%/s);
  assert.match(css, /\.notice-card__back-body\s*\{[^}]*top:\s*21\.5%[^}]*right:\s*28%[^}]*left:\s*14%/s);
  assert.match(css, /\.notice-card__back-copy\s*\{[^}]*overflow:\s*hidden/s);
});

test('uses the requested premium testimonial spacing rhythm', () => {
  assert.match(css, /\.notice-card__back-quote\s*\{[^}]*font-size:\s*clamp\(1rem,\s*1\.25vw,\s*1\.4375rem\)[^}]*line-height:\s*1\.28/s);
  assert.match(css, /\.notice-card__back-attribution\s*\{[^}]*gap:\s*clamp\(0\.5rem,[^}]*margin-top:\s*clamp\(1\.25rem,[^}]*1\.75rem\)/s);
  assert.match(css, /\.notice-card--3 \.notice-card__back-body\s*\{[^}]*right:\s*36%/s);
  assert.match(css, /\.notice-card--2 \.notice-card__back-attribution span\s*\{[^}]*max-width:\s*18ch/s);
});

test('gives the flipped card an angled pose with raised testimonial layers', () => {
  assert.match(component, /notice-card__tilt--is-flipped/);
  assert.match(css, /\.notice-card__tilt--is-flipped\s*\{[^}]*rotateX\([^}]*rotateY\([^}]*translateY\(/s);
  assert.match(css, /\.notice-card__back-heading\s*\{[^}]*translateZ\(-\d+px\)/s);
  assert.match(css, /\.notice-card__back-quote-mark\s*\{[^}]*translateZ\(-\d+px\)/s);
  assert.match(css, /\.notice-card__back-body\s*\{[^}]*translateZ\(-\d+px\)/s);
});
