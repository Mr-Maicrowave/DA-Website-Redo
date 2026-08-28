import test from 'node:test';
import assert from 'node:assert/strict';
import { PHYSICAL_CENTRES, resolveCentre, shouldShowCentreSwitcher } from './physical-centres.ts';

test('models scalable physical centre IDs and Canley Heights inheritance', () => {
  assert.deepEqual(PHYSICAL_CENTRES.map((centre) => centre.id), ['canley-heights-building-1', 'canley-heights-building-2']);
  const buildingOne = resolveCentre('canley-heights-building-1');
  assert.equal(buildingOne.effective.phone, '0401 940 207');
  assert.equal(buildingOne.group.mapSceneId, 'canley-heights');
  assert.equal('phone' in PHYSICAL_CENTRES[0], false);
});

test('falls back safely and only permits selection for multiple destinations', () => {
  assert.equal(resolveCentre('unknown').centre.id, 'canley-heights-building-1');
  assert.equal(shouldShowCentreSwitcher(PHYSICAL_CENTRES), true);
  assert.equal(shouldShowCentreSwitcher(PHYSICAL_CENTRES.slice(0, 1)), false);
});
