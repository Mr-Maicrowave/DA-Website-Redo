import { foundationOutcomes, referenceStoryAssets, stagePhotos } from './referenceStoryData';

const FoundationSection = () => (
  <section
    id="foundation"
    className="primary-reference-foundation"
    aria-labelledby="foundation-title"
    data-primary-reference-section="foundation"
  >
    <div className="primary-reference-foundation__doodles" aria-hidden="true">
      <img src={referenceStoryAssets.foundationDecor} alt="" />
    </div>

    <div className="primary-reference-foundation__intro">
      <div className="primary-reference-chapter" aria-label="Chapter 1, Years 1–2">
        <span>01</span>
        <p>Years 1–2</p>
      </div>
      <h2 id="foundation-title">Strong foundations shape everything that follows.</h2>
      <p className="primary-reference-foundation__lead">
        We build core skills, spark curiosity and nurture confidence—creating the strongest start for your child’s future.
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
          <span aria-hidden="true">{outcome.number}</span>
          <div>
            <h3>{outcome.title}</h3>
            <p>{outcome.body}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default FoundationSection;
