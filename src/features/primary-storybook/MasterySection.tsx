import { masteryOutcomes, stagePhotos } from './referenceStoryData';

const MASTERY_ASSET_ROOT = '/primary-reference/mastery';
const outcomeIcons = [
  `${MASTERY_ASSET_ROOT}/mastery-star-icon.png`,
  `${MASTERY_ASSET_ROOT}/mastery-brain-icon.png`,
  `${MASTERY_ASSET_ROOT}/mastery-collaboration-icon.png`,
  `${MASTERY_ASSET_ROOT}/mastery-graduation-icon.png`,
] as const;

const MasterySection = () => (
  <section
    id="mastery"
    className="primary-reference-mastery"
    aria-labelledby="mastery-title"
    data-primary-reference-section="mastery"
  >
    <img className="primary-reference-mastery__plane" src={`${MASTERY_ASSET_ROOT}/mastery-photo-decor.png`} alt="" loading="lazy" decoding="async" />

    <header className="primary-reference-mastery__intro">
      <div className="primary-reference-chapter" aria-label="Chapter 3, Years 5–6">
        <span>03</span>
        <p>Years 5–6</p>
      </div>
      <h2 id="mastery-title">Ready for what comes next.</h2>
      <p className="primary-reference-mastery__lead">
        We prepare students for selective entry, Year 7 transition and high school success with academic excellence and resilience.
      </p>
    </header>

    <figure className="primary-reference-mastery__photo">
      <img className="primary-reference-mastery__tape" src={`${MASTERY_ASSET_ROOT}/mastery-photo-tape.png`} alt="" loading="lazy" decoding="async" />
      <div>
        <img
          src={stagePhotos.mastery.src}
          srcSet={stagePhotos.mastery.srcSet}
          sizes={stagePhotos.mastery.sizes}
          alt={stagePhotos.mastery.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <img className="primary-reference-mastery__photo-star" src={`${MASTERY_ASSET_ROOT}/mastery-photo-star.png`} alt="" loading="lazy" decoding="async" />
      <div className="primary-reference-mastery__note" aria-hidden="true">
        <img src={`${MASTERY_ASSET_ROOT}/mastery-photo-note.png`} alt="" loading="lazy" decoding="async" />
      </div>
      <figcaption>A capable classroom,<br />looking ahead together.</figcaption>
    </figure>

    <ol className="primary-reference-mastery__outcomes" aria-label="Years 5–6 learning outcomes">
      {masteryOutcomes.map((outcome, index) => (
        <li key={outcome.number}>
          <span aria-hidden="true">{outcome.number}</span>
          <img className="primary-reference-mastery__outcome-icon" src={outcomeIcons[index]} alt="" loading="lazy" decoding="async" />
          <h3>{outcome.title}</h3>
          <p>{outcome.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default MasterySection;
