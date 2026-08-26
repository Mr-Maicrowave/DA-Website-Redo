# Maths Topic Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-driven, organic "constellation" network diagram of Years 7–12 maths topics to `src/pages/subjects/Mathematics.tsx` — a credibility/wow visual, not a navigation tool.

**Architecture:** A self-contained feature folder (`src/features/maths-topic-network/`) with pure, unit-tested data/layout modules underneath a React component tree: a top-level wrapper picks desktop diagram vs. mobile accordion (`useIsMobile`), the desktop diagram owns a pinned Framer Motion scroll-scrub (mirroring `VisualIntro.tsx`/`TransformationTimeline.tsx`), and imperative ref-based DOM writes handle the two things Framer Motion doesn't cleanly cover: one-time label decluttering (needs real `getBBox()` measurements) and the organic↔tidy layout tween (needs synchronized node + edge-curve + label movement).

**Tech Stack:** React 18 + TypeScript, Framer Motion 12 (`useScroll`, `useTransform`, `useReducedMotion`), Tailwind (arbitrary hex values, matching this page's existing convention — no new design-system tokens), `node:test` for pure-logic unit tests (this repo's existing convention, see `hsc-maths-pathway.test.ts`).

## Global Constraints

- SVG viewBox is `0 0 900 920`, center at `(450, 450)` — every coordinate in every task uses this coordinate space.
- No new npm dependencies. Framer Motion, React, and TypeScript are already installed; everything else is hand-written.
- Pure logic (data integrity, layout math, easing) gets `node:test` unit tests, run via `node --test --experimental-strip-types <path>`. React components do **not** get render tests (this repo has no `@testing-library`/`jsdom`/`vitest`) — they're verified via `npm run lint`, `npm run build:dev`, and manual checks in `npm run dev`, matching how every other feature in this codebase is verified.
- Respect `prefers-reduced-motion` (via Framer Motion's `useReducedMotion()`, already used elsewhere in `Mathematics.tsx`) — when reduced motion is requested, skip the pinned scroll-scrub and render the fully-grown state immediately.
- Colors (exact values, validated in mockups): canvas `linear-gradient(160deg, #071629 0%, #0b294d 100%)`; core nodes `#c9a227`/`#e0bd4b`; link stroke `#cdd8ea` at 38% opacity; cross-link stroke `#f1df9a` dashed; label colors `#f8ecc4` (core), `#ffffff` (domain), `#c3d1e6` (subtopic).
- Domain colors: Functions `#6fb3f0`/`#8ecdfb`, Trigonometry `#f2b25a`/`#f7c983`, Calculus `#6fd6a8`/`#94e3c0`, Probability `#b48ef0`/`#c8aef7`, Statistics `#ef8fb0`/`#f4aec7`, Geometry `#5fd0d6`/`#8fe1e5`, Financial Maths `#e0c25a`/`#ecd587`.

---

## Task 1: Topic data model

**Files:**
- Create: `src/features/maths-topic-network/topic-network-data.ts`
- Test: `src/features/maths-topic-network/topic-network-data.test.ts`

**Interfaces:**
- Produces: `CoreTopic`, `DomainTopic`, `Subtopic`, `CrossLink` types; `CORE_TOPICS: readonly CoreTopic[]`, `DOMAIN_TOPICS: readonly DomainTopic[]`, `SUBTOPICS: readonly Subtopic[]`, `CROSS_LINKS: readonly CrossLink[]`.

- [ ] **Step 1: Write the failing data-integrity tests**

```ts
// src/features/maths-topic-network/topic-network-data.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS, CROSS_LINKS } from './topic-network-data.ts';

test("every domain's corePrerequisite references a real core topic id", () => {
  const coreIds = new Set(CORE_TOPICS.map((c) => c.id));
  for (const domain of DOMAIN_TOPICS) {
    assert.ok(coreIds.has(domain.corePrerequisite), `${domain.id} references missing core topic "${domain.corePrerequisite}"`);
  }
});

test("every subtopic's parent references a real domain id", () => {
  const domainIds = new Set(DOMAIN_TOPICS.map((d) => d.id));
  for (const sub of SUBTOPICS) {
    assert.ok(domainIds.has(sub.parent), `${sub.id} references missing domain "${sub.parent}"`);
  }
});

test('every cross link references a real subtopic and a real domain', () => {
  const subIds = new Set(SUBTOPICS.map((s) => s.id));
  const domainIds = new Set(DOMAIN_TOPICS.map((d) => d.id));
  for (const link of CROSS_LINKS) {
    assert.ok(subIds.has(link.from), `cross link references missing subtopic "${link.from}"`);
    assert.ok(domainIds.has(link.to), `cross link references missing domain "${link.to}"`);
  }
});

test('all topic ids are unique across every tier', () => {
  const allIds = [
    ...CORE_TOPICS.map((c) => c.id),
    ...DOMAIN_TOPICS.map((d) => d.id),
    ...SUBTOPICS.map((s) => s.id),
  ];
  assert.equal(allIds.length, new Set(allIds).size, 'duplicate topic id found');
});

test('every domain has at least one subtopic', () => {
  const parentsWithKids = new Set(SUBTOPICS.map((s) => s.parent));
  for (const domain of DOMAIN_TOPICS) {
    assert.ok(parentsWithKids.has(domain.id), `${domain.id} has no subtopics`);
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-data.test.ts`
Expected: FAIL — `topic-network-data.ts` does not exist yet ("Cannot find module").

- [ ] **Step 3: Write the data model**

```ts
// src/features/maths-topic-network/topic-network-data.ts

export interface CoreTopic {
  id: string;
  label: string;
  blurb: string;
}

export interface DomainTopic {
  id: string;
  label: string;
  blurb: string;
  /** Fill used for this domain's node halo/bubble. */
  color: string;
  /** Fill used for this domain's (and its subtopics') solid dot. */
  dotColor: string;
  /** The one CoreTopic id this domain's edge connects back to. */
  corePrerequisite: string;
}

export interface Subtopic {
  id: string;
  parent: string;
  label: string;
  blurb: string;
}

export interface CrossLink {
  from: string; // Subtopic id
  to: string; // DomainTopic id
}

export const CORE_TOPICS: readonly CoreTopic[] = [
  { id: 'algebra', label: 'Algebra', blurb: 'The language every other branch is written in.' },
  { id: 'equations', label: 'Equations', blurb: 'Solving for the unknown — the core move behind almost every topic here.' },
  { id: 'integers', label: 'Integers', blurb: 'Whole numbers, positive and negative — the base number system.' },
  { id: 'directed-numbers', label: 'Directed Numbers', blurb: 'Sign rules used constantly from here out.' },
];

export const DOMAIN_TOPICS: readonly DomainTopic[] = [
  { id: 'functions', label: 'Functions', color: '#6fb3f0', dotColor: '#8ecdfb', corePrerequisite: 'equations', blurb: 'The bridge from algebra to calculus and graphing.' },
  { id: 'trig', label: 'Trigonometry', color: '#f2b25a', dotColor: '#f7c983', corePrerequisite: 'algebra', blurb: 'Angles, triangles and periodic behaviour.' },
  { id: 'calculus', label: 'Calculus', color: '#6fd6a8', dotColor: '#94e3c0', corePrerequisite: 'equations', blurb: 'Rates of change and accumulation.' },
  { id: 'probability', label: 'Probability', color: '#b48ef0', dotColor: '#c8aef7', corePrerequisite: 'directed-numbers', blurb: 'How likely events are.' },
  { id: 'statistics', label: 'Statistics', color: '#ef8fb0', dotColor: '#f4aec7', corePrerequisite: 'integers', blurb: 'Collecting, describing and interpreting data.' },
  { id: 'geometry', label: 'Geometry', color: '#5fd0d6', dotColor: '#8fe1e5', corePrerequisite: 'algebra', blurb: 'Shape, space and measurement.' },
  { id: 'financial', label: 'Financial Maths', color: '#e0c25a', dotColor: '#ecd587', corePrerequisite: 'directed-numbers', blurb: 'Interest, loans and growth.' },
];

export const SUBTOPICS: readonly Subtopic[] = [
  { id: 'venn-diagrams', parent: 'probability', label: 'Venn Diagrams', blurb: 'Visualising overlapping event sets.' },
  { id: 'tree-diagrams', parent: 'probability', label: 'Tree Diagrams', blurb: 'Mapping sequences of outcomes.' },
  { id: 'discrete-distributions', parent: 'probability', label: 'Discrete Distributions', blurb: 'Probability across countable outcomes.' },
  { id: 'continuous-distributions', parent: 'probability', label: 'Continuous Distributions', blurb: 'Probability across a continuous range.' },
  { id: 'differentiation', parent: 'calculus', label: 'Differentiation', blurb: 'Instantaneous rate of change.' },
  { id: 'integration', parent: 'calculus', label: 'Integration', blurb: 'Accumulating change.' },
  { id: 'polynomials', parent: 'functions', label: 'Polynomials', blurb: 'Functions built from powers of x.' },
  { id: 'exponentials-logs', parent: 'functions', label: 'Exponentials & Logs', blurb: 'Growth, decay, and their inverse.' },
  { id: 'trig-identities', parent: 'trig', label: 'Trig Identities', blurb: 'Relationships between sin, cos and tan.' },
  { id: 'non-right-angled-trig', parent: 'trig', label: 'Non-Right-Angled Trig', blurb: 'Sine and cosine rules.' },
  { id: 'bivariate-data', parent: 'statistics', label: 'Bivariate Data', blurb: 'Comparing two variables.' },
  { id: 'sampling', parent: 'statistics', label: 'Sampling', blurb: 'How data is collected.' },
  { id: 'circle-geometry', parent: 'geometry', label: 'Circle Geometry', blurb: 'Angle and chord properties.' },
  { id: 'similarity-congruence', parent: 'geometry', label: 'Similarity & Congruence', blurb: 'When shapes match in proportion.' },
  { id: 'compound-interest', parent: 'financial', label: 'Compound Interest', blurb: 'Growth applied repeatedly over time.' },
  { id: 'annuities-loans', parent: 'financial', label: 'Annuities & Loans', blurb: 'Regular payments modelled with equations.' },
];

export const CROSS_LINKS: readonly CrossLink[] = [
  { from: 'discrete-distributions', to: 'statistics' },
  { from: 'differentiation', to: 'trig' },
];
```

> **Content note for the user:** this list (topics, blurbs, domain→core-prerequisite assignments, cross-links) is the draft validated in the design mockups. Per the spec's Open Items, review the copy before this ships — editing it later only means touching this one file.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-data.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/topic-network-data.ts src/features/maths-topic-network/topic-network-data.test.ts
git commit -m "feat(maths-topic-network): add topic data model"
```

---

## Task 2: Layout engine — organic layout, tidy layout, label decluttering

**Files:**
- Create: `src/features/maths-topic-network/topic-network-layout.ts`
- Test: `src/features/maths-topic-network/topic-network-layout.test.ts`

**Interfaces:**
- Consumes: `CORE_TOPICS`, `DOMAIN_TOPICS`, `SUBTOPICS`, `CROSS_LINKS`, `Subtopic` from `./topic-network-data.ts` (Task 1).
- Produces: `CENTER_X = 450`, `CENTER_Y = 450`, `VIEWBOX_WIDTH = 900`, `VIEWBOX_HEIGHT = 920` (numbers); `Tier = 'core' | 'domain' | 'sub'`; `LayoutNode { id: string; tier: Tier; x: number; y: number; labelX: number; labelY: number }`; `LayoutEdge { from: string; to: string; kind: 'ring1' | 'ring2' | 'cross'; controlX: number; controlY: number }`; `TopicLayout { nodes: Record<string, LayoutNode>; edges: LayoutEdge[] }`; `mulberry32(seed: number): () => number`; `computeOrganicLayout(seed: number): TopicLayout`; `computeTidyLayout(): TopicLayout`; `LabelBox { id: string; x: number; y: number; width: number; height: number }`; `LabelDelta { id: string; dx: number; dy: number }`; `declutterLabels(boxes: readonly LabelBox[]): LabelDelta[]`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/maths-topic-network/topic-network-layout.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-layout.test.ts`
Expected: FAIL — `topic-network-layout.ts` does not exist yet.

- [ ] **Step 3: Write the layout engine**

```ts
// src/features/maths-topic-network/topic-network-layout.ts
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
    if (Math.abs(clamped - r) > 0.5) {
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
        const dist = Math.hypot(ddx, ddy) || 1;
        ddx /= dist; ddy /= dist;
        a.dx -= ddx * DECLUTTER_PUSH; a.dy -= ddy * DECLUTTER_PUSH;
        b.dx += ddx * DECLUTTER_PUSH; b.dy += ddy * DECLUTTER_PUSH;
      }
    }
    if (!moved) break;
  }

  return working.map((w) => ({ id: w.id, dx: w.dx, dy: w.dy }));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-layout.test.ts`
Expected: PASS (11 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/topic-network-layout.ts src/features/maths-topic-network/topic-network-layout.test.ts
git commit -m "feat(maths-topic-network): add organic/tidy layout engine and label decluttering"
```

---

## Task 3: Tween utility (easing)

**Files:**
- Create: `src/features/maths-topic-network/topic-network-tween.ts`
- Test: `src/features/maths-topic-network/topic-network-tween.test.ts`

**Interfaces:**
- Produces: `easeInOutCubic(p: number): number`; `animateValue(from: number, to: number, durationMs: number, onFrame: (value: number) => void): () => void` (the returned function cancels the animation).

This powers the organic↔tidy toggle in Task 6. `easeInOutCubic` is pure and tested directly; `animateValue` wraps `requestAnimationFrame`/`performance.now()`, which don't exist in `node:test`'s environment, so it's exercised manually in the browser instead (see Task 6's manual verification).

- [ ] **Step 1: Write the failing test**

```ts
// src/features/maths-topic-network/topic-network-tween.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { easeInOutCubic } from './topic-network-tween.ts';

test('easeInOutCubic starts at 0 and ends at 1', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
});

test('easeInOutCubic is symmetric around the midpoint', () => {
  assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
});

test('easeInOutCubic is monotonically increasing', () => {
  let previous = -1;
  for (let p = 0; p <= 1; p += 0.05) {
    const value = easeInOutCubic(p);
    assert.ok(value >= previous, `eased value decreased at p=${p}`);
    previous = value;
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-tween.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the tween utility**

```ts
// src/features/maths-topic-network/topic-network-tween.ts

export function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
}

/**
 * Animates a single numeric value from `from` to `to` over `durationMs`, calling
 * `onFrame` with the eased current value on every animation frame. Returns a
 * cancel function — call it to stop early (e.g. if the user clicks the toggle
 * again mid-animation).
 */
export function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onFrame: (value: number) => void,
): () => void {
  let cancelled = false;
  const start = performance.now();

  function step(now: number) {
    if (cancelled) return;
    const p = Math.min(1, (now - start) / durationMs);
    onFrame(from + (to - from) * easeInOutCubic(p));
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
  return () => {
    cancelled = true;
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/topic-network-tween.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/topic-network-tween.ts src/features/maths-topic-network/topic-network-tween.test.ts
git commit -m "feat(maths-topic-network): add tween easing utility"
```

---

## Task 4: Diagram shell — static organic render with label declutter

**Files:**
- Create: `src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx`
- Create: `src/features/maths-topic-network/maths-topic-network.css`

**Interfaces:**
- Consumes: everything from Task 1 (`topic-network-data.ts`) and Task 2 (`topic-network-layout.ts`) — specifically `CENTER_X`, `CENTER_Y`, `VIEWBOX_WIDTH`, `VIEWBOX_HEIGHT`, `computeOrganicLayout`, `computeTidyLayout`, `declutterLabels`, `LabelBox`, `TopicLayout`, `LayoutNode`.
- Produces: `MathsTopicNetworkDiagram` (default export, no props) for Task 5/6/9 to import and extend.

No `node:test` coverage for this task (React rendering isn't unit-tested in this repo). Verify with `npm run lint`, `npm run build:dev`, and visually in `npm run dev`.

- [ ] **Step 1: Write the CSS**

```css
/* src/features/maths-topic-network/maths-topic-network.css */

.maths-topic-network__panel {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  background: linear-gradient(160deg, #071629 0%, #0b294d 100%);
  box-shadow: 0 24px 60px rgba(7, 22, 41, 0.35);
}

.maths-topic-network__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.maths-topic-network__link {
  fill: none;
  stroke: #cdd8ea;
  stroke-opacity: 0.38;
  stroke-width: 1.5;
}

.maths-topic-network__link--cross {
  stroke: #f1df9a;
  stroke-opacity: 0.7;
  stroke-width: 1.4;
  stroke-dasharray: 3 4;
}

.maths-topic-network__leader {
  stroke-opacity: 0.26;
  stroke-width: 1;
}

.maths-topic-network__bubble {
  opacity: 0.15;
}

.maths-topic-network__halo {
  filter: blur(6px);
}

.maths-topic-network__dot {
  stroke: rgba(7, 22, 41, 0.5);
  stroke-width: 1.5;
}

.maths-topic-network__label {
  paint-order: stroke;
  stroke: #071629;
  stroke-width: 3px;
  stroke-linejoin: round;
  pointer-events: none;
}

.maths-topic-network__label--core {
  fill: #f8ecc4;
  font-size: 14.5px;
  font-weight: 800;
}

.maths-topic-network__label--domain {
  fill: #ffffff;
  font-size: 13.5px;
  font-weight: 800;
}

.maths-topic-network__label--sub {
  fill: #c3d1e6;
  font-size: 10.5px;
  font-weight: 700;
}

.maths-topic-network__hit {
  fill: transparent;
}
```

- [ ] **Step 2: Write the diagram component**

```tsx
// src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  CENTER_X,
  CENTER_Y,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  computeOrganicLayout,
  computeTidyLayout,
  declutterLabels,
  type LabelBox,
  type TopicLayout,
  type LayoutNode,
} from './topic-network-layout';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS } from './topic-network-data';
import './maths-topic-network.css';

const NODE_RADII: Record<LayoutNode['tier'], { bubble: number; halo: number; dot: number }> = {
  core: { bubble: 20, halo: 12, dot: 7 },
  domain: { bubble: 28, halo: 16, dot: 9 },
  sub: { bubble: 16, halo: 10, dot: 5.5 },
};

const LABEL_CLASS: Record<LayoutNode['tier'], string> = {
  core: 'maths-topic-network__label maths-topic-network__label--core',
  domain: 'maths-topic-network__label maths-topic-network__label--domain',
  sub: 'maths-topic-network__label maths-topic-network__label--sub',
};

function buildColorLookup(): Record<string, { fill: string; dot: string }> {
  const map: Record<string, { fill: string; dot: string }> = {};
  for (const core of CORE_TOPICS) map[core.id] = { fill: '#c9a227', dot: '#e0bd4b' };
  for (const domain of DOMAIN_TOPICS) map[domain.id] = { fill: domain.color, dot: domain.dotColor };
  for (const sub of SUBTOPICS) {
    const parent = DOMAIN_TOPICS.find((d) => d.id === sub.parent)!;
    map[sub.id] = { fill: parent.color, dot: parent.dotColor };
  }
  return map;
}

function anchorFor(labelX: number): 'start' | 'end' | 'middle' {
  if (labelX > CENTER_X + 4) return 'start';
  if (labelX < CENTER_X - 4) return 'end';
  return 'middle';
}

/** Applies declutter deltas to a layout's raw label positions, keyed by node id. */
function decluttered(layout: TopicLayout, deltas: { id: string; dx: number; dy: number }[]): Record<string, { x: number; y: number }> {
  const deltaById = new Map(deltas.map((d) => [d.id, d]));
  const result: Record<string, { x: number; y: number }> = {};
  for (const node of Object.values(layout.nodes)) {
    const d = deltaById.get(node.id);
    result[node.id] = { x: node.labelX + (d?.dx ?? 0), y: node.labelY + (d?.dy ?? 0) };
  }
  return result;
}

export default function MathsTopicNetworkDiagram() {
  const seedRef = useRef<number>(Math.floor(Date.now() ^ (performance.now() * 1000)) >>> 0);
  const organicLayout = useMemo<TopicLayout>(() => computeOrganicLayout(seedRef.current), []);
  const tidyLayout = useMemo<TopicLayout>(() => computeTidyLayout(), []);

  const [organicLabels, setOrganicLabels] = useState(() =>
    Object.fromEntries(Object.values(organicLayout.nodes).map((n) => [n.id, { x: n.labelX, y: n.labelY }])),
  );
  const [tidyLabels, setTidyLabels] = useState(() =>
    Object.fromEntries(Object.values(tidyLayout.nodes).map((n) => [n.id, { x: n.labelX, y: n.labelY }])),
  );

  const textRefs = useRef<Record<string, SVGTextElement | null>>({});
  const allNodeIds = useMemo(() => Object.keys(organicLayout.nodes), [organicLayout]);
  const colorById = useMemo(buildColorLookup, []);

  // Declutter both layouts once, using real measured label boxes. Runs before the
  // browser paints (useLayoutEffect), so temporarily moving labels to measure the
  // tidy layout never causes a visible flash.
  useLayoutEffect(() => {
    function measure(layout: TopicLayout): LabelBox[] {
      return allNodeIds.map((id) => {
        const node = layout.nodes[id];
        const el = textRefs.current[id];
        if (el) {
          el.setAttribute('x', String(node.labelX));
          el.setAttribute('y', String(node.labelY));
        }
        const box = el?.getBBox() ?? { x: node.labelX, y: node.labelY, width: 0, height: 0 };
        return { id, x: box.x, y: box.y, width: box.width, height: box.height };
      });
    }

    const organicDeltas = declutterLabels(measure(organicLayout));
    const tidyDeltas = declutterLabels(measure(tidyLayout));

    setOrganicLabels(decluttered(organicLayout, organicDeltas));
    setTidyLabels(decluttered(tidyLayout, tidyDeltas));

    // Restore the visible (organic) label positions before paint.
    for (const id of allNodeIds) {
      const el = textRefs.current[id];
      const pos = decluttered(organicLayout, organicDeltas)[id];
      if (el && pos) {
        el.setAttribute('x', String(pos.x));
        el.setAttribute('y', String(pos.y));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nodesByTier = {
    core: Object.values(organicLayout.nodes).filter((n) => n.tier === 'core'),
    domain: Object.values(organicLayout.nodes).filter((n) => n.tier === 'domain'),
    sub: Object.values(organicLayout.nodes).filter((n) => n.tier === 'sub'),
  };

  function renderNode(node: LayoutNode) {
    const radii = NODE_RADII[node.tier];
    const colors = colorById[node.id];
    const label = organicLabels[node.id] ?? { x: node.labelX, y: node.labelY };
    return (
      <g key={node.id} data-id={node.id} data-tier={node.tier}>
        <circle className="maths-topic-network__bubble" cx={node.x} cy={node.y} r={radii.bubble} fill={colors.fill} />
        <circle className="maths-topic-network__halo" cx={node.x} cy={node.y} r={radii.halo} fill={colors.fill} />
        <circle className="maths-topic-network__dot" cx={node.x} cy={node.y} r={radii.dot} fill={colors.dot} />
        <line className="maths-topic-network__link maths-topic-network__leader" x1={node.x} y1={node.y} x2={label.x} y2={label.y} />
        <text
          ref={(el) => { textRefs.current[node.id] = el; }}
          className={LABEL_CLASS[node.tier]}
          x={label.x}
          y={label.y}
          textAnchor={anchorFor(label.x)}
        >
          {node.tier === 'core'
            ? CORE_TOPICS.find((c) => c.id === node.id)?.label
            : node.tier === 'domain'
              ? DOMAIN_TOPICS.find((d) => d.id === node.id)?.label
              : SUBTOPICS.find((s) => s.id === node.id)?.label}
        </text>
        <circle className="maths-topic-network__hit" cx={node.x} cy={node.y} r={radii.bubble + 8} />
      </g>
    );
  }

  return (
    <div className="maths-topic-network__panel" style={{ height: '92vh', maxHeight: 820 }}>
      <svg
        className="maths-topic-network__svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="A network diagram of Years 7 to 12 maths topics, showing how fundamentals, domains, and specific subtopics connect."
      >
        <g>
          {organicLayout.edges.map((edge) => (
            <path
              key={`${edge.from}-${edge.to}`}
              className={edge.kind === 'cross' ? 'maths-topic-network__link maths-topic-network__link--cross' : 'maths-topic-network__link'}
              d={`M${organicLayout.nodes[edge.from].x},${organicLayout.nodes[edge.from].y} Q${edge.controlX},${edge.controlY} ${organicLayout.nodes[edge.to].x},${organicLayout.nodes[edge.to].y}`}
            />
          ))}
        </g>
        <g>{nodesByTier.core.map(renderNode)}</g>
        <g>{nodesByTier.domain.map(renderNode)}</g>
        <g>{nodesByTier.sub.map(renderNode)}</g>
      </svg>
    </div>
  );
}
```

> `tidyLabels` is computed here but not yet used — Task 6 wires it into the toggle. Keeping it in this task (rather than deferring its computation) means the one-time declutter measurement pass only ever needs to run once, for both layouts, right after mount.

- [ ] **Step 3: Verify it compiles and lints**

Run: `npm run lint`
Expected: no errors in the two new files. If `react-hooks/exhaustive-deps` complains about the empty dependency array despite the inline disable comment, move the comment to directly precede the `}, []);` line (already done above) — if it still fails, remove `decluttered`, `organicLayout`, `tidyLayout` from the reported list explicitly rather than suppressing the whole rule.

Run: `npm run build:dev`
Expected: build succeeds (this file isn't imported anywhere yet, so it doesn't affect the page — this just confirms it compiles).

- [ ] **Step 4: Manual visual check**

Temporarily add `import MathsTopicNetworkDiagram from '@/features/maths-topic-network/MathsTopicNetworkDiagram';` and `<MathsTopicNetworkDiagram />` anywhere in `Mathematics.tsx`, run `npm run dev`, open `/subjects/mathematics`, and confirm: a dark navy panel with ~27 glowing nodes and connecting lines renders, labels don't visibly overlap, core nodes sit near the center. **Then remove this temporary import/JSX** — Task 9 does the real mount.

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx src/features/maths-topic-network/maths-topic-network.css
git commit -m "feat(maths-topic-network): render static organic diagram with label decluttering"
```

---

## Task 5: Click-to-highlight + info card

**Files:**
- Modify: `src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx`
- Modify: `src/features/maths-topic-network/maths-topic-network.css`

**Interfaces:**
- Consumes: `CORE_TOPICS`, `DOMAIN_TOPICS`, `SUBTOPICS`, `CROSS_LINKS` (blurb/label lookups and cross-link data), plus the component from Task 4.
- Produces: no new exports — this extends `MathsTopicNetworkDiagram`'s internal behavior for Task 9 to inherit unchanged.

- [ ] **Step 1: Add the CSS for the highlight card**

```css
/* Append to src/features/maths-topic-network/maths-topic-network.css */

.maths-topic-network__card {
  position: absolute;
  left: 18px;
  bottom: 18px;
  max-width: 300px;
  z-index: 3;
  background: rgba(7, 22, 41, 0.82);
  border: 1px solid rgba(241, 223, 154, 0.25);
  border-radius: 16px;
  padding: 14px 16px;
  backdrop-filter: blur(6px);
  color: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.maths-topic-network__card--show {
  opacity: 1;
  transform: translateY(0);
}

.maths-topic-network__card h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 800;
  color: #f1df9a;
}

.maths-topic-network__card p {
  margin: 0 0 8px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #d7e0ee;
}

.maths-topic-network__card-connections {
  font-size: 10.5px;
  color: #8fa2bd;
}
```

- [ ] **Step 2: Add a neighbor-lookup helper and click state to the component**

```tsx
// Add near the top of MathsTopicNetworkDiagram.tsx, after the existing imports:
import { CROSS_LINKS } from './topic-network-data';

interface TopicLookup {
  label: string;
  blurb: string;
}

function buildLookup(): Record<string, TopicLookup> {
  const map: Record<string, TopicLookup> = {};
  for (const c of CORE_TOPICS) map[c.id] = { label: c.label, blurb: c.blurb };
  for (const d of DOMAIN_TOPICS) map[d.id] = { label: d.label, blurb: d.blurb };
  for (const s of SUBTOPICS) map[s.id] = { label: s.label, blurb: s.blurb };
  return map;
}

/** Direct neighbors of a node, per the same edges the diagram actually draws. */
function neighborsOf(id: string): Set<string> {
  const core = CORE_TOPICS.find((c) => c.id === id);
  if (core) {
    const domains = DOMAIN_TOPICS.filter((d) => d.corePrerequisite === id).map((d) => d.id);
    return new Set([id, ...domains]);
  }
  const domain = DOMAIN_TOPICS.find((d) => d.id === id);
  if (domain) {
    const kids = SUBTOPICS.filter((s) => s.parent === id).map((s) => s.id);
    return new Set([id, domain.corePrerequisite, ...kids]);
  }
  const sub = SUBTOPICS.find((s) => s.id === id);
  if (sub) {
    const parentDomain = DOMAIN_TOPICS.find((d) => d.id === sub.parent)!;
    const cross = CROSS_LINKS.filter((c) => c.from === id).map((c) => c.to);
    return new Set([id, sub.parent, parentDomain.corePrerequisite, ...cross]);
  }
  return new Set([id]);
}
```

- [ ] **Step 3: Wire click state and the card into the component's JSX**

```tsx
// Inside MathsTopicNetworkDiagram(), after the existing hooks:
const [selectedId, setSelectedId] = useState<string | null>(null);
const lookup = useMemo(buildLookup, []);
const activeNeighbors = selectedId ? neighborsOf(selectedId) : null;

// Replace the renderNode() function's returned <g> element's opening tag with one
// that dims non-neighbors when a node is selected, and add an onClick handler:
function renderNode(node: LayoutNode) {
  const radii = NODE_RADII[node.tier];
  const colors = colorById[node.id];
  const label = organicLabels[node.id] ?? { x: node.labelX, y: node.labelY };
  const dimmed = activeNeighbors !== null && !activeNeighbors.has(node.id);
  return (
    <g
      key={node.id}
      data-id={node.id}
      data-tier={node.tier}
      style={{ opacity: dimmed ? 0.14 : 1, cursor: 'pointer' }}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId((current) => (current === node.id ? null : node.id));
      }}
    >
      {/* ...unchanged bubble/halo/dot/leader/text/hit circle from Task 4... */}
    </g>
  );
}
```

Add the card markup and a background click-to-reset handler to the returned JSX:

```tsx
return (
  <div
    className="maths-topic-network__panel"
    style={{ height: '92vh', maxHeight: 820 }}
    onClick={() => setSelectedId(null)}
  >
    <svg /* ...unchanged from Task 4... */>
      {/* edges: dim any edge where either endpoint isn't in activeNeighbors */}
      <g>
        {organicLayout.edges.map((edge) => {
          const dimmed = activeNeighbors !== null && !(activeNeighbors.has(edge.from) && activeNeighbors.has(edge.to));
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              className={edge.kind === 'cross' ? 'maths-topic-network__link maths-topic-network__link--cross' : 'maths-topic-network__link'}
              style={{ opacity: dimmed ? 0.05 : 1 }}
              d={`M${organicLayout.nodes[edge.from].x},${organicLayout.nodes[edge.from].y} Q${edge.controlX},${edge.controlY} ${organicLayout.nodes[edge.to].x},${organicLayout.nodes[edge.to].y}`}
            />
          );
        })}
      </g>
      <g>{nodesByTier.core.map(renderNode)}</g>
      <g>{nodesByTier.domain.map(renderNode)}</g>
      <g>{nodesByTier.sub.map(renderNode)}</g>
    </svg>
    {selectedId && (
      <div className="maths-topic-network__card maths-topic-network__card--show">
        <h4>{lookup[selectedId].label}</h4>
        <p>{lookup[selectedId].blurb}</p>
        <p className="maths-topic-network__card-connections">
          Connects to: {[...neighborsOf(selectedId)].filter((id) => id !== selectedId).map((id) => lookup[id].label).slice(0, 5).join(', ')}
        </p>
      </div>
    )}
  </div>
);
```

- [ ] **Step 4: Lint, build, and manually verify**

Run: `npm run lint` — expect no errors.
Run: `npm run build:dev` — expect success.
Manually (same temporary-mount technique as Task 4, Step 4): click a domain node, confirm its core prerequisite and its subtopics stay bright while everything else dims to ~14% opacity, and the card shows the right label/blurb/connections. Click empty space to confirm it resets. Remove the temporary mount afterward.

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx src/features/maths-topic-network/maths-topic-network.css
git commit -m "feat(maths-topic-network): add click-to-highlight and info card"
```

---

## Task 6: Organic ↔ tidy toggle

**Files:**
- Modify: `src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx`
- Modify: `src/features/maths-topic-network/maths-topic-network.css`

**Interfaces:**
- Consumes: `animateValue` from `./topic-network-tween.ts` (Task 3); `tidyLabels`, `tidyLayout` already computed in Task 4.
- Produces: the component now accepts an internal `enabled` gate for the toggle button (`grownEnough`, wired for real in Task 7) — for this task, treat the button as always enabled so it's testable in isolation; Task 7 adds the gate.

- [ ] **Step 1: Add the toggle button CSS**

```css
/* Append to src/features/maths-topic-network/maths-topic-network.css */

.maths-topic-network__toggle {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 3;
  background: rgba(7, 22, 41, 0.75);
  border: 1px solid rgba(241, 223, 154, 0.3);
  color: #f1df9a;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.maths-topic-network__toggle:hover {
  background: rgba(201, 162, 39, 0.35);
}
```

- [ ] **Step 2: Add tween state and apply it to node/edge/label positions**

```tsx
// Add to the imports:
import { animateValue } from './topic-network-tween';

// Inside MathsTopicNetworkDiagram(), after the click-highlight state from Task 5:
const [viewT, setViewT] = useState(0); // 0 = organic, 1 = tidy
const [tidyActive, setTidyActive] = useState(false);
const cancelTweenRef = useRef<(() => void) | null>(null);

function toggleView() {
  cancelTweenRef.current?.();
  const next = !tidyActive;
  setTidyActive(next);
  cancelTweenRef.current = animateValue(viewT, next ? 1 : 0, 750, setViewT);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Replace renderNode()'s position calculations to blend between layouts:
function renderNode(node: LayoutNode) {
  const radii = NODE_RADII[node.tier];
  const colors = colorById[node.id];
  const organicLabel = organicLabels[node.id] ?? { x: node.labelX, y: node.labelY };
  const tidyNode = tidyLayout.nodes[node.id];
  const tidyLabel = tidyLabels[node.id] ?? { x: tidyNode.labelX, y: tidyNode.labelY };

  const x = lerp(node.x, tidyNode.x, viewT);
  const y = lerp(node.y, tidyNode.y, viewT);
  const labelX = lerp(organicLabel.x, tidyLabel.x, viewT);
  const labelY = lerp(organicLabel.y, tidyLabel.y, viewT);
  const dimmed = activeNeighbors !== null && !activeNeighbors.has(node.id);

  return (
    <g
      key={node.id}
      data-id={node.id}
      data-tier={node.tier}
      style={{ opacity: dimmed ? 0.14 : 1, cursor: 'pointer' }}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId((current) => (current === node.id ? null : node.id));
      }}
    >
      <circle className="maths-topic-network__bubble" cx={x} cy={y} r={radii.bubble} fill={colors.fill} />
      <circle className="maths-topic-network__halo" cx={x} cy={y} r={radii.halo} fill={colors.fill} />
      <circle className="maths-topic-network__dot" cx={x} cy={y} r={radii.dot} fill={colors.dot} />
      <line className="maths-topic-network__link maths-topic-network__leader" x1={x} y1={y} x2={labelX} y2={labelY} />
      <text className={LABEL_CLASS[node.tier]} x={labelX} y={labelY} textAnchor={anchorFor(labelX)}>
        {node.tier === 'core'
          ? CORE_TOPICS.find((c) => c.id === node.id)?.label
          : node.tier === 'domain'
            ? DOMAIN_TOPICS.find((d) => d.id === node.id)?.label
            : SUBTOPICS.find((s) => s.id === node.id)?.label}
      </text>
      <circle className="maths-topic-network__hit" cx={x} cy={y} r={radii.bubble + 8} />
    </g>
  );
}
```

> The `ref={(el) => { textRefs.current[node.id] = el; }}` prop from Task 4's `<text>` element is intentionally dropped here — it was only needed for the one-time declutter measurement pass in `useLayoutEffect`, which already ran and stored its results in `organicLabels`/`tidyLabels` before this task's re-render logic runs.

Update the edge path calculation the same way, blending each endpoint and control point:

```tsx
// Inside the <svg>'s edges map, replace the path `d` calculation:
{organicLayout.edges.map((edge) => {
  const dimmed = activeNeighbors !== null && !(activeNeighbors.has(edge.from) && activeNeighbors.has(edge.to));
  const fromOrganic = organicLayout.nodes[edge.from];
  const toOrganic = organicLayout.nodes[edge.to];
  const fromTidy = tidyLayout.nodes[edge.from];
  const toTidy = tidyLayout.nodes[edge.to];
  const ax = lerp(fromOrganic.x, fromTidy.x, viewT);
  const ay = lerp(fromOrganic.y, fromTidy.y, viewT);
  const bx = lerp(toOrganic.x, toTidy.x, viewT);
  const by = lerp(toOrganic.y, toTidy.y, viewT);
  const cx = lerp(edge.controlX, tidyLayout.edges.find((e) => e.from === edge.from && e.to === edge.to)!.controlX, viewT);
  const cy = lerp(edge.controlY, tidyLayout.edges.find((e) => e.from === edge.from && e.to === edge.to)!.controlY, viewT);
  return (
    <path
      key={`${edge.from}-${edge.to}`}
      className={edge.kind === 'cross' ? 'maths-topic-network__link maths-topic-network__link--cross' : 'maths-topic-network__link'}
      style={{ opacity: dimmed ? 0.05 : 1 }}
      d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`}
    />
  );
})}
```

Add the toggle button to the returned JSX, alongside the card:

```tsx
<button type="button" className="maths-topic-network__toggle" onClick={toggleView}>
  {tidyActive ? 'Back to organic view' : 'Snap to tidy view'}
