import { LearningEnvironmentDestination } from "./LearningEnvironmentDestination";
import type { EnvironmentId, LearningRecommendation } from "./recommendationTypes";
import "./recommendation-journey.css";

export type RecommendationRevealPhase =
  | "hidden"
  | "quiet"
  | "memory"
  | "path"
  | "destinations"
  | "resolve"
  | "arrived"
  | "direction"
  | "editorial";

interface RecommendationJourneyProps {
  recommendation: LearningRecommendation;
  phase: RecommendationRevealPhase;
}

export const environmentOrder: readonly EnvironmentId[] = [
  "private",
  "small-group",
  "class",
];

export const RecommendationJourney = ({
  recommendation,
  phase,
}: RecommendationJourneyProps) => (
  <section
    className="recommendation-journey"
    data-recommendation-journey
    data-primary-environment={recommendation.environment.primary}
    data-reveal-phase={phase}
    aria-labelledby="recommendation-heading"
    aria-hidden={phase === "hidden"}
  >
    <div className="recommendation-journey__memory" aria-hidden="true">
      {["01", "02", "03", "04", "05"].map((marker) => (
        <span key={marker} data-result-memory-marker>{marker}<i /></span>
      ))}
    </div>
    <div className="recommendation-journey__route" data-recommendation-route aria-hidden="true">
      <span />
      <b data-primary-route />
    </div>
    <div className="recommendation-journey__destinations" data-recommendation-destinations>
      {environmentOrder.map((environment) => (
        <LearningEnvironmentDestination
          key={environment}
          environment={environment}
          state={
            environment === recommendation.environment.primary
              ? "primary"
              : environment === recommendation.environment.secondary
                ? "secondary"
                : "distant"
          }
        />
      ))}
    </div>
    <p className="sr-only" role="status" data-recommendation-status>
      Your suggested starting pathway is ready.
    </p>
  </section>
);
