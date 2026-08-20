import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import katex from 'katex';
import { sampleDerivativeModel } from './derivative-model';
import './maths-ambient-motion.css';

const InlineMath = ({ expression, label }: { expression: string; label: string }) => (
  <span
    className="maths-ambient-equation"
    aria-label={label}
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(expression, { displayMode: false, throwOnError: false }),
    }}
  />
);

interface AmbientMathsMomentProps {
  side: 'left' | 'right';
  label: string;
  equation: string;
  equationLabel: string;
  derivation: ReactNode;
  passive?: boolean;
  children: (active: boolean, expanded: boolean) => ReactNode;
}

const AmbientMathsMoment = ({
  side,
  label,
  equation,
  equationLabel,
  derivation,
  passive = false,
  children,
}: AmbientMathsMomentProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNearViewport = useInView(anchorRef, { margin: '240px 0px 240px 0px', amount: 0 });
  const reduceMotion = useReducedMotion();
  const [hoverReady, setHoverReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const active = isNearViewport && !reduceMotion;

  const cancelHover = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
    setHoverReady(false);
  };

  const scheduleHover = () => {
    if (expanded || reduceMotion) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoverReady(true), 220);
  };

  const close = () => {
    setExpanded(false);
    setHoverReady(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!expanded) return undefined;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  useEffect(() => () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setExpanded(true);
    }
  };

  if (passive) {
    return (
      <div ref={anchorRef} className={`maths-ambient-anchor maths-ambient-anchor--${side}`} aria-hidden="true">
        <div className="maths-ambient-moment is-passive">
          <span className="maths-ambient-moment__scene">{children(active, false)}</span>
          {/* Hidden by default (a floating gutter icon is fine unlabelled); shown only in the
              compact in-flow card presentation, where a naked diagram with no context would
              read as a stray, unexplained graphic rather than a deliberate detail. */}
          <span className="maths-ambient-moment__caption">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={anchorRef} className={`maths-ambient-anchor maths-ambient-anchor--${side}`}>
      <motion.div
        className={`maths-ambient-moment ${hoverReady ? 'is-hover-ready' : ''} ${expanded ? 'is-expanded' : ''}`}
        onMouseEnter={scheduleHover}
        onMouseLeave={cancelHover}
        onClickCapture={(event) => {
          const target = event.target as Element;
          if (expanded && !target.closest('.maths-ambient-moment__card')) close();
        }}
      >
        <div className="maths-ambient-moment__card">
          <button
            ref={triggerRef}
            type="button"
            className="maths-ambient-moment__trigger"
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Collapse' : 'Explore'} ${label}`}
            onFocus={scheduleHover}
            onBlur={() => { if (!expanded) cancelHover(); }}
            onClick={() => setExpanded(true)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span className="maths-ambient-moment__hint">{expanded ? label : 'Explore the idea'}</span>
            <span className="maths-ambient-moment__scene">{children(active, expanded)}</span>
          </button>

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                ref={dialogRef}
                className="maths-ambient-moment__explanation"
                role="dialog"
                aria-modal="true"
                aria-label={label}
                tabIndex={-1}
                initial={reduceMotion ? false : { opacity: 0, x: side === 'left' ? -14 : 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
              >
                <h2>{label}</h2>
                <InlineMath expression={equation} label={equationLabel} />
                <div className="maths-ambient-derivation">{derivation}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const networkNodes = [
  [18, 82], [58, 37], [65, 119], [111, 78], [142, 29], [151, 126], [197, 72], [225, 113], [247, 44], [282, 86],
];
const networkLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const networkEdges = [
  { from: 0, to: 1, weight: 3 }, { from: 0, to: 2, weight: 5 }, { from: 1, to: 2, weight: 6 },
  { from: 1, to: 3, weight: 4 }, { from: 2, to: 3, weight: 6 }, { from: 2, to: 5, weight: 5 },
  { from: 3, to: 4, weight: 5 }, { from: 3, to: 5, weight: 4 }, { from: 3, to: 6, weight: 2 },
  { from: 4, to: 6, weight: 5 }, { from: 4, to: 8, weight: 4 }, { from: 5, to: 6, weight: 4 },
  { from: 5, to: 7, weight: 4 }, { from: 6, to: 7, weight: 4 }, { from: 6, to: 8, weight: 5 },
  { from: 6, to: 9, weight: 3 }, { from: 7, to: 9, weight: 5 }, { from: 8, to: 9, weight: 4 },
];
const networkPath = [0, 1, 3, 6, 9];

const NetworkAmbientScene = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 300 150" role="img" aria-labelledby="network-ambient-title network-ambient-description">
    <title id="network-ambient-title">A shortest-path search spreading through a network</title>
    <desc id="network-ambient-description">Ink search edges spread from the source before the cheapest route glows in champagne gold.</desc>
    <defs>
      <linearGradient id="network-ambient-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c89b27" /><stop offset="0.38" stopColor="#f0c86a" /><stop offset="0.68" stopColor="#fffbe8" /><stop offset="0.82" stopColor="#f7d984" /><stop offset="1" stopColor="#dcb347" />
      </linearGradient>
      <filter id="network-ambient-glow"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <g className="maths-network-ambient__base">
      {networkEdges.map(({ from, to }) => <line key={`${from}-${to}`} x1={networkNodes[from][0]} y1={networkNodes[from][1]} x2={networkNodes[to][0]} y2={networkNodes[to][1]} />)}
    </g>
    <g className={`maths-network-ambient__frontier ${active ? 'is-active' : ''}`}>
      {networkEdges.map(({ from, to }, index) => <line key={`${from}-${to}`} x1={networkNodes[from][0]} y1={networkNodes[from][1]} x2={networkNodes[to][0]} y2={networkNodes[to][1]} pathLength="1" style={{ '--edge-index': index } as React.CSSProperties} />)}
    </g>
    <polyline className={`maths-network-ambient__final-path ${active ? 'is-active' : ''}`} points={networkPath.map((index) => networkNodes[index].join(',')).join(' ')} pathLength="1" />
    <g className="maths-network-ambient__weights" aria-label="edge weights">
      {networkEdges.map(({ from, to, weight }) => (
        <text key={`${from}-${to}-weight`} x={(networkNodes[from][0] + networkNodes[to][0]) / 2} y={(networkNodes[from][1] + networkNodes[to][1]) / 2 - 3}>{weight}</text>
      ))}
    </g>
    <g className="maths-network-ambient__nodes">
      {networkNodes.map(([x, y], index) => (
        <g key={`${x}-${y}`}><circle cx={x} cy={y} r={index === 0 || index === 9 ? 5 : 3.5} /><text x={x} y={y - 8}>{networkLabels[index]}</text></g>
      ))}
    </g>
  </svg>
);

const DerivativeAmbientScene = ({ active }: { active: boolean }) => {
  const samples = useMemo(() => sampleDerivativeModel(81), []);
  const progress = useMotionValue(0);
  const clipRef = useRef<SVGRectElement>(null);
  const tangentRef = useRef<SVGGElement>(null);
  const xScale = (x: number) => 18 + ((x + 1.6) / 3.2) * 264;
  const functionY = (y: number) => 76 - y * 14;
  const derivativeY = (y: number) => 76 - y * 14;
  const functionPoints = samples.map((sample) => `${xScale(sample.x)},${functionY(sample.y)}`).join(' ');
  const derivativePoints = samples.map((sample) => `${xScale(sample.x)},${derivativeY(sample.derivative)}`).join(' ');

  useAnimationFrame((time) => {
    if (!active) return;
    progress.set((time % 5600) / 5600);
    const value = progress.get();
    const index = Math.min(samples.length - 1, Math.round(value * (samples.length - 1)));
    const sample = samples[index];
    const x = xScale(sample.x);
    const y = functionY(sample.y);
    const pixelsPerXUnit = 264 / 3.2;
    const angle = Math.atan2(-sample.derivative * 14, pixelsPerXUnit) * (180 / Math.PI);
    clipRef.current?.setAttribute('width', String(Math.max(0, x - 18)));
    tangentRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
  });

  return (
    <svg viewBox="0 0 300 150" role="img" aria-labelledby="derivative-ambient-title derivative-ambient-description">
      <title id="derivative-ambient-title">Tangent slopes drawing the derivative</title>
      <desc id="derivative-ambient-description">A bright tangent moves across an ink function while the matching champagne derivative is revealed at the same horizontal position.</desc>
      <defs>
        <linearGradient id="derivative-ambient-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c89b27" /><stop offset="0.4" stopColor="#f0c86a" /><stop offset="0.7" stopColor="#fffbe8" /><stop offset="0.84" stopColor="#f7d984" /><stop offset="1" stopColor="#dcb347" />
        </linearGradient>
        <filter id="derivative-ambient-glow"><feGaussianBlur stdDeviation="2.6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <clipPath id="derivative-reveal-clip"><rect ref={clipRef} x="18" y="0" width={active ? 0 : 264} height="150" /></clipPath>
      </defs>
      <path className="maths-ambient-axis" d="M10 86H290M18 138V10" />
      <polyline className="maths-derivative-ambient__function" points={functionPoints} />
      <polyline className="maths-derivative-ambient__derivative" points={derivativePoints} clipPath="url(#derivative-reveal-clip)" />
      <g ref={tangentRef} className="maths-derivative-ambient__tangent" transform="translate(150 76)">
        <line x1="-28" y1="0" x2="28" y2="0" /><circle r="4.5" />
      </g>
    </svg>
  );
};

const VectorAmbientScene = ({ active }: { active: boolean }) => (
  <svg className="maths-vector-ambient" viewBox="0 0 300 150" role="img" aria-labelledby="vector-ambient-title vector-ambient-description">
    <title id="vector-ambient-title">A vector projection revealing the dot product</title>
    <desc id="vector-ambient-description">A perpendicular falls from vector a to vector b and the projected length illuminates in gold.</desc>
    <defs>
      <linearGradient id="vector-ambient-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c89b27" /><stop offset="0.4" stopColor="#f0c86a" /><stop offset="0.7" stopColor="#fffbe8" /><stop offset="0.84" stopColor="#f7d984" /><stop offset="1" stopColor="#dcb347" />
      </linearGradient>
      <marker id="vector-ambient-arrow-ink" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path className="maths-vector-ambient__arrow-ink" d="M0 0L7 3.5L0 7Z" /></marker>
      <marker id="vector-ambient-arrow-soft-ink" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path className="maths-vector-ambient__arrow-soft-ink" d="M0 0L7 3.5L0 7Z" /></marker>
      <filter id="vector-ambient-glow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <path className="maths-ambient-axis" d="M20 124H286M38 142V10" />
    <line className="maths-vector-ambient__b" x1="38" y1="124" x2="270" y2="124" markerEnd="url(#vector-ambient-arrow-soft-ink)" />
    <line className="maths-vector-ambient__a" x1="38" y1="124" x2="188" y2="30" markerEnd="url(#vector-ambient-arrow-ink)" />
    <text className="maths-vector-ambient__label--a" x="178" y="22">a</text>
    <text className="maths-vector-ambient__label--b" x="273" y="119">b</text>
    <line className={`maths-vector-ambient__perpendicular ${active ? 'is-active' : ''}`} x1="188" y1="30" x2="188" y2="124" pathLength="1" />
    <line className={`maths-vector-ambient__projection ${active ? 'is-active' : ''}`} x1="38" y1="124" x2="188" y2="124" pathLength="1" />
    <path className="maths-vector-ambient__right-angle" d="M176 124V112H188" />
    <path className="maths-vector-ambient__angle" d="M70 124A32 32 0 0 0 65 107" />
    <text x="58" y="105">θ</text><text x="105" y="143">|a| cos θ</text>
  </svg>
);

interface AmbientMomentExportProps {
  passive?: boolean;
}

export const NetworkAmbientMoment = ({ passive = false }: AmbientMomentExportProps) => (
  <AmbientMathsMoment
    side="right"
    label="How a shortest path is found"
    equation="w(A\to B\to D\to G\to J)=3+4+2+3=12"
    equationLabel="the weight of path A B D G J equals three plus four plus two plus three, which equals twelve"
    passive={passive}
    derivation={(
      <ol>
        <li className="maths-ambient-derivation__step"><span>A network is made from vertices joined by weighted edges. Each weight can represent distance, time or cost.</span></li>
        <li className="maths-ambient-derivation__step"><span>For the illuminated path, add the edge weights:</span><InlineMath expression="3+4+2+3=12" label="three plus four plus two plus three equals twelve" />.</li>
        <li className="maths-ambient-derivation__step"><span>Compare the totals of the possible paths. The shortest path has the smallest total weight, so the gold path is retained.</span></li>
      </ol>
    )}
  >
    {(active) => <NetworkAmbientScene active={active} />}
  </AmbientMathsMoment>
);

export const DerivativeAmbientMoment = ({ passive = false }: AmbientMomentExportProps) => (
  <AmbientMathsMoment
    side="left"
    label="Let every tangent draw a new graph"
    equation="m_{\mathrm{tangent}}=f'(x)"
    equationLabel="the tangent gradient equals the derivative of f at x"
    passive={passive}
    derivation={(
      <ol>
        <li className="maths-ambient-derivation__step"><span>The ink curve is</span><InlineMath expression="f(x)=x^3-3x" label="f of x equals x cubed minus three x" />.</li>
        <li className="maths-ambient-derivation__step"><span>At each position</span><InlineMath expression="x_0" label="x nought" /><span>the moving tangent measures</span><InlineMath expression="m=f'(x_0)" label="the gradient equals f dash at x nought" />.</li>
        <li className="maths-ambient-derivation__step"><span>Plotting every measured pair</span><InlineMath expression="\bigl(x_0,f'(x_0)\bigr)" label="x nought comma f dash of x nought" /><span>draws the gradient function</span><InlineMath expression="f'(x)=3x^2-3" label="f dash of x equals three x squared minus three" />.</li>
      </ol>
    )}
  >
    {(active) => <DerivativeAmbientScene active={active} />}
  </AmbientMathsMoment>
);

export const VectorAmbientMoment = ({ passive = false }: AmbientMomentExportProps) => (
  <AmbientMathsMoment
    side="right"
    label="Project one vector onto another"
    equation="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta"
    equationLabel="vector a dot vector b equals the magnitude of a times the magnitude of b times cosine theta"
    passive={passive}
    derivation={(
      <ol>
        <li className="maths-ambient-derivation__step"><span>The perpendicular isolates the part of</span><InlineMath expression="\vec a" label="vector a" /><span>that lies in the direction of</span><InlineMath expression="\vec b" label="vector b" />.</li>
        <li className="maths-ambient-derivation__step"><span>That signed length is</span><InlineMath expression="\operatorname{proj}_{\vec b}(\vec a)=|\vec a|\cos\theta" label="the projection of vector a onto vector b equals the magnitude of a times cosine theta" />.</li>
        <li className="maths-ambient-derivation__step"><span>Multiplying the projected length by</span><InlineMath expression="|\vec b|" label="the magnitude of vector b" /><span>gives the scalar (dot) product</span><InlineMath expression="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta" label="the scalar dot product formula" />.</li>
      </ol>
    )}
  >
    {(active) => <VectorAmbientScene active={active} />}
  </AmbientMathsMoment>
);
