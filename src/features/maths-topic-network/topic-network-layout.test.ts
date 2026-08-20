import test from 'node:test';
import assert from 'node:assert/strict';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS } from './topic-network-data.ts';
import {
  CENTER_X,
  CENTER_Y,
  computeOrganicLayout,
  computeTidyLayout,
  declutterLabels,
  type LabelBox,
} from './topic-network-layout.ts';

function radiusOf(x: number, y: number): number {
  return Math.hypot(x - CENTER_X, y - CENTER_Y);
}

test('organic layout keeps every core node within radius 85 of center, across many seeds', () => {
  for (let seed = 0; seed < 40; seed += 1) {
    const layout = computeOrganicLayout(seed);
    for (const core of CORE_TOPICS) {
      const r = radiusOf(layout.nodes[core.id].x, layout.nodes[core.id].y);
      assert.ok(r <= 85 + 1e-6, `seed ${seed}: core "${core.id}" radius ${r} exceeds 85`);
    }
  }
});

test('organic layout keeps every domain node at radius 150 or more, across many seeds', () => {
  for (let seed = 0; seed < 40; seed += 1) {
    const layout = computeOrganicLayout(seed);
    for (const domain of DOMAIN_TOPICS) {
      const r = radiusOf(layout.nodes[domain.id].x, layout.nodes[domain.id].y);
      assert.ok(r >= 150 - 1e-6, `seed ${seed}: domain "${domain.id}" radius ${r} is under 150`);
    }
  }
});

test('organic layout keeps every subtopic further out than its own parent domain, across many seeds', () => {
  for (let seed = 0; seed < 40; seed += 1) {
    const layout = computeOrganicLayout(seed);
    for (const sub of SUBTOPICS) {
      const subR = radiusOf(layout.nodes[sub.id].x, layout.nodes[sub.id].y);
      const parentR = radiusOf(layout.nodes[sub.parent].x, layout.nodes[sub.parent].y);
      assert.ok(subR >= parentR + 85 - 1e-6, `seed ${seed}: "${sub.id}" (r=${subR}) is not far enough past parent "${sub.parent}" (r=${parentR})`);
    }
  }
});

test('organic layout is deterministic for a fixed seed', () => {
  const a = computeOrganicLayout(7);
  const b = computeOrganicLayout(7);
  assert.deepStrictEqual(a, b);
});

test('organic layout differs across different seeds', () => {
  const a = computeOrganicLayout(1);
  const b = computeOrganicLayout(2);
  assert.notDeepStrictEqual(a, b);
});

test('tidy layout places every core node at exactly radius 42', () => {
  const layout = computeTidyLayout();
  for (const core of CORE_TOPICS) {
    const r = radiusOf(layout.nodes[core.id].x, layout.nodes[core.id].y);
    assert.ok(Math.abs(r - 42) < 1e-9, `core "${core.id}" radius ${r} is not 42`);
  }
});

test('tidy layout places every domain node at exactly radius 250', () => {
  const layout = computeTidyLayout();
  for (const domain of DOMAIN_TOPICS) {
    const r = radiusOf(layout.nodes[domain.id].x, layout.nodes[domain.id].y);
    assert.ok(Math.abs(r - 250) < 1e-9, `domain "${domain.id}" radius ${r} is not 250`);
  }
});

test('tidy layout is fully deterministic', () => {
  assert.deepStrictEqual(computeTidyLayout(), computeTidyLayout());
});

test('both layouts produce one edge per domain, one per subtopic, and one per cross link', () => {
  for (const layout of [computeOrganicLayout(3), computeTidyLayout()]) {
    assert.equal(layout.edges.filter((e) => e.kind === 'ring1').length, DOMAIN_TOPICS.length);
    assert.equal(layout.edges.filter((e) => e.kind === 'ring2').length, SUBTOPICS.length);
    assert.equal(layout.edges.filter((e) => e.kind === 'cross').length, 2);
  }
});

test('declutterLabels pushes two fully overlapping boxes apart', () => {
  const boxes: LabelBox[] = [
    { id: 'a', x: 0, y: 0, width: 40, height: 12 },
    { id: 'b', x: 0, y: 0, width: 40, height: 12 },
  ];
  const deltas = declutterLabels(boxes);
  const a = deltas.find((d) => d.id === 'a')!;
  const b = deltas.find((d) => d.id === 'b')!;
  const separation = Math.hypot(b.dx - a.dx, b.dy - a.dy);
  assert.ok(separation > 10, `expected boxes to separate, got ${separation}`);
});

test('declutterLabels leaves already-separated boxes untouched', () => {
  const boxes: LabelBox[] = [
    { id: 'a', x: 0, y: 0, width: 20, height: 10 },
    { id: 'b', x: 500, y: 500, width: 20, height: 10 },
  ];
  const deltas = declutterLabels(boxes);
  for (const d of deltas) {
    assert.equal(d.dx, 0);
    assert.equal(d.dy, 0);
  }
});
