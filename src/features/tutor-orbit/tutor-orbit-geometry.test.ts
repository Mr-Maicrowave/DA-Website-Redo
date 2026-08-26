import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROTECTED_ZONES,
  SAFE_SECTORS,
  boundsForPose,
  boundsForSectorEnvelope,
  boundsForLabelEnvelope,
  geometryBandForWidth,
  poseForSector,
  rectsOverlap,
  type GeometryBand,
} from './tutor-orbit-geometry.ts';

const desktopBands: GeometryBand[] = ['wide', 'desktop'];
const allBands: GeometryBand[] = ['wide', 'desktop', 'tablet', 'mobile'];

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

test('portrait envelopes stay clear of protected zones across every geometry band', () => {
  for (const band of allBands) {
    const zones = PROTECTED_ZONES[band];
    for (const tier of ['inner', 'outer'] as const) {
      const diameter = tier === 'inner' ? zones.innerDiameter : zones.outerDiameter;
      for (const sector of SAFE_SECTORS[band][tier]) {
        for (let sample = 0; sample < 360; sample += 1) {
          const bounds = boundsForPose(poseForSector(sector, sample / 360), diameter);
          assert.equal(rectsOverlap(bounds, zones.centre, 28), false, `${band}:${sector.id}:centre`);
          assert.equal(rectsOverlap(bounds, zones.profile, 12), false, `${band}:${sector.id}:profile`);
          assert.equal(rectsOverlap(bounds, zones.headline, 12), false, `${band}:${sector.id}:headline`);
        }
      }
    }
  }
});

test('sector envelopes cannot collide at any independent phase', () => {
  for (const band of allBands) {
    const zones = PROTECTED_ZONES[band];
    const portraits = [
      ...SAFE_SECTORS[band].inner.map((sector) => ({ sector, diameter: zones.innerDiameter })),
      ...SAFE_SECTORS[band].outer.map((sector) => ({ sector, diameter: zones.outerDiameter })),
    ];
    for (let left = 0; left < portraits.length; left += 1) {
      for (let right = left + 1; right < portraits.length; right += 1) {
        for (let a = 0; a < 360; a += 1) {
          for (let b = 0; b < 360; b += 1) {
            const leftBounds = boundsForPose(poseForSector(portraits[left].sector, a / 360), portraits[left].diameter);
            const rightBounds = boundsForPose(poseForSector(portraits[right].sector, b / 360), portraits[right].diameter);
            assert.equal(rectsOverlap(leftBounds, rightBounds, 8), false, `${band}:${portraits[left].sector.id}:${portraits[right].sector.id}`);
          }
        }
      }
    }
  }
});

test('conservative sector envelopes guarantee continuous separation', () => {
  for (const band of allBands) {
    const zones = PROTECTED_ZONES[band];
    const portraits = [
      ...SAFE_SECTORS[band].inner.map((sector) => ({ sector, diameter: zones.innerDiameter })),
      ...SAFE_SECTORS[band].outer.map((sector) => ({ sector, diameter: zones.outerDiameter })),
    ];
    for (const { sector, diameter } of portraits) {
      const envelope = boundsForSectorEnvelope(sector, diameter);
      assert.equal(rectsOverlap(envelope, zones.centre, 28), false, `${band}:${sector.id}:centre-envelope`);
      assert.equal(rectsOverlap(envelope, zones.profile, 12), false, `${band}:${sector.id}:profile-envelope`);
      assert.equal(rectsOverlap(envelope, zones.headline, 12), false, `${band}:${sector.id}:headline-envelope`);
    }
    for (let left = 0; left < portraits.length; left += 1) {
      for (let right = left + 1; right < portraits.length; right += 1) {
        assert.equal(
          rectsOverlap(
            boundsForSectorEnvelope(portraits[left].sector, portraits[left].diameter),
            boundsForSectorEnvelope(portraits[right].sector, portraits[right].diameter),
            8,
          ),
          false,
          `${band}:${portraits[left].sector.id}:${portraits[right].sector.id}-envelope`,
        );
      }
    }
  }
});

test('authored label envelopes stay clear of every unrelated portrait and protected zone', () => {
  for (const band of desktopBands) {
    const zones = PROTECTED_ZONES[band];
    const portraits = [
      ...SAFE_SECTORS[band].inner.map((sector) => ({ sector, tier: 'inner' as const, diameter: zones.innerDiameter })),
      ...SAFE_SECTORS[band].outer.map((sector) => ({ sector, tier: 'outer' as const, diameter: zones.outerDiameter })),
    ];

    for (let sample = 0; sample < 360; sample += 1) {
      const progress = sample / 360;
      const posed = portraits.map((entry) => ({
        ...entry,
        pose: poseForSector(entry.sector, progress),
      }));
      const labels = posed.map((entry) => ({
        ...entry,
        bounds: boundsForLabelEnvelope(entry.sector, entry.pose, entry.diameter, entry.tier),
      }));

      for (let labelIndex = 0; labelIndex < labels.length; labelIndex += 1) {
        const label = labels[labelIndex];
        assert.equal(rectsOverlap(label.bounds, zones.centre, 8), false, `${band}:${label.sector.id}:label-centre`);
        assert.equal(rectsOverlap(label.bounds, zones.featuredBadge, 6), false, `${band}:${label.sector.id}:label-badge`);
        assert.equal(rectsOverlap(label.bounds, zones.profile, 8), false, `${band}:${label.sector.id}:label-profile`);
        assert.equal(rectsOverlap(label.bounds, zones.headline, 8), false, `${band}:${label.sector.id}:label-headline`);

        for (let portraitIndex = 0; portraitIndex < posed.length; portraitIndex += 1) {
          if (portraitIndex === labelIndex) continue;
          assert.equal(
            rectsOverlap(label.bounds, boundsForPose(posed[portraitIndex].pose, posed[portraitIndex].diameter), 6),
            false,
            `${band}:${label.sector.id}:label-portrait:${posed[portraitIndex].sector.id}`,
          );
        }
        for (let other = labelIndex + 1; other < labels.length; other += 1) {
          assert.equal(rectsOverlap(label.bounds, labels[other].bounds, 6), false, `${band}:${label.sector.id}:label-label:${labels[other].sector.id}`);
        }
      }
    }
  }
});
