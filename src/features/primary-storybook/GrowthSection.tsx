import type { CSSProperties } from 'react';
import { growthOutcomes } from './referenceStoryData';

const GROWTH_PHOTO = '/primary-reference/growth/years-3-4-learning-scene.png';
const GROWTH_OUTCOME_ATLAS = '/primary-reference/growth/years-3-4-outcome-atlas.png';
const GROWTH_DECOR_ATLAS = '/primary-reference/growth/years-3-4-decor-atlas.png';

const GrowthSection = () => (
  <section id="growth" className="primary-reference-growth" aria-labelledby="growth-title" data-primary-reference-section="growth" style={{ '--growth-decor-atlas': `url(${GROWTH_DECOR_ATLAS})` } as CSSProperties}>
    <div className="primary-reference-growth__intro">
      <div className="primary-reference-chapter" aria-label="Chapter 2, Years 3–4"><span>02</span><p>Years 3–4</p></div>
      <h2 id="growth-title" aria-label="Growing skills. Building independence."><span>Growing</span><span>skills. Building</span><span>independence.</span></h2>
      <p className="primary-reference-growth__lead">We help students think deeper, work independently and take on new challenges with confidence.</p>
      <aside className="primary-reference-growth__small-steps"><span className="primary-reference-growth__sprout" aria-hidden="true" /><p><strong>Small steps today.</strong>Stronger thinkers tomorrow.</p></aside>
    </div>
    <figure className="primary-reference-growth__photo">
      <div><img src={GROWTH_PHOTO} alt="A tutor guiding two primary students through an open workbook" loading="lazy" decoding="async" /></div>
      <span className="primary-reference-growth__tape" aria-hidden="true" />
      <span className="primary-reference-growth__flower" aria-hidden="true" />
      <figcaption>Guidance nearby. Ownership growing.</figcaption>
    </figure>
    <ol className="primary-reference-growth__outcomes" aria-label="Years 3–4 learning outcomes" style={{ '--growth-outcome-atlas': `url(${GROWTH_OUTCOME_ATLAS})` } as CSSProperties}>
      {growthOutcomes.map((outcome, index) => (
        <li key={outcome.number}>
          <span className={`primary-reference-growth__outcome-icon primary-reference-growth__outcome-icon--${index + 1}`} aria-hidden="true" />
          <b aria-hidden="true">{outcome.number}</b>
          <div><h3>{outcome.title}</h3><p>{outcome.body}</p></div>
        </li>
      ))}
    </ol>
  </section>
);

export default GrowthSection;
