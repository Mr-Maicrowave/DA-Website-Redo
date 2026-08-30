import './year-cube.css';

/**
 * This loads the original prototype unchanged. It owns its own styles and
 * interaction loop so the cube, drag physics, and six exploration sequences
 * remain exactly as designed rather than being approximated in React.
 */
export function YearCube() {
  return (
    <section className="year-cube" aria-label="Years 7 to 12 mathematics cube">
      <iframe
        className="year-cube__experience"
        src="/interactive/year-cube/index.html?v=blueprint-noselect-20260830"
        title="Interactive Years 7 to 12 mathematics cube"
      />
    </section>
  );
}
