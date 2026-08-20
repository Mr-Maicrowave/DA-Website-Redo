import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS, CROSS_LINKS, type Subtopic } from './topic-network-data.ts';

export const CENTER_X = 450;
export const CENTER_Y = 450;
export const VIEWBOX_WIDTH = 900;
export const VIEWBOX_HEIGHT = 920;

export type Tier = 'core' | 'domain' | 'sub';

export interface LayoutNode {
  id: string;
  tier: Tier;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
}

export interface LayoutEdge {
  from: string;
  to: string;
  kind: 'ring1' | 'ring2' | 'cross';
  controlX: number;
  controlY: number;
}

export interface TopicLayout {
  nodes: Record<string, LayoutNode>;
  edges: LayoutEdge[];
}

/** Deterministic PRNG (mulberry32) — same seed always produces the same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toXY(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CENTER_X + radius * Math.cos(rad), CENTER_Y + radius * Math.sin(rad)];
}

function labelAnchor(x: number, y: number, offset: number): [number, number] {
  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const r = Math.hypot(dx, dy) || 0.01;
  return [x + (dx / r) * offset, y + (dy / r) * offset];
}

const LABEL_OFFSET: Record<Tier, number> = { core: 58, domain: 30, sub: 22 };

interface RawEdge {
  from: string;
  to: string;
  kind: LayoutEdge['kind'];
}

function buildRawEdges(): RawEdge[] {
  const ring1: RawEdge[] = DOMAIN_TOPICS.map((d) => ({ from: d.corePrerequisite, to: d.id, kind: 'ring1' as const }));
  const ring2: RawEdge[] = SUBTOPICS.map((s) => ({ from: s.parent, to: s.id, kind: 'ring2' as const }));
  const cross: RawEdge[] = CROSS_LINKS.map((c) => ({ from: c.from, to: c.to, kind: 'cross' as const }));
  return [...ring1, ...ring2, ...cross];
}

interface SimNode {
  id: string;
  tier: Tier;
  x: number;
  y: number;
  pad: number;
  bandR: number;
  parent?: string;
}

function finalizeLayout(simNodes: SimNode[], byId: Map<string, SimNode>, rawEdges: RawEdge[]): TopicLayout {
  const nodes: Record<string, LayoutNode> = {};
  for (const n of simNodes) {
    const [labelX, labelY] = labelAnchor(n.x, n.y, LABEL_OFFSET[n.tier]);
    nodes[n.id] = { id: n.id, tier: n.tier, x: n.x, y: n.y, labelX, labelY };
  }
  const edges: LayoutEdge[] = rawEdges.map((edge) => {
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    return { from: edge.from, to: edge.to, kind: edge.kind, controlX: (a.x + b.x) / 2, controlY: (a.y + b.y) / 2 };
  });
  return { nodes, edges };
}

const SIM_ITERATIONS = 260;
const EDGE_TARGET: Record<LayoutEdge['kind'], number> = { ring1: 205, ring2: 165, cross: 260 };
const EDGE_STRENGTH: Record<LayoutEdge['kind'], number> = { ring1: 0.05, ring2: 0.05, cross: 0.012 };

/**
 * Runs a small force relaxation (nodes repel, edges act as springs, a weak radial
 * force keeps each tier roughly in its band), then a hard clamp that guarantees the
 * tier ordering (core innermost, domains clear of the core zone, each subtopic past
 * its own parent) without ever touching angle. Same seed always produces the same
 * result; different seeds produce different, but always hierarchy-safe, results.
 */
