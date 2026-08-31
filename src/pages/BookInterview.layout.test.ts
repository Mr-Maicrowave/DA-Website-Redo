import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('./BookInterview.tsx', import.meta.url);
const cssUrl = new URL('./BookInterview.css', import.meta.url);
const projectRoot = new URL('../../', import.meta.url);

test('uses the generated interview artwork and real interviewer cutout in a welcoming light hero', () => {
  const source = readFileSync(pageUrl, 'utf8');
  const styles = readFileSync(cssUrl, 'utf8');

  assert.match(source, /book-interview-reference-scene\.webp/);
  assert.match(source, /Book an[\s\S]*Interview/);
  assert.match(source, /A thoughtful conversation today/);
  assert.doesNotMatch(source, /Back to Home/);

  assert.ok(existsSync(new URL('public/images/interview/book-interview-reference-scene.webp', projectRoot)));
  assert.ok(existsSync(new URL('public/images/interview/ivory-paper-texture.png', projectRoot)));
});

test('includes the four benefit promises and reassurance from the approved design', () => {
  const source = readFileSync(pageUrl, 'utf8');

  for (const text of [
    'Personalised Recommendations',
    'Expert Guidance You Can Trust',
    'A Supportive Start to Their Journey',
    'Small Groups Big Impact',
    'Takes about 5 minutes',
  ]) {
    assert.match(source, new RegExp(text));
  }

  assert.doesNotMatch(source, /interview-trust-strip/);
});

test('mounts the six-step wizard with the local adapter and existing confirmation', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /InterviewWizard/);
  assert.match(source, /submitInterviewLocally/);
  assert.match(source, /InterviewConfirmation/);
  assert.match(source, /ConsultationContent/);
  assert.doesNotMatch(source, /interface ParentForm/);
  assert.doesNotMatch(source, /interface Student/);
  assert.doesNotMatch(source, /validateStep1|validateStep2/);
});
