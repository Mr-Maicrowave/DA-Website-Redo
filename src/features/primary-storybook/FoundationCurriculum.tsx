import PrimaryAquarium from './PrimaryAquarium';
import { CurriculumToAquariumConnector } from './StoryConnectors';
import { curriculumBands, referenceStoryAssets } from './referenceStoryData';

const FoundationCurriculum = () => {
  const curriculum = curriculumBands.foundation;

  return (
    <section
      id="foundation-curriculum"
      className="primary-reference-curriculum"
      aria-labelledby="foundation-curriculum-title"
      data-primary-reference-section="foundation-curriculum"
    >
      <div className="primary-reference-curriculum__lesson">
        <header>
          <p>{curriculum.years}</p>
          <h2 id="foundation-curriculum-title">Explore what they’ll learn.</h2>
        </header>

        <img
          className="primary-reference-curriculum__illustration"
          src={referenceStoryAssets.curriculumHouse}
          alt=""
          aria-hidden="true"
        />

        <div className="primary-reference-curriculum__list">
          <h3>{curriculum.title}</h3>
          <ul>
            {curriculum.items.map((item) => (
              <li key={item.title} data-accent={item.accent}>
                <span aria-hidden="true" />
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CurriculumToAquariumConnector />
      <PrimaryAquarium />
    </section>
  );
};

export default FoundationCurriculum;
