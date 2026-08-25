import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROTECTED_ZONES,
  SAFE_SECTORS,
  boundsForPose,
  geometryBandForWidth,
  poseForSector,
  rectsOverlap,
  type GeometryBand,
} from './tutor-orbit-geometry.ts';

const desktopBands: GeometryBand[] = ['wide', 'desktop'];

test('maps required widths to stable geometry bands', () => {
  assert.equal(geometryBandForWidth(1920), 'wide');
  assert.equal(geometryBandForWidth(1440), 'desktop');
  assert.equal(geometryBandForWidth(1366), 'desktop');
  assert.equal(geometryBandForWidth(1024), 'tablet');
  assert.equal(geometryBandForWidth(390), 'mobile');
});

test('defines five primary and nine secondary desktop sectors', () => {
  for (const band of desktopBands) {
    assert.equal(SAFE_SECTORS[band].inner.length, 5);
    assert.equal(SAFE_SECTORS[band].outer.length, 9);
  }
});

test('portrait envelopes stay clear of protected desktop zones', () => {
  for (const band of desktopBands) {
    const zones = PROTECTED_ZONES[band];
    for (const tier of ['inner', 'outer'] as const) {
      const diameter = tier === 'inner' ? zones.innerDiameter : zones.outerDiameter;
      for (const sector of SAFE_SECTORS[band][tier]) {
        for (let sample = 0; sample < 120; sample += 1) {
          const bounds = boundsForPose(poseForSector(sector, sample / 120), diameter);
          assert.equal(rectsOverlap(bounds, zones.centre, 28), false, `${band}:${sector.id}:centre`);
          assert.equal(rectsOverlap(bounds, zones.profile, 12), false, `${band}:${sector.id}:profile`);
          assert.equal(rectsOverlap(bounds, zones.headline, 12), false, `${band}:${sector.id}:headline`);
        }
      }
    }
  }
});

test('sector envelopes cannot collide at any independent phase', () => {
  for (const band of desktopBands) {
    const zones = PROTECTED_ZONES[band];
    const portraits = [
      ...SAFE_SECTORS[band].inner.map((sector) => ({ sector, diameter: zones.innerDiameter })),
      ...SAFE_SECTORS[band].outer.map((sector) => ({ sector, diameter: zones.outerDiameter })),
    ];
    for (let left = 0; left < portraits.length; left += 1) {
      for (let right = left + 1; right < portraits.length; right += 1) {
        for (let a = 0; a < 24; a += 1) {
          for (let b = 0; b < 24; b += 1) {
            const leftBounds = boundsForPose(poseForSector(portraits[left].sector, a / 24), portraits[left].diameter);
            const rightBounds = boundsForPose(poseForSector(portraits[right].sector, b / 24), portraits[right].diameter);
            assert.equal(rectsOverlap(leftBounds, rightBounds, 8), false, `${band}:${portraits[left].sector.id}:${portraits[right].sector.id}`);
          }
        }
      }
    }
  }
});
