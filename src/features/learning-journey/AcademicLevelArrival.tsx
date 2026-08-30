import { JourneyScene } from "./JourneyScene";

export const AcademicLevelArrival = () => (
  <JourneyScene
    id="academic-level"
    className="journey-arrival"
    data-journey-academic-arrival
  >
    <article
      className="journey-arrival__content"
      aria-labelledby="academic-level-heading"
    >
      <p className="journey-arrival__scene-label">01 — ACADEMIC LEVEL</p>
      <h2 id="academic-level-heading" className="journey-arrival__heading">
        Where is your child academically right now?
      </h2>
      <ul
        className="journey-arrival__destinations"
        aria-label="Academic level destinations"
      >
        <li>Rebuilding foundations</li>
        <li>Around their year level</li>
        <li>Above their year level</li>
      </ul>
    </article>
  </JourneyScene>
);
