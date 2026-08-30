import { environmentConfig } from "./recommendationConfig";
import type { LearningRecommendation } from "./recommendationTypes";

export const RecommendationReasons = ({
  recommendation,
}: {
  recommendation: LearningRecommendation;
}) => {
  const environment = environmentConfig[recommendation.environment.primary];

  return (
    <section className="recommendation-reasons" id="why-this-path" aria-labelledby="why-this-path-heading">
      <h2 id="why-this-path-heading">WHY THIS PATH MAY FIT</h2>
      <div className="recommendation-reasons__observations">
        {recommendation.observations.map((observation) => (
          <article key={observation.key} data-answer-observation>
            <span>{observation.label}</span>
            <p>{observation.value}</p>
          </article>
        ))}
        <i aria-hidden="true" />
      </div>
      <div className="recommendation-reasons__explanation">
        <h3>WHY WE&apos;D EXPLORE {environment.shortLabel.toUpperCase()} FIRST</h3>
        <ul>
          {recommendation.environment.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
