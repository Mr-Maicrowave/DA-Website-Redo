import { curriculumBands } from './referenceStoryData';

const MASTERY_ASSET_ROOT = '/primary-reference/mastery';
const curriculumArt = [
  `${MASTERY_ASSET_ROOT}/mastery-writing-books.png`,
  `${MASTERY_ASSET_ROOT}/mastery-reasoning-sheet.png`,
  `${MASTERY_ASSET_ROOT}/mastery-year-seven-books.png`,
] as const;

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
        {curriculum.items.map((item, index) => (
          <li key={item.title} data-accent={item.accent}>
            <span aria-hidden="true" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
            <img className="primary-reference-stage-curriculum__art" src={curriculumArt[index]} alt="" loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <img className="primary-reference-stage-curriculum__meadow" src={`${MASTERY_ASSET_ROOT}/mastery-meadow-strip.png`} alt="" loading="lazy" decoding="async" />
      <img className="primary-reference-stage-curriculum__signpost" src={`${MASTERY_ASSET_ROOT}/mastery-signpost.png`} alt="" loading="lazy" decoding="async" />
    </section>
  );
};

export default MasteryCurriculum;
