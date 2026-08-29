import { ArrowRight } from 'lucide-react';
import { CurriculumToAquariumConnector } from './StoryConnectors';
import { curriculumBands } from './referenceStoryData';

const SCHOOL_SCENE = '/primary-reference/curriculum/years-1-2-school-scene.png';
const CURRICULUM_ATLAS = '/primary-reference/curriculum/years-1-2-curriculum-atlas.png';

const FoundationCurriculum = () => {
  const curriculum = curriculumBands.foundation;

  return (
    <section
      id="foundation-curriculum"
      className="primary-reference-curriculum"
      aria-labelledby="foundation-curriculum-title"
      data-primary-reference-section="foundation-curriculum"
    >
      <div className="primary-reference-curriculum__hero">
        <header className="primary-reference-curriculum__intro">
          <p>{curriculum.years}</p>
          <h2 id="foundation-curriculum-title">Explore<br />what they’ll learn<span>.</span></h2>
          <strong>A joyful start to big discoveries.</strong>
          <a href="#primary-seed-challenge">Discover the journey <ArrowRight aria-hidden="true" /></a>
        </header>

        <figure className="primary-reference-curriculum__school">
          <img src={SCHOOL_SCENE} alt="A colourful crayon school surrounded by flowers, books and playful learning doodles" />
          <figcaption>Curiosity<br />Confidence<br />Character <b aria-hidden="true">♥</b></figcaption>
        </figure>
        <CurriculumToAquariumConnector />
      </div>

      <div className="primary-reference-curriculum__list">
        <h3>{curriculum.title}</h3>
        <ul>
          {curriculum.items.map((item, index) => (
            <li className="primary-reference-curriculum__row" key={item.title} data-accent={item.accent}>
              <span className={`primary-reference-curriculum__row-icon primary-reference-curriculum__row-icon--${index + 1}`} style={{ backgroundImage: `url(${CURRICULUM_ATLAS})` }} aria-hidden="true" />
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
              <span className={`primary-reference-curriculum__row-art primary-reference-curriculum__row-art--${index + 1}`} style={{ backgroundImage: `url(${CURRICULUM_ATLAS})` }} aria-hidden="true" />
              <a href="#primary-seed-challenge" aria-label={`Explore ${item.title}`}><ArrowRight aria-hidden="true" /></a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FoundationCurriculum;
