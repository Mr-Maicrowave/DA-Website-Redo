import { directionConfig, environmentConfig } from "./recommendationConfig";
import type { LearningRecommendation } from "./recommendationTypes";

export const RecommendationHero = ({
  recommendation,
}: {
  recommendation: LearningRecommendation;
}) => {
  const environment = environmentConfig[recommendation.environment.primary];
  const direction = directionConfig[recommendation.direction.primary];

  return (
    <header className="recommendation-result__hero">
      <p className="recommendation-result__label">YOUR LEARNING ENVIRONMENT</p>
      <p className="recommendation-result__guidance">
        Based on what you&apos;ve told us, we&apos;d explore
      </p>
      <h2 id="recommendation-heading" data-recommendation-heading tabIndex={-1}>
        {environment.label}
      </h2>
      <p className="recommendation-result__tagline">{environment.tagline}</p>
      <span className="recommendation-result__first">first.</span>

      <div className="recommendation-result__direction" data-direction-reveal>
        <span aria-hidden="true" />
        <p>LEARNING DIRECTION</p>
        <h3>{direction.label}</h3>
        <em>{direction.tagline}</em>
      </div>

      <div className="recommendation-result__pathway" data-starting-pathway>
        <p>YOUR STARTING PATHWAY</p>
        <div>
          <strong>{environment.label}</strong>
          <span aria-label="paired with">×</span>
          <strong>{direction.label}</strong>
        </div>
        <p>{recommendation.combination.summary}</p>
      </div>
    </header>
  );
};