</button>
```

- [ ] **Step 3: Lint, build, and manually verify**

Run: `npm run lint` and `npm run build:dev` — expect both to succeed.
Manually: click "Snap to tidy view" and confirm every node eases smoothly into the clean ring layout over about ¾ of a second, edges follow along, labels stay attached, and clicking again eases back. Click a node mid-toggle to confirm nothing throws.

- [ ] **Step 4: Commit**

```bash
git add src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx src/features/maths-topic-network/maths-topic-network.css
git commit -m "feat(maths-topic-network): add organic/tidy layout toggle"
```

---

## Task 7: Scroll-driven growth, soft lock, and reduced motion

**Files:**
- Modify: `src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx`
- Modify: `src/features/maths-topic-network/maths-topic-network.css`

**Interfaces:**
- Consumes: `motion`, `useScroll`, `useTransform`, `useReducedMotion` from `framer-motion` (already a dependency).
- Produces: the component is now scroll-aware; Task 9 mounts it as-is.

This follows the exact pattern already used in `src/components/home/VisualIntro.tsx` and `src/components/TransformationTimeline.tsx`: `useScroll({ target, offset: ['start start', 'end end'] })` against a `position: sticky` panel inside a taller-than-viewport track.

- [ ] **Step 1: Add the scroll-track, lock-prompt, and caption CSS**

```css
/* Append to src/features/maths-topic-network/maths-topic-network.css */

