import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('./SuccessStories.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./SuccessStories.css', import.meta.url), 'utf8');

test('links the story carousel to the Tu Nguyen heartfelt message', () => {
  assert.match(page, /href="\/testimonials\/a-student-reflection-tu-nguyen"/);
  assert.match(page, /Read more heartfelt messages here/);
});

test('styles the heartfelt message link for focus and small screens', () => {
  assert.match(styles, /\.ss-story-stack__message-link:focus-visible/);
  assert.match(styles, /@media \(max-width: 780px\)[\s\S]*\.ss-story-stack__message-link/);
});
