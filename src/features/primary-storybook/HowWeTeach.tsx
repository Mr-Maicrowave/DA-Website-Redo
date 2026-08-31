import { teachingSteps } from './referenceStoryData';
import { TeachingPathSegment } from './StoryConnectors';

const TEACHING_DECOR_ATLAS = '/primary-reference/teaching/teaching-decor-atlas.png';
const TEACHING_COMPOSITE_IMAGES = [
  '/primary-reference/teaching/teaching-composite-explain.png',
  '/primary-reference/teaching/teaching-composite-practise.png',
  '/primary-reference/teaching/teaching-composite-independent.png',
  '/primary-reference/teaching/teaching-composite-celebrate.png',
] as const;

const HowWeTeach = () => (
  <section
    id="pathway"
    className="primary-reference-teaching"
    aria-labelledby="pathway-title"
    data-primary-reference-section="pathway"
  >
    <header className="primary-reference-teaching__header">
      <p>One clear step at a time</p>
      <h2 id="pathway-title">How we teach</h2>
      <span>Clear teaching, guided practice and independent confidence make every lesson count.</span>
    </header>

    <div className="primary-reference-teaching__journey">
      <div className="primary-reference-teaching__segments" aria-hidden="true">
        {teachingSteps.slice(0, -1).map((step, index) => (
          <TeachingPathSegment key={`${step.number}-connector`} index={index} />
        ))}
      </div>
      <ol>
        {teachingSteps.map((step, index) => (
          <li key={step.number}>
            <figure>
              <div
                className={`primary-reference-teaching__photo primary-reference-teaching__photo--${index + 1}`}
                data-photo-slot={`teaching-step-${step.number}`}
              >
                <img src={TEACHING_COMPOSITE_IMAGES[index]} alt={step.title} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span aria-hidden="true">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
    <aside className="primary-reference-teaching__difference">
      <span className="primary-reference-teaching__books primary-reference-teaching__decor" style={{ backgroundImage: `url(${TEACHING_DECOR_ATLAS})` }} aria-hidden="true" />
      <div>
        <strong>Every child. Every lesson. Every step forward.</strong>
        <em>That’s the DA difference.</em>
      </div>
      <span className="primary-reference-teaching__trophy primary-reference-teaching__decor" style={{ backgroundImage: `url(${TEACHING_DECOR_ATLAS})` }} aria-hidden="true" />
    </aside>
  </section>
);

export default HowWeTeach;
