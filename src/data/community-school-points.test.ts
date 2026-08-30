import assert from 'node:assert/strict';
import test from 'node:test';
import { COMMUNITY_MOCK_REGIONAL_SCHOOLS } from './community-school-points.ts';

test('keeps temporary regional school visualisation data isolated and explicitly unverified', () => {
  assert.ok(COMMUNITY_MOCK_REGIONAL_SCHOOLS.length >= 70);
  assert.ok(COMMUNITY_MOCK_REGIONAL_SCHOOLS.every((point) => point.mock && !point.verified && point.name === null));
});
