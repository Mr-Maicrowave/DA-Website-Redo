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
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS, CROSS_LINKS } from './topic-network-data';
import './maths-topic-network.css';

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lookup = useMemo(buildLookup, []);
  const activeNeighbors = selectedId ? neighborsOf(selectedId) : null;

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
          el.setAttribute('text-anchor', anchorFor(node.labelX));
        }
        const box = el?.getBBox() ?? { x: node.labelX, y: node.labelY, width: 0, height: 0 };
        return { id, x: box.x, y: box.y, width: box.width, height: box.height };
      });
    }

    const organicDeltas = declutterLabels(measure(organicLayout));
    const tidyDeltas = declutterLabels(measure(tidyLayout));

    setOrganicLabels(decluttered(organicLayout, organicDeltas));
    setTidyLabels(decluttered(tidyLayout, tidyDeltas));

    // Restore the visible (organic) label positions and anchors before paint.
    for (const id of allNodeIds) {
      const el = textRefs.current[id];
      const pos = decluttered(organicLayout, organicDeltas)[id];
      if (el && pos) {
        el.setAttribute('x', String(pos.x));
        el.setAttribute('y', String(pos.y));
        el.setAttribute('text-anchor', anchorFor(organicLayout.nodes[id].labelX));
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
    <div
      className="maths-topic-network__panel"
      style={{ height: '92vh', maxHeight: 820 }}
      onClick={() => setSelectedId(null)}
    >
      <svg
        className="maths-topic-network__svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="A network diagram of Years 7 to 12 maths topics, showing how fundamentals, domains, and specific subtopics connect."
      >
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
}
