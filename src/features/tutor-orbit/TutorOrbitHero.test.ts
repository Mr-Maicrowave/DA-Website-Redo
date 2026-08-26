import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tutorOrbitUrl = new URL('./TutorOrbitHero.tsx', import.meta.url);

test('turns tutor exploration into a clear matching decision', () => {
  const source = readFileSync(tutorOrbitUrl, 'utf8');

  assert.match(source, /Open full profile/);
  assert.match(source, /Year levels/);
  assert.match(source, /How they teach/);
  assert.match(source, /tutor-orbit__match-signal--subject/);
  assert.match(source, /subject--math/);
  assert.match(source, /subject--english/);
  assert.match(source, /subject--science/);
});

test('crossfades tutor portraits without waiting for an empty centre state', () => {
  const source = readFileSync(tutorOrbitUrl, 'utf8');

  assert.match(source, /AnimatePresence mode="sync"/);
  assert.match(source, /duration: \.24/);
});

test('does not repeat a second proof-and-booking section beneath the tutor hero', () => {
  const source = readFileSync(new URL('../../pages/Tutors.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /tutor-match-proof-heading/);
  assert.doesNotMatch(source, /Book a Consultation/);
});

test('links the active tutor to their full profile rather than a generic catalogue view', () => {
  const source = readFileSync(tutorOrbitUrl, 'utf8');

  assert.match(source, /\/find-teacher\?tutor=\$\{active\.id\}/);
  assert.match(source, /Open .* full profile/);
});

test('keeps the desktop tutor detail card at a consistent height despite differing copy length', () => {
  const css = readFileSync(new URL('./tutor-orbit.css', import.meta.url), 'utf8');

  assert.match(css, /\.tutor-orbit__card\{[^}]*height:500px/);
  assert.match(css, /\.tutor-orbit__card a\{[^}]*margin-top:auto/);
});

test('makes the central active tutor visually inviting without adding a duplicate profile label', () => {
  const css = readFileSync(new URL('./tutor-orbit.css', import.meta.url), 'utf8');

  assert.match(css, /\.tutor-orbit__centre-wrap::before/);
  assert.doesNotMatch(css, /\.tutor-orbit__centre-profile::after/);
  assert.match(css, /brightness\(1\.08\)/);
});

test('opens a full profile when a smaller orbit portrait is clicked', () => {
  const source = readFileSync(tutorOrbitUrl, 'utf8');

  assert.match(source, /navigate\(`\/find-teacher\?tutor=\$\{tutor\.id\}`\)/);
});