export function computeOrganicLayout(seed: number): TopicLayout {
  const rng = mulberry32(seed);
  const jitter = (range: number) => (rng() * 2 - 1) * range;

  const simNodes: SimNode[] = [];
  const byId = new Map<string, SimNode>();
  const push = (n: SimNode) => {
    simNodes.push(n);
    byId.set(n.id, n);
  };

  for (const core of CORE_TOPICS) {
    const [x, y] = toXY(rng() * 360, 30 + rng() * 40);
    push({ id: core.id, tier: 'core', x, y, pad: 46, bandR: 45 });
  }
  for (const domain of DOMAIN_TOPICS) {
    const [x, y] = toXY(rng() * 360, 190 + rng() * 140);
    push({ id: domain.id, tier: 'domain', x, y, pad: 58, bandR: 210 + jitter(55) });
  }
  for (const sub of SUBTOPICS) {
    const [x, y] = toXY(rng() * 360, 330 + rng() * 160);
    push({ id: sub.id, tier: 'sub', x, y, pad: 34, bandR: 0, parent: sub.parent });
  }

  const rawEdges = buildRawEdges();

  for (let iter = 0; iter < SIM_ITERATIONS; iter += 1) {
    const fx = new Array(simNodes.length).fill(0);
    const fy = new Array(simNodes.length).fill(0);

    for (let i = 0; i < simNodes.length; i += 1) {
      for (let j = i + 1; j < simNodes.length; j += 1) {
        const a = simNodes[i];
        const b = simNodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const ux = dx / dist;
        const uy = dy / dist;
        const minDist = a.pad + b.pad;
        if (dist < minDist) {
          const f = (minDist - dist) * 0.5;
          fx[i] -= ux * f; fy[i] -= uy * f;
          fx[j] += ux * f; fy[j] += uy * f;
        } else {
          const f = Math.min(3, 1400 / (dist * dist));
          fx[i] -= ux * f; fy[i] -= uy * f;
          fx[j] += ux * f; fy[j] += uy * f;
        }
      }
    }

    for (const edge of rawEdges) {
      const a = byId.get(edge.from)!;
      const b = byId.get(edge.to)!;
      const ia = simNodes.indexOf(a);
      const ib = simNodes.indexOf(b);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const ux = dx / dist;
      const uy = dy / dist;
      const diff = (dist - EDGE_TARGET[edge.kind]) * EDGE_STRENGTH[edge.kind];
      fx[ia] += ux * diff; fy[ia] += uy * diff;
      fx[ib] -= ux * diff; fy[ib] -= uy * diff;
    }

    simNodes.forEach((n, i) => {
      if (n.tier === 'sub' && n.parent) {
        const parent = byId.get(n.parent)!;
        n.bandR = Math.hypot(parent.x - CENTER_X, parent.y - CENTER_Y) + 150;
      }
      const dx = n.x - CENTER_X;
      const dy = n.y - CENTER_Y;
      const r = Math.hypot(dx, dy) || 0.01;
      const diff = (n.bandR - r) * 0.08;
      fx[i] += (dx / r) * diff; fy[i] += (dy / r) * diff;
    });

    const cool = 1 - iter / (SIM_ITERATIONS * 1.4);
    simNodes.forEach((n, i) => {
      n.x += fx[i] * 0.6 * cool;
      n.y += fy[i] * 0.6 * cool;
    });
  }

  // Hierarchy safety clamp. Order matters: simNodes is core, then domain, then sub
  // (matching the push() order above), so by the time a subtopic is clamped its
  // parent domain has already been clamped to its final radius.
  for (const n of simNodes) {
    const dx = n.x - CENTER_X;
    const dy = n.y - CENTER_Y;
    const r = Math.hypot(dx, dy) || 0.01;
    let minR = 0;
    let maxR = Infinity;
    if (n.tier === 'core') {
      minR = 20; maxR = 85;
    } else if (n.tier === 'domain') {
      minR = 150; maxR = 380;
    } else {
      const parent = byId.get(n.parent!)!;
      const parentR = Math.hypot(parent.x - CENTER_X, parent.y - CENTER_Y);
      minR = parentR + 85; maxR = parentR + 300;
    }
    const clamped = Math.min(maxR, Math.max(minR, r));
    if (Math.abs(clamped - r) > 1e-9) {
      n.x = CENTER_X + (dx / r) * clamped;
      n.y = CENTER_Y + (dy / r) * clamped;
    }
  }

  return finalizeLayout(simNodes, byId, rawEdges);
}

