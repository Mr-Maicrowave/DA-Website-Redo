import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('starts with a neutral team prompt instead of a promoted tutor', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.match(source, /Explore the DA team/);
  assert.match(source, /Focused educators/);
});

test('does not animate tutor positions continuously', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /requestAnimationFrame/);
  assert.doesNotMatch(source, /repeat:\s*Infinity/);
});

test('keeps every portrait selectable while filters only change visual state', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  const portraitButton = source.match(
    /<button\s+key=\{record\.tutor\.id\}[\s\S]*?onClick=\{\(\) => setSelectedTutorId\(record\.tutor\.id\)\}/,
  );
  assert.ok(portraitButton, 'expected to find the constellation portrait button');
  assert.doesNotMatch(portraitButton[0], /\bdisabled=/);
});

test('derives the neutral team total from the catalogue', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\b43\b/);
  assert.match(source, /<span aria-hidden="true">\{TUTORS\.length\}<\/span>/);
});

test('does not nest a second main landmark inside the tutors page', () => {
  const source = readFileSync(new URL('./FullTutorProfile.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /<main className="full-profile__content">/);
});

test('renders exactly three named subject systems from the shared orbit contract', () => {
  const component = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('./tutorOrbitLayout.ts', import.meta.url), 'utf8');

  assert.match(component, /TUTOR_ORBIT_GROUPS\.map\(group =>/);
  assert.match(component, /\{group\.label\}/);
  for (const label of ['Mathematics', 'English', 'Science']) {
    assert.match(layout, new RegExp(`label: '${label}'`));
  }
  assert.doesNotMatch(layout, /label: 'Foundations'/);
});

test('presents Primary as a K–6 filter and an activated path without portrait slots', () => {
  const component = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.match(component, /label: 'Primary · K–6'/);
  assert.match(component, /subjects\.has\('primary'\)/);
  assert.match(component, /tutor-directory__primary-pathway/);
  assert.match(component, /Primary pathway · K–6/);
  assert.doesNotMatch(component, /data-orbit-group=\{['"]foundations['"]\}/);
});

test('renders code-native background, path, and portrait depth planes', () => {
  const component = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('./tutor-directory.css', import.meta.url), 'utf8');
  assert.match(component, /tutor-directory__space-depth/);
  assert.match(component, /tutor-directory__path-depth/);
  assert.match(component, /tutor-directory__portrait-depth/);
  assert.match(styles, /tutor-directory__anchor-halo/);
  assert.match(styles, /tutor-directory__system-ring--inner/);
  assert.match(styles, /tutor-directory__focus\.has-selection[\s\S]*?var\(--directory-cream\)/);
});

test('uses tiny CSS-only drift that pauses locally and respects reduced motion', () => {
  const component = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('./tutor-directory.css', import.meta.url), 'utf8');

  assert.match(component, /tutor-directory__portrait-drift/);
  assert.match(styles, /@keyframes tutor-directory-ambient-drift/);
  assert.match(styles, /--td-drift-x:\s*[+-]?[3-6]px/);
  assert.match(styles, /--td-drift-y:\s*[+-]?[3-6]px/);
  const driftVectors = [...styles.matchAll(
    /--td-drift-x:\s*(-?\d+)px;\s*\n\s*--td-drift-y:\s*(-?\d+)px;/g,
  )].map(match => Math.hypot(Number(match[1]), Number(match[2])));
  assert.equal(driftVectors.length, 5, 'expected one authored drift vector per subject or bridge placement');
  for (const travel of driftVectors) {
    assert.ok(travel >= 3 && travel <= 6, `drift travel ${travel.toFixed(2)}px must remain within 3–6px`);
  }
  assert.match(styles, /from\s*\{\s*transform:\s*translate\(0, 0\);\s*\}/);
  assert.match(
    styles,
    /\.tutor-directory__portrait-button:hover\s+\.tutor-directory__portrait-drift[\s\S]*?animation-play-state:\s*paused/,
  );
  assert.match(
    styles,
    /\.tutor-directory__portrait-button:focus-visible\s+\.tutor-directory__portrait-drift/,
  );
  assert.match(
    styles,
    /\.tutor-directory__portrait-button\.is-selected\s+\.tutor-directory__portrait-drift/,
  );
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-directory__portrait-drift\s*\{[\s\S]*?animation:\s*none\s*!important/,
  );
});
