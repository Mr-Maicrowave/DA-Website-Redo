import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { GraphAsymptote, GraphExpression, GraphPoint, SampledGraph, Viewport } from './types.ts';
import { createTicks, formatTick, formatViewportBound, panViewport } from './viewport.ts';
import { expressionToLatex } from './equation-format.ts';
import { LatexEquation } from './LatexEquation';
import type { GraphLabTheme } from './graph-lab-theme';

type PlotExpression = GraphExpression & SampledGraph;

type GraphCanvasProps = {
  expressions: PlotExpression[];
  viewport: Viewport;
  asymptotes: GraphAsymptote[];
  onViewportChange: (viewport: Viewport) => void;
  theme: GraphLabTheme;
};

const WIDTH = 760;
const HEIGHT = 470;
const MARGIN = { top: 22, right: 28, bottom: 42, left: 54 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const LINE_STYLES = ['', '10 5', '3 5', '14 5 3 5', '2 5', '18 5'];

const pathFromPoints = (points: GraphPoint[], viewport: Viewport) => points.map((point, index) => {
  const x = MARGIN.left + ((point.x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * PLOT_WIDTH;
  const y = MARGIN.top + PLOT_HEIGHT - ((point.y - viewport.yMin) / (viewport.yMax - viewport.yMin)) * PLOT_HEIGHT;
  return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
}).join(' ');

const DARK_PLOT_COLORS = ['#f7c84b', '#b58cff', '#62d8bd', '#ff879c', '#7eb8ff', '#f0a868', '#d691dc', '#a9d66f'];

export const GraphCanvas = ({ expressions, viewport, asymptotes, onViewportChange, theme }: GraphCanvasProps) => {
  const dragRef = useRef<{ pointerId: number; x: number; y: number; viewport: Viewport } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const xTicks = createTicks(viewport.xMin, viewport.xMax, PLOT_WIDTH);
  const yTicks = createTicks(viewport.yMin, viewport.yMax, PLOT_HEIGHT, 52);
  const xStep = xTicks.length > 1 ? xTicks[1] - xTicks[0] : viewport.xMax - viewport.xMin;
  const yStep = yTicks.length > 1 ? yTicks[1] - yTicks[0] : viewport.yMax - viewport.yMin;
  const xToSvg = (x: number) => MARGIN.left + ((x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * PLOT_WIDTH;
  const yToSvg = (y: number) => MARGIN.top + PLOT_HEIGHT - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin)) * PLOT_HEIGHT;
  const xAxisY = viewport.yMin <= 0 && viewport.yMax >= 0 ? yToSvg(0) : null;
  const yAxisX = viewport.xMin <= 0 && viewport.xMax >= 0 ? xToSvg(0) : null;
  const visibleExpressions = expressions.filter((expression) => expression.visible);
  const logicalExpressions = visibleExpressions.filter((expression) => !expression.isInternalBranch);
  const description = logicalExpressions.length > 0
    ? `Coordinate graph showing ${logicalExpressions.map((expression) => expression.displayLatex ?? `y equals ${expression.source}`).join(', ')}. The x-range is ${formatViewportBound(viewport.xMin)} to ${formatViewportBound(viewport.xMax)} and the y-range is ${formatViewportBound(viewport.yMin)} to ${formatViewportBound(viewport.yMax)}.`
    : 'Coordinate graph with no visible expressions.';
  const plotColor = (expression: PlotExpression, index: number) => theme === 'dark' ? DARK_PLOT_COLORS[index % DARK_PLOT_COLORS.length] : expression.color;
  const asymptoteBackdrop = theme === 'dark' ? '#06111e' : '#fffdf8';
  const asymptoteLine = theme === 'dark' ? '#f7c84b' : '#946c0b';
  const asymptoteText = theme === 'dark' ? '#f5d875' : '#6f4d05';

  const startPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, viewport };
    setIsDragging(true);
  };

  const continuePan = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xShift = -((event.clientX - drag.x) / rect.width) * (drag.viewport.xMax - drag.viewport.xMin);
    const yShift = ((event.clientY - drag.y) / rect.height) * (drag.viewport.yMax - drag.viewport.yMin);
    onViewportChange(panViewport(drag.viewport, xShift, yShift));
  };

  const finishPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div>
      <div className="graph-lab-graph-stage relative aspect-[760/470] w-full overflow-hidden rounded-xl bg-[#fbfaf5]">
        <p className="graph-lab-drag-hint pointer-events-none absolute right-3 top-3 z-10 rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-[#536077]">Drag to move the graph</p>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={`h-full w-full touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          role="img"
          aria-labelledby="graph-title graph-description"
          onPointerDown={startPan}
          onPointerMove={continuePan}
          onPointerUp={finishPan}
          onPointerCancel={finishPan}
        >
          <title id="graph-title">Interactive coordinate graph</title>
          <desc id="graph-description">{description}</desc>
          <defs>
            <clipPath id="graph-lab-clip"><rect x={MARGIN.left} y={MARGIN.top} width={PLOT_WIDTH} height={PLOT_HEIGHT} /></clipPath>
            <marker id="graph-lab-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--gl-axis)" />
            </marker>
            <filter id="graph-lab-plot-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          <rect x={MARGIN.left} y={MARGIN.top} width={PLOT_WIDTH} height={PLOT_HEIGHT} fill="var(--gl-plot)" stroke="var(--gl-border)" />
          {xTicks.map((tick) => (
            <g key={`x-${tick}`}>
              <line x1={xToSvg(tick)} y1={MARGIN.top} x2={xToSvg(tick)} y2={MARGIN.top + PLOT_HEIGHT} stroke="var(--gl-grid)" />
              <text x={xToSvg(tick)} y={HEIGHT - 17} textAnchor="middle" fill="var(--gl-muted)" fontSize="12">{formatTick(tick, xStep)}</text>
            </g>
          ))}
          {yTicks.map((tick) => (
            <g key={`y-${tick}`}>
              <line x1={MARGIN.left} y1={yToSvg(tick)} x2={MARGIN.left + PLOT_WIDTH} y2={yToSvg(tick)} stroke="var(--gl-grid)" />
              {tick !== 0 ? <text x={MARGIN.left - 10} y={yToSvg(tick) + 4} textAnchor="end" fill="var(--gl-muted)" fontSize="12">{formatTick(tick, yStep)}</text> : null}
            </g>
          ))}

          {xAxisY !== null ? <line x1={MARGIN.left} y1={xAxisY} x2={MARGIN.left + PLOT_WIDTH - 4} y2={xAxisY} stroke="var(--gl-axis)" strokeWidth="1.5" markerEnd="url(#graph-lab-arrow)" /> : null}
          {yAxisX !== null ? <line x1={yAxisX} y1={MARGIN.top + PLOT_HEIGHT} x2={yAxisX} y2={MARGIN.top + 4} stroke="var(--gl-axis)" strokeWidth="1.5" markerEnd="url(#graph-lab-arrow)" /> : null}
          <text x={MARGIN.left + PLOT_WIDTH - 1} y={(xAxisY ?? MARGIN.top + PLOT_HEIGHT) - 9} textAnchor="end" fill="var(--gl-ink)" fontSize="14" fontStyle="italic">x</text>
          <text x={(yAxisX ?? MARGIN.left) + 10} y={MARGIN.top + 13} fill="var(--gl-ink)" fontSize="14" fontStyle="italic">y</text>

          <g clipPath="url(#graph-lab-clip)">
            {asymptotes.map((asymptote, index) => asymptote.orientation === 'vertical' ? (
              <g key={`vertical-asymptote-${asymptote.value}-${index}`}>
                <line x1={xToSvg(asymptote.value)} y1={MARGIN.top} x2={xToSvg(asymptote.value)} y2={MARGIN.top + PLOT_HEIGHT} stroke={asymptoteBackdrop} strokeWidth="5" vectorEffect="non-scaling-stroke" />
                <line x1={xToSvg(asymptote.value)} y1={MARGIN.top} x2={xToSvg(asymptote.value)} y2={MARGIN.top + PLOT_HEIGHT} stroke={asymptoteLine} strokeWidth="2.25" strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
                <text x={xToSvg(asymptote.value) + 6} y={MARGIN.top + PLOT_HEIGHT - 8 - ((index % 3) * 17)} fill={asymptoteText} stroke={asymptoteBackdrop} strokeWidth="3" paintOrder="stroke" strokeLinejoin="round" fontSize="11" fontWeight="700">{asymptote.latex}</text>
              </g>
            ) : (
              <g key={`horizontal-asymptote-${asymptote.value}-${index}`}>
                <line x1={MARGIN.left} y1={yToSvg(asymptote.value)} x2={MARGIN.left + PLOT_WIDTH} y2={yToSvg(asymptote.value)} stroke={asymptoteBackdrop} strokeWidth="5" vectorEffect="non-scaling-stroke" />
                <line x1={MARGIN.left} y1={yToSvg(asymptote.value)} x2={MARGIN.left + PLOT_WIDTH} y2={yToSvg(asymptote.value)} stroke={asymptoteLine} strokeWidth="2.25" strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
                <text x={MARGIN.left + 8} y={yToSvg(asymptote.value) - 7} fill={asymptoteText} stroke={asymptoteBackdrop} strokeWidth="3" paintOrder="stroke" strokeLinejoin="round" fontSize="11" fontWeight="700">{asymptote.latex}</text>
              </g>
            ))}
            {visibleExpressions.flatMap((expression, expressionIndex) => expression.segments.map((segment, segmentIndex) => (
              <path
                key={`${expression.id}-${segmentIndex}`}
                d={pathFromPoints(segment, viewport)}
                fill="none"
                stroke={plotColor(expression, expressionIndex)}
                strokeWidth="3"
                strokeDasharray={LINE_STYLES[(expression.lineStyle ?? expressionIndex) % LINE_STYLES.length]}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter={theme === 'dark' && expressionIndex === 0 ? 'url(#graph-lab-plot-glow)' : undefined}
              />
            )))}
          </g>
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#40516b]" aria-label="Visible expressions">
        {logicalExpressions.map((expression, index) => (
          <li key={expression.id} className="flex min-w-0 items-center gap-2">
            <svg width="28" height="8" aria-hidden="true"><line x1="1" x2="27" y1="4" y2="4" stroke={plotColor(expression, index)} strokeWidth="3" strokeDasharray={LINE_STYLES[(expression.lineStyle ?? index) % LINE_STYLES.length]} /></svg>
            <LatexEquation latex={expression.displayLatex ?? expressionToLatex(expression.source)} className="max-w-72 overflow-x-auto py-1 [&_.katex]:text-inherit" />
          </li>
        ))}
        {asymptotes.length > 0 ? (
          <li className="flex min-w-0 items-center gap-2 text-[#7a5709]">
            <svg width="28" height="8" aria-hidden="true"><line x1="1" x2="27" y1="4" y2="4" stroke="#7a5709" strokeWidth="1.5" strokeDasharray="7 5" /></svg>
            <span>Asymptotes:</span>
            {asymptotes.map((asymptote, index) => <LatexEquation key={`${asymptote.orientation}-${asymptote.value}-${index}`} latex={asymptote.latex} />)}
          </li>
        ) : null}
      </ul>
    </div>
  );
};
