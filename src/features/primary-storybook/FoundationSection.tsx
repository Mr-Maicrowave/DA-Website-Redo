import { foundationOutcomes, referenceStoryAssets, stagePhotos } from './referenceStoryData';

const FoundationSection = () => (
  <section
    id="foundation"
    className="primary-reference-foundation"
    aria-labelledby="foundation-title"
    data-primary-reference-section="foundation"
  >
    <div className="primary-reference-foundation__doodles" aria-hidden="true">
      <img src={referenceStoryAssets.foundationLeftDecor} alt="" />
    </div>

    <div className="primary-reference-foundation__intro">
      <div className="primary-reference-chapter" aria-label="Chapter 1, Years 1–2">
        <span>01</span>
        <p>Years 1–2</p>
      </div>
      <h2 id="foundation-title" aria-label="Strong foundations shape everything that follows.">
        <span aria-hidden="true">Strong <em>foundations</em></span>
        <span aria-hidden="true">shape everything</span>
        <span aria-hidden="true">that follows.</span>
      </h2>
      <p className="primary-reference-foundation__lead">
        In Years 1–2, we build the skills, habits and confidence that set children up for every future success.
      </p>
    </div>

    <figure className="primary-reference-foundation__photo">
      <div>
        <img src={stagePhotos.foundation.src} alt={stagePhotos.foundation.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption>Patient guidance. Small wins. A love of learning.</figcaption>
    </figure>

    <ol className="primary-reference-foundation__outcomes" aria-label="Years 1–2 learning outcomes">
      {foundationOutcomes.map((outcome) => (
        <li key={outcome.number}>
          <span
            className={`primary-reference-foundation__outcome-icon primary-reference-foundation__outcome-icon--${outcome.number}`}
            style={{ backgroundImage: `url(${referenceStoryAssets.foundationOutcomeDecor})` }}
            aria-hidden="true"
          />
          <div>
            <b aria-hidden="true">{outcome.number}</b>
            <h3>{outcome.title}</h3>
            <p>{outcome.body}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default FoundationSection;
