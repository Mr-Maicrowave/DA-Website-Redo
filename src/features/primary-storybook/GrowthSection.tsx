import { growthOutcomes, referenceStoryAssets, stagePhotos } from './referenceStoryData';

const GrowthSection = () => (
  <section
    id="growth"
    className="primary-reference-growth"
    aria-labelledby="growth-title"
    data-primary-reference-section="growth"
  >
    <div className="primary-reference-growth__doodles" aria-hidden="true">
      <img src={referenceStoryAssets.growthDecor} alt="" loading="lazy" decoding="async" />
    </div>

    <div className="primary-reference-growth__intro">
      <div className="primary-reference-chapter" aria-label="Chapter 2, Years 3–4">
        <span>02</span>
        <p>Years 3–4</p>
      </div>
      <h2 id="growth-title">Growing skills. Building independence.</h2>
      <p className="primary-reference-growth__lead">
        We help students think deeper, work independently and take on new challenges with confidence.
      </p>
    </div>

    <figure className="primary-reference-growth__photo">
      <div>
        <img src={stagePhotos.growth.src} alt={stagePhotos.growth.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption>Guidance nearby. Ownership growing.</figcaption>
    </figure>

    <ol className="primary-reference-growth__outcomes" aria-label="Years 3–4 learning outcomes">
      {growthOutcomes.map((outcome) => (
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

export default GrowthSection;
