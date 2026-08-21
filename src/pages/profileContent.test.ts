import test from 'node:test';
import assert from 'node:assert/strict';
import { profileContentFor, profilePronounsFor, profileSubjectGroupsFor, profileSubjectTone } from './profileContent.ts';

test('uses the same subject tone names as the tutor-card subject tags', () => {
  assert.equal(profileSubjectTone('math'), 'math');
  assert.equal(profileSubjectTone('english'), 'english');
  assert.equal(profileSubjectTone('science'), 'science');
  assert.equal(profileSubjectTone('both'), 'both');
});

test('uses he and his for Mr tutor profiles, and she and her for Ms and Mrs profiles', () => {
  assert.deepEqual(profilePronounsFor('Mr Phillip C.'), { subject: 'he', possessive: 'his' });
  assert.deepEqual(profilePronounsFor('Ms Linda L.'), { subject: 'she', possessive: 'her' });
  assert.deepEqual(profilePronounsFor('Mrs Jenny N.'), { subject: 'she', possessive: 'her' });
});

test('groups related tutor levels into one colour-coded bubble per subject family', () => {
  assert.deepEqual(
    profileSubjectGroupsFor([
      'Primary (English & Mathematics)',
      'English (Yr 7–10)',
      'English Standard',
      'English Advanced',
    ]),
    [
      { category: 'primary', label: 'Primary (English & Mathematics)' },
      { category: 'english', label: 'English (Yr 7–10) · English Standard · English Advanced' },
    ],
  );
});

test('uses the tutor catalogue profile fields for the reusable profile sections', () => {
  const content = profileContentFor({
    motto: 'A clear fallback message.',
    profile: {
      tags: ['Confidence & positive mindset', 'Kind & empathetic', 'Resilience'],
      goals: 'Build confidence through purposeful lessons.',
      remembered: 'Students should feel valued and seen.',
      whyDA: 'DA gives educators room to teach with care.',
    },
  });

  assert.deepEqual(content.strengths, ['Confidence & positive mindset', 'Kind & empathetic', 'Resilience']);
  assert.equal(content.approach, 'Build confidence through purposeful lessons.');
  assert.equal(content.remembered, 'Students should feel valued and seen.');
  assert.equal(content.whyDA, 'DA gives educators room to teach with care.');
});

test('keeps profile sections populated when optional catalogue biography fields are absent', () => {
  const content = profileContentFor({ motto: 'Patient, structured teaching.' });

  assert.deepEqual(content.strengths, []);
  assert.equal(content.approach, 'Patient, structured teaching.');
  assert.equal(content.remembered, 'Patient, structured teaching.');
  assert.equal(content.whyDA, 'Patient, structured teaching.');
});