/** The deterministic "snap to tidy" layout — same formula every time, no randomness. */
export function computeTidyLayout(): TopicLayout {
  const simNodes: SimNode[] = [];
  const byId = new Map<string, SimNode>();
  const angleById = new Map<string, number>();

  CORE_TOPICS.forEach((core, i) => {
    const angle = -45 + i * 90;
    const [x, y] = toXY(angle, 42);
    const node: SimNode = { id: core.id, tier: 'core', x, y, pad: 0, bandR: 0 };
    simNodes.push(node);
    byId.set(node.id, node);
    angleById.set(node.id, angle);
  });

  DOMAIN_TOPICS.forEach((domain, i) => {
    const angle = -90 + i * (360 / DOMAIN_TOPICS.length);
    const [x, y] = toXY(angle, 250);
    const node: SimNode = { id: domain.id, tier: 'domain', x, y, pad: 0, bandR: 0 };
    simNodes.push(node);
    byId.set(node.id, node);
    angleById.set(node.id, angle);
  });

  const byParent = new Map<string, Subtopic[]>();
  for (const sub of SUBTOPICS) {
    const list = byParent.get(sub.parent) ?? [];
    list.push(sub);
    byParent.set(sub.parent, list);
  }
  for (const [parentId, kids] of byParent) {
    const parentAngle = angleById.get(parentId)!;
    const spread = 46;
    kids.forEach((sub, idx) => {
      const offset = kids.length > 1 ? -spread / 2 + idx * (spread / (kids.length - 1)) : 0;
      const [x, y] = toXY(parentAngle + offset, 400);
      const node: SimNode = { id: sub.id, tier: 'sub', x, y, pad: 0, bandR: 0, parent: parentId };
      simNodes.push(node);
      byId.set(node.id, node);
    });
  }

  return finalizeLayout(simNodes, byId, buildRawEdges());
}

export interface LabelBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LabelDelta {
  id: string;
  dx: number;
  dy: number;
}

const DECLUTTER_ITERATIONS = 8;
const DECLUTTER_PADDING = 4;
const DECLUTTER_PUSH = 3;

/**
 * Given real measured label bounding boxes (from SVGTextElement.getBBox(), which
 * only exists in a browser), returns a per-label (dx, dy) nudge that separates any
 * that overlap. Pure function — the caller measures, this just does the pushing.
 */
export function declutterLabels(boxes: readonly LabelBox[]): LabelDelta[] {
  const working = boxes.map((b) => ({ ...b, dx: 0, dy: 0 }));

  for (let iter = 0; iter < DECLUTTER_ITERATIONS; iter += 1) {
    let moved = false;
    for (let i = 0; i < working.length; i += 1) {
      for (let j = i + 1; j < working.length; j += 1) {
        const a = working[i];
        const b = working[j];
        const ax = a.x + a.dx;
        const ay = a.y + a.dy;
        const bx = b.x + b.dx;
        const by = b.y + b.dy;
        const overlaps = ax < bx + b.width + DECLUTTER_PADDING
          && ax + a.width + DECLUTTER_PADDING > bx
          && ay < by + b.height + DECLUTTER_PADDING
          && ay + a.height + DECLUTTER_PADDING > by;
        if (!overlaps) continue;
        moved = true;
        let ddx = (bx + b.width / 2) - (ax + a.width / 2);
        let ddy = (by + b.height / 2) - (ay + a.height / 2);
        let dist = Math.hypot(ddx, ddy);
        if (dist < 1e-9) {
          // Perfectly overlapping: use a default direction (horizontal)
          ddx = 1;
          ddy = 0;
        } else {
          ddx /= dist; ddy /= dist;
        }
        a.dx -= ddx * DECLUTTER_PUSH; a.dy -= ddy * DECLUTTER_PUSH;
        b.dx += ddx * DECLUTTER_PUSH; b.dy += ddy * DECLUTTER_PUSH;
      }
    }
    if (!moved) break;
  }

  return working.map((w) => ({ id: w.id, dx: w.dx, dy: w.dy }));
}
