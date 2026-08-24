import { masteryOutcomes, referenceStoryAssets, stagePhotos } from './referenceStoryData';

const MasterySection = () => (
  <section
    id="mastery"
    className="primary-reference-mastery"
    aria-labelledby="mastery-title"
    data-primary-reference-section="mastery"
  >
    <div className="primary-reference-mastery__doodles" aria-hidden="true">
      <img src={referenceStoryAssets.masteryDecor} alt="" loading="lazy" decoding="async" />
    </div>

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
      <div>
        <img src={stagePhotos.mastery.src} alt={stagePhotos.mastery.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption>A capable classroom, looking ahead together.</figcaption>
    </figure>

    <ol className="primary-reference-mastery__outcomes" aria-label="Years 5–6 learning outcomes">
      {masteryOutcomes.map((outcome) => (
        <li key={outcome.number}>
          <span aria-hidden="true">{outcome.number}</span>
          <h3>{outcome.title}</h3>
          <p>{outcome.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default MasterySection;
