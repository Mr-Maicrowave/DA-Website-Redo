import { RecommendationHero } from "./RecommendationHero";
import { RecommendationPractical } from "./RecommendationPractical";
import { RecommendationReasons } from "./RecommendationReasons";
import type { LearningRecommendation } from "./recommendationTypes";
import "./recommendation-result.css";

export const RecommendationResult = ({
  recommendation,
  visible,
}: {
  recommendation: LearningRecommendation;
  visible: boolean;
}) => (
  <section
    className="recommendation-result"
    id="learning-pathway-result"
    data-recommendation-result
    data-result-visible={visible ? "true" : "false"}
    aria-hidden={!visible}
  >
    <RecommendationHero recommendation={recommendation} />
    <RecommendationReasons recommendation={recommendation} />
    <RecommendationPractical recommendation={recommendation} />
  </section>
);
