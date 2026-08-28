import { environmentConfig } from "./recommendationConfig";
import type { LearningRecommendation } from "./recommendationTypes";

export const RecommendationPractical = ({
  recommendation,
}: {
  recommendation: LearningRecommendation;
}) => {
  const primary = environmentConfig[recommendation.environment.primary];
  const secondary = recommendation.environment.secondary
    ? environmentConfig[recommendation.environment.secondary]
    : null;

  return (
    <>
      <section className="recommendation-practical" aria-labelledby="at-da-heading">
        <h2 id="at-da-heading">WHAT THIS COULD LOOK LIKE AT DA</h2>
        <p>{primary.description}</p>
        <div className="recommendation-practical__characteristics">
          {primary.practicalCharacteristics.map((characteristic) => (
            <article key={characteristic.label}>
              <h3>{characteristic.label}</h3>
              <p>{characteristic.description}</p>
            </article>
          ))}
        </div>
        {secondary ? (
          <aside className="recommendation-practical__secondary" data-secondary-recommendation>
            <p>ALSO WORTH EXPLORING</p>
            <h3>{secondary.label}</h3>
            <span>{secondary.reasons[0]}</span>
          </aside>
        ) : null}
      </section>

      <section className="recommendation-formats" id="all-learning-formats" aria-labelledby="all-formats-heading">
        <h2 id="all-formats-heading">EXPLORE ALL LEARNING FORMATS</h2>
        <p>The recommendation is a starting point. These environments remain open for comparison.</p>
        <div>
          {Object.values(environmentConfig).map((environment) => (
            <article key={environment.id}>
              <h3>{environment.label}</h3>
              <p>{environment.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recommendation-confirmation" aria-labelledby="starting-point-heading">
        <h2 id="starting-point-heading">THIS IS A STARTING POINT.</h2>
        <p>
          The best learning environment depends on more than five answers. We&apos;ll listen to your concerns,
          understand your child&apos;s needs and confirm the right fit together.
        </p>
        <div>
          <a href="/book-interview">BOOK AN INTERVIEW</a>
          <a href="#all-learning-formats">COMPARE ALL FORMATS</a>
        </div>
      </section>
    </>
  );
};
