import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COLLISION_RULES,
  PROCESSION_BASE,
  frontNodeTop,
  handoverStride,
  nodesCollide,
  occupantIndex,
  platePosition,
  poseAt,
  processionBandForWidth,
  ringGeometryFor,
  stationBaseAngle,
  type ProcessionBand,
  type StageBox,
} from './procession-geometry.ts';

const BANDS: ProcessionBand[] = ['wide', 'desktop', 'tablet', 'mobile'];

const STAGE: Record<ProcessionBand, StageBox> = {
  wide: { width: 1320, height: 800 },
  desktop: { width: 1080, height: 740 },
  tablet: { width: 720, height: 620 },
  mobile: { width: 380, height: 560 },
};

test('maps widths to procession bands', () => {
  assert.equal(processionBandForWidth(1920), 'wide');
  assert.equal(processionBandForWidth(1440), 'desktop');
  assert.equal(processionBandForWidth(900), 'tablet');
  assert.equal(processionBandForWidth(390), 'mobile');
});

test('depth drives z-order consistently with position', () => {
  const ring = ringGeometryFor('desktop', STAGE.desktop);
  const front = poseAt(90, ring);
  const rear = poseAt(270, ring);
  const side = poseAt(0, ring);

  assert.equal(front.depth, 1);
  assert.equal(rear.depth, 0);
  assert.ok(Math.abs(side.depth - 0.5) < 1e-9);
  assert.ok(front.z > 500, 'front arc draws in front of the featured educator');
  assert.ok(rear.z < 500, 'rear arc draws behind the featured educator');
  assert.ok(front.size > rear.size);
  assert.ok(front.opacity > rear.opacity);
});

test('blur never exceeds the legibility ceiling', () => {
  for (const band of BANDS) {
    const ring = ringGeometryFor(band, STAGE[band]);
    for (let theta = 0; theta < 360; theta += 1) {
      const pose = poseAt(theta, ring);
      assert.ok(pose.blur <= 1.2 * ring.scale + 1e-9, `${band} blur at ${theta}`);
      assert.ok(pose.opacity >= 0.55 - 1e-9, `${band} opacity at ${theta}`);
    }
  }
});

test('only the front arc is ever labelled, and never more than four at once', () => {
  for (const band of BANDS) {
    const ring = ringGeometryFor(band, STAGE[band]);
    for (let rotation = 0; rotation < 360; rotation += 1) {
      let labelled = 0;
      for (let i = 0; i < ring.stations; i += 1) {
        const pose = poseAt(stationBaseAngle(i, ring.stations) + rotation, ring);
        if (pose.labelOpacity > 0) {
          labelled += 1;
          assert.ok(pose.depth >= 0.62, `${band} laballed a rear educator at ${rotation}`);
        }
      }
      assert.ok(labelled <= 4, `${band} showed ${labelled} names at rotation ${rotation}`);
    }
  }
});

test('no station ever collides with another across a full revolution', () => {
  for (const band of BANDS) {
    const ring = ringGeometryFor(band, STAGE[band]);
    for (let rotation = 0; rotation < 360; rotation += 0.5) {
      const poses = Array.from({ length: ring.stations }, (_, i) =>
        poseAt(stationBaseAngle(i, ring.stations) + rotation, ring));
      for (let a = 0; a < poses.length; a += 1) {
        for (let b = a + 1; b < poses.length; b += 1) {
          assert.ok(
            !nodesCollide(poses[a], poses[b], ring.scale, COLLISION_RULES),
            `${band}: stations ${a}/${b} collide at rotation ${rotation}`,
          );
        }
      }
    }
  }
});

test('the name plate always clears the nearest node', () => {
  for (const band of BANDS) {
    const ring = ringGeometryFor(band, STAGE[band]);
    const plate = platePosition(ring);
    assert.ok(
      plate.top + plate.height < frontNodeTop(ring),
      `${band}: plate bottom ${plate.top + plate.height} overlaps front node top ${frontNodeTop(ring)}`,
    );
  }
});

test('the assembly fits inside the stage box it was measured against', () => {
  for (const band of BANDS) {
    const ring = ringGeometryFor(band, STAGE[band]);
    const halfWidth = ring.rx * ring.scale + ((ring.nodeMin + ring.nodeSpan) * ring.scale) / 2;
    assert.ok(halfWidth * 2 <= STAGE[band].width, `${band} overflows horizontally`);
  }
});

test('every educator eventually reaches the ring, with no duplicates on it', () => {
  for (const band of BANDS) {
    const base = PROCESSION_BASE[band];
    const pool = 14;
    const seen = new Set<number>();
    for (let rotation = 0; rotation < 360 * 6; rotation += 1.5) {
      const occupants = Array.from({ length: base.stations }, (_, i) =>
        occupantIndex(i, base.stations, stationBaseAngle(i, base.stations), rotation, pool));
      assert.equal(new Set(occupants).size, occupants.length,
        `${band}: duplicate educator on the ring at rotation ${rotation}`);
      occupants.forEach((o) => seen.add(o));
    }
    assert.equal(seen.size, pool, `${band}: only ${seen.size} of ${pool} educators ever appeared`);
    assert.ok(handoverStride(base.stations, pool) <= pool - base.stations,
      `${band}: handover stride is large enough to duplicate an educator`);
  }
});
