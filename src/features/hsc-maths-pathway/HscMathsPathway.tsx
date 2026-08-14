import { useState, type JSX } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Compass,
  GraduationCap,
  HelpCircle,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HSC_STREAMS,
  getActivePath,
  getHscStream,
  type HscStream,
  type HscStreamId,
} from './hsc-maths-pathway-model';

const DETAIL_ITEMS = [
  { label: 'Best fit when', field: 'bestFit', icon: Target },
  { label: 'What changes', field: 'whatChanges', icon: TrendingUp },
  { label: 'Where students need help', field: 'helpNeeded', icon: HelpCircle },
  { label: 'How DA helps', field: 'daSupport', icon: Compass },
] as const;

const DESKTOP_POSITIONS: Record<HscStreamId, string> = {
  standard: 'top-[12%]',
  advanced: 'top-[31%]',
  'extension-1': 'top-[55%]',
  'extension-2': 'top-[85%]',
};

const ROUTE_SEGMENTS: Record<HscStreamId, string> = {
  standard: 'M 34 174 H 102 C 150 174 116 67 224 67',
  advanced: 'M 34 174 H 224',
  'extension-1': 'M 224 174 V 308',
  'extension-2': 'M 224 308 C 224 365 176 408 224 476',
};

function StreamDetails({ stream, compact = false }: { stream: HscStream; compact?: boolean }) {
  return (
    <div className={compact ? 'px-4 pb-5 pt-2' : 'lg:pl-10'}>
      <p
        className="inline-block border-b-2 pb-1 text-xs font-black uppercase tracking-[0.12em] text-[#071629]"
        style={{ borderColor: stream.color }}
      >
        {stream.badge}
      </p>
      <h3
        id={`hsc-stream-heading-${stream.id}`}
        className="mt-2 font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]"
      >
        {stream.name} at a glance
      </h3>
      <dl className="mt-6 grid gap-5">
        {DETAIL_ITEMS.map(({ label, field, icon: Icon }) => (
          <div key={field} className="grid grid-cols-[1.5rem_1fr] gap-3">
            <Icon className="mt-0.5 h-5 w-5 text-[#40516b]" aria-hidden="true" />
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.1em] text-[#071629]">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-[#40516b]">{stream[field]}</dd>
            </div>
          </div>
        ))}
      </dl>
      <details className="group mt-6 border-y border-[#071629]/15 py-4">
        <summary className="cursor-pointer text-sm font-black text-[#071629] focus-visible:outline-none focus-visible:ring-2">
          See topics covered
        </summary>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#40516b]">
          {stream.topics.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      </details>
      <Link to="/book-interview" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#071629] px-5 text-center text-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4">
        Talk through your child's course choice <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link to="/hsc-excellence" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-black text-[#071629] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4">
        Explore HSC program <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function HscMathsPathway(): JSX.Element {
  const [activeStreamId, setActiveStreamId] = useState<HscStreamId>('standard');
  const [hasSelected, setHasSelected] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const activeStream = getHscStream(activeStreamId);
  const activePath = getActivePath(activeStreamId);

  return (
    <section
      id="hsc-maths"
      className="px-5 pb-20 pt-52 text-[#071629] lg:px-8"
      style={{
        background: 'linear-gradient(180deg, #fffdf8 0px, #f5f2eb 16px, #f6ecd9 32px, #fff6e7 56px)',
      }}
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#071629]">HSC pathway map</p>
            <h2 className="max-w-3xl font-serif text-4xl font-medium leading-[1.08] tracking-[-0.04em] text-[#071629] [text-wrap:balance] lg:text-5xl">
              Find the maths stream that fits where your child is headed.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#40516b] [text-wrap:pretty]">
            Follow the pathway from Year 10 to see how each course builds on the last. Choose a course to compare content, support needs and next steps.
          </p>
        </div>

        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-[#071629]/20 bg-[#fffdf8] lg:grid lg:grid-cols-[0.72fr_1.15fr_0.9fr]">
          <aside className="m-8 border-r border-[#c9921b]/55 py-8 pr-8 xl:m-10 xl:pr-10" aria-label="HSC course selection guidance">
            <p className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#071629]">HSC Maths</p>
            <p className="mt-4 text-sm leading-7 text-[#40516b]">
              Already enrolled? Select your course. Still deciding? We can help.
            </p>
            <div className="mt-8 border-t border-[#c9921b]/60 pt-8">
              <GraduationCap className="h-7 w-7 text-[#40516b]" aria-hidden="true" />
              <p className="mt-4 text-sm leading-7 text-[#40516b]">
                Course selection at the end of Year 10 shapes senior study and future options. We are here to make the choice clear and confident.
              </p>
            </div>
          </aside>

          <div className="relative min-h-[38rem] border-r border-[#c9921b]/45 px-5 py-8 xl:px-8" aria-label="Choose an HSC mathematics stream">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 520 560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="hsc-pathway-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>

              {Object.entries(ROUTE_SEGMENTS).map(([id, path]) => (
                <path
                  key={`available-${id}`}
                  d={path}
                  fill="none"
                  stroke="#b5b2aa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {activePath.map((pathId) => {
                const pathStream = getHscStream(pathId);
                return (
                  <g key={`${activeStreamId}-${pathId}`}>
                    <motion.path
                      d={ROUTE_SEGMENTS[pathId]}
                      fill="none"
                      stroke={pathStream.vividColor}
                      strokeOpacity="0.22"
                      strokeWidth="13"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      filter="url(#hsc-pathway-glow)"
                      initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: hasSelected ? 0.48 : 0.58, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.path
                      d={ROUTE_SEGMENTS[pathId]}
                      fill="none"
                      stroke={pathStream.vividColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={prefersReducedMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: hasSelected ? 0.48 : 0.58, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </g>
                );
              })}
            </svg>

            <span className="pointer-events-none absolute left-[4%] top-[29%] text-[11px] font-black uppercase tracking-[0.12em] text-[#071629]" aria-hidden="true">
              Year 10
            </span>

            {HSC_STREAMS.map((stream) => {
              const isSelected = stream.id === activeStreamId;
              return (
                <button
                  key={stream.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveStreamId(stream.id);
                    setHasSelected(true);
                  }}
                  className={`group absolute left-[40%] z-10 min-h-14 w-[57%] -translate-y-1/2 bg-[#fffdf8]/90 px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${DESKTOP_POSITIONS[stream.id]}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4 shrink-0 rounded-full border-[3px] bg-[#fffdf8]" style={{ borderColor: stream.color }} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-2xl font-medium text-[#071629]">{stream.name}</span>
                      <span className="mt-1 block text-sm text-[#071629]">{stream.shortDescriptor}</span>
                    </span>
                    {isSelected ? (
                      <span
                        className="ml-auto border px-2 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#071629]"
                        style={{ borderColor: stream.color }}
                      >
                        Selected
                      </span>
                    ) : null}
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#40516b]" aria-hidden="true" />
                  </span>
                </button>
              );
            })}

            <div className="absolute inset-x-[10%] top-[68%] flex items-center gap-3" aria-label="Year 12 threshold">
              <span className="h-px flex-1 bg-[#40516b]/45" aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[#071629]">Year 12</span>
              <span className="h-px flex-1 bg-[#40516b]/45" aria-hidden="true" />
            </div>
            <p className="absolute inset-x-0 top-[72%] text-center text-xs font-bold text-[#071629]">Extension 2 becomes available</p>
            <div className="absolute left-[42%] top-[91%] text-xs leading-5 text-[#071629]">
              <p className="font-black uppercase tracking-[0.08em] text-[#071629]">Year 12 only</p>
              <p className="text-[#071629]">Requires Advanced + Extension 1</p>
            </div>
          </div>

          <motion.div
            key={activeStream.id}
            className="m-8 self-center xl:m-10"
            role="region"
            aria-labelledby={`hsc-stream-heading-${activeStream.id}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: hasSelected ? 8 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <StreamDetails stream={activeStream} />
          </motion.div>
        </div>

        <div className="mt-10 overflow-hidden border-y border-[#071629]/20 bg-[#fffdf8] lg:hidden">
          <div className="border-b border-[#071629]/15 px-4 py-5">
            <p className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]">HSC Maths</p>
            <p className="mt-2 text-sm leading-6 text-[#40516b]">Choose a course to see where it leads and how DA can help.</p>
          </div>
          {HSC_STREAMS.map((stream) => {
            const isSelected = stream.id === activeStreamId;
            const panelId = `hsc-stream-panel-${stream.id}`;
            return (
              <div key={stream.id} className="border-b border-[#071629]/15 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isSelected}
                  aria-controls={panelId}
                  onClick={() => setActiveStreamId(stream.id)}
                  className="min-h-14 w-full px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                >
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: stream.color }} aria-hidden="true" />
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-serif text-xl font-medium text-[#071629]">{stream.name}</span>
                      <span className="block text-sm text-[#071629]">{stream.shortDescriptor}</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#40516b] transition-transform motion-reduce:transition-none ${isSelected ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                </button>
                {isSelected ? (
                  <div id={panelId} role="region" aria-label={`${stream.name} course details`}>
                    <StreamDetails stream={stream} compact />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