.maths-topic-network__track {
  position: relative;
  height: 380vh;
}

.maths-topic-network__pin {
  position: sticky;
  top: 8px;
}

.maths-topic-network__caption {
  position: absolute;
  left: 22px;
  top: 20px;
  z-index: 2;
  color: #f1df9a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: rgba(7, 22, 41, 0.55);
  padding: 7px 12px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.maths-topic-network__caption--locked {
  background: rgba(201, 162, 39, 0.35);
}

.maths-topic-network__progress-rail {
  position: absolute;
  right: 18px;
  top: 22px;
  bottom: 22px;
  width: 3px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
}

.maths-topic-network__progress-fill {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(180deg, #c9a227, #f1df9a);
  transform-origin: bottom;
}

.maths-topic-network__lock-prompt {
  position: absolute;
  left: 50%;
  bottom: 26px;
  z-index: 3;
  color: #f8ecc4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(7, 22, 41, 0.6);
  padding: 8px 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
```

- [ ] **Step 2: Wrap the panel in the scroll track and derive growth values**

```tsx
// Add to the imports (useRef is already imported once at the top of the file
// from Task 4 — do not import it again under a different name):
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Inside MathsTopicNetworkDiagram(), add near the top:
const prefersReducedMotion = useReducedMotion();
const trackRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: trackRef,
  offset: ['start start', 'end end'],
});

// Growth resolves by 68% of the track; the rest is the held "soft lock" zone.
const GROWTH_END = 0.68;
const growthProgress = useTransform(scrollYProgress, (raw) => Math.min(1, raw / GROWTH_END));
const domainOpacity = useTransform(growthProgress, [0.10, 0.42], [0, 1], { clamp: true });
const subtopicOpacity = useTransform(growthProgress, [0.48, 0.80], [0, 1], { clamp: true });
const crossOpacity = useTransform(growthProgress, [0.86, 1.0], [0, 1], { clamp: true });
const progressFillScale = useTransform(scrollYProgress, (raw) => Math.max(0, Math.min(1, raw)));

const [grownEnough, setGrownEnough] = useState(false);
const [lockPromptVisible, setLockPromptVisible] = useState(false);
useMotionValueEvent(scrollYProgress, 'change', (raw) => {
  const isGrown = raw >= GROWTH_END - 0.01;
  setGrownEnough(isGrown);
  setLockPromptVisible(raw >= GROWTH_END && raw < 0.97);
});
```

- [ ] **Step 3: Gate node-click and the toggle button behind `grownEnough`, and reduced motion behind an early return**

```tsx
// In renderNode()'s onClick, and in toggleView(), guard with grownEnough:
onClick={(event) => {
  event.stopPropagation();
  if (!grownEnough) return;
  setSelectedId((current) => (current === node.id ? null : node.id));
}}

function toggleView() {
  if (!grownEnough) return;
  cancelTweenRef.current?.();
  const next = !tidyActive;
  setTidyActive(next);
  cancelTweenRef.current = animateValue(viewT, next ? 1 : 0, 750, setViewT);
}
```

Disable the toggle button visually when not yet grown, and wrap the domain/subtopic/cross-link `<g>` groups in `motion.g` bound to the opacity values, with reduced-motion rendering everything at full opacity immediately (no pin, no scroll-scrub):

```tsx
// Replace the plain <g> wrapper around nodesByTier.domain.map(renderNode) with:
<motion.g style={{ opacity: prefersReducedMotion ? 1 : domainOpacity, pointerEvents: grownEnough || prefersReducedMotion ? 'auto' : 'none' }}>
  {nodesByTier.domain.map(renderNode)}
</motion.g>

// Same pattern for nodesByTier.sub, using subtopicOpacity, and for the cross-link
// edges specifically (split the edges map into ring1/ring2/cross groups so each
// can carry its own motion.g opacity — ring1 and ring2 edges fade in step with
// their node groups above, cross edges use crossOpacity):
<motion.g style={{ opacity: prefersReducedMotion ? 1 : crossOpacity }}>
  {organicLayout.edges.filter((e) => e.kind === 'cross').map((edge) => {
    /* ...same path-rendering logic as Task 6, filtered to this edge... */
  })}
</motion.g>
```

- [ ] **Step 4: Wrap the returned JSX in the track/pin structure and add the caption, progress rail, and lock prompt**

```tsx
return (
  <div className="maths-topic-network__track" ref={trackRef}>
    <div
      className="maths-topic-network__panel maths-topic-network__pin"
      style={{ height: '92vh', maxHeight: 820 }}
      onClick={() => grownEnough && setSelectedId(null)}
    >
      <p className={`maths-topic-network__caption ${grownEnough ? 'maths-topic-network__caption--locked' : ''}`}>
        {grownEnough ? 'Fully connected' : 'Stage 1 · Fundamentals'}
      </p>
      <div className="maths-topic-network__progress-rail">
        <motion.div className="maths-topic-network__progress-fill" style={{ scaleY: prefersReducedMotion ? 1 : progressFillScale }} />
      </div>
      <svg /* ...unchanged... */>
        {/* ...unchanged content from Task 6, with the motion.g wrappers from Step 3 above... */}
      </svg>
      {lockPromptVisible && !prefersReducedMotion && (
        <div className="maths-topic-network__lock-prompt">
          <span>All connected — scroll to continue</span>
          <span>↓</span>
        </div>
      )}
      <button type="button" className="maths-topic-network__toggle" onClick={toggleView} disabled={!grownEnough} style={{ opacity: grownEnough ? 1 : 0.4 }}>
        {tidyActive ? 'Back to organic view' : 'Snap to tidy view'}
      </button>
      {selectedId && grownEnough && (
        <div className="maths-topic-network__card maths-topic-network__card--show">
          {/* ...unchanged from Task 5... */}
        </div>
      )}
    </div>
  </div>
);
```

When `prefersReducedMotion` is true, the `.maths-topic-network__track` still exists in the DOM but its `height: 380vh` would force a huge, pointless scroll distance for something that renders fully-grown immediately — override it:

```tsx
// At the top of the returned JSX's outer div:
<div
  className="maths-topic-network__track"
  ref={trackRef}
  style={prefersReducedMotion ? { height: 'auto' } : undefined}
>
```

And since `grownEnough` starts `false` and is only set by the `useMotionValueEvent(scrollYProgress, ...)` subscription (which needs actual scroll to fire), initialize it to match `prefersReducedMotion` so reduced-motion visitors get an interactive diagram immediately without needing to scroll at all:

```tsx
const [grownEnough, setGrownEnough] = useState(() => !!prefersReducedMotion);
```

- [ ] **Step 5: Lint, build, and manually verify**

Run: `npm run lint` and `npm run build:dev` — expect both to succeed.
Manually: scroll through the panel and confirm domains fade in, then subtopics, then cross-links, growth resolves, then scrolling continues to visibly do nothing for a stretch (the lock), the "All connected — scroll to continue" prompt shows during that stretch, and continuing to scroll eventually releases into the rest of the page. Then, in Chrome DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab), reload, and confirm the diagram renders fully-grown immediately with no pin/scroll-track and the toggle/click both work right away.

- [ ] **Step 6: Commit**

```bash
git add src/features/maths-topic-network/MathsTopicNetworkDiagram.tsx src/features/maths-topic-network/maths-topic-network.css
git commit -m "feat(maths-topic-network): add scroll-driven growth, soft lock, and reduced-motion support"
```

---

## Task 8: Mobile accordion + top-level wrapper

**Files:**
- Create: `src/features/maths-topic-network/MathsTopicNetworkMobile.tsx`
- Create: `src/features/maths-topic-network/MathsTopicNetwork.tsx`
- Modify: `src/features/maths-topic-network/maths-topic-network.css`

**Interfaces:**
- Consumes: `useIsMobile` from `@/hooks/use-mobile`; `MathsTopicNetworkDiagram` (Tasks 4–7); `CORE_TOPICS`, `DOMAIN_TOPICS`, `SUBTOPICS` from `./topic-network-data`.
- Produces: `MathsTopicNetwork` (default export) — this is what Task 9 actually mounts into `Mathematics.tsx`, not `MathsTopicNetworkDiagram` directly.

- [ ] **Step 1: Add the mobile accordion CSS**

```css
/* Append to src/features/maths-topic-network/maths-topic-network.css */

.maths-topic-network__phone {
  border-radius: 26px;
  padding: 20px 16px;
  background: linear-gradient(160deg, #071629 0%, #0b294d 100%);
  box-shadow: 0 18px 40px rgba(7, 22, 41, 0.3);
}

.maths-topic-network__phone-core-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.maths-topic-network__phone-core-chip {
  font-size: 11px;
  font-weight: 800;
  color: #071629;
  background: #e0bd4b;
  padding: 5px 10px;
  border-radius: 999px;
}

.maths-topic-network__phone-domain {
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  margin-bottom: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 11px 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
}

.maths-topic-network__phone-domain-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 9px;
}

.maths-topic-network__phone-chevron {
  color: #8fa2bd;
  transition: transform 0.2s ease;
}

.maths-topic-network__phone-chevron--open {
  transform: rotate(90deg);
}

.maths-topic-network__phone-sublist {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
  padding-left: 26px;
  overflow: hidden;
}

.maths-topic-network__phone-sublist--open {
  grid-template-rows: 1fr;
}

.maths-topic-network__phone-sublist-inner {
  min-height: 0;
}

.maths-topic-network__phone-sub-row {
  font-size: 12px;
  color: #c3d1e6;
  padding: 7px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
```

> This uses `grid-template-rows: 0fr → 1fr` for the expand/collapse instead of animating `max-height` — the mockup's original approach was flagged during design review as a layout-thrash risk since `max-height` forces reflow, whereas animating a grid track size is composited more cheaply and is the modern replacement for this exact "expand to fit unknown content height" pattern.

- [ ] **Step 2: Write the mobile accordion component**

```tsx
// src/features/maths-topic-network/MathsTopicNetworkMobile.tsx
import { useState } from 'react';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS } from './topic-network-data';

export default function MathsTopicNetworkMobile() {
  const [openId, setOpenId] = useState<string | null>(DOMAIN_TOPICS[0]?.id ?? null);

  return (
    <div className="maths-topic-network__phone">
      <div className="maths-topic-network__phone-core-row">
        {CORE_TOPICS.map((core) => (
          <span key={core.id} className="maths-topic-network__phone-core-chip">
            {core.label}
          </span>
        ))}
      </div>
      {DOMAIN_TOPICS.map((domain) => {
        const isOpen = openId === domain.id;
        const kids = SUBTOPICS.filter((s) => s.parent === domain.id);
        return (
          <div key={domain.id}>
            <button
              type="button"
              className="maths-topic-network__phone-domain"
              onClick={() => setOpenId((current) => (current === domain.id ? null : domain.id))}
              aria-expanded={isOpen}
            >
              <span>
                <i className="maths-topic-network__phone-domain-dot" style={{ background: domain.dotColor }} />
                {domain.label}
              </span>
              <span className={`maths-topic-network__phone-chevron ${isOpen ? 'maths-topic-network__phone-chevron--open' : ''}`}>›</span>
            </button>
            <div className={`maths-topic-network__phone-sublist ${isOpen ? 'maths-topic-network__phone-sublist--open' : ''}`}>
              <div className="maths-topic-network__phone-sublist-inner">
                {kids.length > 0
                  ? kids.map((sub) => (
                    <div key={sub.id} className="maths-topic-network__phone-sub-row">
                      {sub.label}
                    </div>
                  ))
                  : (
                    <div className="maths-topic-network__phone-sub-row">{domain.blurb}</div>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Write the top-level wrapper**

```tsx
// src/features/maths-topic-network/MathsTopicNetwork.tsx
import { useIsMobile } from '@/hooks/use-mobile';
import MathsTopicNetworkDiagram from './MathsTopicNetworkDiagram';
import MathsTopicNetworkMobile from './MathsTopicNetworkMobile';

export function MathsTopicNetwork() {
  const isMobile = useIsMobile();
  return isMobile ? <MathsTopicNetworkMobile /> : <MathsTopicNetworkDiagram />;
}
```

- [ ] **Step 4: Lint, build, and manually verify**

Run: `npm run lint` and `npm run build:dev` — expect both to succeed.
Manually: temporarily mount `<MathsTopicNetwork />` in `Mathematics.tsx` (same technique as Task 4), open `/subjects/mathematics` in `npm run dev`, resize the browser below 768px width, and confirm it switches to the pill row + tappable accordion list, with Probability pre-expanded. Tap a couple of domains to confirm they expand/collapse without layout jank. Remove the temporary mount afterward.

- [ ] **Step 5: Commit**

```bash
git add src/features/maths-topic-network/MathsTopicNetworkMobile.tsx src/features/maths-topic-network/MathsTopicNetwork.tsx src/features/maths-topic-network/maths-topic-network.css
git commit -m "feat(maths-topic-network): add mobile accordion and top-level responsive wrapper"
```

---

## Task 9: Mount into the Mathematics page

**Files:**
- Modify: `src/pages/subjects/Mathematics.tsx`
- Test: `src/features/maths-topic-network/maths-topic-network-mount.test.ts`

**Interfaces:**
- Consumes: `MathsTopicNetwork` from `./MathsTopicNetwork` (Task 8).

Mirrors the existing `hsc-maths-pathway.test.ts` convention of asserting the mount via source inspection rather than rendering.

- [ ] **Step 1: Write the failing mount test**

```ts
// src/features/maths-topic-network/maths-topic-network-mount.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('Mathematics page imports and mounts MathsTopicNetwork', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ MathsTopicNetwork \} from ['"]@\/features\/maths-topic-network\/MathsTopicNetwork['"]/);
  assert.match(source, /<MathsTopicNetwork\s*\/>/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/maths-topic-network-mount.test.ts`
Expected: FAIL — `Mathematics.tsx` doesn't import or render `MathsTopicNetwork` yet.

- [ ] **Step 3: Mount the component in `Mathematics.tsx`**

Add the import alongside the other feature imports near the top of the file (next to the existing `import { HscMathsPathway } from '@/features/hsc-maths-pathway/HscMathsPathway';`):

```tsx
import { MathsTopicNetwork } from '@/features/maths-topic-network/MathsTopicNetwork';
```

Add the component after the `<HscMathsPathway />` section and before `<MathsTeachingProof />` (find this exact block — it's right after the `<VectorAmbientMoment passive />` line):

```tsx
        <VectorAmbientMoment passive />

        <HscMathsPathway />

        <section className="bg-[#071629] px-5 py-20 lg:px-8" aria-labelledby="maths-topic-network-heading">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">The whole picture</p>
            <h2 id="maths-topic-network-heading" className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
              Every topic connects to another.
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-8 text-[#b9c4d6]">
              Scroll to watch how Years 7–12 maths builds outward from a handful of fundamentals — click any topic to see what it depends on.
            </p>
            <div className="mt-10">
              <MathsTopicNetwork />
            </div>
          </div>
        </section>

        <MathsTeachingProof />
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/maths-topic-network-mount.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full verification suite**

Run: `node --test --experimental-strip-types src/features/maths-topic-network/*.test.ts`
Expected: PASS — every test from Tasks 1, 2, 3, and this task.

Run: `npm run lint`
Expected: no errors.

Run: `npm run build:dev`
Expected: succeeds.

Run: `npm run dev`, open `/subjects/mathematics`, and manually walk through the full experience end to end: scroll into the new section, watch it grow and lock, click a few nodes, use the tidy toggle, then resize to a mobile width and confirm the accordion. Also re-check `prefers-reduced-motion` (DevTools Rendering tab) one more time now that it's mounted in the real page, since Task 7's manual check was against a temporary standalone mount.

- [ ] **Step 6: Commit**

```bash
git add src/pages/subjects/Mathematics.tsx src/features/maths-topic-network/maths-topic-network-mount.test.ts
git commit -m "feat(maths-topic-network): mount topic network on the Mathematics page"
```

---

## Self-Review

**Spec coverage:**
- Data model (topics, blurbs, domain→core prerequisites, cross-links) → Task 1. ✅
- Organic layout (physics + hierarchy clamp, randomized per load) → Task 2, seeded per-mount in Task 4 via `Date.now()`. ✅
- Tidy layout (deterministic ring formula) → Task 2. ✅
- Label auto-declutter → Task 2 (pure algorithm) + Task 4 (real DOM measurement). ✅
- Dark navy "constellation" visual design, tier colors/sizes → Task 4. ✅
- Click-to-highlight + info card → Task 5. ✅
- Organic/tidy toggle → Task 6. ✅
- Scroll-driven growth + soft lock (not scroll-hijacking) → Task 7. ✅
- `prefers-reduced-motion` fallback → Task 7. ✅
- Mobile accordion fallback → Task 8. ✅
- Mount into `Mathematics.tsx` → Task 9. ✅
- Testing conventions (pure-logic `node:test`, source-inspection mount test, no component render tests) → all tasks. ✅
- Performance notes (opacity/transform not layout properties, avoid `max-height` transitions) → Task 7 (motion.g opacity) and Task 8 (grid-template-rows instead of max-height). ✅

**Placeholder scan:** no "TBD"/"TODO"/"add appropriate handling" patterns present; every step has real, complete code.

**Type consistency check:** `TopicLayout`, `LayoutNode`, `LayoutEdge`, `LabelBox`, `LabelDelta` (Task 2) are used with identical shapes in Tasks 4–7. `neighborsOf` (Task 5) and `computeOrganicLayout`/`computeTidyLayout` (Task 2) agree on how `DomainTopic.corePrerequisite` and `Subtopic.parent` relate nodes. `animateValue`'s signature (Task 3) matches its call site in Task 6 (`animateValue(viewT, next ? 1 : 0, 750, setViewT)`).

**One noted deviation from the validated mockup, called out explicitly:** the mockup's edge curves used small random jitter on their control points for extra visual wonkiness; this plan uses plain midpoint control points instead (`finalizeLayout` in Task 2) to keep the layout engine simpler and fully deterministic/testable without threading extra RNG state through edge rendering. The organic *node* positions (where all the validated "chaos" actually lives) are unaffected. If the straighter curves read as too clean once built, it's a small follow-up to `finalizeLayout`, not a structural change.

---

Plan complete and saved to `docs/superpowers/plans/2026-08-20-maths-topic-network.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
