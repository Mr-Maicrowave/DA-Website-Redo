const ASSET_ROOT = '/primary-reference/support-journey';

const transformationStages = [
  {
    label: 'Before DA',
    lines: ['Not understood.', 'Falling behind.', 'Losing confidence.'],
    image: `${ASSET_ROOT}/before-da-child.png`,
    alt: 'A child feeling discouraged before receiving the right learning support',
  },
  {
    label: 'We find the right support',
    lines: ['The right program.', 'The right pace.', 'The right support.'],
    image: `${ASSET_ROOT}/right-support-tutor.png`,
    alt: 'A tutor giving a child patient, individual learning support',
  },
  {
    label: 'After DA',
    lines: ['Confident.', 'Independent.', 'Enjoying learning.'],
    image: `${ASSET_ROOT}/after-da-child.png`,
    alt: 'A confident child celebrating progress after receiving support',
  },
] as const;

const pathways = [
  {
    title: 'Behind → Foundations',
    body: 'We fill gaps and rebuild understanding with clear, patient teaching.',
    image: `${ASSET_ROOT}/pathway-seedling.png`,
    alt: 'A small seedling beginning to grow',
    tone: 'blue',
  },
  {
    title: 'On track → Consolidate',
    body: 'We strengthen skills and build confidence to keep moving forward.',
    image: `${ASSET_ROOT}/pathway-plant.png`,
    alt: 'A healthy young plant growing steadily',
    tone: 'green',
  },
  {
    title: 'Ahead → Extension',
    body: 'We extend learning, deepen thinking and take on new challenges.',
    image: `${ASSET_ROOT}/pathway-tree.png`,
    alt: 'A mature leafy tree representing extended growth',
    tone: 'pink',
  },
  {
    title: 'Highly capable → Advanced pathway',
    body: 'We provide advanced content and enrichment for high-potential learners.',
    image: `${ASSET_ROOT}/pathway-mountain.png`,
    alt: 'A mountain path reaching a golden flag at the summit',
    tone: 'violet',
  },
] as const;

const SupportJourney = () => (
  <div className="primary-support-journey">
    <section className="primary-support-journey__transformation" aria-labelledby="support-journey-title">
      <header className="primary-support-journey__intro">
        <p className="primary-support-journey__eyebrow">Different kids. Different needs.</p>
        <p className="primary-support-journey__gold-line">The right fit changes everything.</p>
        <h2 id="support-journey-title">We help every child find their place.</h2>
        <p>Every child learns in their own way and at their own pace. The right support brings back confidence, enjoyment and a love of learning.</p>
      </header>

      <div className="primary-support-journey__stages">
        {transformationStages.map((stage, index) => (
          <div className="primary-support-journey__stage-wrap" key={stage.label}>
            <article className={`primary-support-journey__stage primary-support-journey__stage--${index + 1}`}>
              <strong>{stage.label}</strong>
              <p>{stage.lines.map((line) => <span key={line}>{line}</span>)}</p>
              <img src={stage.image} alt={stage.alt} loading="lazy" decoding="async" />
            </article>
            {index < transformationStages.length - 1 && <span className="primary-support-journey__arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      <aside className="primary-support-journey__quote">
        <p>The right support changes everything.</p>
        <img src={`${ASSET_ROOT}/support-heart-sparkle.png`} alt="" aria-hidden="true" />
      </aside>
    </section>

    <section className="primary-support-pathways" aria-labelledby="support-pathways-title">
      <h2 id="support-pathways-title">Every child starts somewhere. We meet them there.</h2>
      <div className="primary-support-pathways__list">
        {pathways.map((pathway) => (
          <article className="primary-support-pathways__item" data-tone={pathway.tone} key={pathway.title}>
            <img src={pathway.image} alt={pathway.alt} loading="lazy" decoding="async" />
            <div>
              <h3>{pathway.title}</h3>
              <p>{pathway.body}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="primary-support-pathways__quote">
        <strong>Different starting points.<br />Same destination.</strong>
        <p>Confidence, independence and a love of learning.</p>
        <img src={`${ASSET_ROOT}/support-heart-sparkle.png`} alt="" aria-hidden="true" />
      </aside>
    </section>
  </div>
);

export default SupportJourney;
