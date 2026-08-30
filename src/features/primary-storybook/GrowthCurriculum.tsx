import type { CSSProperties } from 'react';
import { curriculumBands } from './referenceStoryData';

const GROWTH_CURRICULUM_ATLAS = '/primary-reference/growth/years-3-4-curriculum-atlas.png';
const GROWTH_GARDEN = '/primary-reference/growth/years-3-4-garden-strip.png';

const GrowthCurriculum = () => {
  const curriculum = curriculumBands.growth;
  return (
    <section id="growth-curriculum" className="primary-reference-stage-curriculum primary-reference-stage-curriculum--growth" aria-labelledby="growth-curriculum-title" data-primary-reference-section="growth-curriculum" style={{ '--growth-curriculum-atlas': `url(${GROWTH_CURRICULUM_ATLAS})` } as CSSProperties}>
      <header className="primary-reference-stage-curriculum__header"><p>{curriculum.years} {curriculum.title}</p><h2 id="growth-curriculum-title">Explore what they’ll master next.</h2></header>
      <ul className="primary-reference-stage-curriculum__list">
        {curriculum.items.map((item, index) => (
          <li key={item.title} data-accent={item.accent}>
            <span aria-hidden="true" />
            <div><h3>{item.title}</h3><p>{item.detail}</p></div>
            <span className={`primary-reference-stage-curriculum__art primary-reference-stage-curriculum__art--${index + 1}`} style={{ backgroundPosition: `${index * 50}% center` }} aria-hidden="true" />
          </li>
        ))}
      </ul>
      <img className="primary-reference-stage-curriculum__garden" src={GROWTH_GARDEN} alt="" loading="lazy" decoding="async" />
    </section>
  );
};

export default GrowthCurriculum;
