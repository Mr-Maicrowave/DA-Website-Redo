import { familyReasons, referenceStoryAssets } from './referenceStoryData';

const FamilyReasons = () => (
  <section
    id="family-reasons"
    className="primary-family-reasons"
    aria-labelledby="family-reasons-title"
    data-primary-reference-section="family-reasons"
  >
    <header className="primary-family-reasons__header">
      <p>Why DA feels different</p>
      <h2 id="family-reasons-title">Why families choose DA.</h2>
    </header>

    <div className="primary-family-reasons__icons" aria-hidden="true">
      <img src={referenceStoryAssets.familyIcons} alt="" loading="lazy" decoding="async" />
    </div>

    <ol className="primary-family-reasons__list">
      {familyReasons.map((reason, index) => (
        <li key={reason.title}>
          <span aria-hidden="true">0{index + 1}</span>
          <h3>{reason.title}</h3>
          <p>{reason.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default FamilyReasons;
