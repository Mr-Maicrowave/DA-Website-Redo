import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('./BookInterview.tsx', import.meta.url);
const cssUrl = new URL('./BookInterview.css', import.meta.url);
const projectRoot = new URL('../../', import.meta.url);

test('uses the generated interview artwork and real interviewer cutout in a welcoming light hero', () => {
  const source = readFileSync(pageUrl, 'utf8');
  const styles = readFileSync(cssUrl, 'utf8');

  assert.match(styles, /consultation-room-bg\.png/);
  assert.match(source, /interviewers\.png/);
  assert.match(source, /Book an[\s\S]*Interview/);
  assert.match(source, /A thoughtful conversation today/);
  assert.doesNotMatch(source, /Back to Home/);

  assert.ok(existsSync(new URL('public/images/interview/consultation-room-bg.png', projectRoot)));
  assert.ok(existsSync(new URL('public/images/interview/interviewers.png', projectRoot)));
  assert.ok(existsSync(new URL('public/images/interview/ivory-paper-texture.png', projectRoot)));
});

test('includes the four benefit promises, reassurance, and trust statistics from the approved design', () => {
  const source = readFileSync(pageUrl, 'utf8');

  for (const text of [
    'Personalised Recommendations',
    'Expert Guidance You Can Trust',
    'A Supportive Start to Their Journey',
    'Small Groups Big Impact',
    'Takes 2 minutes',
    'Every conversation is the start of something great.',
  ]) {
    assert.match(source, new RegExp(text));
  }
});

test('keeps the existing parent fields and validation flow intact', () => {
  const source = readFileSync(pageUrl, 'utf8');

  for (const field of ['firstName', 'lastName', 'email', 'mobile', 'preferredContact', 'relationship', 'suburb']) {
    assert.match(source, new RegExp(`errors\\.${field}`));
  }
  assert.match(source, /validateStep1\(parentForm\)/);
  assert.match(source, /validateStep2\(students\)/);
  assert.match(source, /Continue to Student Details/);
});
