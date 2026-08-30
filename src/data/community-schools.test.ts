import assert from 'node:assert/strict';
import test from 'node:test';
import { COMMUNITY_SCHOOLS } from './community-schools.ts';

test('keeps regional school visualisation data isolated and explicitly unverified until real data arrives', () => {
  assert.ok(COMMUNITY_SCHOOLS.length >= 70);
  assert.ok(COMMUNITY_SCHOOLS.every((school) => !school.verified && school.name === null));
});
