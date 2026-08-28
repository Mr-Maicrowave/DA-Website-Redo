import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import './year-cube.css';

type Rotation = { x: number; y: number };

const YEARS = [7, 8, 9, 10, 11, 12] as const;

const YEAR_DETAILS: Record<(typeof YEARS)[number], { title: string; summary: string; focus: string[]; rotation: Rotation }> = {
  7: {
    title: 'Start with the language of mathematics.',
    summary: 'Build confidence with the foundational ideas that make every later topic easier to read, explain and use.',
    focus: ['Number and order of operations', 'Fractions, decimals and percentages', 'Measurement and introductory algebra'],
    rotation: { x: -22, y: 32 },
  },
  8: {
    title: 'Make algebra feel usable.',
    summary: 'Students turn their number skills into equations, patterns and relationships they can reason through.',
    focus: ['Algebraic foundations', 'Linear relationships', 'Geometry and probability'],
    rotation: { x: -22, y: 92 },
  },
  9: {
    title: 'Connect the ideas across Stage 5.',
    summary: 'Algebra, graphs, measurement and trigonometry begin to support each other instead of feeling like separate chapters.',
    focus: ['Quadratics and graphing', 'Pythagoras and trigonometry', 'Data, probability and proof'],
    rotation: { x: -22, y: 152 },
  },
  10: {
    title: 'Consolidate before choosing a pathway.',
    summary: 'Students strengthen the habits and concepts that let them move into the right senior mathematics course with clarity.',
    focus: ['Stage 5 consolidation', 'Functions and further algebra', 'HSC pathway preparation'],
    rotation: { x: -22, y: 212 },
  },
  11: {
    title: 'Establish the Preliminary course.',
    summary: 'The senior course begins with connected representations, problem-solving routines and a stronger mathematical voice.',
    focus: ['Preliminary course foundations', 'Functions, calculus and statistics', 'Choosing the right level of challenge'],
    rotation: { x: 28, y: 32 },
  },
  12: {
    title: 'Prepare for the HSC with purpose.',
    summary: 'Past papers become useful evidence: what is secure, what needs attention and how a student can improve next.',
    focus: ['HSC content and revision', 'Past-paper reasoning', 'Exam technique and confidence'],
    rotation: { x: -52, y: 32 },
  },
};

const FACE_TRANSFORMS: Record<(typeof YEARS)[number], string> = {
  7: 'rotateY(0deg) translateZ(calc(var(--cube-size) / 2))',
  8: 'rotateY(90deg) translateZ(calc(var(--cube-size) / 2))',
  9: 'rotateY(180deg) translateZ(calc(var(--cube-size) / 2))',
  10: 'rotateY(-90deg) translateZ(calc(var(--cube-size) / 2))',
  11: 'rotateX(90deg) translateZ(calc(var(--cube-size) / 2))',
  12: 'rotateX(-90deg) translateZ(calc(var(--cube-size) / 2))',
};

function renderRotation(cube: HTMLDivElement | null, rotation: Rotation, animate = true) {
  if (!cube) return;
  cube.style.transition = animate ? 'transform 680ms cubic-bezier(.2,.8,.2,1)' : 'none';
  cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
}

export function YearCube() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ ...YEAR_DETAILS[7].rotation });
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const driftFrame = useRef<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<(typeof YEARS)[number]>(7);
  const [faceMotionKey, setFaceMotionKey] = useState(0);
  const [driftPaused, setDriftPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const chooseYear = (year: (typeof YEARS)[number], animate = true) => {
    setSelectedYear(year);
    setFaceMotionKey((key) => key + 1);
    rotationRef.current = { ...YEAR_DETAILS[year].rotation };
    renderRotation(cubeRef.current, rotationRef.current, animate);
  };

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion || driftPaused) return;
    let previous = performance.now();
    const drift = (now: number) => {
      const elapsed = Math.min(now - previous, 40);
      previous = now;
      rotationRef.current = { ...rotationRef.current, y: rotationRef.current.y + elapsed * 0.008 };
      renderRotation(cubeRef.current, rotationRef.current, false);
      driftFrame.current = requestAnimationFrame(drift);
    };
    driftFrame.current = requestAnimationFrame(drift);
    return () => {
      if (driftFrame.current) cancelAnimationFrame(driftFrame.current);
      driftFrame.current = null;
    };
  }, [driftPaused, reducedMotion]);

  const changeBy = (delta: number) => {
    const index = YEARS.indexOf(selectedYear);
    chooseYear(YEARS[(index + delta + YEARS.length) % YEARS.length]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      changeBy(-1);
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      changeBy(1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const changeX = event.clientX - drag.x;
    const changeY = event.clientY - drag.y;
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
    rotationRef.current = { x: rotationRef.current.x - changeY * 0.35, y: rotationRef.current.y + changeX * 0.35 };
    renderRotation(cubeRef.current, rotationRef.current, false);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const selected = YEAR_DETAILS[selectedYear];

  return (
    <section className="year-cube" aria-labelledby="year-cube-heading">
      <div className="year-cube__inner">
        <div className="year-cube__intro">
          <p className="year-cube__eyebrow">Years 7–12 Mathematics</p>
          <h2 id="year-cube-heading">Step inside a year level.</h2>
          <p className="year-cube__lede">Each face is a different point in the journey: foundations, connections, senior pathways and purposeful HSC preparation.</p>

          <div className="year-cube__picker" role="group" aria-label="Choose a year level" onKeyDown={onKeyDown}>
            {YEARS.map((year) => (
              <button key={year} type="button" aria-pressed={year === selectedYear} onClick={() => chooseYear(year)}>
                Year {year}
              </button>
            ))}
          </div>

          <p className="year-cube__hint">Drag the cube, use the arrow keys, or choose a year level.</p>
          <button className="year-cube__drift" type="button" onClick={() => setDriftPaused((paused) => !paused)}>
            {driftPaused || reducedMotion ? 'Resume drift' : 'Pause drift'}
          </button>
        </div>

        <div className="year-cube__stage" aria-label={`Interactive cube showing Year ${selectedYear}`}>
          <div
            className="year-cube__grab-area"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="year-cube__scene">
              <div className="year-cube__solid" ref={cubeRef}>
                {YEARS.map((year) => (
                  <button
                    aria-label={`Show Year ${year} details`}
                    className="year-cube__face"
                    data-selected={year === selectedYear}
                    data-year={year}
                    key={year}
                    onClick={(event) => { event.stopPropagation(); chooseYear(year); }}
                    onPointerDown={(event) => event.stopPropagation()}
                    style={{ transform: FACE_TRANSFORMS[year] }}
                    type="button"
                  >
                    <span className="year-cube__face-label">Year {year}</span>
                    <strong key={`${year}-${faceMotionKey}`} className="year-cube__face-title">{YEAR_DETAILS[year].title}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <article className="year-cube__detail" aria-live="polite">
            <p>Year {selectedYear}</p>
            <h3>{selected.title}</h3>
            <span aria-hidden="true" />
            <p className="year-cube__summary">{selected.summary}</p>
            <ul>{selected.focus.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </div>
    </section>
  );
}
