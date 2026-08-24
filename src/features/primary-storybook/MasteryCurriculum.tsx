import { curriculumBands } from './referenceStoryData';

const MasteryCurriculum = () => {
  const curriculum = curriculumBands.mastery;

  return (
    <section
      id="mastery-curriculum"
      className="primary-reference-stage-curriculum primary-reference-stage-curriculum--mastery"
      aria-labelledby="mastery-curriculum-title"
      data-primary-reference-section="mastery-curriculum"
    >
      <header className="primary-reference-stage-curriculum__header">
        <p>{curriculum.years} {curriculum.title}</p>
        <h2 id="mastery-curriculum-title">Preparing them for the next chapter.</h2>
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

export default MasteryCurriculum;
