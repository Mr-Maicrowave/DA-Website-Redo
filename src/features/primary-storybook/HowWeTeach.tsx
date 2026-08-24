import { referenceStoryAssets, teachingSteps } from './referenceStoryData';

const HowWeTeach = () => (
  <section
    id="pathway"
    className="primary-reference-teaching"
    aria-labelledby="pathway-title"
    data-primary-reference-section="pathway"
  >
    <header className="primary-reference-teaching__header">
      <p>One clear step at a time</p>
      <h2 id="pathway-title">How we teach</h2>
      <span>Clear teaching, guided practice and independent confidence make every lesson count.</span>
    </header>

    <div className="primary-reference-teaching__journey">
      <img
        className="primary-reference-teaching__path"
        src={referenceStoryAssets.teachingPath}
        alt=""
        aria-hidden="true"
      />
      <ol>
        {teachingSteps.map((step) => (
          <li key={step.number}>
            <figure>
              <div className="primary-reference-teaching__photo">
                <img src={step.photo.src} alt={step.photo.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span aria-hidden="true">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowWeTeach;
