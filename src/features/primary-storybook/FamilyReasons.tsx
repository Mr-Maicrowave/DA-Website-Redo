import { familyReasons, referenceStoryAssets } from './referenceStoryData';

const familyIconPositions = ['4%', '38%', '67%', '100%'] as const;

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

    <ol className="primary-family-reasons__list">
      {familyReasons.map((reason, index) => (
        <li key={reason.title}>
          <span
            className="primary-family-reasons__icon"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${referenceStoryAssets.familyIcons})`,
              backgroundPosition: `${familyIconPositions[index]} center`,
            }}
          />
          <h3>{reason.title}</h3>
          <p>{reason.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default FamilyReasons;
