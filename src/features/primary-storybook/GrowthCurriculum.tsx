import { curriculumBands } from './referenceStoryData';

const GrowthCurriculum = () => {
  const curriculum = curriculumBands.growth;

  return (
    <section
      id="growth-curriculum"
      className="primary-reference-stage-curriculum primary-reference-stage-curriculum--growth"
      aria-labelledby="growth-curriculum-title"
      data-primary-reference-section="growth-curriculum"
    >
      <header className="primary-reference-stage-curriculum__header">
        <p>{curriculum.years} {curriculum.title}</p>
        <h2 id="growth-curriculum-title">Explore what they’ll master next.</h2>
      </header>

      <ul className="primary-reference-stage-curriculum__list">
        {curriculum.items.map((item) => (
          <li key={item.title} data-accent={item.accent}>
            <span aria-hidden="true" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GrowthCurriculum;
